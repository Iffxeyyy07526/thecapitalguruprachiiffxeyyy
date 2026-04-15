import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./src/app/**/*.css",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "shadow-depth-sm",
    "shadow-depth",
    "hover:shadow-depth",
    "shadow-glow-primary",
    "shadow-glow-primary-sm",
  ],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        surface: "#1a1a1a",
        "surface-dim": "#0e0e0e",
        "surface-container": "#242424",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        primary: "#5DD62C",
        "primary-container": "#4bc025",
        secondary: "#a8a8b0",
        "on-surface": "#e8e8ec",
        "on-surface-muted": "#9b9ba8",
        "outline-variant": "#3d3d44",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(93,214,44,0.12), 0 8px 32px -8px rgba(93,214,44,0.22)",
        "glow-md":
          "0 0 0 1px rgba(93,214,44,0.14), 0 12px 40px -6px rgba(93,214,44,0.28)",
        "glow-lg":
          "0 0 0 1px rgba(93,214,44,0.16), 0 20px 48px -4px rgba(93,214,44,0.32)",
        "glow-primary":
          "0 16px 48px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(93,214,44,0.12)",
        "glow-primary-sm": "0 8px 24px -8px rgba(0,0,0,0.45)",
        depth: "0 12px 40px -12px rgba(0,0,0,0.55), 0 2px 8px -2px rgba(0,0,0,0.35)",
        "depth-sm":
          "0 4px 16px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        "depth-hover":
          "0 20px 48px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        glass:
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        "primary-gradient":
          "linear-gradient(90deg, #5DD62C 0%, #6ee736 50%, #5DD62C 100%)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        soft: "cubic-bezier(0.33, 1, 0.68, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
