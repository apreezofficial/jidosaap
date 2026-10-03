import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
          DEFAULT: "#E11D48", // Japanese vermilion red accent
          hover: "#BE123C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#18181B", // Deep charcoal
          foreground: "#FAFAFA",
        },
        muted: {
          DEFAULT: "#F4F4F5",
          foreground: "#71717A",
        },
        accent: {
          DEFAULT: "#FFF1F2",
          foreground: "#9F1239",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#E11D48",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "Outfit", "var(--font-plus-jakarta)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        outfit: ["var(--font-outfit)", "Outfit", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["var(--font-outfit)", "Outfit", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
