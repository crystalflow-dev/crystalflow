# GitHub Copilot Instructions for ReactFlo

## Project Overview

ReactFlo is a declarative workflow builder framework that provides tools for creating custom workflow applications. It uses TypeScript decorators for node definitions, React Flow for the UI layer, and includes a complete execution engine with JSON serialization.

**Core Principle:** "We build the how, you focus on the what."

## Important: No Backward Compatibility Required

**Version 1.0.0 has not been published yet.** Therefore:

- **DO NOT maintain backward compatibility** for any changes
- **DO NOT keep deprecated methods** or legacy code
- **DO NOT add compatibility layers** or fallback logic
- Feel free to make breaking changes to improve the codebase
- Focus on clean, maintainable code over compatibility concerns

Once version 1.0.0 is published, semantic versioning and backward compatibility rules will apply.

## Architecture

```
User Applications (decorated nodes)
         ↓
@reactflo/react (bridges decorators → React Flow)
         ↓
React Flow (canvas, rendering, UI primitives)
         ↓
@reactflo/core (execution engine, validation)
```

## Technology Stack

- **TypeScript 5.3+** with strict mode and experimental decorators
- **React 18+** for UI components
- **React Flow 11+** for visual workflow canvas
- **Monaco Editor** for JSON editing
- **Reflect-metadata** for decorator metadata
- **Jest** for testing
- **ESLint + Prettier** for code quality

## Package Structure (Monorepo)

```
packages/
├── core/          # Node system, workflow engine, execution (zero dependencies)
├── types/         # Shared TypeScript type definitions
├── react/         # React components (depends on React Flow + Monaco)
├── cli/           # CLI tools (future)
└── plugins/       # Official plugins (future)
```

## Key Concepts

### 1. Decorator-Based Node Definitions

Nodes are defined using TypeScript decorators:

```typescript
@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

**Important:**

- Decorators are for Node classes (business logic), not React components
- React components consume decorated nodes
- `experimentalDecorators: true` is enabled in tsconfig

### 2. JSON Workflow Format

All workflows are serializable to/from JSON:

```json
{
  "version": "1.0.0",
  "id": "workflow-id",
  "name": "Workflow Name",
  "nodes": [...],
  "connections": [...],
  "variables": {}
}
```

- Schema version: 1.0.0
- Formal JSON Schema at `schema/workflow.schema.json`
- Utilities: `serializeWorkflow()`, `deserializeWorkflow()`, `validateWorkflowJSON()`

### 3. React Flow Integration

The visual builder is built on React Flow:

- Don't reinvent canvas/pan/zoom - use React Flow
- Bridge decorated nodes → React Flow nodes
- Custom node renderer based on metadata

### 4. Dual-Mode Editing

The UI supports:

- **Visual Mode** - Drag-and-drop node editor
- **JSON Mode** - Monaco Editor for code editing
- **Split Mode** - Both views with real-time sync

## Coding Conventions

### File Naming

- **PascalCase** for classes: `Node.ts`, `Workflow.ts`, `NodeRegistry.ts`
- **camelCase** for utilities: `logger.ts`, `serialization.ts`
- **lowercase** for folders: `node/`, `workflow/`, `execution/`
- **Test files**: `*.test.ts` or `*.spec.ts`

### Code Style

- Use **strict TypeScript** - avoid `any` unless necessary
- Prefer **interfaces** over types for object shapes
- Use **arrow functions** for callbacks
- Use **async/await** over promises
- Export **named exports** (no default exports)

### Error Handling

```typescript
import { ExecutionError, NodeExecutionError, ValidationError, TimeoutError } from '@reactflo/core';

// Execution errors include context
throw new NodeExecutionError(`Failed to execute node ${nodeId}`, {
  nodeId,
  nodeType: 'math.add',
  executionId,
  workflowId,
  cause: error
});

// All execution errors have executionId and workflowId
catch (error) {
  if (error instanceof NodeExecutionError) {
    console.error(`Node ${error.nodeId} of type ${error.nodeType} failed`);
  }
}
```

### Logging

```typescript
import { Logger } from './utils/logger';

