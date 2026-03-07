/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    hover: 'var(--color-primary-hover)',
                    active: 'var(--color-primary-active)',
                },
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    elevated: 'var(--color-surface-elevated)',
                    border: 'var(--color-surface-border)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    disabled: 'var(--color-text-disabled)',
                },
                success: 'var(--color-success)',
                error: 'var(--color-error)',
                warning: 'var(--color-warning)',
            },
            textColor: {
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-disabled': 'var(--color-text-disabled)',
            },
        },
    },
}