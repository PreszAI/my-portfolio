'use client'

import { useState, useEffect } from 'react'
import Reveal from '@/components/Reveal'
import IncidentAnalysis from '@/components/IncidentAnalysis'

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
  incidentDate?: string
  incidentTime?: string
}

type ReportFormState = {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  location: string
  reporterName: string
  reporterEmail: string
  incidentDate: string
  incidentTime: string
  manualCategory: string
}

type FormErrors = Partial<ReportFormState>

const titles = [
  'Crime, Safety & Security',
  'Youth & Community Development',
  'Mental Health & Social Support',
  'Substance Abuse & Addiction',
  'Community Cohesion & Social Inclusion',
  'Education & Awareness',
  'Housing & Environmental Conditions',
  'Economic & Employment-Related Issues',
  'Domestic & Family Issues',
  'School & Student-Related Issues',
  'Disaster Preparedness & Emergency Support',
  'Human Trafficking & Exploitation',
  'Elderly & Persons with Disabilities',
]

// Mapping of titles to their available categories
const titleCategories: Record<string, string[]> = {
  'Crime, Safety & Security': [
    'Youth Gambling',
    'Youth involvement in crime',
    'Gang Activity',
    'Domestic Violence',
    'Child abuse or Neglect',
    'Break-ins',
    'Theft',
    'Vandalism',
    'Neighbour Disputes',
    'Firearm Related',
    'Stolen Vehicle',
    'Noise Pollution',
  ],
  'Youth & Community Development': [
    'Program for Youth',
    'School-Dropout/Absenteeism',
    'Mentorship Needs',
    'Assisting Police Youth Clubs',
    'Assisting Sports Programs',
    'Assisting After-School Activities',
  ],
  'Mental Health & Social Support': [
    'Connecting vulnerable persons to mental-health resources',
    'Identifying Persons at risk (self-harm, substance abuse)',
    'Supporting Elderly persons living alone',
    'Welfare checks for vulnerable households',
  ],
  'Substance Abuse & Addiction': [
    'Alcohol-related issues',
    'Drug Misuse (Marijuana, Cocaine, Pills etc..)',
    'Public intoxication and safety',
    'Referral to Rehabilitation, Counselling, Family Support Programs',
  ],
  'Community Cohesion & Social Inclusion': [
    'Bridging Community Divisions (Ethnic, Gang-Related, Geographic)',
    'Helping integrate marginalized groups',
    'Facilitating Community Meetings, Forums, Peace Circles',
  ],
  'Education & Awareness': [
    'Public Education on Crime Prevention',
    'Safety Workshops (personal safety, road safety, cyber safety)',
    'School talks on discipline, conflict resolution, peer pressure',
    'Awareness campaigns on domestic violence, drugs, human trafficking',
    'Disaster Preparedness and Emergency Awareness',
  ],
  'Housing & Environmental Conditions': [
    'Unsafe or abandoned buildings',
    'Derelict vehicles',
    'Nonfunctional Street Lighting',
    'Environmental health concerns (Mosquitoes, Rodents, Dumping)',
    'Illegal utility connections (WASA, T&TEC)',
  ],
  'Economic & Employment-Related Issues': [
    'Guiding youth to job Programs or Training opportunities',
    'Connecting residents to Career Fairs, Apprenticeships',
    'Supporting Small Community Businesses',
  ],
  'Domestic & Family Issues': [
    'Family Conflict',
    'Support for single mothers or at-risk households',
    'Referrals to social workers or the Children\'s Authority',
    'Restraining-order situations',
  ],
  'School & Student-Related Issues': [
    'Truancy',
    'Bullying',
    'Cyberbullying',
    'Violence or Weapons in Schools',
    'Mentoring for "at-risk" students',
    'Substance uses in schools',
  ],
  'Disaster Preparedness & Emergency Support': [
    'Identifying vulnerable persons who may need help in emergencies',
    'Assisting in community evacuation or shelter organization',
    'Supporting relief distribution during floods or fires',
  ],
  'Human Trafficking & Exploitation': [
    'Identifying suspicious activity',
    'Community awareness and reporting channels',
    'Supporting NGOs and social agencies',
  ],
  'Elderly & Persons with Disabilities': [
    'Welfare checks',
    'Helping with access to social services',
    'Safety assessments in homes',
    'Community watch initiatives focused on vulnerable persons',
    'Community Trust & Relationship Building',
    'Reducing fear of police',
    'Being accessible and visible',
    'Strengthening communication between residents and authorities',
    'Encouraging anonymous reporting and safe disclosures',
  ],
}

