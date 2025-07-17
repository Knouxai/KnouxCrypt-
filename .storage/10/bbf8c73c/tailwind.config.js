/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#D946EF',
        'deep-purple-900': '#4C1D95',
        'indigo-800': '#5B21B6',
        'glass-bg-start': 'rgba(255, 255, 255, 0.08)',
        'glass-bg-end': 'rgba(255, 255, 255, 0.05)',
        'card-darker': 'rgba(15, 23, 42, 0.5)',
      },
      blur: {
        'custom-24': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 41, 55, 0.37)',
        'neon-purple-glow': '0 0 10px #D946EF, 0 0 20px #D946EF, 0 0 30px #D946EF',
      }
    },
  },
  plugins: [],
}