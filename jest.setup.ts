import "@testing-library/jest-dom";
import React from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
    resolvedTheme: "light",
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => {
  const createMockComponent = (tagName: string) => {
    const MockComponent = React.forwardRef<
      HTMLElement,
      React.PropsWithChildren<Record<string, unknown>>
    >(({ children, ...props }, ref) => {
      // Filter out framer-motion specific props to avoid React warnings
      const {
        initial,
        animate,
        exit,
        whileHover,
        whileInView,
        whileTap,
        transition,
        variants,
        viewport,
        ...filteredProps
      } = props;
      return React.createElement(
        tagName,
        { ...filteredProps, ref } as React.HTMLAttributes<HTMLElement> & {
          ref?: React.Ref<HTMLElement>;
        },
        children as React.ReactNode
      );
    });
    MockComponent.displayName = `Motion${tagName.charAt(0).toUpperCase() + tagName.slice(1)}`;
    return MockComponent;
  };

  return {
    motion: {
      div: createMockComponent("div"),
      section: createMockComponent("section"),
      header: createMockComponent("header"),
      nav: createMockComponent("nav"),
      button: createMockComponent("button"),
      a: createMockComponent("a"),
      span: createMockComponent("span"),
      p: createMockComponent("p"),
      ul: createMockComponent("ul"),
      li: createMockComponent("li"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock Next.js Image component
jest.mock("next/image", () => {
  const MockImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement> & {
      priority?: boolean;
      fill?: boolean;
      loading?: string;
    }
  >((props, ref) => {
    // Filter out Next.js specific Image props to avoid warnings
    const { priority, fill, loading, ...imgProps } = props;
    return React.createElement("img", { ...imgProps, ref });
  });
  MockImage.displayName = "NextImage";

  return {
    __esModule: true,
    default: MockImage,
  };
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof global.IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
// Mock Response API for API route tests
global.Response = {
  json: (data: unknown) => ({
    status: 200,
    json: async () => data,
  }),
} as typeof Response;