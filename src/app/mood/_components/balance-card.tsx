"use client";

import { useState } from "react";
import { cn } from "@nuvolari/lib/utils";
import { Wallet } from "lucide-react";
import { Switch } from "@nuvolari/components/ui/switch";
import { Label } from "@nuvolari/components/ui/label";
import { useAccount } from "wagmi";
import { api } from "@nuvolari/trpc/react";
import { Skeleton } from "@nuvolari/components/ui/skeleton";

export const BalanceCard = () => {
  const [privateMode, setPrivateMode] = useState(false);
  const { address } = useAccount();

  const { data: account, isLoading } = api.account.getNuvolariAccount.useQuery(
    {
      address: address ?? "",
    },
    {
      enabled: !!address,
    }
  );

  const tokens = account?.tokens ?? [];
  console.log(tokens);

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
          {isLoading ? (
            <Skeleton />
          ) : (
            <span className="text-3xl text-white">
              $ {(account?.total ?? 0).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
