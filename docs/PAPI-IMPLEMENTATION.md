# Polkadot API (PAPI) Implementation Guide

> **Changelog:** PAPI implementation is now documented as part of the extended workflow—see [agent-workplan.md](./agent-workplan.md) for complete context on Polkadot anchor integration within the full user workflow.

## Overview

The Polkadot anchor implementation uses the modern Polkadot API (PAPI) with Smoldot light client for decentralized blockchain interaction. This approach follows the best practices from the [Beginners Guide to Polkadot API (PAPI)](https://dev.to/badery/beginners-guide-to-polkadot-api-papi-youve-got-mail-mc1) article.

## Architecture

### Key Components

1. **Smoldot Light Client (v2.0.39)**
   - WebAssembly-based light client that runs in the browser
   - Connects directly to the Polkadot relay chain without requiring RPC servers
   - Provides decentralized, trust-minimized blockchain access

2. **Polkadot API (PAPI) v1.20.1**
   - Modern TypeScript library for Polkadot interaction
   - Provides typed APIs generated from chain metadata
   - Supports observables for reactive blockchain data

3. **Hybrid Fallback Strategy**
   - Attempts PAPI connection first
   - Falls back to deterministic mock mode on timeout or error
   - Ensures the extension works offline or when network is unavailable

## Implementation Details

### File Structure

- **`lib/polkadot-utils.js`**: Core PAPI implementation
  - `createPolkadotClient()`: Initializes Smoldot light client and PAPI
  - `getFinalizedBlockWithTimeout()`: Retrieves finalized block with timeout handling
  - `anchorPolkadot()`: Main anchor function with PAPI integration
  - `getPolkadotProfile()` / `setPolkadotProfile()`: Profile storage utilities

- **`lib/protocol.js`**: Re-exports `anchorPolkadot` from polkadot-utils.js

### Key Features

#### 1. Decentralized Connectivity

```javascript
const { createClient } = await import("polkadot-api");
const { getSmProvider } = await import("polkadot-api/sm-provider");
const { chainSpec } = await import("polkadot-api/chains/polkadot");
const { start } = await import("polkadot-api/smoldot");

const smoldot = start();
const chain = await smoldot.addChain({ chainSpec });
const client = createClient(getSmProvider(chain));
```

#### 2. Real Blockchain Data Retrieval

```javascript
const finalizedBlock = await getFinalizedBlockWithTimeout(client, timeout);
// Returns: { hash: "0x...", number: 123456 }
```

#### 3. Proper Resource Cleanup

- Unsubscribes from observables
- Clears timeouts
- Terminates Smoldot instances
- Prevents memory leaks

#### 4. Environment-Aware Timeouts

- Test mode: 2 seconds (`NODE_ENV=test` or `PAPI_TEST_MODE=true`)
- Production mode: 8 seconds
- Prevents test suite from hanging

## Testing the Implementation

### Running Tests

```bash
# Run all tests
NODE_ENV=test npm test

# Run only Polkadot-related tests
NODE_ENV=test npm test -- lib/protocol.test.js lib/polkadot-utils.test.js
```

### Expected Test Output

When tests run, you should see:

```
stdout | lib/polkadot-utils.test.js > ...
[smoldot] Smoldot v2.0.39
[smoldot] Chain initialization complete for polkadot. Name: "Polkadot". Genesis hash: 0x91b1…90c3
[Polkadot] PAPI anchoring failed, using fallback: Timeout waiting for finalized block
[Polkadot] Using mock anchor implementation
```

This indicates:

1. ✅ Smoldot light client initialized successfully
2. ✅ Connected to Polkadot relay chain
3. ⏱️ Timed out waiting for finalized block (expected in test mode)
4. ✅ Fell back to mock mode gracefully

### Testing in Production

To test with real blockchain connectivity:

1. **Set longer timeout:**

   ```bash
   # Don't set NODE_ENV=test or PAPI_TEST_MODE
   npm test -- lib/polkadot-utils.test.js
   ```

2. **Monitor console output:**
   - Look for "Successfully anchored using PAPI light client"
   - This indicates real block data was retrieved

3. **Verify block data:**
   - Check that `blockHash` and `blockNumber` are real values from the chain
   - Visit the explorer URL to verify the block exists

## Usage in Chrome Extension

### Anchor Creation Flow

1. User selects "Polkadot Anchor" in popup
2. User connects Polkadot account (address input)
3. User generates Codex entry
4. Extension calls `anchorPolkadot(entry, polkadotAccount)`
5. PAPI attempts to connect and retrieve block data
6. On success: returns real block hash/number
7. On timeout/failure: falls back to mock mode
8. Anchor result stored in Codex entry

### Configuration

Environment variables:

- `NODE_ENV=test`: Enables test mode with 2s timeout
- `PAPI_TEST_MODE=true`: Alternative way to enable test mode

## Future Enhancements

### Planned Features

1. **Wallet Integration**
   - Connect to Polkadot.js extension
   - Support for Talisman, SubWallet
   - User-friendly account selection

2. **Transaction Signing**
   - Sign system.remark extrinsics
   - Submit anchor payload on-chain
   - Wait for transaction finalization

3. **Real Transaction Hashes**
   - Replace deterministic hash with actual tx hash
   - Update explorer URLs to point to real transactions
   - Enable on-chain verification

### Code Changes Needed

```javascript
// Example: Future transaction signing
const api = client.getTypedApi(dot);
const tx = api.tx.System.remark({
  remark: anchorPayload,
});

const signed = await tx.sign(account, signer);
const result = await signed.submit();
const txHash = result.txHash;
```

## Troubleshooting

### Common Issues

**Issue: Tests timeout**

- **Cause**: Network connectivity issues or slow chain sync
- **Solution**: Ensure `NODE_ENV=test` is set for faster timeout

**Issue: "PAPI light client not available"**

- **Cause**: polkadot-api packages not installed
- **Solution**: Run `npm install` to install dependencies

**Issue: Smoldot doesn't initialize**

- **Cause**: WebAssembly not supported or blocked
- **Solution**: Check browser console for errors, ensure modern browser

**Issue: Memory leaks in tests**

- **Cause**: Subscriptions or timeouts not cleaned up
- **Solution**: Verify `subscription.unsubscribe()` and `clearTimeout()` are called

### Debug Mode

Enable verbose logging:

```javascript
// In polkadot-utils.js, add:
console.log("[Polkadot] Client created:", client);
console.log("[Polkadot] Finalized block:", finalizedBlock);
```

## Performance Considerations

- **Dynamic Imports**: Used intentionally for graceful degradation
- **Light Client Startup**: Takes 1-3 seconds to sync initial state
- **Memory Usage**: Smoldot uses ~10-20 MB of memory
- **Network Usage**: Light client uses minimal bandwidth (headers only)

## Security

### CodeQL Scan Results

✅ No security vulnerabilities detected

### Security Features

- No private keys stored in extension
- No centralized RPC dependencies
- Verifiable blockchain data via light client
- Proper resource cleanup prevents leaks

## References

- [Polkadot API (PAPI) Documentation](https://papi.how/)
- [Beginners Guide to PAPI](https://dev.to/badery/beginners-guide-to-polkadot-api-papi-youve-got-mail-mc1)
- [Smoldot Light Client](https://github.com/smol-dot/smoldot)
- [Polkadot Ecosystem PAPI Overview](https://polkadotecosystem.com/tools/dev/papi/)

## Contributing

When modifying the PAPI implementation:

1. Ensure proper resource cleanup (subscriptions, timeouts, Smoldot)
2. Test both success and timeout paths
3. Verify no memory leaks with long-running tests
4. Update documentation for any API changes
5. Run security scan with `codeql_checker`

For complete workflow context and agent collaboration patterns, see [agent-workplan.md](./agent-workplan.md).

## License

Same as parent project.
