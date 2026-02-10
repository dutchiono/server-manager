# Development Roadmap - ServerManager

Detailed phase-by-phase development plan with milestones and deliverables.

## Overview

This roadmap breaks down the ServerManager project into 6 phases, each with specific deliverables and success criteria. Estimated timeline: 6 weeks for MVP.

---

## Phase 0: Setup & Documentation ✅

**Timeline:** Week 0 (Completed)
**Status:** ✅ COMPLETE

### Deliverables
- ✅ Project plan document (PROJECT_PLAN.md)
- ✅ Expo project scaffold
- ✅ Setup guide (SETUP.md)
- ✅ Architecture documentation (ARCHITECTURE.md)
- ✅ Development roadmap (this file)
- ✅ Initial Git repository

### Success Criteria
- ✅ Project runs with `npm start`
- ✅ All documentation complete and clear
- ✅ Development environment setup guide tested

---

## Phase 1: Core Storage & UI 🔄

**Timeline:** Week 1
**Status:** 🔄 IN PROGRESS
**Goal:** Server list with encrypted credential storage

### Phase 1A: Encrypted Credential Storage

**Files to create/modify:**
- `src/services/CredentialService.ts` (new)
- `src/services/StorageService.ts` (enhance existing)

**Tasks:**
1. Implement CredentialService wrapper around expo-secure-store
2. Add encryption key management
3. Create CRUD operations for credentials:
   - `saveCredentials(serverId, credentials)`
   - `getCredentials(serverId)`
   - `deleteCredentials(serverId)`
   - `updateCredentials(serverId, updates)`
4. Add error handling for encryption failures
5. Test on actual device (simulator can behave differently)

**Testing Checklist:**
- [ ] Can save password credentials
- [ ] Can retrieve saved credentials
- [ ] Can update existing credentials
- [ ] Can delete credentials
- [ ] SecureStore encryption working (check with adb)
- [ ] Handles device lock scenarios

**Success Criteria:**
- ✅ Credentials persist across app restarts
- ✅ Credentials encrypted in SecureStore
- ✅ No credentials visible in AsyncStorage
- ✅ Error handling works gracefully

### Phase 1B: Server List CRUD

**Files to create/modify:**
- `src/contexts/ServerContext.tsx` (already exists, enhance)
- `src/services/StorageService.ts` (enhance)

**Tasks:**
1. Implement server CRUD operations:
   - `addServer(server)` - Add new server
   - `updateServer(id, updates)` - Update existing
   - `deleteServer(id)` - Remove server + credentials
   - `getServer(id)` - Retrieve single server
2. Add server validation logic
3. Handle concurrent updates
4. Implement server list sorting (by name, last connected)
5. Add search/filter functionality

**Testing Checklist:**
- [ ] Can add new server
- [ ] Can edit existing server
- [ ] Can delete server
- [ ] Deleting server also deletes credentials
- [ ] Server list persists across restarts
- [ ] Validation prevents invalid data

**Success Criteria:**
- ✅ All CRUD operations work reliably
- ✅ Data persists in AsyncStorage
- ✅ Validation prevents corrupt data
- ✅ Context updates trigger UI re-renders

### Phase 1C: Server List UI

**Files to create/modify:**
- `src/screens/ServerListScreen.tsx` (already exists, enhance)
- `src/screens/AddServerScreen.tsx` (already exists, enhance)
- `src/components/ServerCard.tsx` (already exists, enhance)

**Tasks:**
1. Enhance ServerListScreen:
   - Empty state with helpful message
   - Pull-to-refresh functionality
   - Swipe-to-delete gestures
   - Search bar for filtering
2. Polish AddServerScreen:
   - Real-time validation feedback
   - Color picker for server tag
   - SSH key file picker (basic)
   - Test connection button (preview)
3. Improve ServerCard:
   - Connection status indicator
   - Last connected timestamp
   - Quick action preview
   - Long-press for options

**Testing Checklist:**
- [ ] UI responsive and smooth
- [ ] Forms validate inputs properly
- [ ] Error messages clear and helpful
- [ ] Loading states show appropriately
- [ ] Navigation flows work correctly
- [ ] Dark theme looks good

