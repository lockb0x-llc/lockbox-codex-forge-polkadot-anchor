\🧩 Goal

Extend Lockb0x Codex Forge to:
	1.	Use Google Drive for payload storage (unchanged).
	2.	Add a Polkadot-based anchor (anchorPolkadot()).
	3.	Record both Google and Polkadot identities in the Codex Entry.

⸻

🧠 Architecture Additions

Layer	Description	File
Anchor Adapter	anchorPolkadot(entry, polkadotAccount) — creates a Polkadot transaction embedding entry.storage.integrity_proof	lib/protocol.js
Identity Merge	Extend createdBy to include both Google and Polkadot info	popup.js
Workflow Update	If anchorType = polkadot, call anchorPolkadot() in addition to (or instead of) anchorGoogle()	background.js / codex-workflow.js


⸻

⚙️ Step-by-Step Integration Plan

1. Add Polkadot anchor adapter

Append this to the bottom of lib/protocol.js (after anchorGoogle()):

// Polkadot Anchor Adapter
export async function anchorPolkadot(entry, polkadotAccount) {
  // Example uses Polkadot.js HTTP RPC endpoint
  const payloadHash = entry.storage?.integrity_proof;
  const timestamp = new Date().toISOString();

  // Post to your relay or public endpoint
  const res = await fetch("https://polkadot.api.subscan.io/api/scan/extrinsic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hash: payloadHash,
      note: `Lockb0x anchor for ${entry.id}`,
      account: polkadotAccount?.address || "unknown",
      time: timestamp,
    }),
  });

  if (!res.ok) throw new Error(`[Polkadot Anchor] ${res.status}: ${await res.text()}`);

  // Minimal result
  return {
    chain: "polkadot:relay",
    tx: `mock-tx-${Date.now()}`,
    url: "https://polkadot.js.org/apps/#/explorer",
    hash_alg: "sha-256",
    timestamp,
  };
}

Later you can swap the mock POST for @polkadot/api extrinsic submission.

⸻

2. Extend popup anchor type options

In popup.html, add to the <select id="anchorType">:

<option value="polkadot">Polkadot Anchor</option>


⸻

3. Add Polkadot identity capture

In popup.js, where createdBy is assembled (around L~850):

Replace:

let createdBy = { type: "mock" };

With:

let createdBy = { type: "mock" };
if (anchorType && anchorType.value === "google" && googleAuthToken) {
  createdBy = await new Promise((resolve) => {
    chrome.storage.local.get(["googleUserProfile"], (result) => {
      if (result.googleUserProfile) {
        resolve({ type: "google", ...result.googleUserProfile });
      } else resolve({ type: "google", email: "unknown" });
    });
  });
} else if (anchorType && anchorType.value === "polkadot") {
  // Retrieve Polkadot account from localStorage (set earlier via extension)
  const polkadotProfile = await chrome.storage.local.get(["polkadotProfile"]);
  createdBy = {
    type: "polkadot",
    address: polkadotProfile?.polkadotProfile?.address || "unknown",
    name: polkadotProfile?.polkadotProfile?.name || "Anonymous",
  };
}

Later, a lightweight popup component can allow the user to paste or connect their Polkadot address and store it in chrome.storage.local.set({ polkadotProfile }).

⸻

4. Integrate into background.js workflow

In background.js, import the new function:

import { anchorPolkadot } from "./lib/protocol.js";

Then, right before calling processCodexEntryAndArchive(...), inject the Polkadot anchor logic:

if (msg.payload.anchorType === "polkadot") {
  try {
    console.log("[background] Performing Polkadot anchoring...");
    const polkadotAnchor = await anchorPolkadot(result.entry, msg.payload.createdBy);
    result.entry.anchor = polkadotAnchor;
  } catch (err) {
    console.error("[background] Polkadot anchoring failed:", err);
  }
}

Do this in both small-file (CREATE_CODEX_FROM_FILE) and large-file (END_LARGE_FILE_UPLOAD) paths.

⸻

5. Update Codex Entry builder

Record both anchors (Google + Polkadot), modify updateCodexEntryWithStorage() in lib/codex-utils.js to allow entry.anchors[] array.


⸻

6. UI Feedback

In popup.js, extend updateAuthUI() to show Polkadot address when anchorType.value === "polkadot".
Example:

if (anchorType.value === "polkadot") {
  googleSignInBtn.style.display = "none";
  googleLogOutBtn.style.display = "none";
  const { polkadotProfile } = await chrome.storage.local.get(["polkadotProfile"]);
  authStatus.textContent = polkadotProfile?.address
    ? `Polkadot Connected: ${polkadotProfile.address.slice(0, 8)}...`
    : "No Polkadot account configured";
  authStatus.style.color = polkadotProfile?.address ? "#00796b" : "#c62828";
  return;
}


⸻

✅ Summary of What Changes

Area	Change	File
Anchor	Add anchorPolkadot()	protocol.js
Identity	Capture Polkadot profile	popup.js
Background workflow	Call anchorPolkadot()	background.js
UI	Add “Polkadot” option + status display	popup.html, popup.js


⸻
