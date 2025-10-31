"use client"

import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delayMs?: number
}

export default function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === node) {
            const isVisible = entry.isIntersecting && entry.intersectionRatio > 0
            window.requestAnimationFrame(() => setVisible(isVisible))
          }
        })
      },
      { root: null, rootMargin: '-10% 0px -10% 0px', threshold: [0, 0.15] }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={[
        'transform-gpu transition-all duration-700 ease-out will-change-transform',
        'motion-reduce:transition-none motion-reduce:transform-none',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}


