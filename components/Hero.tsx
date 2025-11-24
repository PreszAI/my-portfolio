import Reveal from '@/components/Reveal'
import NewsFlash from '@/components/NewsFlash'

export default function Hero() {
  return (
    <section id="home" className="section">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/80 p-8 backdrop-blur md:p-14 shadow-glow text-center dark:border-white/10 dark:bg-surface/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-purple-600/40 via-purple-500/25 to-blue-500/25" />
        <div className="pointer-events-none absolute -inset-x-20 -top-20 -z-10 h-64 rotate-12 bg-gradient-to-r from-purple-400/30 via-fuchsia-400/20 to-blue-400/30 blur-3xl" />

        {/* News Flash Animation */}
        <Reveal>
          <div className="mb-8">
            <NewsFlash />
          </div>
        </Reveal>

        {/* Animated blocks */}
        <div className="space-y-4">
          {/* badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface-alt/80 px-4 py-2 text-sm text-muted transition hover:bg-surface-alt/90 dark:border-white/10 dark:bg-surface/40 dark:text-foreground/80">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Available for Lectures and online Training
            </div>
          </Reveal>

          {/* title & subtitle */}
          <div>
            <Reveal delayMs={80}>
              <h1 className="heading mt-0 neon-outline">
                Hi, I'm <span className="text-primary">Randy Presz Gray</span>.<br className="hidden md:block" />
                Bringing AI to a community near You!
              </h1>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="subheading mx-auto mt-4">
                Police Officer / Community Support Staff learning to build with AI and Next.js.
                Exploring how modern tools can serve people and create real community impact.
              </p>
            </Reveal>
          </div>

          {/* ctas */}
          <Reveal delayMs={240}>
            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="#projects" className="px-5 py-3 rounded-md bg-primary text-primary-foreground shadow-glow transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-lg">
                View Projects
              </a>
              <a href="#contact" className="px-5 py-3 rounded-md border border-border/60 bg-surface-alt/80 transition-all duration-300 hover:bg-surface-alt/90 hover:scale-105 hover:border-primary/50 dark:border-white/10 dark:bg-surface/40">
                Contact Me
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}


