import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
        BMJUA: ["var(--font-bmjua)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        light: {
          text: {
            DEFAULT: "var(--light-text)",
          },
          background: {
            DEFAULT: "var(--light-background)",
          },
          border: {
            DEFAULT: "var(--light-border)",
          },
        },
        dark: {
          text: {
            DEFAULT: "var(--dark-text)",
          },
          background: {
            DEFAULT: "var(--dark-background)",
          },
          border: {
            DEFAULT: "var(--dark-border)", // 라이트 모드 border 색상 추가
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
