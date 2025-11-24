'use client'

import { useState, useEffect } from 'react'
import type { Report } from '@/components/Reports'
import IncidentAnalysis from '@/components/IncidentAnalysis'
import Reveal from '@/components/Reveal'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Import categories and locations from Reports component
const allCategoriesList = [
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
  'Program for Youth',
  'School-Dropout/Absenteeism',
  'Mentorship Needs',
  'Assisting Police Youth Clubs',
  'Assisting Sports Programs',
  'Assisting After-School Activities',
  'Connecting vulnerable persons to mental-health resources',
  'Identifying Persons at risk (self-harm, substance abuse)',
  'Supporting Elderly persons living alone',
  'Welfare checks for vulnerable households',
  'Alcohol-related issues',
  'Drug Misuse (Marijuana, Cocaine, Pills etc..)',
  'Public intoxication and safety',
  'Referral to Rehabilitation, Counselling, Family Support Programs',
  'Bridging Community Divisions (Ethnic, Gang-Related, Geographic)',
  'Helping integrate marginalized groups',
  'Facilitating Community Meetings, Forums, Peace Circles',
  'Public Education on Crime Prevention',
  'Safety Workshops (personal safety, road safety, cyber safety)',
  'School talks on discipline, conflict resolution, peer pressure',
  'Awareness campaigns on domestic violence, drugs, human trafficking',
  'Disaster Preparedness and Emergency Awareness',
  'Unsafe or abandoned buildings',
  'Derelict vehicles',
  'Nonfunctional Street Lighting',
  'Environmental health concerns (Mosquitoes, Rodents, Dumping)',
  'Illegal utility connections (WASA, T&TEC)',
  'Guiding youth to job Programs or Training opportunities',
  'Connecting residents to Career Fairs, Apprenticeships',
  'Supporting Small Community Businesses',
  'Family Conflict',
  'Support for single mothers or at-risk households',
  'Referrals to social workers or the Children\'s Authority',
  'Restraining-order situations',
  'Truancy',
  'Bullying',
  'Cyberbullying',
  'Violence or Weapons in Schools',
  'Mentoring for "at-risk" students',
  'Substance uses in schools',
  'Identifying vulnerable persons who may need help in emergencies',
  'Assisting in community evacuation or shelter organization',
  'Supporting relief distribution during floods or fires',
  'Identifying suspicious activity',
  'Community awareness and reporting channels',
  'Supporting NGOs and social agencies',
  'Welfare checks',
  'Helping with access to social services',
  'Safety assessments in homes',
  'Community watch initiatives focused on vulnerable persons',
  'Community Trust & Relationship Building',
  'Reducing fear of police',
  'Being accessible and visible',
  'Strengthening communication between residents and authorities',
  'Encouraging anonymous reporting and safe disclosures',
].sort()

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
].sort()

