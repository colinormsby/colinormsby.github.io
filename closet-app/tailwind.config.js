/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        accent: "#e94560",
        surface: "#f8f8f8",
        muted: "#9ca3af",
      },
    },
  },
  plugins: [],
};
