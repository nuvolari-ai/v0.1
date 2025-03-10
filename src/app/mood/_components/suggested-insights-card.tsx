"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@nuvolari/lib/utils";
import { Lightbulb, Loader2 } from "lucide-react";
import { Skeleton } from "@nuvolari/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@nuvolari/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { InsightCard } from "@nuvolari/components/insight-card";
import { api as trpc } from "@nuvolari/trpc/react";
import { useAccount } from "wagmi";

export const SuggestedInsightsCard = () => {
  const { address } = useAccount();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  // Fetch pending insights
  const { data: insights, isLoading } = trpc.insight.getPendingInsights.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    // Get the current length of slides
    const updateCount = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    // Update initial count and current
    updateCount();

    // Event listeners for carousel
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    const onResize = updateCount;

    // Register listeners
    api.on("select", onSelect);
    api.on("resize", onResize);

    // Cleanup
    return () => {
      api.off("select", onSelect);
      api.off("resize", onResize);
    };
  }, [api, insights]);

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // If we have no insights
  const renderEmptyState = () => (
    <CarouselItem className="basis-full">
      <div
        className={cn(
          "bg-black/60 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4 mx-4",
          "h-[128px] flex flex-col justify-center items-center rounded-[20px] text-white"
        )}
      >
        <Lightbulb className="h-5 w-5 mb-2 text-white/50" />
        <span className="text-sm text-white/70 text-center">
          No insights available at the moment
        </span>
      </div>
    </CarouselItem>
  );

  // If we're loading insights
  const renderLoadingState = () => (
    <>
      {[1, 2, 3].map((i) => (
        <CarouselItem key={`skeleton-${i}`} className="pl-2 basis-2/3">
          <div
            className={cn(
              "bg-black/60 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
              "h-[128px] rounded-[20px]"
            )}
          >
            <Skeleton loading={true} className="h-4 w-32 mb-4" />
            <Skeleton loading={true} className="h-12 w-full mt-8" />
          </div>
        </CarouselItem>
      ))}
    </>
  );

  return (
    <div className="bg-black/40 py-3 flex flex-col gap-4 rounded-[20px]">
      <div className="px-3">
        <div className="text-white/70 flex items-center gap-1">
          <Lightbulb className="h-4 w-4" />
          <span className="text-[12px]">Suggested Insights</span>
        </div>
      </div>
      <Carousel
        opts={{ align: "center", loop: insights && insights.length > 1 }}
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {isLoading ? (
            renderLoadingState()
          ) : !insights || insights.length === 0 ? (
            renderEmptyState()
          ) : (
            insights.map((insight, index) => (
              <CarouselItem
                key={insight.id}
                className={cn(
                  insights.length === 1 ? "basis-full pl-0 mx-4" : "pl-2 basis-2/3", 
                  "opacity-50 transition-opacity",
                  {
                    "opacity-100": current === index + 1,
                  }
                )}
              >
                <InsightCard insight={insight} compact={true} />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        {/* Fixed height container for dots to prevent layout shift */}
        <div className="h-6 flex items-center justify-center">
          {count > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-1 h-1 rounded-full transition-all ${
                    index === current - 1 ? "bg-white" : "bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Carousel>
    </div>
  );
};