const logger = new Logger('ComponentName');
logger.debug('Message', { context });
logger.error('Error occurred', error);
```

## Package-Specific Guidelines

### @reactflo/core

- **Zero external dependencies** (except reflect-metadata) - keep it lightweight
- All exports must be in `src/index.ts`
- Use `reflect-metadata` for decorator metadata
- Validate all inputs and throw descriptive errors
- Node base class provides: validate(), execute(), run(), reset(), toJSON(), fromJSON()
- Use index signature `[key: string]: unknown` for dynamic properties
- Prefer `unknown` over `any` for type safety

### @reactflo/types

- Pure type definitions only
- No runtime code
- Export all types from `src/index.ts`

### @reactflo/react

- Use React 18+ features (hooks, concurrent mode)
- Leverage React Flow - don't rebuild canvas
- Use Monaco Editor for JSON editing
- All components should be functional (no classes)
- Use TypeScript generics for reusable components

## Important Patterns

### Node Registration

```typescript
import { NodeRegistry } from '@reactflo/core';

const registry = NodeRegistry.getInstance();
registry.register(AddNode);
registry.register(MultiplyNode);
```

### Workflow Creation and Execution

```typescript
import { Workflow, Executor } from '@reactflo/core';

const workflow = new Workflow();
workflow.addNode(AddNode, { position: { x: 100, y: 100 } });
workflow.connect('sourceNodeId', 'outputPort', 'targetNodeId', 'inputPort');

// Execute workflow (returns ExecutionResult)
const result = await workflow.execute({
  timeout: 30000,
  variables: { apiKey: 'xxx' },
});

// Or use Executor directly with events
const executor = new Executor();
executor.on('onNodeStart', (nodeId, node) => {
  console.log(`Node ${nodeId} starting...`);
});
const result = await executor.execute(workflow, options);
```

### Serialization

```typescript
import { serializeWorkflow, deserializeWorkflow } from '@reactflo/core';

// Export
const json = serializeWorkflow(workflow.toJSON());

// Import
const workflowData = deserializeWorkflow(json);
const workflow = Workflow.fromJSON(workflowData);
```

### React Component Usage

```tsx
import { WorkflowBuilder } from '@reactflo/react';

<WorkflowBuilder
  nodes={[AddNode, MultiplyNode]}
  showJsonEditor={true}
  editorMode="split"
  onWorkflowChange={(workflow) => console.log(workflow)}
