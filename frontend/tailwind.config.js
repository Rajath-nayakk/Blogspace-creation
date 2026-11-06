/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f7f8',
          100: '#e1e4e8',
          200: '#c5cbd3',
          300: '#9fa8b5',
          400: '#758194',
          500: '#586578',
          600: '#455060',
          700: '#38414e',
          800: '#232932',
          900: '#14171d',
          950: '#0b0d11',
        },
        editorial: {
          bg: '#F9FAFB',
          card: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
          border: '#E5E7EB',
          accent: '#2563EB',
          'accent-hover': '#1D4ED8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Merriweather', 'Georgia', 'Cambria', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#1F2937',
            lineHeight: '1.8',
          },
        },
      },
    },
  },
  plugins: [],
}
