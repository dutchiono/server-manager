# Architecture Documentation - ServerManager

Technical architecture and design decisions for the ServerManager mobile app.

## Overview

ServerManager is a React Native mobile application built with Expo's managed workflow, designed for secure SSH server management on Android devices.

## Technology Stack

### Core Framework
- **React Native 0.73+** - Cross-platform mobile framework
- **Expo SDK 50+** - Managed workflow with pre-built modules
- **TypeScript** - Type safety and better developer experience

### UI & Navigation
- **React Native Paper 5.x** - Material Design 3 components
- **React Navigation 6** - Native stack navigation
- **React Native Safe Area Context** - Safe area handling

### State Management
- **React Context API** - Global state without Redux complexity
- **React Hooks** - Modern state management patterns

### Storage & Security
- **expo-secure-store** - Encrypted credential storage (Android Keystore)
- **AsyncStorage** - Non-sensitive app data
- **expo-local-authentication** - Biometric authentication

### Build & Distribution
- **EAS Build** - Cloud-based APK builds
- **EAS Update** - Over-the-air JS/asset updates
- **GitHub Actions** - CI/CD automation

## Architecture Patterns

### 1. Context-Based State Management

We use React Context for global state instead of Redux to reduce complexity while maintaining scalability.

**Contexts:**
```
ServerContext
├─ servers: ServerProfile[]
├─ addServer()
├─ updateServer()
├─ deleteServer()
└─ getServer()

AuthContext
├─ isLocked: boolean
├─ authEnabled: boolean
├─ unlock()
├─ lock()
└─ toggleAuth()

SSHContext (Phase 2)
├─ connections: Map<serverId, SSHConnection>
├─ connect()
├─ disconnect()
└─ executeCommand()

UpdateContext (Phase 4)
├─ currentVersion: string
├─ latestVersion: string
├─ checkForUpdates()
└─ downloadUpdate()
```

### 2. Service Layer Pattern

Business logic is separated into service modules that contexts consume:

```
Services/
├─ StorageService
│  ├─ saveServers()
│  ├─ getServers()
│  ├─ saveCredentials()
│  └─ getCredentials()
├─ SSHService (Phase 2)
│  ├─ connect()
│  ├─ disconnect()
│  └─ executeCommand()
└─ UpdateService (Phase 4)
   ├─ checkGitHubReleases()
   ├─ downloadAPK()
   └─ installUpdate()
```

**Benefits:**
- Testable business logic
- Reusable across contexts
- Clear separation of concerns
- Easy to mock for testing

### 3. Component Hierarchy

```
App.tsx
└─ SafeAreaProvider
   └─ PaperProvider (theme)
      └─ AuthProvider
         └─ ServerProvider
            └─ NavigationContainer
               └─ Stack.Navigator
                  ├─ LockScreen (if locked)
                  └─ Main Stack
                     ├─ ServerListScreen
                     ├─ AddServerScreen
                     ├─ ServerDetailScreen
                     └─ SettingsScreen
```

## Data Flow

### Server Creation Flow
```
User Input (AddServerScreen)
    ↓
Validation (utils/validation.ts)
    ↓
ServerContext.addServer()
    ↓
StorageService.saveServers() (AsyncStorage)
    ↓
StorageService.saveCredentials() (SecureStore)
    ↓
UI Update (Context triggers re-render)
```

### SSH Connection Flow (Phase 2)
```
User clicks "Connect" (ServerDetailScreen)
    ↓
SSHContext.connect(serverId)
    ↓
StorageService.getCredentials(serverId)
    ↓
SSHService.connect(hostname, port, credentials)
    ↓
Native Module (Java/JSch)
    ↓
Update connection state in SSHContext
    ↓
Navigate to Terminal Screen
```

## Storage Architecture

### Two-Tier Storage System

**Tier 1: SecureStore (Sensitive Data)**
- Backed by Android Keystore (hardware encryption)
- Stores: passwords, SSH keys, passphrases
- Key format: `@credentials_{serverId}`
- Never accessible without device unlock

