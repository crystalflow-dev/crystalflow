# Design Note: Multiple Entry Points in Workflows

**Date**: January 25, 2026  
**Status**: Phase 1 - Simple Implementation, Phase 4 - Full Implementation  
**Priority**: High (Required for open-source flexibility)

## Problem

Workflows can have multiple entry points (nodes with no incoming connections). Examples:

1. **Event-Driven Workflows**: Multiple webhook endpoints triggering different parts of same workflow
2. **Parallel Data Sources**: Fetch from DB, API, and Cache simultaneously at start
3. **User Choice Workflows**: User can start workflow from different screens/actions
4. **Batch Processing**: Process multiple independent batches in parallel from the start

Currently, ExecutionPlan enforces a single linear sequence at the top level, which doesn't naturally support multiple independent entry points.

## Complexity Levels

### Level 1: Simple Multiple Entry Points (Phase 1)

All entry points converge at the same merge point.

```
Entry-1 → Process-1 ↘
Entry-2 → Process-2 → Merge → Continue
Entry-3 → Process-3 ↗
```

**Characteristics**:

- All branches are independent
- All branches merge at same node
- No intermediate merges
- **Solution**: Single virtual ParallelStep wrapper

### Level 2: Intermediate Merge Points (Phase 4)

Entry branches merge at different points, creating nested parallelism.

**Example 1: Sequential Merges**

```
R → T ↘
         C → D → END
A → B ↗   ↗
Y → I → M ↗
```

Flow:

- R→T and A→B run in parallel
- T and B merge at C
- C and M run in parallel (M started from Y entry point)
- C and M merge at D

**Example 2: All Parallel with Progressive Merge**

```
R → T → X ↘
             D → END
A → B → C ↗  ↗
Y → I → M → N ↗
```

Flow:

- All three branches (R→T→X, A→B→C, Y→I→M→N) start in parallel
- First two branches (X and C) merge at D
- Third branch (N) continues running during first merge
- Merged result from X+C merges with N at END

**Characteristics**:

- Multiple merge points at different depths
- Branches can merge while others continue
- Requires dependency graph analysis
- **Solution**: Dynamic parallel section detection with nested ParallelSteps

### Level 3: Complex DAG Patterns (Future)

Arbitrary directed acyclic graphs with multiple splits and merges.

```
    ┌→ B → D ↘
A →→│         F → END
    └→ C → E ↗
```

**Characteristics**:

- One node splits into multiple branches
- Multiple merge and split points
- Requires full DAG analysis
- **Solution**: Advanced graph algorithms (topological sort with level detection)

## Current Architecture

```typescript
// ExecutionPlan is linear at top level
const plan = [
  { type: 'node-execution', nodeId: 'step-1' }, // Must be single entry
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

### Phase 1: Simple Multiple Entry Points (CURRENT SCOPE)

Handle only Level 1 complexity - all entry points merge at same location.

**Implementation**:

```typescript
// ExecutionPlanBuilder.build() - Phase 1
const entryNodes = workflow.getEntryNodes();

if (entryNodes.length > 1) {
  // Check if all paths converge at same point
  const commonMergePoint = findCommonMergePoint(entryNodes, workflow);

  if (!commonMergePoint) {
    throw new Error(
      'Complex merge patterns not supported in Phase 1. ' +
        'All entry point branches must converge at the same node.'
    );
  }

  // All merge at same point - simple virtual parallel
  const plan = [
    {
      type: 'parallel',
      id: '__virtual_entry_parallel__',
      branches: entryNodes.map((nodeId) => ({
        id: `entry-${nodeId}`,
        steps: this.buildPathToMerge(nodeId, commonMergePoint, workflow),
      })),
      mergeStrategy: 'all',
    },
    {
      type: 'merge',
      id: '__virtual_entry_merge__',
      branchIds: entryNodes.map((nodeId) => `entry-${nodeId}`),
      strategy: 'all',
    },
    // Continue from merge point...
    ...this.buildFromNode(commonMergePoint, workflow),
  ];
}
```

**Pros**:

- ✅ Simple to implement and understand
- ✅ Handles common use case (parallel data fetching)
- ✅ Clear error messages for unsupported patterns
- ✅ Can be implemented in Phase 1 timeline

**Cons**:

- ❌ Limited to simple merge patterns
- ❌ Doesn't handle intermediate merges
- ❌ Users must restructure complex workflows

**Validation**: Detect and reject Level 2/3 patterns with helpful error:

```
Error: Complex merge pattern detected in workflow.
  Entry branches merge at multiple points (C, D).
  Phase 1 only supports workflows where all entry branches
  converge at a single merge point.

  Workaround: Restructure workflow to have all entry points
  merge at the same node, or wait for Phase 4 (Parallel Execution).
