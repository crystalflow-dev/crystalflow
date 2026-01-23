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

## Package Structure

```
src/
├── components/           # React UI components
│   ├── WorkflowBuilder/  # Main workflow builder component
│   ├── Node/             # Custom node renderer
│   ├── NodePalette/      # Drag-and-drop node palette
│   ├── PropertyPanel/    # Property inspector for selected nodes
│   ├── Toolbar/          # Action buttons (execute, save, load, etc.)
│   └── Connection/       # Custom connection line renderer
├── context/              # React Context providers
│   └── WorkflowContext/  # Global workflow state management
├── hooks/                # Custom React hooks
│   ├── useWorkflow       # Hook for workflow operations
│   ├── useNodeRegistry   # Hook for accessing node types
│   └── useExecution      # Hook for workflow execution
└── types/                # TypeScript type definitions
    ├── index.ts          # Main types export
    └── jsonEditor.ts     # JSON editor specific types
```

### Components

#### WorkflowBuilder

Main component that integrates all functionality:

```tsx
import { WorkflowBuilder } from '@reactflo/react';

<WorkflowBuilder
  nodes={[AddNode, MultiplyNode]}
  showJsonEditor={true}
  editorMode="split"
  onWorkflowChange={(workflow) => {}}
  onExecute={(result) => {}}
  onError={(error) => {}}
/>;
```

#### NodePalette

Displays available node types for drag-and-drop:

```tsx
import { NodePalette } from '@reactflo/react';

<NodePalette
  nodes={paletteItems}
  onNodeDragStart={(nodeType) => console.log('Dragging', nodeType)}
  groupByCategory={true}
/>;
```

#### PropertyPanel

Shows properties of the selected node:

```tsx
import { PropertyPanel } from '@reactflo/react';

<PropertyPanel
  selectedNodeId={nodeId}
  selectedNode={node}
  onPropertyChange={(nodeId, property, value) => {}}
/>;
```

#### Toolbar

Provides workflow actions:

```tsx
import { Toolbar } from '@reactflo/react';

<Toolbar
  canExecute={true}
  isExecuting={false}
  onExecute={() => {}}
  onSave={() => {}}
  onLoad={() => {}}
  onClear={() => {}}
/>;
```

### Context

#### WorkflowProvider

Provides workflow state to all child components:

```tsx
import { WorkflowProvider, useWorkflowContext } from '@reactflo/react';

function App() {
  return (
    <WorkflowProvider>
      <MyWorkflowUI />
    </WorkflowProvider>
  );
}

function MyWorkflowUI() {
  const { workflow, addNode, executeWorkflow } = useWorkflowContext();
  // Use workflow state and actions
}
```

### Hooks

#### useWorkflow

Manages workflow state and operations:

```tsx
import { useWorkflow } from '@reactflo/react';

const {
  workflow,
  addNode,
  removeNode,
  connect,
  execute,
  exportJSON,
  importJSON,
  isExecuting,
  error,
} = useWorkflow();
```

#### useNodeRegistry

Accesses registered node types:

```tsx
import { useNodeRegistry } from '@reactflo/react';

const { registry, nodes, register, getNodeMetadata, hasNode } = useNodeRegistry([
  AddNode,
  MultiplyNode,
]);
```

#### useExecution

Handles workflow execution with events:

```tsx
import { useExecution } from '@reactflo/react';

const { execute, isExecuting, result, error } = useExecution({
  onNodeStart: (nodeId) => console.log('Starting', nodeId),
  onNodeComplete: (nodeId, result) => console.log('Completed', nodeId),
  onNodeError: (nodeId, error) => console.error('Error', nodeId, error),
});
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

## Architecture

The React package follows a clear separation of concerns:

1. **Components** - Pure presentational components built on React Flow
2. **Context** - Global state management for workflow operations
3. **Hooks** - Reusable logic for common workflow tasks
4. **Types** - TypeScript definitions for type safety

### Data Flow

```
User Interaction
    ↓
Components (UI)
    ↓
Hooks/Context (Logic)
    ↓
@reactflo/core (Engine)
    ↓
Workflow Execution
```

## Development Status

**Current Phase:** Phase 6 - React Package Initialization ✅

- ✅ Package structure initialized
- ✅ All component stubs created
- ✅ Context providers implemented
- ✅ Custom hooks implemented
- ✅ React Flow integration setup
- ⏳ Full component implementation (next)

## Built With

- [React Flow](https://reactflow.dev/) - For canvas and node rendering
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - For JSON editing
- [@reactflo/core](../core) - For workflow execution engine
- [@reactflo/types](../types) - For shared type definitions

## License

MIT
