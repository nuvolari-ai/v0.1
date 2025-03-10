"use client";

import { useState } from "react";
import { cn } from "@nuvolari/lib/utils";
import { Smile } from "lucide-react";

export const PortfolioMoodCard = () => {
  const [current, setCurrent] = useState(1);

  return (
    <div className="bg-black/40 p-3 flex flex-col gap-4 rounded-[20px]">
      <div className="text-white/70 flex items-center gap-1">
        <Smile className="h-4 w-4" />
        <span className="text-[12px]">Portfolio mood</span>
      </div>

      <div className="flex items-baseline gap-1 text-white overflow-x-hidden w-full">
        <div
          className={cn(
            "pl-2 flex-1 opacity-50 transition-all  scale-50",
            "bg-[#FF8F44] px-[12px] py-[6px] rounded-full text-center",
            {
              "opacity-100 scale-100": current === 0,
            }
          )}
        >
          Degen
        </div>
        <div
          className={cn(
            "pl-2 flex-1 opacity-50 transition-all  scale-50",
            " bg-[#1DBEAD] px-[12px] py-[6px] rounded-full text-center",
            {
              "opacity-100 scale-100": current === 1,
            }
          )}
        >
          Saver
        </div>

        <div
          className={cn(
            "pl-2 flex-1 opacity-50 transition-all  scale-50",
            " bg-[#AEA1FF] px-[12px] py-[6px] rounded-full text-center",
            {
              "opacity-100 scale-100": current === 2,
            }
          )}
        >
          Balanced
        </div>
      </div>
    </div>
  );
};
