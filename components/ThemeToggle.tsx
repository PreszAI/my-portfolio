"use client"

import { useTheme } from '@/components/ThemeProvider'

type ThemeIconProps = {
  className?: string
}

function SunIcon({ className }: ThemeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon({ className }: ThemeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 0 0 12 17a7 7 0 0 0 9-4.21Z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme, isMounted } = useTheme()

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const showDarkIcon = !isMounted || isDark
  const showLightIcon = isMounted && !isDark

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-surface/40 text-foreground transition hover:bg-surface-alt/60 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-surface/30"
      aria-label={isMounted ? label : 'Toggle color theme'}
    >
      <span className="sr-only">{label}</span>
      <span className="relative flex items-center justify-center">
        <span className={`absolute transition-opacity duration-200 ${showDarkIcon ? 'opacity-100' : 'opacity-0'}`}>
          <MoonIcon className="h-5 w-5" />
        </span>
        <span className={`transition-opacity duration-200 ${showLightIcon ? 'opacity-100' : 'opacity-0'}`}>
          <SunIcon className="h-5 w-5" />
        </span>
      </span>
    </button>
  )
}


