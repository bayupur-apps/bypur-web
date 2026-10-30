"use client";

export function AppCanvasDecorations() {
  return (
    <>
      {/* 01: Physical Micro-Noise Texture Layer (Anodized Basalt Material) */}
      <svg
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.028] dark:opacity-[0.042] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="tokyo-studio-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tokyo-studio-noise)" />
      </svg>

      {/* 02: Rich Warm Solar Amber Horizon Wash (Top Lighting) */}
      {/* Center Primary Amber Bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_960px_480px_at_50%_-100px,rgba(245,158,11,0.11)_0%,rgba(217,119,6,0.04)_50%,transparent_75%)] dark:bg-[radial-gradient(ellipse_1000px_520px_at_50%_-110px,rgba(245,158,11,0.13)_0%,rgba(217,119,6,0.05)_55%,transparent_75%)]"
      />

      {/* Flanking Warm Terracotta Diffuse Wash for Color Depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_700px_320px_at_20%_-80px,rgba(234,88,12,0.05)_0%,transparent_65%),radial-gradient(ellipse_700px_320px_at_80%_-80px,rgba(245,158,11,0.05)_0%,transparent_65%)]"
      />

      {/* Balanced Ambient Studio Vignette: Ultra-subtle to keep the lower canvas clear and breathable without heavy dark shadows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-white/[0.015] via-transparent to-black/[0.02] dark:from-white/[0.008] dark:via-transparent dark:to-black/[0.06]"
      />

      {/* 03: Specular Horizon Hairline at Very Top Edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-[1.5px] bg-gradient-to-r from-transparent via-accent/45 to-transparent shadow-[0_1px_12px_rgba(245,158,11,0.35)]"
      />
    </>
  );
}
