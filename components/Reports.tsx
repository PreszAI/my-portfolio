'use client'

import { useState, useEffect } from 'react'
import Reveal from '@/components/Reveal'

export type Report = {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'reviewing' | 'resolved'
  createdAt: Date
  location?: string
  reporterName?: string
  reporterEmail?: string
}

type ReportFormState = {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  location: string
  reporterName: string
  reporterEmail: string
}

type FormErrors = Partial<ReportFormState>

const initialFormState: ReportFormState = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  location: '',
  reporterName: '',
  reporterEmail: '',
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [form, setForm] = useState<ReportFormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Initialize reports on component mount
  // Later, this will fetch from a database
  useEffect(() => {
    // Example: Load from localStorage for persistence during development
    const storedReports = localStorage.getItem('communityReports')
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports)
        const reportsWithDates = parsed.map((r: Omit<Report, 'createdAt'> & { createdAt: string }) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        }))
        setReports(reportsWithDates)
      } catch (error) {
        console.error('Error loading reports from localStorage:', error)
      }
    }
  }, [])

  // Save reports to localStorage whenever reports change
  // Later, this will sync with a database
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem('communityReports', JSON.stringify(reports))
    }
  }, [reports])

  const handleChange = (field: keyof ReportFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setStatus((prev) => (prev === 'success' ? 'idle' : prev))
  }

  const validate = (values: ReportFormState): FormErrors => {
    const newErrors: FormErrors = {}

    if (!values.title.trim()) {
      newErrors.title = 'Please enter a title.'
    } else if (values.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.'
    }

    if (!values.description.trim()) {
      newErrors.description = 'Please enter a description.'
    } else if (values.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters.'
    }

    if (!values.category.trim()) {
      newErrors.category = 'Please select a category.'
    }

    if (values.reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.reporterEmail.trim())) {
      newErrors.reporterEmail = 'Please enter a valid email address.'
    }

    return newErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setStatus('submitting')

    // Simulate async request
    // Later, this will call an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Create new report
    const newReport: Report = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      priority: form.priority,
      status: 'pending',
      createdAt: new Date(),
      location: form.location.trim() || undefined,
      reporterName: form.reporterName.trim() || undefined,
      reporterEmail: form.reporterEmail.trim() || undefined,
    }

    // Add report to array
    setReports((prev) => [newReport, ...prev])
    setStatus('success')
    setForm(initialFormState)

    // Later: Call API to save to database
    // await fetch('/api/reports', { method: 'POST', body: JSON.stringify(newReport) })
  }

  const filteredReports = reports.filter((report) => {
    const categoryMatch = filterCategory === 'all' || report.category === filterCategory
    const statusMatch = filterStatus === 'all' || report.status === filterStatus
    return categoryMatch && statusMatch
  })

  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/40'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  }

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      case 'reviewing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40'
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  }

  return (
    <section id="reports" className="section">
      <div className="space-y-8">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="heading text-foreground">Community Reports</h2>
              <p className="subheading mt-2">
                Submit and track community issues. AI analysis coming soon.
              </p>
            </div>
            <div className="text-sm text-muted">
              Total: <span className="font-semibold text-foreground">{reports.length}</span> reports
            </div>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Report Submission Form */}
          <Reveal delayMs={80} className="lg:col-span-1">
            <div className="rounded-2xl border border-border/60 bg-surface/70 p-6 backdrop-blur dark:border-white/10 dark:bg-surface/40">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Submit Report</h3>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-foreground">
                    Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange('title')}
                    aria-invalid={Boolean(errors.title)}
                    placeholder="Brief description"
                    required
                    className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                      errors.title ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                    }`}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-300">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="mb-1 block text-sm font-medium text-foreground">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange('category')}
                    aria-invalid={Boolean(errors.category)}
                    required
                    className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                      errors.category ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="safety">Safety</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="community">Community</option>
                    <option value="environment">Environment</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-300">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="priority" className="mb-1 block text-sm font-medium text-foreground">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange('priority')}
                    className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange('description')}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Provide details..."
                    required
                    className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                      errors.description ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-300">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="location" className="mb-1 block text-sm font-medium text-foreground">
                    Location (optional)
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange('location')}
                    placeholder="Address or area"
                    className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                  />
                </div>

                <div className="space-y-3 border-t border-border/40 pt-3 dark:border-white/10">
                  <div>
                    <label htmlFor="reporterName" className="mb-1 block text-sm font-medium text-foreground">
                      Your Name (optional)
                    </label>
                    <input
                      id="reporterName"
                      name="reporterName"
                      type="text"
                      value={form.reporterName}
                      onChange={handleChange('reporterName')}
                      placeholder="Name"
                      className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="reporterEmail" className="mb-1 block text-sm font-medium text-foreground">
                      Your Email (optional)
                    </label>
                    <input
                      id="reporterEmail"
                      name="reporterEmail"
                      type="email"
                      value={form.reporterEmail}
                      onChange={handleChange('reporterEmail')}
                      aria-invalid={Boolean(errors.reporterEmail)}
                      placeholder="email@example.com"
                      className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                        errors.reporterEmail ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                      }`}
                    />
                    {errors.reporterEmail && <p className="mt-1 text-xs text-red-300">{errors.reporterEmail}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
                </button>

                {status === 'success' && (
                  <p className="text-sm text-emerald-500 dark:text-emerald-300">
                    Report submitted successfully!
                  </p>
                )}
              </form>
            </div>
          </Reveal>

          {/* Reports List */}
          <Reveal delayMs={160} className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-surface/70 p-6 backdrop-blur dark:border-white/10 dark:bg-surface/40">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-foreground">Report List</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="rounded-lg border border-border/60 bg-surface/80 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                  >
                    <option value="all">All Categories</option>
                    <option value="safety">Safety</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="community">Community</option>
                    <option value="environment">Environment</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-lg border border-border/60 bg-surface/80 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredReports.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted">
                    {reports.length === 0 ? 'No reports yet. Submit your first report!' : 'No reports match your filters.'}
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-lg border border-border/60 bg-surface/60 p-4 transition hover:bg-surface-alt/70 dark:border-white/10 dark:bg-surface/30"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-foreground">{report.title}</h4>
                            <span className={`rounded-full border px-2 py-0.5 text-xs ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                            <span className={`rounded-full border px-2 py-0.5 text-xs ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80">{report.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                            <span className="capitalize">{report.category}</span>
                            {report.location && (
                              <>
                                <span>•</span>
                                <span>{report.location}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{report.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

