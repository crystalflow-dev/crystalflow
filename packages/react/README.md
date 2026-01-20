# @reactflo/react

React components for ReactFlo workflow builder, built on top of React Flow.

## Overview

This package provides React components that bridge your decorated node definitions to React Flow's visual canvas. It handles:

- Converting `@defineNode` decorated classes to React Flow nodes
- Rendering custom nodes based on your definitions
- Managing connections with type validation
- Node palette generation from registry
- Property inspector for node configuration

## Installation

```bash
npm install @reactflo/react @reactflo/core react react-dom reactflow
```

## Usage

```tsx
import React from 'react';
import { WorkflowBuilder } from '@reactflo/react';
import { AddNode, MultiplyNode } from './nodes';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowBuilder 
        nodes={[AddNode, MultiplyNode]}
        onWorkflowChange={(workflow) => {
          console.log('Workflow updated:', workflow);
        }}
        onExecute={(result) => {
          console.log('Execution result:', result);
        }}
      />
    </div>
  );
}
```

## Features

- ✅ Built on React Flow - leverages battle-tested canvas
- ✅ Automatic node rendering from decorators
- ✅ Type-safe connections
- ✅ Drag-and-drop node palette
- ✅ Real-time property editing
- ✅ Integrated JSON editor (Monaco Editor)
- ✅ Dual-mode editing (visual ↔ JSON)
- ✅ Live validation and error highlighting
- ✅ Execution controls

## Built With

- [React Flow](https://reactflow.dev/) - For canvas and node rendering
- [@reactflo/core](../core) - For workflow execution

## License

MIT
