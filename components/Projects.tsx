'use client';

import Reveal from '@/components/Reveal'

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
  {
    title: 'Neighborhood Watch Platform',
    description: 'A community-driven safety platform enabling residents to share updates and coordinate neighborhood watch activities.',
    tags: ['Vue.js', 'Firebase', 'Maps API'],
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop',
    link: '#',
  },
  {
    title: 'Emergency Response Tracker',
    description: 'Real-time tracking system for emergency services with live updates and route optimization for faster response times.',
    tags: ['React Native', 'WebSocket', 'GIS'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop',
    link: '#',
  },
  {
    title: 'Community Resource Hub',
    description: 'Centralized platform connecting residents with local services, events, and resources in their area.',
    tags: ['Next.js', 'MongoDB', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    link: '#',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="space-y-8">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="heading text-foreground">Projects</h2>
          <a href="#contact" className="text-accent hover:underline">Work with me →</a>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const card = (
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 transition-all duration-300 hover:bg-surface-alt/70 hover-lift hover-glow dark:border-white/10 dark:bg-surface/40">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{p.title}</h3>
                  <p className="mt-2 text-foreground/80">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs rounded-full border border-border/60 bg-surface-alt/80 px-2 py-1 text-foreground transition-all hover:scale-110 hover:border-primary/50 dark:border-white/10 dark:bg-surface/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5">
                    <a href={p.link} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground shadow-glow transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-lg">
                      View Project
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                        <path fillRule="evenodd" d="M4.5 12a.75.75 0 0 1 .75-.75h12.19l-3.72-3.72a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H5.25A.75.75 0 0 1 4.5 12Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );

            return (
              <Reveal key={p.title} delayMs={i * 60}>
                {card}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  )
}
