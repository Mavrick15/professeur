/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./pages/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        medical: {
          blue: "#0369a1",
          teal: "#0d9488",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      fontSize: {
        "9xl": ["8rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
      },
      animation: {
        marquee: "scroll 40s linear infinite",
        shimmer: "shimmer 3s infinite linear",
        scan: "scan 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        scan: {
          "0%": { top: "0%", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(13, 148, 136, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(13, 148, 136, 0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
