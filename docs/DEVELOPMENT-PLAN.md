# Lockb0x Codex Forge — Development Plan (Polkadot Anchor Fork)

## Project Goal

Extend the Lockb0x Codex Forge Chrome Extension to support multi-chain anchoring, specifically integrating the Polkadot blockchain alongside the original Google Drive backend.

---

## Current Status & Milestones (Updated 2025-11-05)

### Completed Features ✓
- Lockb0x Protocol Core: UUIDv4 generation, SHA-256 hashing, ni-URI encoding, RFC canonicalization, ES256 signing.
- Codex Entry workflow: upload, hash/sign, anchor, export, schema validation.
- Zip Archive workflow: encrypted archive, provenance comment, dual signature.
- Google and Mock Anchors: local and Drive-based workflows.
- **Polkadot Blockchain Anchor:** Extension now supports anchoring integrity proofs to Polkadot with address/account info in Codex Entry. See [polkadot-enhancement.md](./polkadot-enhancement.md).

---

### Not Implemented ✗
- Chrome Built-In AI: (experimental).
- Full Polkadot extrinsic signing: Next milestone for blockchain anchoring; currently, RPC submissions are used for integrity proofs. Full extrinsics will require @polkadot/api integration.

---

## In Progress / Next Steps

1. **Polkadot Anchor Enhancement:**
   - Complete signed extrinsic support in `anchorPolkadot()` ([see guide](./polkadot-enhancement.md)).
   - Add Codex Entry multi-anchor support with both Google and Polkadot anchor details.
   - Enhance UI workflow for account entry, selection, and feedback.
   - Expand test coverage for Polkadot anchor and extrinsic validation.

2. **Documentation & Contributor Guides:**
   - All dev and onboarding docs must mention this repo’s fork and Polkadot enhancements.
   - Reference [polkadot-enhancement.md](./polkadot-enhancement.md) in anchor-specific sections.

---

## Roadmap & Remaining Gaps

### Phase 1: Zip Archive Implementation (Complete ✓)
### Phase 2: Code Quality & Testing (Current)
### Phase 3: **Multi-Chain Production Polish (Next)**
- Marketplace polish.
- Security audit.
- **Polkadot anchor upgrade: signed extrinsic submission, advanced identity capture, UI/UX improvements.**
- Expanded documentation and tutorials across both chains.

---

## Unified Implementation Checklist

### Core Features (Complete ✓)
- File upload, schema validation, export, zip archive creation/encryption, Google/Mock/Polkadot anchor support.
- Multi-anchor support in Codex Entries; account info for both Google and Polkadot.

### Documentation (In Progress)
- README and /docs reflect fork status and multi-chain anchor integration.

### Code Quality
- Further linting and extrinsic tests needed for blockchain flows.

---

## Technical Milestones

### Blockchain Anchor Integration
- Integrate `anchorPolkadot(entry, polkadotAccount)` (see [polkadot-enhancement.md](./polkadot-enhancement.md)) with RPC and future extrinsic support.
- Update background.js, protocol.js, and popup.js to support anchor type option, account storage, finalized Codex Entry building, and UI feedback.

---

## Team Assignments

Refer to [AGENTS.md](./AGENTS.md) for updated roles covering both Google and Polkadot anchor flows.

---

## Reference and Contributor Onboarding

For all architectural, workflow, and UI code enhancements regarding the Polkadot blockchain anchor, see and follow [polkadot-enhancement.md](./polkadot-enhancement.md).