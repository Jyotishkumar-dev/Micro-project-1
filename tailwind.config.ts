import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#070B16",
          900: "#0A1020", // Primary dark background
          850: "#0E1528",
          800: "#101429", // Card background
          750: "#141A33",
          700: "#1A2242",
          600: "#222D54",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        cyan: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
        },
        dark: {
          base: "#0A1020",
          card: "#101429",
          hover: "#141A33",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.03)",
        },
        light: {
          base: "#F8FAFC",
          card: "#FFFFFF",
          hover: "#F1F5F9",
          border: "rgba(0, 0, 0, 0.08)",
          subtle: "rgba(0, 0, 0, 0.02)",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%": { opacity: "0.3", filter: "blur(20px)" },
          "100%": { opacity: "0.6", filter: "blur(30px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
