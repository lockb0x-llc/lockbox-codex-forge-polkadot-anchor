// Unit tests for polkadot-utils.js
import { describe, test, expect, beforeEach, vi } from "vitest";
import { anchorPolkadot, getPolkadotProfile, setPolkadotProfile } from "./polkadot-utils.js";
import { uuidv4 } from "./protocol.js";

// Mock chrome.storage.local API
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  runtime: {},
};

describe("polkadot-utils.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("anchorPolkadot returns polkadot anchor with string account", async () => {
    const entry = {
      id: uuidv4(),
      storage: { integrity_proof: "ni:///sha-256;abc" },
    };
    const polkadotAccount = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
    const anchor = await anchorPolkadot(entry, polkadotAccount);
    
    expect(anchor.chain).toBe("polkadot:relay");
    expect(anchor.hash_alg).toBe("sha-256");
    expect(anchor.tx).toBeDefined();
    expect(anchor.blockHash).toBeDefined();
    expect(anchor.blockNumber).toBeDefined();
    expect(anchor.timestamp).toBeDefined();
  });

  test("anchorPolkadot returns polkadot anchor with account object", async () => {
    const entry = {
      id: uuidv4(),
      storage: { integrity_proof: "ni:///sha-256;xyz" },
    };
    const polkadotAccount = {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      name: "Test Account",
    };
    const anchor = await anchorPolkadot(entry, polkadotAccount);
    
    expect(anchor.chain).toBe("polkadot:relay");
    expect(anchor.hash_alg).toBe("sha-256");
    expect(anchor.tx).toBeDefined();
    expect(anchor.blockHash).toBeDefined();
    expect(anchor.blockNumber).toBeDefined();
    expect(anchor.timestamp).toBeDefined();
  });

  test("getPolkadotProfile returns profile when exists", async () => {
    const mockProfile = {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      name: "Test Account",
    };
    
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ polkadotProfile: mockProfile });
    });

    const profile = await getPolkadotProfile();
    expect(profile).toEqual(mockProfile);
    expect(chrome.storage.local.get).toHaveBeenCalledWith(["polkadotProfile"], expect.any(Function));
  });

  test("getPolkadotProfile returns null when no profile exists", async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({});
    });

    const profile = await getPolkadotProfile();
    expect(profile).toBeNull();
  });

  test("getPolkadotProfile returns null when profile missing address", async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ polkadotProfile: { name: "Test" } });
    });

    const profile = await getPolkadotProfile();
    expect(profile).toBeNull();
  });

  test("setPolkadotProfile saves profile successfully", async () => {
    const mockProfile = {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      name: "Test Account",
    };
    
    chrome.storage.local.set.mockImplementation((data, callback) => {
      callback();
    });

    await setPolkadotProfile(mockProfile);
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { polkadotProfile: mockProfile },
      expect.any(Function)
    );
  });

  test("setPolkadotProfile rejects when profile missing address", async () => {
    const invalidProfile = { name: "Test" };
    
    await expect(setPolkadotProfile(invalidProfile)).rejects.toThrow("Profile must include an address");
  });

  test("setPolkadotProfile rejects when profile is null", async () => {
    await expect(setPolkadotProfile(null)).rejects.toThrow("Profile must include an address");
  });

  test("setPolkadotProfile handles chrome runtime errors", async () => {
    const mockProfile = {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    };
    
    const mockError = new Error("Storage error");
    chrome.runtime.lastError = mockError;
    chrome.storage.local.set.mockImplementation((data, callback) => {
      callback();
    });

    await expect(setPolkadotProfile(mockProfile)).rejects.toEqual(mockError);
    delete chrome.runtime.lastError;
  });
});
