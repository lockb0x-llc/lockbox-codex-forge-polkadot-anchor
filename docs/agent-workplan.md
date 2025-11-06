# Agent Workplan — Lockb0x Codex Forge Extended Workflow

## Overview

This document outlines the complete agent-driven workflow for the Lockb0x Codex Forge Chrome Extension, including the extended capabilities for Google Drive file upload, codex preloading, and Polkadot blockchain anchoring from the popup interface (index.html/popup.html).

**Document Purpose:**
- Provide technical direction for agent-driven development and maintenance
- Define implementation milestones and QA criteria for the extended workflow
- Ensure collaborative team and agent-driven maintenance patterns
- Preserve and document legacy anchor options (Mock, Google Drive) alongside new Polkadot capabilities

---

## Extended Workflow Architecture

### Three-Tier Anchor System

The extension supports three anchor types, each providing different levels of provenance and persistence:

1. **Mock Anchor (Legacy)** - Local/offline development and testing
2. **Google Drive Anchor (Legacy)** - Cloud storage with OAuth authentication
3. **Polkadot Blockchain Anchor (NEW)** - Decentralized blockchain provenance via PAPI

**Design Principle:** New flows extend rather than replace existing options. All three anchor types remain fully functional and user-selectable.

---

## Complete User Workflow

### Phase 1: Content Selection (Step 1)

**User Actions:**
- Upload a file via file input (supports: text, PDF, JSON, binary, images, documents, archives)
- OR extract content from current web page via "Extract Page Content" button

**Technical Implementation:**
- File upload handled by `popup.js` → `background.js` message passing
- Page extraction uses Chrome tabs API and content extraction utilities
- Large files (>4MB) use chunked upload strategy
- See: `popup/popup.js`, `lib/file-utils.js`

---

### Phase 2: Anchor Selection (Step 2)

**User Actions:**
- Select anchor type from dropdown: Mock, Google, or Polkadot
- If Google: Click "Sign in with Google" → OAuth flow → token persistence
- If Polkadot: Click "Connect Polkadot Account" → enter address/name → profile storage

**Technical Implementation:**
- Anchor type selection stored in `anchorType` dropdown value
- Google authentication via `lib/google-auth-utils.js`
  - OAuth flow with Chrome identity API
  - Token stored in `chrome.storage.local` under `googleAuthToken`
  - User profile retrieved and cached
- Polkadot authentication via `lib/polkadot-utils.js`
  - User enters substrate address (47-48 characters)
  - Optional display name for UX
  - Profile stored in `chrome.storage.local` under `polkadotProfile`
  - No private keys stored (future wallet integration planned)
- Auth status display updates dynamically based on selected anchor type
- See: `popup/popup.js`, `popup/popup.html`, `lib/google-auth-utils.js`, `lib/polkadot-utils.js`

---

### Phase 3: Codex Entry Generation (Step 3)

**User Actions:**
- Click "Generate Codex Entry" button
- Wait for processing (loading indicator shown)
- Review results: entry details, schema validation, anchor confirmation

**Technical Implementation:**

#### 3.1 Protocol Operations (lib/protocol.js)
- **UUID Generation:** UUIDv4 for unique entry identifier
- **Hashing:** SHA-256 hash of file content
- **ni-URI Encoding:** Named Information URI format for content addressing
- **Canonicalization:** RFC 8785 JSON canonicalization for deterministic serialization
- **ES256 Signing:** Cryptographic signature generation with JWK

#### 3.2 Zip Archive Creation (lib/zip-archive.js)
- Encrypt payload and codex entry into zip archive
- Password derived from user identity:
  - Google: user email address
  - Mock: literal string "mock"
  - Polkadot: currently "mock" (future: address-derived key)
- Archive structure:
  - Original file (preserved filename)
  - `codex-entry.json` (metadata and anchor details)
  - Archive-level comment with full provenance
- Dual signature workflow (before and after zip upload)

#### 3.3 Anchor Processing (background.js)

**Mock Anchor Flow:**
- Generate deterministic mock anchor locally
- No external API calls
- Immediate completion
- Returns: `{ chain: "mock", tx: "mock-tx-...", timestamp, ... }`

**Google Drive Anchor Flow:**
- Upload zip archive to Google Drive via REST API
- Create anchor file with metadata
- Retrieve file ID and shareable link
- Update codex entry with storage location
- Returns: `{ chain: "google", tx: "drive-file-...", url: "...", ... }`
- See: `lib/google-drive.js`, `background.js`

