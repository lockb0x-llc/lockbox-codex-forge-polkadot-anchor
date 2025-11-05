# Lockb0x Codex Forge — Interactive Web Demo

Welcome! You can create a Lockb0x Codex entry with Google and Polkadot anchors below.

---

**Step 1:** Upload a file or paste content.

<input type="file" id="fileInput" />
<textarea id="contentArea" rows="5" cols="50" placeholder="Or paste content"></textarea>

---

**Step 2:** Select Anchor Type

<select id="anchorType">
  <option value="mock">Mock</option>
  <option value="google">Google Drive</option>
  <option value="polkadot">Polkadot</option>
</select>
<button id="polkadotConnectBtn">Connect Polkadot Account</button>
<span id="polkadotStatus"></span>

---

**Step 3:** Generate Codex Entry

<button id="generateBtn">Generate Codex Entry</button>

---

**Result:**

<pre id="codexResult"></pre>

<script type="module">
import { uuidv4, sha256, niSha256, anchorPolkadot } from './lib/protocol.js';
import { validateCodexEntry } from './lib/validate.js';

let polkadotAddress = '';

document.getElementById('polkadotConnectBtn').onclick = () => {
  polkadotAddress = prompt('Enter your Polkadot address:');
  document.getElementById('polkadotStatus').textContent = polkadotAddress
    ? 'Connected: ' + polkadotAddress
    : 'Not connected';
};

document.getElementById('generateBtn').onclick = async () => {
  const anchorType = document.getElementById('anchorType').value;
  let content = '';
  const file = document.getElementById('fileInput').files[0];
  if (file) {
    content = await file.text();
  } else {
    content = document.getElementById('contentArea').value;
  }
  
  if (!content) {
    alert('No content provided!');
    return;
  }
  
  const id = uuidv4();
  const hash = niSha256(await sha256(new TextEncoder().encode(content)));
  
  // Entry basics
  let entry = {
    id,
    version: '0.0.2',
    storage: {
      protocol: 'local',
      location: 'N/A',
      integrity_proof: hash,
    },
    identity: {
      org: 'Codex Forge',
      process: 'Markdown Demo',
      artifact: file ? file.name : 'contentArea',
    },
    anchor: { chain: anchorType, tx: 'N/A', hash_alg: 'sha-256'},
    signatures: [],
    createdBy: {},
  };

  if (anchorType === 'polkadot') {
    if (!polkadotAddress.match(/^[1-9A-HJ-NP-Za-km-z]{47,48}$/)) {
      alert('Invalid Polkadot address!');
      return;
    }
    const polkaAnchor = await anchorPolkadot(entry, polkadotAddress);
    entry.anchor = polkaAnchor;
    entry.createdBy = { type: "polkadot", address: polkadotAddress };
  } else if (anchorType === 'google') {
    entry.createdBy = { type: "google", email: "demo@localhost" };
    entry.anchor = { chain: "google:drive", tx: "mock-demo", hash_alg: "sha-256", timestamp: new Date().toISOString() };
  } else {
    entry.createdBy = { type: "mock" };
    entry.anchor = { chain: "mock:local", tx: "demo-tx", hash_alg: "sha-256", timestamp: new Date().toISOString() };
  }
  
  // Validate
  const validation = await validateCodexEntry(entry);
  let result = JSON.stringify(entry, null, 2);
  if (!validation.valid) result += "\n\nValidation errors:\n" + validation.errors.map(e => e.message).join("\n");
  
  document.getElementById('codexResult').textContent = result;
};
</script>