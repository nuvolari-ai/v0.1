"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@nuvolari/lib/utils";

export type Tab = {
  id: string;
  label: string;
};

export type SegmentedControlProps = {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
};

export const SegmentedControl = ({
  tabs,
  defaultTabId,
  onChange,
  className,
}: SegmentedControlProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || tabs[0]?.id || ""
  );

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    onChange?.(tabId);
  };

  return (
    <div
      className={cn(
        "relative h-[31px] bg-black/20 rounded-[12px] p-1 flex items-center",
        className
      )}
    >
      {activeTabId && (
        <motion.div
          className="absolute h-[23px] bg-white/[0.04] rounded-[8px] shadow-[0px_1px_0px_0px_#FFFFFF1A_inset]"
          layoutId="segmentedControlBackground"
          transition={{ type: "spring", duration: 0.3 }}
          style={{
            width: `calc(100% / ${tabs.length})`,
            left: `calc(${tabs.findIndex(tab => tab.id === activeTabId)} * (100% / ${tabs.length}) + 4px)`,
          }}
        />
      )}

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            "relative z-10 flex-1 h-[23px] rounded-[8px] font-medium text-xs leading-none text-center",
            "transition-colors duration-200",
            activeTabId === tab.id ? "text-white" : "text-white/50"
          )}
        >
          <span className="flex items-center justify-center h-full">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};