**Success Criteria:**
- ✅ Intuitive UI/UX
- ✅ Fast and responsive
- ✅ No UI bugs or glitches
- ✅ Professional appearance

**Phase 1 Complete Deliverable:**
Working app that stores and displays servers with encrypted credentials. No SSH functionality yet, but foundation is solid.

---

## Phase 2: SSH Integration 🔜

**Timeline:** Week 2
**Status:** 🔜 PENDING
**Goal:** Connect to servers and execute commands

### Phase 2A: SSH Native Module

**Files to create:**
- `src/modules/ssh/index.ts` (TypeScript interface)
- `src/modules/ssh/android/SSHModule.java` (native implementation)
- `src/services/SSHService.ts` (service layer)
- `android/app/build.gradle` (add JSch dependency)

**Tasks:**
1. Set up Expo development build (required for custom native modules)
2. Create native SSH module using JSch:
   - Connection management
   - Authentication (password + key)
   - Command execution
   - Session lifecycle
3. Create TypeScript bridge interface
4. Implement SSHService wrapper
5. Add connection pooling
6. Handle network errors gracefully

**Dependencies to add:**
```gradle
implementation 'com.jcraft:jsch:0.1.55'
```

**Testing Checklist:**
- [ ] Can connect with password auth
- [ ] Can connect with SSH key auth
- [ ] Can execute simple commands
- [ ] Can handle connection failures
- [ ] Can disconnect cleanly
- [ ] Multiple sessions supported

**Success Criteria:**
- ✅ Successful SSH connections to test servers
- ✅ Commands execute and return output
- ✅ Error handling works properly
- ✅ No memory leaks from sessions

### Phase 2B: SSH Terminal Screen

**Files to create:**
- `src/screens/SSHTerminalScreen.tsx` (new)
- `src/components/Terminal.tsx` (new)
- `src/contexts/SSHContext.tsx` (new)

**Tasks:**
1. Create SSHContext for connection state
2. Build terminal UI component:
   - Command input field
   - Output display (scrollable)
   - Loading indicators
   - Connection status badge
3. Implement command execution flow
4. Add output buffering (limit lines)
5. Style terminal (monospace font, dark theme)
6. Add copy output functionality

**Features:**
- Connect/disconnect buttons
- Real-time command output
- Command history (up/down arrows)
- Auto-scroll to latest output
- Clear output button
- Connection timeout handling

**Testing Checklist:**
- [ ] Terminal connects successfully
- [ ] Commands execute and show output
- [ ] Long output doesn't crash app
- [ ] Can disconnect and reconnect
- [ ] UI remains responsive during commands
- [ ] Error messages display correctly

**Success Criteria:**
- ✅ Functional SSH terminal
- ✅ Smooth user experience
- ✅ Reliable command execution
- ✅ Good error handling

### Phase 2C: Command History & Autocomplete

**Files to create/modify:**
- `src/services/StorageService.ts` (add history methods)
- `src/components/CommandInput.tsx` (new)
- `src/screens/SSHTerminalScreen.tsx` (enhance)

**Tasks:**
1. Implement command history storage:
   - Save per-server command history
   - Limit to last 100 commands
   - Deduplicate repeated commands
2. Add autocomplete/suggestions:
   - Common commands (ls, cd, pwd, etc.)
   - Previously used commands
   - Filter as user types
3. Keyboard shortcuts:
   - Up/down arrows for history
   - Tab for autocomplete
   - Ctrl+C for cancel (if possible)

**Testing Checklist:**
- [ ] History saves across sessions
- [ ] Up/down arrows cycle through history
- [ ] Autocomplete suggestions appear
- [ ] Can select suggestion with tap
- [ ] History limited to 100 items
- [ ] Per-server history works

**Success Criteria:**
- ✅ Command history enhances UX
- ✅ Autocomplete speeds up input
- ✅ Keyboard navigation works
- ✅ History persists properly

**Phase 2 Complete Deliverable:**
Functional SSH terminal that connects to servers, executes commands, and provides good UX with history and autocomplete.

