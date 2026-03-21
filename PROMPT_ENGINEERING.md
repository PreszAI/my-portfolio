# Prompt Engineering Guide - Incident Analysis

## Overview
This document outlines the prompt engineering approach for the AI-powered incident analysis system, including test cases and refinement strategies.

## Current Prompt Structure

### System Message
The system message establishes the AI's role and constraints:
- Expert community safety analyst
- Must return ONLY valid JSON
- Must use exact category names from provided list
- Must assess severity based on actual threat level

### User Prompt Components

1. **Category List**: All 13 primary categories with descriptions
2. **Severity Guidelines**: Clear definitions for low/medium/high
3. **Analysis Requirements**: Step-by-step instructions
4. **JSON Format**: Exact structure required

## Test Cases

See `test-incidents.json` for 12 diverse test cases covering:
- Noise complaints
- Theft reports
- Suspicious behavior
- Vandalism
- Domestic disputes
- Youth programs
- Mental health concerns
- Environmental issues
- School incidents
- Family support
- Infrastructure problems
- Public intoxication

## Prompt Refinement Strategy

### 1. Category Mapping
- **Challenge**: AI might use variations of category names
- **Solution**: Provide exact category names and validate responses
- **Refinement**: Added category validation with fuzzy matching fallback

### 2. Severity Assessment
- **Challenge**: AI might rely too heavily on the priority field
- **Solution**: Explicit instructions to assess based on description content
- **Refinement**: Added severity guidelines with examples

### 3. Entity Extraction
- **Challenge**: Missing entities or extracting irrelevant information
- **Solution**: Clear instructions on what to extract (people, locations, times, organizations)
- **Refinement**: Combined AI extraction with regex-based extraction for reliability

### 4. JSON Format Compliance
- **Challenge**: AI sometimes returns markdown or explanatory text
- **Solution**: Multiple reminders to return ONLY JSON
- **Refinement**: Using `response_format: { type: 'json_object' }` in API call

## Testing Workflow

1. **Run Test Cases**: Use the test incidents to verify categorization
2. **Check Accuracy**: Compare AI output with expected categories/severity
3. **Identify Patterns**: Look for systematic errors
4. **Refine Prompt**: Adjust instructions based on failures
5. **Iterate**: Repeat until accuracy improves

## Key Improvements Made

### Version 1 (Initial)
- Basic prompt with minimal context
- No category list
- Generic severity assessment

### Version 2 (Current)
- Complete category list with descriptions
- Detailed severity guidelines
- Explicit entity extraction requirements
- Category validation with fallback
- Enhanced system message

## Future Refinements

1. **Few-Shot Examples**: Add example inputs/outputs to prompt
2. **Category Descriptions**: Expand descriptions for each category
3. **Context Window**: Include more context about the community
4. **Temperature Tuning**: Adjust for more consistent results
5. **Chain of Thought**: Ask AI to explain reasoning before final answer

## Validation Rules

The system validates:
- ✅ Required fields present (category, severity, summary, entities)
- ✅ Severity is one of: low, medium, high
- ✅ Category matches valid primary category list
- ✅ Entities contain expected arrays (people, locations, times, organizations)

## Monitoring

Track these metrics:
- Category accuracy (% correct primary category)
- Severity accuracy (% correct severity assessment)
- Entity extraction completeness
- JSON format compliance rate
- Response time

## Best Practices

1. **Be Explicit**: Don't assume AI knows what you want
2. **Provide Examples**: Show the exact format expected
3. **Validate Output**: Always validate and sanitize AI responses
4. **Iterate**: Prompt engineering is iterative - test and refine
5. **Document Changes**: Keep track of what works and what doesn't



