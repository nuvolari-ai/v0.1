"use client";

import { cn } from "@nuvolari/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Position } from "@nuvolari/trpc/react";

export type PositionItemProps = {
  position: Position;
  privateMode: boolean;
};

export const PositionItem = ({ position, privateMode }: PositionItemProps) => {
  const { poolMetadata, amount, usdValue, percentage } = position;
  const changeIsPositive = percentage >= 0;
  
  // Use the first logo if available
  const logoUrl = poolMetadata.protocol.logosUri && poolMetadata.protocol.logosUri.length > 0 
    ? poolMetadata.protocol.logosUri[0] 
    : "/placeholder-protocol.png"; // Fallback image
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex justify-between items-center py-3 border-b border-white/5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {poolMetadata.protocol.logosUri.length > 0 ? (
            <Image 
              src={logoUrl} 
              alt={poolMetadata.protocol.name} 
              width={40} 
              height={40}
              className="object-cover"
            />
          ) : (
            <span className="text-white/50 text-xs">{poolMetadata.protocol.name.substring(0, 2)}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{poolMetadata.protocol.name}</span>
          <span className="text-xs text-white/50 truncate max-w-[140px]">{poolMetadata.name}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <motion.span 
          className="text-sm text-white"
          animate={{ 
            filter: privateMode ? "blur(4px)" : "blur(0px)" 
          }}
          transition={{ duration: 0.2 }}
        >
          {usdValue.toFixed(2)} $
        </motion.span>
      </div>
    </motion.div>
  );
};