---

## Phase 3: Quick Actions ⏳

**Timeline:** Week 3
**Status:** ⏳ NOT STARTED
**Goal:** One-tap command execution with customizable buttons

### Phase 3A: Quick Action System

**Files to create/modify:**
- `src/types.ts` (QuickAction already defined)
- `src/contexts/ServerContext.tsx` (add quick action CRUD)
- `src/services/QuickActionService.ts` (new)

**Tasks:**
1. Implement quick action CRUD:
   - Add action to server
   - Update existing action
   - Delete action
   - Reorder actions (drag-drop)
2. Create action execution logic:
   - Connect to server if not connected
   - Execute command
   - Capture and display output
   - Handle errors
3. Add confirmation dialogs for destructive actions
4. Implement action templates (preset common commands)

**Preset Action Templates:**
- System Info: `uname -a && uptime`
- Disk Space: `df -h`
- Memory Usage: `free -h`
- Running Processes: `ps aux | head -20`
- Network Info: `ip addr show`
- Restart Service: `sudo systemctl restart {service}`
- View Logs: `tail -n 50 /var/log/{log}`

**Testing Checklist:**
- [ ] Can add quick actions to server
- [ ] Can execute quick actions
- [ ] Output displays correctly
- [ ] Confirmation dialogs work
- [ ] Can edit/delete actions
- [ ] Templates easy to use

**Success Criteria:**
- ✅ Quick actions execute reliably
- ✅ Templates save time
- ✅ Good error handling
- ✅ Confirmation prevents accidents

### Phase 3B: Quick Action UI

**Files to create/modify:**
- `src/screens/ServerDetailScreen.tsx` (enhance)
- `src/screens/QuickActionEditor.tsx` (new)
- `src/components/QuickActionButton.tsx` (new)
- `src/components/QuickActionGrid.tsx` (new)

**Tasks:**
1. Design quick action dashboard:
   - Grid layout for action buttons
   - Visual styling (icons + colors)
   - Long-press to edit
   - Drag to reorder
2. Create action editor dialog:
   - Label input
   - Command input with validation
   - Icon picker
   - Confirmation toggle
   - Test button
3. Add output modal:
   - Display command output
   - Copy to clipboard
   - Close/dismiss actions

**UI Features:**
- Colorful, tappable action buttons
- Icons from Material Design
- Quick access from server detail
- Swipe-to-delete in editor
- Undo delete functionality

**Testing Checklist:**
- [ ] Action grid looks good
- [ ] Buttons respond to taps
- [ ] Editor is intuitive
- [ ] Drag-to-reorder works
- [ ] Output modal displays correctly
- [ ] Icons render properly

**Success Criteria:**
- ✅ Polished, professional UI
- ✅ Easy to create actions
- ✅ Fast to execute actions
- ✅ Mobile-friendly layout

**Phase 3 Complete Deliverable:**
Server detail screen with customizable quick action dashboard for one-tap command execution.

---

## Phase 4: Auto-Update System ⏳

**Timeline:** Week 4
**Status:** ⏳ NOT STARTED
**Goal:** Self-updating app without Play Store dependency

### Phase 4A: GitHub Integration

**Files to create:**
- `src/services/UpdateService.ts` (new)
- `src/contexts/UpdateContext.tsx` (new)

**Tasks:**
1. Implement GitHub Releases API client:
   - Fetch latest release info
   - Parse version numbers (semver)
   - Compare with current version
   - Get changelog/release notes
2. Add version checking logic:
   - Check on app launch
   - Check daily in background
   - Manual check from settings
3. Implement changelog display:
   - Format markdown release notes
   - Show what's new dialog
   - Version comparison UI

**API Integration:**
```typescript
interface GitHubRelease {
  tag_name: string;      // "v1.2.3"
  name: string;          // Release title
  body: string;          // Markdown changelog
  assets: Asset[];       // APK download
  published_at: string;
}
```

**Testing Checklist:**
- [ ] Can fetch latest release
- [ ] Version comparison works
- [ ] Changelog displays correctly
- [ ] Handles network errors
- [ ] Works with private repos (token)
- [ ] Rate limiting handled

