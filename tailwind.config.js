/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.html",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
    "./resources/**/*.vue",
  ],

  theme: {
    extend: {
      colors: {
        // =========================
        // Quenza Brand
        // =========================
        quenza: {
          bg: "#F7FAFC",
          primary: "#20D375",
          secondary: "#0E5C4A",
          tertiary: "#0F6D5C",

          // Text
          text: {
            primary: "#0B0B0B",
            secondary: "#7F837B",
            muted: "#9CA3AF",
            inverse: "#FFFFFF",
          },

          // Status
          success: "#20D375",
          danger: "#E22A2A",
          warning: "#D1A12A",
          pending: "#D17D2A",

          // UI
          sidebar: "#0E5C4A",
          active: "#0A3D31",
          card: "#0C4D3E",
          light: "#B5ECCA",
          dark: "#10634A",

          // AI
          ai: "#6D5AE0",
        },

        // =========================
        // Semantic Colors
        // =========================
        success: {
          50: "#ECFDF3",
          100: "#D1FAE5",
          500: "#20D375",
          600: "#16B864",
          700: "#0E9650",
        },

        danger: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#E22A2A",
          600: "#C91F1F",
          700: "#A71919",
        },

        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#D1A12A",
          600: "#B8891E",
          700: "#946F17",
        },
      },

      // =========================
      // Typography
      // =========================
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],

        serif: [
          "Georgia",
          "ui-serif",
          "serif",
        ],
      },

      fontSize: {
        "quenza-small": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "-0.01em",
          },
        ],

        "quenza-medium": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "-0.01em",
          },
        ],

        "quenza-large": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
          },
        ],

        "quenza-xlarge": [
          "20px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.02em",
          },
        ],

        "quenza-2xlarge": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.02em",
          },
        ],

        "quenza-3xlarge": [
          "30px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.02em",
          },
        ],

        "quenza-4xlarge": [
          "36px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.025em",
          },
        ],

        "quenza-5xlarge": [
          "48px",
          {
            lineHeight: "1",
            letterSpacing: "-0.03em",
          },
        ],
      },

      fontWeight: {
        "quenza-light": "300",
        "quenza-regular": "400",
        "quenza-medium": "500",
        "quenza-semibold": "600",
        "quenza-bold": "700",
        "quenza-extrabold": "800",
      },

      // =========================
      // Border Radius
      // =========================
      borderRadius: {
        "quenza-sm": "6px",
        "quenza-md": "8px",
        "quenza-lg": "12px",
        "quenza-xl": "16px",
        "quenza-2xl": "20px",
      },

      // =========================
      // Shadows
      // =========================
      boxShadow: {
        "quenza-card":
          "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",

        "quenza-card-hover":
          "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",

        "quenza-dropdown":
          "0 10px 30px rgba(0, 0, 0, 0.10)",

        "quenza-modal":
          "0 20px 50px rgba(0, 0, 0, 0.15)",
      },

      // =========================
      // Transitions
      // =========================
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
      },

      // =========================
      // Z Index
      // =========================
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },

  plugins: [],
};