// Get all unique categories from all title categories for the filter dropdown
const getAllCategories = (): string[] => {
  const allCategories = new Set<string>()
  Object.values(titleCategories).forEach(categories => {
    categories.forEach(category => allCategories.add(category))
  })
  return Array.from(allCategories).sort()
}

const allCategoriesList = getAllCategories()

const locations = [
  'Africa',
  'Basilon Street/Bath Street',
  'Beetham Phase 1',
  'Beetham Phase 2',
  'Beetham Phase 3',
  'Beetham Phase 4',
  'Beetham Phase 5',
  'Beverly Hills',
  'Block 8',
  'Block 22',
  'Blundell Alley',
  'Boxhill Trace',
  'Canada Plannings',
  'Charford Court Place',
  'Chocolate Alley',
  'Dan Kelly',
  'Desperlie Crescent',
  'Duncan Street',
  'Eastern Quarry',
  'Fatima Trace',
  'Gonzales',
  'Harlem',
  'Harpe Place',
  'Hillview Plannings',
  'John John',
  'Kelly Village',
  'Leau Place',
  'Lower St. Barbs',
  'Mango Rose',
  'Mango Alley',
  'Mentor Alley',
  'Mc Shine Lands',
  'Nelson Street',
  'Ovid Alley',
  'Old St. Joseph Road (Back Road)',
  'Pashley Street',
  'Picton',
  'Picton Housing',
  'Plaisance Place',
  'Prizgar Lands',
  'Pump Trace',
  'Quevedo Circular',
  'Rock City',
  'Sealots Pioneer Drive',
  'Sealots Production Avenue',
  'Sogren Trace',
  'Spree Simon',
  'Springside',
  'Springville',
  'St. Barbs',
  'St. John Street',
  'St. Joseph Plannings',
  'St. Paul Street',
  'Straker Village',
  'Success Village',
  'Trou Macaque',
  'Village Council',
]

