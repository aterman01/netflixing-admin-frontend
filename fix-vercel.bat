@echo off
echo Fixing vercel.json...

(
echo {
echo   "version": 2,
echo   "buildCommand": "npm run build",
echo   "outputDirectory": "dist",
echo   "framework": "vite",
echo   "rewrites": [
echo     {
echo       "source": "/(.*^)",
echo       "destination": "/index.html"
echo     }
echo   ]
echo }
) > vercel.json

echo.
echo vercel.json updated!
echo.
echo Now deploying to Vercel...
echo.

vercel --prod

echo.
echo Done!
pause