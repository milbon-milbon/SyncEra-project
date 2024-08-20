import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#66B2FF',
        white: '#ffffff',
      },
      fontFamily: {
        sans: ['Patrick Hand', 'cursive'],
        dancing: ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
