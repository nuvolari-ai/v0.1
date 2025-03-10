"use client";

import { InsightCommand } from "./insight-command";
import { InsightCard } from "@nuvolari/components/insight-card";
import { api as trpc } from "@nuvolari/trpc/react";
import { useModal } from "@nuvolari/components/modal-provider";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { InsightAction } from "./steps/step-select-action";
import { InsightAsset } from "./steps/step-select-asset";

export const InsightsPage = () => {
  const { openInsightModal } = useModal();
  const { address } = useAccount();
  
  // Lift only the essential state from InsightCommand
  const [selectedAction, setSelectedAction] = useState<InsightAction | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<InsightAsset | null>(null);
  const [selectedDestinationAsset, setSelectedDestinationAsset] = useState<InsightAsset | null>(null);

  const { data: insights, isLoading } = trpc.insight.getPendingInsights.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: tokens } = trpc.tokens.getTokensByPortfolioAndRisk.useQuery({
    address: address ?? '',
    minRiskScore: 0,
    maxRiskScore: 3,
  }, {
    enabled: !!address,
  });

  // This query will be updated based on selected assets
  const {
    data: tokenInsight,
    isLoading: tokenInsightLoading,
  } = trpc.tokens.getComputedTokenInsight.useQuery({
    address: address ?? '',
    tokenIn: selectedAsset?.address,
    tokenOut: selectedDestinationAsset?.address,
  }, {
    enabled: !!address && !!selectedAsset && !!selectedDestinationAsset && selectedAction?.toLowerCase() === 'swap',
  });

  useEffect(() => {
    if (tokenInsight) {
      openInsightModal(tokenInsight, () => {}, { isExecuting: false, error: null, receipt: null });
    }
  }, [tokenInsight]);

  console.log(tokenInsight, '....... token insight loading');

  // Handle selection from the InsightCommand component
  const handleActionSelect = (action: InsightAction) => {
    setSelectedAction(action);
  };

  const handleAssetSelect = (asset: InsightAsset) => {
    setSelectedAsset(asset);
  };

  const handleDestinationAssetSelect = (asset: InsightAsset) => {
    setSelectedDestinationAsset(asset);
  };

  return (
    <main className="flex-grow flex flex-col items-center px-4 py-4">
      <section className="flex flex-col items-center gap-1 text-white tracking-normal mb-4">
        <h1 className="text-[28px] font-semibold ">Insights</h1>
        <p className="opacity-50 text-[12px]">
          Get insights or search your on-chain task
        </p>
      </section>

      <section className="w-full max-w-3xl">
        <InsightCommand 
          tokens={tokens ?? []}
          onActionSelect={handleActionSelect}
          onAssetSelect={handleAssetSelect}
          onDestinationAssetSelect={handleDestinationAssetSelect}
          selectedAction={selectedAction}
          selectedAsset={selectedAsset}
          selectedDestinationAsset={selectedDestinationAsset}
          insights={[tokenInsight]}
          tokenInsightLoading={tokenInsightLoading}
        />
      </section>
      <section className="grid grid-cols-3 md:grid-cols-3 gap-2 max-w-3xl mt-4">
        {insights?.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>
    </main>
  );
};
