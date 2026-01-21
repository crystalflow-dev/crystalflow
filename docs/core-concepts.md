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

## Best Practices

1. **Single Responsibility** - Each node should do one thing well
2. **Type Safety** - Use specific types instead of `any`
3. **Error Handling** - Handle errors gracefully in your nodes
4. **Documentation** - Add descriptions to your nodes and ports
5. **Testing** - Test your nodes in isolation

## Next Steps

- [API Reference](./api-reference/) - Detailed API documentation
- [Advanced Features](./advanced-features.md) - Conditional logic, loops, etc.
- [Examples](./examples/) - Real-world examples
