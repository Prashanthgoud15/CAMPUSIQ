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
          bg: 'var(--gpcet-bg)',
          card: 'var(--gpcet-card)',
          border: 'var(--gpcet-border)',
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#8B5CF6',
          nptel: '#059669',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: 'var(--gpcet-text)',
          muted: 'var(--gpcet-muted)',
          navbar: 'var(--gpcet-navbar)',
          sidebar: 'var(--gpcet-sidebar)'
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
