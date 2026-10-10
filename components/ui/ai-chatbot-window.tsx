'use client';

import { type ReactNode, type RefObject, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Send, Bot } from 'lucide-react';
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
  onSuggestionSelect?: (text: string) => void;
}

const QUICK_PROMPTS = [
  "Tech stack overview",
  "Key projects",
  "Contact information",
];

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
  onSuggestionSelect,
}: AIChatbotWindowProps) {
  const showSuggestions = messages.length <= 1 && !isLoading;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed inset-0 z-50 mx-auto w-full max-w-full md:inset-auto md:bottom-6 md:right-6 md:w-[380px] md:max-w-md"
      >
        <div className="flex flex-col h-dvh md:h-[520px] bg-bg-card border border-border/80 md:rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/60 bg-bg-card flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-1">AI Assistant</h3>
                <p className="text-[11px] text-text-3">Portfolio Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-subtle transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-subtle transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-workspace-scroll text-sm">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                      isUser
                        ? 'bg-accent text-accent-fg rounded-tr-xs font-medium'
                        : 'bg-bg-subtle/80 border border-border/60 text-text-1 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                  <span className="text-[10px] text-text-3 px-1 mt-1 font-mono">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}

            {/* Subtle Inline Suggestions */}
            {showSuggestions && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (onSuggestionSelect) {
                          onSuggestionSelect(prompt);
                        } else {
                          onInputChange(prompt);
                          inputRef.current?.focus();
                        }
                      }}
                      className="px-2.5 py-1 rounded-full bg-bg-subtle/70 border border-border/70 hover:border-accent/60 text-xs text-text-2 hover:text-text-1 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-bg-subtle/80 border border-border/60 rounded-xl rounded-tl-xs px-3.5 py-2.5">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse [animation-delay:200ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse [animation-delay:400ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3.5 border-t border-border/50 bg-bg-card">
            <div className="rounded-lg border border-border/70 bg-bg-subtle/50 px-3.5 py-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-accent/40 focus-within:bg-bg-card transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-transparent py-1.5 text-sm text-text-1 placeholder:text-text-3 focus:outline-none disabled:opacity-50 min-w-0"
              />
              <Button
                onClick={onSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="w-9 h-9 p-0 rounded-xl bg-accent text-accent-fg shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:bg-accent-hover active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.35)] active:scale-95 disabled:opacity-40 disabled:shadow-none flex items-center justify-center shrink-0 transition-all duration-150"
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
