'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle, Sparkles } from 'lucide-react';
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
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex flex-col gap-3 md:bottom-6 md:right-6 md:gap-4">
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
              className="w-12 h-12 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center md:h-14 md:w-14"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
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
                className="relative w-12 h-12 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center md:h-14 md:w-14"
                aria-label="Open AI Assistant"
              >
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>

                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-secondary-ink md:h-4 md:w-4" />
                </motion.div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
