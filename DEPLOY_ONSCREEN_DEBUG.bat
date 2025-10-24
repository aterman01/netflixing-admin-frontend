@echo off
echo ============================================
echo DEPLOYING ON-SCREEN DEBUG VERSION
echo ============================================
echo.

cd /d "C:\Users\Antho\Desktop\UNITY2025\netflixing-platform\frontend-react"

echo === STEP 1: GIT STATUS ===
git status
echo.

pause

echo === STEP 2: ADD CHANGES ===
git add src/pages/admin/WorkflowsTab.jsx
echo.

echo === STEP 3: COMMIT ===
git commit -m "ON-SCREEN DEBUG: Display all workflow data visibly on page"
echo.

echo === STEP 4: PUSH TO RAILWAY ===
git push origin main
echo.
echo.

echo ============================================
echo SUCCESS! On-Screen Debug Deployed
echo ============================================
echo.
echo NEXT: Wait 2 min, then open https://admin.netflixing.com
echo.
echo You will see a YELLOW DEBUG PANEL at the top showing:
echo - State values (loading, workflows.length)
echo - Raw API response
echo - Workflows array
echo - Render logic decisions
echo.
echo This will show us EXACTLY what data is coming back
echo and why the workflows aren't displaying.
echo.
pause
