/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          blue: '#0071e3',
          'blue-hover': '#0077ED',
          bg: '#000000',
          card: '#1d1d1f',
          text: '#f5f5f7',
          gray: '#86868b',
          'gray-light': '#a1a1a6',
          'gray-dark': '#424245',
          divider: '#424245',
          'link-footer': '#424245',
        },
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0,0,0,0.3)',
        'apple-md': '0 4px 12px rgba(0,0,0,0.4)',
        'apple-lg': '0 8px 30px rgba(0,0,0,0.5)',
        'apple-card': '2px 4px 12px rgba(0,0,0,0.08)',
        'apple-card-hover': '2px 4px 16px rgba(0,0,0,0.16)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'siri-rotate': 'siriRotate 4s linear infinite',
        'siri-pulse': 'siriPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        siriRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        siriPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
