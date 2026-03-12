# @crystalflow/react

React components for CrystalFlow workflow builder, built on top of React Flow.

## Overview

This package provides production-ready React components that bridge your decorated node definitions to React Flow's visual canvas. It features a modern, themeable UI with comprehensive workflow management capabilities.

**Key Features:**
- Converting `@defineNode` decorated classes to React Flow nodes
- Rendering custom nodes with decorator metadata (@Input, @Output, @Property)
- Managing connections with type validation
- Drag-and-drop node palette with category grouping
- Property inspector with @Property decorator support
- Resizable panels with localStorage persistence
- Theme system with light/dark mode support
- Icon system using react-icons (Feather Icons)
- CSS-in-JS architecture for zero-config styling
- Save/Load workflow operations with error handling

## Installation

```bash
npm install @crystalflow/react @crystalflow/core @crystalflow/types react react-dom @xyflow/react
```

## Quick Start

```tsx
import React from 'react';
import { WorkflowBuilder } from '@crystalflow/react';
import { AddNode, MultiplyNode } from './nodes';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowBuilder
        nodes={[AddNode, MultiplyNode]}
        theme="light" // or 'dark', 'auto', or custom Theme object
        showPalette={true}
        showProperties={true}
        showToolbar={true}
        onWorkflowChange={(nodes, edges) => {
          console.log('Workflow updated:', nodes, edges);
        }}
        onExecute={(result) => {
          console.log('Execution result:', result);
        }}
        onError={(error) => {
          console.error('Execution error:', error);
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
│   ├── WorkflowBuilder/  # Main orchestrator component (refactored)
│   ├── WorkflowCanvas/   # Pure React Flow rendering
│   ├── Node/             # Custom node renderer with metadata parsing
│   ├── NodePalette/      # Drag-and-drop palette with search
│   ├── PropertyPanel/    # Modern property inspector (@Property support)
│   ├── ResizablePanel/   # Reusable panel with drag-to-resize
│   ├── Toolbar/          # Action buttons (execute, save, load, clear)
│   └── Connection/       # Custom connection line renderer
├── context/              # React Context providers
│   └── WorkflowContext/  # Global workflow state management
├── hooks/                # Custom React hooks (7 hooks)
│   ├── useWorkflow           # Core workflow operations
│   ├── useNodeRegistry       # Access registered node types
│   ├── useExecution          # Workflow execution with events
│   ├── useReactFlowState     # React Flow state management
│   ├── useWorkflowExecution  # Execution logic
│   ├── useWorkflowFileOperations # Save/load operations
│   └── useNodePalette        # Drag & drop logic
├── theme/                # Theme system
│   ├── defaultTheme.ts   # Type-safe theme definitions
│   ├── ThemeProvider.tsx # Theme context and CSS variable injection
│   ├── icons.ts          # Icon mapping (react-icons/fi)
│   └── variables.css     # CSS custom properties
├── styles/               # All CSS files (auto-imported via glob)
│   ├── global.css        # CSS variables and base styles
│   ├── propertyPanel.css # PropertyPanel component styles
│   ├── customNode.css    # CustomNode component styles
│   ├── nodePalette.css   # NodePalette component styles
│   ├── resizablePanel.css # ResizablePanel component styles
│   ├── reactflowTheme.css # ReactFlow theme customization
│   └── cssInJs.ts        # Auto-imports all CSS files
├── utils/                # Utility functions
│   ├── injectStyles.ts   # Runtime CSS injection
│   ├── nodeConverter.ts  # Decorator to React Flow conversion
│   ├── workflowConverter.ts # Workflow serialization
│   └── styling.ts        # Style utilities (cn, mergeStyles)
└── types/                # TypeScript type definitions
    ├── index.ts          # Main types export
    └── jsonEditor.ts     # JSON editor specific types
```

### Components

#### WorkflowBuilder

Main component that orchestrates the entire workflow builder:

