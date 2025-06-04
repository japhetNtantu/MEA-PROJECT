/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
extend: {
      keyframes: {
        fadeInOut: {
          '0%': { opacity: '0', transform: 'translate(-50%, -20px)' },
          '10%': { opacity: '1', transform: 'translate(-50%, 0)' },
          '90%': { opacity: '1', transform: 'translate(-50%, 0)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -20px)' },
        }
      },
      animation: {
        fadeInOut: 'fadeInOut 3s forwards',
      }
    }  },
  plugins: [],
}
