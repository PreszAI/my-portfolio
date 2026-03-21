/**
 * Test Script for AI Incident Categorization
 * 
 * This script tests the AI's ability to correctly categorize diverse incidents.
 * Run this with: node test-ai-categorization.js
 * 
 * Make sure your .env.local has OPENAI_API_KEY configured.
 */

const testIncidents = require('./test-incidents-diverse.json').testIncidents

async function testIncidentCategorization() {
  console.log('🧪 Testing AI Incident Categorization\n')
  console.log('=' .repeat(80))
  
  const results = []
  
  for (const incident of testIncidents) {
    console.log(`\n📋 Test ${incident.id}: ${incident.category}`)
    console.log(`   Description: ${incident.description.substring(0, 100)}...`)
    
    try {
      const response = await fetch('http://localhost:3000/api/analyze-incident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: incident.title,
          description: incident.description,
          category: incident.category,
          location: incident.location,
          priority: incident.priority,
          incidentDate: incident.incidentDate,
          incidentTime: incident.incidentTime,
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const analysis = data.data
        const categoryMatch = analysis.category === incident.expectedCategory
        const severityMatch = analysis.severity === incident.expectedSeverity
        
        const result = {
          id: incident.id,
          category: incident.category,
          expectedCategory: incident.expectedCategory,
          actualCategory: analysis.category,
          categoryMatch,
          expectedSeverity: incident.expectedSeverity,
          actualSeverity: analysis.severity,
          severityMatch,
          summary: analysis.summary,
          entities: analysis.entities,
        }
        
        results.push(result)
        
        // Display results
        console.log(`   ✅ Category: ${analysis.category} ${categoryMatch ? '✓' : '✗'}`)
        console.log(`   ✅ Severity: ${analysis.severity} ${severityMatch ? '✓' : '✗'}`)
        console.log(`   📝 Summary: ${analysis.summary.substring(0, 150)}...`)
        console.log(`   👥 Entities - People: ${analysis.entities.people.length}, Locations: ${analysis.entities.locations.length}, Times: ${analysis.entities.times.length}`)
        
        if (!categoryMatch) {
          console.log(`   ⚠️  Category mismatch! Expected: ${incident.expectedCategory}, Got: ${analysis.category}`)
        }
        if (!severityMatch) {
          console.log(`   ⚠️  Severity mismatch! Expected: ${incident.expectedSeverity}, Got: ${analysis.severity}`)
        }
      } else {
        console.log(`   ❌ Error: ${data.error || 'Unknown error'}`)
        results.push({
          id: incident.id,
          category: incident.category,
          error: data.error,
        })
      }
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`)
      results.push({
        id: incident.id,
        category: incident.category,
        error: error.message,
      })
    }
    
    // Longer delay to avoid rate limiting (OpenAI has rate limits)
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('\n📊 TEST SUMMARY\n')
  
  const successful = results.filter(r => r.categoryMatch && r.severityMatch && !r.error)
  const categoryCorrect = results.filter(r => r.categoryMatch && !r.error).length
  const severityCorrect = results.filter(r => r.severityMatch && !r.error).length
  const errors = results.filter(r => r.error).length
  
  console.log(`Total Tests: ${testIncidents.length}`)
  console.log(`✅ Fully Correct (Category + Severity): ${successful.length}/${testIncidents.length} (${(successful.length/testIncidents.length*100).toFixed(1)}%)`)
  console.log(`✅ Category Correct: ${categoryCorrect}/${testIncidents.length} (${(categoryCorrect/testIncidents.length*100).toFixed(1)}%)`)
  console.log(`✅ Severity Correct: ${severityCorrect}/${testIncidents.length} (${(severityCorrect/testIncidents.length*100).toFixed(1)}%)`)
  console.log(`❌ Errors: ${errors}`)
  
  // Detailed breakdown
  console.log('\n📋 DETAILED RESULTS:\n')
  results.forEach(result => {
    if (result.error) {
      console.log(`   ${result.id}: ❌ ERROR - ${result.error}`)
    } else {
      const status = (result.categoryMatch && result.severityMatch) ? '✅' : '⚠️'
      console.log(`   ${status} ${result.id}: Category ${result.categoryMatch ? '✓' : '✗'} | Severity ${result.severityMatch ? '✓' : '✗'}`)
    }
  })
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:\n')
  const categoryMismatches = results.filter(r => !r.categoryMatch && !r.error)
  const severityMismatches = results.filter(r => !r.severityMatch && !r.error)
  
  if (categoryMismatches.length > 0) {
    console.log('Category Mismatches:')
    categoryMismatches.forEach(r => {
      console.log(`   - ${r.id}: Expected "${r.expectedCategory}", Got "${r.actualCategory}"`)
    })
    console.log('   → Consider refining category mapping in the prompt or categorizeIncident function')
  }
  
  if (severityMismatches.length > 0) {
    console.log('Severity Mismatches:')
    severityMismatches.forEach(r => {
      console.log(`   - ${r.id}: Expected "${r.expectedSeverity}", Got "${r.actualSeverity}"`)
    })
    console.log('   → Consider refining severity guidelines in the prompt')
  }
  
  if (errors.length > 0) {
    console.log('Errors:')
    results.filter(r => r.error).forEach(r => {
      console.log(`   - ${r.id}: ${r.error}`)
    })
    console.log('   → Check API key configuration and network connectivity')
  }
  
  return results
}

// Run tests if this file is executed directly
if (require.main === module) {
  // Check if server is running
  console.log('⚠️  Make sure your Next.js dev server is running on http://localhost:3000')
  console.log('⚠️  Make sure OPENAI_API_KEY is configured in .env.local\n')
  
  testIncidentCategorization()
    .then(() => {
      console.log('\n✅ Tests completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Test suite failed:', error)
      process.exit(1)
    })
}

module.exports = { testIncidentCategorization }

