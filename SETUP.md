# Setup Guide - ServerManager

Complete guide to setting up the development environment and building the ServerManager app.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **npm** or **yarn** (comes with Node.js)
   - Verify: `npm --version`

3. **Git**
   - Download from https://git-scm.com/
   - Verify: `git --version`

4. **Android Studio** (for Android development)
   - Download from https://developer.android.com/studio
   - Install Android SDK Platform 33 or higher
   - Configure Android SDK path

5. **Expo CLI** (optional, but recommended)
   ```bash
   npm install -g expo-cli
   ```

6. **EAS CLI** (for building APKs)
   ```bash
   npm install -g eas-cli
   ```

### Android Device Setup

**Option 1: Physical Device (Recommended for this project)**
1. Enable Developer Options on your Pixel 10
   - Settings > About phone > Tap "Build number" 7 times
2. Enable USB Debugging
   - Settings > Developer options > USB debugging
3. Connect via USB and authorize computer

**Option 2: Android Emulator**
1. Open Android Studio
2. AVD Manager > Create Virtual Device
3. Select Pixel 10 or similar
4. Download system image (API 33+)
5. Launch emulator

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dutchiono/server-manager.git
cd server-manager
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React Native and Expo
- Navigation libraries
- React Native Paper (UI)
- Secure storage and authentication
- All development dependencies

### 3. Configure Expo Account

```bash
# Login to Expo (creates free account if needed)
eas login

# Initialize EAS for this project
eas build:configure
```

This creates your EAS project and updates `app.json` with your project ID.

### 4. Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your EAS project ID
# (This was added during eas build:configure)
```

## Development Workflow

### Starting Development Server

```bash
# Start Expo dev server
npm start

# Or start with specific platform
npm run android  # Opens on Android device/emulator
npm run ios      # Opens on iOS (if on macOS)
```

### Development Server Options

When you run `npm start`, you'll see a QR code and options:
- Press `a` - Open on Android device/emulator
- Press `i` - Open on iOS simulator (macOS only)
- Press `w` - Open in web browser
- Press `r` - Reload app
- Press `m` - Toggle menu

### Hot Reload

Changes to JavaScript/TypeScript code automatically reload the app. For native changes (dependencies, permissions), rebuild the app.

## Building the App

### Development Build (For Testing)

```bash
# Build development APK (includes dev tools)
eas build --profile development --platform android

# Or build locally (requires Android Studio)
eas build --profile development --platform android --local
```

### Production Build (For Distribution)

```bash
# Build production APK (optimized, no dev tools)
eas build --profile production --platform android

# Download the APK from the link provided
# Transfer to your Pixel 10 and install
```

### Installing APK on Device

**Via USB (ADB):**
```bash
# Find your device
adb devices

# Install APK
adb install path/to/app.apk
```

**Via Direct Download:**
1. Enable "Install from unknown sources" on your Pixel 10
2. Download APK from EAS build URL or GitHub Releases
3. Tap to install

## Project Structure

```
server-manager/
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── eas.json              # EAS Build configuration
├── babel.config.js       # Babel configuration
├── App.tsx               # Root component
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ServerCard.tsx
│   ├── screens/          # App screens
│   │   ├── LockScreen.tsx
│   │   ├── ServerListScreen.tsx
│   │   ├── AddServerScreen.tsx
│   │   ├── ServerDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── contexts/         # State management
│   │   ├── ServerContext.tsx
│   │   └── AuthContext.tsx
│   ├── services/         # Business logic
│   │   └── StorageService.ts
│   ├── utils/            # Utilities
│   │   ├── theme.ts
│   │   ├── constants.ts
│   │   └── validation.ts
│   └── types.ts          # TypeScript types
└── assets/               # Images, fonts, etc.
```

## Common Commands

```bash
# Development
npm start                 # Start dev server
npm run android          # Run on Android
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checker

# Building
eas build --platform android --profile development
eas build --platform android --profile production

# Updates (OTA - Over The Air)
eas update                # Push JS/asset updates without rebuilding
```

## Troubleshooting

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start --clear
```

### Metro bundler issues
```bash
# Reset Metro cache
npm start --reset-cache
```

### Android build fails
```bash
# Check Android SDK installation
echo $ANDROID_HOME

# Should point to Android SDK location
# e.g., /Users/username/Library/Android/sdk

# If not set, add to ~/.bashrc or ~/.zshrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### EAS build quota exceeded
- Expo free tier: Limited builds per month
- Solution: Build locally with `--local` flag
- Or upgrade to paid Expo plan

### App crashes on device
```bash
# View device logs
adb logcat | grep ReactNative

# View Expo logs
npx expo start --dev-client
```

### TypeScript errors
```bash
# Check types without running app
npm run type-check

# Fix auto-fixable issues
npm run lint -- --fix
```

## Testing on Physical Device

### USB Connection
```bash
# Check device is connected
adb devices

# Should show:
# List of devices attached
# XXXXXXXXXX    device

# Run app on connected device
npm run android
```

### Wireless Debugging (Android 11+)
1. Phone and computer on same WiFi
2. Settings > Developer options > Wireless debugging
3. Pair device using pairing code
4. Run `npm run android`

## Development Tips

### Fast Refresh
- Saves automatically reload the app
- Preserves component state
- If it doesn't work, shake device and tap "Reload"

### React Native Debugger
```bash
# Install standalone debugger
brew install --cask react-native-debugger

# Or use Chrome DevTools
# Shake device > "Debug" > Opens Chrome
```

### Expo Go App (Quick Testing)
For rapid testing without builds:
```bash
# Install Expo Go on your phone (Play Store)
# Run: npm start
# Scan QR code with Expo Go app
```
**Note:** Custom native modules (like SSH) won't work in Expo Go. Use development builds instead.

## Next Steps

1. ✅ Setup complete
2. Run `npm start` to start development
3. Make changes and see them live reload
4. Follow the development phases in ROADMAP.md
5. Build Phase 1 features (credential storage + server list)

## Getting Help

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **React Navigation:** https://reactnavigation.org/
- **React Native Paper:** https://callstack.github.io/react-native-paper/

## Environment Variables

Required in `.env`:
```bash
EAS_PROJECT_ID=your-project-id-here
```

Optional (for auto-updates):
```bash
GITHUB_REPO=dutchiono/server-manager
GITHUB_TOKEN=ghp_xxxxx  # Only if repo is private
```

---

**Ready to develop!** Run `npm start` and begin building. 🚀