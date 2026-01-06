@echo off
echo ========================================
echo  CLEARING NEXT.JS CACHE AND RESTARTING
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Step 1: Clearing .next cache folder...
if exist .next (
    rmdir /s /q .next
    echo [SUCCESS] .next cache cleared
) else (
    echo [INFO] .next folder not found
)

echo.
echo Step 2: Clearing node_modules/.cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo [SUCCESS] node cache cleared
) else (
    echo [INFO] node cache not found
)

echo.
echo ========================================
echo  CACHE CLEARED SUCCESSFULLY!
echo ========================================
echo.
echo Now run: npm run dev
echo.
echo Then:
echo 1. Open browser to http://localhost:3001
echo 2. Press Ctrl + Shift + R (hard refresh)
echo 3. Headers should now be BOLD!
echo.
pause
