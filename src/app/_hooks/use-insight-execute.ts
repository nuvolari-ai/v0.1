import { api, Insight } from "@nuvolari/trpc/react";
import { EnsoAPIClient } from "@nuvolari/agents/tools/enso/api";
import { useCallback, useEffect, useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { getAddress, parseUnits, isAddress } from "viem";
import { useReadErc20Allowance } from "@nuvolari/generated";
import { useWriteErc20Approve } from "@nuvolari/generated";
import { ENSO_ROUTER_ADDRESS } from "@nuvolari/constants/enso";
import { useOdosSwap } from "@nuvolari/app/_hooks/use-odos-swap";

// Ensure API key exists
const ENSO_API_KEY = process.env.NEXT_PUBLIC_ENVO_API_KEY;
if (!ENSO_API_KEY) {
  console.warn("NEXT_PUBLIC_ENVO_API_KEY is not set. Enso API calls may fail.");
}
const ensoApi = new EnsoAPIClient(ENSO_API_KEY ?? '');

export type InsightExecutionState = {
  isExecuting: boolean;     // Whether the execution process is in progress
  isApproving: boolean;     // Whether token approval is in progress
  isRouting: boolean;       // Whether getting route data is in progress
  error: Error | null;      // Any error that occurred
  tx: `0x${string}` | null; // Transaction hash if available
  receipt: any;             // Transaction receipt if available
};

export type InsightExecuteResult = InsightExecutionState & {
  executeInsight: () => Promise<void>;   // Function to execute the insight
  resetExecution: () => void;            // Function to reset execution state
};

/**
 * A hook for executing an insight with proper error handling and state management
 * 
 * @param insight The insight to execute
 * @returns Object containing execution state and functions
 */
export const useInsightExecute = (insight: Insight): InsightExecuteResult => {
  const { address } = useAccount();
  const [state, setState] = useState<InsightExecutionState>({
    isExecuting: false,
    isApproving: false,
    isRouting: false,
    error: null,
    tx: null,
    receipt: null
  });

  const {
    mutateAsync: invokeNuvolari,
    isPending: isInvokingNuvolari
  } = api.llm.invokeNuvolari.useMutation();

  // Use Odos swap hook for TOKEN_OPPORTUNITY insights
  const {
    isExecuting: isOdosExecuting,
    isApproving: isOdosApproving,
    isRouting: isOdosRouting,
    error: odosError,
    tx: odosTx,
    receipt: odosReceipt,
    executeSwap,
    resetExecution: resetOdosExecution
  } = useOdosSwap(insight);

  // Token approval data for YIELD_POOL insights (Enso)
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance
  } = useReadErc20Allowance({
    address: isAddress(insight.tokenInId) ? getAddress(insight.tokenInId) : undefined,
    args: address && isAddress(insight.tokenInId) ? [
      address as `0x${string}`,
      ENSO_ROUTER_ADDRESS,
    ] : undefined,
  });

  // Token approval function
  const { 
    writeContractAsync: approveToken,
    isPending: isApprovePending 
  } = useWriteErc20Approve();

  // Transaction execution
  const { 
    sendTransactionAsync,
    isPending: isSendPending
  } = useSendTransaction();

  // Transaction receipt
  const { 
    data: receipt,
    isLoading: isLoadingReceipt 
  } = useWaitForTransactionReceipt({
    chainId: 146,
    hash: state.tx || undefined,
  });

  // Mark insight as executed in backend
  const { 
    mutateAsync: markInsightAsExecuted,
    isPending: isMarkingExecuted
  } = api.insight.markInsightAsExecuted.useMutation();

  // Reset execution state
  const resetExecution = useCallback(() => {
    setState({
      isExecuting: false,
      isApproving: false,
      isRouting: false,
      error: null,
      tx: null,
      receipt: null
    });
    
    // Also reset Odos execution state if applicable
    if (insight.type === 'TOKEN_OPPORTUNITY') {
      resetOdosExecution();
    }
  }, [insight.type, resetOdosExecution]);

  // Sync Odos state with main state
  useEffect(() => {
    if (insight.type === 'TOKEN_OPPORTUNITY') {
      setState({
        isExecuting: isOdosExecuting,
        isApproving: isOdosApproving,
        isRouting: isOdosRouting,
        error: odosError,
        tx: odosTx,
        receipt: odosReceipt
      });
    }
  }, [
    insight.type,
    isOdosExecuting,
    isOdosApproving,
    isOdosRouting,
    odosError,
    odosTx,
    odosReceipt
  ]);

  // Main execution function
  const executeInsight = useCallback(async () => {
    // For TOKEN_OPPORTUNITY insights, use Odos
    if (insight.type === 'TOKEN_OPPORTUNITY') {
      await executeSwap();
      return;
    }
    
    // For other insights (YIELD_POOL), use Enso
    // Safety checks
    if (!address) {
      const error = new Error('Wallet not connected');
      setState(prev => ({ ...prev, error }));
      return;
    }

    if (!insight) {
      const error = new Error('No insight provided');
      setState(prev => ({ ...prev, error }));
      return;
    }

    if (state.isExecuting) {
      return; // Prevent multiple executions
    }

    try {
      setState(prev => ({ 
        ...prev, 
        isExecuting: true,
        error: null
      }));

      // Determine token out
      const tokenOut = insight.poolOut?.receiptTokenId ?? insight.tokenOutId;
      if (!tokenOut || !isAddress(tokenOut)) {
        throw new Error('Invalid output token address');
      }

      if (!isAddress(insight.tokenInId)) {
        throw new Error('Invalid input token address');
      }

      // Parse amount with decimal validation
      let amountInWei: bigint;
      try {
        amountInWei = parseUnits(
          insight.tokenInAmount, 
          insight.tokenInDecimals || 18
        );
      } catch (error) {
        throw new Error(`Invalid amount: ${insight.tokenInAmount}`);
      }

      // Get route data
      setState(prev => ({ ...prev, isRouting: true }));
      const data = await ensoApi.getRouteShortcutTransaction({
        chainId: 146,
        fromAddress: address as `0x${string}`,
        receiver: address as `0x${string}`,
        spender: address as `0x${string}`,
        slippage: '300',
        tokenIn: [getAddress(insight.tokenInId)],
        tokenOut: [getAddress(tokenOut)],
        amountIn: [amountInWei.toString()],
      });
      setState(prev => ({ ...prev, isRouting: false }));

      if (!data || !data.tx) {
        throw new Error('Failed to get route data');
      }

      // Check if token is native ETH
      const isNative = getAddress(insight.tokenInId) === getAddress('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') && BigInt(data.tx.value) > 0n;
      
      // Handle token approval if needed
      if (!isNative) {
        const currentAllowance = BigInt(allowance ?? 0n);
        
        if (currentAllowance < amountInWei) {
          setState(prev => ({ ...prev, isApproving: true }));
          
          try {
            await approveToken({
              address: getAddress(insight.tokenInId),
              args: [
                ENSO_ROUTER_ADDRESS,
                amountInWei,
              ],
            });
            
            // Refetch allowance to confirm approval
            await refetchAllowance();
          } catch (error) {
            throw new Error(`Token approval failed: ${(error as Error).message}`);
          } finally {
            setState(prev => ({ ...prev, isApproving: false }));
          }
        }
      }

      // Execute transaction
      const txHash = await sendTransactionAsync({
        to: getAddress(data.tx.to),
        value: BigInt(data.tx.value),
        data: data.tx.data as `0x${string}`,
        gas: BigInt(data.gas || '0'),
      });

      // Update state with transaction hash
      setState(prev => ({ ...prev, tx: txHash }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error(String(error)),
        isExecuting: false,
        isApproving: false,
        isRouting: false
      }));
    }
  }, [
    insight, 
    state.isExecuting, 
    address, 
    allowance, 
    approveToken, 
    refetchAllowance, 
    sendTransactionAsync,
    executeSwap
  ]);

  // Handle receipt updates
  useEffect(() => {
    if (receipt && state.tx) {
      // Update state with receipt
      setState(prev => ({ ...prev, receipt }));
      
      // Mark insight as executed in backend
      if (address) {
        markInsightAsExecuted({
          insightId: insight.id,
          userAddress: address as `0x${string}`,
          executionTxHash: receipt.transactionHash,
        })
        .catch(error => {
          console.error("Failed to mark insight as executed:", error);
        })
        .finally(() => {
          invokeNuvolari({
            address: address as `0x${string}`,
            forceGenerate: true,
          });
        });
      }
    }
  }, [receipt, state.tx, address, insight.id, markInsightAsExecuted, invokeNuvolari]);

  // Update loading state for YIELD_POOL insights only
  useEffect(() => {
    if (insight.type !== 'TOKEN_OPPORTUNITY') {
      setState(prev => ({
        ...prev,
        isExecuting: prev.isRouting || prev.isApproving || isApprovePending || isSendPending || isLoadingReceipt || isMarkingExecuted
      }));
    }
  }, [
    insight.type,
    isApprovePending,
    isSendPending,
    isLoadingReceipt,
    isMarkingExecuted
  ]);

  return {
    ...state,
    executeInsight,
    resetExecution
  };
};