"use client";

import { InsightCommand } from "./insight-command";
import { InsightCard } from "@nuvolari/components/insight-card";
import { api as trpc } from "@nuvolari/trpc/react";
import { useModal } from "@nuvolari/components/modal-provider";
import { useAccount } from "wagmi";
export const InsightsPage = () => {
  const { openInsightModal } = useModal();
  const { address } = useAccount();
  const { data: insights, isLoading } = trpc.insight.getPendingInsights.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });


  return (
      <main className="flex-grow flex flex-col items-center px-4 py-4">
      <section className="flex flex-col items-center gap-1 text-white tracking-normal mb-4">
        <h1 className="text-[28px] font-semibold ">Insights</h1>
        <p className="opacity-50 text-[12px]">
          Get insights or search your on-chain task
        </p>
      </section>

      <section className="w-full max-w-3xl">
        <InsightCommand />
      </section>
      <section className="grid grid-cols-3 md:grid-cols-3 gap-2 max-w-3xl mt-4">
        {insights?.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>
    </main>
  );
};
