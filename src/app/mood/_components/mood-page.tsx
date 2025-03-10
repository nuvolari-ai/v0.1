"use client";
import { MenuBar } from "@nuvolari/app/_components/menu-bar";
import { SuggestedInsightsCard } from "./suggested-insights-card";
import { PortfolioMoodCard } from "./portfolio-mood-card";
import { AddWidgetCard } from "./add-widget-card";
import { ScoreCard } from "./score-card";
import { BalanceCard } from "./balance-card";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { api } from "@nuvolari/trpc/react";

export const MoodPage = () => {
  const { address } = useAccount();

  const {mutate} = api.llm.invokeNuvolari.useMutation();

  api.insight.getPendingInsights.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
    refetchInterval: 30000,
  });
  
  useEffect(() => {
    if (address) {
      mutate({
        address: address,
        forceGenerate: true,
      });
    }
  }, [address]);

  return (
      <main className="flex-grow flex flex-col items-center px-4 py-4">
        <section className="flex flex-col items-center gap-1 text-white tracking-normal mb-4">
          <h1 className="text-2xl font-semibold">Mood</h1>
          <p className="opacity-50 text-xs">
            Reality check of your portfolio in one glance
          </p>
        </section>
        
        <section className="w-full max-w-3xl grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Score Card - Full width */}
          <div className="col-span-full">
            <ScoreCard />
          </div>
          
          {/* Balance Card - Left side on desktop */}
          <div className="col-span-full md:col-span-6">
            <BalanceCard />
          </div>
          
          {/* Right side column container */}
          <div className="col-span-full md:col-span-6 flex flex-col gap-3">
            {/* Suggested Insights Card */}
            <div>
              <SuggestedInsightsCard />
            </div>
            
            {/* Bottom two cards in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PortfolioMoodCard />
              <AddWidgetCard />
            </div>
          </div>
        </section>
      </main>
  );
};