**Polkadot Blockchain Anchor Flow (PAPI):**
- Initialize Smoldot light client (WebAssembly-based)
- Connect to Polkadot relay chain (decentralized, no RPC required)
- Retrieve finalized block hash and number from real chain
- Prepare anchor payload for future system.remark extrinsic
- Graceful fallback to deterministic mock if:
  - Network unavailable (offline)
  - Connection timeout (2s test mode, 8s production)
  - PAPI initialization failure
- Returns: `{ chain: "polkadot:relay", tx: "...", blockHash: "0x...", blockNumber: N, url: "...", ... }`
- See: `lib/polkadot-utils.js`, `lib/protocol.js`, `docs/PAPI-IMPLEMENTATION.md`, `docs/polkadot-enhancement.md`

#### 3.4 Identity Integration (createdBy)
- **Mock:** `{ type: "mock" }`
- **Google:** `{ type: "google", email: "...", name: "...", picture: "..." }`
- **Polkadot:** `{ type: "polkadot", address: "...", name: "..." }`
- Identity merged into final codex entry
- Multi-anchor support: future versions may include multiple identities and anchors

---

### Phase 4: Export and Validation (Step 4)

**User Actions:**
- Download codex entry as JSON
- Download encrypted zip archive
- Copy codex entry to clipboard
- Validate schema compliance
- Validate anchor existence (Google Drive only currently)
- View anchor details and explorer links (Polkadot)

**Technical Implementation:**
- Schema validation against lockb0x schema v0.0.2
- JSON export with proper formatting
- Zip download via blob URL
- Clipboard API for entry copying
- Drive file existence check via HEAD request
- UI displays validation results, errors, and recovery steps
- See: `popup/popup.js`, `popup/popup-ui.js`, `lib/validate.js`, `lib/codex-ui-utils.js`

---

## Implementation Milestones

### Milestone 1: Core Protocol (✓ Complete)
- [x] UUID generation (UUIDv4)
- [x] SHA-256 hashing
- [x] ni-URI encoding
- [x] JSON canonicalization (RFC 8785)
- [x] ES256 signing with JWK
- [x] Schema validation (v0.0.2)

### Milestone 2: Legacy Anchor Support (✓ Complete)
- [x] Mock anchor implementation
- [x] Google Drive OAuth integration
- [x] Google Drive file upload
- [x] Google Drive anchor creation
- [x] Token persistence and refresh
- [x] Drive file existence validation

### Milestone 3: Zip Archive Workflow (✓ Complete)
- [x] Zip creation with JSZip
- [x] Password-based encryption
- [x] Archive-level provenance comments
- [x] Dual signature (pre/post upload)
- [x] Binary file support
- [x] Large file chunking (>4MB)

### Milestone 4: Polkadot Blockchain Integration (✓ Complete - MVP)
- [x] PAPI integration (v1.20.1)
- [x] Smoldot light client (v2.0.39)
- [x] Real blockchain connectivity (Polkadot relay chain)
- [x] Finalized block retrieval
- [x] Graceful fallback to mock mode
- [x] Polkadot profile storage
- [x] UI for account connection
- [x] Address validation (substrate format)
- [x] Explorer URL generation
- [x] Anchor payload preparation
- [ ] **Planned:** Wallet integration (Polkadot.js, Talisman, SubWallet)
- [ ] **Planned:** Transaction signing
- [ ] **Planned:** system.remark extrinsic submission
- [ ] **Planned:** Real tx hash in anchor.tx field

### Milestone 5: UI/UX Polish (✓ Complete)
- [x] Step-by-step workflow with fieldsets
- [x] Anchor type selector
- [x] Google Sign-In button
- [x] Polkadot Connect button
- [x] Dynamic auth status display
- [x] Loading indicators
- [x] Error messages and recovery instructions
- [x] Schema validation feedback
- [x] Export/download buttons
- [x] Clipboard copy functionality

### Milestone 6: Testing Infrastructure (✓ Complete)
- [x] Unit tests for all core modules
- [x] Protocol tests (hashing, signing, canonicalization)
- [x] Google auth tests
- [x] Polkadot utils tests (PAPI, profile storage)
- [x] Zip archive tests
- [x] File utils tests
- [x] Validation tests
- [x] UI utils tests
- [x] Test runner configuration (Vitest)
- [x] Environment-aware timeouts (test vs production)