const initialFormState: ReportFormState = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  location: '',
  reporterName: '',
  reporterEmail: '',
  incidentDate: '',
  incidentTime: '',
  manualCategory: '',
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [form, setForm] = useState<ReportFormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [analyzingReportId, setAnalyzingReportId] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({})
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Initialize reports on component mount
  // Load from localStorage for persistence across page refreshes
  useEffect(() => {
    try {
      const storedReports = localStorage.getItem('communityReports')
      if (storedReports) {
        const parsed = JSON.parse(storedReports)
        // Validate that parsed data is an array
        if (Array.isArray(parsed)) {
          const reportsWithDates = parsed.map((r: Omit<Report, 'createdAt'> & { createdAt: string }) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          }))
          setReports(reportsWithDates)
        } else {
          console.warn('Invalid data format in localStorage, clearing...')
          localStorage.removeItem('communityReports')
        }
      }
    } catch (error) {
      console.error('Error loading reports from localStorage:', error)
      // Clear corrupted data
      try {
        localStorage.removeItem('communityReports')
      } catch (clearError) {
        console.error('Error clearing localStorage:', clearError)
      }
    }
  }, [])

  // Save reports to localStorage whenever reports change
  // Later, this will sync with a database
  useEffect(() => {
    try {
      // Always save to localStorage, even if empty array (to clear old data)
      localStorage.setItem('communityReports', JSON.stringify(reports))
    } catch (error) {
      console.error('Error saving reports to localStorage:', error)
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider removing old reports.')
      }
    }
  }, [reports])

  const handleChange = (field: keyof ReportFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.value
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      // Clear category when title changes
      if (field === 'title') {
        updated.category = ''
        updated.manualCategory = ''
      }
      // Clear manualCategory when category changes (unless switching to manual)
      if (field === 'category' && value !== 'manual') {
        updated.manualCategory = ''
      }
      return updated
    })
    setErrors((prev) => ({ ...prev, [field]: undefined, manualCategory: undefined }))
    setStatus((prev) => (prev === 'success' ? 'idle' : prev))
  }

  // Get available categories for the selected title
  const availableCategories = form.title ? titleCategories[form.title] || [] : []

  const validate = (values: ReportFormState): FormErrors => {
    const newErrors: FormErrors = {}

    if (!values.title.trim()) {
      newErrors.title = 'Please select a title.'
    }

    if (!values.description.trim()) {
      newErrors.description = 'Please enter a description.'
    } else if (values.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters.'
    }

    if (!values.category.trim()) {
      newErrors.category = 'Please select a category.'
    } else if (values.category === 'manual' && !values.manualCategory.trim()) {
      newErrors.manualCategory = 'Please enter a category.'
    } else if (values.category === 'manual' && values.manualCategory.trim().length < 2) {
      newErrors.manualCategory = 'Category must be at least 2 characters.'
    }

    if (!values.incidentDate.trim()) {
      newErrors.incidentDate = 'Please select a date.'
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
      category: form.category === 'manual' ? form.manualCategory.trim() : form.category.trim(),
      priority: form.priority,
      status: 'pending',
      createdAt: new Date(),
      location: form.location.trim() || undefined,
      reporterName: form.reporterName.trim() || undefined,
      reporterEmail: form.reporterEmail.trim() || undefined,
      incidentDate: form.incidentDate.trim() || undefined,
      incidentTime: form.incidentTime.trim() || undefined,
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

  // Analyze incident using AI
  const analyzeIncident = async (report: Report) => {
    setAnalyzingReportId(report.id)
    setAnalysisError(null)
    
    try {
      const response = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: report.title,
          description: report.description,
          category: report.category,
          location: report.location,
          priority: report.priority,
          incidentDate: report.incidentDate,
          incidentTime: report.incidentTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle API errors with user-friendly messages
        const errorMessage = data.error || 'Failed to analyze incident. Please try again.'
        const errorType = data.errorType || 'UNKNOWN_ERROR'
        
        // Use fallback data if provided
        if (data.fallback) {
          setAnalysisResults(prev => ({
            ...prev,
            [report.id]: data.fallback,
          }))
          setAnalysisError(`Analysis completed with limited information: ${errorMessage}`)
        } else {
          throw new Error(errorMessage)
        }
        return
      }

      if (data.success && data.data) {
        setAnalysisResults(prev => ({
          ...prev,
          [report.id]: data.data,
        }))
        setAnalysisError(null)
      } else {
        throw new Error(data.error || 'Analysis completed but returned unexpected data format.')
      }
    } catch (error) {
      console.error('Error analyzing incident:', error)
      
      // Determine user-friendly error message
      let errorMessage = 'Unable to analyze the incident at this time. Please try again later.'
      
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the analysis service. Please check your internet connection and try again.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'The analysis is taking longer than expected. Please try again in a moment.'
        } else {
          errorMessage = error.message
        }
      }
      
      setAnalysisError(errorMessage)
      
      // Show error for a few seconds, then clear
      setTimeout(() => {
        setAnalysisError(null)
      }, 5000)
    } finally {
      setAnalyzingReportId(null)
    }
  }

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
              <h2 className="heading text-foreground">Community Incident Reports</h2>
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
                  <select
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange('title')}
                    aria-invalid={Boolean(errors.title)}
                    required
                    className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                      errors.title ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                    }`}
                  >
                    <option value="">Select title</option>
                    {titles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
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
                    aria-invalid={Boolean(errors.category || errors.manualCategory)}
                    required
                    disabled={!form.title}
                    className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                      errors.category || errors.manualCategory ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                    } ${!form.title ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">
                      {!form.title ? 'Select a title first' : 'Select category'}
                    </option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="manual">Manual Entry</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-300">{errors.category}</p>}
                  
                  {form.category === 'manual' && (
                    <div className="mt-3">
                      <label htmlFor="manualCategory" className="mb-1 block text-sm font-medium text-foreground">
                        Enter Category *
                      </label>
                      <input
                        id="manualCategory"
                        name="manualCategory"
                        type="text"
                        value={form.manualCategory}
                        onChange={handleChange('manualCategory')}
                        aria-invalid={Boolean(errors.manualCategory)}
                        placeholder="Type your category here"
                        required
                        className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                          errors.manualCategory ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                        }`}
                      />
                      {errors.manualCategory && <p className="mt-1 text-xs text-red-300">{errors.manualCategory}</p>}
                    </div>
                  )}
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
                  <select
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange('location')}
                    className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="incidentDate" className="mb-1 block text-sm font-medium text-foreground">
                      Date *
                    </label>
                    <input
                      id="incidentDate"
                      name="incidentDate"
                      type="date"
                      value={form.incidentDate}
                      onChange={handleChange('incidentDate')}
                      aria-invalid={Boolean(errors.incidentDate)}
                      required
                      className={`w-full rounded-lg border bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 ${
                        errors.incidentDate ? 'border-red-400/60 focus:ring-red-400/30' : 'border-border/60 dark:border-white/10'
                      }`}
                    />
                    {errors.incidentDate && <p className="mt-1 text-xs text-red-300">{errors.incidentDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="incidentTime" className="mb-1 block text-sm font-medium text-foreground">
                      Time (optional)
                    </label>
                    <input
                      id="incidentTime"
                      name="incidentTime"
                      type="time"
                      value={form.incidentTime}
                      onChange={handleChange('incidentTime')}
                      className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                    />
                  </div>
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
                <div className="flex flex-wrap items-center gap-2">
                  {reports.length > 0 && (
                    <button
                      onClick={() => {
                        try {
                          const exportData = reports.map(report => {
                            const analysis = analysisResults[report.id]
                            return {
                              id: report.id,
                              title: report.title,
                              description: report.description,
                              category: report.category,
                              priority: report.priority,
                              status: report.status,
                              location: report.location || null,
                              reporterName: report.reporterName || null,
                              reporterEmail: report.reporterEmail || null,
                              incidentDate: report.incidentDate || null,
                              incidentTime: report.incidentTime || null,
                              createdAt: report.createdAt.toISOString(),
                              analysis: analysis ? {
                                category: analysis.category,
                                severity: analysis.severity,
                                summary: analysis.summary,
                                entities: analysis.entities,
                                suggestedActions: analysis.suggestedActions || null,
                                tags: analysis.tags || null,
                              } : null,
                            }
                          })
                          const jsonString = JSON.stringify({
                            exportDate: new Date().toISOString(),
                            totalReports: exportData.length,
                            reports: exportData,
                          }, null, 2)
                          const blob = new Blob([jsonString], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = `incident-reports-${new Date().toISOString().split('T')[0]}.json`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          URL.revokeObjectURL(url)
                        } catch (error) {
                          console.error('Error exporting reports:', error)
                          alert('Failed to export reports. Please try again.')
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export
                    </button>
                  )}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="rounded-lg border border-border/60 bg-surface/80 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                  >
                    <option value="all">All Categories</option>
                    {allCategoriesList.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
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
                    <div key={report.id} className="space-y-4">
                      <div className="rounded-lg border border-border/60 bg-surface/60 p-4 transition hover:bg-surface-alt/70 dark:border-white/10 dark:bg-surface/30">
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
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => analyzeIncident(report)}
                              disabled={analyzingReportId === report.id}
                              className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary/20 dark:text-primary-foreground"
                            >
                              {analyzingReportId === report.id ? (
                                <>
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                  <span>Analyzing...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <span>Analyze with AI</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Show loading indicator */}
                      {analyzingReportId === report.id && (
                        <IncidentAnalysis analysis={null as any} isLoading={true} />
                      )}

                      {/* Show error message */}
                      {analysisError && analyzingReportId !== report.id && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                          <div className="flex items-start gap-3">
                            <svg className="h-5 w-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-red-400">Analysis Error</h4>
                              <p className="mt-1 text-sm text-red-300">{analysisError}</p>
                              <button
                                onClick={() => analyzeIncident(report)}
                                className="mt-3 text-xs text-red-400 underline hover:text-red-300"
                              >
                                Try again
                              </button>
                            </div>
                            <button
                              onClick={() => setAnalysisError(null)}
                              className="text-red-400 hover:text-red-300"
                              aria-label="Dismiss error"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Show analysis results */}
                      {analysisResults[report.id] && analyzingReportId !== report.id && !analysisError && (
                        <IncidentAnalysis analysis={analysisResults[report.id]} isLoading={false} />
                      )}
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

