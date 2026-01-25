# Execution Plan Architecture

**Status**: In Progress - Phase 1 (Week 1)  
**Version**: 1.0  
**Date**: January 24, 2026  
**Epic**: REACTFLO-83 (Control Flow & Advanced Execution)

## Implementation Progress

### Phase 1: Core Infrastructure (Week 1-2) - 🚧 IN PROGRESS

#### Week 1: Plan Structure & Builder - 🚧 IN PROGRESS
- ✅ **Task 1**: Create ExecutionPlanStep type definitions (COMPLETED)
- ✅ **Task 2**: Create ExecutionPlan class (COMPLETED)
- ⏳ **Task 3**: Create ExecutionPlanBuilder class (basic)
- ⏳ **Task 4**: Add plan builder to Executor

#### Week 2: Plan Executor - ⏳ PENDING
- ⏳ **Task 1**: Create PlanExecutor class
- ⏳ **Task 2**: Implement NodeExecutionStep execution
- ⏳ **Task 3**: Add debugging support (stub methods)
- ⏳ **Task 4**: Switch Executor to use PlanExecutor
- ⏳ **Task 5**: Integration testing
- ⏳ **Task 6**: Run benchmarks and compare with baseline

### Phase 2: Conditional Flow (Week 3-4) - ⏳ PENDING
### Phase 3: Loop Execution (Week 5-6) - ⏳ PENDING
### Phase 4: Parallel Execution (Week 7-8) - ⏳ PENDING
### Phase 5: Advanced Debugging (Week 9-10) - ⏳ PENDING
### Phase 6: Testing & Documentation (Week 11-12) - ⏳ PENDING

---

## Table of Contents

