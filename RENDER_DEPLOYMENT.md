# Render.com Deployment Guide for FightBack

## Prerequisites

1. A GitHub account with your FightBack repository pushed
2. A Render account (free at https://render.com)

## Step-by-Step Deployment Instructions

### 1. Connect Your GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"**
4. Select your GitHub account and authorize Render
5. Find and select your `FightBack` repository

### 2. Configure Your Web Service

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `fightback` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to your users) |
| **Branch** | `main` (or your default branch) |
| **Build Command** | `npm run build` |
| **Start Command** | `node dist/app.js` |
| **Plan** | `Free` (or upgrade as needed) |

### 3. Set Environment Variables

Click **"Advanced"** and add these environment variables in the Render dashboard:

```
NODE_ENV=production
PORT=3000
VITE_PUBLIC_URL=https://your-app-name.onrender.com
VITE_API_URL=https://your-app-name.onrender.com/api
```

**Replace `your-app-name`** with the actual name Render assigns to your service.

⚠️ **Important**: If your app needs additional environment variables (API keys, database URLs, etc.), add them here as well.

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically start building your application
3. You can watch the build logs in real-time
4. Once deployed, your app will be available at `https://your-app-name.onrender.com`

## How Your App Will Be Built & Served

1. **Build Phase**: 
   - Render runs `npm install` automatically
   - Then executes `npm run build` which:
     - Builds the React frontend with Vite (outputs to `dist/`)
     - Bundles the server code with esbuild

2. **Runtime Phase**:
   - Render starts your app with `node dist/app.js`
   - This serves both your static frontend and API routes

## Continuous Deployment

After the initial deployment:

1. Every time you push to your GitHub repository, Render automatically rebuilds and deploys
2. You can also manually trigger deploys from the Render dashboard
3. Builds typically take 2-5 minutes

## Troubleshooting

### Build Fails
- Check the build logs in the Render dashboard
- Ensure `npm run build` works locally: `npm run build`
- Verify all dependencies are listed in `package.json`

### App Crashes After Deployment
- Check the runtime logs in Render dashboard
- Ensure the `PORT` environment variable is set
- Check that `node dist/app.js` exists after build

### Blank Page or 404 Errors
- Verify `VITE_PUBLIC_URL` and `VITE_API_URL` are correctly set
- Clear browser cache and do a hard refresh
- Check browser console for errors

### Port Issues
- The app automatically uses the `PORT` environment variable
- This is already configured in the vite.config.ts
- No additional changes needed

## Using render.yaml (Advanced)

This repository includes a `render.yaml` file that auto-configures deployment settings. If you want Render to use this:

1. In Render Dashboard, go to your service
2. Settings → Blueprint
3. Connect to your Git repository branch with the render.yaml file
4. Render will automatically apply those settings on future deployments

## Monitoring & Maintenance

1. **Logs**: View real-time logs in Render dashboard
2. **Metrics**: Check CPU/Memory usage
3. **Updates**: Redeploy manually anytime with "Manual Deploy" button
4. **Auto-Deploys**: Disable if needed in Settings → Auto-Deploy

## Next Steps

1. Verify the deployment URL works
2. Test all features in production
3. Set up a custom domain if desired (Settings → Custom Domain)
4. Monitor the app for errors using Render's logging

---

**Need Help?** Check Render's official documentation: https://render.com/docs
