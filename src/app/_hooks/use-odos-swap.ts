import { Insight } from "@prisma/client";
import { useState, useCallback, useEffect } from "react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { getAddress, parseUnits, isAddress } from "viem";
import { useReadErc20Allowance } from "@nuvolari/generated";
import { useWriteErc20Approve } from "@nuvolari/generated";
import { TokenSwapService } from "@nuvolari/agents/tools/odos/swap-service";
import { api } from "@nuvolari/trpc/react";

// Initialize the TokenSwapService
const odosSwapService = new TokenSwapService();

export type SwapExecutionState = {
  isExecuting: boolean;     // Whether the execution process is in progress
  isApproving: boolean;     // Whether token approval is in progress
  isRouting: boolean;       // Whether getting route data is in progress
  error: Error | null;      // Any error that occurred
  tx: `0x${string}` | null; // Transaction hash if available
  receipt: any;             // Transaction receipt if available
};

export type SwapExecuteResult = SwapExecutionState & {
  executeSwap: () => Promise<void>;   // Function to execute the swap
  resetExecution: () => void;         // Function to reset execution state
};

/**
 * A hook for executing a token swap using Odos with proper error handling and state management
 * 
 * @param insight The TOKEN_OPPORTUNITY insight to execute
 * @returns Object containing execution state and functions
 */
export const useOdosSwap = (insight: Insight): SwapExecuteResult => {
  const { address } = useAccount();
  const [state, setState] = useState<SwapExecutionState>({
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

  // Get router address for Odos (could be stored in constants similar to ENSO_ROUTER_ADDRESS)
  // For now, we'll use the address from the transaction we receive
  const [routerAddress, setRouterAddress] = useState<`0x${string}` | undefined>(undefined);

  // Token approval data
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance
  } = useReadErc20Allowance({
    address: isAddress(insight.tokenInId) ? getAddress(insight.tokenInId) : undefined,
    args: address && isAddress(insight.tokenInId) && routerAddress ? [
      address as `0x${string}`,
      routerAddress,
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
  }, []);

  // Main execution function
  const executeSwap = useCallback(async () => {
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

    if (insight.type !== 'TOKEN_OPPORTUNITY') {
      const error = new Error('Not a token opportunity insight');
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

      // Validate tokenOut
      if (!insight.tokenOutId || !isAddress(insight.tokenOutId)) {
        throw new Error('Invalid output token address');
      }

      if (!isAddress(insight.tokenInId)) {
        throw new Error('Invalid input token address');
      }

      const chainId = 146

      // Get route data
      setState(prev => ({ ...prev, isRouting: true }));
      const { transaction, expectedOutput } = await odosSwapService.executeSwapFromInsight(
        insight,
        address as `0x${string}`,
        chainId,
        insight.tokenInAmount
      );
      setState(prev => ({ ...prev, isRouting: false }));

      if (!transaction) {
        throw new Error('Failed to get route data');
      }

      // Store the router address for token approval
      setRouterAddress(getAddress(transaction.to) as `0x${string}`);

      // Check if token is native ETH
      const isNative = getAddress(insight.tokenInId) === getAddress('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') && BigInt(transaction.value) > 0n;
      
      // Handle token approval if needed
      if (!isNative) {
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
        
        const currentAllowance = BigInt(allowance ?? 0n);
        
        if (currentAllowance < amountInWei) {
          setState(prev => ({ ...prev, isApproving: true }));
          
          try {
            await approveToken({
              address: getAddress(insight.tokenInId),
              args: [
                getAddress(transaction.to) as `0x${string}`,
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
        to: getAddress(transaction.to) as `0x${string}`,
        value: BigInt(transaction.value || '0'),
        data: transaction.data as `0x${string}`,
        gas: BigInt(transaction.gas || '0'),
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
    address, 
    insight, 
    state.isExecuting, 
    allowance, 
    approveToken, 
    refetchAllowance, 
    sendTransactionAsync
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

  // Update loading state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isExecuting: prev.isRouting || prev.isApproving || isApprovePending || isSendPending || isLoadingReceipt || isMarkingExecuted
    }));
  }, [
    isApprovePending,
    isSendPending,
    isLoadingReceipt,
    isMarkingExecuted
  ]);

  return {
    ...state,
    executeSwap,
    resetExecution
  };
};