// lib/polkadot-utils.js
// Utility functions for Polkadot blockchain anchoring and profile management

import { sha256, b64u } from "./protocol.js";

/**
 * Anchor a Codex entry to the Polkadot blockchain
 * @param {Object} entry - Codex entry with id and storage.integrity_proof
 * @param {string|Object} polkadotAccount - Polkadot account address or account object
 * @returns {Promise<Object>} Anchor result with chain, tx, blockHash, blockNumber, hash_alg, timestamp
 */
export async function anchorPolkadot(entry, polkadotAccount) {
  // Extract address from account object or use as string
  const accountAddress = typeof polkadotAccount === 'string' 
    ? polkadotAccount 
    : polkadotAccount?.address || "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

  // Mock Polkadot extrinsic submission via HTTP POST
  const anchorData = {
    codexId: entry.id,
    timestamp: new Date().toISOString(),
    integrity_proof: entry.storage?.integrity_proof,
    polkadotAccount: accountAddress, // User or default mock address
  };

  // Mock HTTP POST to simulate Polkadot extrinsic
  // In production, this would call a real Polkadot endpoint or use @polkadot/api
  const mockResponse = {
    blockHash: `0x${b64u(await sha256(new TextEncoder().encode(JSON.stringify(anchorData))))}`,
    extrinsicHash: `0x${b64u(await sha256(new TextEncoder().encode(entry.id + anchorData.timestamp)))}`,
    blockNumber: Math.floor(Date.now() / 1000), // Mock block number
  };

  return {
    chain: "polkadot:relay",
    tx: mockResponse.extrinsicHash,
    blockHash: mockResponse.blockHash,
    blockNumber: mockResponse.blockNumber,
    hash_alg: "sha-256",
    timestamp: anchorData.timestamp,
  };
}

/**
 * Get Polkadot profile from Chrome local storage
 * @returns {Promise<Object|null>} Polkadot profile with address and name, or null if not found
 */
export async function getPolkadotProfile() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["polkadotProfile"], (result) => {
      if (result && result.polkadotProfile && result.polkadotProfile.address) {
        resolve(result.polkadotProfile);
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Set Polkadot profile in Chrome local storage
 * @param {Object} profile - Polkadot profile object with address and optional name
 * @param {string} profile.address - Polkadot account address
 * @param {string} [profile.name] - Optional account name
 * @returns {Promise<void>}
 */
export async function setPolkadotProfile(profile) {
  return new Promise((resolve, reject) => {
    if (!profile || !profile.address) {
      reject(new Error("Profile must include an address"));
      return;
    }
    chrome.storage.local.set({ polkadotProfile: profile }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
