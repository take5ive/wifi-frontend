/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "7.5rem",
      },
      spacing: {
        18: "4.5rem",
        100: "25rem",
        150: "37.5rem",
        200: "50rem",
      },
      boxShadow: {
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.03), 0 4px 6px -4px rgb(0 0 0 / 0.03)",
      },
      colors: {
        primary: {
          50: "#e8f7ff",
          100: "#d5efff",
          200: "#b3dfff",
          300: "#85c7ff",
          400: "#56a0ff",
          500: "#2f79ff",
          600: "#0c4cff",
          700: "#0544ff",
          800: "#063bcd",
          900: "#103a9f",
          950: "#0a205c",
        },
      },
    },
  },
  plugins: [],
};
