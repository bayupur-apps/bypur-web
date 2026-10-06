---
version: "alpha"
name: "Neumorphic Muted Slate & Technical Cyan"
description: "Neumorphic landing page, soft ui, tech schematic, muted slate background, soft shadows, clean layout, hub and spoke design. Ideal for landing pages, modern websites. AI-ready template."
colors:
  primary: "#F1F5F9"
  secondary: "#0F172A"
  tertiary: "#0284C7"
  neutral: "#FFFFFF"
  surface: "#CBD5E1"
  accent: "#0284C7"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: 700
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: 400
rounded:
  sm: 20px
  md: 40px
  lg: 60px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
    padding: 12px
---

## Overview

Neumorphic Muted Slate & Technical Cyan landing page, soft UI, technical schematic, muted cool slate background, soft shadows, clean layout, hub and spoke design. Ideal for landing pages, modern websites. AI-ready template. Technical and modern, highly neutral and professional: soft neumorphic depth layered with crisp architectural slate lines, monospaced tech indicators, and muted electric cyan accents.

The schematic layer provides engineered structure. Precision lines, grid overlays, monospaced type, circuit-board patterns — giving neumorphism clear function and hierarchy.

- Density: 5/10 — Balanced
- Variance: 4/10 — Moderate
- Motion: 4/10 — Subtle

- **Style:** Professional, Informative, Technical Neutral
- **Keywords:** neumorphic, schematic, muted slate, technical cyan, soft shadows, professional, hub and spoke
- **Era:** Modern Professional Tech
- **Light/Dark:** ✓ Light Mode Default (Full Toggle Support)

## Colors

- **Background** (#F1F5F9) — Primary muted cool slate background surface
- **Text** (#0F172A) — Deep slate charcoal primary text color
- **Accent** (#0284C7) — Muted technical cyan primary accent, CTAs and interactive elements
- **Shadow Light** (#FFFFFF) — Soft highlight surface
- **Shadow Dark** (#CBD5E1) — Muted slate contrast surface shadow
- **Flow Line** (#0284C7) — Tech schematic flow line accent


## Typography

- **Display / Hero:** Plus Jakarta Sans — Weight 700, tight tracking, used for headline impact
- **Body:** Plus Jakarta Sans — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** Plus Jakarta Sans — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, technical values, and schematic tags

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem


## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).


## Section Layout Specifications (Hero to Footer)

### 1. Site Header & Navigation (`SiteHeader`)
- **Layout**: Fixed top bar with dynamic scroll behavior. On scroll, transforms into a centered floating neumorphic pill container (`max-w-5xl rounded-2xl`).
- **Elements**: Brand logo left, desktop link items centered with pill active-state indicator (`bg-accent/10 text-accent-ink`), theme toggle (Sun/Moon), and "Get in touch" CTA right.
- **Mobile Behavior**: Collapses into a neumorphic menu button; opens a smooth slide-down glass drawer containing vertical link nodes with `ArrowUpRight` indicators.

### 2. Hero Section (`HeroSection`)
- **Layout**: Asymmetric 2-column split-screen grid (`1.1fr_1fr`).
- **Left Column**: Monospaced status tag (`// AVAILABILITY`), main Space Grotesk headline, bio summary paragraph, primary action CTA button, and social link triggers.
- **Right Column (Visual Hub)**: Neumorphic circular portrait frame with soft ambient diffuse aura, floating metric chips (Years Experience, Key Skills), and interactive status indicators.
- **Scroll Indicator**: Floating scroll cue button centered at the bottom edge.

### 3. About Section (`AboutSection`)
- **Layout**: Asymmetric 2-column layout (`1fr_1.2fr`) with schematic divider header.
- **Left Column**: Monospaced category tag (`01 // ABOUT`), section title, and highlighted key metrics cards styled with neumorphic depth (`6px 6px 14px`).
- **Right Column**: Detailed technical background story, core engineering philosophy cards, and key strength badges.

### 4. Skills & Tech Stack Section (`StackSection`)
- **Layout**: Central Hub & Spoke schematic layout grouped into 4 distinct domain cards (Frontend, Backend, DevOps & Cloud, Tools & Practices).
- **Cards**: Neumorphic containers (`rounded-2xl`) featuring inset pressed badge tags, JetBrains Mono skill labels, and subtle accent status dots.
- **Interactive Feedback**: Hovering cards elevates soft shadows and highlights schematic flow lines.

### 5. Certificates Section (`CertificatesSection`)
- **Layout**: Responsive 2-column / 3-column grid of credential cards. (Automatically omitted if no certificates exist to prevent broken anchors).
- **Cards**: Soft neumorphic surface containing issuing organization icon, certificate title, credential ID in JetBrains Mono, issue date, and "Verify Credential" link button.

### 6. Experience Section (`ExperienceSection`)
- **Layout**: Vertical timeline schematic layout featuring a central connecting guide line with neumorphic node markers.
- **Timeline Items**: Card blocks containing role title, company badge, date pill, key technical achievements bullet points, and tech stack tags.

### 7. Projects Section (`ProjectsSection`)
- **Layout**: Featured project showcase layout followed by a 2-column secondary project grid.
- **Featured Cards**: Split-screen card (mockup left, project narrative right) with live demo CTA (`ArrowUpRight`), GitHub repo link, and tech stack badges.
- **Grid Cards**: Neumorphic cards with project screenshot frames, concise summary, role tag, and link triggers.

### 8. Contact Section (`ContactSection`)
- **Layout**: 2-column interactive hub (`1fr_1.2fr`).
- **Left Column**: Direct contact channels (Email, Phone, Location) with neumorphic icon buttons, response time SLA badge, and social link grid.
- **Right Column**: Neumorphic interactive contact form with pressed inset inputs (`neumorphic-pressed`), focus rings, label titles, and submit button with status states (Idle, Submitting, Success, Error).

### 9. Site Footer (`SiteFooter`)
- **Layout**: 3-column top grid with bottom copyright bar separated by a subtle gradient divider line.
- **Top Grid**: Brand tagline & bio left, quick navigation links middle, and direct social links right.
- **Bottom Bar**: Copyright text, "Built with Next.js & Tailwind", and a neumorphic "Back to Top" circular scroll trigger.


## Elevation & Depth

Soft circular containers, smooth matte digital surface, soft diffuse ambient lighting, gentle drop shadows (neumorphic effect).

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

Base corner radius: 20px. See rounded tokens in front matter for the full scale.


## Components

- **Primary Button:** Rounded (20px) shape. Muted cyan accent fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Neumorphic outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Rounded (20px) corners. Neumorphic soft surface. Shadow (3px 3px 8px rgba(203, 213, 225, 0.65), -3px -3px 8px rgba(255, 255, 255, 0.9)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px muted cyan accent offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background with neumorphic depth. Active item: muted cyan accent indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.


## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No pure black (#000000) — use deep slate charcoal (#0F172A)
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do Neumorphic shadows (light/dark interact)
- Do Soft rounded corners (20px)
- Do Central hub layout
- Do Tech blueprint flow lines
- Do Minimalist icons


## Use Case

Landing pages, Modern websites
