import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0284c7",
          foreground: "#ffffff",
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0284c7",
          600: "#0369a1",
          700: "#075985",
        },
        medical: {
          teal: "#0d9488",
          emerald: "#10b981",
          blue: "#2563eb",
          slate: "#0f172a",
          dark: "#1e293b",
          light: "#f8fafc",
          accent: "#06b6d4"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
