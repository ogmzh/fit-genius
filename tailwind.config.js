/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          paper: "#1E293B",
          dark: "#0F172A",
          accent: "#0EA5E9",
          accentLight: "#38bdf8",
          light: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
