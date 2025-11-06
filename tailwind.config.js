/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { comfortaa: ['Comfortaa','ui-sans-serif','system-ui'] },
      colors: { primary:"#23263D", bg:"#F8FAFB", cta:"#0284C7", accent:"#06A84F" },
      boxShadow: { card: "0 10px 15px -3px rgba(2,8,23,.05), 0 4px 6px -2px rgba(2,8,23,.03)" },
    },
  },
  plugins: [],
};
