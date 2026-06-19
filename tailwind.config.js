/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal': '#0d7a7a',
        'teal-dark': '#05545d',
        'teal-light': '#1a9b9b',
        'forest': '#1e7e74',
        'cream': '#f9f7f4',
      },
    },
  },
  plugins: [],
}
