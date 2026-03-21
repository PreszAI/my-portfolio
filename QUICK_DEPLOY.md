# Quick Deployment Steps

## 🚀 Deploy in 5 Minutes

### 1. Commit and Push to GitHub
```bash
git add .
git commit -m "Add AI-powered incident analysis, data visualization, and deployment docs"
git push origin master
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. **IMPORTANT**: Add environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
   - Environments: All (Production, Preview, Development)
5. Click **"Deploy"**

### 3. Done! 🎉
Your app will be live at `https://your-project.vercel.app`

## ⚠️ Important Notes

- **API Key**: Make sure to add `OPENAI_API_KEY` in Vercel settings before deploying
- **Environment Variables**: The API key must be set for the deployment to work
- **Redeploy**: If you add environment variables after deployment, you may need to redeploy

## 🔍 Verify Deployment

After deployment, test:
- ✅ Home page loads
- ✅ Report submission works
- ✅ AI analysis button works (requires API key)
- ✅ Reports list displays correctly
- ✅ Export functionality works

## 📚 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.



