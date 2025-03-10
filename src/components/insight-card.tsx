import React from 'react';
import { cn } from "@nuvolari/lib/utils";
import { ChevronRight, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Insight } from "@nuvolari/trpc/react";
import { useInsightExecute } from '@nuvolari/app/_hooks/use-insight-execute';
import { useModal } from '@nuvolari/components/modal-provider';

interface InsightCardProps {
  insight: Insight;
  className?: string;
  compact?: boolean; // For carousel usage
}

export const InsightCard = ({ insight, className, compact = false }: InsightCardProps) => {
  const { openInsightModal } = useModal();
  const { 
    isExecuting, 
    error, 
    receipt, 
    executeInsight,
    resetExecution
  } = useInsightExecute(insight);

  // Get icon based on insight type
  const getTypeIcon = () => {
    switch (insight.type) {
      case 'YIELD_POOL':
        return '/icons/shortcuts/yield.svg';
      case 'TOKEN_OPPORTUNITY':
        return '/icons/shortcuts/swap.svg';
      default:
        return '/icons/shortcuts/swap.svg';
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    if (isExecuting) return <Loader2 className="h-4 w-4 animate-spin text-white" />;
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (receipt) return <Check className="h-4 w-4 text-green-500" />;
    return null;
  };

  const handleCardClick = () => {
    openInsightModal(
      insight, 
      executeInsight,
      { isExecuting, error, receipt }
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-black/60 shadow-[0px_1px_0px_0px_#FFFFFF33_inset] p-4",
        "flex flex-col justify-between rounded-[20px] text-white",
        "cursor-pointer hover:bg-black/70 transition-all",
        compact ? "h-[128px]" : "h-auto min-h-[160px]",
        className
      )}
    >
      {/* Header with icons */}
      <div className="flex items-center mb-2 relative h-6">
        {/* Type icon */}
        <div className="absolute left-0 z-10">
          <img 
            src={getTypeIcon()} 
            alt={insight.type} 
            className="w-5 h-5 rounded-md"
          />
        </div>
        
        {/* Token In icon - overlapped */}
        <div className="absolute left-3 z-20">
          <img 
            src={insight.tokenIn.logosUri[0] || "/icons/placeholder.jpg"} 
            alt={insight.tokenIn.symbol} 
            className="w-5 h-5 rounded-full border border-white/20"
          />
        </div>
        
        {/* Arrow icon */}
        <div className="absolute left-[40px] z-10 flex items-center">
          <ChevronRight className="h-5 w-3 text-white/50" />
        </div>
        
        {/* Token/Pool Out icon - potentially overlapped */}
        <div className="absolute left-[52px] z-20">
          {insight.poolOut ? (
            <img 
              src={insight.poolOut.protocol.logosUri[0] || "/icons/placeholder.jpg"} 
              alt={insight.poolOut.protocol.name} 
              className="w-5 h-5 rounded-full border border-white/20"
            />
          ) : (
            insight.tokenOutId ? (
              <img 
                src="/icons/placeholder.jpg" 
                alt="Token out" 
                className="w-5 h-5 rounded-full border border-white/20"
              />
            ) : null
          )}
        </div>
        
        {/* Status indicator */}
        <div className="absolute right-0 z-30">
          {getStatusIndicator()}
        </div>
      </div>
      
      {/* Insight content */}
      <span className="text-sm">{insight.insightShort}</span>
    </div>
  );
};