# ServerManager

A personal SSH server management app for Android with encrypted credential storage and quick action buttons.

## Features

- 🔐 Secure credential storage (Android Keystore)
- 🖥️ SSH connections to multiple servers
- ⚡ Customizable quick action buttons
- 🔒 Biometric authentication
- 🔄 Self-updating via GitHub Releases
- 📦 Direct APK installation (no Play Store)

## Getting Started

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android device/emulator
npm run android
```

## Documentation

- [SETUP.md](SETUP.md) - Development environment setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [ROADMAP.md](ROADMAP.md) - Development roadmap and phases
- [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md) - Complete project plan

## Tech Stack

- **Framework:** React Native with Expo (Managed Workflow)
- **Navigation:** React Navigation 6
- **UI:** React Native Paper (Material Design)
- **Storage:** expo-secure-store + AsyncStorage
- **Auth:** expo-local-authentication

## Project Structure

```
server-manager/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── navigation/      # React Navigation setup
│   ├── contexts/        # React Context state management
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── types.ts         # TypeScript definitions
├── app.json             # Expo configuration
├── package.json
└── README.md
```

## Development Phases

- ✅ Phase 0: Setup & Documentation
- 🔄 Phase 1: Core Storage & UI (In Progress)
- ⏳ Phase 2: SSH Integration
- ⏳ Phase 3: Quick Actions
- ⏳ Phase 4: Auto-Update System
- ⏳ Phase 5: Security Features
- ⏳ Phase 6: Polish & Testing

## Security

- Credentials encrypted with expo-secure-store (Android Keystore)
- Biometric authentication support
- No credentials committed to Git
- SSH key support (better than passwords)

## Building APK

```bash
# Production build (cloud)
eas build --platform android --profile production

# Local build
eas build --platform android --profile production --local
```

## License

Personal project - not for distribution

## Author

dutch iono