**Tier 2: AsyncStorage (Non-Sensitive Data)**
- SQLite-backed key-value store
- Stores: server profiles, settings, command history
- Key format: `@servers`, `@command_history_{serverId}`
- Fast reads for UI rendering

### Data Models

```typescript
// Stored in AsyncStorage
interface ServerProfile {
  id: string;                 // UUID
  name: string;               // User-friendly name
  hostname: string;           // IP or domain
  port: number;               // SSH port (default 22)
  username: string;           // SSH username
  authType: 'password' | 'key';
  color: string;              // Visual identifier
  quickActions: QuickAction[];
  createdAt: number;
  lastConnected?: number;
}

// Stored in SecureStore (encrypted)
interface ServerCredentials {
  password?: string;          // If authType === 'password'
  privateKey?: string;        // If authType === 'key'
  passphrase?: string;        // Key passphrase if needed
}

// Stored in AsyncStorage
interface QuickAction {
  id: string;
  label: string;              // Button text
  command: string;            // SSH command
  confirmBefore: boolean;     // Safety confirmation
  icon?: string;              // Material icon name
}
```

## Security Architecture

### Defense in Depth

**Layer 1: App Lock**
- Biometric authentication on app launch
- Auto-lock after inactivity (5 minutes)
- Configurable in settings

**Layer 2: Credential Encryption**
- SecureStore uses Android Keystore
- Hardware-backed encryption when available
- Keys never leave secure enclave

**Layer 3: Input Validation**
- Hostname/IP validation (prevent injection)
- Command sanitization (remove shell metacharacters)
- Port range validation (1-65535)

**Layer 4: SSH Best Practices**
- Prefer SSH keys over passwords
- Support for passphrase-protected keys
- Warning users about password risks

### Security Considerations

**DO:**
- ✅ Use SecureStore for all credentials
- ✅ Validate all user inputs
- ✅ Sanitize commands before execution
- ✅ Enable biometric lock by default
- ✅ Clear sensitive data from memory after use

**DON'T:**
- ❌ Store credentials in AsyncStorage
- ❌ Log credentials or sensitive data
- ❌ Commit .env files to Git
- ❌ Trust user input without validation
- ❌ Execute unsanitized commands

## Navigation Architecture

### Stack-Based Navigation

```
NavigationContainer
└─ RootStack (Native Stack)
   ├─ Auth Stack (conditional)
   │  └─ LockScreen
   └─ Main Stack
      ├─ ServerList (initial route)
      ├─ AddServer (modal)
      │  └─ param: serverId? (for editing)
      ├─ ServerDetail
      │  └─ param: serverId (required)
      ├─ SSHTerminal (Phase 2)
      │  └─ param: serverId (required)
      └─ Settings
```

### Navigation Flow
- Locked state: Show only LockScreen
- Unlocked state: Show main navigation stack
- Deep linking: Support `servermanager://server/{id}`

## Native Module Integration (Phase 2)

### SSH Module Architecture

```
TypeScript Layer (src/services/SSHService.ts)
    ↓
Bridge Interface (src/modules/ssh/index.ts)
    ↓
Native Module (android/app/src/main/java/SSHModule.java)
    ↓
JSch Library (Java SSH implementation)
    ↓
TCP Socket to SSH Server
```

### Native Module API

```typescript
interface SSHModule {
  connect(config: {
    hostname: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
  }): Promise<string>; // Returns sessionId
  
  disconnect(sessionId: string): Promise<void>;
  
  executeCommand(
    sessionId: string,
    command: string
  ): Promise<{ output: string; exitCode: number }>;
  
  isConnected(sessionId: string): Promise<boolean>;
}
```

## Update System Architecture (Phase 4)

### Two-Tier Update System

**Tier 1: OTA Updates (EAS Update)**
- For: JavaScript/TypeScript changes, UI updates, bug fixes
- No APK rebuild required
- Instant delivery
- Rollback capability

