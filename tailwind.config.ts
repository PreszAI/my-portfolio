import type { Config } from 'tailwindcss'

const withOpacity = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        surface: withOpacity('--surface'),
        'surface-alt': withOpacity('--surface-alt'),
        border: withOpacity('--border'),
        muted: withOpacity('--muted'),
        primary: withOpacity('--primary'),
        'primary-foreground': withOpacity('--primary-foreground'),
        accent: withOpacity('--accent'),
        'accent-foreground': withOpacity('--accent-foreground'),
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
          lg: '3rem',
          xl: '4rem',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(139, 92, 246, 0.6)',
      },
      backgroundImage: {
        grid: 'radial-gradient(var(--grid-color) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '24px 24px',
      },
    },
  },
  plugins: [],
} satisfies Config


