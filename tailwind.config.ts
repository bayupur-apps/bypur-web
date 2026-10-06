import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "Cascadia Code",
          "Source Code Pro",
          "Menlo",
          "monospace",
        ],
      },

      colors: {
        bg: "var(--bg)",
        "bg-subtle": "var(--bg-subtle)",
        card: "var(--bg-card)",
        border: "var(--border)",
        text: {
          1: "var(--text-1)",
          2: "var(--text-2)",
          3: "var(--text-3)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          fg: "var(--accent-fg)",
        },
      },

      borderRadius: {
        DEFAULT: "0.75rem",
        sm: "0.5rem",
        lg: "1rem",
        full: "9999px",
      },

      maxWidth: {
        container: "72rem",
        prose: "48rem",
      },

      padding: {
        container: "1.25rem",
      },

      spacing: {
        section: "7rem",
        18: "4.5rem",
      },

      fontSize: {
        display: [
          "clamp(2.5rem, 5vw + 0.75rem, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        heading: [
          "clamp(1.75rem, 3vw + 0.5rem, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        subheading: [
          "clamp(1rem, 1.25vw + 0.375rem, 1.125rem)",
          { lineHeight: "1.7", fontWeight: "400" },
        ],
      },

      boxShadow: {
        xs: "0 1px 2px rgba(35, 47, 62, 0.04)",
        sm: "0 2px 4px rgba(35, 47, 62, 0.06)",
        md: "0 4px 8px rgba(35, 47, 62, 0.08)",
      },

      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "orbit-1": {
          "0%": { transform: "rotate(0deg) translateX(130px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(130px) rotate(-360deg)" },
        },
        "orbit-2": {
          "0%": { transform: "rotate(90deg) translateX(130px) rotate(-90deg)" },
          "100%": { transform: "rotate(450deg) translateX(130px) rotate(-450deg)" },
        },
        "orbit-3": {
          "0%": { transform: "rotate(180deg) translateX(180px) rotate(-180deg)" },
          "100%": { transform: "rotate(540deg) translateX(180px) rotate(-540deg)" },
        },
        "orbit-4": {
          "0%": { transform: "rotate(270deg) translateX(180px) rotate(-270deg)" },
          "100%": { transform: "rotate(630deg) translateX(180px) rotate(-630deg)" },
        },
      },

      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.5s ease both",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-slower": "float 8s ease-in-out 1s infinite",
        "orbit-1": "orbit-1 18s linear infinite",
        "orbit-2": "orbit-2 18s linear infinite",
        "orbit-3": "orbit-3 28s linear infinite",
        "orbit-4": "orbit-4 28s linear infinite",
      },

      transitionDuration: {
        DEFAULT: "200ms",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
