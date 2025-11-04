type Project = {
  title: string
  description: string
  tags: string[]
  image: string
  link?: string
}

const projects: Project[] = [
  {
    title: 'Community AI Assistant',
    description: 'A neighborhood‑focused AI assistant helping citizens access resources and report issues.',
    tags: ['Next.js', 'OpenAI', 'TypeScript'],
    image: '/comai.png',
    link: '#',
  },
  {
    title: 'Safety Insights Dashboard',
    description: 'Real‑time dashboard aggregating open data with charts and alerts for community leaders.',
    tags: ['React', 'Tailwind', 'Charts'],
    image: '/safetyai.png',
    link: '#',
  },
  {
    title: 'Volunteer Connect',
    description: 'A lightweight portal connecting volunteers with nearby community support opportunities.',
    tags: ['Node.js', 'Prisma', 'Postgres'],
    image: '/comvolai.jpg',
    link: '#',
  },
]

import Reveal from '@/components/Reveal'

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <h2 className="heading">Projects</h2>
        <a href="#contact" className="text-accent hover:underline">Work with me →</a>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.title} delayMs={i * 60}>
            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 transition hover:bg-surface-alt/70 dark:border-white/10 dark:bg-surface/40">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-muted">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs rounded-full border border-border/60 bg-surface-alt/80 px-2 py-1 text-muted dark:border-white/10 dark:bg-surface/30">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <a href={p.link} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition">
                    View Project
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M4.5 12a.75.75 0 0 1 .75-.75h12.19l-3.72-3.72a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H5.25A.75.75 0 0 1 4.5 12Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}