### Milestone 7: Documentation (✓ Complete)
- [x] README.md with overview and usage
- [x] AGENTS.md with team roles and status
- [x] DEVELOPMENT-PLAN.md with roadmap
- [x] ZIP-ARCHIVE.md with workflow details
- [x] polkadot-enhancement.md with integration guide
- [x] PAPI-IMPLEMENTATION.md with technical details
- [x] **NEW:** agent-workplan.md (this document)

---

## QA Criteria and Validation

### Functional Testing

**Mock Anchor:**
- [ ] Select Mock anchor type
- [ ] Upload any file type
- [ ] Generate codex entry
- [ ] Verify entry contains mock anchor details
- [ ] Verify createdBy.type === "mock"
- [ ] Download and extract zip archive
- [ ] Verify password is "mock"

**Google Drive Anchor:**
- [ ] Select Google anchor type
- [ ] Sign in with Google (OAuth flow)
- [ ] Verify auth status shows email
- [ ] Upload file
- [ ] Generate codex entry
- [ ] Verify zip uploaded to Drive
- [ ] Verify createdBy contains Google profile
- [ ] Validate anchor existence
- [ ] Download zip from Drive link
- [ ] Verify password is user email

**Polkadot Blockchain Anchor:**
- [ ] Select Polkadot anchor type
- [ ] Click Connect Polkadot Account
- [ ] Enter valid substrate address (47-48 chars)
- [ ] Enter optional name
- [ ] Verify connection status shows address
- [ ] Upload file
- [ ] Generate codex entry
- [ ] Verify entry contains Polkadot anchor with:
  - [ ] chain: "polkadot:relay"
  - [ ] tx: transaction hash
  - [ ] blockHash: "0x..." (real or deterministic mock)
  - [ ] blockNumber: integer
  - [ ] url: explorer link
  - [ ] timestamp: ISO 8601
- [ ] Verify createdBy.type === "polkadot"
- [ ] Verify createdBy.address matches entered address
- [ ] Click explorer URL and verify it loads (when online)

### Integration Testing

**File Types:**
- [ ] Text files (.txt, .md, .html, .csv)
- [ ] JSON files (.json)
- [ ] PDF files (.pdf)
- [ ] Images (.png, .jpg, .jpeg)
- [ ] Documents (.docx, .xlsx, .pptx)
- [ ] Archives (.zip, .rar, .tar, .gz)
- [ ] Audio/Video (.mp3, .mp4)
- [ ] Binary files (arbitrary)

**Large Files:**
- [ ] Files < 1MB (direct upload)
- [ ] Files 1-4MB (direct upload)
- [ ] Files > 4MB (chunked upload)
- [ ] Files > 10MB (stress test)

**Schema Validation:**
- [ ] Valid codex entry passes validation
- [ ] Invalid entry shows error messages
- [ ] Schema errors displayed in popup
- [ ] User can review and fix issues

**Error Handling:**
- [ ] Network offline: graceful fallback for Polkadot
- [ ] Invalid credentials: clear error for Google
- [ ] Upload failure: retry instructions
- [ ] Timeout handling: PAPI falls back to mock
- [ ] Invalid address: Polkadot validation error

### Security Testing

**Authentication:**
- [ ] Google token stored securely in chrome.storage
- [ ] Token refresh works correctly
- [ ] Logout clears token
- [ ] Polkadot profile stored securely
- [ ] No private keys stored locally

**Cryptography:**
- [ ] ES256 signatures verify correctly
- [ ] SHA-256 hashes match content
- [ ] Zip encryption works with correct password
- [ ] Zip decryption fails with wrong password

**Data Privacy:**
- [ ] No sensitive data logged to console
- [ ] No credentials in error messages
- [ ] No PII leaked in URLs or requests

### Performance Testing

**Speed:**
- [ ] Small files (<1MB): < 2 seconds total
- [ ] Medium files (1-4MB): < 5 seconds total
- [ ] Large files (>4MB): < 10 seconds total
- [ ] Polkadot anchor (online): < 10 seconds
- [ ] Polkadot anchor (offline): < 3 seconds (fallback)

**Resource Usage:**
- [ ] Memory usage stable (no leaks)
- [ ] Smoldot cleanup after use
- [ ] No orphaned timeouts or subscriptions
- [ ] Extension remains responsive during operations

---

## Agent-Driven Development Patterns

### Collaborative Maintenance

