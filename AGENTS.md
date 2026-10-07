# Agent Instructions (`bypur-app`)

This repository is **bypur-app**, a Next.js / React e-commerce web application.
All AI coding agents operating within this workspace MUST strictly follow the directives, design standards, and coding principles outlined below.

---

## 1. Core Operating Principles

### A. Anti-Slop (UI, Copywriting, & Design Filter)
Always produce UI and copy that feel **crafted by a designer** and written by a human. Do not output generic "AI slop".

- **Design Direction (`DESIGN.md`)**: Before building or modifying UI elements, read [`DESIGN.md`](file:///d:/01-bayu-purnomo/projects/bayu-apps/bypur-app/DESIGN.md). All UI choices must adhere to the design system (color palette, typography, layout rhythm, elevation).
- **Hard Gate Rules**:
  - **No Em-Dashes (`—`)**: Do not use the em-dash character in any UI text or copywriting. Use commas, colons, or parentheses instead.
  - **Mobile Responsiveness**: Must be perfect across all screen sizes. No horizontal scroll/overflow, minimum tap target 44px.
  - **Color Contrast**: All text must pass WCAG AA standards (4.5:1 normal text, 3:1 large text).
  - **UI States**: Every dynamic view/component MUST implement Empty, Loading, and Error states.
  - **Interactive Elements**: Every button and link must perform a real action (navigation, dialog toggle, state update, or form submission). No dead controls or links to non-existent routes.
  - **No Fabricated Claims or Fake Data**: Never invent fake testimonials, fake stats ("99.9% uptime", "10k+ users"), or fake security badges without real data. Use explicit placeholders like `[REAL DATA]` if missing.
  - **Layout Diversity & Dynamic Rhythm (No Monotonous Layouts)**: Setiap view/page/section WAJIB memiliki arsitektur layout dan komposisi yang berbeda, unik, dan disesuaikan dengan jenis datanya. DILARANG menggunakan struktur visual/template yang seragam atau monoton antar-page (misal mengulang 3-card grid yang sama di semua section). Setiap view harus memiliki karakter tata letak tersendiri (e.g. Master-Detail Console, Zero-Gravity Orbital Conduit, Architecture Tier Rack, Split Stage, etc.).
  - **Verification Gate**: Build/test the app and inspect interactive elements before declaring a task complete.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `DESIGN.md` for direction, then `antislop.md` (core) and the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
<!-- antislop:end -->

---

### B. Ponytail (Minimalist & YAGNI Engineering)
Channel a senior developer who values simplicity, minimal diffs, and native platform features over unnecessary abstractions.

- **The Ponytail Ladder**:
  1. **Does this need to exist at all?** (YAGNI - if speculative, skip it).
  2. **Already in codebase?** Search and reuse existing utilities/types/helpers before writing new ones.
  3. **Stdlib / Native Platform first?** Use native HTML5/CSS and built-in JavaScript/Node APIs before adding dependencies or custom helper logic.
  4. **Installed dependencies?** Leverage existing packages (e.g. Lucide, Next.js built-ins) instead of pulling in new ones.
  5. **Shortest working diff**: Write the minimal code that solves the issue correctly.
- **Root-Cause Fixes**: Always fix bugs at the root cause, not by wrapping symptoms with silent try-catches, fallback defaults, or redundant caller-side guards.
- **No Over-Engineering**:
  - No single-implementation interfaces/factories.
  - No unrequested boilerplate or speculative "for future use" architecture.
  - Deletion over addition; simple over clever.
- **Deliberate Shortcuts**: If an intentional simplification is made with a known ceiling, mark it with a `# ponytail:` or `// ponytail:` comment describing the upgrade path.

---

## 2. Tech Stack & Workspace Standards

- **Framework**: Next.js (App Router), React, TypeScript.
- **Styling**: Tailwind CSS + Custom CSS (refer to [`DESIGN.md`](file:///d:/01-bayu-purnomo/projects/bayu-apps/bypur-app/DESIGN.md) tokens).
- **Testing**: Jest (`pnpm test`), Playwright (`pnpm test:e2e`).
- **Code Quality**: ESLint (`pnpm lint`), TypeScript (`pnpm type-check` or `npx tsc --noEmit`).

---

## 3. Workflow & Verification Checklist

Before reporting completion on any task:
1. **Lint & Type Check**: Ensure no TypeScript or ESLint errors exist (`pnpm lint`).
2. **Test Suite**: Run relevant tests (`pnpm test`) and ensure all pass without broken assertions.
3. **UI & Responsive Check**: Verify layout integrity on mobile and desktop viewports, with WCAG contrast compliance.
4. **Clean Commits & Diffs**: Maintain clean, minimal code diffs without AI-slop comments or speculative boilerplate.
