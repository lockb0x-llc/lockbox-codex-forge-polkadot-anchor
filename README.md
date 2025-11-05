1| # Lockb0x Codex Forge — Chrome Extension (Polkadot Anchor Fork)
2| 
3| ## Overview
4| 
5| This repository is a **fork** of the original Lockb0x Codex Forge Chrome Extension. In addition to the core lockb0x protocol, this fork extends functionality to support anchoring Codex Entries not only to Google Drive, but also to the Polkadot blockchain as a second source of digital provenance. It is focused on empowering verifiable, multi-chain codex entry creation in the Chrome browser extension workflow.
6| 
7| **Note on AI Features:** The extension currently uses fallback text extraction for metadata generation. Chrome Built-In AI features (e.g., `chrome.ai.summarizer`, `chrome.ai.prompt`) are referenced but not yet widely available.
8| 
9| ## Features
10| 
11| ### Implemented and Validated
12|  - **Lockb0x Protocol Core:** Complete implementation of UUID generation, SHA-256 hashing, ni-URI encoding, JSON canonicalization (RFC 8785), and ES256 signing
13|  - **File Upload Support:** Upload and anchor any file type (text, PDF, JSON, binary) to Google Drive or mock storage
14|  - **Zip Archive Workflow:** Payload and codex entry are packaged together in an encrypted, verifiable zip archive (see docs/ZIP-ARCHIVE.md)
15|  - **Google Drive Integration:** Secure zip archive storage, authentication, and token persistence in chrome.storage
16|  - **Dual Anchor Support:** Both mock (local) and Google Drive anchor flows fully functional
17|  - **Polkadot Blockchain Anchor:** (NEW in this fork) Codex entries can be anchored to the Polkadot blockchain using the extension workflow. Both Google and Polkadot identities are recorded in the entry, and anchors are stored together for multi-chain validation.
18|  - **Codex Entry Generation:** Complete workflow for hashing, canonicalizing, signing, anchoring, and validating entries
19|  - **Schema Validation:** Validation against lockb0x schema v0.0.2 runs before export, with feedback shown in popup
20|  - **Export Options:** Download codex entry and zip archive as JSON from popup UI
21|  - **Zip Archive Validation:** Existence validation in Drive before export, with download link shown if validated
22|  - **UI/UX:** Incremental stepper feedback, error messages, and recovery instructions for all workflow steps, now including new anchor selection options
23| 
24| ### Not Yet Implemented
25|  - **Chrome Built-In AI**: Chrome AI APIs (summarizer, prompt) are still experimental and not available in all Chrome releases. Currently using fallback text extraction for metadata generation.
26|  - **Polkadot extrinsic signing via @polkadot/api:** Current anchor implementation posts entries via RPC, but will be upgraded to signed extrinsics in future releases. See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md).
27| 
28| ## Current Status
29| 
30| ### Validated and Working ✓
31| - **Lockb0x Protocol Implementation:** All core protocol features (UUID, hashing, ni-URI, signing, canonicalization) are complete and validated
32| - **Zip Archive Workflow:** Payload and codex entry are packaged together in an encrypted, verifiable zip archive with dual signatures
33| - **Google Drive Integration:** Zip archive storage, anchor creation, and existence validation are robust and working
34| - **Mock Anchor Flow:** Local/offline anchor generation is fully functional
35| - **Polkadot Anchor Flow:** Polkadot transaction anchoring of integrity proofs is implemented; see [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md)
36| - **Schema Validation:** Codex entries validate against schema v0.0.2
37| - **UI/UX:** Complete workflow, incremental feedback, error handling, stepper status, anchor selection UI, and zip download capability
38| 
39| ### Known Gaps
40| - **Chrome Built-In AI:** Chrome AI APIs (summarizer, prompt) are still experimental and not widely available. Currently using fallback text extraction for metadata generation.
41| - **Polkadot extrinsic signing:** Polkadot anchor integration initially uses RPC submission for integrity proofs but will later add full extrinsic support.
42| 
43| ### Proof of Concept Status
44| The extension successfully demonstrates:
45| - ✓ Lockb0x protocol compliance (hashing, signing, anchoring, validation)
46| - ✓ Google Drive as a storage and anchor backend
47| - ✓ Polkadot chain anchor for digital provenance
48| - ✓ Codex entry creation, export, and schema validation
49| 
50| ## Installation & Usage
51| 
52| 1. Clone the repository.
53| 2. Run `npm install` to install dependencies.
54| 3. Add your Google OAuth client ID to `.env` (see `.env.example` for format).
55| 4. Run `npm run build-manifest` to generate `manifest.json`.
56| 5. Load the extension in Chrome via `chrome://extensions` (Developer Mode > Load unpacked).
57| 6. Use the popup to upload files, generate Codex entries, choose either Google Drive or Polkadot anchor, and export or validate as needed.
58| 
59| ## Secure Manifest & OAuth Client ID Handling
60| 
61| - `manifest.template.json` contains a placeholder `${CHROME_OAUTH_CLIENT_ID}`.
62| - Store your actual client ID in `.env` (not committed to source control).
63| - Run `npm run build-manifest` to generate `manifest.json` before packaging or loading the extension.
64| 
65| ## Contributor Guide
66| 
67| - When adding new anchor/storage types (including Polkadot), ensure existence validation is implemented and tested.
68| - Expand contributor guides and troubleshooting as new features are added.
69| 
70| ## Google Authentication Token Lifecycle & Usage
71| 
72| - The extension uses a single Google OAuth token for all Drive and profile operations.
73| - Token is stored in `chrome.storage.local` under the key `googleAuthToken`.
74| - Before any Google API call, the extension checks for a valid token and refreshes it if expired or missing.
75| - All token management logic is centralized in `lib/google-auth-utils.js`.
76| - UI elements and workflow steps always reflect the current authentication state.
77| 
78| ## Polkadot Authentication & Usage
79| 
80| - If the Polkadot anchor is selected, the extension will prompt for a Polkadot address to sign as createdBy.
81| - Polkadot anchors are created via RPC submission by default, recording integrity proofs.
82| - Future upgrades will support full extrinsic signing and identity assertion.
83| - See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for technical integration guide and code locations.
84| 
85| ## Troubleshooting
86| 
87| - Use Chrome DevTools for logs and error messages.
88| - Review status and error messages in the popup UI for feedback.
89| - For anchor and signing errors, see background.js logs.
90| - Common issues and solutions are documented in the README and AGENTS.md.
91| 
92| ## Roadmap
93| 
94| ### Next Milestone: Production Release
95| The Zip Archive workflow is now fully implemented and validated. Polkadot anchor flows are implemented in proof-of-concept form. Future releases will add signing support and UI refinements.
96| - ✓ Zip archiving for payloads (encrypted with user email or 'mock' password)
97| - ✓ Dual signature workflow (before and after zip upload)
98| - ✓ Lockb0x Codex Receipt and Proof Primitive file format
99| - ✓ Binary file upload support for all payloads
100| - ✓ Reliable Google auth token persistence
101| - ✓ Polkadot anchor MVP integration
102| - ✓ Improved error handling and UI feedback
103| 
104| ### Planned / In Progress
105| - Rollout of full Polkadot extrinsic signing using @polkadot/api
106| - Final release and publication on Google Marketplace
107| - Fork for Microsoft Edge and OneDrive integration
108| - **Testing Infrastructure:**
109|   - Verify test runner script to package.json
110|   - Verify test coverage for all modules and enhance or add as needed
111|   - Add integration tests for end-to-end workflows
112| - **Code Quality:**
113|   - Improve error handling consistency
114|   - Add JSDoc comments for better code documentation
115| - **UI/UX:**
116|   - Polkadot anchor selection and feedback in all flows
117|   - No further refinements or changes pending for Google anchor
118| - **Documentation:**
119|   - Expand contributor guides for Polkadot anchor setup and use
120|   - Create video tutorials and demos
121|   - Add Polkadot-related API documentation
122| 
123| ## Team Roles
124| 
125| **Project Lead:** Oversees development, documentation, roadmap, and release strategy.
126| - **AI Integration (PENDING):** Will implement and test Chrome Built-In AI APIs when available, including metadata generation and fallback logic.
127| - **Protocol Engineer:** Develops and tests protocol logic, anchor flows, schema validation, and blockchain enhancements
128| - **UI/UX Designer:** Designs popup UI, stepper, user flows, anchor type selectors, and feedback
129| - **Google Cloud Integration:** Handles Google anchor API, Drive integration, authentication, and token persistence
130| - **Blockchain & Polkadot Integration:** Integrates Polkadot anchor, identity capture, and extrinsic submission
131| - **QA & Testing:** Conducts user testing, feedback collection, and maintains test infrastructure
132| - **Documentation:** Updates README, contributor guides, troubleshooting, and verification instructions
133| 
134| ## Submission Checklist
135| 
136| - README includes elevator pitch, impact, competitive analysis, personas, use cases, demo, technical overview, and roadmap.
137| - Demo assets (screenshots, GIFs, video) are present.
138| - User feedback and testing summary included.
139| - Competitive analysis section completed.
140| - Roadmap for future development included.
141| - Documentation is organized and accessible for public.
142| 
143| ---
144| 
145| For more details, see:
146| - `docs/ZIP-ARCHIVE.md` for zip archive workflow and implementation details.
147| - `docs/DEVELOPMENT-PLAN.md` for technical milestones and roadmap.
148| - `docs/AGENTS.md` for team roles and assignments.
149| - `docs/GoogleCloudAnchor.md` for integration status and next steps.
150| - [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for blockchain anchoring workflow, code changes, and architectural additions specific to this fork
151| 
152| ## Workflow & Features
153| 
154| ### Codex Entry Generation & Multi-Anchor Integration
155| 
156| - **Upload File or Extract Page Content:** Select a file or extract content from the current web page.
157| - **Anchor Selection:** Choose between mock, Google, or Polkadot anchor. Sign in with Google for Drive integration or set Polkadot account for chain anchoring.
158| - **Zip Archive Creation, Encryption, and Signature:** The extension creates an encrypted zip archive containing:
159|   - Your uploaded file or extracted content (original filename preserved)
160|   - A codex-entry.json file with metadata and selected anchor(s)
161|   - Archive-level comment with full codex entry for provenance
162| - **Polkadot Integrity Anchoring:** Anchor integrity proofs on Polkadot via RPC (future: signed extrinsic).
163| - **UI Feedback:** Selected anchor type is visible, with Polkadot address display and authentication feedback.
164| - **Export & Verification:** Download Codex entry as JSON, download encrypted zip, validate anchor existence, copy Codex entry to clipboard, view schema and anchor validation results in popup.
165| 
166| ## Verification Instructions
167| 
168| - Download the encrypted zip archive from the Drive link or popup
169| - Extract the archive using the password
170| - Verify the payload file matches the original
171| - Compare the codex-entry.json in the zip with the final codex entry (should match except for storage.location, anchor.tx, anchor.url)
172| - Verify the archive-level comment contains the full final codex entry
173| - Compute the SHA-256 hash of the payload and compare to integrity_proof
174| - Confirm anchor file(s) exist and match metadata
175| - Validate ES256 signatures using the JWK in kid
176| - Use provided verification script or tool for automated checks
177| - Confirm multi-anchor validations where applicable (Google + Polkadot)
178| 
179| ## Troubleshooting & Support
180| 
181| See [docs/AGENTS.md](docs/AGENTS.md), [docs/GoogleCloudAnchor.md](docs/GoogleCloudAnchor.md), and [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for action plans, debugging, and integration status.
182| Use Chrome DevTools for logs and error messages
183| Review status and error messages in the popup UI for feedback
184| For anchor and signing errors, see background.js logs
185| Refer to [docs/DEVELOPMENT-PLAN.md](docs/DEVELOPMENT-PLAN.md) for current gaps and next steps
186| 
187| ## Documentation & Contribution
188| 
189| See [docs/DEVELOPMENT-PLAN.md](docs/DEVELOPMENT-PLAN.md) for implementation roadmap
190| See [docs/GoogleCloudAnchor.md](docs/GoogleCloudAnchor.md) for integration status and next steps
191| See [docs/AGENTS.md](docs/AGENTS.md) for team roles and assignments
192| See [docs/polkadot-enhancement.md](docs/polkadot-enhancement.md) for blockchain anchor integration details
193| Pull requests and feedback are welcome!
194| 
195| ---
196| 
197| Lockb0x Codex Forge — Secure, multi-chain, AI-powered, and ready for the future of digital provenance.
