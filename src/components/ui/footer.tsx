"use client";

import { cn } from "@nuvolari/lib/utils";
import Link from "next/link";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("w-full bg-black/40 border-t border-white/10 mt-auto py-2 px-4", className)}>
      <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4 text-xs text-white/60">
         <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Use
          </Link>
          <Link href="/cookies" className="hover:text-white transition-colors">
            Cookies
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-3">
        <a 
            href="https://twitter.com/nuvolari" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group w-8 h-5 bg-white/[0.04] rounded-[4px] flex items-center justify-center transition-all duration-250 ease-in-out hover:bg-white/10"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 1200 1227" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="transition-colors duration-250 ease-in-out"
            >
              <path 
                d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" 
                fill="currentColor" 
                className="text-[#E8E8E880] group-hover:text-white"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
