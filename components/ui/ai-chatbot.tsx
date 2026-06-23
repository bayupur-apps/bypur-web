'use client';

import { type ReactNode, type KeyboardEvent, useState, useRef, useEffect } from 'react';
import { AIChatbotLauncher } from './ai-chatbot-launcher';
import { AIChatbotWindow } from './ai-chatbot-window';
import { Message } from './chat-types';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "👋 Hi! I'm Bayu's AI assistant. I can help answer questions about his experience, skills, and projects. What would you like to know?",
  timestamp: new Date(),
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) setHasNewMessage(true);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "Sorry, I'm having trouble responding right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const nodes: ReactNode[] = [];
    const tokenRegex = /\[([^\]]+)\]\((#[^)]+|https?:\/\/[^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|#(contact|projects)\b/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(content.slice(lastIndex, match.index));
      }

      if (match[1] && match[2]) {
        nodes.push(
          <a
            key={`${match.index}-link`}
            href={match[2]}
            className="text-accent underline transition-colors hover:text-accent/80"
          >
            {match[1]}
          </a>
        );
      } else if (match[3]) {
        nodes.push(
          <strong key={`${match.index}-bold`} className="font-semibold">
            {match[3]}
          </strong>
        );
      } else if (match[4]) {
        nodes.push(
          <em key={`${match.index}-italic`} className="italic">
            {match[4]}
          </em>
        );
      } else if (match[5]) {
        nodes.push(
          <code
            key={`${match.index}-code`}
            className="rounded bg-muted px-1 py-[0.1rem] font-mono text-sm"
          >
            {match[5]}
          </code>
        );
      } else if (match[6]) {
        nodes.push(
          <a
            key={`${match.index}-hash`}
            href={`#${match[6]}`}
            className="text-accent underline transition-colors hover:text-accent/80"
          >
            {`#${match[6]}`}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      nodes.push(content.slice(lastIndex));
    }

    return nodes.map((node, index) =>
      typeof node === 'string' ? <span key={index}>{node}</span> : node
    );
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AIChatbotLauncher
        showScrollTop={showScrollTop}
        isOpen={isOpen}
        hasNewMessage={hasNewMessage}
        onOpen={handleOpen}
        onScrollTop={scrollToTop}
      />

      {isOpen && (
        <AIChatbotWindow
          messages={messages}
          isLoading={isLoading}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onClose={handleClose}
          onKeyPress={handleKeyPress}
          renderMessageContent={renderMessageContent}
          inputRef={inputRef}
          messagesEndRef={messagesEndRef}
        />
      )}
    </>
  );
}