```tsx
import { WorkflowBuilder } from '@crystalflow/react';

<WorkflowBuilder
  // Node configuration
  nodes={[AddNode, MultiplyNode]}
  initialWorkflow={savedWorkflow}
  
  // UI visibility
  showPalette={true}
  showProperties={true}
  showToolbar={true}
  showJsonEditor={false}
  
  // Theme configuration
  theme="light" // 'light', 'dark', 'auto', or custom Theme object
  
  // Editor mode
  editorMode="visual" // 'visual', 'json', 'split'
  jsonEditorTheme="vs-light" // Monaco editor theme
  
  // Callbacks
  onWorkflowChange={(nodes, edges) => {}}
  onExecute={(result) => {}}
  onError={(error) => {}}
  
  // Custom styling (optional)
  className="my-workflow"
  style={{ border: '1px solid #ccc' }}
/>;
```

**Features:**
- Single Responsibility: Orchestrates components, doesn't handle implementation
- Automatic style injection (CSS-in-JS on mount)
- Theme system with CSS variable injection
- Flexible layout with resizable panels
- TypeScript strict mode compatible

#### WorkflowCanvas

Pure React Flow rendering component (used internally by WorkflowBuilder):

```tsx
import { WorkflowCanvas } from '@crystalflow/react';

<WorkflowCanvas
  nodes={reactFlowNodes}
  edges={reactFlowEdges}
  nodeTypes={customNodeTypes}
  onNodesChange={handleNodesChange}
  onEdgesChange={handleEdgesChange}
  onConnect={handleConnect}
  fitView={true}
/>;
```
```

#### NodePalette

Displays available node types with category grouping and search:

```tsx
import { NodePalette } from '@crystalflow/react';

<NodePalette
  nodes={paletteItems}
  onNodeDragStart={(nodeType) => console.log('Dragging', nodeType)}
  groupByCategory={true}
  showSearch={true}
  className="custom-palette"
/>
```

**Features:**
- Category-based grouping with icons (react-icons/fi)
- Search functionality
- Drag-and-drop with visual feedback
- Scrollbar styling (hidden by default, visible on hover)

#### PropertyPanel

Modern property inspector with @Property decorator support:

```tsx
import { PropertyPanel } from '@crystalflow/react';

<PropertyPanel
  selectedNodeId={nodeId}
  selectedNode={node}
  onPropertyChange={(nodeId, property, value) => {}}
  onClose={() => {}}
/>
```

**Features:**
- Collapsible sections (Properties, Inputs, Outputs)
- Type-aware controls (string, number, boolean, select, array)
- @Property decorator support (static configuration values)
- @Input/@Output display (dynamic data flow)
- Node info card with type, ID, and description
- Modern form styling with focus states
- Array property management (add/remove items)

#### ResizablePanel

Reusable panel with drag-to-resize functionality:

```tsx
import { ResizablePanel } from '@crystalflow/react';

<ResizablePanel
  minWidth={200}
  maxWidth={600}
  defaultWidth={300}
  storageKey="property-panel-width"
  resizeHandle="left" // or 'right'
  onWidthChange={(width) => console.log(width)}
>
  <YourContent />
</ResizablePanel>
```

**Features:**
- Drag-to-resize with visual feedback
- Min/max constraints
- localStorage persistence
- Smooth animations and transitions
```

#### Toolbar

Provides workflow action buttons:

```tsx
import { Toolbar } from '@crystalflow/react';

<Toolbar
  canExecute={true}
  isExecuting={false}
  onExecute={() => {}}
  onSave={() => {}}
  onLoad={() => {}}
  onClear={() => {}}
/>
```

**Features:**
- Execute workflow with loading state
- Save/Load workflow (JSON file operations)
- Clear workflow
- Disabled state management

### Theme System

#### ThemeProvider

Provides theme to all child components with CSS variable injection:

