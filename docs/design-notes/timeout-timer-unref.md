# Timeout Timer `.unref()` in Executor

## Background

The `Executor` supports an optional `timeout` execution option. When set, it creates a `setTimeout` that cancels the execution if it runs too long:

```typescript
timeoutHandle = setTimeout(() => {
  context.cancel(CancellationReason.Timeout);
}, options.timeout);
```

## The Problem

By default, Node.js timers are **referenced** — they keep the event loop alive until they fire or are cleared. This is normally what you want for timers that drive meaningful work.

However, the cancellation timer is a watchdog (a safety net). Its job is to fire *only if execution exceeds the timeout*. In the happy path, `finally` always calls `clearTimeout(timeoutHandle)` before the timer ever fires.

This creates a subtle issue in environments with strict process lifecycle control (e.g., Jest test workers):

1. Execution completes in `5ms`
2. `finally` calls `clearTimeout` — timer is removed
3. ...but in some teardown race conditions, the timer can still appear "referenced" during Jest's worker shutdown check, causing the worker to be force-exited with a warning:

```
A worker process has failed to exit gracefully and has been force exited.
This is likely caused by tests leaking due to improper teardown.
Active timers can also cause this, ensure that .unref() was called on them.
```

## The Fix

```typescript
timeoutHandle = setTimeout(() => {
  context.cancel(CancellationReason.Timeout);
}, options.timeout);
timeoutHandle.unref(); // ← added
```

`.unref()` tells Node.js: *"this timer should not on its own keep the process alive."* The timer still fires correctly if the event loop is busy for other reasons — which it always is during an active `executor.execute()` call (pending Promises, awaited events, node execution).

## Why This Is Not a Workaround

It might look like a test-only fix, but `.unref()` is the **standard Node.js idiom** for watchdog/fallback timers:

| Timer type | Should `.unref()`? |
|---|---|
| Drives meaningful work (e.g., animation, polling) | No |
| Watchdog / safety net / fallback | **Yes** |

The Node.js documentation explicitly recommends `.unref()` for timers whose only purpose is to prevent runaway processes — not to enable regular program flow. A cancellation timeout fits this definition exactly.

The actual workaround would be `jest --forceExit`, which masks real leaks instead of fixing them.

## Why It's Safe in Production

During `executor.execute()`, the event loop is always occupied by:
- `await this.emitAsync(...)` calls
- `await node.run()` — the node's own async work
- `await this._planExecutor.execute(...)` — the execution loop itself

These are all referenced async operations. `.unref()` on the timer has no effect while any of them are pending. When execution finally completes, `finally` calls `clearTimeout` and the timer is fully removed before it could ever become "the last thing keeping the process alive."

## Summary

`.unref()` on the timeout handle is:
- ✅ Correct Node.js idiom for watchdog timers
- ✅ Safe in production (event loop is busy during execution)
- ✅ Properly cleaned up by `clearTimeout` in `finally`
- ✅ Prevents test worker hangs without masking real leaks
