"use client";

import {
  type ReactNode,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import { AIChatbotLauncher } from "./ai-chatbot-launcher";
import { AIChatbotWindow } from "./ai-chatbot-window";
import { Message } from "./chat-types";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "👋 Hi! I'm Bayu's AI assistant. I can help answer questions about his experience, skills, and projects. What would you like to know?",
  timestamp: new Date(),
};

export function renderMessageContent(content: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  const pushText = (text: string) => {
    if (text) {
      nodes.push(text);
    }
  };

  const pushElement = (element: ReactNode) => {
    nodes.push(element);
  };

  const isWordBoundary = (char: string | undefined) => {
    return char === undefined || !/[A-Za-z0-9_]/.test(char);
  };

  while (index < content.length) {
    if (content.startsWith("**", index)) {
      const end = content.indexOf("**", index + 2);
      if (end !== -1) {
        pushText(content.slice(lastIndex, index));
        pushElement(
          <strong key={index} className="font-semibold">
            {content.slice(index + 2, end)}
          </strong>,
        );
        index = end + 2;
        lastIndex = index;
        continue;
      }
    }

    if (content[index] === "*") {
      const end = content.indexOf("*", index + 1);
      if (end !== -1) {
        pushText(content.slice(lastIndex, index));
        pushElement(
          <em key={index} className="italic">
            {content.slice(index + 1, end)}
          </em>,
        );
        index = end + 1;
        lastIndex = index;
        continue;
      }
    }

    if (content[index] === "`") {
      const end = content.indexOf("`", index + 1);
      if (end !== -1) {
        pushText(content.slice(lastIndex, index));
        pushElement(
          <code
            key={index}
            className="rounded bg-muted px-1 py-[0.1rem] font-mono text-sm"
          >
            {content.slice(index + 1, end)}
          </code>,
        );
        index = end + 1;
        lastIndex = index;
        continue;
      }
    }

    if (content[index] === "[") {
      const closeBracket = content.indexOf("]", index + 1);
      const openParen =
        closeBracket !== -1 ? content.indexOf("(", closeBracket + 1) : -1;
      const closeParen =
        openParen !== -1 ? content.indexOf(")", openParen + 1) : -1;

      if (
        closeBracket !== -1 &&
        openParen === closeBracket + 1 &&
        closeParen !== -1
      ) {
        const linkText = content.slice(index + 1, closeBracket);
        const href = content.slice(openParen + 1, closeParen);
        if (
          href.startsWith("#") ||
          href.startsWith("http://") ||
          href.startsWith("https://")
        ) {
          pushText(content.slice(lastIndex, index));
          pushElement(
            <a
              key={index}
              href={href}
              className="text-accent underline transition-colors hover:text-accent/80"
            >
              {linkText}
            </a>,
          );
          index = closeParen + 1;
          lastIndex = index;
          continue;
        }
      }
    }

    if (content[index] === "#") {
      const tagText =
        content.startsWith("#contact", index) &&
        isWordBoundary(content[index + 8])
          ? "contact"
          : content.startsWith("#projects", index) &&
            isWordBoundary(content[index + 9])
          ? "projects"
          : null;

      if (tagText) {
        pushText(content.slice(lastIndex, index));
        pushElement(
          <a
            key={index}
            href={`#${tagText}`}
            className="text-accent underline transition-colors hover:text-accent/80"
          >
            {`#${tagText}`}
          </a>,
        );
        index += tagText.length + 1;
        lastIndex = index;
        continue;
      }
    }

    index += 1;
  }

  pushText(content.slice(lastIndex));

  return nodes.map((node, key) =>
    typeof node === "string" ? <span key={key}>{node}</span> : node,
  );
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) setHasNewMessage(true);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
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
