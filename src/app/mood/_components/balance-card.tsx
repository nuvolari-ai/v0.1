"use client";

import { useState } from "react";
import { cn } from "@nuvolari/lib/utils";
import { Wallet } from "lucide-react";
import { Switch } from "@nuvolari/components/ui/switch";
import { Label } from "@nuvolari/components/ui/label";
import { useAccount } from "wagmi";
import { api } from "@nuvolari/trpc/react";
import { Skeleton } from "@nuvolari/components/ui/skeleton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatePresence, motion } from "framer-motion";
import { SegmentedControl } from "@nuvolari/components/ui/segmented-control";
import { TokenItem } from "./token-item";
import { PositionItem } from "./position-item";

export const BalanceCard = () => {
  const [privateMode, setPrivateMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"holdings" | "defi">("holdings");
  const { address, isConnected } = useAccount();

  const { data: accountData, isLoading } = api.account.getNuvolariAccount.useQuery(
    {
      address: address ?? "",
    },
    {
      enabled: !!address,
    }
  );

  const totalUSD = accountData?.total ?? 0;
  const tokens = accountData?.tokens ?? [];
  const positions = accountData?.positions ?? [];

  const tabs = [
    { id: "holdings", label: "Holdings" },
    { id: "defi", label: "DeFi" }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as "holdings" | "defi");
  };

  return (
    <div className="bg-black/40 p-3 pb-0 flex flex-col gap-4 rounded-[20px]">
      <div className="flex justify-between items-center">
        <div className="text-white/70 flex items-center gap-1">
          <Wallet className="h-4 w-4" />
          <span className="text-[12px]">Balance</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="private-mode" className="text-[10px] text-white/50">
            Private
          </Label>
          <Switch
            checked={privateMode}
            onClick={() => setPrivateMode(!privateMode)}
            id="private-mode"
          />
        </div>
      </div>
      
      <div className="relative">
        {/* Total Balance Area */}
        <div className="relative z-10">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="text-white/40 text-xs">
                Connect your wallet to see your portfolio
              </span>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <motion.div 
                  animate={{ 
                    filter: privateMode ? "blur(4px)" : "blur(0px)" 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Skeleton loading={isLoading} className="bg-white/5 w-full h-10">
                    <span className="text-3xl text-white">
                      $ {totalUSD.toFixed(2)}
                    </span>
                  </Skeleton>
                </motion.div>
              </div>
              
              {/* Segmented Control */}
              <div className="mt-2">
                <SegmentedControl 
                  tabs={tabs} 
                  defaultTabId="holdings" 
                  onChange={handleTabChange}
                  className="w-full"
                />
              </div>

              {/* Content for the selected tab */}
              <div className="mt-1 mb-3">
                <AnimatePresence mode="wait">
                  {activeTab === "holdings" ? (
                    <motion.div 
                      key="holdings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white/[0.04] rounded-xl p-2"
                    >
                      <div className="max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                        {tokens.length > 0 ? (
                          <AnimatePresence>
                            {tokens.map((token) => (
                              <TokenItem 
                                key={token.tokenMetadata.id} 
                                token={token} 
                                privateMode={privateMode} 
                              />
                            ))}
                          </AnimatePresence>
                        ) : (
                          <div className="py-4 text-center text-white/50 text-sm">
                            No tokens in your portfolio
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="defi"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white/[0.04] rounded-xl p-2"
                    >
                      <div className="max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                        {positions.length > 0 ? (
                          <AnimatePresence>
                            {positions.map((position) => (
                              <PositionItem 
                                key={position.poolMetadata.id} 
                                position={position} 
                                privateMode={privateMode} 
                              />
                            ))}
                          </AnimatePresence>
                        ) : (
                          <div className="py-4 text-center text-white/50 text-sm">
                            No DeFi positions found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};