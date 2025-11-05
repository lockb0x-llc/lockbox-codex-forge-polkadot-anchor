// Jest unit tests for protocol.js
import { uuidv4, sha256, niSha256, anchorMock, anchorPolkadot } from "./protocol.js";

describe("protocol.js", () => {
  test("uuidv4 generates valid UUID", () => {
    const uuid = uuidv4();
    expect(uuid).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    );
  });

  test("sha256 hashes input", async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const hash = await sha256(bytes);
    expect(hash).toBeInstanceOf(Uint8Array);
    expect(hash.length).toBe(32);
  });

  test("niSha256 formats hash", () => {
    const hash = new Uint8Array(32).fill(1);
    const ni = niSha256(hash);
    expect(ni.startsWith("ni:///sha-256;")).toBe(true);
  });

  test("anchorMock returns mock anchor", async () => {
    const entry = {
      id: uuidv4(),
      storage: { integrity_proof: "ni:///sha-256;abc" },
    };
    const anchor = await anchorMock(entry);
    expect(anchor.chain).toBe("mock:local");
    expect(anchor.hash_alg).toBe("sha-256");
  });

  test("anchorPolkadot returns polkadot anchor", async () => {
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
    expect(anchor.url).toBeDefined();
    expect(anchor.url).toContain("polkadot.js.org");
  });
});
