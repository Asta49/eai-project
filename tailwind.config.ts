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

        // Palette extracted from lofee reference UI kit (s1.png & s2.png)
        brand: {
          pink: "#F04D7E", // Signature Berry Rose (Heart, Period, Primary CTA)
          pinkLight: "#FFF0F4",
          pinkHover: "#D83868",
          purple: "#6C70EB", // Periwinkle Purple (Ovulation, Active Tab, Next CTA)
          purpleLight: "#EEF0FF",
          purpleHover: "#585CD6",
        },
        lofee: {
          bg: "#FFF6F8", // Soft warm blush canvas
          card: "#FFFFFF",
          text: "#2D2528", // Deep soft charcoal for titles
          muted: "#8E8388", // Secondary text
          border: "#F5E8EB",
          peach: "#FFE8EF",
          mint: "#E8F8F5",
          yellow: "#FEF9C3",
          sky: "#EEF2FF",
        },
        forest: {
          DEFAULT: "#F04D7E", // Map legacy tokens cleanly to Rose Pink
          dark: "#D83868",
          light: "#FFF0F4",
          muted: "#8E8388",
        },
        sage: {
          DEFAULT: "#6C70EB", // Map legacy tokens to Periwinkle Purple
          dark: "#585CD6",
          light: "#EEF0FF",
          soft: "#FFF6F8",
        },
        coral: {
          DEFAULT: "#F04D7E",
          dark: "#D83868",
          light: "#FFE8EF",
        },
        sand: {
          DEFAULT: "#8E8388",
          light: "#FFF6F8",
          amber: "#FEF9C3",
        },
        pastel: {
          peach: "#FFE8EF",
          peachText: "#A82D50",
          blue: "#EEF0FF",
          blueText: "#4348C7",
          purple: "#F3E8FF",
          purpleText: "#6B21A8",
          mint: "#E8F8F5",
          mintText: "#1F7A65",
          yellow: "#FEF9C3",
          yellowText: "#854D0E",
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