```tsx
import { ThemeProvider } from '@crystalflow/react';

function App() {
  return (
    <ThemeProvider theme={{ colors: { primary: { 500: '#FF6B6B' } } }}>
      <WorkflowBuilder nodes={nodes} />
    </ThemeProvider>
  );
}
```

#### Custom Theme

```tsx
import { defaultTheme, type DefaultTheme } from '@crystalflow/react';

const customTheme: Partial<DefaultTheme> = {
  colors: {
    primary: {
      50: '#f0f4ff',
      500: '#2A41FF',
      600: '#1d2edb',
    },
    semantic: {
      success: { 500: '#10b981' },
      error: { 500: '#ef4444' },
    },
  },
  typography: {
    fontFamily: {
      base: 'Inter, sans-serif',
      mono: 'Fira Code, monospace',
    },
  },
  spacing: {
    4: '1rem',
    8: '2rem',
  },
};

<WorkflowBuilder theme={customTheme} nodes={nodes} />;
```

#### Icon System

Centralized icon mapping using react-icons (Feather Icons):

```tsx
import { categoryIcons, statusIcons, uiIcons } from '@crystalflow/react';

// Category icons
const DataIcon = categoryIcons['Data Processing']; // FiDatabase
const MathIcon = categoryIcons['Math']; // FiHash

// Status icons  
const IdleIcon = statusIcons.idle; // FiCircle
const RunningIcon = statusIcons.running; // FiZap

// UI icons
const SettingsIcon = uiIcons.settings; // FiSettings
```
```

### Hooks

CrystalFlow provides 7 focused hooks, each with a single responsibility:

#### useWorkflow

Core workflow operations and state management:

```tsx
import { useWorkflow } from '@crystalflow/react';

const {
  workflow,
  addNode,
  removeNode,
  updateNode,
  connect,
  disconnect,
  clear,
  exportJSON,
  importJSON,
} = useWorkflow();
```

#### useReactFlowState

React Flow state management (nodes, edges, selection):

```tsx
import { useReactFlowState } from '@crystalflow/react';

const {
  nodes,
  edges,
  selectedNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  addNode,
  removeNode,
} = useReactFlowState();
```

#### useWorkflowExecution

Workflow execution logic:

```tsx
import { useWorkflowExecution } from '@crystalflow/react';

const {
  execute,
  isExecuting,
  result,
  error,
} = useWorkflowExecution({
  workflow,
  onComplete: (result) => {},
  onError: (error) => {},
});
```

#### useWorkflowFileOperations

Save/load operations with error handling:

```tsx
import { useWorkflowFileOperations } from '@crystalflow/react';

const {
  saveWorkflow,
  loadWorkflow,
  isSaving,
  isLoading,
  error,
} = useWorkflowFileOperations();

// Save
await saveWorkflow(nodes, edges);

// Load
const { nodes, edges } = await loadWorkflow();
```

#### useNodePalette

Drag & drop logic and node creation:

```tsx
import { useNodePalette } from '@crystalflow/react';

const {
  handleNodeDragStart,
  handleDragOver,
  handleDrop,
  createNode,
} = useNodePalette(nodeTypes);
```

#### useNodeRegistry

Access to registered node types:

```tsx
import { useNodeRegistry } from '@crystalflow/react';

const {
  registry,
  nodes,
  register,
  getNodeMetadata,
  hasNode,
} = useNodeRegistry([AddNode, MultiplyNode]);
```

#### useExecution

Workflow execution with event handlers:

```tsx
import { useExecution } from '@crystalflow/react';

