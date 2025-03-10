"use client";

import { cn } from "@nuvolari/lib/utils";
import { Icons } from "../../../components/icons";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@nuvolari/components/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

export const ScoreCard = () => {
  const chartData = [
    { type: "Balanced", score: 186 },
    { type: "Degen", score: 305 },
    { type: "Saver", score: 237 },
  ];

  return (
    <div
      className={cn(
        "flex justify-between bg-center bg-cover rounded-[20px] p-3"
      )}
      style={{
        backgroundImage: `url('/images/cloth_02.jpg')`,
      }}
    >
      <div className="relative w-full sm:w-max">
        <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 rounded-[20px]" />
        <div className={cn("relative z-20 p-4")}>
          <div className={cn("mb-10")}>
            <div className="flex items-center gap-1">
              <Icons.logo className="fill-white h-4 w-4" />
              <span className="text-white">Nuvolari Score</span>
            </div>
          </div>

          <div className="flex items-start text-white gap-2">
            <span className="text-5xl">468</span>
            <span className="text-2xl">pts</span>
          </div>

          <span className="text-[#FFFFFF80]">Based on your chain history</span>
        </div>
      </div>

      <div className="relative hidden sm:block">
        <div
          className={cn(
            "absolute inset-0 z-10 m-auto backdrop-blur-md bg-black/20 rounded-full",
            "aspect-square h-3/4"
          )}
        />
        <ChartContainer
          config={{
            desktop: {
              label: "Score",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="relative z-20 w-[300px] h-full text-black -mb-10"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid
              gridType="circle"
              fill="black"
              enableBackground={"black"}
            />
            <PolarAngleAxis dataKey="type" />
            <Radar
              dataKey="score"
              fill="#AEA1FF"
              fillOpacity={0.8}
              dot={{
                r: 4,
                fill: "white",
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
