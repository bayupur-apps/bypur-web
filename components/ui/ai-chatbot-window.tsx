'use client';

import { type ReactNode, type RefObject, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Sparkles, Send } from 'lucide-react';
import { Button } from './button';
import { Message } from './chat-types';

interface AIChatbotWindowProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  renderMessageContent: (content: string) => ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function AIChatbotWindow({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onClose,
  onKeyPress,
  renderMessageContent,
  inputRef,
  messagesEndRef,
}: AIChatbotWindowProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 mx-auto w-full max-w-full md:inset-auto md:bottom-6 md:right-6 md:w-full md:max-w-md"
      >
        <div className="bg-card rounded-none md:rounded-3xl border border-border shadow-lg flex flex-col h-screen md:h-150 overflow-hidden">
          <div className="bg-accent p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-fg/10 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-fg" />
              </div>
              <div>
                <h3 className="font-semibold text-accent-fg">AI Assistant</h3>
                <p className="text-xs text-accent-fg/80">Powered by AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-accent-fg hover:bg-accent-fg/10 transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-accent-fg hover:bg-accent-fg/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user' ? 'bg-accent text-accent-fg' : 'bg-bg-subtle text-text-1'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {renderMessageContent(message.content)}
                  </p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-accent-fg/70' : 'text-text-3'}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-bg-subtle rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-text-3 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-text-3 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-text-3 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-bg text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-all"
              />
              <Button
                onClick={onSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="w-10 h-10 p-0 rounded-full disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
