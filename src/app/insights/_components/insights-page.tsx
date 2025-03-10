"use client";

import { MenuBar } from "@nuvolari/app/_components/menu-bar";
import { InsightCommand } from "./insight-command";
import { Button } from "@nuvolari/components/ui/button";
import { ArrowLeftRight, Lightbulb, Percent, Star } from "lucide-react";
import { cn } from "@nuvolari/lib/utils";

export const InsightsPage = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="w-full max-w-[720px] mx-auto px-4">
        <MenuBar />
      </div>
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
        <div
          className={cn(
            "bg-black/40 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
            " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
          )}
        >
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm">
            Swap 18.6 ETH to USDC to optimize portfolio
          </span>
        </div>
        <div
          className={cn(
            "bg-black/40 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
            " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
          )}
        >
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm">
            Swap 18.6 ETH to USDC to optimize portfolio
          </span>
        </div>
        <div
          className={cn(
            "bg-black/40 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
            " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
          )}
        >
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm">
            Swap 18.6 ETH to USDC to optimize portfolio
          </span>
        </div>
        <div
          className={cn(
            "bg-black/40 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
            " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
          )}
        >
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm">
            Swap 18.6 ETH to USDC to optimize portfolio
          </span>
        </div>
        <div
          className={cn(
            "bg-black/40 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
            " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
          )}
        >
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm">
            Swap 18.6 ETH to USDC to optimize portfolio
          </span>
        </div>
      </section>
    </main>
    </div>
  );
};
