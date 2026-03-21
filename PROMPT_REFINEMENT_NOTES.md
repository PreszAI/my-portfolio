# AI Prompt Refinement Notes

## Test Incidents Created

Created 10 diverse test incidents covering:
1. **Youth Gambling** - Testing crime categorization for gambling activities
2. **Stolen Vehicle** - Testing property crime categorization
3. **Noise Pollution** - Testing public safety/quality of life categorization
4. **Theft/Burglary** - Testing property crime with violence indicators
5. **Suspicious Activity/Gang Activity** - Testing security threat categorization
6. **Drug Misuse** - Testing substance abuse categorization
7. **Domestic Violence** - Testing violence categorization (should be Crime, not Domestic & Family Issues)
8. **Cyberbullying** - Testing school-related issue categorization
9. **Abandoned Building** - Testing housing/environmental categorization
10. **Welfare Check** - Testing mental health/social support categorization

## Prompt Refinements Made

### 1. Enhanced Category Descriptions
- Added more specific examples for each category
- Clarified edge cases (e.g., "Youth Gambling" → Crime, not Youth Development)
- Added explicit mapping rules for ambiguous cases

### 2. Improved Severity Guidelines
- More specific examples of what constitutes "high", "medium", and "low" severity
- Added keyword-based severity assessment guidance
- Clarified that severity should be based on actual threat level, not just the priority field

### 3. Category Mapping Rules
Added explicit rules for common edge cases:
- **Youth gambling** → "Crime, Safety & Security" (even though it involves youth, it's a crime)
- **Domestic violence** → "Crime, Safety & Security" (violence is a crime, not just a family issue)
- **Stolen vehicles** → "Crime, Safety & Security" (property crime)
- **Noise complaints** → "Crime, Safety & Security" (public safety/quality of life issue)
- **Theft/burglary** → "Crime, Safety & Security" (property crime)
- **Suspicious activity** → "Crime, Safety & Security" or "Substance Abuse & Addiction" depending on context
- **Welfare checks for elderly** → "Mental Health & Social Support" or "Elderly & Persons with Disabilities"
- **Cyberbullying** → "School & Student-Related Issues" (even if it happens online, it's school-related)
- **Abandoned buildings** → "Housing & Environmental Conditions"

### 4. Enhanced Entity Extraction Instructions
- More specific examples of what to extract for people (names, roles, descriptions)
- Better guidance on location extraction (addresses, streets, landmarks, areas)
- Improved time extraction (specific times, relative times, time ranges)
- Added organization extraction examples

### 5. Improved Summary Guidelines
- Clear structure: what happened → key details → main concern
- Emphasis on conciseness (2-3 sentences)
- Focus on actionable information

## categorizeIncident Function Improvements

### Enhanced Category Mapping
- Added more specific keyword mappings
- Prioritized crime-related keywords (gambling, stolen vehicle, theft, etc.)
- Added special handling for categories that should map to "Crime, Safety & Security" even if they contain keywords suggesting other categories

### Improved Matching Logic
- Priority order: category field → title → description
- Special handling for crime keywords before general category matching
- Better confidence scoring based on where the match was found

## Testing Instructions

1. **Start your Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **Run the test script:**
   ```bash
   node test-ai-categorization.js
   ```

3. **Review results:**
   - Check category accuracy (should be 100% for well-defined categories)
   - Check severity accuracy (may vary based on description interpretation)
   - Review entity extraction quality
   - Note any edge cases that need further refinement

## Expected Results

Based on the test incidents:

| Test ID | Category | Expected Primary Category | Expected Severity |
|---------|----------|---------------------------|-------------------|
| test-1  | Youth Gambling | Crime, Safety & Security | medium |
| test-2  | Stolen Vehicle | Crime, Safety & Security | high |
| test-3  | Noise Pollution | Crime, Safety & Security | low |
| test-4  | Theft | Crime, Safety & Security | high |
| test-5  | Gang Activity | Crime, Safety & Security | high |
| test-6  | Drug Misuse | Substance Abuse & Addiction | high |
| test-7  | Domestic Violence | Crime, Safety & Security | high |
| test-8  | Cyberbullying | School & Student-Related Issues | high |
| test-9  | Unsafe Buildings | Housing & Environmental Conditions | high |
| test-10 | Welfare Checks | Mental Health & Social Support | high |

## Further Refinements Needed

Based on test results, consider:

1. **Severity Calibration:**
   - Review if noise complaints should always be "low" or if persistent/repeated ones should be "medium"
   - Consider if youth gambling should be "medium" or "high" based on scale

2. **Entity Extraction:**
   - Verify that all people, locations, and times are being extracted correctly
   - Check for false positives (common words mistaken for names)

3. **Category Edge Cases:**
   - Monitor for incidents that don't fit clearly into any category
   - Consider adding sub-categories or tags for better classification

4. **Summary Quality:**
   - Ensure summaries are actionable and informative
   - Check that key details (who, what, where, when) are included

## Usage

After running tests, review the output and:
1. Identify any category mismatches
2. Note severity assessment issues
3. Check entity extraction quality
4. Refine prompts based on results
5. Re-test to verify improvements



