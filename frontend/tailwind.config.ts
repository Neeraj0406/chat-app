import type { Config } from "tailwindcss";
import withMT from '@material-tailwind/react/utils/withMT';

const config: Partial<Config> = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#60a5fa", // Correct key name
      },
      height: {
        "chatCon": 'calc(100vh - 60px)',
        "chatHeight": 'calc(100vh - 200px)',

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
});

export default config;
