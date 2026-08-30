import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                accent: "#1d4ed8",
                highlight: "#fbbf24",
            },
        },
    },
    plugins: [
        typography,
    ],
} satisfies Config;
