"use client";

import { Separator } from "@radix-ui/react-separator";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@nuvolari/lib/utils";
import { Eye, GalleryVerticalEnd } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@nuvolari/components/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Define the available menu items
const MENU_ITEMS = [
  { href: "/mood", label: "Mood", icon: (active: boolean) => <Eye className="w-3.5 h-3.5" /> },
  { 
    href: "/insights", 
    label: "Insights", 
    icon: (active: boolean) => (
      <Icons.logo 
        className={cn("w-3.5 h-3.5", active ? "fill-white" : "fill-muted-foreground")} 
      />
    ) 
  },
  { 
    href: "/journal", 
    label: "Journal", 
    icon: (active: boolean) => <GalleryVerticalEnd className="w-3.5 h-3.5" />,
    disabled: true
  }
];

export const MenuBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Set the active index based on the current pathname
  useEffect(() => {
    const index = MENU_ITEMS.findIndex(item => item.href === pathname);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname]);

  const handleItemClick = (href: string, index: number, disabled: boolean = false) => {
    if (disabled) return;
    setActiveIndex(index);
    router.push(href);
  };

  return (
    <nav className="flex items-center justify-between gap-1 p-2 bg-black/40 rounded-2xl mt-4 mb-8 h-14">
      <div className="flex-shrink-0">
        <Icons.logo className={"w-8 h-8 fill-[#AEA1FF]"} />
      </div>
      
      <Separator className="w-1 h-4 bg-white/5 rounded-full hidden sm:block" orientation={"vertical"} />
      
      <div className="bg-white/5 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1 flex-grow max-w-xs relative">
        {/* Animated Background */}
        <motion.div
          className="absolute bg-white/5 rounded-md shadow-[0px_1px_0px_0px_#FFFFFF1A_inset]"
          layoutId="menuBarBackground"
          transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
          style={{
            width: `calc(100% / ${MENU_ITEMS.length})`,
            height: "calc(100% - 8px)",
            left: `calc(${activeIndex} * (100% / ${MENU_ITEMS.length}) + 4px)`,
          }}
        />
        
        {/* Menu Items */}
        {MENU_ITEMS.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={item.href}
              onClick={() => handleItemClick(item.href, index, item.disabled)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap z-10",
                "transition-colors duration-200 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                item.disabled ? "cursor-not-allowed" : "cursor-pointer hover:text-white",
                isActive ? "text-white" : "text-muted-foreground"
              )}
            >
              {item.icon(isActive)}
              <span className="sm:inline hidden">{item.label}</span>
            </div>
          );
        })}
      </div>
      
      <Separator className="w-1 h-4 bg-white/5 rounded-full hidden sm:block" orientation={"vertical"} />
      
      <div className="flex-shrink-0">
        <ConnectButton showBalance={false} />
      </div>
    </nav>
  );
};