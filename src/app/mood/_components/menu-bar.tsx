"use client";

import { Separator } from "@radix-ui/react-separator";
import { Icons } from "../../../components/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@nuvolari/lib/utils";
import { Eye, GalleryVerticalEnd } from "lucide-react";
import { usePathname } from "next/navigation";

export const MenuBar = () => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className="w-full flex items-center justify-between gap-4 p-3 bg-black/40 rounded-2xl mt-4 mb-10">
      <Icons.logo className={"w-8 h-8 fill-[#AEA1FF]"} />
      <Separator
        className="w-1 h-4 bg-white/5 rounded-full"
        orientation={"vertical"}
      />
      <div
        className={cn(
          "bg-white/5 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1"
        )}
      >
        <div
          className={cn(
            "cursor-pointer hover:text-white",
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            {
              "bg-white/5 text-white shadow-[0px_1px_0px_0px_#FFFFFF1A_inset]":
                pathname === "/mood",
            }
          )}
        >
          <Eye />
          Mood
        </div>
        <div
          className={cn(
            "cursor-pointer hover:text-white",
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            {
              "bg-white/5 text-white shadow-[0px_1px_0px_0px_#FFFFFF1A_inset]":
                pathname === "/insights",
            }
          )}
        >
          <Icons.logo
            className={cn("fill-muted-foreground", {
              "fill-white": pathname === "/insights",
            })}
          />
          Insights
        </div>
        <div
          className={cn(
            "cursor-not-allowed",
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            {
              "bg-white/5 text-white shadow-[0px_1px_0px_0px_#FFFFFF1A_inset]":
                pathname === "/journal",
            }
          )}
        >
          <GalleryVerticalEnd />
          Journal
        </div>
      </div>
      <Separator
        className="w-1 h-4 bg-white/5 rounded-full"
        orientation={"vertical"}
      />
      <div className="w-42">
        <ConnectButton showBalance={false} />
      </div>
    </nav>
  );
};
