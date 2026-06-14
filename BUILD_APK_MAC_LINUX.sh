#!/bin/bash
echo ""
echo "=========================================="
echo "  Aurora Health Companion - APK Builder"
echo "=========================================="
echo ""

echo "Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js nahi mila!"
    echo "Please install from: https://nodejs.org"
    exit 1
fi
echo "[OK] Node.js $(node --version)"
echo ""

echo "Step 2: Installing dependencies..."
npm install
echo "[OK] Dependencies installed"
echo ""

echo "Step 3: Installing EAS CLI..."
npm install -g eas-cli
echo "[OK] EAS CLI ready"
echo ""

echo "Step 4: Login to Expo..."
echo "(expo.dev/signup pe free account banao agar nahi hai)"
echo ""
eas login
echo ""

echo "Step 5: Building APK (10-15 minute lagega)..."
eas build --platform android --profile preview --non-interactive
echo ""
echo "=========================================="
echo "  BUILD COMPLETE!"
echo "  expo.dev/accounts pe login karo"
echo "  APK download karo - phone pe install karo!"
echo "=========================================="