const {
  execute,
  isExecuting,
  result,
  error,
} = useExecution({
  onNodeStart: (nodeId, node) => console.log('Starting', nodeId),
  onNodeComplete: (nodeId, result) => console.log('Completed', nodeId),
  onNodeError: (nodeId, error) => console.error('Error', nodeId, error),
  onError: (error) => console.error('Workflow error', error),
});
```

## Features

### Core Features
- ✅ Built on React Flow v12 - leverages battle-tested canvas
- ✅ Automatic node rendering from decorators (@defineNode, @Input, @Output, @Property)
- ✅ Type-safe connections with validation
- ✅ Drag-and-drop node palette with category grouping
- ✅ Real-time property editing with @Property decorator support
- ✅ Modern UI with 2026 startup aesthetic (inspired by n8n)

### Theme System
- ✅ Complete theme system (light, dark, auto, custom)
- ✅ CSS custom properties with theme fallbacks
- ✅ Icon system using react-icons (Feather Icons)
- ✅ Inter font family integration
- ✅ Comprehensive design tokens (colors, typography, spacing, shadows)

### UI Components
- ✅ WorkflowBuilder - Main orchestrator with refactored architecture
- ✅ WorkflowCanvas - Pure React Flow rendering
- ✅ PropertyPanel - Modern inspector with collapsible sections
- ✅ ResizablePanel - Drag-to-resize with localStorage persistence (250-600px)
- ✅ NodePalette - Category grouping with search
- ✅ Toolbar - Execute, save, load, clear actions
- ✅ CustomNode - Full renderer with metadata parsing

### Developer Experience
- ✅ 7 focused React hooks (Single Responsibility Principle)
- ✅ CSS-in-JS architecture (zero-config styling)
- ✅ Automatic CSS import via import.meta.glob()
- ✅ TypeScript strict mode compatible
- ✅ Save/Load workflow operations with error handling
- ✅ Execution controls with loading states

## Architecture

The React package follows a clear separation of concerns with Single Responsibility Principle:

1. **Components** - Focused, single-purpose presentational components
2. **Hooks** - Each hook has one clear responsibility (7 hooks total)
3. **Theme** - Complete theme system with CSS variable injection
4. **Styles** - Centralized CSS architecture with automatic imports
5. **Utils** - Utility functions (styling, conversion, injection)
6. **Types** - TypeScript definitions for type safety

### Refactored Architecture (Phase 4)

WorkflowBuilder was refactored from 300+ lines to 80 lines:

**Before (Monolithic):**
- WorkflowBuilder handled everything (state, execution, file ops, React Flow)
- Difficult to test and maintain
- Props drilling issues

**After (Single Responsibility):**
- **WorkflowBuilder**: Pure orchestrator (80 lines)
- **useReactFlowState**: React Flow state management
- **useWorkflowExecution**: Execution logic
- **useWorkflowFileOperations**: Save/load operations
- **useNodePalette**: Drag & drop logic
- Each piece is testable in isolation

**Benefits:**
- ✅ Testability: Each piece tested independently
- ✅ Reusability: Hooks used in other components
- ✅ Maintainability: Changes don't affect others
- ✅ Readability: Easy to understand each piece
- ✅ Flexibility: Compose different workflows easily

### CSS Architecture

All component styles are centralized in the `src/styles/` folder:

- **Automatic Import**: All `.css` files are automatically imported using Vite's `import.meta.glob()`
- **Runtime Injection**: CSS is injected at runtime when `WorkflowBuilder` mounts (CSS-in-JS approach)
- **No Manual Imports**: Just drop a `.css` file in the styles folder—it's automatically included
- **Build-time Bundle**: CSS is converted to strings during build and embedded in the JS bundle
- **Centralized Injection**: All styles inject once when WorkflowBuilder mounts (not per-component)

**Adding New Styles:**
```css
/* src/styles/myComponent.css */
.my-component {
  /* Your styles using CSS custom properties */
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
}
```

That's it! No imports needed. The file is automatically detected and injected.

**Current CSS Files:**
- `global.css` - CSS variables, Inter font, base styles
- `propertyPanel.css` - PropertyPanel component styles
- `customNode.css` - CustomNode component styles
- `nodePalette.css` - NodePalette scrollbar styling
- `resizablePanel.css` - ResizablePanel drag handle styles
- `reactflowTheme.css` - ReactFlow theme customization (light/dark)

### Data Flow

```
User Interaction
    ↓
