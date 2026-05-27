/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B0F19",
          soft: "#0F1422",
          card: "#141A2A",
          elevated: "#1A2236",
        },
        primary: {
          DEFAULT: "#7C3AED",
          50: "#f5f3ff",
          400: "#a78bfa",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        secondary: {
          DEFAULT: "#06B6D4",
          400: "#22d3ee",
          500: "#06B6D4",
          600: "#0891b2",
        },
        glow: "#8B5CF6",
      },
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', "sans-serif"],
        sans: ['"Geist"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(139, 92, 246, 0.45)",
        "glow-cyan": "0 0 40px -8px rgba(6, 182, 212, 0.45)",
        card: "0 8px 32px -8px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(124,58,237,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.07) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.18), transparent 60%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "spin-slow": "spin 12s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.4 },
          "50%": { opacity: 0.9 },
        },
        gradientX: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
