"use client";

import { MenuBar } from "@nuvolari/app/_components/menu-bar";
import { InsightCommand } from "./insight-command";
import { Button } from "@nuvolari/components/ui/button";
import { ArrowLeftRight, Lightbulb, Percent, Star } from "lucide-react";
import { cn } from "@nuvolari/lib/utils";

export const InsightsPage = () => {
  return (
    <main className="max-w-xl mx-auto flex flex-col justify-center items-center gap-6">
      <MenuBar />
      <section className="flex flex-col items-center gap-2 text-white tracking-normal mb-8">
        <h1 className="text-[28px] font-semibold ">Insights</h1>
        <p className="opacity-50 text-[12px]">
          Get insights or search your on-chain task
        </p>
      </section>

      <section className="w-full">
        <InsightCommand />
      </section>
      <section className="w-full flex gap-1">
        <Button
          variant={"ghost"}
          className={cn(
            "text-white/30 hover:bg-white/5 hover:text-white rounded-full py-1 px-2",
            "text-[12px] h-[24px]"
          )}
        >
          <Star className="w-3 h-3" />
          Favourites
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            "text-white/30 hover:bg-white/5 hover:text-white rounded-full py-1 px-2",
            "text-[12px] h-[24px]"
          )}
        >
          <Percent className="w-3 h-3" /> Yield
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            "text-white/30 hover:bg-white/5 hover:text-white rounded-full py-1 px-2",
            "text-[12px] h-[24px]"
          )}
        >
          <ArrowLeftRight className="w-3 h-3" />
          Swap
        </Button>
      </section>
      <section className="grid grid-cols-3 md:gird-cols-1 gap-2">
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
  );
};
