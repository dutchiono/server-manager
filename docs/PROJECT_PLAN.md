# Server Manager App - Project Plan

## Project Overview

**Name:** ServerManager (working title)
**Platform:** Android (Pixel 10)
**Framework:** React Native with Expo (Managed Workflow)
**Primary Goal:** Personal SSH server management with quick actions and self-updating capabilities

## Why Expo Managed Workflow?

**Expo vs Bare React Native:**
- **Expo Managed:** Pre-configured tooling, OTA updates via EAS, easier setup, faster development
- **Bare React Native:** Full native code access, more flexibility, but requires Android Studio setup

**We're using Expo Managed because:**
1. ✅ Built-in secure storage (expo-secure-store)
2. ✅ EAS Update for hot JS/UI updates without rebuilding APK
3. ✅ EAS Build for cloud APK generation
4. ✅ Faster iteration with managed native modules
5. ✅ Can still eject to bare if needed later

## Core Features

### 1. Server Management
- Add/Edit/Delete server profiles
- Store: hostname, port, username, password/SSH key
- Encrypted credential storage (Android Keystore via expo-secure-store)
- Import/Export server configurations (encrypted backup)

### 2. SSH Connection
- Connect to servers via SSH
- Execute commands interactively
- Command history (per-server)
- Session management (reconnect, disconnect)

### 3. Quick Actions
- Customizable command buttons per server
- Examples: "Restart nginx", "Check disk space", "View logs"
- Pre-defined command templates
- Output display in modal/drawer

### 4. Self-Update System
- Check GitHub Releases API for new APK versions
- Download APK directly from GitHub
- Prompt user to install update
- Version tracking and changelog display

### 5. Security
- Biometric authentication to unlock app
- Encrypted credential storage
- SSH key support (better than passwords)
- Auto-lock after inactivity
- No credentials committed to Git

## Technology Stack

### Frontend
- **React Native:** 0.73+ (latest stable)
- **Expo SDK:** 50+ (managed workflow)
- **Navigation:** React Navigation 6
- **State Management:** React Context + AsyncStorage
- **UI Library:** React Native Paper (Material Design)

### Storage
- **Credentials:** expo-secure-store (Android Keystore backed)
- **App Data:** @react-native-async-storage/async-storage
- **Encrypted Backups:** expo-crypto + expo-file-system

### SSH Integration
- **Library:** Custom native module wrapping JSch (Java SSH library)
- **Alternative:** react-native-ssh-sftp (if maintained)
- **Fallback:** Expo dev client with custom native code

### Updates & Distribution
- **OTA Updates:** EAS Update (for JS/asset changes)
- **APK Updates:** GitHub Releases (for native changes)
- **Build System:** EAS Build or local `eas build --platform android --profile production`

