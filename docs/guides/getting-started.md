# Getting Started with ReactFlo

This guide will help you get started with ReactFlo, a declarative workflow builder framework.

## Installation

```bash
npm install @reactflo/core @reactflo/react
```

Or using yarn:

```bash
yarn add @reactflo/core @reactflo/react
```

## Your First Node

Let's create a simple node that adds two numbers:

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

## Creating a Workflow

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
workflow.connect({ nodeId: node1.id, portId: 'result' }, { nodeId: node2.id, portId: 'a' });

// Execute workflow
await workflow.execute();

console.log(node2.outputs.result); // Output: 8
```

## Using the Visual Builder

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

## Next Steps

- [Core Concepts](./core-concepts.md) - Learn about nodes, workflows, and execution
- [API Reference](./api-reference/) - Detailed API documentation
- [Examples](./examples/) - More examples and use cases

## Need Help?

- [GitHub Issues](https://github.com/yourusername/reactflo/issues)
- [Discussions](https://github.com/yourusername/reactflo/discussions)