```

### Phase 4: Advanced Parallel Execution (FUTURE SCOPE)

Handle Level 2 and Level 3 complexity - arbitrary parallel patterns.

**Implementation** (Phase 4):

```typescript
// ExecutionPlanBuilder.build() - Phase 4
const plan = this.buildFromDependencyAnalysis(workflow);

// Algorithm:
// 1. Perform topological sort
// 2. Identify "levels" (nodes that can run in parallel)
// 3. Detect merge points (nodes with multiple incoming edges)
// 4. Build parallel sections between merge points
// 5. Handle nested parallelism recursively

function buildFromDependencyAnalysis(workflow: Workflow): ExecutionPlan {
  const levels = computeParallelLevels(workflow);
  const steps = [];

  for (const level of levels) {
    if (level.nodes.length === 1) {
      // Single node - sequential execution
      steps.push({
        type: 'node-execution',
        nodeId: level.nodes[0],
      });
    } else {
      // Multiple nodes - parallel execution
      steps.push({
        type: 'parallel',
        branches: level.nodes.map((nodeId) => ({
          id: `level-${level.index}-${nodeId}`,
          steps: this.buildSubgraph(nodeId, level.mergePoint, workflow),
        })),
      });

      steps.push({
        type: 'merge',
        branchIds: level.nodes.map((nodeId) => `level-${level.index}-${nodeId}`),
        strategy: 'all',
      });
    }
  }

  return new ExecutionPlan(steps);
}
```

**Algorithm Details**:

1. **Compute Parallel Levels**:
   - Use modified topological sort with level assignment
   - Nodes at same level have no dependencies on each other
   - Level 0 = entry nodes

2. **Detect Merge Points**:
   - Node with multiple incoming edges = merge point
   - Track which branches merge at each point

3. **Build Parallel Sections**:
   - Between each merge point, identify independent subgraphs
   - Create ParallelStep for each set of independent subgraphs
   - Recursively handle nested parallelism within subgraphs

4. **Handle Progressive Merges**:
   - When branch A+B merge at C, but branch D continues
   - Create nested parallel: (A || B) → merge → C || D
   - Continue until all branches converge

**Example: Level 2 Pattern**

```
R → T ↘
         C → D → END
