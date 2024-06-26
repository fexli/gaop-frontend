const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors');

// this function handles the opacity of color
function withOpacityValue(variable) {
  return ({opacityValue}) => {
    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`;
    }
    return `hsl(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xs': '330px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        card: withOpacityValue("--c"),
        title: withOpacityValue("--t"),
        'vtd-primary': colors.sky,
        'vtd-secondary': colors.gray,
      },
      animation: {
        "spin-slow": "spin 3.5s linear infinite",
        "spin-slow-2x": "spin 7s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    darkTheme: "dark",
    lightTheme: "light",
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=autumn]"],
          primary: "#c23370",
          // success: "#6cce96",
          // info: "#7E57C2",
          "--c": "212 96% 78%",
          "--t": "262 83% 58%",
          "--ctx": "0 0% 0%", // black
          "--ctc": "0 0% 100%",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=halloween]"],
          info: "#8AB4F8",
          "--c": "215 14% 34%",
          "--t": "25 95% 53%",
          "--b1": "0 0% 16%",
          "--b2": "0 0% 12%",
          "--b3": "0 0%  6%",
          "--ctx": "0 0% 100%", // white
          "--ctc": "0 0% 0%",
        },
      },
    ],
  },
};