### CI/CD
- **GitHub Actions:** Automated APK builds on tag push
- **Release Management:** GitHub Releases with APK artifacts
- **Version Bumping:** Automated via scripts

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Native App                   │
├─────────────────────────────────────────────────────┤
│  Navigation Layer (React Navigation)                │
│  ├─ Auth Stack (Biometric Lock)                     │
│  ├─ Main Stack                                      │
│  │   ├─ Server List Screen                          │
│  │   ├─ Add/Edit Server Screen                      │
│  │   ├─ SSH Terminal Screen                         │
│  │   ├─ Quick Actions Dashboard                     │
│  │   └─ Settings Screen                             │
├─────────────────────────────────────────────────────┤
│  State Management                                   │
│  ├─ ServerContext (server profiles)                │
│  ├─ AuthContext (biometric lock)                   │
│  ├─ SSHContext (active connections)                │
│  └─ UpdateContext (app version management)         │
├─────────────────────────────────────────────────────┤
│  Business Logic Services                            │
│  ├─ StorageService (AsyncStorage wrapper)          │
│  ├─ CredentialService (SecureStore wrapper)        │
│  ├─ SSHService (native module bridge)              │
│  └─ UpdateService (GitHub API + APK download)      │
├─────────────────────────────────────────────────────┤
│  Storage Layer                                      │
│  ├─ AsyncStorage (server profiles, settings)       │
│  ├─ SecureStore (passwords, SSH keys)              │
│  └─ FileSystem (APK downloads, backups)            │
├─────────────────────────────────────────────────────┤
│  Native Modules (Android)                           │
│  ├─ SSHModule (JSch wrapper)                       │
│  ├─ Biometric (expo-local-authentication)          │
│  └─ FileProvider (APK install permissions)         │
└─────────────────────────────────────────────────────┘
```

## Data Models

### ServerProfile (AsyncStorage)
```typescript
interface ServerProfile {
  id: string;                 // UUID
  name: string;               // Display name
  hostname: string;           // IP or domain
  port: number;               // Default 22
  username: string;           // SSH username
  authType: 'password' | 'key';
  color: string;              // Visual tag
  quickActions: QuickAction[];
  createdAt: number;
  lastConnected?: number;
}
```

### ServerCredentials (SecureStore)
```typescript
interface ServerCredentials {
  password?: string;          // For password auth
  privateKey?: string;        // For key auth
  passphrase?: string;        // Key passphrase
}
```

### QuickAction
```typescript
interface QuickAction {
  id: string;
  label: string;              // Button text
  command: string;            // SSH command
  confirmBefore: boolean;     // Safety check
  icon?: string;              // Material icon
}
```

## Development Phases

### Phase 0: Setup & Documentation ✅ (Complete)
- ✅ Initialize Expo project
- ✅ Configure TypeScript
- ✅ Set up React Navigation
- ✅ Configure React Native Paper theme
- ✅ Write comprehensive documentation
- ✅ Create GitHub repository

### Phase 1: Core Storage & UI (Week 1)
- [ ] Implement CredentialService (SecureStore)
- [ ] Implement StorageService (AsyncStorage)
- [ ] Server CRUD operations in ServerContext
- [ ] Server list UI with search/filter
- [ ] Add/Edit server form with validation
- [ ] Empty states and loading indicators

### Phase 2: SSH Integration (Week 2)
- [ ] Set up Expo development build
- [ ] Create native SSH module (JSch)
- [ ] Implement SSHService bridge
- [ ] Build SSH terminal screen
- [ ] Command execution and output display
- [ ] Command history and autocomplete

### Phase 3: Quick Actions (Week 3)
- [ ] Quick action CRUD in ServerContext
- [ ] Action execution logic
- [ ] Quick action button grid UI
- [ ] Action editor dialog
- [ ] Preset action templates
- [ ] Output display modal

### Phase 4: Auto-Update System (Week 4)
- [ ] GitHub Releases API integration
- [ ] Version comparison logic
- [ ] APK download functionality
- [ ] Android install intent
- [ ] Update UI (dialog, progress)
- [ ] GitHub Actions CI/CD pipeline

### Phase 5: Security Features (Week 5)
- [ ] Biometric authentication implementation
- [ ] Auto-lock timer
- [ ] Backup/restore functionality
- [ ] SSH key generation
- [ ] Security audit

### Phase 6: Polish & Testing (Week 6)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Bug fixing
- [ ] User documentation
- [ ] Comprehensive testing
- [ ] Production build and release

## Security Considerations

### Data Protection
1. **Credentials:** Always in SecureStore (Android Keystore)
2. **Server Profiles:** AsyncStorage (non-sensitive metadata)
3. **Backups:** Encrypted with user password
4. **SSH Keys:** Never logged or exposed

### App Security
1. **Biometric Lock:** Required by default
2. **Auto-Lock:** 5 minutes inactivity
3. **Input Validation:** Prevent injection attacks
4. **Command Sanitization:** Strip dangerous characters
5. **HTTPS Only:** For API calls (GitHub)

### Development Security
1. **No Hardcoded Secrets:** Use environment variables
2. **.gitignore:** Exclude credentials and keys
3. **Code Review:** Before merging to main
4. **Dependency Audits:** Regular security updates

## Distribution Strategy

### Why No Play Store?
1. Personal app (single user)
2. Avoid Play Store fees and policies
3. Self-update mechanism provides updates
4. Direct APK installation simpler
5. No review process delays

### Distribution Method
1. GitHub Releases as primary source
2. APK downloads via browser
3. "Install from unknown sources" required
4. Self-update keeps app current
5. Manual installation for first install

### Version Management
- **Semantic Versioning:** MAJOR.MINOR.PATCH
- **OTA Updates:** For PATCH releases (JS changes)
- **APK Updates:** For MINOR/MAJOR (native changes)
- **Automatic Checks:** Daily version check
- **User Control:** Can skip or postpone updates

## Build Process

### Development Build
```bash
# For local testing with native modules
eas build --profile development --platform android

# Or build locally (faster)
eas build --profile development --platform android --local
```

### Production Build (Manual)
```bash
# Cloud build (recommended)
eas build --profile production --platform android

