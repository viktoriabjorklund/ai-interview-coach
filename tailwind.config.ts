import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#214f78", // topp-baren + wave
        brandBg: "#f3f4f6",   // ljusgrå bakgrund
      },
    },
  },
  plugins: [],
};

export default config;
