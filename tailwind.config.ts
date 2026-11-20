import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Fredoka", "Plus Jakarta Sans", "Poppins", "sans-serif"],
        body: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Palette extracted from reference UI kit
        forest: {
          DEFAULT: "#223F36", // Primary deep forest green (cards, header, main CTA)
          dark: "#172A24",
          light: "#2E554A",
          muted: "#3D695B",
        },
        sage: {
          DEFAULT: "#9DBC98", // Primary sage accent
          dark: "#7B9E76",
          light: "#E8EFE6",
          soft: "#F4F6F2", // Main app canvas background
        },
        coral: {
          DEFAULT: "#EE7A64", // Warm terracotta / coral highlight
          dark: "#D85E48",
          light: "#FDE6E1",
        },
        sand: {
          DEFAULT: "#A0937D",
          light: "#F7F4EF",
          amber: "#F4A261",
        },
        pastel: {
          peach: "#FDE2D2",
          peachText: "#9C4221",
          blue: "#DCEBFF",
          blueText: "#1F5299",
          purple: "#F0DEFD",
          purpleText: "#652399",
          mint: "#E2F0D9",
          mintText: "#356526",
          yellow: "#FEF3C7",
          yellowText: "#92400E",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(34, 63, 54, 0.06)",
        card: "0 2px 12px -2px rgba(34, 63, 54, 0.05)",
        float: "0 12px 36px -4px rgba(34, 63, 54, 0.16)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