# Local build (requires Android SDK)
eas build --profile production --platform android --local
```

### Automated Build (CI/CD)
```bash
# Trigger via git tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions automatically:
# 1. Runs eas build
# 2. Creates GitHub Release
# 3. Uploads APK
# 4. Adds changelog
```

## Testing Strategy

### Unit Tests
- Service layer (StorageService, CredentialService)
- Validation functions
- Utility functions
- Context logic

### Integration Tests
- Server CRUD operations
- Credential storage/retrieval
- Navigation flows
- SSH connection lifecycle

### Manual Testing
- SSH connections to real servers
- Biometric authentication
- APK installation
- Update workflow
- Edge cases and error scenarios

### Test Coverage Goals
- Services: 80%+
- Utils: 90%+
- Contexts: 60%+
- Overall: 70%+

## Performance Targets

### App Launch
- Cold start: < 2 seconds
- Warm start: < 1 second
- Biometric unlock: < 500ms

### UI Responsiveness
- List scrolling: 60 FPS
- Navigation transitions: Smooth (no jank)
- Command execution: < 100ms to show feedback
- Server connection: < 5 seconds (network dependent)

### Storage Performance
- Save server: < 100ms
- Load server list: < 200ms
- Credential retrieval: < 300ms (SecureStore overhead)

### Build Size
- APK size: < 30 MB
- Install size: < 50 MB
- Memory usage: < 150 MB during active use

## Success Criteria

### MVP (Minimum Viable Product)
- ✅ Can add/edit/delete servers
- ✅ Can store credentials securely
- ✅ Can connect via SSH
- ✅ Can execute commands
- ✅ Has quick action buttons
- ✅ Can auto-update
- ✅ Has biometric lock

### Production Ready
- ✅ All MVP features stable
- ✅ Zero critical bugs
- ✅ Good performance metrics
- ✅ Complete documentation
- ✅ Automated build pipeline
- ✅ Smooth user experience

### Daily Use Ready
- ✅ Reliable SSH connections
- ✅ No crashes or data loss
- ✅ Fast and responsive
- ✅ Intuitive UI/UX
- ✅ Handles edge cases gracefully

## Future Enhancements (Post-MVP)

### Features
- SFTP file transfer
- SSH tunnel/port forwarding
- Server monitoring (uptime, CPU, memory)
- Multi-session support
- Shared server configurations
- Cloud backup sync
- Widget for quick connect
- Notification for server issues

### Technical
- Tablet layout optimization
- iOS support
- Wear OS companion
- Light/dark theme toggle
- Accessibility improvements
- Internationalization (i18n)
- Analytics (privacy-friendly)

### Integration
- Integration with other tools (Termux, etc.)
- API for third-party apps
- Tasker/automation support
- SSH agent integration

## Risk Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| SSH native module complexity | High | Start with JSch, fallback to simpler solutions |
| SecureStore reliability | High | Extensive testing on multiple devices |
| APK auto-install issues | Medium | Clear user instructions, fallback to manual |
| GitHub API rate limits | Low | Cache responses, implement exponential backoff |
| Build size exceeds target | Low | Code splitting, asset optimization |

### User Experience Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex setup process | Medium | Detailed setup guide, video tutorial |
| SSH connection failures | High | Clear error messages, troubleshooting guide |
| Credential loss | Critical | Backup/restore, export functionality |
| Performance issues | Medium | Profiling, optimization, testing |

## Timeline

### Week 0 (Completed)
- ✅ Project setup
- ✅ Documentation
- ✅ Initial scaffold

### Week 1 (Current)
- Storage implementation
- Server CRUD
- Basic UI

### Week 2
- SSH native module
- Terminal screen
- Command execution

### Week 3
- Quick actions
- Action UI
- Templates

### Week 4
- Update system
- GitHub integration
- CI/CD pipeline

### Week 5
- Security features
- Backup/restore
- Biometric polish

### Week 6
- Testing
- Bug fixing
- Documentation
- Release

**Target Launch:** 6 weeks from start
**Buffer:** +1 week for unexpected issues
**Total Timeline:** 7 weeks

## Resources

### Documentation
- Expo Docs: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- React Native Paper: https://callstack.github.io/react-native-paper/
- JSch Documentation: http://www.jcraft.com/jsch/
- GitHub API: https://docs.github.com/en/rest

### Tools
- Android Studio (for native development)
- VS Code (primary editor)
- React Native Debugger
- Expo Go (for quick testing)
- adb (Android Debug Bridge)

### Community
- Expo Discord
- React Native Reddit
- Stack Overflow
- GitHub Discussions

---

**Project Status:** Phase 1 - Core Storage & UI
**Last Updated:** February 9, 2026
**Next Milestone:** Phase 1A - Encrypted Credential Storage