import { CommandItem } from "@nuvolari/components/ui/command";
import { useMemo } from "react";
import Image from "next/image";

export type InsightAsset = {
  label: string;
  address: string;
  chainId: number;
  icon?: string;
  symbol: string;
}

export const StepSelectAsset = (
    props: {
        onSelect: (asset: InsightAsset) => void;
        availableAssets: InsightAsset[];
        prefix?: string;
    }
) => {
  const { availableAssets, onSelect } = props;

  const steps = useMemo(() => {
    return availableAssets.map((asset) => ({
      label: asset.label,
      symbol: asset.symbol,
      icon: asset.icon,
      onClick: () => onSelect(asset),
    }))
  }, [availableAssets, onSelect])
  
  return steps.map((command) => (
    <div key={command.label} className="cursor-pointer">
      <CommandItem className="hover:bg-white/40" onSelect={command.onClick} forceMount={true}>
        <div className="w-6 h-6 bg-[#AC87CF] p-1 rounded-[6px]">
          {command.icon && <Image src={command.icon} width={24} height={24} alt={command.symbol} className="w-6 h-6" />}
        </div>
        <span className="text-white">{command.symbol}</span>
        <span className="text-gray-400 text-xs">{command.label}</span>
      </CommandItem>
    </div>
  ));
};