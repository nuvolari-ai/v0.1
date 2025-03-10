"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@nuvolari/components/ui/command";
import { useEffect, useMemo, useRef, useState } from "react";
import { StepSelectAction, InsightAction } from "./steps/step-select-action";
import { InsightAsset, StepSelectAsset } from "./steps/step-select-asset";
import { Token } from "@prisma/client";
import "./insight-command.css";
import Fuse from 'fuse.js';
import { InsightWithToken } from "@nuvolari/trpc/react";
enum InsightCommandStep {
  SEARCH = 0,
  SELECT_ASSET = 1,
  SELECT_SECOND_ASSET = 2,
  SELECT_POOL = 3,
  SELECT_SWAP_INSIGHT = 4,
  EXECUTE = 5,
}

interface InsightCommandProps {
  tokens: Token[];
  onActionSelect: (action: InsightAction) => void;
  onAssetSelect: (asset: InsightAsset) => void;
  onDestinationAssetSelect: (asset: InsightAsset) => void;
  selectedAction: InsightAction | null;
  selectedAsset: InsightAsset | null;
  selectedDestinationAsset: InsightAsset | null;
  insights: InsightWithToken[];
}

export const InsightCommand = (props: InsightCommandProps) => {
  const {
    tokens,
    onActionSelect,
    onAssetSelect,
    onDestinationAssetSelect,
    selectedAction,
    selectedAsset,
    selectedDestinationAsset,
    insights
  } = props;

  const searchInput = useRef(null);
  const [inFocus, setFocus] = useState(false);
  const [search, setSearch] = useState("");

  // Keep UI-related state in the component
  const selectableTokens = useMemo(() => {
    return tokens.map((token) => ({
      label: token.name,
      address: token.id,
      symbol: token.symbol,
      chainId: token.chainId,
      icon: token.logosUri[0],
    }));
  }, [tokens]);

  const actionIsSwap = useMemo(() => {
    return selectedAction?.toLowerCase() === 'swap';
  }, [selectedAction]);

  // Create Fuse instance for token searching
  const tokenFuse = useMemo(() => {
    return new Fuse(selectableTokens, {
      keys: ['label', 'symbol'],
      threshold: 0.3,
      isCaseSensitive: false,
    });
  }, [selectableTokens]);

  // Calculate current step
  const currentStep = useMemo(() => {
    if (search.toLowerCase().startsWith('yield') || search.toLowerCase().startsWith('swap')) {
      if (selectedAsset) {
        if (actionIsSwap && !selectedDestinationAsset) {
          return InsightCommandStep.SELECT_SECOND_ASSET;
        }
        if (actionIsSwap && selectedDestinationAsset) {
          return InsightCommandStep.SELECT_SWAP_INSIGHT;
        }
        if (search.includes(selectedAsset.symbol)) {
          return InsightCommandStep.SELECT_POOL;
        }
      }

      return InsightCommandStep.SELECT_ASSET;
    }

    return InsightCommandStep.SEARCH;
  }, [search, selectedAsset, selectedDestinationAsset, actionIsSwap]);

  // Create filtered tokens based on search
  const filteredTokens = useMemo(() => {
    if (!search || currentStep === InsightCommandStep.SEARCH) {
      return selectableTokens;
    }
    
    // Extract search term based on current step
    let searchTerm = '';
    if (currentStep === InsightCommandStep.SELECT_ASSET) {
      // Only use text after the action for asset search
      const parts = search.split(' ');
      searchTerm = parts.length > 1 ? parts.slice(1).join(' ') : '';
    } else if (currentStep === InsightCommandStep.SELECT_SECOND_ASSET) {
      // For destination asset, use text after "to" if present
      const parts = search.split(' to ');
      searchTerm = parts.length > 1 ? parts[1] : '';
    }
    
    if (!searchTerm.trim()) {
      return selectableTokens;
    }
    
    // Use Fuse to search
    return tokenFuse.search(searchTerm).map(result => result.item);
  }, [search, tokenFuse, selectableTokens, currentStep]);

  // Clean up selected assets when search changes
  useEffect(() => {
    if (selectedAsset) {
      if (!search.includes(selectedAsset.symbol)) {
        onAssetSelect(null as any);
      }
    }

    if (selectedDestinationAsset) {
      if (!search.includes(selectedDestinationAsset.symbol)) {
        onDestinationAssetSelect(null as any);
      }
    }
  }, [search, selectedAsset, selectedDestinationAsset, onAssetSelect, onDestinationAssetSelect]);

  // Wrapper functions to handle local UI state along with parent state
  const handleActionSelect = (action: InsightAction) => {
    onActionSelect(action);
    setSearch(action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()); // capitalise
  };

  const handleSelectedAsset = (asset: InsightAsset) => {
    onAssetSelect(asset);
    setSearch((v) => `${v.trimEnd()} ${asset.symbol}`);
  };

  const handleSelectedDestinationAsset = (asset: InsightAsset) => {
    onDestinationAssetSelect(asset);
    setSearch((v) => {
      // Split the search string at " to " and take the first part
      const basePart = v.split(' to')[0];
      // Append the destination asset symbol
      return `${basePart.trimEnd()} to ${asset.symbol}`;
    });
  };

  // Update searchTextParts to better handle the "to" part
  const searchTextParts = useMemo(() => {
    const parts = search.split(' ');
    const action = parts[0];
    const asset = parts[1];
    
    // Check if "to" is part of the search string
    const toIndex = parts.indexOf('to');
    const secondAsset = toIndex >= 0 && parts.length > toIndex + 1 ? parts[toIndex + 1] : null;
    
    // Separate the middle parts and end parts
    const middleParts = toIndex > 2 ? parts.slice(2, toIndex) : [];
    const endParts = secondAsset && toIndex + 2 < parts.length ? parts.slice(toIndex + 2) : [];

    return {
      action,
      asset,
      hasTo: toIndex >= 0,
      secondAsset,
      middleParts,
      endParts
    };
  }, [search]);

  const isEmpty = useMemo(() => {
    return search.trim() === '';
  }, [search]);

  return (
    <Command
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      shouldFilter={false}
      className="rounded-lg shadow-md w-full bg-black/40 text-white relative"
    >
      <CommandInput
        ref={searchInput}
        placeholder="Type a command or search..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      {
        searchTextParts.asset && (
          <div className="insight-command-text-wrap">
            {searchTextParts.action}{' '}
            <span className="insight-command-text-wrap--asset">{searchTextParts.asset}</span>{' '}
            {searchTextParts.middleParts.join(' ')}
            {searchTextParts.hasTo && ' to '}
            {searchTextParts.secondAsset && (
              <span className="insight-command-text-wrap--asset">{searchTextParts.secondAsset}</span>
            )}
            {searchTextParts.endParts.length > 0 && ' ' + searchTextParts.endParts.join(' ')}
          </div>
        )
      }
      {inFocus ? (
        <CommandList className="w-full text-white">
          {isEmpty && (
            <CommandEmpty>No results found.</CommandEmpty>
          )} 

          {currentStep === InsightCommandStep.SEARCH && (
            <CommandGroup heading="Suggestions">
              <StepSelectAction onSelect={handleActionSelect} />
            </CommandGroup>
          )}

          {currentStep === InsightCommandStep.SELECT_ASSET && (
            <CommandGroup heading="Asset" forceMount={true}>
              <StepSelectAsset 
                onSelect={handleSelectedAsset} 
                availableAssets={filteredTokens} 
                prefix={searchTextParts.action} 
              />
            </CommandGroup>
          )}

          {currentStep === InsightCommandStep.SELECT_SECOND_ASSET && (
            <CommandGroup heading="Destination Asset" forceMount={true}>
              <StepSelectAsset 
                onSelect={handleSelectedDestinationAsset} 
                availableAssets={filteredTokens} 
                prefix={searchTextParts.action} 
              />
            </CommandGroup>
          )}
        </CommandList>
      ) : null}
    </Command>
  );
};

