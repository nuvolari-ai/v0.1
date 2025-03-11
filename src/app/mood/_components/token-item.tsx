"use client";

import { cn } from "@nuvolari/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Token } from "@nuvolari/trpc/react";

export type TokenItemProps = {
  token: Token;
  privateMode: boolean;
};

export const TokenItem = ({ token, privateMode }: TokenItemProps) => {
  const { tokenMetadata, amount, usdValue, percentage } = token;
  const changeIsPositive = percentage >= 0;
  
  // Use the first logo if available
  const logoUrl = tokenMetadata.logosUri && tokenMetadata.logosUri.length > 0 
    ? tokenMetadata.logosUri[0] 
    : "/placeholder-token.png"; // Fallback image
  
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
          {tokenMetadata.logosUri.length > 0 ? (
            <Image 
              src={logoUrl ?? ""} 
              alt={tokenMetadata.symbol} 
              width={40} 
              height={40}
              className="object-cover"
            />
          ) : (
            <span className="text-white/50 text-xs">{tokenMetadata.symbol.substring(0, 2)}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{tokenMetadata.symbol}</span>
          <span className="text-xs text-white/50 truncate max-w-[140px]">{tokenMetadata.name}</span>
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
          {usdValue.toFixed(1)} $
        </motion.span>
        <motion.span 
          className="text-xs text-white/50"
          animate={{ 
            filter: privateMode ? "blur(4px)" : "blur(0px)" 
          }}
          transition={{ duration: 0.2 }}
        >
          {Number(amount).toFixed(2)}
        </motion.span>
      </div>
    </motion.div>
  );
};