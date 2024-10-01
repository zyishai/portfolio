import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"Playfair Display"',
          '"Libre Baskerville"',
          "ui-serif",
          "serif"
        ],
        sans: [
          '"Lato"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        foam: '#e7ecef',
        ocean: '#457b9d',
        navy: '#274c77'
      }
    },
  },
  plugins: [],
} satisfies Config;
