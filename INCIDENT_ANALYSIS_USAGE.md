# Incident Analysis Component Usage

## Overview

The `IncidentAnalysis` component displays AI-generated analysis results with category badges, severity indicators, and extracted entities.

## Features

- **Category Badge**: Shows the primary incident category
- **Severity Indicator**: Color-coded badge (low/medium/high) with icons
- **Summary**: Concise AI-generated summary of the incident
- **Extracted Entities**: Expandable sections showing:
  - People mentioned
  - Locations mentioned
  - Times mentioned
  - Organizations mentioned
- **Suggested Actions**: Expandable list of AI-recommended actions
- **Tags**: Optional tags for categorization

## Usage Example

```tsx
import IncidentAnalysis from '@/components/IncidentAnalysis'

// Example: After calling the AI analysis API
const analysisData = {
  category: "Crime, Safety & Security",
  severity: "high",
  entities: {
    people: ["John Doe", "Officer Smith", "witness"],
    locations: ["Main Street", "Community Center"],
    times: ["2:30 PM", "yesterday afternoon"],
    organizations: ["Police Department"]
  },
  summary: "This incident involves suspicious activity reported by a community member. Immediate attention is required due to potential safety concerns.",
  suggestedActions: [
    "Dispatch patrol unit to investigate",
    "Contact reporting party for additional details",
    "Review security footage if available"
  ],
  tags: ["safety", "community", "urgent"]
}

// In your component
<IncidentAnalysis analysis={analysisData} />
```

## Integration with Reports Component

To integrate with the Reports component and call the AI API:

```tsx
// In Reports.tsx
import IncidentAnalysis from '@/components/IncidentAnalysis'
import { useState } from 'react'

// Add state for analysis
const [analysis, setAnalysis] = useState(null)
const [analyzing, setAnalyzing] = useState(false)

// Function to analyze incident
const analyzeIncident = async (report: Report) => {
  setAnalyzing(true)
  try {
    const response = await fetch('/api/analyze-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    if (data.success) {
      setAnalysis(data.data)
    }
  } catch (error) {
    console.error('Failed to analyze incident:', error)
  } finally {
    setAnalyzing(false)
  }
}

// In your JSX, after a report is submitted or selected:
{analysis && <IncidentAnalysis analysis={analysis} />}
{analyzing && <IncidentAnalysis analysis={null} isLoading={true} />}
```

## Component Props

```typescript
type IncidentAnalysisProps = {
  analysis: AnalysisData | null
  isLoading?: boolean
}

type AnalysisData = {
  category: string
  severity: 'low' | 'medium' | 'high'
  entities: {
    people: string[]
    locations: string[]
    times: string[]
    organizations?: string[]
    other?: string[]
  }
  summary: string
  suggestedActions?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  urgency?: 'low' | 'medium' | 'high'
  tags?: string[]
}
```

## Styling

The component uses Tailwind CSS with:
- Responsive design
- Dark mode support
- Smooth animations and transitions
- Color-coded severity indicators
- Expandable/collapsible sections

## Color Scheme

- **High Severity**: Red tones
- **Medium Severity**: Yellow/Orange tones
- **Low Severity**: Green tones
- **People**: Blue badges
- **Locations**: Green badges
- **Times**: Purple badges
- **Organizations**: Orange badges

