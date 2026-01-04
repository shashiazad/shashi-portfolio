/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e6ecff',
          200: '#cbd6ff',
          300: '#a0b5ff',
          400: '#6e8aff',
          500: '#4460ff',
          600: '#2e43d6',
          700: '#2435a8',
          800: '#1f2b84',
          900: '#192366'
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(68,96,255,0.35)'
      },
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(ellipse at center, rgba(68,96,255,.2), transparent 60%)',
        'gradient-brand':
          'linear-gradient(135deg, #4460ff 0%, #6e8aff 50%, #a0b5ff 100%)'
      }
    }
  },
  plugins: []
};
