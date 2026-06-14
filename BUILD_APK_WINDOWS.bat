@echo off
title Aurora APK Builder
color 0A
echo.
echo  ==========================================
echo   Aurora Health Companion - APK Builder
echo  ==========================================
echo.
echo  Step 1: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js nahi mila!
    echo  Please install from: https://nodejs.org
    pause
    exit
)
echo  [OK] Node.js found
echo.

echo  Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo  [ERROR] npm install fail hua
    pause
    exit
)
echo  [OK] Dependencies installed
echo.

echo  Step 3: Installing EAS CLI...
call npm install -g eas-cli
echo  [OK] EAS CLI ready
echo.

echo  Step 4: Login to Expo...
echo  (Browser mein login page khulega)
echo  expo.dev/signup pe free account banao agar nahi hai
echo.
call eas login
echo.

echo  Step 5: Building APK (10-15 minute lagega)...
echo  Cloud pe build hoga - internet chahiye
echo.
call eas build --platform android --profile preview --non-interactive
echo.
echo  ==========================================
echo   BUILD COMPLETE!
echo   expo.dev/accounts pe login karo
echo   Apna project dekho - APK download karo
echo   Phone pe install karo aur enjoy karo!
echo  ==========================================
echo.
pause
