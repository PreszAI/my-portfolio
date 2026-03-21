/**
 * Test Script for Fallback Incident Categorization
 * 
 * This script tests the fallback categorization logic (regex-based)
 * without requiring API calls. Useful when API is rate-limited.
 * 
 * Run this with: node test-ai-categorization-fallback.js
 */

const testIncidents = require('./test-incidents-diverse.json').testIncidents

// Simulate the categorizeIncident function from the API route
function categorizeIncident(category, title, description) {
  const categoryLower = category.toLowerCase()
  const titleLower = title.toLowerCase()
  const descLower = description.toLowerCase()

  const categoryMapping = {
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
    'gambling': 'Crime, Safety & Security',
    'noise': 'Crime, Safety & Security',
    'noise pollution': 'Crime, Safety & Security',
    'neighbor dispute': 'Crime, Safety & Security',
    'neighbour dispute': 'Crime, Safety & Security',
    'suspicious': 'Crime, Safety & Security',
    'youth': 'Youth & Community Development',
    'community development': 'Youth & Community Development',
    'mentorship': 'Youth & Community Development',
    'program': 'Youth & Community Development',
    'sports': 'Youth & Community Development',
    'after-school': 'Youth & Community Development',
    'mental health': 'Mental Health & Social Support',
    'mental': 'Mental Health & Social Support',
    'welfare check': 'Mental Health & Social Support',
    'vulnerable': 'Mental Health & Social Support',
    'at risk': 'Mental Health & Social Support',
    'self-harm': 'Mental Health & Social Support',
    'substance': 'Substance Abuse & Addiction',
    'drug': 'Substance Abuse & Addiction',
    'alcohol': 'Substance Abuse & Addiction',
    'intoxication': 'Substance Abuse & Addiction',
    'rehabilitation': 'Substance Abuse & Addiction',
    'cohesion': 'Community Cohesion & Social Inclusion',
    'inclusion': 'Community Cohesion & Social Inclusion',
    'division': 'Community Cohesion & Social Inclusion',
    'integration': 'Community Cohesion & Social Inclusion',
    'meeting': 'Community Cohesion & Social Inclusion',
    'forum': 'Community Cohesion & Social Inclusion',
    'education': 'Education & Awareness',
    'awareness': 'Education & Awareness',
    'workshop': 'Education & Awareness',
    'prevention': 'Education & Awareness',
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
    'economic': 'Economic & Employment-Related Issues',
    'employment': 'Economic & Employment-Related Issues',
    'job': 'Economic & Employment-Related Issues',
    'career': 'Economic & Employment-Related Issues',
    'business': 'Economic & Employment-Related Issues',
    'domestic': 'Domestic & Family Issues',
    'family': 'Domestic & Family Issues',
    'family conflict': 'Domestic & Family Issues',
    'single mother': 'Domestic & Family Issues',
    'social worker': 'Domestic & Family Issues',
    'children\'s authority': 'Domestic & Family Issues',
    'restraining order': 'Domestic & Family Issues',
    'school': 'School & Student-Related Issues',
    'student': 'School & Student-Related Issues',
    'truancy': 'School & Student-Related Issues',
    'bullying': 'School & Student-Related Issues',
    'cyberbullying': 'School & Student-Related Issues',
    'disaster': 'Disaster Preparedness & Emergency Support',
    'emergency': 'Disaster Preparedness & Emergency Support',
    'evacuation': 'Disaster Preparedness & Emergency Support',
    'relief': 'Disaster Preparedness & Emergency Support',
    'trafficking': 'Human Trafficking & Exploitation',
    'exploitation': 'Human Trafficking & Exploitation',
    'elderly': 'Elderly & Persons with Disabilities',
    'disability': 'Elderly & Persons with Disabilities',
    'disabled': 'Elderly & Persons with Disabilities',
  }

  let primaryCategory = category
  let confidence = 'high'
  let matchFound = false

  // Special handling for crime keywords
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

  // Check category field
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

  // Check title
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

  // Check description
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

  return { primaryCategory, confidence }
}

// Simulate severity assessment
function assessSeverity(description, priority, category) {
  const descLower = description.toLowerCase()
  const categoryLower = (category || '').toLowerCase()
  let severity = priority || 'medium'
  
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
  // Check this before low severity to ensure gambling is medium, not low
  if (categoryLower.includes('gambling') || descLower.includes('gambling')) {
    severity = 'medium'
  }
  // Low severity indicators
  else if (descLower.includes('minor') || descLower.includes('low priority') || descLower.includes('informational') ||
           // Noise complaints are generally low (quality of life issue, not immediate danger)
           // Even if "extremely loud" or "affecting", noise is still a quality of life issue
           (categoryLower.includes('noise') || (descLower.includes('noise') && !descLower.includes('violence') && !descLower.includes('weapon')))) {
    severity = 'low'
  }
  
  return severity
}

