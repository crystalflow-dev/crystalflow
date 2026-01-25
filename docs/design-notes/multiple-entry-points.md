# Design Note: Multiple Entry Points in Workflows

**Date**: January 25, 2026  
**Status**: To Be Implemented in ExecutionPlanBuilder  
**Priority**: High (Required for open-source flexibility)

## Problem

Workflows can have multiple entry points (nodes with no incoming connections). Examples:

1. **Event-Driven Workflows**: Multiple webhook endpoints triggering different parts of same workflow
2. **Parallel Data Sources**: Fetch from DB, API, and Cache simultaneously at start
3. **User Choice Workflows**: User can start workflow from different screens/actions
4. **Batch Processing**: Process multiple independent batches in parallel from the start

Currently, ExecutionPlan enforces a single linear sequence at the top level, which doesn't naturally support multiple independent entry points.

## Current Architecture

```typescript
// ExecutionPlan is linear at top level
const plan = [
  { type: 'node-execution', nodeId: 'step-1' },  // Must be single entry
  { type: 'node-execution', nodeId: 'step-2' },
  // ...
];
```

**Issue**: How do we represent a workflow with 3 independent entry points?

```
Workflow Graph:
  Entry-1 → Process-1 ┐
  Entry-2 → Process-2 ├→ Merge → Output
  Entry-3 → Process-3 ┘
```

## Proposed Solutions

### Option 1: Virtual ParallelStep Wrapper (RECOMMENDED)

Wrap all entry points in an implicit ParallelStep at the beginning of the plan.

**Implementation**:
```typescript
// ExecutionPlanBuilder.build()
const entryNodes = workflow.getEntryNodes(); // Nodes with no incoming edges

if (entryNodes.length > 1) {
  // Multiple entry points - wrap in parallel
  const plan = [
    {
      type: 'parallel',
      id: '__virtual_entry_parallel__',
      branches: entryNodes.map(nodeId => ({
        id: `entry-${nodeId}`,
        steps: this.buildStepsForNode(nodeId, workflow, visited)
      })),
      mergeStrategy: 'all'
    },
    {
      type: 'merge',
      id: '__virtual_entry_merge__',
      branchIds: entryNodes.map(nodeId => `entry-${nodeId}`),
      strategy: 'all'
    },
    // Continue with rest of workflow...
  ];
} else {
  // Single entry point - simple linear plan
  const plan = this.buildStepsForNode(entryNodes[0], workflow, visited);
}
```

**Pros**:
- ✅ True parallel execution of independent entry paths
- ✅ Natural representation of workflow structure
- ✅ No special cases in PlanExecutor
- ✅ Works with existing ExecutionPlan design
- ✅ Transparent to users (virtual steps don't correspond to real nodes)

**Cons**:
- ❌ Adds virtual steps that don't correspond to user nodes
- ❌ Slightly more complex debugging (need to identify virtual steps)

### Option 2: Sequential Execution (Topological Order)

Execute entry points one by one in topological order.

**Implementation**:
```typescript
// ExecutionPlanBuilder.build()
const entryNodes = workflow.getEntryNodes();
const steps = [];

// Execute each entry point sequentially
for (const nodeId of entryNodes) {
  steps.push(...this.buildStepsForNode(nodeId, workflow, visited));
}
```

**Pros**:
- ✅ Simple implementation
- ✅ No virtual steps
- ✅ Predictable execution order

**Cons**:
- ❌ Loses parallelism opportunities (slower execution)
- ❌ Not semantically correct (independent paths should be parallel)
- ❌ Poor user experience for workflows designed for parallel entry

### Option 3: Virtual Root Node (NOT RECOMMENDED)

Create a virtual "start" node that doesn't exist in the workflow.

**Implementation**:
```typescript
// Create virtual root
const virtualRoot = {
  type: 'node-execution',
  id: '__virtual_root__',
  nodeId: '__virtual_root__',
  nodeType: '__virtual__'
};

// Connect it to all entry points somehow...
```

**Pros**:
- ✅ Makes all workflows have exactly one entry point

**Cons**:
- ❌ Virtual node pollutes the execution trace
- ❌ Confusing for debugging (what is this node?)
- ❌ Still need to handle connecting to multiple next nodes
- ❌ Doesn't actually solve the problem, just hides it

## Recommendation

**Use Option 1 (Virtual ParallelStep Wrapper)** for the following reasons:

1. **Correctness**: Parallel execution matches the semantic intent of multiple entry points
2. **Performance**: Enables true parallelism for independent paths
3. **Extensibility**: Works with future control flow features
4. **Clean Design**: Virtual steps are implementation details, not exposed to users

## Implementation Details

### Configuration Option

Add option to ExecutionPlanBuilder to control behavior:

```typescript
interface ExecutionPlanBuilderOptions {
  /**
   * Strategy for handling multiple entry points
   * - 'parallel': Wrap in ParallelStep (default, recommended)
   * - 'sequential': Execute in topological order
   */
  entryPointStrategy?: 'parallel' | 'sequential';
}
```

### Virtual Step Identification

Use naming convention to identify virtual steps:

```typescript
// Virtual steps use __ prefix
const VIRTUAL_ENTRY_PARALLEL_ID = '__virtual_entry_parallel__';
const VIRTUAL_ENTRY_MERGE_ID = '__virtual_entry_merge__';

// Check if step is virtual
function isVirtualStep(step: ExecutionPlanStep): boolean {
  return step.id.startsWith('__virtual_');
}
```

### Debugging Support

Add metadata to virtual steps for debugging:

```typescript
{
  type: 'parallel',
  id: '__virtual_entry_parallel__',
  metadata: {
    isVirtual: true,
    reason: 'multiple-entry-points',
    entryNodeIds: ['node-1', 'node-2', 'node-3']
  },
  branches: [...]
}
```

### Testing Requirements

1. Test workflow with single entry point (no virtual step needed)
2. Test workflow with 2 entry points (creates virtual parallel)
3. Test workflow with 5 entry points (creates virtual parallel with 5 branches)
4. Test that virtual steps don't appear in getBreakpoints()
5. Test both 'parallel' and 'sequential' strategies
6. Test that execution order is correct for both strategies

## Related Files

- `packages/core/src/execution/ExecutionPlan.ts` - Updated with documentation
- `packages/core/src/execution/ExecutionPlanBuilder.ts` - To be implemented (Task 3)
- `docs/execution-plan-architecture.md` - Updated with requirement

## Open Questions

1. Should virtual steps be filterable from execution traces?
2. Do we need a way for users to override the entry point strategy per workflow?
3. Should we warn users if their workflow has many entry points (performance concern)?

## Action Items

- [ ] Implement multiple entry point detection in ExecutionPlanBuilder
- [ ] Implement virtual ParallelStep wrapper generation
- [ ] Add configuration option for entry point strategy
- [ ] Write comprehensive tests for all scenarios
- [ ] Document behavior in user-facing documentation
- [ ] Add examples showing multiple entry point workflows
