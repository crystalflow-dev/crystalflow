# @crystalflow/core

Core workflow engine for CrystalFlow framework.

## Overview

This package contains the fundamental building blocks of CrystalFlow:

- **Node System:** Base classes and decorators for defining nodes
- **Workflow Engine:** Graph structure and connection management
- **Execution Engine:** Orchestration and execution of workflows
- **Type System:** Type definitions and validation
- **Event System:** Lifecycle hooks and event handling
- **Serialization:** JSON import/export with validation

## Installation

```bash
npm install @crystalflow/core
```

## Usage

### Define Nodes

```typescript
import { Node, defineNode, Input, Output } from '@crystalflow/core';

@defineNode({
  type: 'math.add',
  label: 'Add',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number' })
  a: number;

  @Input({ type: 'number' })
  b: number;

  @Output({ type: 'number' })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

### Execute Workflows

```typescript
import { Executor } from '@crystalflow/core';

const executor = new Executor();

// Simple execution
const result = await executor.execute(workflow);
console.log(result.status); // 'success', 'failed', or 'cancelled'
console.log(result.duration); // Execution time in ms

// With options
const result = await executor.execute(workflow, {
  timeout: 30000, // 30 second timeout
  variables: {
    apiKey: process.env.API_KEY,
  },
});
```

### Cancellation Support

CrystalFlow provides comprehensive workflow cancellation:

#### Timeout-Based Cancellation

```typescript
const result = await executor.execute(workflow, {
  timeout: 5000, // Cancel after 5 seconds
});

if (result.status === 'cancelled') {
  console.log('Cancelled:', result.cancellationReason); // 'timeout'
}
```

#### User-Initiated Cancellation

```typescript
import { CancellationReason } from '@crystalflow/core';

// Start execution
const promise = executor.execute(workflow);

// Cancel it
executor.cancel(result.id, CancellationReason.UserCancelled);

const result = await promise;
console.log(result.status); // 'cancelled'
console.log(result.cancelledAt); // Timestamp
```

#### External AbortSignal

```typescript
const controller = new AbortController();

const promise = executor.execute(workflow, {
  abortSignal: controller.signal,
});

// Cancel from outside
controller.abort();
```

#### Cancel All Executions

```typescript
// Execute multiple workflows
const promise1 = executor.execute(workflow1);
const promise2 = executor.execute(workflow2);

// Cancel all
executor.cancelAll(CancellationReason.UserCancelled);
```

### Mid-Node Cancellation

Long-running nodes should check for cancellation:

```typescript
@defineNode({
  type: 'processing.batch',
  label: 'Batch Processor',
  category: 'Processing',
})
class BatchProcessorNode extends Node {
  @Input({ type: 'array' })
  items: any[];

  @Output({ type: 'array' })
  results: any[] = [];

  async execute() {
    for (const item of this.items) {
      // Check if cancelled
      this.checkCancellation(); // Throws CancellationError if cancelled

      // Process item
      this.results.push(await processItem(item));
    }
  }
}
```

### Event Handling

```typescript
executor.on('onNodeStart', (nodeId, node) => {
  console.log(`Node ${nodeId} starting...`);
});

executor.on('onNodeComplete', (nodeId, result) => {
  console.log(`Node ${nodeId} completed:`, result.outputs);
});

executor.on('onCancellation', (executionId, reason, cancelledAt) => {
  console.log(`Execution cancelled: ${reason}`);
  // Clean up resources, notify users, etc.
});

executor.on('onError', (error) => {
  console.error('Execution failed:', error);
});
```

### Import/Export Workflows

```typescript
import { Workflow, serializeWorkflow, deserializeWorkflow } from '@crystalflow/core';

const workflow = new Workflow();
// ... build workflow ...

// Export to JSON
const json = serializeWorkflow(workflow.toJSON());
await fs.writeFile('workflow.json', json);

// Import from JSON
const loadedJson = await fs.readFile('workflow.json', 'utf-8');
const workflowData = deserializeWorkflow(loadedJson);
const loadedWorkflow = Workflow.fromJSON(workflowData);
```

## Error Handling

```typescript
import {
  ExecutionError,
  NodeExecutionError,
  CancellationError,
  TimeoutError,
  UserCancelledError,
} from '@crystalflow/core';

try {
  const result = await executor.execute(workflow, { timeout: 5000 });
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log('Timed out after', error.timeoutMs, 'ms');
  } else if (error instanceof UserCancelledError) {
    console.log('User cancelled at', error.cancelledAt);
  } else if (error instanceof NodeExecutionError) {
    console.log('Node failed:', error.nodeId, error.nodeType);
  } else if (error instanceof ExecutionError) {
    console.log('Execution error:', error.message);
  }
}
```

## API Reference

### Core Classes

- **Node** - Base class for all nodes
- **Workflow** - Workflow container and orchestrator
- **Executor** - Workflow execution engine
- **ExecutionContext** - Execution state management
- **NodeRegistry** - Node type registration

### Decorators

- **@defineNode** - Define node metadata
- **@Input** - Mark property as input port
- **@Output** - Mark property as output port

### Types

- **ExecutionResult** - Complete execution result with status and timing
- **NodeExecutionResult** - Individual node execution result
- **CancellationReason** - Enum of cancellation reasons
- **ExecutionStatus** - Enum of execution statuses

## License

MIT
