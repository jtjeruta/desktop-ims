module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                fadeOut: {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 200ms alternate infinite ease',
                'fade-out': 'fadeOut 200ms alternate infinite ease',
                wiggle: 'wiggle 200ms ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
