/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:   "#04080f",
        navy2:  "#070d1a",
        navy3:  "#0a1428",
        accent: "#1a6bff",
        cyan:   "#00cfff",
      },
      fontFamily: { syne: ["'Syne'", "sans-serif"] },
    },
  },
  plugins: [],
};
