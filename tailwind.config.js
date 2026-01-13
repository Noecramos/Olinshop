/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--primary)",
                accent: "var(--accent)",
                "accent-hover": "var(--accent-hover)",
                "accent-secondary": "var(--accent-secondary)",
                secondary: "var(--text-secondary)",
            },
            borderRadius: {
                DEFAULT: "12px",
                lg: "18px",
            }
        },
    },
    plugins: [],
}
