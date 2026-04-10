import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 米白系配色
        background: "#FAF5EF",
        card: "#FFF8F0",
        primary: {
          DEFAULT: "#C4A77D",
          dark: "#8B7355",
        },
        text: {
          primary: "#4A4039",
          secondary: "#7D7062",
        },
        success: "#6B8E6B",
        error: "#C67B6B",
        border: "#E8E0D5",
        // 签到按钮颜色
        unchecked: {
          DEFAULT: "#F5C842",
          dark: "#E8B830",
        },
        checked: {
          DEFAULT: "#4A90D9",
          dark: "#3B7DD8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "shake": "shake 0.3s ease-in-out",
        "pulse-once": "pulse-once 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
        "pulse-once": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
