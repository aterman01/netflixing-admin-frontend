@echo off
echo ========================================
echo N8N Frontend Integration - Deployment
echo ========================================
echo.

cd /d "C:\Users\Antho\Desktop\UNITY2025\netflixing-platform\frontend-react"

echo Current directory: %CD%
echo.

echo Step 1: Checking Git status...
git status
echo.

echo Step 2: Adding modified files...
git add src/services/workflowService.js
git add src/pages/admin/WorkflowsTab.jsx
echo.

echo Step 3: Committing changes...
git commit -m "Fix N8N frontend integration - use only existing backend endpoints"
echo.

echo Step 4: Pushing to Railway...
git push origin main
echo.

echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Railway will now automatically build and deploy.
echo Wait 2-3 minutes, then check:
echo https://admin.netflixing.com
echo.
echo Login and click "Workflows" tab to verify.
echo You should see 3 workflows from N8N.
echo.
pause
