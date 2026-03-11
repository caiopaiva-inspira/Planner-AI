import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        card: "var(--card)",
        primary: "var(--primary-text)",
        secondary: "var(--secondary-text)",
        active: "var(--active)",
        "active-text": "var(--active-text)",
        "accent-dot": "var(--accent-dot)",
        "brand-blue": "var(--brand-blue)",
      },
    },
  },
  plugins: [],
}

export default config
