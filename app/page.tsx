import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Reports from '@/components/Reports'
import Contact from '@/components/Contact'

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/your-profile',
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M12 1.5c-5.63 0-10.2 4.58-10.2 10.23 0 4.52 2.93 8.35 6.99 9.71.51.09.7-.22.7-.5 0-.25-.01-.9-.02-1.77-2.84.62-3.44-1.37-3.44-1.37-.47-1.17-1.15-1.48-1.15-1.48-.94-.64.07-.63.07-.63 1.04.07 1.58 1.08 1.58 1.08.93 1.58 2.43 1.12 3.02.86.09-.69.36-1.13.65-1.39-2.27-.26-4.66-1.14-4.66-5.07 0-1.12.4-2.04 1.06-2.76-.11-.26-.46-1.31.1-2.73 0 0 .86-.28 2.83 1.05a9.85 9.85 0 0 1 5.16 0c1.97-1.33 2.82-1.05 2.82-1.05.56 1.42.21 2.47.1 2.73.66.72 1.05 1.64 1.05 2.76 0 3.94-2.4 4.8-4.69 5.05.37.32.7.95.7 1.92 0 1.39-.01 2.52-.01 2.86 0 .28.18.6.71.49 4.06-1.36 6.98-5.19 6.98-9.7C22.2 6.08 17.62 1.5 12 1.5Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/your-profile',
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M4.98 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM.43 8.25h4.9v13.5H.43V8.25Zm7.32 0h4.69v1.84h.07c.65-1.23 2.24-2.53 4.6-2.53 4.92 0 5.82 3.24 5.82 7.44v6.75h-4.89v-5.98c0-1.43-.03-3.27-1.99-3.27-1.99 0-2.3 1.55-2.3 3.17v6.08H7.75V8.25Z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/your-profile',
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M21.54 6.16c.01.17.01.34.01.5 0 5.13-3.9 11.04-11.04 11.04-2.19 0-4.23-.64-5.94-1.75.3.03.6.05.91.05 1.82 0 3.49-.62 4.82-1.66a3.89 3.89 0 0 1-3.64-2.7c.24.04.48.07.73.07.35 0 .7-.05 1.03-.13a3.88 3.88 0 0 1-3.11-3.81v-.05c.52.29 1.12.46 1.75.48a3.88 3.88 0 0 1-1.73-3.23c0-.71.19-1.38.52-1.96a11.03 11.03 0 0 0 8.01 4.06 3.89 3.89 0 0 1 6.61-3.54 7.72 7.72 0 0 0 2.47-.94 3.9 3.9 0 0 1-1.71 2.15 7.74 7.74 0 0 0 2.23-.61 8.26 8.26 0 0 1-1.94 2.01Z" />
      </svg>
    ),
  },
]

export default function Page() {
  return (
    <main className="py-12 md:py-16">
      <Hero />
      <About />
      <Projects />
      <Reports />
      <Contact />
      <footer className="section pt-10 text-center text-sm text-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-muted">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface/60 transition hover:bg-surface-alt/70 hover:text-foreground dark:border-white/10 dark:bg-surface/40"
              >
                {social.icon}
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
          <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Randy Presz Gray. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}



