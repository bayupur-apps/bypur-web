---
version: "beta-desktop-app"
name: "Tokyo Studio: Warm Solar Amber & Basalt Carbon (Zero-Scroll Desktop App)"
description: "Desktop-first application shell, zero global page-scroll, viewport-locked 100dvh canvas, floating tactile island dock, matte engineering precision, Warm Solar Amber accents with Basalt Carbon surfaces. Fully verified for WCAG AA/AAA contrast."
colors:
  primary: "#0C0D10"
  secondary: "#12141A"
  tertiary: "#F59E0B"
  neutral: "#212530"
  surface: "#14161F"
  accent: "#F59E0B"
  card: "#12141A"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: 400
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: 500
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  xl: 18px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
---

## 1. Overview & Core Paradigm

This design system establishes a **Zero-Scroll Desktop Application Shell** for the portfolio. Rather than a conventional long vertical webpage, the interface behaves like a precision-engineered native desktop application (e.g. macOS desktop app, Linear, Raycast, or VS Code).

### Key Architectural Pillars
- **Zero Global Window Scroll**: The browser body is locked to exact viewport height (`100dvh`). There is no global window scrollbar.
- **Floating Island Dock**: A floating tactile navigation island positioned on the left (or bottom on mobile), featuring magnetic sliding indicators, pneumatic pressed states, and keyboard shortcut hints (`1` to `6`).
- **Dynamic Central Workspace Canvas**: The central stage swaps content smoothly via micro-fade/slide transitions when switching views (Bio, Stack Matrix, Projects, Experience, Certificates, Contact).
- **Isolated Inner Scrolling**: If a specific view contains extensive items (such as the Project Gallery or Experience Timeline), scrolling is strictly isolated to that specific inner panel using sleek custom neumorphic scrollbars.
- **Schematic Engineering Aesthetics**: Subtle grid textures, blueprint flow lines, circuit markers, and JetBrains Mono technical metadata tags.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [● ● ●]  bypur.app // ARCHITECTURE STUDIO      [SYS: ONLINE 🟢]    [⌘K SEARCH]  [☀️/🌙] [ID/EN]   │
├───────────────┬──────────────────────────────────────────────────────────────────────────────────┤
│               │                                                                                  │
│ [FLOATING     │  [CENTRAL WORKSPACE CANVAS] (100dvh / Viewport Locked)                           │
│  ISLAND DOCK] │                                                                                  │
│               │  Dynamic Stage / View Switching:                                                 │
│  [01 // BIO]  │  • 01 Bio & Profile Hub                                                          │
│  [02 // WORK] │  • 02 Featured Projects Studio                                                   │
│  [03 // EXP]  │  • 03 Career & Experience Logs                                                   │
│  [04 // STACK]│  • 04 Skills Bento & Architecture Matrix                                         │
│  [05 // CERT] │  • 05 Verified Credentials                                                       │
│  [06 // TALK] │  • 06 Contact & Communication Hub                                                │
│               │                                                                                  │
│  ───────────  │  *(Content is dense, ergonomic, and fitted to screen; inner panel scroll only)* │
│  [⌘K] [Theme] │                                                                                  │
├───────────────┴──────────────────────────────────────────────────────────────────────────────────┤
│  ⚡ STATUS: OPEN FOR FULL-TIME / CONTRACT    •    PURWOKERTO (WIB) 21:15   •    LATENCY: 24ms    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Color Palette & Surface Tokens (WCAG Contrast Verified)

- **Background Canvas** (`#F4F5F7` light / `#0C0D10` dark): Warm linen in light mode; Basalt Carbon in dark mode.
- **Card Surface** (`#FFFFFF` light / `#12141A` dark): Solid Smoked Graphite plane with hairline borders (`#212530`).
- **Subtle Surface** (`#E5E7EB` light / `#14161F` dark): Inset sunken depth, input wells, and chips.
- **Text Primary** (`#0F172A` light / `#F8FAFC` dark): High-contrast crisp typography (18.6:1 contrast against dark background).
- **Text Secondary** (`#334155` light / `#CBD5E1` dark): Readable supporting slate text (13.1:1 contrast against dark background).
- **Text Tertiary / Muted** (`#526075` light / `#8B95A5` dark): Quiet captions and indices (5.85:1 light, 6.42:1 dark, exceeding WCAG AA).
- **Accent Tokyo Solar Amber** (`#B45309` light / `#F59E0B` & `#FBBF24` dark):
  - Primary button: `#F59E0B` with `#0C0D10` text (9.05:1 contrast in dark mode, passes WCAG AAA; `#B45309` with `#FFFFFF` text in light mode, 5.02:1 contrast, passes WCAG AA).
  - Accent indicators / ink: `#FBBF24` on dark basalt canvas (11.64:1 contrast, passes WCAG AAA).
- **Surface Elevation Light** (`rgba(255, 255, 255, 0.8)` light / `#212530` dark): Crisp hairline border and soft diffused reflection.
- **Surface Shadow Dark** (`rgba(100, 116, 139, 0.16)` light / `rgba(0, 0, 0, 0.75)` dark): Soft depth shadow for subtle elevation.

---

## 3. Typography & Hierarchy

- **Display & Headings**: Plus Jakarta Sans (Weight 700 / 600) for sharp, modern legibility.
- **Body & Descriptions**: Plus Jakarta Sans (Weight 400 / 500), 15px - 16px, line-height 1.5.
- **Technical & Metadata**: JetBrains Mono (Weight 500 / 600) for indices (`01 //`, `SYS:OK`), shortcuts (`[⌘1]`), dates, and metrics.

---

## 4. Layout & Viewport Specifications

- **Viewport Dimension**: Exactly `100dvh` height and `100vw` width. Global `body` has `overflow: hidden`.
- **Top Window Bar (`AppTopBar`)**:
  - Height: `56px`.
  - Left: System traffic lights (`● ● ●`) and brand node identifier (`BYPUR.APP // v2.4`).
  - Center: Active workspace breadcrumb (`WORKSPACE > 02_SKILLS_MATRIX`).
  - Right: Quick command palette trigger (`[⌘K]`), live status indicator dot (`ONLINE 🟢`), and theme toggle.
- **Floating Island Dock (`AppIslandDock`)**:
  - Position: Floating on the left flank with margin (`ml-4 my-auto`), `rounded-2xl` geometry.
  - Width: `230px` (or collapsed icon rail on narrower desktop viewports).
  - Navigation Nodes: Neumorphic tactile buttons with index (`01`, `02`, etc.), Lucide icon, text label, and keyboard shortcut badge.
  - Active State: Tactile inset pressed depth (`neumorphic-pressed`) with cyan accent glow line.
  - Spring Indicator: Smooth magnetic pill sliding behind the active item.
- **Central Workspace Canvas (`AppWorkspaceCanvas`)**:
  - Fills the remaining viewport height (`h-[calc(100dvh-100px)]`).
  - Dynamic View Switcher with fast crossfade/slide animation (200ms ease-out).
  - Internal panel scrolling (`overflow-y-auto`) enabled only where item volume exceeds viewport space.
- **Bottom Status Bar (`AppStatusBar`)**:
  - Height: `36px`.
  - Monospaced telemetry: Availability status, local time (Purwokerto WIB), Next.js App Router engine tag, and quick GitHub link.
- **Mobile Adaptation**:
  - On viewports < 768px, the left Floating Island Dock automatically shifts to a **Floating Bottom Dock** (native iOS/Android app style).

---

## 5. View & Section Specifications (Distinct Layout Architecture)

Setiap view memiliki komposisi tata letak dan interaksi yang berbeda secara visual untuk menghindari kesan monoton:

### 01. Bio & Profile View (`BioView`)
- **Layout Model**: Asymmetric Split-Screen Stage.
- **Visual Composition**: Neumorphic portrait visual dengan compass coordinates dan soft ambient lighting di kiri; punchy headline, engineering bio, status chips, dan direct action buttons di kanan.

### 02. Skills Bento & Architecture Matrix (`SkillsView`)
- **Layout Model**: System Architecture Tier Rack & Precision Telemetry HUD.
- **Visual Composition**: Horizontal Core Production Runtime slots dan 5 Architecture Tier Bus Lines (`01_CLIENT` hingga `05_AI_SPEC`) dengan tactile key nodes di kiri; Contextual Proof-of-Work HUD dengan live project linkages di kanan.

### 03. Featured Projects Studio (`ProjectsView`)
- **Layout Model**: Master-Detail Engineering Studio Console.
- **Visual Composition**: System Registry & Selector Rail (`SYS-01` s/d `SYS-06`) di kiri; Live Architecture Blueprint stage, real problem statement, architectural highlights, dan interactive interface endpoint console (`GET`, `POST`, `WS`) di kanan.

### 04. Experience & Career Logs (`ExperienceView`)
- **Layout Model**: Zero-Gravity Orbital Timeline Conduit & Floating Station Stage.
- **Visual Composition**: Vertical glowing technical cyan conduit line dengan orbital station markers dan status beacon di kiri; 3D perspective floating station card dengan levitating staggered responsibilities dan tech constellation di kanan.

### 05. Verified Credentials (`CertificatesView`)
- **Layout Model**: Compact Verification Credential Grid.
- **Visual Composition**: Dense tactile credential badges dengan direct verification links dan credential ID inspection.

### 06. Contact & Direct Hub (`ContactView`)
- **Layout Model**: Ergonomic Dual-Channel Console.
- **Visual Composition**: Direct communication channels dengan response SLA di kiri; inset neumorphic quick messaging terminal di kanan.

---

## 6. Motion, Elevation, & Tactile Physics

- **Transition Timing**: Fast and responsive, 180ms to 240ms cubic-bezier(0.16, 1, 0.3, 1).
- **Tactile Keys**: Active buttons exhibit -1px inset translate with soft inner shadows.
- **No Layout Jumps**: View transitions preserve absolute spatial container bounds.
