"use client";

import { cn } from "@nuvolari/lib/utils";
import { Plus } from "lucide-react";

export const AddWidgetCard = () => {
  return (
    <div
      className={cn(
        "bg-black/40 p-5 flex flex-col items-center justify-center gap-1 rounded-[20px]",
        "cursor-not-allowed"
      )}
    >
      <Plus className="h-8 w-8 text-muted-foreground" />
      <span className="text-white/70">Add Widget</span>
    </div>
  );
};
