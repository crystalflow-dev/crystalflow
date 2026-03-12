# Decorators in React with CrystalFlow

## How Decorators Work in CrystalFlow

### ✅ The Pattern

**Node Definitions** (TypeScript classes with decorators):

```typescript
// nodes/AddNode.ts
import { Node, defineNode, Input, Output } from '@crystalflow/core';

@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
export class AddNode extends Node {
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

**React Components** (functional components that consume nodes):

```tsx
// App.tsx
import React from 'react';
import { WorkflowBuilder } from '@crystalflow/react';
import { AddNode } from './nodes/AddNode';

function App() {
  return <WorkflowBuilder nodes={[AddNode]} />;
}
```

## Key Points

### 1. Decorators are for Node Classes

- ✅ You decorate **Node class definitions** (business logic)
- ✅ These are plain TypeScript classes, not React components
- ✅ They define **what** the node does

### 2. React Components are Separate

- ✅ React components (functional) **consume** the decorated nodes
- ✅ `@crystalflow/react` converts decorated nodes → React Flow nodes
- ✅ No decorators on React components themselves

### 3. TypeScript Configuration

Already set up in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Architecture Flow

```
┌──────────────────────────────────────────────────┐
│  1. Define Nodes (TypeScript with Decorators)   │
│                                                  │
│  @defineNode({ ... })                           │
│  class AddNode extends Node { ... }             │
└──────────────────┬───────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────┐
│  2. Register with CrystalFlow                      │
│                                                  │
│  <WorkflowBuilder nodes={[AddNode]} />         │
└──────────────────┬───────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────┐
│  3. CrystalFlow Converts to React Flow             │
│                                                  │
│  - Reads decorator metadata                     │
│  - Creates React Flow node components           │
│  - Renders on canvas                            │
└──────────────────┬───────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────┐
│  4. Execution (when user clicks "Run")          │
│                                                  │
│  - Instantiate Node classes                     │
│  - Call execute() methods                       │
│  - Return results                               │
└──────────────────────────────────────────────────┘
```

## Why This Works

### In Development (Node.js/Webpack/Vite)

- ✅ TypeScript compiles decorators
- ✅ `reflect-metadata` provides runtime metadata
- ✅ Decorators run at class definition time (once)
- ✅ React renders the results

### In Production

- ✅ Decorators are compiled to JavaScript
- ✅ No runtime overhead for decoration
- ✅ Metadata is embedded in the build
- ✅ Works in all modern browsers

## Common Patterns

### Pattern 1: Multiple Node Types

```typescript
// Define many nodes
@defineNode({ type: 'math.add', ... })
class AddNode extends Node { ... }

@defineNode({ type: 'math.multiply', ... })
class MultiplyNode extends Node { ... }

@defineNode({ type: 'string.concat', ... })
class ConcatNode extends Node { ... }

// Use in React
<WorkflowBuilder nodes={[AddNode, MultiplyNode, ConcatNode]} />
```

### Pattern 2: Dynamic Loading

```typescript
// Lazy load nodes
const nodes = await import('./nodes');

function App() {
  return <WorkflowBuilder nodes={Object.values(nodes)} />;
}
```

### Pattern 3: Plugin System

```typescript
import { coreNodes } from '@crystalflow/plugins/core';
import { httpNodes } from '@crystalflow/plugins/http';
import { customNodes } from './custom-nodes';

<WorkflowBuilder
  nodes={[...coreNodes, ...httpNodes, ...customNodes]}
/>
```

## Limitations & Solutions

### ❌ Can't Use Decorators on React Components

```typescript
// This won't work as intended
@someDecorator
function MyComponent() { ... }  // Don't do this
```

### ✅ Solution: Separate Concerns

```typescript
// Node definition (with decorators)
@defineNode({ ... })
class MyNode extends Node { ... }

// React component (no decorators needed)
function MyApp() {
  return <WorkflowBuilder nodes={[MyNode]} />;
}
```

## Browser Compatibility

Decorators compile to standard JavaScript, so they work in:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Node.js 18+

## Summary

**Yes, decorators work perfectly with React!**

- You use them for **Node class definitions** (business logic)
- React components **consume** those nodes (no decorators needed)
- CrystalFlow bridges the gap between decorated classes and React Flow
- Everything compiles to standard JavaScript

This separation is actually a strength - your node logic is framework-agnostic while your UI is pure React.
