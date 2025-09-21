/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './popup.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')]
}
