import { CommandItem } from "@nuvolari/components/ui/command";
import { TokenIcon } from '@web3icons/react'
import { InsightAsset } from "./step-select-asset";


export type InsightPool = {
  label: string;
  address: string;
  chainId: number;
  icon?: React.ReactNode;
  symbol: string;
}

export const StepSelectPool = (
    props: {
        onSelect: (pool: InsightPool) => void;
        asset: InsightAsset;
    }
) => {
  const { asset, onSelect } = props;

  const { data: pools } = trpc.pool.getPools.useQuery({
    asset: asset.address,
  });

  return pools?.map((pool) => (
    <div key={pool.address} className="cursor-pointer" onClick={() => onSelect(pool)}>
      <CommandItem className="hover:bg-white/40">
        <div className="w-6 h-6 bg-[#AC87CF] p-1 rounded-[6px]">
          <TokenIcon symbol={pool.symbol} variant="branded" size="64" />
        </div>
        <span className="text-white">{pool.label}</span>
      </CommandItem>
    </div>
  ));
};