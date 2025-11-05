# Lockb0x Codex Forge Zip Archive Workflow (Polkadot Anchor Fork)

## Overview

The Zip Archive feature in this fork supports anchoring and validation on both Google Drive and the Polkadot blockchain. Codex Entries now record anchor details from either (or both) sources, and the workflow supports flexible multi-chain provenance.

---

## Workflow Steps

1. **Payload Preparation**
   - The payload (file or extracted web content) is combined with identity and metadata as specified by the selected anchor type (Google, Mock, or Polkadot).
2. **Zip Archive Creation**
   - Created as before using `lib/zip-archive.js`, with archive-level comments for provenance.
   - Archive is encrypted using Google account email, mock password, or as future work, with Polkadot/address-linked key.
3. **Multi-Anchor Options**
   - If Google Drive anchor selected, archive is uploaded to Drive.
   - If Polkadot anchor selected, integrity proofs are submitted to chain via `anchorPolkadot()`; Codex Entry updated with anchor, tx, and chain URL (see [polkadot-enhancement.md](./polkadot-enhancement.md)).
   - Both anchors may be included in Codex Entry as `anchors[]`.
4. **Final Codex Entry Handling**
   - Anchor details and identity from Google/Polkadot recording.
   - Codex Entry and archive available for download, copied to clipboard, UI review.

---

## Implementation Details

- See [polkadot-enhancement.md](./polkadot-enhancement.md) for code and workflow references for Polkadot integration.
- Codex Entry builder supports both anchor types and merges identity info.
- UI elements allow anchor type selection, address entry, and transaction feedback.

---

## Verification Process

To verify a Lockb0x Codex zip archive:
- Extract using password.
- Compare payload file and `codex-entry.json`; validate `anchors[]` array for Google and/or Polkadot details.
- Review archive-level provenance comment.
- Compute integrity proof hash, verify chain and Drive anchors, validate signatures.
- Multi-anchor verification now supported (see [polkadot-enhancement.md](./polkadot-enhancement.md)).

---

## Future Enhancements

- Signed Polkadot extrinsics for authoritative integrity proof.
- Polkadot address-linked encryption as an option.
- UI improvements for anchor selection and chain integration feedback.
- Audit, test, and demo resources for multi-anchor deployments.

---

**For architectural integration, see [polkadot-enhancement.md](./polkadot-enhancement.md) and ensure all new workflows are documented and tested accordingly.**