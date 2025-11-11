<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19B-uGZ7jeegQtwgrBa-Y03dn-Xj1PiXK

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repository includes an automated deployment workflow for GitHub Pages.

### Setup

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to the `main` branch or manually trigger the workflow

### Deployment

The app will automatically deploy when:
- Changes are pushed to the `main` branch
- The workflow is manually triggered from the Actions tab

Once deployed, your app will be available at: `https://postusername.github.io/mlita-colloc/`

### Manual Trigger

To manually trigger a deployment:
1. Go to the **Actions** tab
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