/>;
```

## Testing Guidelines

- Write tests alongside implementation
- Use descriptive test names: `it('should add node to workflow', ...)`
- Mock external dependencies
- Test both success and error cases
- Aim for 80%+ coverage

Example:

```typescript
describe('NodeRegistry', () => {
  describe('register', () => {
    it('should register a node type', () => {
      const registry = new NodeRegistry();
      registry.register(AddNode);
      expect(registry.has('math.add')).toBe(true);
    });
  });
});
```

## Common Tasks

### Creating a New Node Type

1. Extend `Node` base class
2. Add `@defineNode` decorator with metadata
3. Define inputs with `@Input` decorators
4. Define outputs with `@Output` decorators
5. Implement `execute()` method
6. Export from package index

### Adding a New Utility

1. Create file in `packages/core/src/utils/`
2. Export functions (not default export)
3. Add to `packages/core/src/index.ts`
4. Write tests in `__tests__/` folder

### Adding a React Component

1. Create in `packages/react/src/components/`
2. Use functional components with TypeScript
3. Define prop types interface
4. Export from `packages/react/src/index.ts`

## Best Practices

1. **Type Everything** - Leverage TypeScript fully
2. **Document Public APIs** - Use JSDoc comments
3. **Keep Core Lightweight** - @reactflo/core has zero deps
4. **Validate Inputs** - Check types and required fields
5. **Use Decorators for Nodes** - Not for React components
6. **Leverage React Flow** - Don't rebuild canvas features
7. **Serialize Everything** - All workflows must be JSON-compatible
8. **Test as You Go** - Write tests alongside features

## Documentation

- All public APIs should have JSDoc comments
- Update README when adding features
- Create guides in `docs/` for major features
- Keep examples simple and working

## Commit Messages

Follow Conventional Commits:

```
feat(core): add async node execution support
fix(react): prevent connection to incompatible ports
docs(readme): update installation instructions
test(executor): add async execution tests
```

## What NOT to Do

❌ Don't use default exports
❌ Don't add dependencies to @reactflo/core
❌ Don't use decorators on React components
❌ Don't rebuild canvas/pan/zoom (use React Flow)
❌ Don't use `any` type without good reason
❌ Don't commit without tests
❌ Don't break JSON serialization compatibility

## Related Files

- Architecture: `docs/core-concepts.md`
- JSON Schema: `docs/json-schema.md`, `schema/workflow.schema.json`
- Decorators: `docs/decorators-in-react.md`
- JSON Editor: `docs/json-editor.md`
- Project Status: `PROJECT_STATUS.md`
- Quick Reference: `QUICK_REFERENCE.md`

## Current Status

- **Phase:** Phase 4 🚧 IN PROGRESS (React Package - Structure Initialized)
- **Completed:**
  - Phase 1 (Node System - 100%)
  - Phase 2 (Workflow System - 100%)
  - Phase 3 (Basic Execution Engine - 100%)
  - Phase 4 - React Package Structure (100%)
- **In Progress:** Phase 4 - React Component Implementation
- **Next:** Full component implementation with React Flow bridge
- **Tests:** 215 passing tests across all packages

## Execution Engine (Phase 3 - COMPLETED)

The serial execution engine is fully implemented with:

### Core Components

- **Executor** - Main orchestrator with AsyncEventEmitter support
- **ExecutionContext** - Manages state, variables, timing, and node results
- **Error Classes** - ExecutionError, NodeExecutionError, ValidationError, TimeoutError
- **AsyncEventEmitter** - Custom event emitter that supports async listeners

### Features

- ✅ Serial execution (nodes execute sequentially in topological order)
- ✅ Automatic data propagation between connected nodes
- ✅ Event system with async support (beforeExecute, afterExecute, onNodeStart, onNodeComplete, onNodeError, onError)
- ✅ Error handling (stops on first error with detailed context)
- ✅ Timing and duration tracking for workflow and nodes
- ✅ Variables support (pass variables to execution context)
- ✅ Full JSON serialization of ExecutionResult
- ✅ Workflow validation before execution
- ✅ AbortSignal support for cancellation

### Event System

The Executor uses `AsyncEventEmitter` which supports both synchronous and asynchronous event listeners. The executor will wait for all listeners (including async ones) to complete before continuing execution.

```typescript
const executor = new Executor();

// Synchronous event listeners
executor.on('beforeExecute', (context) => {
  console.log('Starting execution...');
});

// Asynchronous event listeners - executor waits for them!
executor.on('onNodeStart', async (nodeId, node) => {
  await logToDatabase(nodeId); // ✅ Executor waits
  await sendWebhook(node); // ✅ Executor waits
  console.log(`Executing ${nodeId}`);
});

executor.on('onNodeComplete', async (nodeId, result) => {
  await persistToStorage(result); // ✅ Executor waits
  console.log(`${nodeId} completed:`, result.outputs);
});

executor.on('onNodeError', async (nodeId, error) => {
  await notifyErrorService(error); // ✅ Executor waits
  console.error(`${nodeId} failed:`, error);
});

executor.on('afterExecute', async (result) => {
  await saveExecutionResult(result); // ✅ Executor waits
  console.log(`Execution ${result.status}`);
});

const result = await executor.execute(workflow, options);
```

**Key Features:**

- Both sync and async listeners are supported
- Executor waits for all listeners to complete before continuing
- Multiple listeners on the same event execute in parallel (via Promise.all)
- If any listener throws/rejects, execution stops with that error

### ExecutionResult

```typescript
interface ExecutionResult {
  id: string; // Unique execution ID
  workflowId: string; // Workflow being executed
  status: ExecutionStatus; // success, failed, cancelled
  startTime: Date; // When execution started
  endTime?: Date; // When execution ended
  duration?: number; // Duration in milliseconds
  nodeResults: Map<NodeId, NodeExecutionResult>; // Results for each node
  error?: Error; // Error if execution failed
}

interface NodeExecutionResult {
  nodeId: string;
  state: NodeState; // Success, Error
  outputs: Record<string, any>; // All output values (fully serializable)
  error?: Error;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}
