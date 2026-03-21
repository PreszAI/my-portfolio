# Community Incident Reporting & AI Analysis Platform

A production-ready Next.js application that demonstrates real-world AI integration for community safety. This platform enables community members to submit incident reports, which are automatically analyzed using OpenAI's GPT models to categorize incidents, assess severity, extract key entities, and generate actionable insights.

## 🎯 What This Tool Does

This platform solves a critical community safety challenge: **How do we quickly and accurately categorize and prioritize community incidents at scale?**

### Core Functionality

1. **Incident Reporting System**
   - Community members submit detailed incident reports with categories, locations, dates, and descriptions
   - Dynamic category dropdowns based on incident type
   - Manual category entry option for edge cases
   - Form validation and error handling

2. **AI-Powered Analysis**
   - Automatic categorization into 13 primary categories
   - Severity assessment (low, medium, high)
   - Entity extraction (people, locations, times, organizations)
   - Intelligent summary generation

3. **Data Visualization & Analytics**
   - Interactive charts showing incident distribution
   - Filtering by category, location, severity, status, and date range
   - Metrics dashboard with trends and statistics
   - Export functionality for data analysis

4. **Data Persistence & Recovery**
   - Browser localStorage for client-side persistence
   - Automatic backup system
   - Recovery functionality for lost data
   - Export/import capabilities

## 🤖 How AI Analysis Works

### Architecture Overview

The AI analysis follows a **secure server-side architecture**:

```
User Submits Report → Frontend → Next.js API Route → OpenAI API → Analysis → Frontend Display
```

**Key Security Feature**: API keys never leave the server. All AI calls happen server-side in Next.js API routes.

### AI Analysis Pipeline

1. **Input Processing**
   - Sanitizes and validates user input
   - Extracts entities using regex patterns (fast, client-side)
   - Maps category to primary category using keyword matching

2. **AI Prompt Engineering**
   - Structured prompt with 13 primary categories
   - Explicit severity guidelines
   - Entity extraction requirements
   - JSON format enforcement

3. **OpenAI API Call**
   - Uses GPT-3.5-turbo or GPT-4
   - `response_format: { type: 'json_object' }` for guaranteed JSON
   - Temperature: 0.7 for balanced creativity/consistency
   - Max tokens: 1000 for comprehensive analysis

4. **Response Processing**
   - Validates JSON structure
   - Ensures category matches valid list
   - Merges AI entities with regex-extracted entities
   - Handles errors gracefully with fallback analysis

5. **Fallback System**
   - If API fails or key missing, uses pattern matching
   - Regex-based entity extraction
   - Keyword-based categorization
   - Maintains functionality even without AI

### Prompt Engineering Strategy

The AI prompt is carefully engineered to ensure accurate categorization:

- **Explicit Category List**: All 13 categories with descriptions
- **Severity Guidelines**: Clear definitions with examples
- **Edge Case Handling**: Rules for ambiguous cases (e.g., "Youth Gambling" → Crime, not Youth Development)
- **JSON Enforcement**: Multiple reminders to return ONLY JSON
- **System Message**: Establishes AI role as "expert community safety analyst"

### Test Results

- **Category Accuracy**: 100% (10/10 test cases)
- **Severity Accuracy**: 90% (9/10 test cases)
- **Overall Accuracy**: 90% (9/10 test cases)

See `TEST_RESULTS_SUMMARY.md` for detailed test results.

## 🧠 What I Learned

### 1. **Secure AI Integration**

**Challenge**: How to use AI APIs without exposing keys to clients?

**Solution**: Next.js API routes keep API keys server-side only. The frontend never sees or handles the API key.

**Key Insight**: Server-side API routes are essential for production AI applications. Never expose API keys in client-side code.

### 2. **Prompt Engineering is an Art**

**Challenge**: Getting consistent, accurate results from AI.

**Solution**: Iterative refinement with test cases, explicit instructions, and validation.

**Key Learnings**:
- Be explicit - don't assume AI knows what you want
- Provide examples and exact format requirements
- Test with diverse cases to find edge cases
- Validate and sanitize all AI responses
- Use structured prompts with clear sections

**Result**: Improved from ~70% to 90% accuracy through prompt refinement.

### 3. **Error Handling is Critical**

**Challenge**: AI APIs can fail (rate limits, network issues, service unavailable).

**Solution**: Comprehensive error handling with fallback systems.

**Key Features**:
- Try-catch blocks at every level
- User-friendly error messages
- Fallback analysis when API unavailable
- Graceful degradation (app works even without AI)

**Insight**: Always have a fallback. Users shouldn't experience complete failure when external services are down.

### 4. **Data Persistence Challenges**

**Challenge**: Browser localStorage can be cleared, corrupted, or quota-exceeded.

**Solution**: Robust backup and recovery system.

**Key Features**:
- Automatic backups before parsing
- Multiple backup format support
- Recovery UI with detailed error messages
- Export functionality for manual backups

**Learning**: Never trust localStorage alone. Always have backup mechanisms.

### 5. **Type Safety with TypeScript**

