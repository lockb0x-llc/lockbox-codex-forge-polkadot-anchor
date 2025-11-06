# Lockb0x Codex Forge — Chrome Extension (Polkadot Anchor Fork)

> **Changelog:** Extended workflow documentation added—see [docs/agent-workplan.md](docs/agent-workplan.md) for complete agent-driven development guide covering Google Drive upload, codex preloading, and Polkadot anchor integration.

## Overview

This repository is a **fork** of the original Lockb0x Codex Forge Chrome Extension. In addition to the core lockb0x protocol, this fork extends functionality to support anchoring Codex Entries not only to Google Drive, but also to the Polkadot blockchain as a second source of digital provenance. It is focused on empowering verifiable, multi-chain codex entry creation in the Chrome browser extension workflow.

**Note on AI Features:** The extension currently uses fallback text extraction for metadata generation. Chrome Built-In AI features (e.g., `chrome.ai.summarizer`, `chrome.ai.prompt`) are referenced but not yet widely available.

## Features

### Implemented and Validated
 - **Lockb0x Protocol Core:** Complete implementation of UUID generation, SHA-256 hashing, ni-URI encoding, JSON canonicalization (RFC 8785), and ES256 signing
 - **File Upload Support:** Upload and anchor any file type (text, PDF, JSON, binary) to Google Drive or mock storage
 - **Zip Archive Workflow:** Payload and codex entry are packaged together in an encrypted, verifiable zip archive (see docs/ZIP-ARCHIVE.md)
 - **Google Drive Integration:** Secure zip archive storage, authentication, and token persistence in chrome.storage
 - **Dual Anchor Support:** Both mock (local) and Google Drive anchor flows fully functional
 - **Polkadot Blockchain Anchor:** (NEW in this fork) Codex entries can be anchored to the Polkadot blockchain using the extension workflow. Both Google and Polkadot identities are recorded in the entry, and anchors are stored together for multi-chain validation.
 - **Codex Entry Generation:** Complete workflow for hashing, canonicalizing, signing, anchoring, and validating entries
 - **Schema Validation:** Validation against lockb0x schema v0.0.2 runs before export, with feedback shown in popup
 - **Export Options:** Download codex entry and zip archive as JSON from popup UI
 - **Zip Archive Validation:** Existence validation in Drive before export, with download link shown if validated
 - **UI/UX:** Incremental stepper feedback, error messages, and recovery instructions for all workflow steps, now including new anchor selection options

### Not Yet Implemented
 - **Chrome Built-In AI**: Chrome AI APIs (summarizer, prompt) are still experimental and not available in all Chrome releases. Currently using fallback text extraction for metadata generation.
 - **Polkadot extrinsic signing:** Current PAPI implementation retrieves real blockchain data but does not yet submit signed extrinsics. Future releases will add full transaction signing and submission via system.remark. See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md).

## Current Status

### Validated and Working ✓
- **Lockb0x Protocol Implementation:** All core protocol features (UUID, hashing, ni-URI, signing, canonicalization) are complete and validated
- **Zip Archive Workflow:** Payload and codex entry are packaged together in an encrypted, verifiable zip archive with dual signatures
- **Google Drive Integration:** Zip archive storage, anchor creation, and existence validation are robust and working
- **Mock Anchor Flow:** Local/offline anchor generation is fully functional
- **Polkadot Anchor Flow:** Uses modern Polkadot API (PAPI) with Smoldot light client for decentralized blockchain interaction. Connects to real Polkadot relay chain, retrieves finalized block data, and gracefully falls back to mock mode when offline. See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md)
- **Schema Validation:** Codex entries validate against schema v0.0.2
- **UI/UX:** Complete workflow, incremental feedback, error handling, stepper status, anchor selection UI, and zip download capability

### Known Gaps
- **Chrome Built-In AI:** Chrome AI APIs (summarizer, prompt) are still experimental and not widely available. Currently using fallback text extraction for metadata generation.
- **Polkadot extrinsic signing:** PAPI implementation retrieves real blockchain data but does not yet submit signed extrinsics. Future releases will add transaction signing and on-chain submission.

### Proof of Concept Status
The extension successfully demonstrates:
- ✓ Lockb0x protocol compliance (hashing, signing, anchoring, validation)
- ✓ Google Drive as a storage and anchor backend
- ✓ Polkadot chain anchor for digital provenance
- ✓ Codex entry creation, export, and schema validation