1. [Overview](#overview)
2. [Performance Benchmarks](#performance-benchmarks)
3. [Architecture Philosophy](#architecture-philosophy)
4. [Core Concepts](#core-concepts)
5. [System Components](#system-components)
6. [Execution Flow](#execution-flow)
7. [Control Flow Patterns](#control-flow-patterns)
8. [Debugging Support](#debugging-support)
9. [Implementation Phases](#implementation-phases)
10. [API Reference](#api-reference)
11. [Examples](#examples)

---

## Overview

The Execution Plan Architecture is a fundamental redesign of ReactFlo's execution engine to support advanced control flow patterns including conditionals, loops, parallel execution, and step-by-step debugging.

### Key Goals

- ✅ **Support conditional execution** (if/else, switch/case)
- ✅ **Enable loop execution** (for, while, forEach)
- ✅ **Parallel execution capabilities** (Promise.all, Promise.race)
- ✅ **Step-by-step debugging** (breakpoints, pause/resume, step over/into/out)
- ✅ **Extensibility** (easy to add new control flow patterns)
- ✅ **Inspectability** (visualize execution plan, track state)

### Architecture Decision

Instead of executing nodes directly in topological order, we:

1. **Build an execution plan** from the workflow graph
2. **Execute the plan** step-by-step with full control
3. **Enable introspection** at every step for debugging

This approach makes debugging native, loops natural, and parallel execution straightforward.

---

## Performance Benchmarks

### Baseline Performance (Current Serial Executor)

**Test Date**: January 25, 2026  
**Environment**: Node.js, Jest Test Runner  
**Hardware**: Development Machine

These benchmarks establish baseline performance for the current serial executor implementation. After implementing the execution plan architecture (Phase 1), we will re-run these tests to ensure no performance regression.

| Scenario | Nodes | Iterations | Average | Median | Min | Max | Std Dev | Status |
|----------|-------|------------|---------|--------|-----|-----|---------|--------|
| **Linear Fast Nodes** | 10 | 100 | 0.474 ms | 0.441 ms | 0.407 ms | 0.697 ms | 0.074 ms | ✅ Pass |
| **Linear Fast Nodes** | 50 | 50 | 0.981 ms | 0.897 ms | 0.774 ms | 1.619 ms | 0.216 ms | ✅ Pass |
| **Linear Fast Nodes** | 100 | 20 | 1.842 ms | 1.796 ms | 1.674 ms | 2.175 ms | 0.151 ms | ✅ Pass |
| **Linear Medium Nodes** | 20 | 50 | 1.210 ms | 1.189 ms | 1.116 ms | 1.665 ms | 0.093 ms | ✅ Pass |
| **Linear Slow Nodes** | 10 | 20 | 8.941 ms | 8.916 ms | 8.668 ms | 9.370 ms | 0.180 ms | ✅ Pass |
| **Fan-Out Pattern** | 10 | 50 | 0.622 ms | 0.601 ms | 0.582 ms | 0.812 ms | 0.048 ms | ✅ Pass |
| **Fan-Out Pattern** | 50 | 30 | 1.089 ms | 0.928 ms | 0.817 ms | 4.761 ms | 0.693 ms | ✅ Pass |
| **Diamond Pattern** | 5 | 50 | 0.412 ms | 0.386 ms | 0.343 ms | 0.607 ms | 0.074 ms | ✅ Pass |
| **Complex Graph** | 50 | 20 | 1.647 ms | 1.599 ms | 1.476 ms | 2.142 ms | 0.181 ms | ✅ Pass |
| **Async Operations** | 20 | 30 | 23.549 ms | 23.638 ms | 21.187 ms | 24.679 ms | 0.703 ms | ✅ Pass |
| **Event System** | 20 | 50 | 0.805 ms | 0.812 ms | 0.405 ms | 1.590 ms | 0.225 ms | ✅ Pass |
| **Validation** | 100 | 100 | 0.160 ms | 0.158 ms | 0.088 ms | 0.280 ms | 0.042 ms | ✅ Pass |

### Key Observations

1. **Linear Scaling**: Fast nodes scale linearly (10 nodes ≈ 0.47ms, 50 nodes ≈ 0.98ms, 100 nodes ≈ 1.84ms)
2. **Low Overhead**: Executor overhead is minimal (~0.018ms per node for fast nodes)
3. **Async Efficiency**: 20 async nodes with 1ms delay each = ~23ms total (only ~3ms overhead)
4. **Event System**: Event listeners add minimal overhead (~0.4ms per node vs ~0.47ms base)
5. **Validation Speed**: Complex graph validation (100 nodes) takes only 0.16ms
6. **Consistency**: Low standard deviations indicate stable, predictable performance

### Performance Targets for Phase 1

After implementing the execution plan architecture, we should maintain:

- ✅ **Linear scenarios**: Within ±10% of baseline (should stay under 2ms for 100 fast nodes)
- ✅ **Complex scenarios**: Within ±15% of baseline (under 2ms for 50-node complex graph)
- ✅ **Async scenarios**: Within ±5% of baseline (async overhead should remain minimal)
- ✅ **Overall average**: No more than 10% performance regression across all scenarios

### Phase 1 Post-Implementation Results

**To be completed after Phase 1 implementation**

| Scenario | Baseline Avg | Phase 1 Avg | Difference | % Change | Status |
|----------|--------------|-------------|------------|----------|--------|
| Linear: 10 Fast | 0.474 ms | TBD | TBD | TBD | ⏳ Pending |
| Linear: 50 Fast | 0.981 ms | TBD | TBD | TBD | ⏳ Pending |
| Linear: 100 Fast | 1.842 ms | TBD | TBD | TBD | ⏳ Pending |
| Linear: 20 Medium | 1.210 ms | TBD | TBD | TBD | ⏳ Pending |
| Linear: 10 Slow | 8.941 ms | TBD | TBD | TBD | ⏳ Pending |
| Fan-Out: 10 | 0.622 ms | TBD | TBD | TBD | ⏳ Pending |
| Fan-Out: 50 | 1.089 ms | TBD | TBD | TBD | ⏳ Pending |
| Diamond: 5 | 0.412 ms | TBD | TBD | TBD | ⏳ Pending |
| Complex: 50 | 1.647 ms | TBD | TBD | TBD | ⏳ Pending |
| Async: 20 | 23.549 ms | TBD | TBD | TBD | ⏳ Pending |
| Events: 20 | 0.805 ms | TBD | TBD | TBD | ⏳ Pending |
| Validation: 100 | 0.160 ms | TBD | TBD | TBD | ⏳ Pending |
| **Overall Average** | **3.477 ms** | **TBD** | **TBD** | **TBD** | ⏳ Pending |

### How to Run Benchmarks

```bash
# From core package
cd packages/core
npm run test:benchmark

# From project root
npm run test:benchmark -w @reactflo/core

# Save results to file
npm run test:benchmark > benchmark-results.txt 2>&1
```

---

## Architecture Philosophy

### Design Principles

1. **Separation of Concerns**
   - **Plan Building**: Analyze workflow structure → Create execution plan
   - **Plan Execution**: Execute plan steps → Manage state
   - **Debugging**: Control execution flow → Inspect state

2. **Execution Plan as First-Class Citizen**
   - Plan is a data structure representing the complete execution flow
   - Can be serialized, visualized, and analyzed before execution
   - Enables "compile-time" optimizations and validations

3. **Step-Based Execution**
   - Every operation is a discrete step
   - Each step can be paused, inspected, and resumed
   - Natural fit for debugging and monitoring

4. **Extensibility Through Step Types**
   - New control flow pattern = new step type
   - Each step type has its own execution logic
   - No need to modify core executor

### Why This Approach?

**Current Serial Executor Issues:**
- ❌ Can't skip nodes based on runtime conditions
- ❌ Can't repeat nodes (loops)
- ❌ Can't execute nodes in parallel
- ❌ No natural pause points for debugging

**Execution Plan Benefits:**
- ✅ Explicit control flow representation
- ✅ Runtime path determination
- ✅ Natural debugging checkpoints
- ✅ Performance optimization opportunities

---

## Core Concepts

### Execution Plan

An **Execution Plan** is a tree structure representing the complete execution flow of a workflow. It contains a sequence of **steps** that the executor traverses.

```typescript
class ExecutionPlan {
  steps: ExecutionPlanStep[];
  
  // Methods
  flatten(): ExecutionPlanStep[]
  getBreakpoints(): NodeId[]
  serialize(): SerializedPlan
}
```

### Execution Plan Steps

Steps are the atomic units of execution. Each step type represents a different execution pattern:

| Step Type | Purpose | Example |
|-----------|---------|---------|
| `NodeExecutionStep` | Execute a regular node | Math.Add, HTTP.Request |
| `ConditionalStep` | Branch based on condition | If/Else, Switch/Case |
| `LoopStep` | Repeat execution | For, While, ForEach |
| `ParallelStep` | Execute branches concurrently | Promise.all, Promise.race |
| `MergeStep` | Synchronize parallel branches | Join, Wait |

### Control Flow Nodes

Special node types that influence execution flow:

- **IConditionalNode**: Returns which branch to execute
- **ILoopNode**: Determines loop continuation
- **IParallelNode**: Specifies parallel branches

---

## System Components

### 1. ExecutionPlanBuilder

**Responsibility**: Analyze workflow graph and build execution plan.

**Key Methods**:
- `build(workflow: Workflow): ExecutionPlan`
- `buildStepsForNode(nodeId: NodeId): ExecutionPlanStep[]`
- `buildConditionalStep(node: IConditionalNode): ConditionalStep`
- `buildLoopStep(node: ILoopNode): LoopStep`
- `buildParallelStep(node: IParallelNode): ParallelStep`

**Algorithm**:
1. Start from entry nodes (nodes with no incoming edges)
2. Traverse graph in topological order
3. When encountering control flow node:
   - Analyze node type
   - Build appropriate step type
   - Recursively build steps for each branch
4. Return completed plan

**Example**:
```
Workflow:
  Input → If → [Then → Add, Else → Multiply] → Output

Execution Plan:
  Step 1: NodeExecutionStep(Input)
  Step 2: ConditionalStep(If) {
    branches: [
      { condition: 'then', steps: [NodeExecutionStep(Add)] },
      { condition: 'else', steps: [NodeExecutionStep(Multiply)] }
    ]
  }
  Step 3: NodeExecutionStep(Output)
```

### 2. PlanExecutor

**Responsibility**: Execute the plan step-by-step with full control.

**Key Methods**:
- `execute(plan: ExecutionPlan, workflow: Workflow, context: ExecutionContext): Promise<ExecutionResult>`
- `executeStep(step: ExecutionPlanStep): Promise<void>`
- `executeNodeStep(step: NodeExecutionStep): Promise<void>`
- `executeConditionalStep(step: ConditionalStep): Promise<void>`
- `executeLoopStep(step: LoopStep): Promise<void>`
- `executeParallelStep(step: ParallelStep): Promise<void>`

**Debugging Methods**:
- `pause(): void`
- `resume(): void`
- `stepOver(): void`
- `stepInto(): void`
- `stepOut(): void`
- `setBreakpoint(nodeId: NodeId): void`
- `removeBreakpoint(nodeId: NodeId): void`

**Execution Loop**:
```typescript
for (let i = 0; i < plan.steps.length; i++) {
  this._currentStep = i;
  const step = plan.steps[i];
  
  // Check pause/breakpoints
  await this.checkPause();
  
  // Check cancellation
  if (context.isCancelled()) {
    throw new CancellationError(/*...*/);
  }
  
  // Execute step
  await this.executeStep(step, workflow, context);
}
```

### 3. Updated Executor

**Responsibility**: Orchestrate plan building and execution with event system.

**Changes from Current**:
- Replace topological sort execution with plan execution
- Add plan builder and plan executor
- Expose debugging API (pause, resume, step, breakpoint)
- Emit new events (onPlanBuilt, onStepStart, onStepComplete)

**API**:
```typescript
class Executor extends AsyncEventEmitter<ExecutorEvents> {
  // Existing
  execute(workflow: Workflow, options: ExecutionOptions): Promise<ExecutionResult>
  cancel(executionId: ExecutionId): boolean
  
  // New - Debugging
  pause(): void
  resume(): void
  stepOver(): void
  stepInto(): void
  stepOut(): void
  setBreakpoint(nodeId: NodeId): void
  removeBreakpoint(nodeId: NodeId): void
  getExecutionState(): ExecutionState
}
```

### 4. Control Flow Node Interfaces

**IConditionalNode**:
```typescript
interface IConditionalNode extends Node {
  evaluateCondition(): string; // Returns active branch identifier
}
```

**ILoopNode**:
```typescript
interface ILoopNode extends Node {
  loopType: 'for' | 'while' | 'forEach';
  condition: string;
  maxIterations?: number;
  
  evaluateLoopCondition(
    iteration: number, 
    context: ExecutionContext
  ): Promise<boolean>;
}
```

**IParallelNode**:
```typescript
interface IParallelNode extends Node {
  getBranches(): string[]; // Returns output port IDs to execute in parallel
}
```

---

## Execution Flow

### Complete Execution Sequence

```
1. User calls executor.execute(workflow, options)
   ↓
2. Executor validates workflow
   ↓
3. Executor creates ExecutionContext
   ↓
4. ExecutionPlanBuilder.build(workflow)
   ├─ Analyze workflow structure
   ├─ Identify control flow nodes
   ├─ Build step tree recursively
   └─ Return ExecutionPlan
   ↓
5. Emit 'onPlanBuilt' event with plan
   ↓
6. PlanExecutor.execute(plan, workflow, context)
   ├─ For each step in plan:
   │  ├─ Check pause state
   │  ├─ Check breakpoints
   │  ├─ Check cancellation
   │  ├─ Execute step based on type
   │  └─ Update context
   └─ Return
   ↓
7. Build ExecutionResult from context
   ↓
8. Emit 'afterExecute' event
   ↓
9. Return ExecutionResult to user
```

### Step Execution Details

**NodeExecutionStep**:
```
1. Check breakpoint
2. Transfer data from connected nodes
3. Inject execution context into node
4. Call node.run() (validate → execute → update state)
5. Extract outputs from node
6. Store result in context
7. Emit 'onNodeComplete' event
```

**ConditionalStep**:
```
1. Execute control node to evaluate condition
2. Call node.evaluateCondition() to get active branch
3. Find matching branch in plan
4. Recursively execute branch steps
5. Continue with next step after conditional
```

**LoopStep**:
```
1. Initialize iteration counter
2. Loop:
   ├─ Check max iterations
   ├─ Call node.evaluateLoopCondition(iteration, context)
   ├─ If false, break
   ├─ Execute loop body steps
   ├─ Increment iteration
   └─ Check cancellation
3. Continue with next step after loop
```

**ParallelStep**:
```
1. Create promise for each branch
2. Each promise executes its steps sequentially
3. If waitForAll: Promise.all(branches)
   If race: Promise.race(branches)
4. Merge results (if MergeStep follows)
5. Continue with next step
```

---

## Control Flow Patterns

### 1. Conditional Execution (If/Else)

**Workflow Structure**:
```
Input → If(condition) → [Then Branch, Else Branch] → Merge → Output
```

**Execution Plan**:
```typescript
{
  type: 'conditional',
  controlNodeId: 'if-1',
  branches: [
    {
      condition: 'thenOutput',
      steps: [
        { type: 'node', nodeId: 'then-node-1' },
        { type: 'node', nodeId: 'then-node-2' }
      ]
    },
    {
      condition: 'elseOutput',
      steps: [
        { type: 'node', nodeId: 'else-node-1' }
      ]
    }
  ]
}
```

**Runtime Behavior**:
- If condition is true → Execute Then Branch steps
- If condition is false → Execute Else Branch steps
- Other branch steps are never executed

**Node Implementation**:
```typescript
@defineNode({
  type: 'flow.if',
  label: 'If/Else',
  category: 'Flow Control'
})
export class IfNode extends Node implements IConditionalNode {
  @Input({ type: 'boolean', label: 'Condition', required: true })
  condition: boolean = false;

  @Output({ type: 'any', label: 'Then' })
  thenOutput: any;

  @Output({ type: 'any', label: 'Else' })
  elseOutput: any;

  execute(): void {
    // Data flows through the active branch
  }

  evaluateCondition(): string {
    return this.condition ? 'thenOutput' : 'elseOutput';
  }
}
```

### 2. Switch/Case

**Workflow Structure**:
```
Input → Switch(value) → [Case 1, Case 2, Case 3, Default] → Merge → Output
```

**Execution Plan**:
```typescript
{
  type: 'conditional',
  controlNodeId: 'switch-1',
  branches: [
    { condition: 'case1', steps: [...] },
    { condition: 'case2', steps: [...] },
    { condition: 'case3', steps: [...] },
    { condition: 'default', steps: [...] }
  ]
}
```

**Node Implementation**:
```typescript
@defineNode({
  type: 'flow.switch',
  label: 'Switch/Case',
  category: 'Flow Control'
})
export class SwitchNode extends Node implements IConditionalNode {
  @Input({ type: 'any', label: 'Value', required: true })
  value: any;

  @Input({ type: 'array', label: 'Cases' })
  cases: any[] = [];

  @Output({ type: 'any', label: 'Case 1' })
  case1: any;

  @Output({ type: 'any', label: 'Case 2' })
  case2: any;

  @Output({ type: 'any', label: 'Default' })
  default: any;

  execute(): void {
    // Data flows through matching case
  }

  evaluateCondition(): string {
    const matchingCase = this.cases.findIndex(c => c === this.value);
    if (matchingCase >= 0) {
      return `case${matchingCase + 1}`;
    }
    return 'default';
  }
}
```

### 3. For Loop

**Workflow Structure**:
```
Input → ForLoop(start, end, step) → [Body Nodes] → Loop Back or Continue → Output
```

**Execution Plan**:
```typescript
{
  type: 'loop',
  controlNodeId: 'for-1',
  loopType: 'for',
  condition: 'index < end',
  body: [
    { type: 'node', nodeId: 'body-node-1' },
    { type: 'node', nodeId: 'body-node-2' }
  ],
  maxIterations: 1000
}
```

**Runtime Behavior**:
- Initialize loop counter
- Each iteration:
  - Evaluate condition
  - If true, execute body steps
  - Increment counter
  - Repeat
- After loop completes, continue to next step

**Node Implementation**:
```typescript
@defineNode({
  type: 'flow.for',
  label: 'For Loop',
  category: 'Flow Control'
})
export class ForLoopNode extends Node implements ILoopNode {
  loopType: 'for' = 'for';

  @Input({ type: 'number', label: 'Start', defaultValue: 0 })
  start: number = 0;

  @Input({ type: 'number', label: 'End', required: true })
  end: number = 10;

  @Input({ type: 'number', label: 'Step', defaultValue: 1 })
  step: number = 1;

  @Output({ type: 'number', label: 'Index' })
  index: number = 0;

  @Output({ type: 'any', label: 'Body' })
  body: any;

  condition: string = 'index < end';
  maxIterations: number = 1000;

  execute(): void {
    this.body = this.index;
  }

  async evaluateLoopCondition(
    iteration: number,
    context: ExecutionContext
  ): Promise<boolean> {
    this.index = this.start + (iteration * this.step);
    return this.index < this.end;
  }
}
```

### 4. While Loop

**Workflow Structure**:
```
Input → WhileLoop(condition) → [Body Nodes] → Evaluate Condition → Loop or Continue → Output
```

**Node Implementation**:
```typescript
@defineNode({
  type: 'flow.while',
  label: 'While Loop',
  category: 'Flow Control'
})
export class WhileLoopNode extends Node implements ILoopNode {
  loopType: 'while' = 'while';

  @Input({ type: 'boolean', label: 'Condition', required: true })
  condition: boolean = true;

  @Output({ type: 'any', label: 'Body' })
  body: any;

  maxIterations: number = 1000;

  execute(): void {
    // Condition is evaluated before each iteration
  }

  async evaluateLoopCondition(
    iteration: number,
    context: ExecutionContext
  ): Promise<boolean> {
    return this.condition;
  }
}
```

### 5. ForEach Loop

**Workflow Structure**:
```
Input → ForEach(array) → [Body Nodes with current item] → Next Item or Continue → Output
```

**Node Implementation**:
```typescript
@defineNode({
  type: 'flow.forEach',
  label: 'ForEach Loop',
  category: 'Flow Control'
})
export class ForEachLoopNode extends Node implements ILoopNode {
  loopType: 'forEach' = 'forEach';

  @Input({ type: 'array', label: 'Array', required: true })
  array: any[] = [];

  @Output({ type: 'any', label: 'Current Item' })
  currentItem: any;

  @Output({ type: 'number', label: 'Index' })
  index: number = 0;

  @Output({ type: 'any', label: 'Body' })
  body: any;

  condition: string = 'index < array.length';
  maxIterations?: number;

  execute(): void {
    this.body = this.currentItem;
  }

  async evaluateLoopCondition(
    iteration: number,
    context: ExecutionContext
  ): Promise<boolean> {
    this.index = iteration;
    if (iteration < this.array.length) {
      this.currentItem = this.array[iteration];
      return true;
    }
    return false;
  }
}
```

### 6. Parallel Execution

**Workflow Structure**:
```
Input → Parallel → [Branch A, Branch B, Branch C] → Merge → Output
```

**Execution Plan**:
```typescript
{
  type: 'parallel',
  branches: [
    [{ type: 'node', nodeId: 'branch-a-1' }, { type: 'node', nodeId: 'branch-a-2' }],
    [{ type: 'node', nodeId: 'branch-b-1' }],
    [{ type: 'node', nodeId: 'branch-c-1' }]
  ],
  waitForAll: true
}
```

**Runtime Behavior**:
- Create Promise for each branch
- Execute all branches concurrently
- If waitForAll=true: Wait for all (Promise.all)
- If waitForAll=false: First to complete (Promise.race)
- Continue with next step

**Node Implementation**:
```typescript
@defineNode({
  type: 'flow.parallel',
  label: 'Parallel Execution',
  category: 'Flow Control'
})
export class ParallelNode extends Node implements IParallelNode {
  @Input({ type: 'any', label: 'Input' })
  input: any;

  @Input({ type: 'boolean', label: 'Wait For All', defaultValue: true })
  waitForAll: boolean = true;

  @Output({ type: 'any', label: 'Branch A' })
  branchA: any;

  @Output({ type: 'any', label: 'Branch B' })
  branchB: any;

  @Output({ type: 'any', label: 'Branch C' })
  branchC: any;

  execute(): void {
    this.branchA = this.input;
    this.branchB = this.input;
    this.branchC = this.input;
  }

  getBranches(): string[] {
    return ['branchA', 'branchB', 'branchC'];
  }
}
```

---

## Debugging Support

### Breakpoints

**Set Breakpoint**:
```typescript
executor.setBreakpoint('node-id-123');
```

**Remove Breakpoint**:
```typescript
executor.removeBreakpoint('node-id-123');
```

**Execution Flow**:
1. Executor reaches step with breakpoint
2. Executor pauses before executing step
3. Emits 'onBreakpoint' event
4. User can inspect state, variables, outputs
5. User calls resume() or stepOver()

### Pause/Resume

**Pause Execution**:
```typescript
executor.pause();
```

**Resume Execution**:
```typescript
executor.resume();
```

**Use Case**: User wants to pause execution to inspect state without setting breakpoints.

### Step Operations

**Step Over**:
```typescript
executor.stepOver();
```
- Execute current step
- Pause before next step
- If current step is conditional/loop, execute entire block

**Step Into**:
```typescript
executor.stepInto();
```
- If current step is conditional/loop, pause at first child step
- Otherwise, same as step over

**Step Out**:
```typescript
executor.stepOut();
```
- Continue execution until current conditional/loop completes
- Pause at next step after block

### Execution State Introspection

**Get Current Execution State**:
```typescript
interface ExecutionState {
  executionId: string;
  currentStep: number;
  totalSteps: number;
  currentNodeId?: NodeId;
  isPaused: boolean;
  breakpoints: Set<NodeId>;
  nodeResults: Map<NodeId, NodeExecutionResult>;
  variables: Record<string, unknown>;
  loopStacks: LoopStackFrame[]; // For nested loops
}

const state = executor.getExecutionState();
```

**Use Cases**:
- Display current execution position in UI
- Show which node is currently executing
- Display variable values
- Show loop iteration counts

### Debugging Events

New events emitted by executor:

```typescript
interface ExecutorEvents {
  // Existing
  beforeExecute: (context: ExecutionContext, plan: ExecutionPlan) => void | Promise<void>;
  afterExecute: (result: ExecutionResult) => void | Promise<void>;
  onNodeStart: (nodeId: string, node: Node) => void | Promise<void>;
  onNodeComplete: (nodeId: string, result: NodeExecutionResult) => void | Promise<void>;
  onNodeError: (nodeId: string, error: Error) => void | Promise<void>;
  onError: (error: Error) => void | Promise<void>;
  onCancellation: (executionId: string, reason: CancellationReason, cancelledAt: Date) => void | Promise<void>;

  // New
  onPlanBuilt: (plan: ExecutionPlan) => void | Promise<void>;
  onStepStart: (step: ExecutionPlanStep, stepIndex: number) => void | Promise<void>;
  onStepComplete: (step: ExecutionPlanStep, stepIndex: number) => void | Promise<void>;
  onBreakpoint: (nodeId: string, state: ExecutionState) => void | Promise<void>;
  onPause: (state: ExecutionState) => void | Promise<void>;
  onResume: (state: ExecutionState) => void | Promise<void>;
  onLoopIteration: (loopNodeId: string, iteration: number) => void | Promise<void>;
  onBranchEnter: (branchId: string, condition: string) => void | Promise<void>;
  onBranchExit: (branchId: string) => void | Promise<void>;
}
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)

**Goal**: Establish execution plan foundation without control flow.

#### Week 1: Plan Structure & Builder

**Tasks**:

1. **✅ Create ExecutionPlanStep type definitions** [4 hours] **COMPLETED**
   - File: `packages/types/src/execution.ts`
   - ✅ Define `ExecutionPlanStep` union type
   - ✅ Define `NodeExecutionStep` interface
   - ✅ Define `ConditionalStep` interface (stub)
   - ✅ Define `LoopStep` interface (stub)
   - ✅ Define `ParallelStep` interface (stub)
   - ✅ Define `MergeStep` interface (stub)
   - ✅ Export all types from index

2. **✅ Create ExecutionPlan class** [3 hours] **COMPLETED**
   - File: `packages/core/src/execution/ExecutionPlan.ts`
   - ✅ Implement constructor with steps array
   - ✅ Implement `flatten()` method (depth-first traversal)
   - ✅ Implement `getBreakpoints()` method
   - ✅ Implement `serialize()` method
   - ✅ Add basic validation (no cycles, valid steps)
   - ✅ Write unit tests (28 tests passing)

3. **Create ExecutionPlanBuilder class (basic)** [8 hours]
   - File: `packages/core/src/execution/ExecutionPlanBuilder.ts`
   - Implement `build(workflow: Workflow): ExecutionPlan`
   - Implement `buildStepsForNode(nodeId, workflow, visited): ExecutionPlanStep[]`
   - For now, only handle regular nodes (NodeExecutionStep)
   - Use workflow.getExecutionOrder() as guide
   - Add graph traversal utilities (getDownstreamNodes)
   - Write unit tests with simple linear workflows

4. **Add plan builder to Executor** [3 hours]
   - File: `packages/core/src/execution/Executor.ts`
   - Add `_planBuilder: ExecutionPlanBuilder` property
   - In `execute()`, call `planBuilder.build(workflow)`
   - Store plan in execution context or executor state
   - Add `onPlanBuilt` event emission
   - Keep existing serial execution for now (parallel path)
   - Write integration test

**Deliverables**:
- ✅ ExecutionPlanStep types defined
- ✅ ExecutionPlan class with tests
- ✅ ExecutionPlanBuilder (basic) with tests
- ✅ Integration with Executor (dual-path execution)
- ✅ 20+ tests passing

#### Week 2: Plan Executor

**Tasks**:

1. **Create PlanExecutor class** [6 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `execute(plan, workflow, context, options): Promise<ExecutionResult>`
   - Implement main execution loop (iterate over plan.steps)
   - Implement `executeStep(step, workflow, context): Promise<void>`
   - For now, only handle NodeExecutionStep type
   - Add cancellation checks in loop
   - Add timeout support
   - Write unit tests

2. **Implement NodeExecutionStep execution** [4 hours]
   - In PlanExecutor
   - Implement `executeNodeStep(step, workflow, context): Promise<void>`
   - Transfer data from connected nodes
   - Inject execution context into node
   - Call node.run()
   - Extract outputs
   - Store result in context
   - Emit events (onNodeStart, onNodeComplete)
   - Write unit tests

3. **Replace serial execution with plan execution** [5 hours]
   - File: `packages/core/src/execution/Executor.ts`
   - Remove topological sort execution loop
   - Replace with `planExecutor.execute(plan, workflow, context, options)`
   - Update error handling for plan execution
   - Ensure all events still fire correctly
   - Update ExecutionResult building
   - Update all integration tests

4. **Add step-level events** [3 hours]
   - Add `onStepStart` event to ExecutorEvents interface
   - Add `onStepComplete` event to ExecutorEvents interface
   - Emit events in PlanExecutor execution loop
   - Update event documentation
   - Write event tests

**Deliverables**:
- ✅ PlanExecutor class with tests
- ✅ NodeExecutionStep execution working
- ✅ Serial execution replaced with plan execution
- ✅ All existing tests still passing
- ✅ 30+ new tests

**Validation**:
- Run full test suite: `npm test`
- Verify examples still work: `npm run dev` and test examples
- No breaking changes to existing API
- Performance should be similar or better

---

### Phase 2: Conditional Flow (Week 3-4)

**Goal**: Implement if/else and switch/case control flow.

#### Week 3: Conditional Infrastructure

**Tasks**:

1. **Define IConditionalNode interface** [2 hours]
   - File: `packages/types/src/node.ts`
   - Define interface extending Node
   - Add `evaluateCondition(): string` method
   - Document interface with JSDoc
   - Export from index

2. **Implement ConditionalStep building** [8 hours]
   - File: `packages/core/src/execution/ExecutionPlanBuilder.ts`
   - Add `isConditionalNode(node): boolean` check
   - Implement `buildConditionalStep(node, workflow, visited): ConditionalStep`
   - For each output port of conditional node:
     - Get downstream nodes connected to that port
     - Recursively build steps for downstream nodes
     - Add as branch with condition = output port ID
   - Handle nested conditionals correctly
   - Write comprehensive unit tests

3. **Implement ConditionalStep execution** [8 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `executeConditionalStep(step, workflow, context): Promise<void>`
   - Execute control node to get condition result
   - Call `node.evaluateCondition()` to get active branch
   - Find matching branch in step.branches
   - Recursively execute branch steps
   - Handle case where no branch matches
   - Add `onBranchEnter` and `onBranchExit` events
   - Write unit tests

4. **Add conditional step support to main execution loop** [2 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Add case for 'conditional' in executeStep switch
   - Wire up to executeConditionalStep
   - Test with nested conditionals
   - Write integration tests

**Deliverables**:
- ✅ IConditionalNode interface defined
- ✅ ConditionalStep building implemented
- ✅ ConditionalStep execution implemented
- ✅ 25+ tests for conditional logic

#### Week 4: Conditional Nodes

**Tasks**:

1. **Implement IfNode** [4 hours]
   - File: `packages/core/src/nodes/flow/IfNode.ts`
   - Extend Node, implement IConditionalNode
   - Add @defineNode decorator
   - Add @Input for condition (boolean)
   - Add @Input for data passthrough
   - Add @Output for 'then' branch
   - Add @Output for 'else' branch
   - Implement execute() method
   - Implement evaluateCondition() method
   - Write unit tests

2. **Implement SwitchNode** [4 hours]
   - File: `packages/core/src/nodes/flow/SwitchNode.ts`
   - Extend Node, implement IConditionalNode
   - Add @Input for value (any)
   - Add @Input for cases (array)
   - Add @Output for each case (dynamic or fixed)
   - Add @Output for default case
   - Implement execute() method
   - Implement evaluateCondition() method
   - Write unit tests

3. **Create flow nodes directory and exports** [2 hours]
   - Create: `packages/core/src/nodes/flow/index.ts`
   - Export IfNode
   - Export SwitchNode
   - Update: `packages/core/src/index.ts` to export flow nodes
   - Document flow nodes in README

4. **Create conditional workflow examples** [4 hours]
   - File: `packages/examples/src/examples/ConditionalWorkflow.tsx`
   - Create example with IfNode
   - Create example with SwitchNode
   - Create example with nested conditionals
   - Add to examples app navigation
   - Document examples

5. **Integration testing** [4 hours]
   - Create complex workflows with conditionals
   - Test nested conditionals (if inside if)
   - Test conditionals with loops (Phase 3 preview)
   - Test error handling in branches
   - Test data propagation through branches
   - Write end-to-end tests

**Deliverables**:
- ✅ IfNode implemented and tested
- ✅ SwitchNode implemented and tested
- ✅ Flow nodes directory structure
- ✅ Working examples in examples app
- ✅ 30+ tests for conditional nodes
- ✅ Documentation updated

**Validation**:
- Create workflow with IfNode in examples app
- Verify only one branch executes
- Verify data flows correctly through branches
- Check performance with complex conditionals

---

### Phase 3: Loop Flow (Week 5-6)

**Goal**: Implement for, while, and forEach loops.

#### Week 5: Loop Infrastructure

**Tasks**:

1. **Define ILoopNode interface** [2 hours]
   - File: `packages/types/src/node.ts`
   - Define interface extending Node
   - Add loopType property ('for' | 'while' | 'forEach')
   - Add condition property (string)
   - Add maxIterations property (number, optional)
   - Add `evaluateLoopCondition(iteration, context): Promise<boolean>` method
   - Document interface with JSDoc
   - Export from index

2. **Enhance ExecutionContext for loops** [3 hours]
   - File: `packages/core/src/execution/ExecutionContext.ts`
   - Add `_loopStacks: Map<NodeId, LoopStackFrame[]>` property
   - Define LoopStackFrame type (iteration, variables, etc.)
   - Add methods:
     - `pushLoopFrame(nodeId, frame): void`
     - `popLoopFrame(nodeId): LoopStackFrame`
     - `getCurrentLoopFrame(nodeId): LoopStackFrame`
     - `getLoopIteration(nodeId): number`
   - Write unit tests

3. **Implement LoopStep building** [10 hours]
   - File: `packages/core/src/execution/ExecutionPlanBuilder.ts`
   - Add `isLoopNode(node): boolean` check
   - Implement `buildLoopStep(node, workflow, visited): LoopStep`
   - Get loop body nodes (connected to 'body' output port)
   - Recursively build steps for body nodes
   - Handle nested loops correctly (don't revisit in outer loop)
   - Mark loop exit nodes (nodes after loop)
   - Add loop step to plan with body steps
   - Write comprehensive unit tests

4. **Implement LoopStep execution** [10 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `executeLoopStep(step, workflow, context): Promise<void>`
   - Initialize iteration counter
   - Loop:
     - Check maxIterations (throw error if exceeded)
     - Call node.evaluateLoopCondition(iteration, context)
     - If false, break loop
     - Push loop frame to context
     - Execute loop body steps sequentially
     - Pop loop frame from context
     - Increment iteration
     - Check cancellation (allow cancelling mid-loop)
     - Emit onLoopIteration event
   - After loop completes, continue with next step
   - Write unit tests

5. **Add loop step support to main execution loop** [2 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Add case for 'loop' in executeStep switch
   - Wire up to executeLoopStep
   - Test with nested loops
   - Write integration tests

**Deliverables**:
- ✅ ILoopNode interface defined
- ✅ ExecutionContext enhanced for loop tracking
- ✅ LoopStep building implemented
- ✅ LoopStep execution implemented
- ✅ 30+ tests for loop logic

#### Week 6: Loop Nodes

**Tasks**:

1. **Implement ForLoopNode** [5 hours]
   - File: `packages/core/src/nodes/flow/ForLoopNode.ts`
   - Extend Node, implement ILoopNode
   - Add @Input for start (number, default 0)
   - Add @Input for end (number, required)
   - Add @Input for step (number, default 1)
   - Add @Output for index (number)
   - Add @Output for body (any)
   - Implement execute() method
   - Implement evaluateLoopCondition() method
   - Set maxIterations = 10000 (safety)
   - Write unit tests

2. **Implement WhileLoopNode** [5 hours]
   - File: `packages/core/src/nodes/flow/WhileLoopNode.ts`
   - Extend Node, implement ILoopNode
   - Add @Input for condition (boolean, required)
   - Add @Output for body (any)
   - Implement execute() method
   - Implement evaluateLoopCondition() method
   - Set maxIterations = 10000 (safety)
   - Write unit tests with condition updates

3. **Implement ForEachLoopNode** [5 hours]
   - File: `packages/core/src/nodes/flow/ForEachLoopNode.ts`
   - Extend Node, implement ILoopNode
   - Add @Input for array (array, required)
   - Add @Output for currentItem (any)
   - Add @Output for index (number)
   - Add @Output for body (any)
   - Implement execute() method
   - Implement evaluateLoopCondition() method
   - Write unit tests

4. **Update flow nodes exports** [1 hour]
   - File: `packages/core/src/nodes/flow/index.ts`
   - Export ForLoopNode
   - Export WhileLoopNode
   - Export ForEachLoopNode
   - Update documentation

5. **Create loop workflow examples** [6 hours]
   - File: `packages/examples/src/examples/LoopWorkflow.tsx`
   - Create example with ForLoopNode
   - Create example with WhileLoopNode
   - Create example with ForEachLoopNode
   - Create example with nested loops (for inside for)
   - Create example with loop + conditional (if inside loop)
   - Add to examples app
   - Document examples

6. **Integration testing** [6 hours]
   - Test basic loop execution
   - Test nested loops (loop inside loop)
   - Test loop + conditional (various combinations)
   - Test loop cancellation (mid-loop)
   - Test loop with max iterations exceeded
   - Test infinite loop prevention
   - Write end-to-end tests

**Deliverables**:
- ✅ ForLoopNode implemented and tested
- ✅ WhileLoopNode implemented and tested
- ✅ ForEachLoopNode implemented and tested
- ✅ Working loop examples in examples app
- ✅ 40+ tests for loop nodes
- ✅ Documentation updated

**Validation**:
- Create workflow with ForLoopNode that runs 10 iterations
- Verify loop body executes correct number of times
- Verify loop variables (index) update correctly
- Test nested loop (loop inside loop)
- Verify performance with large iterations

---

### Phase 4: Parallel Execution (Week 7-8)

**Goal**: Implement parallel execution of independent branches.

#### Week 7: Parallel Infrastructure

**Tasks**:

1. **Define IParallelNode interface** [2 hours]
   - File: `packages/types/src/node.ts`
   - Define interface extending Node
   - Add `getBranches(): string[]` method
   - Add waitForAll property (boolean)
   - Document interface with JSDoc
   - Export from index

2. **Design parallel execution strategy** [4 hours]
   - Research and document approaches:
     - Promise.all for wait-all
     - Promise.race for first-to-complete
     - Promise.allSettled for continue-on-error
   - Consider context isolation (clone context per branch?)
   - Consider data merging (merge results from branches)
   - Document decisions in this file

3. **Implement ParallelStep building** [8 hours]
   - File: `packages/core/src/execution/ExecutionPlanBuilder.ts`
   - Add `isParallelNode(node): boolean` check
   - Implement `buildParallelStep(node, workflow, visited): ParallelStep`
   - For each output port (branch):
     - Get downstream nodes connected to that port
     - Recursively build steps for downstream nodes
     - Add as separate branch array
   - Determine where branches merge (common downstream node)
   - Add MergeStep if needed
   - Write unit tests

4. **Implement ParallelStep execution** [10 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `executeParallelStep(step, workflow, context): Promise<void>`
   - Create promise for each branch
   - Each promise executes its branch steps sequentially
   - Decide: Clone context per branch or share?
   - If waitForAll=true: Use Promise.all
   - If waitForAll=false: Use Promise.race
   - Handle errors in branches (fail fast or collect?)
   - Emit events for parallel execution
   - Write unit tests

5. **Add parallel step support to main execution loop** [2 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Add case for 'parallel' in executeStep switch
   - Wire up to executeParallelStep
   - Test with multiple parallel branches
   - Write integration tests

6. **Implement MergeStep execution** [4 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `executeMergeStep(step, workflow, context): Promise<void>`
   - Collect results from all source nodes
   - Merge data (strategy TBD - could be node-specific)
   - Continue execution
   - Write unit tests

**Deliverables**:
- ✅ IParallelNode interface defined
- ✅ ParallelStep building implemented
- ✅ ParallelStep execution implemented
- ✅ MergeStep execution implemented
- ✅ 30+ tests for parallel logic

#### Week 8: Parallel Nodes

**Tasks**:

1. **Implement ParallelNode** [5 hours]
   - File: `packages/core/src/nodes/flow/ParallelNode.ts`
   - Extend Node, implement IParallelNode
   - Add @Input for input data
   - Add @Input for waitForAll (boolean, default true)
   - Add @Output for branchA
   - Add @Output for branchB
   - Add @Output for branchC
   - Implement execute() method (distribute input to branches)
   - Implement getBranches() method
   - Write unit tests

2. **Implement RaceNode** [4 hours]
   - File: `packages/core/src/nodes/flow/RaceNode.ts`
   - Similar to ParallelNode but waitForAll=false
   - First branch to complete wins
   - Other branches are cancelled
   - Write unit tests

3. **Implement MergeNode** [4 hours]
   - File: `packages/core/src/nodes/flow/MergeNode.ts`
   - Extend Node
   - Add @Input for multiple branches (dynamic?)
   - Add @Output for merged result
   - Implement different merge strategies:
     - Concatenate arrays
     - Merge objects
     - Take first non-null
   - Write unit tests

4. **Update flow nodes exports** [1 hour]
   - File: `packages/core/src/nodes/flow/index.ts`
   - Export ParallelNode
   - Export RaceNode
   - Export MergeNode
   - Update documentation

5. **Create parallel workflow examples** [6 hours]
   - File: `packages/examples/src/examples/ParallelWorkflow.tsx`
   - Create example with ParallelNode (wait for all)
   - Create example with RaceNode (first wins)
   - Create example with parallel + merge
   - Create example with parallel + error handling
   - Add to examples app
   - Document examples

6. **Integration testing** [8 hours]
   - Test basic parallel execution (2-3 branches)
   - Test parallel with different execution times
   - Test race conditions (first to finish)
   - Test parallel + conditional (parallel inside if)
   - Test parallel + loop (parallel inside loop)
   - Test error in one branch (fail fast vs continue)
   - Write end-to-end tests
   - Performance testing with many parallel branches

**Deliverables**:
- ✅ ParallelNode implemented and tested
- ✅ RaceNode implemented and tested
- ✅ MergeNode implemented and tested
- ✅ Working parallel examples in examples app
- ✅ 35+ tests for parallel nodes
- ✅ Documentation updated

**Validation**:
- Create workflow with ParallelNode that executes 3 branches
- Verify all branches execute concurrently
- Measure execution time (should be ~max branch time, not sum)
- Verify race condition works correctly
- Test error handling in parallel branches

---

### Phase 5: Debugging Support (Week 9-10)

**Goal**: Implement comprehensive debugging capabilities.

#### Week 9: Debugging Infrastructure

**Tasks**:

1. **Enhance PlanExecutor with debug state** [4 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Add properties:
     - `_currentStep: number`
     - `_paused: boolean`
     - `_breakpoints: Set<NodeId>`
     - `_stepMode: 'over' | 'into' | 'out' | null`
   - Add `getCurrentStep(): number` method
   - Add `isPaused(): boolean` method
   - Write unit tests

2. **Implement pause/resume mechanism** [4 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `pause(): void` - Sets _paused flag
   - Implement `resume(): void` - Clears _paused flag
   - Implement `checkPause(): Promise<void>` - Polls pause state
   - Call checkPause() before each step execution
   - Emit 'onPause' and 'onResume' events
   - Write unit tests

3. **Implement breakpoint system** [5 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `setBreakpoint(nodeId): void`
   - Implement `removeBreakpoint(nodeId): void`
   - Implement `clearBreakpoints(): void`
   - Implement `hasBreakpoint(nodeId): boolean`
   - Check for breakpoint before executing NodeExecutionStep
   - If breakpoint hit, pause and emit 'onBreakpoint' event
   - Write unit tests

4. **Implement step operations** [8 hours]
   - File: `packages/core/src/execution/PlanExecutor.ts`
   - Implement `stepOver(): void`
     - Execute current step
     - Pause before next step
     - If current step is conditional/loop, execute entire block
   - Implement `stepInto(): void`
     - If current step is conditional/loop, pause at first child step
     - Otherwise, same as step over
   - Implement `stepOut(): void`
     - Execute until current conditional/loop completes
     - Pause at next step after block
   - Track step depth for nested blocks
   - Write comprehensive unit tests

5. **Add debugging methods to Executor** [3 hours]
   - File: `packages/core/src/execution/Executor.ts`
   - Expose PlanExecutor debugging methods:
     - `pause(): void`
     - `resume(): void`
     - `stepOver(): void`
     - `stepInto(): void`
     - `stepOut(): void`
     - `setBreakpoint(nodeId): void`
     - `removeBreakpoint(nodeId): void`
   - Add to Executor API documentation
   - Write integration tests

6. **Define ExecutionState interface** [3 hours]
   - File: `packages/types/src/execution.ts`
   - Define comprehensive state interface:
     - executionId
     - currentStep
     - totalSteps
     - currentNodeId
     - isPaused
     - breakpoints
     - nodeResults
     - variables
     - loopStacks
   - Implement `getExecutionState(): ExecutionState` in Executor
   - Write unit tests

**Deliverables**:
- ✅ Pause/resume implemented
- ✅ Breakpoint system implemented
- ✅ Step operations implemented
- ✅ ExecutionState interface defined
- ✅ Debugging API in Executor
- ✅ 30+ tests for debugging features

#### Week 10: Debugging UI & Testing

**Tasks**:

1. **Create debugging events** [3 hours]
   - File: `packages/types/src/execution.ts`
   - Add to ExecutorEvents:
     - onPlanBuilt
     - onStepStart
     - onStepComplete
     - onBreakpoint
     - onPause
     - onResume
     - onLoopIteration
     - onBranchEnter
     - onBranchExit
   - Document all events
   - Update event tests

2. **Create DebugPanel component** [8 hours]
   - File: `packages/react/src/components/DebugPanel/DebugPanel.tsx`
   - Display current execution state
   - Show current node being executed (highlight)
   - Display variable values
   - Display loop iteration counts
   - Show call stack (for nested loops/conditionals)
   - Add play/pause button
   - Add step over/into/out buttons
   - Add breakpoint list
   - Wire up to executor events
   - Style component

3. **Add breakpoint support to CustomNode** [4 hours]
   - File: `packages/react/src/components/Node/CustomNode.tsx`
   - Add breakpoint indicator (red dot)
   - Add click handler to toggle breakpoint
   - Update node style when breakpoint is set
   - Highlight node when breakpoint is hit
   - Update component tests

4. **Create debugging example** [6 hours]
   - File: `packages/examples/src/examples/DebugWorkflow.tsx`
   - Create workflow with conditionals, loops, and parallel
   - Add DebugPanel component
   - Demonstrate breakpoints
   - Demonstrate step operations
   - Demonstrate state inspection
   - Add to examples app
   - Document debugging features

5. **Integration testing** [8 hours]
   - Test pause/resume during execution
   - Test breakpoints in various node types
   - Test step over in linear workflow
   - Test step into conditional branches
   - Test step into loop bodies
   - Test step out of nested blocks
   - Test debugging with parallel execution
   - Test debugging with errors
   - Write end-to-end tests

6. **Documentation** [3 hours]
   - Create debugging guide: `docs/debugging.md`
   - Document all debugging APIs
   - Document debugging events
   - Add debugging examples
   - Update main README with debugging section

**Deliverables**:
- ✅ Debugging events defined and tested
- ✅ DebugPanel component implemented
- ✅ Breakpoint support in CustomNode
- ✅ Working debugging example in examples app
- ✅ 25+ tests for debugging UI
- ✅ Comprehensive debugging documentation

**Validation**:
- Set breakpoint on node in workflow
- Execute workflow
- Verify execution pauses at breakpoint
- Use step over to execute next node
- Use step into to enter loop/conditional
- Inspect variables and node outputs
- Resume execution to completion

---

### Phase 6: Testing, Polish & Documentation (Week 11-12)

**Goal**: Comprehensive testing, optimization, and documentation.

#### Week 11: Comprehensive Testing

**Tasks**:

1. **Unit test audit** [6 hours]
   - Review all new unit tests
   - Ensure 90%+ code coverage for new code
   - Add missing test cases
   - Add edge case tests
   - Add error condition tests
   - Run coverage report

2. **Integration test suite** [8 hours]
   - Test all control flow combinations:
     - Conditional + Loop
     - Loop + Parallel
     - Nested conditionals (3+ levels)
     - Nested loops (3+ levels)
     - Parallel + Conditional
   - Test error propagation through control flow
   - Test cancellation in various scenarios
   - Test timeout in long-running workflows
   - Test memory usage with large workflows

3. **Performance testing** [6 hours]
   - Create benchmark workflows:
     - 100 sequential nodes
     - 10 nested loops (10 iterations each)
     - 50 parallel branches
     - Complex nested control flow
   - Measure execution time
   - Measure memory usage
   - Profile plan building performance
   - Identify and fix bottlenecks
   - Document performance characteristics

4. **End-to-end test suite** [8 hours]
   - Create real-world workflow examples:
     - Data processing pipeline with conditionals
     - Batch processing with loops
     - Fan-out/fan-in with parallel
     - Complex business logic workflow
   - Test in examples app
   - Test with step debugging
   - Test error recovery
   - Test long-running workflows
   - Test workflow serialization/deserialization

**Deliverables**:
- ✅ 90%+ code coverage
- ✅ Comprehensive integration tests
- ✅ Performance benchmarks
- ✅ End-to-end test suite
- ✅ 100+ total new tests

#### Week 12: Polish & Documentation

**Tasks**:

1. **API polish** [4 hours]
   - Review all new public APIs
   - Ensure consistency with existing APIs
   - Add JSDoc comments to all public methods
   - Add TypeScript documentation comments
   - Ensure proper type exports
   - Update type definitions

2. **Error messages improvement** [4 hours]
   - Review all error messages
   - Make errors more descriptive
   - Add error codes for each error type
   - Add suggestions for common errors
   - Document error handling patterns
   - Create error handling guide

3. **Update main documentation** [6 hours]
   - Update README.md with control flow features
   - Update core-concepts.md with execution plan
   - Update getting-started.md with examples
   - Create execution-plan-guide.md (user-facing)
   - Update API reference
   - Add migration guide (from serial to plan execution)

4. **Create tutorial series** [8 hours]
   - Tutorial 1: "Your First Conditional Workflow"
   - Tutorial 2: "Working with Loops"
   - Tutorial 3: "Parallel Execution Patterns"
   - Tutorial 4: "Debugging Workflows"
   - Tutorial 5: "Complex Control Flow Patterns"
   - Add tutorials to docs/tutorials/
   - Link from main README

5. **Example workflows** [6 hours]
   - Polish existing examples
   - Add comments to example code
   - Create README for each example
   - Add visual diagrams of workflows
   - Test all examples work correctly
   - Add to examples app with descriptions

6. **Update PROJECT_STATUS.md** [2 hours]
   - Mark Phase 3.5 as complete
   - Update progress percentages
   - Document new features
   - Update roadmap
   - Add Phase 4 details (React package completion)

**Deliverables**:
- ✅ Polished APIs with full documentation
- ✅ Improved error messages
- ✅ Updated documentation (all files)
- ✅ Tutorial series (5 tutorials)
- ✅ Polished examples
- ✅ Updated project status

**Validation**:
- Review all documentation for accuracy
- Test all code examples in documentation
- Verify all tutorials work end-to-end
- Get feedback from team/contributors
- Run final test suite (all tests passing)

---

## API Reference

### ExecutionPlanBuilder

```typescript
class ExecutionPlanBuilder {
  /**
   * Build execution plan from workflow
   * @param workflow - Workflow to analyze
   * @returns Execution plan
   */
  build(workflow: Workflow): ExecutionPlan;

  /**
   * Build steps for a specific node
   * @param nodeId - Node to build steps for
   * @param workflow - Parent workflow
   * @param visited - Set of already visited nodes
   * @returns Array of execution steps
   */
  buildStepsForNode(
    nodeId: NodeId,
    workflow: Workflow,
    visited: Set<NodeId>
  ): ExecutionPlanStep[];

  /**
   * Build conditional step for branching
   * @param node - Conditional node
   * @param workflow - Parent workflow
   * @param visited - Set of already visited nodes
   * @returns Conditional step
   */
  buildConditionalStep(
    node: IConditionalNode,
    workflow: Workflow,
    visited: Set<NodeId>
  ): ConditionalStep;

  /**
   * Build loop step for iteration
   * @param node - Loop node
   * @param workflow - Parent workflow
   * @param visited - Set of already visited nodes
   * @returns Loop step
   */
  buildLoopStep(
    node: ILoopNode,
    workflow: Workflow,
    visited: Set<NodeId>
  ): LoopStep;

  /**
   * Build parallel step for concurrent execution
   * @param node - Parallel node
   * @param workflow - Parent workflow
   * @param visited - Set of already visited nodes
   * @returns Parallel step
   */
  buildParallelStep(
    node: IParallelNode,
    workflow: Workflow,
    visited: Set<NodeId>
  ): ParallelStep;
}
```

### PlanExecutor

```typescript
class PlanExecutor {
  /**
   * Execute an execution plan
   * @param plan - Plan to execute
   * @param workflow - Workflow being executed
   * @param context - Execution context
   * @param options - Execution options
   * @returns Execution result
   */
  execute(
    plan: ExecutionPlan,
    workflow: Workflow,
    context: ExecutionContext,
    options: ExecutionOptions
  ): Promise<ExecutionResult>;

  /**
   * Pause execution
   */
  pause(): void;

  /**
   * Resume execution
   */
  resume(): void;

  /**
   * Execute current step and pause at next
   */
  stepOver(): void;

  /**
   * Step into conditional/loop if current step is one
   */
  stepInto(): void;

  /**
   * Execute until current block completes
   */
  stepOut(): void;

  /**
   * Set breakpoint on a node
   * @param nodeId - Node to break on
   */
  setBreakpoint(nodeId: NodeId): void;

  /**
   * Remove breakpoint from a node
   * @param nodeId - Node to remove breakpoint from
   */
  removeBreakpoint(nodeId: NodeId): void;

  /**
   * Get current step index
   * @returns Current step index
   */
  getCurrentStep(): number;
}
```

### Executor (Updated)

```typescript
class Executor extends AsyncEventEmitter<ExecutorEvents> {
  /**
   * Execute a workflow using execution plan
   * @param workflow - Workflow to execute
   * @param options - Execution options
   * @returns Execution result
   */
  execute(
    workflow: Workflow,
    options?: ExecutionOptions
  ): Promise<ExecutionResult>;

  // Debugging API
  pause(): void;
  resume(): void;
  stepOver(): void;
  stepInto(): void;
  stepOut(): void;
  setBreakpoint(nodeId: NodeId): void;
  removeBreakpoint(nodeId: NodeId): void;
  getExecutionState(): ExecutionState;

  // Existing
  cancel(executionId: ExecutionId): boolean;
  cancelAll(): number;
  isExecutionActive(executionId: ExecutionId): boolean;
}
```

---

## Examples

### Example 1: Simple If/Else Workflow

```typescript
import { Workflow, Executor } from '@reactflo/core';
import { NumberInputNode, IfNode, AddNode, MultiplyNode, DisplayNode } from './nodes';

// Create workflow
const workflow = new Workflow('if-else-example', 'If/Else Example');

// Add nodes
const input = workflow.addNode('input.number', { data: { value: 5 } });
const condition = workflow.addNode('flow.if');
const add = workflow.addNode('math.add', { data: { b: 10 } });
const multiply = workflow.addNode('math.multiply', { data: { b: 2 } });
const display = workflow.addNode('output.display');

// Connect nodes
workflow.connect(input.id, 'value', condition.id, 'condition');
workflow.connect(condition.id, 'thenOutput', add.id, 'a');
workflow.connect(condition.id, 'elseOutput', multiply.id, 'a');
workflow.connect(add.id, 'sum', display.id, 'value');
workflow.connect(multiply.id, 'product', display.id, 'value');

// Execute
const executor = new Executor();
const result = await executor.execute(workflow);

console.log('Result:', result);
// If input >= 5: displays 15 (5 + 10)
// If input < 5: displays 10 (5 * 2)
```

### Example 2: For Loop Workflow

```typescript
import { Workflow, Executor } from '@reactflo/core';
import { ForLoopNode, AddNode, DisplayNode } from './nodes';

// Create workflow
const workflow = new Workflow('for-loop-example', 'For Loop Example');

// Add nodes
const forLoop = workflow.addNode('flow.for', {
  data: { start: 0, end: 10, step: 1 }
});
const add = workflow.addNode('math.add', { data: { b: 1 } });
const display = workflow.addNode('output.display');

// Connect nodes (loop body)
workflow.connect(forLoop.id, 'index', add.id, 'a');
workflow.connect(add.id, 'sum', display.id, 'value');

// Execute
const executor = new Executor();
executor.on('onLoopIteration', (loopNodeId, iteration) => {
  console.log(`Iteration ${iteration}`);
});

const result = await executor.execute(workflow);
// Displays: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```

### Example 3: Parallel Execution Workflow

```typescript
import { Workflow, Executor } from '@reactflo/core';
import { ParallelNode, HttpRequestNode, MergeNode, DisplayNode } from './nodes';

// Create workflow
const workflow = new Workflow('parallel-example', 'Parallel Example');

// Add nodes
const parallel = workflow.addNode('flow.parallel');
const request1 = workflow.addNode('http.request', {
  data: { url: 'https://api.example.com/data1' }
});
const request2 = workflow.addNode('http.request', {
  data: { url: 'https://api.example.com/data2' }
});
const request3 = workflow.addNode('http.request', {
  data: { url: 'https://api.example.com/data3' }
});
const merge = workflow.addNode('flow.merge');
const display = workflow.addNode('output.display');

// Connect nodes
workflow.connect(parallel.id, 'branchA', request1.id, 'trigger');
workflow.connect(parallel.id, 'branchB', request2.id, 'trigger');
workflow.connect(parallel.id, 'branchC', request3.id, 'trigger');
workflow.connect(request1.id, 'response', merge.id, 'input1');
workflow.connect(request2.id, 'response', merge.id, 'input2');
workflow.connect(request3.id, 'response', merge.id, 'input3');
workflow.connect(merge.id, 'output', display.id, 'value');

// Execute
const executor = new Executor();
const result = await executor.execute(workflow);
// All 3 HTTP requests execute in parallel
// Merge waits for all to complete
// Display shows merged result
```

### Example 4: Debugging Workflow

```typescript
import { Workflow, Executor } from '@reactflo/core';

const workflow = new Workflow('debug-example', 'Debug Example');
// ... add nodes ...

const executor = new Executor();

// Set breakpoint
executor.setBreakpoint('node-id-123');

// Listen to debug events
executor.on('onBreakpoint', (nodeId, state) => {
  console.log('Breakpoint hit at node:', nodeId);
  console.log('Current state:', state);
  
  // Inspect variables
  console.log('Variables:', state.variables);
  
  // Resume after inspection
  setTimeout(() => executor.resume(), 2000);
});

// Execute
const result = await executor.execute(workflow);
```

---

## Summary

This architecture provides a solid foundation for advanced workflow execution with:

- **Control Flow**: Conditionals, loops, parallel execution
- **Debugging**: Breakpoints, pause/resume, step operations
- **Extensibility**: Easy to add new control flow patterns
- **Performance**: Optimized plan building and execution
- **Developer Experience**: Clear APIs, comprehensive documentation

The phased implementation approach ensures steady progress with working features at each milestone, thorough testing, and proper documentation.

**Total Estimated Time**: 12 weeks (480 hours)
**Team Size**: 1-2 developers
**Complexity**: High
**Impact**: Transformational for ReactFlo

**Next Steps**:
1. Review and approve this architecture
2. Set up project tracking (GitHub issues/milestones)
3. Begin Phase 1 implementation
4. Regular progress reviews (weekly)
5. Gather feedback from early testing
