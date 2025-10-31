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
              <h2 className="heading">Get in touch</h2>
              <p className="subheading">
                Ready to collaborate or have a question? Drop a message and I’ll get back as soon as possible.
              </p>
              <div className="space-y-2 text-sm text-muted">
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">✉</span>
                  <a href="mailto:you@example.com" className="transition hover:text-foreground">you@example.com</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">in</span>
                  <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="transition hover:text-foreground">LinkedIn</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">GH</span>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-foreground">GitHub</a>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="md:w-3/5 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted">
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
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted">
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
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-muted">
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


