export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ed',
          100: '#c0e6d3',
          200: '#97d7b8',
          300: '#6bc79d',
          400: '#45b886',
          500: '#028e4b',
          600: '#027f44',
          700: '#026e3c',
          800: '#015c33',
          900: '#02482a',
          DEFAULT: '#028e4b',
        },
        surface: '#f7faf9',
        ink: '#0f172a',
      },
      boxShadow: {
        soft: '0 20px 50px rgba(2, 142, 75, 0.08)',
      },
    },
  },
  plugins: [],
}
