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

export const BalanceCard = () => {
  const [privateMode, setPrivateMode] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: account, isLoading } = api.account.getNuvolariAccount.useQuery(
    {
      address: address ?? "",
    },
    {
      enabled: !!address,
    }
  );

  const totalUSD = account?.total ?? 0;
  const tokens = account?.tokens ?? [];

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
        <div
          className={cn("absolute h-full w-full -mx-3", {
            "backdrop-blur-sm z-30": privateMode,
          })}
        />
        <div className="relative z-20">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="text-white/40 text-xs">
                Connect your wallet to see your portfolio
              </span>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Skeleton loading={isLoading} className="bg-white/5 w-full h-10">
                <span className="text-3xl text-white">
                  $ {totalUSD.toFixed(2)}
                </span>
              </Skeleton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
