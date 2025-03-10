"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InsightModal } from './insight-modal';
import { Insight } from '@nuvolari/trpc/react';

type ModalContextType = {
  openInsightModal: (insight: Insight, executeHandler: () => Promise<void>, statusProps: {
    isExecuting: boolean;
    error: Error | null;
    receipt: any;
  }) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [executeHandler, setExecuteHandler] = useState<(() => Promise<void>) | null>(null);
  const [status, setStatus] = useState<{
    isExecuting: boolean;
    error: Error | null;
    receipt: any;
  }>({
    isExecuting: false,
    error: null,
    receipt: null
  });

  const openInsightModal = (
    insight: Insight, 
    executeHandler: () => Promise<void>,
    statusProps: {
      isExecuting: boolean;
      error: Error | null;
      receipt: any;
    }
  ) => {
    setCurrentInsight(insight);
    setExecuteHandler(() => executeHandler);
    setStatus(statusProps);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const contextValue = {
    openInsightModal,
    closeModal
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* Global Modal */}
      {currentInsight && executeHandler && (
        <InsightModal
          isOpen={isOpen}
          onClose={closeModal}
          insight={currentInsight}
          status={status}
          onExecute={executeHandler}
        />
      )}
    </ModalContext.Provider>
  );
};