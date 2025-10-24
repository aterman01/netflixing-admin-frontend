@echo off
echo ============================================
echo DEPLOYING DEBUG VERSION - N8N Workflows
echo ============================================
echo.

cd /d C:\Users\Antho\Desktop\UNITY2025\netflixing-platform\frontend-react

echo Current directory: %CD%
echo.

echo === STEP 1: GIT STATUS ===
git status
echo.
pause

echo === STEP 2: ADD CHANGES ===
git add src\pages\admin\WorkflowsTab.jsx
echo.

echo === STEP 3: COMMIT ===
git commit -m "Add comprehensive debug logging to WorkflowsTab - N8N integration final debug"
echo.

if %errorlevel% neq 0 (
    echo.
    echo No changes to commit or commit failed.
    echo.
    pause
    exit /b 1
)

echo === STEP 4: PUSH TO RAILWAY ===
git push origin main
echo.

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCESS! Deployment Initiated
    echo ============================================
    echo.
    echo NEXT STEPS:
    echo 1. Wait 2-3 minutes for Railway to deploy
    echo 2. Open: https://admin.netflixing.com
    echo 3. Press F12 to open Developer Tools
    echo 4. Click Console tab
    echo 5. Login to admin dashboard
    echo 6. Click Workflows tab
    echo 7. Look for debug output in console:
    echo    - "===== N8N WORKFLOW DEBUG START ====="
    echo    - "RENDER CHECK:"
    echo.
    echo 8. Check what data is being received
    echo 9. Check why rendering might be failing
    echo.
    echo EXPECTED OUTPUT IN CONSOLE:
    echo - Health data received
    echo - Workflow data received with 1 workflow
    echo - Workflows array with 1 item
    echo - Render check showing workflows.length = 1
    echo.
    echo If you see workflows.length = 1 but still showing
    echo "No workflows found", there's a rendering bug.
    echo.
    echo Copy all console output and send it to me!
    echo.
) else (
    echo.
    echo ============================================
    echo ERROR! Deployment Failed
    echo ============================================
    echo.
    echo Check the error messages above.
    echo.
)

pause