**Success Criteria:**
- ✅ Reliable update checking
- ✅ Accurate version comparison
- ✅ Clear changelog display
- ✅ Good error handling

### Phase 4B: APK Download & Install

**Files to create/modify:**
- `src/services/UpdateService.ts` (enhance)
- `src/screens/UpdateScreen.tsx` (new)

**Tasks:**
1. Implement APK download:
   - Download from GitHub asset URL
   - Show progress indicator
   - Save to app's file system
   - Verify file integrity (checksum)
2. Trigger Android install intent:
   - Use FileProvider for APK access
   - Request install permissions
   - Handle user cancellation
3. Add update UI:
   - Update available dialog
   - Download progress
   - Install instructions
   - Skip/remind later options

**Android Permissions:**
```xml
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>
```

**Testing Checklist:**
- [ ] APK downloads successfully
- [ ] Progress indicator works
- [ ] Install prompt appears
- [ ] Can install downloaded APK
- [ ] Handles download failures
- [ ] Verifies APK before install

**Success Criteria:**
- ✅ Smooth download experience
- ✅ Clear progress feedback
- ✅ Successful APK installation
- ✅ Handles edge cases

### Phase 4C: GitHub Actions CI/CD

**Files to create:**
- `.github/workflows/build-apk.yml` (new)
- `scripts/bump-version.sh` (new)

**Tasks:**
1. Create GitHub Actions workflow:
   - Trigger on tag push (v*.*.*)
   - Set up Node.js and Expo
   - Run `eas build --platform android --profile production`
   - Upload APK to GitHub Releases
   - Add changelog from commits
2. Implement version bumping script:
   - Update version in package.json
   - Update versionCode in app.json
   - Commit and tag
   - Push to GitHub
3. Configure EAS credentials:
   - Set up EAS secrets in GitHub
   - Configure Android keystore
   - Test build process

**Workflow Trigger:**
```bash
# Developer runs:
npm run release:patch  # Bumps 1.0.0 -> 1.0.1
npm run release:minor  # Bumps 1.0.0 -> 1.1.0
npm run release:major  # Bumps 1.0.0 -> 2.0.0

# Automatically:
# - Updates version numbers
# - Creates git tag
# - Pushes to GitHub
# - Triggers build workflow
# - Publishes to Releases
```

**Testing Checklist:**
- [ ] Workflow triggers on tag
- [ ] Build completes successfully
- [ ] APK uploaded to Releases
- [ ] Changelog included
- [ ] Download link works
- [ ] Signing configured correctly

**Success Criteria:**
- ✅ Automated build pipeline
- ✅ One-command releases
- ✅ APK available on GitHub
- ✅ Reliable and repeatable

**Phase 4 Complete Deliverable:**
Fully automated build and update system. Users can update the app without Play Store.

---

## Phase 5: Security Features ⏳

**Timeline:** Week 5
**Status:** ⏳ NOT STARTED
**Goal:** Enhanced security with biometric lock and backup/restore

### Tasks

**5A: Biometric Authentication** (Partially done)
- ✅ AuthContext already created
- ✅ Biometric unlock on LockScreen
- [ ] Add settings toggle
- [ ] Implement auto-lock timer
- [ ] Add fallback PIN option
- [ ] Test with various biometric types

**5B: Auto-Lock Functionality**
- [ ] Detect app backgrounding
- [ ] Start inactivity timer (5 minutes default)
- [ ] Lock app when timer expires
- [ ] Configurable timeout in settings
- [ ] Persist lock state

**5C: Backup & Restore**
- [ ] Export servers to encrypted JSON
- [ ] Include credentials in backup
- [ ] Password-protected backups
- [ ] Import from backup file
- [ ] Merge or replace options
- [ ] Share backup via Android share sheet

**5D: SSH Key Generation**
- [ ] Generate SSH key pairs
- [ ] Store in SecureStore
- [ ] Export public key
- [ ] Copy to clipboard
- [ ] Key strength options (2048/4096)

