@echo off
echo ====================================
echo   CoffeeTeam Pro - Starting Dev Server
echo ====================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo.
    call npm install
    echo.
)

REM Start the development server
echo Starting development server...
echo.
call npm run dev

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo ====================================
    echo   Error occurred! Check above for details.
    echo ====================================
    pause
)