```

### Execution Flow

1. Validate workflow (cycles, connections, required inputs)
2. Create ExecutionContext with unique executionId
3. Get topological order of nodes from Graph
4. For each node sequentially:
   - Check for cancellation (between nodes)
   - Emit `onNodeStart`
   - Transfer data from connected predecessor nodes
   - Execute node (validate → execute → update state)
   - Store execution result with outputs
   - Emit `onNodeComplete`
   - If error: emit `onNodeError` and stop execution
5. Return ExecutionResult with all timing and node data

### Cancellation System (ENHANCED - Phase 5 COMPLETE)

ReactFlo provides comprehensive cancellation support:

**Cancellation Mechanisms:**
- ✅ **Timeout-based** - Set `timeout` in execution options
- ✅ **User-initiated** - Call `executor.cancel(executionId, reason)`
- ✅ **External signal** - Pass `abortSignal` in execution options
- ✅ **Between-node checks** - Automatic checks in execution loop
- ✅ **Mid-node checks** - Nodes call `this.checkCancellation()`

**Cancellation Reasons:**
- `timeout` - Execution exceeded timeout limit
- `user-cancelled` - User explicitly cancelled via API
- `external-signal` - Cancelled via AbortController/AbortSignal
- `resource-limit` - Resource constraints (reserved for future)

**Error Hierarchy:**
```typescript
CancellationError (base)
├── TimeoutError
└── UserCancelledError
```

**Cancellation API:**
```typescript
// Cancel specific execution
executor.cancel(executionId, CancellationReason.UserCancelled);

// Cancel all active executions
executor.cancelAll(CancellationReason.UserCancelled);

// Check if execution is active
if (executor.isExecutionActive(executionId)) {
  executor.cancel(executionId);
}

// Listen to cancellation events
executor.on('onCancellation', (executionId, reason, cancelledAt) => {
  console.log(`Execution ${executionId} cancelled: ${reason}`);
});
```

**Mid-Node Cancellation:**
```typescript
class LongRunningNode extends Node {
  async execute() {
    for (let i = 0; i < 1000; i++) {
      this.checkCancellation(); // Throws CancellationError if cancelled
      await processItem(i);
    }
  }
}
```

**ExecutionResult with Cancellation:**
```typescript
interface ExecutionResult {
  status: 'success' | 'failed' | 'cancelled';
  cancellationReason?: CancellationReason;
  cancelledAt?: Date;
  // ... other fields
}
```

## React Package (Phase 4 - IN PROGRESS)

The React package structure has been initialized with:

### Package Structure

- **Components** - All UI components stubbed
  - WorkflowBuilder: Main workflow builder with React Flow integration
  - CustomNode: Node renderer based on decorator metadata
  - NodePalette: Drag-and-drop node palette
  - PropertyPanel: Property inspector for selected nodes
  - Toolbar: Workflow action buttons
  - ConnectionLine: Custom connection renderer

- **Context Providers**
  - WorkflowProvider: Global workflow state management
  - useWorkflowContext: Hook for accessing workflow context

- **Custom Hooks**
  - useWorkflow: Workflow operations and state
  - useNodeRegistry: Access to registered node types
  - useExecution: Workflow execution with event handlers

### Dependencies

- React Flow 11.10.0 - For canvas and node rendering
- Monaco Editor 4.6.0 - For JSON editing
- React 18+ and React DOM 18+

### Current State

- ✅ Package structure initialized
- ✅ All components stubbed with TypeScript types
- ✅ Context providers implemented
- ✅ Custom hooks implemented
- ✅ Barrel exports configured
- ✅ Package builds successfully
- ⏳ Full component implementation (next)

### Next Steps

1. Implement WorkflowBuilder with full React Flow bridge
2. Create decorator-to-React-Flow node converter
3. Implement CustomNode renderer with dynamic handles
4. Build NodePalette with registry integration
5. Create PropertyPanel with dynamic property inputs
6. Integrate Monaco Editor for JSON editing
7. Implement dual-mode editing with sync

## Control Flow Epic (REACTFLO-50)

The Control Flow & Advanced Execution epic includes:

- Engine support for conditional/branching execution
- Loop execution framework
- Parallel processing capabilities
- Control flow nodes (If/Else, Switch/Case, For/While loops)
- Advanced flow control (Try/Catch, Race, Parallel execution)

This epic bridges the execution engine with sophisticated workflow automation capabilities.

## Questions?

Check these files:

- `README.md` - Project overview
- `GET_STARTED.md` - Comprehensive guide
- `DOCUMENTATION_INDEX.md` - All documentation
- `QUICK_REFERENCE.md` - Developer commands
