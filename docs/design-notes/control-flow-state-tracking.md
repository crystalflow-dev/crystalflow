# ExecutionStateTracker Control Flow Analysis

## Current Implementation Issues

### ✅ What Works Well:

1. Basic node state transitions (idle → queued → running → success/error)
2. Connection state tracking for linear workflows
3. Serialization/deserialization
4. Framework-agnostic design

### ❌ What Doesn't Work with Control Flow:

#### 1. **Pre-queuing All Nodes**

```typescript
// Current code in startExecution():
executionOrder.forEach((nodeId) => {
  this.state.nodeStates.set(nodeId, 'queued');
});
```

**Problem:** With conditionals, not all nodes will execute. We're marking nodes as queued that may never run.

**Solution:** Don't pre-queue nodes. Set them to 'queued' only when we know they'll execute (just before running).

---

#### 2. **No Loop Iteration Tracking**

**Problem:** When a node executes multiple times in a loop, we only store the latest state and outputs.

**Example:**

```
Loop 3 times:
  - Node A executes
  - Iteration 1: A outputs 10
  - Iteration 2: A outputs 20
  - Iteration 3: A outputs 30

Current tracker only shows: { A: 30 } ❌
Should show: { A: [10, 20, 30] } with iteration context ✅
```

**Solution:** Add execution history with iteration tracking.

---

#### 3. **Single Current Node**

```typescript
currentNodeId: string | null; // ❌ Doesn't work for parallel execution
```

**Problem:** Parallel execution (Phase 4) can have multiple nodes running simultaneously.

**Solution:**

```typescript
currentNodeIds: Set<string>; // ✅ Multiple active nodes
```

---

#### 4. **No Branch Context**

**Problem:** Can't distinguish executions in different conditional branches.

**Example:**

```
If condition:
  Branch A: Node X executes → outputs 100
Else:
  Branch B: Node X executes → outputs 200

If the same node appears in multiple branches, we can't track which branch executed it.
```

**Solution:** Add execution context (branchId, iteration, etc.)

---

#### 5. **Connection Tracking Assumes Single Traversal**

**Problem:** Same connection can be traversed multiple times (loops) or conditionally (branches).

**Solution:** Track connection traversals, not just connection state.

---

## Recommended Enhancements

### Enhanced ExecutionState Interface

```typescript
interface ExecutionState {
  executionId: string;
  workflowId: string;
  isExecuting: boolean;

  // Enhanced: Multiple current nodes (for parallel execution)
  currentNodeIds: Set<NodeId>;

  // Current approach: Latest state only
  nodeStates: Map<NodeId, NodeExecutionStatus>;

  // NEW: Execution history (for loops and multiple runs)
  nodeExecutionHistory: NodeExecutionHistory[];

  // Enhanced: Connection traversals (multiple traversals possible)
  connectionTraversals: ConnectionTraversal[];

  // Current approach: Latest outputs only
  nodeOutputs: Map<NodeId, Record<string, unknown>>;

  // NEW: All outputs history
  nodeOutputsHistory: Map<NodeId, Record<string, unknown>[]>;

  executionProgress: {
    current: number;
    total: number;
  };
  executionOrder: NodeId[];

  // NEW: Execution context stack (for nested structures)
  executionStack: ExecutionContext[];

  startTime?: Date;
  endTime?: Date;
}

interface NodeExecutionHistory {
  nodeId: NodeId;
  status: NodeExecutionStatus;
  startTime: Date;
  endTime?: Date;
  outputs?: Record<string, unknown>;
  context: ExecutionContextInfo; // Branch/iteration info
}

interface ExecutionContextInfo {
  type: 'linear' | 'conditional-branch' | 'loop-iteration' | 'parallel-branch';
  branchId?: string;
  iteration?: number;
  parentContext?: ExecutionContextInfo;
}

interface ConnectionTraversal {
  id: string; // Unique per traversal
  connectionId: string; // Identifies the connection
  sourceNodeId: NodeId;
  sourcePort: string;
  targetNodeId: NodeId;
  targetPort: string;
  state: 'active' | 'completed';
  data?: unknown;
  traversalTime: Date;
  context: ExecutionContextInfo; // Which branch/iteration
}
```

---

## Implementation Priority

### Phase 1 (Current) - Basic Tracking ✅

- Works for linear/serial workflows
- Good foundation

### Phase 2 - Conditional Support 🚧

**Required Changes:**

1. Don't pre-queue all nodes
2. Add `onBranchEnter`/`onBranchExit` event handlers
3. Track which branch is active
4. Only queue nodes when entering their branch

**Quick Fix:**

```typescript
// In Executor, listen to branch events:
executor.on('onBranchEnter', (nodeId, branchId, condition) => {
  tracker.enterBranch(branchId, condition);
});

executor.on('onBranchExit', (nodeId, branchId) => {
  tracker.exitBranch(branchId);
});
```

### Phase 3 - Loop Support 🔜

**Required Changes:**

1. Track iteration count
2. Store execution history (not just latest)
3. Distinguish outputs by iteration

### Phase 4 - Parallel Support 🔜

**Required Changes:**

1. Change `currentNodeId` → `currentNodeIds: Set<string>`
2. Handle multiple nodes in "running" state
3. Track parallel branch contexts

---

## Immediate Recommendations

### Option 1: Keep Current Tracker for Phase 1-2 (Recommended)

**Pros:**

- Already works for basic workflows
- Visual execution doesn't need full history initially
- Can enhance incrementally

**Cons:**

- Will need updates for loops and parallel

**Action:** Add notes in code about limitations and create enhancement issue

### Option 2: Enhance Now (Overkill for MVP)

**Pros:**

- Future-proof
- Handles all control flow

**Cons:**

- More complex
- Might not need all features yet
- Delays Phase 2 implementation

---

## Decision: Recommended Approach

**For Visual Execution (Current Goal):**

1. ✅ Use current tracker for linear workflows (works great!)
2. ⚠️ Add note about conditional branch limitations
3. ⚠️ Don't pre-queue nodes (fix this now - easy change)
4. 🔜 Enhance for loops/parallel when needed (Phase 3-4)

**Quick Fix to Make Now:**

```typescript
// In ExecutionStateTracker.startExecution()
// REMOVE pre-queuing:
// executionOrder.forEach((nodeId) => {
//   this.state.nodeStates.set(nodeId, 'queued'); // ❌ Don't do this
// });

// Instead, set to 'queued' in Executor just before execution:
// When about to execute a node:
if (this._stateTracker) {
  this._stateTracker.setNodeState(node.id, 'queued');
  this._stateTracker.setNodeState(node.id, 'running');
  // ... execute
}
```

This way, only nodes that actually execute show up in the state tracker.
