/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        school: {
          primary: '#2C5282', // Deep navy blue
          secondary: '#4A5568', // Slate gray
          accent: '#F6AD55', // Warm orange
          light: '#EDF2F7', // Light gray
          dark: '#1A365D', // Darker navy
          success: '#48BB78', // Green
          error: '#F56565', // Red
          warning: '#ECC94B', // Yellow
        }
      }
    },
  },
  plugins: [],
};