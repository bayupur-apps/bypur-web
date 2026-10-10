'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Bot } from 'lucide-react';
import { Button } from './button';

interface AIChatbotLauncherProps {
  showScrollTop: boolean;
  isOpen: boolean;
  hasNewMessage: boolean;
  showChat?: boolean;
  onOpen: () => void;
  onScrollTop: () => void;
}

export function AIChatbotLauncher({
  showScrollTop,
  isOpen,
  hasNewMessage,
  showChat = true,
  onOpen,
  onScrollTop,
}: AIChatbotLauncherProps) {
  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-2.5 md:bottom-6 md:right-6">
      <AnimatePresence>
        {showScrollTop && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              onClick={onScrollTop}
              size="lg"
              className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-bg-card border border-border/80 text-text-2 hover:text-accent hover:border-accent shadow-sm transition-colors flex items-center justify-center p-0"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 z-20 flex h-2.5 w-2.5">
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent border-2 border-bg-card" />
                </span>
              )}

              <Button
                onClick={onOpen}
                size="lg"
                className="relative h-12 w-12 md:h-13 md:w-13 rounded-xl bg-bg-card border border-border/80 text-accent hover:border-accent shadow-md transition-all flex items-center justify-center p-0"
                aria-label="Open AI Assistant"
              >
                <Bot className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
