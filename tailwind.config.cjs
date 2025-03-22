/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        text: "var(--text)",
        background: "var(--background)",
      },
      keyframes: {
        idle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        attack: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
          "100%": { transform: "translateX(0)" },
        },
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        idle: "idle 3s ease-in-out infinite",
        attack: "attack 0.5s ease-in-out",
        flash: "flash 0.5s ease-in-out",
        bounce: "bounce 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
