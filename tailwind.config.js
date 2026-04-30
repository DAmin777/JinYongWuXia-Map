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
    },
  },
  plugins: [],
}