## Installation & Usage

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Add your Google OAuth client ID to `.env` (see `.env.example` for format).
4. Run `npm run build-manifest` to generate `manifest.json`.
5. Load the extension in Chrome via `chrome://extensions` (Developer Mode > Load unpacked).
6. Use the popup to upload files, generate Codex entries, choose either Google Drive or Polkadot anchor, and export or validate as needed.

## Secure Manifest & OAuth Client ID Handling

- `manifest.template.json` contains a placeholder `${CHROME_OAUTH_CLIENT_ID}`.
- Store your actual client ID in `.env` (not committed to source control).
- Run `npm run build-manifest` to generate `manifest.json` before packaging or loading the extension.

## Contributor Guide

- When adding new anchor/storage types (including Polkadot), ensure existence validation is implemented and tested.
- Expand contributor guides and troubleshooting as new features are added.

## Google Authentication Token Lifecycle & Usage

- The extension uses a single Google OAuth token for all Drive and profile operations.
- Token is stored in `chrome.storage.local` under the key `googleAuthToken`.
- Before any Google API call, the extension checks for a valid token and refreshes it if expired or missing.
- All token management logic is centralized in `lib/google-auth-utils.js`.
- UI elements and workflow steps always reflect the current authentication state.

## Polkadot Authentication & Usage

- The extension now supports Polkadot blockchain anchoring as an alternative to Google Drive.
- **Implementation**: Uses modern Polkadot API (PAPI) with Smoldot light client for decentralized blockchain interaction.
- To use Polkadot anchoring:
  1. Select "Polkadot Anchor" from the anchor type dropdown in the popup
  2. Click "Connect Polkadot Account" button
  3. Enter your Polkadot account address (47-48 character substrate address)
  4. Optionally provide an account name for display
  5. Generate your Codex entry - it will be anchored to the Polkadot relay chain
- Polkadot anchors include:
  - Transaction hash (tx) - unique identifier for the anchor
  - Block hash - hash of the block containing the anchor (real block data when online)
  - Block number - block number where the anchor was recorded (real block number when online)
  - Chain identifier - "polkadot:relay" following CAIP-2 format
  - Explorer URL - link to view the transaction on polkadot.js.org
- **PAPI Implementation Details**:
  - Uses Polkadot API (PAPI) v1.20.1 with Smoldot light client v2.0.39
  - Connects to real Polkadot relay chain via decentralized light client (no RPC required)
  - Retrieves actual finalized block data when network connection is available
  - Falls back gracefully to deterministic mock mode when offline or connection times out
  - Timeout: 2 seconds in test mode, 8 seconds in production mode
  - Anchor payload prepared for future system.remark extrinsic submission
- Future upgrades will support full extrinsic signing for on-chain transaction submission
- See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for technical integration guide and code locations.

## Troubleshooting

- Use Chrome DevTools for logs and error messages.
- Review status and error messages in the popup UI for feedback.
- For anchor and signing errors, see background.js logs.
- Common issues and solutions are documented in the README and AGENTS.md.

## Roadmap

### Next Milestone: Production Release
The Zip Archive workflow is now fully implemented and validated. Polkadot anchor flows are implemented in proof-of-concept form. Future releases will add signing support and UI refinements.
- ✓ Zip archiving for payloads (encrypted with user email or 'mock' password)
- ✓ Dual signature workflow (before and after zip upload)
- ✓ Lockb0x Codex Receipt and Proof Primitive file format
- ✓ Binary file upload support for all payloads
- ✓ Reliable Google auth token persistence
- ✓ Polkadot anchor MVP integration
- ✓ Improved error handling and UI feedback

### Planned / In Progress
- Rollout of full Polkadot extrinsic signing using @polkadot/api
- Final release and publication on Google Marketplace
- Fork for Microsoft Edge and OneDrive integration
- **Testing Infrastructure:**
  - Verify test runner script to package.json
  - Verify test coverage for all modules and enhance or add as needed
  - Add integration tests for end-to-end workflows
- **Code Quality:**
  - Improve error handling consistency
  - Add JSDoc comments for better code documentation
- **UI/UX:**
  - Polkadot anchor selection and feedback in all flows
  - No further refinements or changes pending for Google anchor
