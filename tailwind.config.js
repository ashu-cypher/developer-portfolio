/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05070f", // page background
        abyss: "#0a0f22", // section background
        panel: "#0d1428", // card background
        line: "rgba(148, 163, 184, 0.14)", // hairline borders
        neon: {
          DEFAULT: "#22d3ee", // cyan accent
          dim: "#0e7490",
          glow: "#67e8f9",
        },
        pulse: {
          DEFAULT: "#a78bfa", // violet accent
          dim: "#6d28d9",
          glow: "#c4b5fd",
        },
        ink: "#e8eefc", // primary text
        mist: "#93a0bd", // secondary text
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
      },
      boxShadow: {
        "neon-glow": "0 0 24px rgba(34, 211, 238, 0.35)",
        "panel-glow": "0 8px 40px rgba(2, 6, 18, 0.6)",
      },
    },
  },
  plugins: [],
};
