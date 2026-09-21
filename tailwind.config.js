/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
       "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {
  keyframes: {
    float: {
      "0%, 100%": {
        transform: "translateY(0px) rotate(0deg)",
      },
      "50%": {
        transform: "translateY(-10px) rotate(2deg)",
      },
    },
  },

  animation: {
    float: "float 4s ease-in-out infinite",
  },
},
    extend: {},
  },
  plugins: [],
}