- **Documentation:**
  - Expand contributor guides for Polkadot anchor setup and use
  - Create video tutorials and demos
  - Add Polkadot-related API documentation

## Team Roles

**Project Lead:** Oversees development, documentation, roadmap, and release strategy.
- **AI Integration (PENDING):** Will implement and test Chrome Built-In AI APIs when available, including metadata generation and fallback logic.
- **Protocol Engineer:** Develops and tests protocol logic, anchor flows, schema validation, and blockchain enhancements
- **UI/UX Designer:** Designs popup UI, stepper, user flows, anchor type selectors, and feedback
- **Google Cloud Integration:** Handles Google anchor API, Drive integration, authentication, and token persistence
- **Blockchain & Polkadot Integration:** Integrates Polkadot anchor, identity capture, and extrinsic submission
- **QA & Testing:** Conducts user testing, feedback collection, and maintains test infrastructure
- **Documentation:** Updates README, contributor guides, troubleshooting, and verification instructions

## Submission Checklist

- README includes elevator pitch, impact, competitive analysis, personas, use cases, demo, technical overview, and roadmap.
- Demo assets (screenshots, GIFs, video) are present.
- User feedback and testing summary included.
- Competitive analysis section completed.
- Roadmap for future development included.
- Documentation is organized and accessible for public.

---

For more details, see:
- **`docs/agent-workplan.md` for complete agent-driven workflow guide, implementation milestones, and QA criteria**
- `docs/ZIP-ARCHIVE.md` for zip archive workflow and implementation details.
- `docs/DEVELOPMENT-PLAN.md` for technical milestones and roadmap.
- `docs/AGENTS.md` for team roles and assignments.
- `docs/GoogleCloudAnchor.md` for integration status and next steps.
- [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for blockchain anchoring workflow, code changes, and architectural additions specific to this fork

## Workflow & Features

### Codex Entry Generation & Multi-Anchor Integration

- **Upload File or Extract Page Content:** Select a file or extract content from the current web page.
- **Anchor Selection:** Choose between mock, Google, or Polkadot anchor. Sign in with Google for Drive integration or set Polkadot account for chain anchoring.
- **Zip Archive Creation, Encryption, and Signature:** The extension creates an encrypted zip archive containing:
  - Your uploaded file or extracted content (original filename preserved)
  - A codex-entry.json file with metadata and selected anchor(s)
  - Archive-level comment with full codex entry for provenance
- **Polkadot Integrity Anchoring:** Anchor integrity proofs on Polkadot via RPC (future: signed extrinsic).
- **UI Feedback:** Selected anchor type is visible, with Polkadot address display and authentication feedback.
- **Export & Verification:** Download Codex entry as JSON, download encrypted zip, validate anchor existence, copy Codex entry to clipboard, view schema and anchor validation results in popup.

## Verification Instructions

- Download the encrypted zip archive from the Drive link or popup
- Extract the archive using the password
- Verify the payload file matches the original
- Compare the codex-entry.json in the zip with the final codex entry (should match except for storage.location, anchor.tx, anchor.url)
- Verify the archive-level comment contains the full final codex entry
- Compute the SHA-256 hash of the payload and compare to integrity_proof
- Confirm anchor file(s) exist and match metadata
- Validate ES256 signatures using the JWK in kid
- Use provided verification script or tool for automated checks
- Confirm multi-anchor validations where applicable (Google + Polkadot)

## Troubleshooting & Support

See [docs/AGENTS.md](docs/AGENTS.md), [docs/GoogleCloudAnchor.md](docs/GoogleCloudAnchor.md), and [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for action plans, debugging, and integration status.
Use Chrome DevTools for logs and error messages
Review status and error messages in the popup UI for feedback
For anchor and signing errors, see background.js logs
Refer to [docs/DEVELOPMENT-PLAN.md](docs/DEVELOPMENT-PLAN.md) for current gaps and next steps

## Documentation & Contribution

See [docs/DEVELOPMENT-PLAN.md](docs/DEVELOPMENT-PLAN.md) for implementation roadmap
See [docs/GoogleCloudAnchor.md](docs/GoogleCloudAnchor.md) for integration status and next steps
See [docs/AGENTS.md](docs/AGENTS.md) for team roles and assignments
See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for blockchain anchor integration details
Pull requests and feedback are welcome!

---

Lockb0x Codex Forge — Secure, multi-chain, AI-powered, and ready for the future of digital provenance.
