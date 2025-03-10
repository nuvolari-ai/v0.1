"use client";

import { cn } from "@nuvolari/lib/utils";
import { SuggestedInsightsCard } from "./suggested-insights-card";
import { PortfolioMoodCard } from "./portfolio-mood-card";
import { AddWidgetCard } from "./add-widget-card";
import { ScoreCard } from "./score-card";
import { BalanceCard } from "./balance-card";
import { MenuBar } from "@nuvolari/app/_components/menu-bar";


export const MoodPage = () => {
  return (
    <main className="max-w-xl mx-auto flex flex-col justify-center items-center">
      <MenuBar />
      <section className="flex flex-col items-center gap-2 text-white tracking-normal mb-8">
        <h1 className="text-[28px] font-semibold ">Mood</h1>
        <p className="opacity-50 text-[12px]">
          Reality check of your portfolio in one glance
        </p>
      </section>

      <section className={cn("grid grid-cols-1 gap-2 md:grid-cols-2")}>
        <div className="col-span-full">
          <ScoreCard />
        </div>
        <div className="col-span-full md:col-span-1 md:row-span-2">
          <BalanceCard />
        </div>
        <div className="col-span-full md:col-span-1 ">
          <SuggestedInsightsCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <PortfolioMoodCard />
          {/* <AddWidgetCard /> */}
          <AddWidgetCard />
        </div>
      </section>
    </main>
  );
};
