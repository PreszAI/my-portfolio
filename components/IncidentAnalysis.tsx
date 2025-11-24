'use client'

import { useState } from 'react'

type ExtractedEntities = {
  people: string[]
  locations: string[]
  times: string[]
  organizations?: string[]
  other?: string[]
}

type AnalysisData = {
  category: string
  severity: 'low' | 'medium' | 'high'
  entities: ExtractedEntities
  summary: string
  suggestedActions?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  urgency?: 'low' | 'medium' | 'high'
  tags?: string[]
}

type IncidentAnalysisProps = {
  analysis: AnalysisData | null
  isLoading?: boolean
}

export default function IncidentAnalysis({ analysis, isLoading }: IncidentAnalysisProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    entities: true,
    actions: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-surface/70 p-6 backdrop-blur dark:border-white/10 dark:bg-surface/40">
        <div className="space-y-4">
          {/* Header with animated loading */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <div className="absolute inset-0 h-6 w-6 animate-ping rounded-full border-2 border-primary/20" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Analyzing Incident</h3>
              <p className="text-sm text-muted">AI is processing your report...</p>
            </div>
          </div>

          {/* Loading steps */}
          <div className="space-y-3 rounded-lg border border-border/40 bg-surface-alt/30 p-4 dark:border-white/10 dark:bg-surface/20">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-foreground/70">Extracting entities (people, locations, times)...</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-75" />
              <span className="text-sm text-foreground/70">Categorizing incident...</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" />
              <span className="text-sm text-foreground/70">Assessing severity and generating summary...</span>
            </div>
          </div>

          {/* Progress bar animation */}
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-alt/50 dark:bg-surface/30">
            <div className="h-full w-full animate-[loading_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/40 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/40 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  }

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )
      case 'medium':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )
      case 'low':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.179 1.08A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.179-1.08A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const hasEntities = 
    analysis.entities.people.length > 0 ||
    analysis.entities.locations.length > 0 ||
    analysis.entities.times.length > 0 ||
    (analysis.entities.organizations && analysis.entities.organizations.length > 0)

  return (
    <div className="rounded-2xl border border-border/60 bg-surface/70 p-6 backdrop-blur dark:border-white/10 dark:bg-surface/40">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
          </div>
          <p className="text-sm text-muted">Automated incident analysis and insights</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${getSeverityColor(analysis.severity)}`}>
          {getSeverityIcon(analysis.severity)}
          <span>{analysis.severity} Severity</span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:bg-primary/20 dark:text-primary-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {analysis.category}
        </span>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-lg border border-border/40 bg-surface-alt/50 p-4 dark:border-white/10 dark:bg-surface/30">
        <div className="mb-2 flex items-center gap-2">
          <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-sm font-semibold text-foreground">Summary</h4>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">{analysis.summary}</p>
      </div>

      {/* Extracted Entities */}
      {hasEntities && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('entities')}
            className="mb-3 flex w-full items-center justify-between rounded-lg border border-border/40 bg-surface-alt/50 p-3 transition hover:bg-surface-alt/70 dark:border-white/10 dark:bg-surface/30 dark:hover:bg-surface/40"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 className="text-sm font-semibold text-foreground">Extracted Entities</h4>
            </div>
            <svg
              className={`h-4 w-4 text-muted transition-transform ${expandedSections.entities ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.entities && (
            <div className="space-y-4 rounded-lg border border-border/40 bg-surface-alt/30 p-4 dark:border-white/10 dark:bg-surface/20">
              {/* People */}
              {analysis.entities.people.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-foreground/60">People</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.entities.people.map((person, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300 dark:bg-blue-500/20 dark:text-blue-200"
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {analysis.entities.locations.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Locations</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.entities.locations.map((location, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs text-green-300 dark:bg-green-500/20 dark:text-green-200"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Times */}
              {analysis.entities.times.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Times</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.entities.times.map((time, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300 dark:bg-purple-500/20 dark:text-purple-200"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations */}
              {analysis.entities.organizations && analysis.entities.organizations.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Organizations</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.entities.organizations.map((org, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs text-orange-300 dark:bg-orange-500/20 dark:text-orange-200"
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Suggested Actions */}
      {analysis.suggestedActions && analysis.suggestedActions.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection('actions')}
            className="mb-3 flex w-full items-center justify-between rounded-lg border border-border/40 bg-surface-alt/50 p-3 transition hover:bg-surface-alt/70 dark:border-white/10 dark:bg-surface/30 dark:hover:bg-surface/40"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h4 className="text-sm font-semibold text-foreground">Suggested Actions</h4>
            </div>
            <svg
              className={`h-4 w-4 text-muted transition-transform ${expandedSections.actions ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.actions && (
            <div className="space-y-2 rounded-lg border border-border/40 bg-surface-alt/30 p-4 dark:border-white/10 dark:bg-surface/20">
              {analysis.suggestedActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  </div>
                  <p className="flex-1 text-sm text-foreground/80">{action}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags (if available) */}
      {analysis.tags && analysis.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {analysis.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full border border-border/40 bg-surface-alt/50 px-2.5 py-1 text-xs text-muted dark:border-white/10 dark:bg-surface/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

