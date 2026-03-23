/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gpcet: {
          bg: '#0A0F1E',
          card: '#111827',
          border: '#1F2937',
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#8B5CF6',
          nptel: '#059669',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#F9FAFB',
          muted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
