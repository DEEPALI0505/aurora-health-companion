# 🌿 Aurora — Health Companion App

A beautiful glassmorphism health companion app built with React Native + Expo.

## 📥 Direct Download (No setup needed!)

👉 **[Download Aurora APK](https://expo.dev/accounts/deepali0505/projects/aurora-health-companion/builds/36929e25-e9cb-41bc-96d4-46de61efabfc)**

> After downloading: Settings → Security → Install Unknown Apps → Allow

---

## 📱 Features

✅ Glassmorphism / Liquid Glass UI throughout the app 
✅ Onboarding with 5 animated slides (auto-play + swipe) 
✅ Complete Auth system (Signup / Login) powered by Supabase 
✅ Home dashboard with 3D circular carousel (auto-slide + swipe) 
✅ Time-based greeting — Good Morning / Afternoon / Evening 
✅ Hydration tracker with animated bottle + quick-add buttons 
✅ Sleep tracker — manual log modal + quick log (6h, 6.5h, 7h, 7.5h, 8h) + weekly bar chart 
✅ Habit tracker — create your own habits, tap to complete, notes, delete 
✅ Nutrition tracker — log meals (Breakfast/Lunch/Dinner/Snack) with calories + macros 
✅ AI Prediction Board — real-time health score out of 100 + personalized predictions 
✅ Weekly Journey chart (Water / Sleep / Habits toggle) 
✅ Aurora AI Voice Bot — type or speak, replies in text + voice, auto-logs water from chat 
✅ Smart Notification system — Water every 1/2/3 hrs, Sleep reminder, Habit nudges, Daily insight 
✅ Profile screen — edit name, age, weight, height, water goal, sleep target  
✅ Logout with confirmation 
✅ All data starts empty — fills as you log (no fake pre-filled data)  
✅ Local data persistence (AsyncStorage)  

---

## 🚀 How to Run on Your Phone

**Step 1 — Install Node.js**
Download from: https://nodejs.org (LTS version)

**Step 2 — Install Expo Go on your phone**
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/app/expo-go/id982107779

**Step 3 — Set up the project**
```bash
# Navigate to app folder
cd aurora-app

# Install all dependencies
npm install

# Start the app
npx expo start
```

**Step 4 — Open on your phone**

After running `npx expo start`, a QR code will appear in the terminal.
- Android: Open Expo Go app → Scan QR code
- iPhone: Open Camera app → Scan QR code → tap the link

> ⚠️ Your phone and computer must be on the same WiFi network

---

## 📦 Build APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK
eas build --platform android --profile preview
```

---

## 🏗️ Project Structure

```
aurora-app/
├── App.js                    # Entry point + navigation
├── app.json                  # Expo config
├── package.json              # Dependencies
├── src/
│   ├── theme.js              # Colors, gradients, glass styles
│   ├── store.js              # Global state (AuroraProvider + useAurora)
│   ├── components.js         # Reusable UI components
│   ├── notifications.js      # Push notification service
│   └── screens/
│       ├── OnboardingScreen.js
│       ├── AuthScreen.js
│       ├── HomeScreen.js
│       └── AllScreens.js     # Water, Sleep, Habits, Nutrition, AI, Profile, Notifications
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React Native + Expo SDK 51 |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| Backend / Auth | Supabase |
| UI Effects | expo-blur (BlurView), expo-linear-gradient |
| Charts | react-native-svg |
| Notifications | expo-notifications |
| Voice | expo-speech |
| Storage | @react-native-async-storage/async-storage |
| Haptics | expo-haptics |
| State | React Context + useReducer |

---

## 🎨 Design System

- **Background:** White `#FFFFFF` with soft purple-teal gradient orbs
- **Glass cards:** `BlurView intensity={65}` + `rgba(255,255,255,0.52)` + top shine line
- **Colors:** Teal `#00C4A7`, Violet `#7C5CBF`, Blue `#3A8FD4`, Amber `#C8860A`, Rose `#E8637A`
- **Labels:** Dark colored text for clear readability on glass cards
- **Empty states:** All screens start empty — data fills as user logs activity

---

## 💡 Troubleshooting

**"Metro bundler not starting"**
```bash
npx expo start --clear
```

**"Expo Go can't connect"**
```bash
npx expo start --tunnel
```

**"Module not found"**
```bash
rm -rf node_modules
npm install
```

---

Made with 💚 by Aurora Team
