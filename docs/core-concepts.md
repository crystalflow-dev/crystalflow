# Core Concepts

Understanding the fundamental concepts of ReactFlo.

## Nodes

Nodes are the building blocks of workflows. Each node represents a single operation or task.

### Anatomy of a Node

```typescript
@defineNode({
  type: 'category.operation', // Unique identifier
  label: 'Display Name', // Human-readable name
  category: 'Category', // For organization
  description: 'What it does', // Optional description
})
class MyNode extends Node {
  // Inputs - data coming into the node
  @Input({ type: 'string' })
  inputValue: string;

  // Outputs - data going out of the node
  @Output({ type: 'string' })
  outputValue: string;

  // Execute method - where the logic happens
  execute() {
    this.outputValue = this.inputValue.toUpperCase();
  }
}
```

### Node Lifecycle

1. **Creation** - Node is instantiated
2. **Configuration** - Inputs are set
3. **Validation** - Inputs are validated
4. **Execution** - `execute()` method is called
5. **Completion** - Outputs are available

## Workflows

A workflow is a collection of connected nodes that execute in a specific order.

### Creating Workflows

```typescript
const workflow = new Workflow();

// Add nodes
const node1 = workflow.addNode(NodeClass1);
const node2 = workflow.addNode(NodeClass2);

// Connect nodes
workflow.connect({ nodeId: node1.id, portId: 'output' }, { nodeId: node2.id, portId: 'input' });

// Execute
await workflow.execute();
```

### Workflow Execution

ReactFlo automatically determines the execution order based on connections:

1. **Topological Sort** - Nodes are ordered based on dependencies
2. **Parallel Execution** - Independent nodes can run in parallel
3. **Error Handling** - Errors stop execution and can be caught

## Connections

Connections link outputs of one node to inputs of another.

### Connection Rules

- Output ports can connect to multiple input ports
- Input ports can only receive from one output port
- Ports must have compatible types

### Type System

ReactFlo includes a built-in type system:

- `string` - Text data
- `number` - Numeric data
- `boolean` - True/false values
- `object` - Complex data structures
- `array` - Lists of items
- `any` - Any type (use sparingly)

## Events

ReactFlo emits events during workflow execution:

```typescript
workflow.on('node:start', (nodeId) => {
  console.log(`Node ${nodeId} started`);
});

workflow.on('node:complete', (nodeId, result) => {
  console.log(`Node ${nodeId} completed`, result);
});

workflow.on('workflow:complete', (result) => {
  console.log('Workflow complete', result);
});
```

## Execution & Cancellation

### Basic Execution

Execute workflows with the Executor:

```typescript
import { Executor } from '@reactflo/core';

const executor = new Executor();
const result = await executor.execute(workflow);

console.log(result.status); // 'success', 'failed', or 'cancelled'
console.log(result.duration); // Execution time in ms
```

### Cancellation Support

ReactFlo provides comprehensive cancellation support for workflows:

#### 1. Timeout-Based Cancellation

```typescript
const result = await executor.execute(workflow, {
  timeout: 5000, // Cancel after 5 seconds
});

if (result.status === 'cancelled') {
  console.log('Workflow timed out');
  console.log(result.cancellationReason); // 'timeout'
}
```

#### 2. User-Initiated Cancellation

```typescript
// Start execution
const promise = executor.execute(workflow);

// Later, cancel it
executor.cancel(result.id, CancellationReason.UserCancelled);

const result = await promise;
console.log(result.status); // 'cancelled'
console.log(result.cancellationReason); // 'user-cancelled'
console.log(result.cancelledAt); // Timestamp
```

#### 3. External AbortSignal

```typescript
const controller = new AbortController();

// Execute with abort signal
const promise = executor.execute(workflow, {
  abortSignal: controller.signal,
});

// Cancel from outside
controller.abort();

const result = await promise;
console.log(result.cancellationReason); // 'external-signal'
```

#### 4. Cancel All Active Executions

```typescript
// Execute multiple workflows
const promise1 = executor.execute(workflow1);
const promise2 = executor.execute(workflow2);

// Cancel all
executor.cancelAll(CancellationReason.UserCancelled);

const results = await Promise.all([promise1, promise2]);
// Both will be cancelled
```

### Mid-Node Cancellation

Long-running nodes should check for cancellation:

```typescript
@defineNode({
  type: 'processing.longRunning',
  label: 'Long Running Task',
})
class LongRunningNode extends Node {
  @Output({ type: 'array' })
  results: any[] = [];

  async execute() {
    for (let i = 0; i < 1000; i++) {
      // Check if execution was cancelled
      this.checkCancellation(); // Throws CancellationError if cancelled

      // Do work
      this.results.push(await processItem(i));

      // Or use abortSignal for async operations
      if (this.abortSignal?.aborted) {
        throw new Error('Operation aborted');
      }
    }
  }
}
```

### Cancellation Events

Listen to cancellation events:

```typescript
executor.on('onCancellation', (executionId, reason, cancelledAt) => {
  console.log(`Execution ${executionId} cancelled`);
  console.log(`Reason: ${reason}`);
  console.log(`Time: ${cancelledAt}`);

  // Clean up resources, notify users, etc.
});
```

### Cancellation Reasons

ReactFlo tracks why execution was cancelled:

- `timeout` - Execution exceeded timeout limit
- `user-cancelled` - User explicitly cancelled
- `external-signal` - Cancelled via AbortSignal
- `resource-limit` - Resource constraints (future)

### Error Handling with Cancellation

```typescript
import {
  CancellationError,
  TimeoutError,
  UserCancelledError,
} from '@reactflo/core';

try {
  const result = await executor.execute(workflow, { timeout: 5000 });
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log('Workflow timed out after', error.timeoutMs, 'ms');
  } else if (error instanceof UserCancelledError) {
    console.log('User cancelled at', error.cancelledAt);
  } else if (error instanceof CancellationError) {
    console.log('Workflow cancelled:', error.reason);
  }
}
```

### Best Practices for Cancellation

1. **Add Timeouts** - Always set reasonable timeouts for production workflows
2. **Check Frequently** - Long-running nodes should call `checkCancellation()` regularly
3. **Clean Up Resources** - Use cancellation events to clean up connections, files, etc.
4. **Provide Feedback** - Listen to `onCancellation` to notify users
5. **Test Cancellation** - Test that your nodes handle cancellation gracefully

## Best Practices

1. **Single Responsibility** - Each node should do one thing well
2. **Type Safety** - Use specific types instead of `any`
3. **Error Handling** - Handle errors gracefully in your nodes
4. **Cancellation Support** - Long-running nodes should check for cancellation
5. **Documentation** - Add descriptions to your nodes and ports
6. **Testing** - Test your nodes in isolation

## Next Steps

- [API Reference](./api-reference/) - Detailed API documentation
- [Advanced Features](./advanced-features.md) - Conditional logic, loops, etc.
- [Examples](./examples/) - Real-world examples