async function testFallbackCategorization() {
  console.log('🧪 Testing Fallback Incident Categorization (No API Required)\n')
  console.log('='.repeat(80))
  
  const results = []
  
  for (const incident of testIncidents) {
    console.log(`\n📋 Test ${incident.id}: ${incident.category}`)
    console.log(`   Description: ${incident.description.substring(0, 100)}...`)
    
    const categorization = categorizeIncident(incident.category, incident.title, incident.description)
    const severity = assessSeverity(incident.description, incident.priority, incident.category)
    
    const categoryMatch = categorization.primaryCategory === incident.expectedCategory
    const severityMatch = severity === incident.expectedSeverity
    
    const result = {
      id: incident.id,
      category: incident.category,
      expectedCategory: incident.expectedCategory,
      actualCategory: categorization.primaryCategory,
      categoryMatch,
      expectedSeverity: incident.expectedSeverity,
      actualSeverity: severity,
      severityMatch,
      confidence: categorization.confidence,
    }
    
    results.push(result)
    
    // Display results
    const categoryIcon = categoryMatch ? '✅' : '❌'
    const severityIcon = severityMatch ? '✅' : '❌'
    console.log(`   ${categoryIcon} Category: ${categorization.primaryCategory} (confidence: ${categorization.confidence})`)
    console.log(`   ${severityIcon} Severity: ${severity}`)
    
    if (!categoryMatch) {
      console.log(`   ⚠️  Category mismatch! Expected: ${incident.expectedCategory}, Got: ${categorization.primaryCategory}`)
    }
    if (!severityMatch) {
      console.log(`   ⚠️  Severity mismatch! Expected: ${incident.expectedSeverity}, Got: ${severity}`)
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('\n📊 TEST SUMMARY\n')
  
  const successful = results.filter(r => r.categoryMatch && r.severityMatch)
  const categoryCorrect = results.filter(r => r.categoryMatch).length
  const severityCorrect = results.filter(r => r.severityMatch).length
  
  console.log(`Total Tests: ${testIncidents.length}`)
  console.log(`✅ Fully Correct (Category + Severity): ${successful.length}/${testIncidents.length} (${(successful.length/testIncidents.length*100).toFixed(1)}%)`)
  console.log(`✅ Category Correct: ${categoryCorrect}/${testIncidents.length} (${(categoryCorrect/testIncidents.length*100).toFixed(1)}%)`)
  console.log(`✅ Severity Correct: ${severityCorrect}/${testIncidents.length} (${(severityCorrect/testIncidents.length*100).toFixed(1)}%)`)
  
  // Detailed breakdown
  console.log('\n📋 DETAILED RESULTS:\n')
  results.forEach(result => {
    const status = (result.categoryMatch && result.severityMatch) ? '✅' : '⚠️'
    console.log(`   ${status} ${result.id}: Category ${result.categoryMatch ? '✓' : '✗'} | Severity ${result.severityMatch ? '✓' : '✗'}`)
  })
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:\n')
  const categoryMismatches = results.filter(r => !r.categoryMatch)
  const severityMismatches = results.filter(r => !r.severityMatch)
  
  if (categoryMismatches.length > 0) {
    console.log('Category Mismatches:')
    categoryMismatches.forEach(r => {
      console.log(`   - ${r.id}: Expected "${r.expectedCategory}", Got "${r.actualCategory}"`)
      console.log(`     Category field: "${r.category}"`)
    })
    console.log('   → Consider refining category mapping in categorizeIncident function')
  }
  
  if (severityMismatches.length > 0) {
    console.log('Severity Mismatches:')
    severityMismatches.forEach(r => {
      console.log(`   - ${r.id}: Expected "${r.expectedSeverity}", Got "${r.actualSeverity}"`)
    })
    console.log('   → Consider refining severity assessment logic')
  }
  
  if (categoryMismatches.length === 0 && severityMismatches.length === 0) {
    console.log('🎉 All tests passed! The fallback categorization logic is working correctly.')
  }
  
  return results
}

// Run tests
testFallbackCategorization()
  .then(() => {
    console.log('\n✅ Tests completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Test suite failed:', error)
    process.exit(1)
  })