Components (UI Layer)
    ↓
Hooks (Business Logic)
    ↓
@crystalflow/core (Execution Engine)
    ↓
Workflow Execution & Results
```

**Example Flow:**
1. User drags node from NodePalette → `useNodePalette` hook
2. Node dropped on canvas → `useReactFlowState` updates state
3. User clicks Execute → `useWorkflowExecution` hook
4. Workflow executed → `@crystalflow/core` Executor
5. Results displayed → Components update

## Property System

CrystalFlow distinguishes between configuration and data flow:

- **@Property** = Static configuration values (shown in properties panel)
- **@Input** = Dynamic data flow connections (connected via handles)
- **@Output** = Computed results (generated during execution)

```typescript
@defineNode({ type: 'http.request', label: 'HTTP Request' })
class HttpRequestNode extends Node {
  // Property: Static configuration (not connected)
  @Property({
    type: 'string',
    label: 'URL',
    required: true,
  })
  url: string = '';

  @Property({
    type: 'select',
    label: 'Method',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
    ],
  })
  method: string = 'GET';

  // Input: Data flow (can be connected)
  @Input({ type: 'object', label: 'Request Body' })
  body?: object;

  // Output: Computed result
  @Output({ type: 'object', label: 'Response' })
  response: object;

  execute() {
    this.response = fetch(this.url, {
      method: this.method,
      body: JSON.stringify(this.body),
    });
  }
}
```

**Property Panel automatically:**
- Groups properties by type (Properties, Inputs, Outputs)
- Renders type-appropriate controls (text, number, select, boolean, array)
- Shows required fields with asterisk
- Displays descriptions and constraints
- Supports property inheritance from base classes

## Development Status

**Current Phase:** Phase 4 - React Package ✅ 100% COMPLETE

**Completed:**
- ✅ Package structure and architecture
- ✅ All core components fully implemented
- ✅ Property system (@Property decorator support)
- ✅ WorkflowBuilder refactored (Single Responsibility)
- ✅ 7 focused hooks with clear responsibilities
- ✅ Theme system with light/dark/custom support
- ✅ Icon system (react-icons/fi)
- ✅ CSS-in-JS architecture with auto-import
- ✅ ResizablePanel with localStorage persistence
- ✅ Modern UI (2026 startup aesthetic)
- ✅ Save/Load workflow operations
- ✅ Package builds successfully (116.99 kB JS, 15.85 kB CSS)
- ✅ All tests passing (279 tests)

**Next Steps:**
- ⏳ Monaco JSON editor integration (Phase 5)
- ⏳ Dual-mode editing (visual + JSON with sync)
- ⏳ Undo/redo system
- ⏳ Keyboard shortcuts

## Built With

- [React 18+](https://react.dev/) - UI library
- [React Flow v12](https://reactflow.dev/) - Canvas and node rendering
- [react-icons](https://react-icons.github.io/react-icons/) - Icon system (Feather Icons)
- [@crystalflow/core](../core) - Workflow execution engine
- [@crystalflow/types](../types) - Shared type definitions
- [TypeScript 5.3+](https://www.typescriptlang.org/) - Type safety
- [Vite 7.3+](https://vitejs.dev/) - Build tool

## Examples

See the [@crystalflow/examples](../examples) package for:
- Complete workflow with property system
- Input nodes (NumberInput, StringInput, ConfigDemoNode)
- Math nodes (Add, Multiply, Subtract)
- Output nodes (Display)
- Drag-and-drop demonstration

## License

MIT

---

**Note:** This package is part of the CrystalFlow monorepo. For full documentation, see the [main README](../../README.md) and [documentation site](../docs-site).
