/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#a855f7", // Used for hover or lighter accents
          DEFAULT: "#9333ea", // Main purple
          dark: "#7e22ce", // Darker variant for strong emphasis
        },
        secondary: {
          light: "#3b82f6", // Used for lighter blue accents
          DEFAULT: "#2563eb", // Main blue
          dark: "#1d4ed8", // Darker blue for emphasis
        },
        accent: {
          light: "#f43f5e", // Used for lighter red/pink accents
          DEFAULT: "#e11d48", // Main red/pink
          dark: "#be123c", // Darker red/pink
        },
        background: {
          light: "#f8fafc", // Light background color
          dark: "#1e293b", // Dark background color for dark mode
        },
        text: {
          light: "#1f2937", // Light text color
          dark: "#f8fafc", // Light text for dark mode
        },
      },

      // Define custom animations
      animation: {
        "bounce-slow": "bounce 3s infinite", // Slow bouncing animation
      },

      logo: {
        glowLight: "#d8b4fe", // Glow effect in light mode (purple-400/30 equivalent)
        glowDark: "#a78bfa", // Glow effect in dark mode (purple-400/20 equivalent)
        bgLightStart: "#f3e8ff", // Icon background gradient start (purple-100)
        bgLightEnd: "#dbeafe", // Icon background gradient end (blue-100)
        bgDarkStart: "#5b21b6", // Icon background gradient start (purple-900)
        bgDarkEnd: "#1e3a8a", // Icon background gradient end (blue-900)
        textLight: "#7c3aed", // Text gradient start (purple-600)
        textDark: "#2563eb", // Text gradient end (blue-600)
      },
      // Define custom gradients
      backgroundImage: {
        "hero-light":
          "radial-gradient(circle, rgba(167,85,247,0.3) 0%, rgba(59,130,246,0.3) 100%)",
        "hero-dark":
          "radial-gradient(circle, rgba(126,34,206,0.3) 0%, rgba(29,78,216,0.3) 100%)",
        "secondary-light": "linear-gradient(to right, #a855f7, #3b82f6)",
        "secondary-dark": "linear-gradient(to right, #7e22ce, #1d4ed8)",
      },
    },
  },

  plugins: [],
};
