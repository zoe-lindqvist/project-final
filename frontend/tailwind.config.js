/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          },
        },
      },
      animation: {
        "bounce-slow": "bounce-slow 3s infinite",
      },
      colors: {
        // Purple shades used in the Logo
        primary: {
          light: "#e9d5ff", // Matches purple-100
          DEFAULT: "#a855f7", // Matches purple-400
          dark: "#7e22ce", // Matches purple-900
          accent: "#9333ea", // Matches purple-600
        },

        // Blue shades used in the Logo
        secondary: {
          light: "#dbeafe", // Matches blue-100
          DEFAULT: "#60a5fa", // Matches blue-400
          dark: "#1e3a8a", // Matches blue-900
          accent: "#2563eb", // Matches blue-600
        },

        // Gray text colors used in the Logo
        text: {
          light: "#6b7280", // Matches gray-500
          dark: "#9ca3af", // Matches gray-400
        },
      },

      // Custom background gradients for Logo effects
      backgroundImage: {
        // Glow effect behind the icon
        "logo-glow-light":
          "linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(96, 165, 250, 0.3))", // purple-400/30 to blue-400/30
        "logo-glow-dark":
          "linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(96, 165, 250, 0.2))", // purple-400/20 to blue-400/20

        // Icon background gradient
        "logo-icon-light": "linear-gradient(to right, #e9d5ff, #dbeafe)", // purple-100 to blue-100
        "logo-icon-dark":
          "linear-gradient(to right, rgba(126, 34, 206, 0.5), rgba(30, 64, 175, 0.5))", // purple-900/50 to blue-900/50

        // Text gradient
        "logo-text-light": "linear-gradient(to right, #9333ea, #2563eb)", // purple-600 to blue-600
        "logo-text-dark": "linear-gradient(to right, #a855f7, #60a5fa)", // purple-400 to blue-400
      },
    },
  },
  plugins: [],
};
