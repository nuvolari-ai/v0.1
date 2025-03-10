"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@nuvolari/lib/utils";
import { Lightbulb } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@nuvolari/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const SuggestedInsightsCard = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="bg-black/40 py-3 flex flex-col gap-4 rounded-[20px]">
      <div className="px-3">
        <div className="text-white/70 flex items-center gap-1">
          <Lightbulb className="h-4 w-4" />
          <span className="text-[12px]">Suggested Insights</span>
        </div>
      </div>
      <Carousel
        opts={{ align: "center", loop: true }}
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="">
          <CarouselItem
            className={cn("pl-2 basis-2/3 opacity-50 transition-opacity", {
              "opacity-100": current === 1,
            })}
          >
            <div
              className={cn(
                "bg-black/60 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
                " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
              )}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm">
                Swap 18.6 ETH to USDC to optimize portfolio
              </span>
            </div>
          </CarouselItem>
          <CarouselItem
            className={cn("pl-2 basis-2/3 opacity-50 transition-opacity", {
              "opacity-100": current === 2,
            })}
          >
            <div
              className={cn(
                "bg-black/60 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
                " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
              )}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm">
                Swap 18.6 ETH to USDC to optimize portfolio
              </span>
            </div>
          </CarouselItem>
          <CarouselItem
            className={cn("pl-2 basis-2/3 opacity-50 transition-opacity", {
              "opacity-100": current === 3,
            })}
          >
            <div
              className={cn(
                "bg-black/60 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
                " h-[128px] flex flex-col justify-between rounded-[20px] text-white"
              )}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm">
                Swap 18.6 ETH to USDC to optimize portfolio
              </span>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-1 h-1 rounded-full transition-all ${
                index === current - 1 ? "bg-white" : "bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
