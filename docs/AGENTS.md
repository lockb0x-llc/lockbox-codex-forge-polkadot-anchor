# AGENTS.md — Code Review & Action Plan for Lockb0x Codex Forge (Polkadot Anchor Fork)

> **Changelog:** Documentation updated with agent-workplan.md reference—see [agent-workplan.md](./agent-workplan.md) for complete technical direction on the extended workflow including Google Drive upload, codex preloading, and Polkadot anchor integration.

## Status Summary (Updated 2025-11-05)

- See [README.md](../README.md) for current features, troubleshooting, and user guidance.
- See [agent-workplan.md](./agent-workplan.md) for complete agent-driven workflow guide, implementation milestones, and QA criteria.
- See [ZIP-ARCHIVE.md](./ZIP-ARCHIVE.md) for zip archive workflow and implementation details.
- See [DEVELOPMENT-PLAN.md](./DEVELOPMENT-PLAN.md) for architecture, phased breakdown, and build status.
- **See [polkadot-enhancement.md](./polkadot-enhancement.md) for Polkadot blockchain anchoring integration.**

---

### What’s Working ✓

- **Lockb0x Protocol Core:** UUID generation, SHA-256 hashing, ni-URI encoding, JSON canonicalization (RFC 8785), ES256 signing.
- **Google Drive Integration:** Payload storage, anchor creation, authentication, token persistence, existence validation.
- **Mock Anchor Flow:** Local/offline anchor generation for testing.
- **Codex Entry Workflow:** Complete pipeline from upload to export with schema validation.
- **Polkadot Blockchain Anchor (New in Fork):** Integrity proofs can be anchored to Polkadot using the extension workflow; Codex Entries now can record both Google and Polkadot identities, with anchor details integrated. See [polkadot-enhancement.md](./polkadot-enhancement.md).
- **UI/UX:** Stepper feedback, error handling, recovery instructions, export/download features, anchor type selection menu and feedback for both chains.

---

### What’s Not Implemented ✗

- **Chrome Built-In AI**
- **Full Polkadot extrinsic signing:** The current Polkadot anchor uses RPC for demonstration purposes; future work will add identity-asserted signed extrinsic submission. See [polkadot-enhancement.md](./polkadot-enhancement.md).
- **Expanded Testing Infrastructure/Docs:** Needs coverage for Polkadot anchor flows.

---

### Next Actions

1. **Polkadot Anchor Integration:**
   - Upgrade `anchorPolkadot()` to support signed extrinsics via @polkadot/api (see [polkadot-enhancement.md](./polkadot-enhancement.md)).
   - Expand Codex Entry builder and validation tools for multi-anchor support.
   - Document anchor type selection patterns in contributor guides.

2. **Testing Infrastructure:**
   - Expand tests and runners to cover Polkadot anchor, simulated extrinsics, multi-anchor validation.

3. **Documentation:**
   - Ensure all contributor and troubleshooting guides reflect the fork’s multi-chain support.
   - Link [polkadot-enhancement.md](./polkadot-enhancement.md) wherever Polkadot-specific code or workflow is relevant.

---

## Team Roles & Assignments

- **Project Lead:** Oversees development, documentation, roadmap, and strategy.
- **Protocol Engineer:** Maintains protocol logic, anchor flows, schema validation, multi-anchor support, and blockchain integration.
- **Blockchain/Polkadot Integration:** Implements anchorPolkadot and signed chain submission; responsible for [polkadot-enhancement.md](./polkadot-enhancement.md) workflow and architecture.
- **UI/UX Designer:** Designs popup UI, stepper, user flows; maintains anchor selection logic and feedback.
- **QA & Testing:** Conducts user testing, maintains test infrastructure, collects feedback (for both Google Drive and Polkadot anchor workflows).
- **Documentation:** Maintains README, contributor guides, troubleshooting docs; ensures multi-chain onboarding and references to [polkadot-enhancement.md](./polkadot-enhancement.md).

---

For technical details and code change planning on Polkadot anchoring, contributors must review [polkadot-enhancement.md](./polkadot-enhancement.md) and apply recommended extensions in all relevant files. For complete workflow documentation and agent collaboration patterns, see [agent-workplan.md](./agent-workplan.md).