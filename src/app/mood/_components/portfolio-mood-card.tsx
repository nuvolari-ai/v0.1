"use client";

import { cn } from "@nuvolari/lib/utils";
import { Smile } from "lucide-react";

type MoodOption = {
  id: number;
  label: string;
  color: string;
};

const moodOptions: MoodOption[] = [
  { id: 0, label: "Degen", color: "#FF8F44" },
  { id: 2, label: "Balanced", color: "#AEA1FF" },
  { id: 1, label: "Saver", color: "#1DBEAD" },
];

export const PortfolioMoodCard = ({
  activeMoodId = 2, // Default to "Balanced"
  isLoading = false,
  isEmpty = false,
}: {
  activeMoodId?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="bg-black/40 p-3 flex flex-col gap-4 rounded-[20px] animate-pulse">
        <div className="text-white/70 flex items-center gap-1">
          <div className="h-4 w-4 bg-white/30 rounded-full" />
          <div className="h-3 w-24 bg-white/30 rounded-full" />
        </div>
        <div className="flex justify-center gap-4 h-8">
          <div className="h-full w-16 bg-white/30 rounded-full" />
          <div className="h-full w-20 bg-white/30 rounded-full" />
          <div className="h-full w-16 bg-white/30 rounded-full" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-black/40 p-3 flex flex-col gap-4 rounded-[20px]">
        <div className="text-white/70 flex items-center gap-1">
          <Smile className="h-4 w-4" />
          <span className="text-[12px]">Portfolio mood</span>
        </div>
        <div className="flex justify-center items-center h-8 text-white/50 text-sm">
          No mood data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-3 flex flex-col gap-4 rounded-[20px]">
      <div className="text-white/70 flex items-center gap-1">
        <Smile className="h-4 w-4" />
        <span className="text-[12px]">Portfolio mood</span>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-hidden relative">
        {moodOptions.map((option) => (
          <div
            key={option.id}
            className={cn(
              "transition-all duration-200 text-white text-sm py-2 px-4 rounded-full",
              {
                "opacity-100 scale-100": activeMoodId === option.id,
                "opacity-40 scale-75": activeMoodId !== option.id,
              }
            )}
            style={{
              backgroundColor: option.color,
              filter: activeMoodId !== option.id ? "brightness(70%)" : "none"
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};