import Reveal from '@/components/Reveal'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <Reveal className="space-y-4">
          <h2 className="heading text-foreground">About Me</h2>
          <p className="subheading">
            I'm a developer with a passion for crafting performant, accessible, and
            user‑centric products. I love working across the stack, from polished UI to
            robust APIs and infrastructure.
          </p>
          <p className="text-foreground/80">
            My toolkit includes TypeScript, Next.js, React, Tailwind CSS, Node.js, and
            cloud services. I care deeply about design systems, DX, and shipping with quality.
          </p>
        </Reveal>
        <Reveal delayMs={100}>
          <ul className="grid grid-cols-2 gap-3 text-sm text-foreground">
            {[
              'TypeScript',
              'Next.js',
              'React',
              'Tailwind CSS',
              'Node.js',
              'PostgreSQL',
              'Prisma',
              'AWS/Cloudflare'
            ].map((skill) => (
              <li
                key={skill}
                className="rounded-md border border-border/60 bg-surface-alt/80 px-4 py-3 text-foreground dark:border-white/10 dark:bg-surface/40"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}


