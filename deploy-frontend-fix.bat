@echo off
echo ============================================
echo N8N Frontend Fix - Deploy to Railway
echo ============================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Checking Git status...
git status
echo.

echo Adding modified files...
git add src/services/workflowService.js
git add src/pages/admin/WorkflowsTab.jsx
echo.

echo Committing changes...
git commit -m "Fix N8N integration - simplified service and tab"
echo.

echo Pushing to Railway...
git push origin main
echo.

if %errorlevel% equ 0 (
    echo ============================================
    echo SUCCESS - Deployment triggered!
    echo ============================================
    echo.
    echo Railway is now building and deploying.
    echo Wait 2-3 minutes, then check:
    echo https://admin.netflixing.com
    echo.
) else (
    echo ============================================
    echo ERROR - Deployment failed!
    echo ============================================
    echo.
    echo Check the error messages above.
    echo.
)

pause
