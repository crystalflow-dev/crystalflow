# Getting Started with ReactFlo

This guide will help you get started with ReactFlo, a declarative workflow builder framework. Choose your path:

- **Visual Builder** - Drag-and-drop UI for building workflows (recommended for most users)
- **Core** - Programmatic workflow creation and execution

---

## Getting Started with Visual Builder

The visual builder provides a drag-and-drop interface for creating workflows with zero configuration.

### Installation

```bash
npm install @reactflo/core @reactflo/react
```

Or using yarn:

```bash
yarn add @reactflo/core @reactflo/react
```

### Using the Visual Builder

Create a React component with the WorkflowBuilder:

```tsx
import React from 'react';
import { WorkflowBuilder } from '@reactflo/react';
import { AddNode } from './nodes/AddNode';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowBuilder
        nodes={[AddNode]}
        onWorkflowChange={(workflow) => {
          console.log('Workflow changed:', workflow);
        }}
      />
    </div>
  );
}

export default App;
```

### Creating Custom Nodes

Define nodes using decorators to use them in the visual builder:

```typescript
import { Node, defineNode, Input, Output } from '@reactflo/core';

@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
  description: 'Adds two numbers together',
})
export class AddNode extends Node {
  @Input({
    type: 'number',
    label: 'First Number',
    required: true,
  })
  a: number = 0;

  @Input({
    type: 'number',
    label: 'Second Number',
    required: true,
  })
  b: number = 0;

  @Output({
    type: 'number',
    label: 'Sum',
  })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

Nodes you define will automatically appear in the node palette and can be dragged onto the canvas.

### Next Steps

- [Property System](../concepts/node-properties.md) - Add configurable properties to your nodes
- [Styling Customization](../advanced/styling-customization.md) - Customize the visual builder appearance
- [Examples](../examples/) - See complete example applications

---

## Getting Started with Core

Use the core package for programmatic workflow creation and execution without a UI.

### Installation

```bash
npm install @reactflo/core
```

Or using yarn:

```bash
yarn add @reactflo/core
```

### Creating Your First Node

Define nodes using decorators:

```typescript
import { Node, defineNode, Input, Output } from '@reactflo/core';

@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
  description: 'Adds two numbers together',
})
export class AddNode extends Node {
  @Input({
    type: 'number',
    label: 'First Number',
    required: true,
  })
  a: number = 0;

  @Input({
    type: 'number',
    label: 'Second Number',
    required: true,
  })
  b: number = 0;

  @Output({
    type: 'number',
    label: 'Sum',
  })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

### Building and Executing a Workflow

```typescript
import { Workflow } from '@reactflo/core';
import { AddNode } from './nodes/AddNode';

// Create a workflow
const workflow = new Workflow();

// Add nodes
const node1 = workflow.addNode(AddNode, {
  position: { x: 100, y: 100 },
});

const node2 = workflow.addNode(AddNode, {
  position: { x: 300, y: 100 },
});

// Set input values
node1.inputs.a = 5;
node1.inputs.b = 3;

// Connect nodes
workflow.connect(
  { nodeId: node1.id, portId: 'result' },
  { nodeId: node2.id, portId: 'a' }
);

// Execute workflow
const result = await workflow.execute();

console.log(node2.outputs.result); // Output: 8
console.log(result.status); // 'success'
console.log(result.duration); // execution time in ms
```

### Next Steps

- [Execution Engine](../concepts/execution-engine.md) - Learn about workflow execution
- [Error Handling](../advanced/error-handling.md) - Handle errors and timeouts
- [JSON Schema](../concepts/json-schema.md) - Serialize and deserialize workflows

## Need Help?

- [GitHub Issues](https://github.com/yourusername/reactflo/issues)
- [Discussions](https://github.com/yourusername/reactflo/discussions)