type FilterState = {
  category: string
  location: string
  severity: string
  dateFrom: string
  dateTo: string
  status: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    location: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all',
  })
  const [analyzingReportId, setAnalyzingReportId] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({})
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null)
  const [analysisErrors, setAnalysisErrors] = useState<Record<string, string>>({})

  // Load reports from localStorage on component mount
  // This ensures reports persist across page refreshes
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

  // Sync reports with localStorage when they change (for real-time updates)
  useEffect(() => {
    try {
      // Save to localStorage whenever reports change
      localStorage.setItem('communityReports', JSON.stringify(reports))
    } catch (error) {
      console.error('Error saving reports to localStorage:', error)
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider removing old reports.')
      }
    }
  }, [reports])

  // Analyze incident using AI
  const analyzeIncident = async (report: Report) => {
    setAnalyzingReportId(report.id)
    setAnalysisErrors(prev => {
      const updated = { ...prev }
      delete updated[report.id]
      return updated
    })
    
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
          setAnalysisErrors(prev => ({
            ...prev,
            [report.id]: `Analysis completed with limited information: ${errorMessage}`,
          }))
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
        setAnalysisErrors(prev => {
          const updated = { ...prev }
          delete updated[report.id]
          return updated
        })
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
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'Analysis service is temporarily unavailable due to high demand. Please try again later.'
        } else if (error.message.includes('authentication') || error.message.includes('401')) {
          errorMessage = 'Analysis service authentication failed. Please contact support if this persists.'
        } else {
          errorMessage = error.message
        }
      }
      
      setAnalysisErrors(prev => ({
        ...prev,
        [report.id]: errorMessage,
      }))
    } finally {
      setAnalyzingReportId(null)
    }
  }

  // Filter reports
  const filteredReports = reports.filter((report) => {
    // Category filter
    if (filters.category !== 'all' && report.category !== filters.category) {
      return false
    }

    // Location filter
    if (filters.location !== 'all' && report.location !== filters.location) {
      return false
    }

    // Severity/Priority filter
    if (filters.severity !== 'all' && report.priority !== filters.severity) {
      return false
    }

    // Status filter
    if (filters.status !== 'all' && report.status !== filters.status) {
      return false
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      const reportDate = new Date(report.createdAt)
      reportDate.setHours(0, 0, 0, 0)
      if (reportDate < fromDate) {
        return false
      }
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      const reportDate = new Date(report.createdAt)
      if (reportDate > toDate) {
        return false
      }
    }

    return true
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      location: 'all',
      severity: 'all',
      dateFrom: '',
      dateTo: '',
      status: 'all',
    })
  }

  // Calculate metrics using array methods
  const calculateMetrics = () => {
    // Total incidents
    const totalIncidents = reports.length

    // Most common categories
    const categoryCounts = reports.reduce((acc, report) => {
      const category = report.category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostCommonCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Trends over time (group by month)
    const trendsByMonth = reports.reduce((acc, report) => {
      const date = new Date(report.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      acc[monthKey] = (acc[monthKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const trends = Object.entries(trendsByMonth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months

    // Priority distribution
    const priorityDistribution = reports.reduce((acc, report) => {
      acc[report.priority] = (acc[report.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Status distribution
    const statusDistribution = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Most common locations
    const locationCounts = reports
      .filter(r => r.location)
      .reduce((acc, report) => {
        const location = report.location!
        acc[location] = (acc[location] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const mostCommonLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Average incidents per day (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentReports = reports.filter(r => new Date(r.createdAt) >= thirtyDaysAgo)
    const averagePerDay = recentReports.length / 30

    return {
      totalIncidents,
      mostCommonCategories,
      trends,
      priorityDistribution,
      statusDistribution,
      mostCommonLocations,
      averagePerDay,
      recentReportsCount: recentReports.length,
    }
  }

  const metrics = calculateMetrics()

  // Export reports to downloadable file
  const exportReports = () => {
    try {
      // Prepare export data with analysis results if available
      const exportData = filteredReports.map(report => {
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
          // Include AI analysis if available
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

      // Create JSON string with pretty formatting
      const jsonString = JSON.stringify({
        exportDate: new Date().toISOString(),
        totalReports: exportData.length,
        reports: exportData,
      }, null, 2)

      // Create blob and download
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

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.severity !== 'all' ||
    filters.status !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== ''

  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">All Incident Reports</h1>
            <p className="mt-2 text-muted">Filter and search through all community incident reports</p>
          </div>
        </Reveal>

        {/* Filters Section */}
        <Reveal delayMs={80}>
          <div className="mb-8 rounded-2xl border border-border/60 bg-surface/70 p-6 backdrop-blur dark:border-white/10 dark:bg-surface/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Category Filter */}
              <div>
                <label htmlFor="filter-category" className="mb-2 block text-sm font-medium text-foreground">
                  Category
                </label>
                <select
                  id="filter-category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                >
                  <option value="all">All Categories</option>
                  {allCategoriesList.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label htmlFor="filter-location" className="mb-2 block text-sm font-medium text-foreground">
                  Location
                </label>
                <select
                  id="filter-location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label htmlFor="filter-severity" className="mb-2 block text-sm font-medium text-foreground">
                  Severity
                </label>
                <select
                  id="filter-severity"
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="filter-status" className="mb-2 block text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Date From Filter */}
              <div>
                <label htmlFor="filter-date-from" className="mb-2 block text-sm font-medium text-foreground">
                  Date From
                </label>
                <input
                  id="filter-date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                />
              </div>

              {/* Date To Filter */}
              <div>
                <label htmlFor="filter-date-to" className="mb-2 block text-sm font-medium text-foreground">
                  Date To
                </label>
                <input
                  id="filter-date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-surface/30 dark:border-white/10"
                />
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-medium text-muted">Active filters:</span>
                {filters.category !== 'all' && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                    Category: {filters.category}
                  </span>
                )}
                {filters.location !== 'all' && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                    Location: {filters.location}
                  </span>
                )}
                {filters.severity !== 'all' && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                    Severity: {filters.severity}
                  </span>
                )}
                {filters.status !== 'all' && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                    Status: {filters.status}
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                    From: {new Date(filters.dateFrom).toLocaleDateString()}
                  </span>
                )}
                {filters.dateTo && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                    To: {new Date(filters.dateTo).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </Reveal>

        {/* Metrics Dashboard */}
        <Reveal delayMs={160}>
          <div className="mb-8 rounded-2xl border border-border/60 bg-surface/70 p-6 backdrop-blur dark:border-white/10 dark:bg-surface/40">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Metrics & Analytics</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Incidents */}
              <div className="rounded-lg border border-border/40 bg-surface-alt/50 p-4 dark:border-white/10 dark:bg-surface/30">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-foreground">Total Incidents</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{metrics.totalIncidents}</p>
                <p className="mt-1 text-xs text-muted">All time</p>
              </div>

              {/* Recent Reports (30 days) */}
              <div className="rounded-lg border border-border/40 bg-surface-alt/50 p-4 dark:border-white/10 dark:bg-surface/30">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-blue-500/20 p-2">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-foreground">Last 30 Days</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{metrics.recentReportsCount}</p>
                <p className="mt-1 text-xs text-muted">
                  {metrics.averagePerDay.toFixed(1)} per day avg
                </p>
              </div>

              {/* High Priority */}
              <div className="rounded-lg border border-border/40 bg-surface-alt/50 p-4 dark:border-white/10 dark:bg-surface/30">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-red-500/20 p-2">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-foreground">High Priority</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{metrics.priorityDistribution.high || 0}</p>
                <p className="mt-1 text-xs text-muted">
                  {metrics.totalIncidents > 0 
                    ? `${((metrics.priorityDistribution.high || 0) / metrics.totalIncidents * 100).toFixed(1)}% of total`
                    : '0% of total'}
                </p>
              </div>

              {/* Pending Status */}
              <div className="rounded-lg border border-border/40 bg-surface-alt/50 p-4 dark:border-white/10 dark:bg-surface/30">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-orange-500/20 p-2">
                    <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-foreground">Pending</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{metrics.statusDistribution.pending || 0}</p>
                <p className="mt-1 text-xs text-muted">
                  {metrics.totalIncidents > 0
                    ? `${((metrics.statusDistribution.pending || 0) / metrics.totalIncidents * 100).toFixed(1)}% of total`
                    : '0% of total'}
                </p>
              </div>
            </div>

            {/* Category Distribution Charts */}
            {metrics.mostCommonCategories.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Incident Distribution by Category</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Bar Chart */}
                  <div className="rounded-lg border border-border/40 bg-surface-alt/30 p-4 dark:border-white/10 dark:bg-surface/20">
                    <h4 className="mb-4 text-xs font-medium text-foreground/70 uppercase tracking-wide">Bar Chart</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={metrics.mostCommonCategories.map(item => ({
                          name: item.category.length > 20 ? item.category.substring(0, 20) + '...' : item.category,
                          fullName: item.category,
                          count: item.count,
                        }))}
                        margin={{ top: 5, right: 5, left: 5, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tick={{ fill: 'hsl(var(--foreground) / 0.7)', fontSize: 11 }}
                        />
                        <YAxis
                          tick={{ fill: 'hsl(var(--foreground) / 0.7)', fontSize: 11 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--surface))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                          }}
                          formatter={(value: number, name: string, props: any) => [
                            `${value} incidents`,
                            props.payload.fullName,
                          ]}
                        />
                        <Bar
                          dataKey="count"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        >
                          {metrics.mostCommonCategories.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(${262 + index * 30}, 83%, ${58 + index * 5}%)`}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div className="rounded-lg border border-border/40 bg-surface-alt/30 p-4 dark:border-white/10 dark:bg-surface/20">
                    <h4 className="mb-4 text-xs font-medium text-foreground/70 uppercase tracking-wide">Pie Chart</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={metrics.mostCommonCategories.map(item => ({
                            name: item.category.length > 25 ? item.category.substring(0, 25) + '...' : item.category,
                            fullName: item.category,
                            value: item.count,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                          outerRadius={80}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                        >
                          {metrics.mostCommonCategories.map((entry, index) => {
                            const colors = [
                              'hsl(262, 83%, 58%)', // Primary purple
                              'hsl(199, 89%, 48%)', // Accent blue
                              'hsl(142, 76%, 36%)', // Green
                              'hsl(25, 95%, 53%)',  // Orange
                              'hsl(0, 84%, 60%)',   // Red
                            ]
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                              />
                            )
                          })}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--surface))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                          }}
                          formatter={(value: number, name: string, props: any) => [
                            `${value} incidents (${((value / metrics.totalIncidents) * 100).toFixed(1)}%)`,
                            props.payload.fullName,
                          ]}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '11px' }}
                          formatter={(value, entry: any) => entry.payload.fullName}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category List */}
                <div className="mt-4 space-y-2">
                  {metrics.mostCommonCategories.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between rounded-lg border border-border/40 bg-surface-alt/30 p-3 dark:border-white/10 dark:bg-surface/20">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm text-foreground">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-alt/50 dark:bg-surface/30">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${(item.count / metrics.totalIncidents) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends Over Time */}
            {metrics.trends.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Trends Over Time (Last 6 Months)</h3>
                <div className="rounded-lg border border-border/40 bg-surface-alt/30 p-4 dark:border-white/10 dark:bg-surface/20">
                  <div className="flex items-end justify-between gap-2">
                    {metrics.trends.map((trend, index) => {
                      const maxCount = Math.max(...metrics.trends.map(t => t.count))
                      const height = maxCount > 0 ? (trend.count / maxCount) * 100 : 0
                      const monthName = new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short' })
                      
                      return (
                        <div key={trend.month} className="flex flex-1 flex-col items-center gap-2">
                          <div className="relative flex h-32 w-full items-end justify-center">
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-primary to-primary/60 transition-all hover:from-primary/80 hover:to-primary/40"
                              style={{ height: `${height}%`, minHeight: trend.count > 0 ? '4px' : '0' }}
                              title={`${monthName}: ${trend.count} incidents`}
                            />
                            <span className="absolute -bottom-5 text-xs font-semibold text-foreground">
                              {trend.count}
                            </span>
                          </div>
                          <span className="mt-6 text-xs text-muted">{monthName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Priority & Status Distribution */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Priority Distribution */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Priority Distribution</h3>
                <div className="space-y-3">
                  {(['high', 'medium', 'low'] as const).map((priority) => {
                    const count = metrics.priorityDistribution[priority] || 0
                    const percentage = metrics.totalIncidents > 0 ? (count / metrics.totalIncidents) * 100 : 0
                    const colorClass = {
                      high: 'bg-red-500/20 text-red-400 border-red-500/40',
                      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
                      low: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
                    }[priority]

                    return (
                      <div key={priority} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize font-medium text-foreground">{priority}</span>
                          <span className="text-muted">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface-alt/50 dark:bg-surface/30">
                          <div
                            className={`h-full rounded-full transition-all ${colorClass.split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Distribution */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Status Distribution</h3>
                <div className="space-y-3">
                  {(['pending', 'reviewing', 'resolved'] as const).map((status) => {
                    const count = metrics.statusDistribution[status] || 0
                    const percentage = metrics.totalIncidents > 0 ? (count / metrics.totalIncidents) * 100 : 0
                    const colorClass = {
                      pending: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
                      reviewing: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
                      resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                    }[status]

                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize font-medium text-foreground">{status}</span>
                          <span className="text-muted">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface-alt/50 dark:bg-surface/30">
                          <div
                            className={`h-full rounded-full transition-all ${colorClass.split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Most Common Locations */}
            {metrics.mostCommonLocations.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Most Common Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {metrics.mostCommonLocations.map((item) => (
                    <div
                      key={item.location}
                      className="rounded-lg border border-border/40 bg-surface-alt/30 px-3 py-2 dark:border-white/10 dark:bg-surface/20"
                    >
                      <span className="text-sm text-foreground">{item.location}</span>
                      <span className="ml-2 text-xs font-semibold text-primary">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Results Summary */}
        <Reveal delayMs={240}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">
                Showing <span className="font-semibold text-foreground">{filteredReports.length}</span> of{' '}
                <span className="font-semibold text-foreground">{reports.length}</span> reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              {filteredReports.length > 0 && (
                <button
                  onClick={exportReports}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Reports
                </button>
              )}
              <a
                href="#reports"
                className="text-sm text-primary hover:underline"
              >
                Submit New Report →
              </a>
            </div>
          </div>
        </Reveal>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Reveal delayMs={240}>
              <div className="rounded-2xl border border-border/60 bg-surface/70 p-12 text-center backdrop-blur dark:border-white/10 dark:bg-surface/40">
                <svg
                  className="mx-auto h-12 w-12 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No reports found</h3>
                <p className="mt-2 text-sm text-muted">
                  {reports.length === 0
                    ? 'No reports have been submitted yet.'
                    : 'Try adjusting your filters to see more results.'}
                </p>
              </div>
            </Reveal>
          ) : (
            filteredReports.map((report, index) => (
              <Reveal key={report.id} delayMs={index * 40}>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/60 bg-surface/60 p-6 transition hover:bg-surface-alt/70 dark:border-white/10 dark:bg-surface/30">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">{report.title}</h3>
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">{report.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {report.category}
                          </span>
                          {report.location && (
                            <span className="flex items-center gap-1.5">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {report.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {report.createdAt.toLocaleDateString()}
                          </span>
                          {report.incidentDate && (
                            <span className="flex items-center gap-1.5">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Incident: {report.incidentDate} {report.incidentTime && `at ${report.incidentTime}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 lg:items-end">
                        <button
                          onClick={() => analyzeIncident(report)}
                          disabled={analyzingReportId === report.id}
                          className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary/20 dark:text-primary-foreground"
                        >
                          {analyzingReportId === report.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <IncidentAnalysis analysis={null} isLoading={true} />
                  )}

                  {/* Show error message */}
                  {analysisErrors[report.id] && analyzingReportId !== report.id && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                      <div className="flex items-start gap-3">
                        <svg className="h-5 w-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-red-400">Analysis Error</h4>
                          <p className="mt-1 text-sm text-red-300">{analysisErrors[report.id]}</p>
                          <button
                            onClick={() => analyzeIncident(report)}
                            className="mt-3 text-xs text-red-400 underline hover:text-red-300"
                          >
                            Try again
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setAnalysisErrors(prev => {
                              const updated = { ...prev }
                              delete updated[report.id]
                              return updated
                            })
                          }}
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
                  {analysisResults[report.id] && analyzingReportId !== report.id && !analysisErrors[report.id] && (
                    <IncidentAnalysis analysis={analysisResults[report.id]} isLoading={false} />
                  )}
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