**Tier 2: APK Updates (GitHub Releases)**
- For: Native code changes, new permissions, dependency updates
- Requires full APK download and install
- User confirmation required
- Manual installation

### Update Check Flow

```
App Launch
    ↓
UpdateContext.checkForUpdates()
    ↓
Check EAS Update (expo-updates)
    ↓
If available: Download and apply (automatic)
    ↓
Check GitHub Releases API
    ↓
Compare version numbers (semver)
    ↓
If newer APK available:
    ↓
Show update dialog with changelog
    ↓
User confirms
    ↓
Download APK to file system
    ↓
Trigger Android install intent
    ↓
User confirms installation
```

### Version Management

```json
{
  "version": "1.2.3",  // Semantic versioning
  "versionCode": 4     // Android build number (auto-increment)
}
```

**Semver Rules:**
- MAJOR: Breaking changes, native changes
- MINOR: New features (may need APK update)
- PATCH: Bug fixes (OTA update eligible)

## Build System Architecture

### Local Development
```
npm start
    ↓
Metro Bundler (JavaScript)
    ↓
Hot Reload to Device
```

### Development Build
```
eas build --profile development
    ↓
EAS Build Service
    ↓
Compile APK with dev tools
    ↓
Download and install
```

### Production Build
```
git tag v1.0.0
    ↓
GitHub Actions Trigger
    ↓
eas build --profile production
    ↓
Minify + Optimize
    ↓
Sign APK
    ↓
Upload to GitHub Releases
```

## Performance Considerations

### Optimization Strategies

**1. List Rendering**
- Use FlatList for server lists (virtualization)
- Key extractors for stable IDs
- Item separators instead of margins

**2. Storage Performance**
- Lazy load credentials (only when needed)
- Cache server list in Context
- Debounce search/filter operations

**3. SSH Performance**
- Connection pooling (reuse sessions)
- Command queue (prevent concurrent commands)
- Output buffering (limit terminal history)

**4. Build Size**
- Tree shaking (remove unused code)
- Image optimization (compress assets)
- Split APK by architecture (arm64 vs x86)

## Error Handling

### Layered Error Handling

**1. Service Layer**
```typescript
try {
  await StorageService.saveCredentials(id, creds);
} catch (error) {
  console.error('Storage error:', error);
  throw new Error('Failed to save credentials');
}
```

**2. Context Layer**
```typescript
try {
  await service.operation();
} catch (error) {
  // Show user-friendly message
  showToast('Operation failed. Please try again.');
  // Log for debugging
  logError(error);
}
```

**3. UI Layer**
```typescript
{loading && <ActivityIndicator />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}
```

## Testing Strategy

### Unit Tests
- Service layer logic
- Validation functions
- Utility functions

### Integration Tests
- Context + Service integration
- Navigation flows
- Storage operations

### E2E Tests (Manual for now)
- SSH connection flow
- Server CRUD operations
- Update workflow

## Deployment Architecture

### Distribution Flow

```
Developer
    ↓
git push / git tag
    ↓
GitHub Actions
    ↓
EAS Build
    ↓
GitHub Releases (APK artifact)
    ↓
User downloads APK
    ↓
Install on device
```

### No Play Store
- Direct APK installation only
- Users must enable "Install from unknown sources"
- Self-update mechanism handles version management

## Future Considerations

### Potential Enhancements
- Multi-session support (connect to multiple servers)
- SSH tunnel management (port forwarding)
- File transfer (SFTP integration)
- Command templates library
- Server monitoring (uptime, resource usage)
- Backup/restore to cloud storage
- Dark/light theme toggle
- Tablet layout optimization

### Scalability
- Current architecture supports 100+ servers
- Storage: AsyncStorage limit ~6MB (sufficient)
- SecureStore: No practical limit for our use case
- Navigation: Stack-based scales well

---

**Last Updated:** February 9, 2025
**Architecture Version:** 1.0
**Status:** Initial Implementation