/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B4AEF',
          dark: '#4638C8',
          hover: '#5141DC',
          light: '#F0EEFF',
          soft: '#E9E6FF',
        },
        secondary: {
          DEFAULT: '#7C6FF2',
          light: '#F4F2FF',
        },
        bg: {
          DEFAULT: '#F7F8FC',
          soft: '#FAFAFD',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F4F8',
          muted: '#F8F8FC',
        },
        ink: {
          primary: '#15152A',
          secondary: '#3F4154',
          muted: '#6B6F82',
          disabled: '#A0A3B1',
        },
        border: {
          DEFAULT: '#E5E7EF',
          strong: '#D4D7E2',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#ECFDF3',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFF7E6',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(21, 21, 42, 0.04)',
        md: '0 4px 12px rgba(21, 21, 42, 0.06)',
        lg: '0 12px 30px rgba(21, 21, 42, 0.08)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [],
}