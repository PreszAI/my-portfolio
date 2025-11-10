"use client"

import { useState, type ChangeEvent, type FormEvent } from 'react'
import Reveal from '@/components/Reveal'

type FormState = {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<FormState>

const initialState: FormState = {
  name: '',
  email: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setStatus((prev) => (prev === 'success' ? 'idle' : prev))
  }

  const validate = (values: FormState): FormErrors => {
    const newErrors: FormErrors = {}
    if (!values.name.trim()) {
      newErrors.name = 'Please enter your name.'
    } else if (values.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.'
    }

    if (!values.email.trim()) {
      newErrors.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!values.message.trim()) {
      newErrors.message = 'Please enter a message.'
    } else if (values.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters.'
    }

    return newErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setStatus('submitting')

    // simulate async request
    await new Promise((resolve) => setTimeout(resolve, 900))

    setStatus('success')
    setForm(initialState)
  }

  return (
    <section id="contact" className="section">
      <Reveal>
        <div className="rounded-2xl border border-border/60 bg-surface/70 p-8 backdrop-blur md:p-10 dark:border-white/10 dark:bg-surface/40">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="md:w-2/5 space-y-4">
              <h2 className="heading text-foreground">Get in touch</h2>
              <p className="subheading">
                Ready to collaborate or have a question? Drop a message and I'll get back as soon as possible.
              </p>
              <div className="space-y-2 text-sm text-foreground">
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-primary/15 text-primary shadow-sm dark:border-white/40 dark:bg-white/15 dark:text-white">
                    <svg
                      aria-hidden
                      focusable="false"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Zm2.75-.25a.25.25 0 0 0-.25.25v.272l6.5 4.062 6.5-4.062V5.75a.25.25 0 0 0-.25-.25H5.75Zm12.5 3.613-6.095 3.806a.75.75 0 0 1-.81 0L5.25 9.113v9.137c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V9.113Z" />
                    </svg>
                  </span>
                  <a href="mailto:you@example.com" className="text-foreground transition hover:text-accent">you@example.com</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-primary/15 text-primary shadow-sm dark:border-white/40 dark:bg-white/15 dark:text-white">
                    <svg
                      aria-hidden
                      focusable="false"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M4.983 3.5c0 .828-.65 1.5-1.483 1.5C2.65 5 2 4.328 2 3.5 2 2.672 2.65 2 3.5 2c.833 0 1.483.672 1.483 1.5ZM2 21V7h3v14H2Zm6.497-9.356c0-1.506-.05-2.744-.1-3.865h2.641l.14 1.69h.05c.55-1.009 1.9-1.953 3.91-1.953 2.591 0 4.54 1.723 4.54 5.43V21h-3v-6.918c0-1.758-.65-2.958-2.27-2.958-1.237 0-1.973.86-2.295 1.69-.12.296-.17.71-.17 1.127V21h-3V11.644Z" />
                    </svg>
                  </span>
                  <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="text-foreground transition hover:text-accent">LinkedIn</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-primary/15 text-primary shadow-sm dark:border-white/40 dark:bg-white/15 dark:text-white">
                    <svg
                      aria-hidden
                      focusable="false"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M12 2C6.475 2 2 6.483 2 12.017c0 4.425 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.701-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.606.069-.606 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.087 2.91.832.092-.647.35-1.087.636-1.337-2.221-.253-4.555-1.114-4.555-4.957 0-1.094.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.797-.222 1.653-.333 2.505-.337.85.004 1.708.115 2.505.337 1.908-1.296 2.746-1.026 2.746-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.594 1.028 2.688 0 3.853-2.338 4.701-4.566 4.948.359.309.679.918.679 1.85 0 1.335-.012 2.414-.012 2.741 0 .268.18.58.688.481C19.14 20.192 22 16.44 22 12.017 22 6.483 17.523 2 12 2Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-foreground transition hover:text-accent">GitHub</a>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="md:w-3/5 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className={`w-full rounded-lg border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 dark:bg-surface/30 ${errors.name ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'}`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-300">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className={`w-full rounded-lg border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 dark:bg-surface/30 ${errors.email ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'}`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-300">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  placeholder="Tell me about your project..."
                  required
                  className={`w-full rounded-lg border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 dark:bg-surface/30 ${errors.message ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'}`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-300">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>

                <p
                  role="status"
                  aria-live="polite"
                  className={`text-sm transition-opacity ${status === 'success' ? 'text-emerald-500 dark:text-emerald-300 opacity-100' : 'opacity-0'}`}
                >
                  {status === 'success' ? 'Thanks! Your message has been sent.' : '\u00a0'}
                </p>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
