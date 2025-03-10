import { CommandItem } from "@nuvolari/components/ui/command";
import { ArrowLeftRight, LucideIcon } from "lucide-react";

import { Percent } from "lucide-react";

export type InsightAction = "SWAP" | "YIELD";

const STEP_1_COMMANDS: { label: string; action: InsightAction; icon: LucideIcon }[] = [
  {
    label: "Swap",
    action: "SWAP",
    icon: ArrowLeftRight,
  },
  {
    label: "Yield",
    action: "YIELD",
    icon: Percent,
  },
];

export const StepSelectAction = (
    props: {
        onSelect: (action: InsightAction) => void;
    }
) => {
  return STEP_1_COMMANDS.map((command) => (
    <div key={command.label} className="cursor-pointer" >
      <CommandItem className="hover:bg-black/40" onSelect={() => props.onSelect(command.action)}>
        <div className="w-6 h-6 bg-[#AC87CF] p-1 rounded-[6px]">
          <command.icon className="w-3 h-3 text-white" />
        </div>
        <span className="text-white">{command.label}</span>
      </CommandItem>
    </div>
  ));
};