A → B ↗   ↗
Y → I → M ↗
```

**Execution Plan**:

```typescript
[
  // Level 0: Entry nodes in parallel
  {
    type: 'parallel',
    branches: [
      { id: 'branch-1', steps: [R, T] },
      { id: 'branch-2', steps: [A, B] },
      { id: 'branch-3', steps: [Y, I, M] },
    ],
  },

  // Partial merge: T and B → C (M continues)
  {
    type: 'parallel',
    branches: [
      {
        id: 'merged-1-2',
        steps: [
          { type: 'merge', branchIds: ['branch-1', 'branch-2'] },
          { type: 'node-execution', nodeId: 'C' },
        ],
      },
      {
        id: 'continuing-3',
        steps: [], // M already executed, just wait
      },
    ],
  },

  // Final merge: C and M → D
  {
    type: 'merge',
    branchIds: ['merged-1-2', 'continuing-3'],
    strategy: 'all',
  },

  { type: 'node-execution', nodeId: 'D' },
  { type: 'node-execution', nodeId: 'END' },
];
```

**Pros**:

- ✅ Handles arbitrary parallel patterns
- ✅ Optimal parallel execution
- ✅ Maximum performance
- ✅ Flexible for complex workflows

**Cons**:

- ❌ Complex algorithm implementation
- ❌ Harder to debug and visualize
- ❌ Requires extensive testing
- ❌ Out of scope for Phase 1

### Option 3: Virtual Root Node (NOT RECOMMENDED)

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
      branches: entryNodes.map((nodeId) => ({
        id: `entry-${nodeId}`,
        steps: this.buildStepsForNode(nodeId, workflow, visited),
      })),
      mergeStrategy: 'all',
    },
    {
      type: 'merge',
      id: '__virtual_entry_merge__',
      branchIds: entryNodes.map((nodeId) => `entry-${nodeId}`),
      strategy: 'all',
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
  nodeType: '__virtual__',
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

## Implementation Plan

### Phase 1 (Week 1-2): Simple Multiple Entry Points

**Scope**: Level 1 complexity only

**Tasks**:

1. Detect entry nodes with no incoming connections
2. Find common merge point (all branches converge at same node)
3. If found: Generate virtual ParallelStep wrapper
4. If not found: Throw descriptive error with workaround suggestions
5. Add configuration option: `entryPointStrategy: 'parallel' | 'sequential'`
6. Validate all nodeIds reference existing workflow nodes

**Testing**:

- ✅ Single entry point (no wrapper needed)
- ✅ Multiple entry points merging at same node
- ✅ Error handling for intermediate merge patterns
- ✅ Both parallel and sequential strategies

**Deliverables**:

- Basic ExecutionPlanBuilder with entry point handling
- Clear error messages for unsupported patterns
- Documentation of limitations

### Phase 4 (Week 7-8): Advanced Parallel Execution

**Scope**: Level 2 and Level 3 complexity

**Tasks**:

1. Implement topological sort with level assignment
2. Implement merge point detection algorithm
3. Implement parallel section identification
4. Implement nested ParallelStep generation
5. Handle progressive merges (some branches merge while others continue)
6. Optimize execution order for maximum parallelism

**Testing**:

- ✅ Intermediate merge patterns (Example 1)
- ✅ Progressive merge patterns (Example 2)
- ✅ Complex DAG patterns with multiple splits/merges
- ✅ Nested parallelism (parallel inside parallel)
- ✅ Performance comparison with sequential execution

**Deliverables**:

- Full dependency graph analysis
- Optimal parallel execution plans
- Comprehensive test suite
- Performance benchmarks

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
4. **Phase 1 Limitation**: Should we provide a workflow validation tool to check if pattern is supported before execution?
5. **Phase 4 Algorithm**: Should we use level-based or region-based parallelization?

## Related Issues

- **Phase 1 Limitation**: Complex merge patterns will fail with error in Phase 1
- **Migration Path**: When Phase 4 is released, workflows that were restructured for Phase 1 should still work
- **Performance**: Phase 4 parallel execution should be significantly faster than Phase 1 sequential fallback

## Action Items

### Phase 1 (Week 1-2)

- [x] Document multiple entry points requirement
- [x] Document complexity levels and examples
- [x] Define Phase 1 scope (simple patterns only)
- [ ] Implement simple entry point detection in ExecutionPlanBuilder
- [ ] Implement common merge point finding algorithm
- [ ] Add error handling for unsupported patterns
- [ ] Add configuration option for entry point strategy
- [ ] Write tests for simple multiple entry points
- [ ] Document Phase 1 limitations in user-facing docs

### Phase 4 (Week 7-8)

- [ ] Research optimal parallel execution algorithms
- [ ] Implement topological sort with level detection
- [ ] Implement merge point detection
- [ ] Implement parallel section building
- [ ] Handle progressive merge patterns
- [ ] Write comprehensive test suite
- [ ] Performance benchmarks vs Phase 1
- [ ] Update documentation to remove Phase 1 limitations
