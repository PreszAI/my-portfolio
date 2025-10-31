"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isMounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'portfolio-theme'

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  root.classList.remove(theme === 'dark' ? 'light' : 'dark')
  root.classList.add(theme)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const hasStoredPreference = useRef(false)
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      hasStoredPreference.current = true
      setThemeState(stored)
      applyThemeClass(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme: Theme = prefersDark ? 'dark' : 'light'
      setThemeState(initialTheme)
      applyThemeClass(initialTheme)
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const mediaListener = (event: MediaQueryListEvent) => {
      if (hasStoredPreference.current) return
      const nextTheme: Theme = event.matches ? 'dark' : 'light'
      setThemeState(nextTheme)
      applyThemeClass(nextTheme)
    }
    media.addEventListener('change', mediaListener)

    setIsMounted(true)

    return () => {
      media.removeEventListener('change', mediaListener)
    }
  }, [])

  const setTheme = useCallback((next: Theme) => {
    hasStoredPreference.current = true
    setThemeState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
      applyThemeClass(next)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      hasStoredPreference.current = true
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
        applyThemeClass(next)
      }
      return next
    })
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme, isMounted }),
    [theme, setTheme, toggleTheme, isMounted]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}


