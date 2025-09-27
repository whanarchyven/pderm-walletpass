/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    // './nanoservice-src/**/*.{js,ts,jsx,tsx}',
    // './_refactor/**/*.{js,ts,jsx,tsx}',
    // "./src/pages/**/*.{js,ts,jsx,tsx}",
    // './src/domain/**/*.{js,ts,jsx,tsx}',
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/domain/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "svz-yellow": "#FFE141",

        "svz-violet": "#362483",
        "svz-black": "#20243A",
        "smart-seller-gray": {
          100: "#F8F8F8",
          200: "#F1F1F1",
        },
        "smart-seller-violet": {
          100: "#F8EFFC",
          200: "rgb(237, 223, 247)",
          300: "rgb(204, 146, 242)",
          400: "rgb(178, 109, 214)",
          500: "rgb(197, 99, 185)",
          600: "rgb(177, 75, 125)",
          800: "rgb(93, 64, 111)",
          900: "#390857",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
