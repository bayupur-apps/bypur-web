'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './button';

interface AIChatbotLauncherProps {
  showScrollTop: boolean;
  isOpen: boolean;
  hasNewMessage: boolean;
  onOpen: () => void;
  onScrollTop: () => void;
}

export function AIChatbotLauncher({
  showScrollTop,
  isOpen,
  hasNewMessage,
  onOpen,
  onScrollTop,
}: AIChatbotLauncherProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:gap-4">
      <AnimatePresence>
        {showScrollTop && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={onScrollTop}
              size="lg"
              className="w-14 h-14 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="relative">
              {hasNewMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-card z-10"
                />
              )}

              <Button
                onClick={onOpen}
                size="lg"
                className="relative w-14 h-14 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
                aria-label="Open AI Assistant"
              >
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <MessageCircle className="w-6 h-6" />
                </motion.div>

                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                </motion.div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