**Challenge**: Managing complex data structures across API boundaries.

**Solution**: Strict TypeScript types for all data structures.

**Benefits**:
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

### 6. **Real-World Testing**

**Challenge**: How to verify AI accuracy?

**Solution**: Created comprehensive test suite with 10+ diverse incidents.

**Process**:
1. Write test cases covering edge cases
2. Run tests against AI
3. Identify failures
4. Refine prompts
5. Re-test until accuracy improves

**Result**: Systematic approach to improving AI accuracy.

## 🏗️ Technical Architecture

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Client Components** for interactivity

### Backend
- **Next.js API Routes** for server-side logic
- **OpenAI API** for AI analysis
- **Environment Variables** for secure key storage

### Data Flow
1. User submits report → Stored in React state
2. Report saved to localStorage → Persists across refreshes
3. User clicks "Analyze with AI" → Frontend calls `/api/analyze-incident`
4. API route validates input → Calls OpenAI API
5. AI response processed → Validated and sanitized
6. Analysis displayed → User sees categorized, analyzed report

## 📊 Key Features Deep Dive

### Dynamic Category System
Categories are dynamically shown based on selected title:
- **Title Selection** → Filters available categories
- **Manual Entry Option** → For categories not in list
- **Validation** → Ensures data consistency

### AI Entity Extraction
Extracts four types of entities:
- **People**: Names, roles, descriptions
- **Locations**: Addresses, streets, landmarks
- **Times**: Specific times, relative times, ranges
- **Organizations**: Police, schools, agencies

### Severity Assessment Logic
Three-tier system:
- **High**: Immediate danger, violence, weapons, emergencies
- **Medium**: Significant issues requiring prompt attention
- **Low**: Minor issues, quality of life concerns

### Data Visualization
- **Bar Chart**: Incident distribution by category
- **Pie Chart**: Category percentages
- **Metrics Dashboard**: Total incidents, trends, common categories

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd my-portfolio

# Install dependencies
npm install

# Create environment file
echo "OPENAI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[PROMPT_ENGINEERING.md](./PROMPT_ENGINEERING.md)** - AI prompt engineering guide
- **[TEST_RESULTS_SUMMARY.md](./TEST_RESULTS_SUMMARY.md)** - Test results and accuracy metrics
- **[RECOVER_REPORTS.md](./RECOVER_REPORTS.md)** - Data recovery guide
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variable setup

## 🎓 Skills Demonstrated

This project showcases:

- ✅ **AI Integration**: Real-world OpenAI API integration
- ✅ **Prompt Engineering**: Systematic approach to improving AI accuracy
- ✅ **Security**: Server-side API key management
- ✅ **Error Handling**: Comprehensive error handling and fallbacks
- ✅ **TypeScript**: Type-safe development
- ✅ **Next.js**: Modern React framework with API routes
- ✅ **Data Visualization**: Interactive charts with Recharts
- ✅ **State Management**: Complex state with React hooks
- ✅ **Data Persistence**: localStorage with backup/recovery
- ✅ **Testing**: Test-driven prompt refinement

## 🔒 Security Features

- API keys stored server-side only
- Input validation and sanitization
- Environment variables for sensitive data
- Error messages don't expose internal details
- CORS and security headers (via Next.js)

## 🧪 Testing

### Run Fallback Tests (No API Required)
```bash
node test-ai-categorization-fallback.js
```

### Run Full AI Tests (Requires API Key)
```bash
# Make sure dev server is running
npm run dev

# In another terminal
node test-ai-categorization.js
```

## 🚢 Deployment

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions.

## 📈 Future Enhancements

See **[FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md)** for detailed roadmap including:

### Near-Term
- [ ] Database integration (replace localStorage)
- [ ] User authentication
- [ ] Rate limiting for API endpoints
- [ ] Real-time updates

### Advanced AI Features
- [ ] **Automatic Dispatch Recommendations**: AI suggests optimal response teams and resources
- [ ] **Multi-Report Pattern Detection**: Identify trends, hotspots, and related incidents
- [ ] **Predictive Analytics**: Forecast high-risk areas and times
- [ ] **Automated Triage**: Intelligent prioritization and routing

### Integration & Automation
- [ ] **Mapping API Integration**: Visual maps, heatmaps, route optimization
- [ ] **External Service APIs**: Emergency services, social services, communication platforms
- [ ] **IoT Integration**: Smart city sensors, automated alerts
- [ ] **Advanced Analytics Dashboard**: Real-time monitoring, predictive dashboards

### Enterprise Features
- [ ] Multi-tenant support
- [ ] Advanced security and compliance
- [ ] Mobile app version
- [ ] Multi-language support

## 🤝 Contributing

This is a portfolio project demonstrating AI integration skills. For questions or suggestions, please open an issue.

## 📝 License

This project is for portfolio/demonstration purposes.

## 🙏 Acknowledgments

- OpenAI for the GPT API
- Next.js team for the excellent framework
- Recharts for data visualization
- Tailwind CSS for styling

---

**Built with ❤️ to demonstrate real-world AI integration skills**
