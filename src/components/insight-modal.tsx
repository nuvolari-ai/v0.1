import React, { useEffect } from 'react';
import { Insight } from "@nuvolari/trpc/react";
import { X, ChevronRight, Loader2, Check, AlertCircle, Copy } from "lucide-react";
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: Insight;
  status: {
    isExecuting: boolean;
    error: Error | null;
    receipt: any;
  };
  onExecute: () => Promise<void>;
}

export const InsightModal = ({ 
  isOpen, 
  onClose, 
  insight, 
  status, 
  onExecute 
}: InsightModalProps) => {
  const { isExecuting, error, receipt } = status;

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Get icon based on insight type
  const getTypeIcon = () => {
    switch (insight.type) {
      case 'YIELD_POOL':
        return '/icons/shortcuts/yield.svg';
      case 'TOKEN_OPPORTUNITY':
        return '/icons/shortcuts/swap.svg';
      default:
        return '/icons/shortcuts/swap.svg';
    }
  };

  // Get button text based on status
  const getButtonText = () => {
    if (isExecuting) return 'Executing...';
    if (error) return 'Try Again';
    if (receipt) return 'Success!';
    return 'Execute';
  };

  // Get button class based on status
  const getButtonClass = () => {
    if (isExecuting) return 'bg-gray-500 cursor-not-allowed';
    if (error) return 'bg-red-600 hover:bg-red-700';
    if (receipt) return 'bg-green-600 hover:bg-green-700';
    return 'bg-purple-600 hover:bg-purple-700';
  };

  // Determine if we should show tokenOut (for TOKEN_OPPORTUNITY) or poolOut (for YIELD_POOL)
  const showTokenOutInfo = insight.type === 'TOKEN_OPPORTUNITY' && insight.tokenOut;
  const showPoolOutInfo = insight.poolOut;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/70" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div 
            className="relative bg-gray-900 rounded-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-black/04 p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img 
                  src={getTypeIcon()} 
                  alt={insight.type} 
                  className="w-6 h-6 rounded-md"
                />
                <h3 className="text-white text-lg font-medium">
                  {insight.type === 'YIELD_POOL' ? 'Yield' : 'Swap'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Transaction visualization */}
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="flex flex-col items-center relative">
                  {/* Type icon overlaid with token icon */}
                  <div className="relative mb-2">
                    <img 
                      src={getTypeIcon()} 
                      alt={insight.type} 
                      className="absolute -left-2 -top-2 w-6 h-6 rounded-md z-10"
                    />
                    <img 
                      src={insight.tokenIn.logosUri[0] || "/api/placeholder/32/32"} 
                      alt={insight.tokenIn.symbol}
                      className="w-12 h-12 rounded-full border border-white/20 relative z-0"
                    />
                  </div>
                  <span className="text-white font-medium">{insight.tokenIn.symbol}</span>
                  <span className="text-white/60 text-sm">{Number(insight.tokenInAmount).toFixed(6)}</span>
                </div>
                
                <ChevronRight className="h-6 w-6 text-white" />
                
                <div className="flex flex-col items-center">
                  {showPoolOutInfo && (
                    <>
                      <img 
                        src={insight.poolOut?.protocol.logosUri[0] || "/icons/placeholder.jpg"} 
                        alt={insight.poolOut?.protocol.name ?? ''}
                        className="w-12 h-12 rounded-full border border-white/20 mb-2"
                      />
                      <span className="text-white font-medium">{insight.poolOut?.symbol}</span>
                      <span className="text-white/60 text-sm line-clamp-2">{insight.poolOut?.name}</span>
                    </>
                  )}
                  {showTokenOutInfo && (
                    <>
                      <img 
                        src={insight.tokenOut.logosUri[0] || "/api/placeholder/32/32"} 
                        alt={insight.tokenOut.symbol}
                        className="w-12 h-12 rounded-full border border-white/20 mb-2"
                      />
                      <span className="text-white font-medium">{insight.tokenOut.symbol}</span>
                      <span className="text-white/60 text-sm line-clamp-2">{insight.tokenOut.name}</span>
                    </>
                  )}
                  {!showPoolOutInfo && !showTokenOutInfo && insight.tokenOutId && (
                    <>
                      <img 
                        src="/api/placeholder/32/32" 
                        alt="Token out"
                        className="w-12 h-12 rounded-full border border-white/20 mb-2"
                      />
                      <span className="text-white font-medium">Token Out</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Insight details */}
              <div className="bg-black/30 p-3 rounded-xl">
                <h4 className="text-white/80 text-sm font-medium mb-2">Insight</h4>
                <p className="text-white text-sm mb-3">{insight.insightShort}</p>
                <p className="text-white/70 text-xs">{insight.insightDetailed}</p>
              </div>
              
              {/* Protocol info if available */}
              {showPoolOutInfo && (
                <div className="bg-black/30 p-3 rounded-xl">
                  <h4 className="text-white/80 text-sm font-medium mb-2">Protocol</h4>
                  <div className="flex items-center gap-2">
                    <img 
                      src={insight.poolOut?.protocol.logosUri[0] || "/api/placeholder/20/20"} 
                      alt={insight.poolOut?.protocol.name ?? ''}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-white text-sm">{insight.poolOut?.protocol.name ?? ''}</span>
                  </div>
                </div>
              )}
              
              {/* For TOKEN_OPPORTUNITY with tokenOut, show token info */}
              {showTokenOutInfo && insight.tokenOut && (
                <div className="bg-black/30 p-3 rounded-xl">
                  <h4 className="text-white/80 text-sm font-medium mb-2">Token</h4>
                  <div className="flex items-center gap-2">
                    <img 
                      src={insight.tokenOut.logosUri[0] || "/api/placeholder/20/20"} 
                      alt={insight.tokenOut.symbol}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-white text-sm">{insight.tokenOut.symbol}</span>
                  </div>
                </div>
              )}
              
              {/* Status message */}
              {error && (
                <div className="bg-red-900/30 text-red-400 p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{error.message}</span>
                </div>
              )}
              
              {receipt && (
                <div className="bg-green-900/30 text-green-400 p-3 rounded-xl flex items-center gap-2">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Transaction successful!</span>
                </div>
              )}
              
              {isExecuting && (
                <div className="bg-blue-900/30 text-blue-400 p-3 rounded-xl flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
                  <span className="text-sm">Transaction in progress...</span>
                </div>
              )}
            </div>
            
            {/* Footer with buttons */}
            <div className="p-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              {
                error && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(error.message);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Error
                  </button>
                )
              }
              
              <button
                onClick={onExecute}
                disabled={isExecuting || !!receipt}
                className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${getButtonClass()}`}
              >
                {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
                {receipt && <Check className="h-4 w-4" />}
                {error && <AlertCircle className="h-4 w-4" />}
                {getButtonText()}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use createPortal to render the modal at the document body level
  return createPortal(modalContent, document.body);
};