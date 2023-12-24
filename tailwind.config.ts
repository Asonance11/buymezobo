import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },

            boxShadow: {
                '7xl': ' 0px 0px 3.5px rgba(0, 0, 0, 0.5)'
            },

            colors:{
                "myYellow":"rgb(255, 180, 31)"
            }
        },
    },
    plugins: [],
}
export default config
