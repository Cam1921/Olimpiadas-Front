/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Comfortaa"', "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
}
