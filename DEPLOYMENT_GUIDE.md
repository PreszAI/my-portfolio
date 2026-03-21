# Deployment Guide - GitHub & Vercel

This guide will walk you through deploying your Community Incident Reporting platform to GitHub and Vercel.

## Step 1: Prepare Your Code

### 1.1 Check Git Status
```bash
git status
```

### 1.2 Ensure .gitignore is Correct
Make sure `.env.local` and other sensitive files are in `.gitignore`:
- ✅ `.env.local`
- ✅ `.env.*.local`
- ✅ `node_modules/`
- ✅ `.next/`
- ✅ `.vercel/`

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
```

### 2.2 Add All Files
```bash
git add .
```

### 2.3 Create Initial Commit
```bash
git commit -m "Initial commit: Community Incident Reporting Platform with AI Analysis"
```

### 2.4 Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `community-incident-platform`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2.5 Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 3: Deploy to Vercel

### 3.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account (recommended for easy integration)

### 3.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### 3.3 Configure Environment Variables
**CRITICAL STEP**: Add your OpenAI API key

1. In the project import screen, click **"Environment Variables"**
2. Add a new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (get it from [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
   - **Environments**: Select all (Production, Preview, Development)
3. Click **"Add"**

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

## Step 4: Verify Deployment

### 4.1 Test Your Live Site
1. Visit your Vercel URL
2. Try submitting a test report
3. Test the AI analysis feature
4. Verify all features work correctly

### 4.2 Check Environment Variables
If AI analysis isn't working:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `OPENAI_API_KEY` is set correctly
3. Make sure it's enabled for Production environment
4. Redeploy if needed (Settings → Deployments → Redeploy)

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally: `npm run build`

### AI Analysis Not Working
- Verify `OPENAI_API_KEY` is set in Vercel environment variables
- Check that the API key is valid and has credits
- Review server logs in Vercel dashboard

### Environment Variables Not Loading
- Ensure variable name is exactly `OPENAI_API_KEY` (case-sensitive)
- Make sure it's enabled for the correct environment
- Redeploy after adding/changing environment variables

### Reports Not Persisting
- This is expected - localStorage is browser-specific
- Reports are stored in each user's browser
- Consider adding a backend database for production use

## Next Steps

### Production Improvements
1. **Database Integration**: Replace localStorage with a database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add user authentication (NextAuth.js, Clerk, etc.)
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Monitoring**: Add error tracking (Sentry, LogRocket)
5. **Analytics**: Add usage analytics (Vercel Analytics, Google Analytics)

### Security Enhancements
1. **API Rate Limiting**: Prevent abuse of AI analysis endpoint
2. **Input Validation**: Enhanced server-side validation
3. **CORS Configuration**: Proper CORS settings for API routes
4. **Content Security Policy**: Add CSP headers

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for client-side errors
3. Check server logs in Vercel dashboard
4. Verify environment variables are set correctly

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Repository is public or you've granted Vercel access
- [ ] Vercel project created and connected to GitHub
- [ ] `OPENAI_API_KEY` environment variable added
- [ ] Deployment successful
- [ ] Live site tested and working
- [ ] AI analysis feature verified

Congratulations! Your Community Incident Reporting Platform is now live! 🎉



