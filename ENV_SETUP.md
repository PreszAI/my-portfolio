# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# AI Service API Key
# Get your API key from your AI provider (e.g., OpenAI, Anthropic, etc.)
OPENAI_API_KEY=your_openai_api_key_here

# Alternative: If using a different AI service
# AI_API_KEY=your_ai_api_key_here
```

## Security Best Practices

1. **Never commit `.env.local` to version control** - It's already in `.gitignore`
2. **Keep API keys secret** - Never expose them in client-side code
3. **Use environment variables** - All sensitive configuration should be in `.env.local`
4. **Rotate API keys regularly** - Change them periodically for security
5. **Monitor API usage** - Set up usage limits to prevent abuse

## Getting an API Key

### OpenAI (Example)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy it to your `.env.local` file

### Other AI Providers
- Adjust the API endpoint and request format in `app/api/analyze-incident/route.ts`
- Update the `callAIService` function to match your provider's API

## Testing the API

Once you've set up your environment variables:

1. Start your development server: `npm run dev`
2. The API will be available at: `http://localhost:3000/api/analyze-incident`
3. Test with a POST request containing incident data

## Example Request

```json
{
  "title": "Crime, Safety & Security",
  "description": "Report of suspicious activity in the neighborhood",
  "category": "Gang Activity",
  "location": "Beetham Phase 1",
  "priority": "high",
  "incidentDate": "2024-01-15",
  "incidentTime": "14:30"
}
```

