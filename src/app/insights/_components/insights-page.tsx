"use client";

import { InsightCommand } from "./insight-command";
import { InsightCard } from "@nuvolari/components/insight-card";
import { api as trpc } from "@nuvolari/trpc/react";
import { useModal } from "@nuvolari/components/modal-provider";
import { useAccount } from "wagmi";
import { useMemo } from "react";

export const InsightsPage = () => {
  const { openInsightModal } = useModal();
  const { address } = useAccount();
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

  const {
    data: tokenInsight,
    isLoading: tokenInsightLoading,
  } = trpc.tokens.getComputedTokenInsight.useQuery({
    address: address ?? '',
    tokenIn: '0x541FD749419CA806a8bc7da8ac23D346f2dF8B77',
    tokenOut: '0x79bbF4508B1391af3A0F4B30bb5FC4aa9ab0E07C',
  }, {
    enabled: !!address,
  });

  console.log(tokenInsight, '....... token insight');


  return (
      <main className="flex-grow flex flex-col items-center px-4 py-4">
      <section className="flex flex-col items-center gap-1 text-white tracking-normal mb-4">
        <h1 className="text-[28px] font-semibold ">Insights</h1>
        <p className="opacity-50 text-[12px]">
          Get insights or search your on-chain task
        </p>
      </section>

      <section className="w-full max-w-3xl">
        <InsightCommand tokens={tokens ?? []} />
      </section>
      <section className="grid grid-cols-3 md:grid-cols-3 gap-2 max-w-3xl mt-4">
        {insights?.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>
    </main>
  );
};