**Testing Checklist:**
- [ ] Biometric unlock reliable
- [ ] Auto-lock works correctly
- [ ] Backup includes all data
- [ ] Restore recovers everything
- [ ] Encrypted backups secure
- [ ] SSH keys generate properly

**Success Criteria:**
- ✅ Production-ready security
- ✅ Backup/restore works perfectly
- ✅ Auto-lock prevents unauthorized access
- ✅ SSH key generation reliable

**Phase 5 Complete Deliverable:**
Secure app with biometric lock, auto-lock, and backup/restore capabilities.

---

## Phase 6: Polish & Testing ⏳

**Timeline:** Week 6
**Status:** ⏳ NOT STARTED
**Goal:** Production-ready app with documentation

### Tasks

**6A: UI/UX Polish**
- [ ] Dark mode refinement
- [ ] Add light mode support
- [ ] Animation polish (transitions)
- [ ] Loading state improvements
- [ ] Error message clarity
- [ ] Accessibility improvements (screen readers)
- [ ] Haptic feedback on actions

**6B: Performance Optimization**
- [ ] Profile app performance
- [ ] Optimize re-renders
- [ ] Reduce bundle size
- [ ] Image compression
- [ ] Lazy load screens
- [ ] Memory leak check

**6C: Bug Fixing**
- [ ] Test all user flows
- [ ] Fix reported issues
- [ ] Edge case handling
- [ ] Network failure resilience
- [ ] Race condition fixes
- [ ] Crash reporting setup

**6D: Documentation**
- [ ] User guide (how to use app)
- [ ] Video tutorial/demo
- [ ] FAQ section
- [ ] Troubleshooting guide
- [ ] Update README with screenshots
- [ ] API documentation (for SSH module)

**6E: Testing**
- [ ] Test on multiple devices
- [ ] Test different Android versions
- [ ] Test various SSH servers
- [ ] Stress test (100+ servers)
- [ ] Network failure scenarios
- [ ] Battery usage testing

**Testing Matrix:**
| Test Case | Status | Notes |
|-----------|--------|-------|
| Add/edit/delete servers | [ ] | |
| SSH password auth | [ ] | |
| SSH key auth | [ ] | |
| Quick actions | [ ] | |
| Biometric lock | [ ] | |
| Auto-update | [ ] | |
| Backup/restore | [ ] | |
| Network offline | [ ] | |
| Low storage | [ ] | |
| App backgrounding | [ ] | |

**Success Criteria:**
- ✅ Zero critical bugs
- ✅ Smooth user experience
- ✅ Complete documentation
- ✅ Ready for daily use

**Phase 6 Complete Deliverable:**
Production-ready ServerManager app with full documentation and testing.

---

## Milestone Summary

| Phase | Deliverable | Estimated Time | Status |
|-------|-------------|----------------|--------|
| 0 | Documentation & Setup | 1 day | ✅ Complete |
| 1 | Core Storage & UI | 1 week | 🔄 In Progress |
| 2 | SSH Integration | 1 week | 🔜 Pending |
| 3 | Quick Actions | 1 week | ⏳ Not Started |
| 4 | Auto-Update System | 1 week | ⏳ Not Started |
| 5 | Security Features | 1 week | ⏳ Not Started |
| 6 | Polish & Testing | 1 week | ⏳ Not Started |
| **Total** | **MVP Complete** | **6 weeks** | **5% Done** |

## Current Status

**As of February 9, 2026:**
- Phase 0: ✅ Complete
- Phase 1: 🔄 40% (scaffold complete, implementing features)
- Next up: Phase 1A - Encrypted credential storage

## Success Metrics

**MVP Success:**
- [ ] Can manage 10+ servers easily
- [ ] SSH connections work reliably
- [ ] Quick actions save time
- [ ] Auto-update works smoothly
- [ ] App feels polished and professional
- [ ] Daily use ready

**Post-MVP Goals:**
- SFTP file transfer
- SSH tunnel management
- Server monitoring
- Command templates library
- Tablet optimization

---

**Last Updated:** February 9, 2026
**Current Phase:** Phase 1 - Core Storage & UI
**Next Milestone:** Phase 1A Complete