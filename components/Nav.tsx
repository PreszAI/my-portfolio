"use client"

import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const isActive = scrolled || open

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 backdrop-blur supports-[backdrop-filter]:bg-surface/70 ${
        isActive
          ? 'border-border/60 bg-surface/70 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-surface/40'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="container flex items-center justify-between gap-4 py-4">
        <a href="#home" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <img src="/TTPSLOGO.png" alt="TTPS Logo" className="h-[66px] w-auto" />
          <span className="text-primary">RPG</span> Portfolio
          <img src="/hmlogot.png" alt="Logo" className="ml-2 h-[66px] w-auto" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex lg:gap-2">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-surface-alt/80 hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-surface/40 text-muted transition hover:bg-surface-alt/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden dark:border-white/15 dark:bg-surface/30"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`lg:hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <div className="container pb-4">
          <ul className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-surface/60 backdrop-blur p-3">
            {links.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-2 text-sm text-muted transition hover:bg-surface-alt/60 hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}

