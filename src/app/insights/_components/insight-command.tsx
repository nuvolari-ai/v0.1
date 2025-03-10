"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@nuvolari/components/ui/command";
import { ArrowLeftRight, Percent } from "lucide-react";
import { useRef, useState } from "react";

export const InsightCommand = () => {
  const searchInput = useRef(null);
  const [inFocus, setFocus] = useState(false);

  // const inFocus = document
  //   ? document.activeElement === searchInput.current
  //   : false;

  return (
    <Command
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      className="rounded-lg shadow-md w-full bg-black/40 text-white"
    >
      <CommandInput
        ref={searchInput}
        placeholder="Type a command or search..."
      />
      {inFocus ? (
        <CommandList className="w-full  text-white">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem className="hover:bg-white/40">
              <div className="w-6 h-6 bg-[#AC87CF] p-1 rounded-[6px]">
                <ArrowLeftRight className="w-3 h-3 text-white" />
              </div>
              <span className="text-white">Swap</span>
            </CommandItem>
            <CommandItem>
              <div className="w-6 h-6 bg-[#AC87CF] p-1 rounded-[6px]">
                <Percent className="w-3 h-3 text-white" />
              </div>
              <span className="text-white">Yield</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      ) : null}
      {/*  */}
    </Command>
  );
};
