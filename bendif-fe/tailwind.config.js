/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode support
  content: ['index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#070F2B',
        secondary: '#AAB9C5',
        background: '#F0EEED',
        accent: '#FF4141',
        neutral: {
          100: '#e3e3e3',
          200: '#cccbcb',
          300: '#b5b3b3',
          400: '#9F9C9C',
          500: '#898384',
          600: '#726C6C',
          700: '#5A5555',
          800: '#433E3F',
          900: '#2B2829',
          1000: '#151314',
        },
        success: {
          100: '#a4f4e7',
          200: '#15b097',
          300: '#0b7b69',
        },
        warning: {
          100: '#f4c790',
          200: '#eda145',
          300: '#cc7914',
        },
        error: {
          100: '#e4626f',
          200: '#c03744',
          300: '#8c1823',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        navbar: '0px 1px 3px -2px rgba(0, 0, 0, 1)',
        prodImage: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        slideInToLeft: 'slideInToLeft 1.5s ease-out forwards',
        slideInFromTop: 'slideInFromTop 0.5s ease-out forwards',
        slideOutFromBottom: 'slideOutFromBottom 0.5s ease-out forwards',
        fadeInAnimation: 'fadeInAnimation 1s ease-out forwards',
      },
      keyframes: {
        slideInToLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOutFromBottom: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10%)', opacity: '0' },
        },
        fadeInAnimation: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      screens: {
        xsm: '450px',
        sm: '610px',
        xmd: '700px',
        xlg: '1210px',
      },
    },
  },
  plugins: [],
};
