/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brush: ['"Ma Shan Zheng"', 'cursive'],
        xiaowei: ['"ZCOOL XiaoWei"', 'serif'],
      },
      colors: {
        scroll: {
          bg: '#1a1410',
          card: '#2a2118',
          gold: '#c9a84c',
          vermilion: '#c23531',
          text: '#d4c5a9',
          muted: '#8a7d6b',
          border: 'rgba(201,168,76,0.2)',
        },
      },
    },
  },
  plugins: [],
}
