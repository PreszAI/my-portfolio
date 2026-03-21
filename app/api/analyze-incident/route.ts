import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route: /api/analyze-incident
 * 
 * This endpoint analyzes community incident reports using AI.
 * API keys are kept secure on the server - never exposed to the client.
 * 
 * Security Best Practices:
 * - API keys stored in environment variables (server-side only)
 * - Input validation and sanitization
 * - Rate limiting (can be added with middleware)
 * - Error handling without exposing sensitive information
 */

type IncidentAnalysisRequest = {
  title: string
  description: string
  category: string
  location?: string
  priority?: 'low' | 'medium' | 'high'
  incidentDate?: string
  incidentTime?: string
}

type ExtractedEntities = {
  people: string[]
  locations: string[]
  times: string[]
  organizations?: string[]
  other?: string[]
}

type IncidentCategory = {
  primaryCategory: string
  subCategory?: string
  categoryConfidence: 'high' | 'medium' | 'low'
  relatedCategories: string[]
}

type AnalysisResponse = {
  category: string
  severity: 'low' | 'medium' | 'high'
  entities: ExtractedEntities
  summary: string
  // Additional fields for backward compatibility
  suggestedActions?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  urgency?: 'low' | 'medium' | 'high'
  tags?: string[]
  categorization?: IncidentCategory
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body: IncidentAnalysisRequest
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format. Please check your input and try again.',
          errorType: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    // Input validation
    if (!body.title || !body.description || !body.category) {
      const missingFields = []
      if (!body.title) missingFields.push('title')
      if (!body.description) missingFields.push('description')
      if (!body.category) missingFields.push('category')
      
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}. Please provide all required information.`,
          errorType: 'VALIDATION_ERROR',
          missingFields
        },
        { status: 400 }
      )
    }

    // Sanitize inputs (basic validation)
    const sanitizedTitle = body.title.trim().substring(0, 200)
    const sanitizedDescription = body.description.trim().substring(0, 2000)
    const sanitizedCategory = body.category.trim().substring(0, 200)

    // Extract entities from description (before AI call for faster processing)
    const extractedEntities = extractEntities(sanitizedDescription, body.location, body.incidentDate, body.incidentTime)
    
    // Categorize incident based on category field
    const categorization = categorizeIncident(sanitizedCategory, sanitizedTitle, sanitizedDescription)

    // Validate API key exists (should be set in environment variables)
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY
    
    // If no API key, provide fallback analysis using extracted data
    if (!apiKey) {
      console.warn('API key not configured - using fallback analysis')
      
      // Determine severity based on priority and keywords
      let severity: 'low' | 'medium' | 'high' = body.priority || 'medium'
      const descLower = sanitizedDescription.toLowerCase()
      const categoryLower = sanitizedCategory.toLowerCase()
      
      // High severity indicators - check category first for specific high-severity categories
      if (categoryLower.includes('gang activity') || categoryLower.includes('domestic violence') || 
          categoryLower.includes('stolen vehicle') || categoryLower.includes('firearm')) {
        severity = 'high'
      }
      // Then check description for high severity keywords
      else if (descLower.includes('urgent') || descLower.includes('emergency') || descLower.includes('critical') || 
          descLower.includes('immediate') || descLower.includes('danger') || descLower.includes('threat') ||
          descLower.includes('violence') || descLower.includes('weapon') || descLower.includes('fire') ||
          descLower.includes('stolen') || descLower.includes('break-in') || descLower.includes('burglary') ||
          descLower.includes('unconscious') || descLower.includes('missing') || 
          (descLower.includes('elderly') && descLower.includes('concern')) ||
          // Gang activity and suspicious activity that poses threats
          (descLower.includes('gang') && descLower.includes('activity')) ||
          (descLower.includes('suspicious activity') && (descLower.includes('drug') || descLower.includes('safety') || descLower.includes('children')))) {
        severity = 'high'
      }
      // Medium severity for gambling (criminal activity but not immediately dangerous)
      // Only set to medium if severity hasn't already been set to high
      // Check this before low severity to ensure gambling is medium, not low
      else if (categoryLower.includes('gambling') || descLower.includes('gambling')) {
        severity = 'medium'
      }
      // Low severity indicators
      else if (descLower.includes('minor') || descLower.includes('low priority') || descLower.includes('informational') ||
               // Noise complaints are generally low (quality of life issue, not immediate danger)
               // Even if "extremely loud" or "affecting", noise is still a quality of life issue
               (categoryLower.includes('noise') || (descLower.includes('noise') && !descLower.includes('violence') && !descLower.includes('weapon')))) {
        severity = 'low'
      }

      // Generate a basic summary
      const summary = `This incident has been categorized as "${categorization.primaryCategory}" with ${severity} severity. ` +
        `${extractedEntities.locations.length > 0 ? `Location: ${extractedEntities.locations[0]}. ` : ''}` +
        `${extractedEntities.people.length > 0 ? `People involved: ${extractedEntities.people.slice(0, 3).join(', ')}. ` : ''}` +
        `The incident requires ${severity === 'high' ? 'immediate' : severity === 'medium' ? 'prompt' : 'standard'} attention.`

      return NextResponse.json({
        success: true,
        data: {
          category: categorization.primaryCategory,
          severity: severity,
          entities: extractedEntities,
          summary: summary,
          suggestedActions: [
            'Document all details of the incident',
            severity === 'high' ? 'Notify relevant authorities immediately' : 'Notify relevant authorities if needed',
            'Follow up with community members if applicable',
            'Monitor the situation for any changes'
          ],
          riskLevel: severity,
          urgency: severity,
          tags: [categorization.primaryCategory, severity, ...(body.location ? [body.location] : [])],
          categorization: categorization
        }
      })
    }

    // Prepare the prompt for AI analysis with specific JSON structure
    const analysisPrompt = `You are a community safety analyst. Analyze this incident report and return ONLY valid JSON.

AVAILABLE PRIMARY CATEGORIES (use exactly one of these):
1. "Crime, Safety & Security" - Crimes (theft, burglary, vandalism, break-ins), violence (domestic violence, assault, gang activity), security threats (firearms, stolen vehicles), public safety issues (noise complaints, neighbor disputes), youth gambling, suspicious activity that poses security risks
2. "Youth & Community Development" - Positive youth programs, mentorship needs, school dropout/absenteeism, after-school activities, sports programs, youth clubs (NOT crimes committed by youth - those go to Crime, Safety & Security)
3. "Mental Health & Social Support" - Mental health resources, persons at risk of self-harm, welfare checks for vulnerable persons, elderly living alone, connecting people to mental health services
4. "Substance Abuse & Addiction" - Drug/alcohol misuse, public intoxication, drug dealing, rehabilitation referrals, substance use in public spaces
5. "Community Cohesion & Social Inclusion" - Community divisions (ethnic, gang-related, geographic), integrating marginalized groups, community meetings/forums, peace-building initiatives
6. "Education & Awareness" - Crime prevention education, safety workshops, awareness campaigns, school talks (NOT incidents that happened at school - those go to School & Student-Related Issues)
7. "Housing & Environmental Conditions" - Unsafe/abandoned buildings, derelict vehicles, nonfunctional street lighting, environmental health (mosquitoes, rodents, dumping), illegal utility connections
8. "Economic & Employment-Related Issues" - Job programs, career fairs, apprenticeships, small business support, employment assistance
9. "Domestic & Family Issues" - Family conflict (non-violent), support for single mothers, social worker referrals, Children's Authority referrals, restraining orders (NOTE: Domestic VIOLENCE goes to Crime, Safety & Security)
10. "School & Student-Related Issues" - Truancy, bullying, cyberbullying, violence/weapons in schools, substance use in schools, mentoring at-risk students
11. "Disaster Preparedness & Emergency Support" - Emergency preparedness, evacuation planning, relief distribution during disasters, identifying vulnerable persons for emergencies
12. "Human Trafficking & Exploitation" - Suspicious trafficking activity, exploitation concerns, awareness campaigns, NGO support for trafficking victims
13. "Elderly & Persons with Disabilities" - Welfare checks, social services access, safety assessments, community watch for vulnerable persons

SEVERITY GUIDELINES (assess based on ACTUAL THREAT LEVEL in description, not just priority field):
- "high": Immediate danger to life/safety (violence, weapons, active threats, emergencies, missing vulnerable persons, domestic violence, drug dealing, structural collapse risk, welfare checks for unresponsive elderly). Also: serious crimes (theft with high value, stolen vehicles, break-ins with violence)
- "medium": Significant issues requiring prompt attention but not immediately life-threatening (theft, vandalism, noise complaints affecting many, youth gambling, suspicious activity, cyberbullying, abandoned buildings, ongoing disputes)
- "low": Minor issues, isolated noise complaints, non-urgent informational reports, routine matters

CATEGORY MAPPING RULES:
- Youth gambling → "Crime, Safety & Security" (even though it involves youth, it's a crime)
- Domestic violence → "Crime, Safety & Security" (violence is a crime, not just a family issue)
- Stolen vehicles → "Crime, Safety & Security" (property crime)
- Noise complaints → "Crime, Safety & Security" (public safety/quality of life issue)
- Theft/burglary → "Crime, Safety & Security" (property crime)
- Suspicious activity (drugs, illegal operations) → "Crime, Safety & Security" or "Substance Abuse & Addiction" depending on context
- Welfare checks for elderly → "Mental Health & Social Support" or "Elderly & Persons with Disabilities"
- Cyberbullying → "School & Student-Related Issues" (even if it happens online, it's school-related)
- Abandoned buildings → "Housing & Environmental Conditions"
- Drug use in public → "Substance Abuse & Addiction"

INCIDENT DETAILS:
Title: ${sanitizedTitle}
Category: ${sanitizedCategory}
Description: ${sanitizedDescription}
Location: ${body.location || 'Not specified'}
Priority: ${body.priority || 'medium'}
Date: ${body.incidentDate || 'Not specified'}
Time: ${body.incidentTime || 'Not specified'}

ANALYSIS REQUIREMENTS:
1. Map the provided category to the most appropriate PRIMARY CATEGORY from the list above using the mapping rules
2. Assess severity based on ACTUAL THREAT LEVEL in the description content - look for keywords like "violence", "weapon", "urgent", "emergency", "danger", "threat", "unconscious", "missing", "stolen", "break-in"
3. Extract all people mentioned:
   - Full names (e.g., "John Smith", "Marcus Johnson")
   - Roles with names (e.g., "Officer Smith", "Constable Brown", "Mrs. Williams")
   - Roles alone (e.g., "witness", "suspect", "victim", "neighbor")
   - Descriptions (e.g., "teenager", "elderly man", "young men in hoodies")
4. Extract all locations:
   - Street addresses (e.g., "45 Duncan Street", "23 Springside")
   - Street names (e.g., "Nelson Street", "St. John Street")
   - Landmarks (e.g., "community center", "abandoned building", "park")
   - Areas/neighborhoods (e.g., "Beetham Phase 2", "Picton Housing")
5. Extract all times mentioned:
   - Specific times (e.g., "2:30 PM", "8 PM", "6 AM")
   - Relative times (e.g., "yesterday", "last night", "this morning", "for the past week")
   - Time ranges (e.g., "between 2 AM and 6 AM", "from 10 PM until 3 AM")
6. Extract organizations if mentioned (e.g., "Police Department", "Children's Authority", "local station")
7. Write a concise 2-3 sentence summary that:
   - States what happened (the incident type)
   - Mentions key details (who, where, when if relevant)
   - Highlights the main concern or risk

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no text before or after.

REQUIRED JSON FORMAT:
{
  "category": "Crime, Safety & Security",
  "severity": "high",
  "entities": {
    "people": ["John Doe", "Officer Smith", "witness", "teenagers"],
    "locations": ["Main Street", "Community Center", "45 Duncan Street"],
    "times": ["2:30 PM", "yesterday afternoon", "last night"],
    "organizations": ["Police Department"]
  },
  "summary": "Brief 2-3 sentence summary of the incident, key details, and immediate concerns."
}`

    // Call AI service (OpenAI example - adjust based on your AI provider)
    let aiResponse: string
    try {
      aiResponse = await callAIService(apiKey, analysisPrompt)
    } catch (aiError) {
      console.error('AI service call failed:', aiError)
      
      // Check if this is a 503 (Service Unavailable) error - use fallback analysis instead of failing
      if (aiError instanceof Error && (
        aiError.message.includes('503') || 
        aiError.message.includes('temporarily unavailable') ||
        aiError.message.includes('Service Unavailable')
      )) {
        console.warn('AI service unavailable (503), using fallback analysis')
        
        // Determine severity based on priority and keywords
        let severity: 'low' | 'medium' | 'high' = body.priority || 'medium'
        const descLower = sanitizedDescription.toLowerCase()
        const categoryLower = sanitizedCategory.toLowerCase()
        
        // High severity indicators - check category first for specific high-severity categories
        if (categoryLower.includes('gang activity') || categoryLower.includes('domestic violence') || 
            categoryLower.includes('stolen vehicle') || categoryLower.includes('firearm')) {
          severity = 'high'
        }
        // Then check description for high severity keywords
        else if (descLower.includes('urgent') || descLower.includes('emergency') || descLower.includes('critical') || 
            descLower.includes('immediate') || descLower.includes('danger') || descLower.includes('threat') ||
            descLower.includes('violence') || descLower.includes('weapon') || descLower.includes('fire') ||
            descLower.includes('stolen') || descLower.includes('break-in') || descLower.includes('burglary') ||
            descLower.includes('unconscious') || descLower.includes('missing') || 
            (descLower.includes('elderly') && descLower.includes('concern')) ||
            // Gang activity and suspicious activity that poses threats
            (descLower.includes('gang') && descLower.includes('activity')) ||
            (descLower.includes('suspicious activity') && (descLower.includes('drug') || descLower.includes('safety') || descLower.includes('children')))) {
          severity = 'high'
        } 
        // Medium severity for gambling (criminal activity but not immediately dangerous)
        // Only set to medium if severity hasn't already been set to high
        // Check this before low severity to ensure gambling is medium, not low
        else if (categoryLower.includes('gambling') || descLower.includes('gambling')) {
          severity = 'medium'
        }
        // Low severity indicators
        else if (descLower.includes('minor') || descLower.includes('low priority') || descLower.includes('informational') ||
                 // Noise complaints are generally low (quality of life issue, not immediate danger)
                 // Even if "extremely loud" or "affecting", noise is still a quality of life issue
                 (categoryLower.includes('noise') || (descLower.includes('noise') && !descLower.includes('violence') && !descLower.includes('weapon')))) {
          severity = 'low'
        }

        // Generate a basic summary
        const summary = `This incident has been categorized as "${categorization.primaryCategory}" with ${severity} severity. ` +
          `${extractedEntities.locations.length > 0 ? `Location: ${extractedEntities.locations[0]}. ` : ''}` +
          `${extractedEntities.people.length > 0 ? `People involved: ${extractedEntities.people.slice(0, 3).join(', ')}. ` : ''}` +
          `The incident requires ${severity === 'high' ? 'immediate' : severity === 'medium' ? 'prompt' : 'standard'} attention.`

        // Return successful response with fallback analysis
        return NextResponse.json({
          success: true,
          data: {
            category: categorization.primaryCategory,
            severity: severity,
            entities: extractedEntities,
            summary: summary,
            suggestedActions: [
              'Document all details of the incident',
              severity === 'high' ? 'Notify relevant authorities immediately' : 'Notify relevant authorities if needed',
              'Follow up with community members if applicable',
              'Monitor the situation for any changes'
            ],
            riskLevel: severity,
            urgency: severity,
            tags: [categorization.primaryCategory, severity, ...(body.location ? [body.location] : [])],
            categorization: categorization,
          }
        })
      }
      
      // For other errors, determine error type and provide user-friendly message
      let errorMessage = 'Unable to analyze the incident at this time. Please try again later.'
      let errorType = 'AI_SERVICE_ERROR'
      
      if (aiError instanceof Error) {
        if (aiError.message.includes('timeout') || aiError.message.includes('network')) {
          errorMessage = 'The analysis service is taking too long to respond. Please try again in a moment.'
          errorType = 'TIMEOUT_ERROR'
        } else if (aiError.message.includes('quota') || aiError.message.includes('limit') || aiError.message.includes('429')) {
          errorMessage = 'Analysis service is temporarily unavailable due to high demand. Please try again later.'
          errorType = 'QUOTA_ERROR'
        } else if (aiError.message.includes('unauthorized') || aiError.message.includes('401')) {
          errorMessage = 'Analysis service authentication failed. Please contact support.'
          errorType = 'AUTH_ERROR'
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorType,
          // Provide fallback analysis
          fallback: {
            category: sanitizedCategory,
            severity: body.priority || 'medium',
            entities: extractedEntities,
            summary: 'Automated analysis is currently unavailable. The incident has been logged and will be reviewed by community safety officers.',
          }
        },
        { status: 500 }
      )
    }

    // Parse and validate AI response
    let analysisResult: AnalysisResponse
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Parse JSON
      const parsed = JSON.parse(cleanedResponse)

      // Validate required fields
      if (!parsed.category || !parsed.severity || !parsed.summary || !parsed.entities) {
        throw new Error('Missing required fields in AI response')
      }

      // Validate severity value
      if (!['low', 'medium', 'high'].includes(parsed.severity)) {
        parsed.severity = body.priority || 'medium'
      }

      // Validate category - ensure it matches one of the valid primary categories
      const validCategories = [
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
        'Elderly & Persons with Disabilities'
      ]
      
      // If category doesn't match exactly, try to find closest match
      if (!validCategories.includes(parsed.category)) {
        const categoryLower = parsed.category.toLowerCase()
        // Try to match based on keywords
        for (const validCat of validCategories) {
          const validCatLower = validCat.toLowerCase()
          if (categoryLower.includes(validCatLower.split(',')[0]) || 
              categoryLower.includes('crime') && validCatLower.includes('crime') ||
              categoryLower.includes('safety') && validCatLower.includes('safety') ||
              categoryLower.includes('security') && validCatLower.includes('security')) {
            parsed.category = validCat
            break
          }
        }
        // If still no match, use the provided category from the form or default
        if (!validCategories.includes(parsed.category)) {
          // Use categorization result if available, otherwise use form category
          parsed.category = categorization.primaryCategory || sanitizedCategory
        }
      }

      // Merge AI-extracted entities with regex-extracted entities
      const mergedEntities = mergeEntities(parsed.entities || {}, extractedEntities)

      // Build the response with required fields
      analysisResult = {
        category: parsed.category || sanitizedCategory,
        severity: parsed.severity || body.priority || 'medium',
        entities: mergedEntities,
        summary: parsed.summary || aiResponse.substring(0, 300),
        // Include additional fields if provided
        suggestedActions: parsed.suggestedActions,
        riskLevel: parsed.riskLevel || parsed.severity,
        urgency: parsed.urgency || parsed.severity,
        tags: parsed.tags,
        categorization: parsed.categorization || categorization,
      }
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from text
      console.error('Failed to parse AI response as JSON:', parseError)
      
      // Try to extract meaningful information from the text response
      const fallbackSummary = aiResponse && aiResponse.length > 0
        ? aiResponse.substring(0, 300)
        : 'Unable to generate summary. Incident has been logged and will be reviewed by community safety officers.'
      
      analysisResult = {
        category: sanitizedCategory,
        severity: body.priority || 'medium',
        entities: extractedEntities,
        summary: fallbackSummary,
        suggestedActions: extractActions(aiResponse),
        riskLevel: extractRiskLevel(aiResponse) || body.priority || 'medium',
        urgency: extractUrgency(aiResponse) || body.priority || 'medium',
        tags: extractTags(aiResponse, sanitizedCategory),
        categorization,
      }
    }

    // Validate the response structure has required fields
    if (!analysisResult.category || !analysisResult.severity || !analysisResult.summary) {
      console.error('Invalid AI response format - missing required fields', analysisResult)
      // Return a valid fallback response instead of throwing
      analysisResult = {
        category: sanitizedCategory,
        severity: body.priority || 'medium',
        entities: extractedEntities,
        summary: 'Analysis completed with limited information. The incident has been logged for review.',
        categorization,
      }
    }

    // Return response with required fields: category, severity, entities, summary
    return NextResponse.json({
      success: true,
      data: {
        category: analysisResult.category,
        severity: analysisResult.severity,
        entities: analysisResult.entities,
        summary: analysisResult.summary,
        // Include additional fields if available
        ...(analysisResult.suggestedActions && { suggestedActions: analysisResult.suggestedActions }),
        ...(analysisResult.riskLevel && { riskLevel: analysisResult.riskLevel }),
        ...(analysisResult.urgency && { urgency: analysisResult.urgency }),
        ...(analysisResult.tags && { tags: analysisResult.tags }),
        ...(analysisResult.categorization && { categorization: analysisResult.categorization }),
      },
    })

  } catch (error) {
    // Log error server-side (never expose to client)
    console.error('Error analyzing incident:', error)

    // Determine error type and provide appropriate message
    let errorMessage = 'An unexpected error occurred while analyzing the incident. Please try again later.'
    let errorType = 'UNKNOWN_ERROR'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        errorMessage = 'The analysis service returned invalid data. Please try again.'
        errorType = 'PARSE_ERROR'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the analysis service. Please check your connection and try again.'
        errorType = 'NETWORK_ERROR'
        statusCode = 503
      }
    }

    // Return user-friendly error to client (don't expose internal details)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorType,
      },
      { status: statusCode }
    )
  }
}

/**
 * Extract entities (people, locations, times) from incident description
 */
function extractEntities(
  description: string,
  location?: string,
  date?: string,
  time?: string
): ExtractedEntities {
  const entities: ExtractedEntities = {
    people: [],
    locations: [],
    times: [],
    organizations: [],
    other: [],
  }

  const text = description.toLowerCase()
  const originalText = description

  // Extract people (names, roles, descriptions)
  // Pattern: Capitalized words that might be names, or role descriptions
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g
  const names = originalText.match(namePattern) || []
  const rolePatterns = [
    /\b(officer|constable|sergeant|detective|supervisor|manager|director|coordinator)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)?/gi,
    /\b(mr|mrs|ms|miss|dr|prof)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /\b(teenager|youth|child|adult|elderly|person|individual|suspect|victim|witness)\b/gi,
  ]

  rolePatterns.forEach(pattern => {
    const matches = originalText.match(pattern)
    if (matches) {
      entities.people.push(...matches.map(m => m.trim()))
    }
  })

  // Filter out common false positives and add unique names
  const filteredNames = names.filter(name => {
    const lower = name.toLowerCase()
    return !['The', 'A', 'An', 'This', 'That', 'There', 'They', 'When', 'Where', 'What', 'How'].includes(name) &&
           name.length > 2 &&
           !lower.match(/^(january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/)
  })

  entities.people.push(...filteredNames)
  entities.people = [...new Set(entities.people)].slice(0, 10) // Limit to 10 unique people

  // Extract locations
  const locationPatterns = [
    /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct|circle|cir))?/gi,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct|circle|cir)/gi,
    /\b(near|at|on|in|by|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /\b(park|school|hospital|church|store|shop|building|house|apartment|complex|center|centre)\b/gi,
  ]

  locationPatterns.forEach(pattern => {
    const matches = originalText.match(pattern)
    if (matches) {
      entities.locations.push(...matches.map(m => m.trim().replace(/^(near|at|on|in|by|around)\s+/i, '')))
    }
  })

  // Add provided location if available
  if (location) {
    entities.locations.push(location)
  }

  entities.locations = [...new Set(entities.locations)].slice(0, 10) // Limit to 10 unique locations

  // Extract times
  const timePatterns = [
    /\b(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)\b/g,
    /\b(\d{1,2})\s*(am|pm|AM|PM)\b/g,
    /\b(morning|afternoon|evening|night|midnight|noon|dawn|dusk)\b/gi,
    /\b(early|late)\s+(morning|afternoon|evening|night)\b/gi,
    /\b(\d+)\s*(minutes?|hours?|days?|weeks?)\s*(ago|earlier|before|after|later)\b/gi,
    /\b(yesterday|today|tomorrow|last\s+night|this\s+morning|this\s+afternoon|this\s+evening)\b/gi,
  ]

  timePatterns.forEach(pattern => {
    const matches = originalText.match(pattern)
    if (matches) {
      entities.times.push(...matches.map(m => m.trim()))
    }
  })

  // Add provided date and time if available
  if (date) {
    entities.times.push(`Date: ${date}`)
  }
  if (time) {
    entities.times.push(`Time: ${time}`)
  }

  entities.times = [...new Set(entities.times)].slice(0, 10) // Limit to 10 unique times

  // Extract organizations
  const orgPatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(police|department|authority|agency|organization|association|club|group|center|centre)\b/gi,
    /\b(police|fire|emergency|medical|hospital|school|church|government)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)?/gi,
  ]

  orgPatterns.forEach(pattern => {
    const matches = originalText.match(pattern)
    if (matches) {
      entities.organizations?.push(...matches.map(m => m.trim()))
    }
  })

  if (entities.organizations) {
    entities.organizations = [...new Set(entities.organizations)].slice(0, 5)
  }

  return entities
}

/**
 * Categorize incident based on category field and content
 */
function categorizeIncident(
  category: string,
  title: string,
  description: string
): IncidentCategory {
  const categoryLower = category.toLowerCase()
  const titleLower = title.toLowerCase()
  const descLower = description.toLowerCase()

  // Map categories to primary categories
  // Note: Some categories like "Youth Gambling" or "Domestic Violence" map to "Crime, Safety & Security"
  // even though they contain keywords that might suggest other categories
  const categoryMapping: Record<string, string> = {
    // Crime, Safety & Security (highest priority for crime-related keywords)
    'crime': 'Crime, Safety & Security',
    'safety': 'Crime, Safety & Security',
    'security': 'Crime, Safety & Security',
    'theft': 'Crime, Safety & Security',
    'stolen': 'Crime, Safety & Security',
    'vehicle': 'Crime, Safety & Security',
    'burglary': 'Crime, Safety & Security',
    'break-in': 'Crime, Safety & Security',
    'break in': 'Crime, Safety & Security',
    'vandalism': 'Crime, Safety & Security',
    'violence': 'Crime, Safety & Security',
    'domestic violence': 'Crime, Safety & Security',
    'gang': 'Crime, Safety & Security',
    'firearm': 'Crime, Safety & Security',
    'weapon': 'Crime, Safety & Security',
    'gambling': 'Crime, Safety & Security', // Youth gambling is a crime
    'noise': 'Crime, Safety & Security',
    'noise pollution': 'Crime, Safety & Security',
    'neighbor dispute': 'Crime, Safety & Security',
    'neighbour dispute': 'Crime, Safety & Security',
    'suspicious': 'Crime, Safety & Security',
    // Youth & Community Development (positive programs only, not crimes)
    'youth': 'Youth & Community Development',
    'community development': 'Youth & Community Development',
    'mentorship': 'Youth & Community Development',
    'program': 'Youth & Community Development',
    'sports': 'Youth & Community Development',
    'after-school': 'Youth & Community Development',
    // Mental Health & Social Support
    'mental health': 'Mental Health & Social Support',
    'mental': 'Mental Health & Social Support',
    'welfare check': 'Mental Health & Social Support',
    'vulnerable': 'Mental Health & Social Support',
    'at risk': 'Mental Health & Social Support',
    'self-harm': 'Mental Health & Social Support',
    // Substance Abuse & Addiction
    'substance': 'Substance Abuse & Addiction',
    'drug': 'Substance Abuse & Addiction',
    'alcohol': 'Substance Abuse & Addiction',
    'intoxication': 'Substance Abuse & Addiction',
    'rehabilitation': 'Substance Abuse & Addiction',
    // Community Cohesion & Social Inclusion
    'cohesion': 'Community Cohesion & Social Inclusion',
    'inclusion': 'Community Cohesion & Social Inclusion',
    'division': 'Community Cohesion & Social Inclusion',
    'integration': 'Community Cohesion & Social Inclusion',
    'meeting': 'Community Cohesion & Social Inclusion',
    'forum': 'Community Cohesion & Social Inclusion',
    // Education & Awareness
    'education': 'Education & Awareness',
    'awareness': 'Education & Awareness',
    'workshop': 'Education & Awareness',
    'prevention': 'Education & Awareness',
    // Housing & Environmental Conditions
    'housing': 'Housing & Environmental Conditions',
    'environmental': 'Housing & Environmental Conditions',
    'unsafe': 'Housing & Environmental Conditions',
    'abandoned': 'Housing & Environmental Conditions',
    'building': 'Housing & Environmental Conditions',
    'derelict': 'Housing & Environmental Conditions',
    'lighting': 'Housing & Environmental Conditions',
    'mosquito': 'Housing & Environmental Conditions',
    'rodent': 'Housing & Environmental Conditions',
    'dumping': 'Housing & Environmental Conditions',
    // Economic & Employment-Related Issues
    'economic': 'Economic & Employment-Related Issues',
    'employment': 'Economic & Employment-Related Issues',
    'job': 'Economic & Employment-Related Issues',
    'career': 'Economic & Employment-Related Issues',
    'business': 'Economic & Employment-Related Issues',
    // Domestic & Family Issues (non-violent only)
    'domestic': 'Domestic & Family Issues',
    'family': 'Domestic & Family Issues',
    'family conflict': 'Domestic & Family Issues',
    'single mother': 'Domestic & Family Issues',
    'social worker': 'Domestic & Family Issues',
    'children\'s authority': 'Domestic & Family Issues',
    'restraining order': 'Domestic & Family Issues',
    // School & Student-Related Issues
    'school': 'School & Student-Related Issues',
    'student': 'School & Student-Related Issues',
    'truancy': 'School & Student-Related Issues',
    'bullying': 'School & Student-Related Issues',
    'cyberbullying': 'School & Student-Related Issues',
    // Disaster Preparedness & Emergency Support
    'disaster': 'Disaster Preparedness & Emergency Support',
    'emergency': 'Disaster Preparedness & Emergency Support',
    'evacuation': 'Disaster Preparedness & Emergency Support',
    'relief': 'Disaster Preparedness & Emergency Support',
    // Human Trafficking & Exploitation
    'trafficking': 'Human Trafficking & Exploitation',
    'exploitation': 'Human Trafficking & Exploitation',
    // Elderly & Persons with Disabilities
    'elderly': 'Elderly & Persons with Disabilities',
    'disability': 'Elderly & Persons with Disabilities',
    'disabled': 'Elderly & Persons with Disabilities',
  }

  // Determine primary category
  // Priority: category field > title > description
  let primaryCategory = category
  let confidence: 'high' | 'medium' | 'low' = 'high'
  let matchFound = false

  // Special handling for categories that should map to Crime, Safety & Security
  // even if they contain keywords suggesting other categories
  const crimeKeywords = ['gambling', 'domestic violence', 'stolen vehicle', 'theft', 'burglary', 
                        'break-in', 'noise pollution', 'gang activity', 'firearm', 'weapon']
  for (const keyword of crimeKeywords) {
    if (categoryLower.includes(keyword) || titleLower.includes(keyword) || descLower.includes(keyword)) {
      primaryCategory = 'Crime, Safety & Security'
      confidence = categoryLower.includes(keyword) ? 'high' : 'medium'
      matchFound = true
      break
    }
  }

  // Check if category matches known categories (if not already matched to crime)
  if (!matchFound) {
    for (const [key, mappedCategory] of Object.entries(categoryMapping)) {
      if (categoryLower.includes(key)) {
        primaryCategory = mappedCategory
        confidence = 'high'
        matchFound = true
        break
      }
    }
  }

  // If category doesn't match, try title
  if (!matchFound || primaryCategory === category) {
    for (const [key, mappedCategory] of Object.entries(categoryMapping)) {
      if (titleLower.includes(key)) {
        primaryCategory = mappedCategory
        confidence = 'medium'
        matchFound = true
        break
      }
    }
  }

  // If still no match, try to infer from description
  if (!matchFound || primaryCategory === category) {
    confidence = 'low'
    for (const [key, mappedCategory] of Object.entries(categoryMapping)) {
      if (descLower.includes(key)) {
        primaryCategory = mappedCategory
        confidence = 'medium'
        break
      }
    }
  }

  // Find related categories based on keywords
  const relatedCategories: string[] = []
  const allCategories = Object.values(categoryMapping)
  const uniqueCategories = [...new Set(allCategories)]

  for (const cat of uniqueCategories) {
    if (cat !== primaryCategory) {
      const catKey = Object.entries(categoryMapping).find(([_, val]) => val === cat)?.[0]
      if (catKey && (descLower.includes(catKey) || titleLower.includes(catKey))) {
        relatedCategories.push(cat)
      }
    }
  }

  return {
    primaryCategory,
    categoryConfidence: confidence,
    relatedCategories: relatedCategories.slice(0, 3), // Limit to 3 related categories
  }
}

/**
 * Merge AI-extracted entities with regex-extracted entities
 */
function mergeEntities(
  aiEntities: Partial<ExtractedEntities>,
  regexEntities: ExtractedEntities
): ExtractedEntities {
  return {
    people: [...new Set([...(aiEntities.people || []), ...regexEntities.people])].slice(0, 10),
    locations: [...new Set([...(aiEntities.locations || []), ...regexEntities.locations])].slice(0, 10),
    times: [...new Set([...(aiEntities.times || []), ...regexEntities.times])].slice(0, 10),
    organizations: [...new Set([
      ...(aiEntities.organizations || []),
      ...(regexEntities.organizations || [])
    ])].slice(0, 5),
    other: [...new Set([
      ...(aiEntities.other || []),
      ...(regexEntities.other || [])
    ])].slice(0, 5),
  }
}

/**
 * Call AI service (OpenAI example)
 * Replace this with your actual AI service integration
 */
async function callAIService(apiKey: string, prompt: string): Promise<string> {
  // Example: OpenAI API call
  // In production, you would use the actual OpenAI SDK or your AI provider's API
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or 'gpt-4' for better analysis
        messages: [
          {
            role: 'system',
            content: 'You are an expert community safety analyst specializing in incident categorization and analysis. Your task is to analyze community incident reports and return ONLY valid JSON. You must: 1) Map incidents to the correct primary category from the provided list, 2) Assess severity based on actual threat level and urgency, 3) Extract all relevant entities (people, locations, times, organizations), 4) Provide concise summaries. Always return pure JSON only - no markdown, no explanations, no code blocks. Use the exact category names provided in the user prompt.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000, // Increased for entity extraction and categorization
        response_format: { type: 'json_object' }, // Request JSON response
      }),
    })

    if (!response.ok) {
      let errorMessage = `AI service error: ${response.status}`
      let errorDetails = null
      
      try {
        const errorData = await response.json()
        errorDetails = errorData
        
        // Handle specific API errors
        if (response.status === 401) {
          throw new Error('AI service authentication failed. Please check API key configuration.')
        } else if (response.status === 429) {
          throw new Error('AI service rate limit exceeded. Please try again later.')
        } else if (response.status === 500 || response.status === 502 || response.status === 503) {
          throw new Error(`AI service is temporarily unavailable (503). Please try again in a few moments.`)
        } else if (errorData.error?.message) {
          throw new Error(errorData.error.message)
        } else {
          throw new Error(`AI service returned an error (${response.status})`)
        }
      } catch (jsonError) {
        if (jsonError instanceof Error) {
          throw jsonError
        }
        throw new Error(errorMessage)
      }
    }

    const data = await response.json()
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('AI service returned an invalid response format')
    }
    
    const content = data.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI service returned empty content')
    }
    
    return content
  } catch (error) {
    // Re-throw with more context for better error handling upstream
    if (error instanceof Error) {
      // Check for network/timeout errors
      if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to AI service. Please check your internet connection.')
      }
      if (error.message.includes('timeout') || error.name === 'TimeoutError') {
        throw new Error('Request timeout: The AI service took too long to respond. Please try again.')
      }
      // Re-throw with original message for other errors
      throw error
    }
    throw new Error('An unexpected error occurred while calling the AI service')
  }
}

/**
 * Helper functions to extract structured data from text responses
 */
function extractActions(text: string): string[] {
  const actions: string[] = []
  const actionPatterns = [
    /suggested actions?:?\s*([^\n]+)/i,
    /actions?:?\s*([^\n]+)/i,
    /recommendations?:?\s*([^\n]+)/i,
  ]

  for (const pattern of actionPatterns) {
    const match = text.match(pattern)
    if (match) {
      actions.push(...match[1].split(/[,\-•]/).map(a => a.trim()).filter(Boolean))
    }
  }

  return actions.slice(0, 5) || ['Review incident', 'Document details', 'Follow up as needed']
}

function extractRiskLevel(text: string): 'low' | 'medium' | 'high' | null {
  const lowerText = text.toLowerCase()
  if (lowerText.includes('high risk') || lowerText.includes('risk: high')) return 'high'
  if (lowerText.includes('low risk') || lowerText.includes('risk: low')) return 'low'
  if (lowerText.includes('medium risk') || lowerText.includes('risk: medium')) return 'medium'
  return null
}

function extractUrgency(text: string): 'low' | 'medium' | 'high' | null {
  const lowerText = text.toLowerCase()
  if (lowerText.includes('high urgency') || lowerText.includes('urgent')) return 'high'
  if (lowerText.includes('low urgency')) return 'low'
  if (lowerText.includes('medium urgency')) return 'medium'
  return null
}

function extractTags(text: string, category: string): string[] {
  const tags = [category.toLowerCase()]
  const commonTags = ['safety', 'community', 'incident', 'report']
  
  // Extract keywords from text
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || []
  const uniqueWords = [...new Set(words)]
    .filter(word => !['that', 'this', 'with', 'from', 'have', 'been', 'will', 'should'].includes(word))
    .slice(0, 3)

  return [...tags, ...uniqueWords, ...commonTags].slice(0, 5)
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Incident analysis API is running',
    timestamp: new Date().toISOString(),
  })
}