**Agent Roles:**
1. **Protocol Agent:** Maintains core protocol logic, hashing, signing, canonicalization
2. **Google Integration Agent:** Maintains OAuth, Drive API, token management
3. **Polkadot Integration Agent:** Maintains PAPI, light client, anchor logic
4. **UI/UX Agent:** Maintains popup interface, user flows, feedback
5. **Testing Agent:** Maintains test suites, CI/CD, validation
6. **Documentation Agent:** Maintains all .md files, keeps docs in sync

**Collaboration Guidelines:**
- Each agent works within defined scope
- Cross-references between docs maintained via relative links
- Changes in one area trigger doc updates in related areas
- All agents reference this workplan for big-picture understanding

### Future Enhancement Workflow

**Adding New Features:**
1. Update this workplan with new milestone
2. Reference affected modules and files
3. Define QA criteria for new feature
4. Update related documentation (README, AGENTS, etc.)
5. Implement with tests
6. Validate against QA criteria
7. Update changelog in all affected docs

**Example: Adding Wallet Integration**
- Milestone 8: Wallet Integration
  - Add Polkadot.js extension connector
  - Update UI with wallet selection
  - Implement account selection from wallet
  - Remove manual address entry (optional fallback)
  - Update tests for wallet scenarios
  - Update docs: this file, polkadot-enhancement.md, PAPI-IMPLEMENTATION.md, README.md

---

## Code Location Reference

### Core Modules
- **Protocol Logic:** `lib/protocol.js`
- **Google Auth:** `lib/google-auth-utils.js`
- **Google Drive:** `lib/google-drive.js`
- **Polkadot Utils:** `lib/polkadot-utils.js`
- **Zip Archive:** `lib/zip-archive.js`
- **File Utils:** `lib/file-utils.js`
- **Validation:** `lib/validate.js`
- **Codex UI Utils:** `lib/codex-ui-utils.js`

### UI Components
- **Popup HTML:** `popup/popup.html`
- **Popup JS:** `popup/popup.js`
- **Popup UI:** `popup/popup-ui.js`
- **Popup CSS:** `popup/popup.css`

### Background Services
- **Background Worker:** `background.js`
- **Small File Handler:** (delegated from background.js)
- **Large File Handler:** (delegated from background.js)

### Configuration
- **Manifest Template:** `manifest.template.json`
- **Manifest Builder:** `build-manifest.js`
- **Environment Variables:** `.env` (from `.env.example`)

### Documentation
- **Main README:** `README.md`
- **Agent Workplan:** `docs/agent-workplan.md` (this file)
- **Team Roles:** `docs/AGENTS.md`
- **Development Plan:** `docs/DEVELOPMENT-PLAN.md`
- **Zip Workflow:** `docs/ZIP-ARCHIVE.md`
- **Polkadot Integration:** `docs/polkadot-enhancement.md`
- **PAPI Technical Guide:** `docs/PAPI-IMPLEMENTATION.md`

---

## Changelog and Version History

**Version 1.0.0 (Current):**
- Complete lockb0x protocol implementation
- Google Drive anchor (legacy, fully functional)
- Mock anchor (legacy, fully functional)
- Polkadot blockchain anchor (MVP with PAPI light client)
- Zip archive workflow with encryption
- Schema validation (v0.0.2)
- Comprehensive test suite
- Full documentation suite including this agent workplan

**Planned Version 1.1.0:**
- Polkadot wallet integration
- Transaction signing
- system.remark extrinsic submission
- Real on-chain tx hashes
- Enhanced UI for wallet connection
- Expanded test coverage for wallet scenarios

**Planned Version 2.0.0:**
- Multi-anchor support (multiple anchors per entry)
- Additional blockchain support (Ethereum, Bitcoin)
- Advanced metadata generation (when Chrome AI available)
- Marketplace publication
- Edge browser fork with OneDrive integration

---

## Conclusion

This agent workplan provides the technical foundation for collaborative, agent-driven development of the Lockb0x Codex Forge Chrome Extension. The extended workflow seamlessly integrates Google Drive file upload, codex preloading, and Polkadot blockchain anchoring while preserving all legacy anchor options.

**Key Takeaways:**
- Three-tier anchor system: Mock (legacy), Google (legacy), Polkadot (new)
- All flows are extensions, not replacements
- Complete workflow: upload → authenticate → generate → export
- PAPI-based Polkadot integration with graceful fallback
- Comprehensive QA criteria for all scenarios
- Agent collaboration patterns for maintenance
- Clear code location reference for all components

For specific technical details, see referenced documentation files. For team roles and assignments, see `docs/AGENTS.md`. For implementation roadmap, see `docs/DEVELOPMENT-PLAN.md`.
