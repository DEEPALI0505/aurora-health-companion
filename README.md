# 🌿 Aurora — Health Companion App

A beautiful liquid-glass health companion app built with React Native + Expo.

---
## 📥 Direct Download

👉 **[Download Aurora APK](https://expo.dev/accounts/deepali0505/projects/aurora-health-companion/builds/36929e25-e9cb-41bc-96d4-46de61efabfc)**

> Settings → Security → Install Unknown Apps → Allow

---

## 📱 Features

- ✅ Glassmorphism / Liquid Glass UI
- ✅ Onboarding with 5 animated slides (auto-play)
- ✅ Home dashboard with 3D circular carousel (auto-slide + swipe)
- ✅ Hydration tracker with animated bottle + quick-add buttons
- ✅ Sleep tracker with weekly bar charts
- ✅ Habit tracker (tap to complete, streak counting)
- ✅ Nutrition tracker with macros
- ✅ AI Prediction Board (updates in real-time based on data)
- ✅ Weekly Journey chart (Water / Sleep / Habits toggle)
- ✅ Aurora AI Bot (context-aware responses + real water logging via chat)
- ✅ Notification system (Water every 1/2/3 hrs, Sleep, Habits, Daily insight)
- ✅ Profile screen
- ✅ Local data persistence (AsyncStorage)
- ✅ Live clock in status bar (white → green gradient)

---

## 🚀 How to Run on Your Phone

### Step 1 — Install Node.js
Download from: https://nodejs.org (LTS version)

### Step 2 — Install Expo Go on your phone
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

### Step 3 — Set up the project

Open terminal / command prompt and run:

```bash
# Navigate to app folder
cd aurora-app

# Install all dependencies
npm install

# Start the app
npx expo start
```

### Step 4 — Open on your phone
After running `npx expo start`, a **QR code** will appear in the terminal.

- **Android**: Open Expo Go app → Scan QR code
- **iPhone**: Open Camera app → Scan QR code → tap the link

> ⚠️ Your phone and computer must be on the **same WiFi network**

---

## 📦 Build APK (Android) for offline install

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (create free account at expo.dev)
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

This gives you an `.apk` file you can install directly on Android.

---

## 🏗️ Project Structure

```
aurora-app/
├── App.js                    # Entry point + navigation
├── app.json                  # Expo config
├── package.json              # Dependencies
├── src/
│   ├── theme.js              # Colors, gradients design tokens
│   ├── store.js              # Global state (AuroraProvider + useAurora)
│   ├── components.js         # Reusable UI components
│   ├── notifications.js      # Push notification service
│   └── screens/
│       ├── OnboardingScreen.js
│       ├── HomeScreen.js
│       └── AllScreens.js     # Water, Sleep, Habits, Nutrition, AI, Profile, Notif
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React Native + Expo SDK 51 |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| UI Effects | expo-blur (BlurView), expo-linear-gradient |
| Charts | react-native-svg |
| Notifications | expo-notifications |
| Storage | @react-native-async-storage/async-storage |
| Animations | React Native Animated API |
| Haptics | expo-haptics |
| State | React Context + useReducer |

---

## 🎨 Design System

- **Background**: Deep navy `#060918` with multi-layered radial gradient orbs
- **Glass effect**: `BlurView intensity={50-60}` + `rgba(255,255,255,0.08)` base + top shine
- **Colors**: Teal `#00F5D4`, Violet `#B197FC`, Blue `#74C0FC`, Amber `#FFD97D`, Rose `#FF8FAB`
- **Typography**: System font (San Francisco on iOS, Roboto on Android)
- **Status bar time**: White → Teal gradient text

---

## 💡 Troubleshooting

**"Metro bundler not starting"**
```bash
npx expo start --clear
```

**"Expo Go can't connect"**
- Make sure phone + PC are on same WiFi
- Try: `npx expo start --tunnel`

**"Module not found"**
```bash
rm -rf node_modules
npm install
```

---

Made with 💚 by Aurora Team
