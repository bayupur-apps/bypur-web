# Bayu Purnomo - Portfolio

Personal portfolio website showcasing my work as a **Backend & Systems Engineer**.

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
[![CI Pipeline](https://github.com/bayupaths/bypur-web/actions/workflows/ci.yml/badge.svg)](https://github.com/bayupaths/bypur-web/actions/workflows/ci.yml)
[![CodeQL](https://github.com/bayupaths/bypur-web/actions/workflows/codeql.yml/badge.svg)](https://github.com/bayupaths/bypur-web/actions/workflows/codeql.yml)

> Built with modern tech stack: Next.js 16, React 19, TypeScript, and Tailwind CSS v4

## ✨ Features

- 🎨 **Modern Design** - Clean & minimalist interface
- 🌗 **Dark Mode** - System-based theme switching
- 📱 **Responsive** - Mobile-first design approach
- ⚡ **Fast Performance** - Optimized with Next.js SSR/SSG
- 🎭 **Smooth Animations** - Framer Motion interactions
- 📊 **Portfolio Showcase** - Projects, skills, and experience
- 📧 **Contact Form** - Easy way to get in touch
- ♿ **Accessible** - WCAG compliant

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
# Open http://localhost:3000

# Build for production
pnpm build
pnpm start
```

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.2.9 (App Router)
- React 19 with Server Components
- TypeScript 5
- Tailwind CSS v4
- Framer Motion 12

**Development:**
- Jest & React Testing Library
- Playwright for E2E testing
- ESLint for code quality
- pnpm for package management

**Deployment:**
- Docker containerization
- Nginx reverse proxy
- CI/CD automation

## 📁 Project Structure

```
bypur-app/
├── app/                   # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── sections/         # Page sections (Hero, About, Projects, etc.)
│   └── ui/               # Reusable UI components
├── lib/                   # Core library
│   ├── data/             # Portfolio content (edit here!)
│   │   ├── profile.ts    # Personal info
│   │   ├── projects.ts   # Your projects
│   │   ├── skills.ts     # Tech skills
│   │   └── experiences.ts # Work history
│   └── types.ts          # TypeScript types
├── __tests__/            # Tests
└── public/               # Static assets
```

## 📝 Customize Content

Edit portfolio content di folder `lib/data/`:

```typescript
// lib/data/profile.ts - Update personal info
export const profile = {
  name: "Bayu Purnomo",
  title: "Backend & Systems Engineer",
  email: "bayupurnomo.dev@gmail.com",
  // ... edit sesuai kebutuhan
};

// lib/data/projects.ts - Add your projects
export const projects = [
  {
    title: "Your Project",
    description: "Project description",
    techStack: ["Next.js", "TypeScript"],
    // ...
  },
];
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

**Test Stats:** 98 tests passing across unit, integration, and E2E tests.

## 📦 Deployment

Deployed menggunakan Docker dengan CI/CD automation.

```bash
# Docker deployment
pnpm docker:up

# Manual deployment
pnpm build
pnpm start
```

## 💻 Development

**Local Development:**
```bash
# Start development server
pnpm dev

# Run tests while coding
pnpm test:watch

# Check code quality
pnpm lint
```

**Before Committing:**
```bash
pnpm lint    # ✅ Code quality check
pnpm test    # ✅ Run all tests
pnpm build   # ✅ Ensure build works
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Check code quality |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Test watch mode |
| `pnpm test:coverage` | Test coverage report |
| `pnpm docker:up` | Start with Docker |
| `pnpm docker:down` | Stop Docker containers |

## 🛠️ Built With

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Jest & Playwright** - Comprehensive testing
- **Docker** - Containerized deployment
- **Jenkins** - CI/CD automation

## 📄 License

Personal portfolio © 2026 Bayu Purnomo

## 📧 Contact

- **Email**: bayupurnomo.dev@gmail.com
- **GitHub**: [@bayupaths](https://github.com/bayupaths)
- **LinkedIn**: [Bayu Purnomo](https://www.linkedin.com/in/bayupaths)

---

Built with ❤️ by Bayu Purnomo
