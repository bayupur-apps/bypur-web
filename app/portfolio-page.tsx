"use client";

import { useState, useEffect, useMemo } from "react";
import { AppTopBar } from "@/components/desktop/app-top-bar";
import { AppIslandDock, BASE_DOCK_ITEMS, type DockItem } from "@/components/desktop/app-island-dock";
import { AppMobileDock } from "@/components/desktop/app-mobile-dock";
import { AppStatusBar } from "@/components/desktop/app-status-bar";
import { AppWorkspaceCanvas } from "@/components/desktop/app-workspace-canvas";
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context";

const HASH_TO_VIEW_MAP: Record<string, string> = {
  "#about": "bio",
  "#hero": "bio",
  "#skills": "stack",
  "#stack": "stack",
  "#projects": "projects",
  "#experience": "experience",
  "#certificates": "certificates",
  "#contact": "contact",
};

const VIEW_TO_HASH_MAP: Record<string, string> = {
  bio: "#about",
  stack: "#skills",
  projects: "#projects",
  experience: "#experience",
  certificates: "#certificates",
  contact: "#contact",
};

function PortfolioDesktopShell() {
  const { certificates } = usePortfolio();
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && HASH_TO_VIEW_MAP[hash]) {
        return HASH_TO_VIEW_MAP[hash];
      }
    }
    return "bio";
  });

  // If certificates are empty, exclude from dock
  const hasCertificates = certificates.length > 0;
  const dockItems: DockItem[] = useMemo(() => {
    return BASE_DOCK_ITEMS.filter(
      (item) => hasCertificates || item.id !== "certificates"
    );
  }, [hasCertificates]);

  // Listen to hashchange events
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash && HASH_TO_VIEW_MAP[hash]) {
        setActiveView(HASH_TO_VIEW_MAP[hash]);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleSelectView = (viewId: string) => {
    setActiveView(viewId);
    const hash = VIEW_TO_HASH_MAP[viewId];
    if (hash && window.history.replaceState) {
      window.history.replaceState(null, "", hash);
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-bg text-text-1 select-none">
      {/* Floating Left Island Dock */}
      <AppIslandDock
        items={dockItems}
        activeId={activeView}
        onSelect={handleSelectView}
      />

      {/* Main Centered Application Frame: TopBar + Canvas + StatusBar sharing the exact same bounds */}
      <div className="flex flex-col h-full w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:pl-20 md:pr-8 justify-between overflow-hidden">
        {/* 01: Top Window Bar */}
        <AppTopBar />

        {/* 02: Central Dynamic Workspace Canvas (Isolated inner scroll) */}
        <AppWorkspaceCanvas activeView={activeView} />

        {/* 03: Bottom Technical Status Bar */}
        <AppStatusBar />
      </div>

      {/* Mobile Bottom Floating Dock */}
      <AppMobileDock
        items={dockItems}
        activeId={activeView}
        onSelect={handleSelectView}
      />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <PortfolioProvider>
      <PortfolioDesktopShell />
    </PortfolioProvider>
  );
}
