<div align="center">
  <img src="assets/logo/reactflo-logo-blue.png" alt="ReactFlo Logo" width="500" />
</div>

<br/>

# ReactFlo

**A declarative workflow builder framework that lets you focus on "what to do" instead of "how to do it".**

ReactFlo is a modern, extensible framework for building visual workflow editors. Simply define your nodes with specific methods, and ReactFlo automatically detects them, generates the UI, and handles all the execution logic.

## 🎯 Vision

Stop building workflow builders from scratch. Stop writing boilerplate for node registration, connection validation, and execution orchestration. ReactFlo provides a complete, production-ready workflow system where you only define your business logic.

**We build the how, you focus on the what.**

ReactFlo is a framework, not a finished product. It provides everything you need to build custom workflow applications for your specific domain—whether that's data pipelines, automation systems, business processes, or creative tools.

## ✨ Key Features

- **Declarative Node Definition** - Define nodes using decorators (@defineNode, @Input, @Output, @Property)
- **Automatic Discovery** - Nodes are automatically detected and registered
- **Type-Safe Connections** - Built-in validation for node inputs and outputs
- **Flexible Styling System** - Comprehensive customization with classNames, styles, and ReactFlow props
- **JSON Workflow Format** - Import/export workflows as well-structured JSON
- **Dual-Mode Editing** - Visual builder + JSON editor with real-time sync
- **Visual Workflow Builder** - Built on React Flow for production-ready UI
- **Execution Engine** - Handles workflow execution, parallelization, and error handling
- **Extensible** - Plugin system for custom node types and behaviors
- **Zero UI Boilerplate** - Focus on business logic, not canvas implementation
- **Developer Experience** - Hot reload, TypeScript support, and comprehensive tooling

## 🚀 Quick Start

```typescript
import { Node, Input, Output, defineNode } from '@reactflo/core';

@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number;

  @Input({ type: 'number', label: 'B' })
  b: number;

  @Output({ type: 'number', label: 'Result' })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

```tsx
import { WorkflowBuilder } from '@reactflo/react';

function App() {
  return (
    <WorkflowBuilder
      nodes={[AddNode]}
      showJsonEditor={true} // Built-in JSON editor
      editorMode="split" // Visual + JSON side-by-side
      onWorkflowChange={(workflow) => {
        console.log('Workflow JSON:', workflow);
      }}
    />
  );
}
```

## 📦 Packages

ReactFlo is organized as a monorepo with multiple packages:

- `@reactflo/core` ✅ - Core workflow engine and node system (100% complete)
- `@reactflo/types` ✅ - TypeScript type definitions (100% complete)
- `@reactflo/react` 🚧 - React components bridging decorators to React Flow (80% complete)
- `@reactflo/examples` 🚧 - Example applications and demos (in progress)
- `@reactflo/cli` ⏳ - Command-line tools for scaffolding and development (planned)
- `@reactflo/plugins` ⏳ - Official plugin collection (planned)

**Built on:** React Flow (for canvas/UI), TypeScript (with decorators)

## �️ Development

### Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start development mode (watch all packages + examples dev server)
npm run dev
```

Development mode runs all TypeScript watch modes in parallel with the Vite dev server. Changes to any package are automatically compiled and hot-reloaded.

**See [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) for detailed development instructions.**

### Key Commands

- `npm run dev` - Watch mode for all packages + examples dev server
- `npm run build` - Build all packages
- `npm test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all build artifacts

## �🗺️ Roadmap

### ✅ Phase 1: Core Node System (100% Complete)

- [x] Project setup and repository structure
- [x] Core workflow engine
  - [x] Node base class with decorator metadata
  - [x] NodeRegistry for registration and factory functionality
  - [x] Decorator system (@defineNode, @Input, @Output)
  - [x] Node type definitions and validation
  - [x] Comprehensive unit tests (139 tests passing)
- [x] JSON Schema definition
- [x] TypeScript support with strict mode

### ✅ Phase 2: Workflow System (100% Complete)

- [x] Workflow orchestration
  - [x] Workflow class for managing nodes and connections
  - [x] Connection validation with type checking
  - [x] Graph structure with dependency tracking
  - [x] Circular dependency detection
  - [x] Topological sorting for execution order
  - [x] JSON serialization/deserialization
  - [x] Comprehensive validation system

### ✅ Phase 3: Execution Engine (100% Complete)

- [x] Workflow execution
  - [x] Executor class for workflow orchestration
  - [x] ExecutionContext for runtime state management
  - [x] AsyncEventEmitter for async-aware event system
  - [x] Serial execution strategy
  - [x] Async/await support for nodes and event listeners
  - [x] Event system for lifecycle hooks (beforeExecute, afterExecute, onNodeStart, etc.)
  - [x] Error handling with detailed context
  - [x] Timing and duration tracking
- [x] Performance optimization
  - [x] Execution monitoring with events
  - [x] AbortSignal support for cancellation
  - [x] Async event listener support (waits for all listeners to complete)

### 🚧 Phase 4: React Package (80% Complete - Q1 2026)

- [x] Package structure initialization
  - [x] React Flow 11.10.0 integration
  - [x] Monaco Editor 4.6.0 integration
  - [x] Component structure created
  - [x] Context providers implemented
  - [x] Custom hooks implemented
- [x] React workflow builder component
  - [x] Integrate React Flow
  - [x] Bridge decorated nodes to React Flow nodes
  - [x] Custom node renderer from decorator metadata
  - [x] Node palette with drag-and-drop
  - [x] Property inspector for node editing
  - [x] Toolbar with workflow actions
  - [x] Node converter utilities
  - [x] Workflow serialization utilities
- [x] Examples package
  - [x] Package structure with Vite
  - [x] Example nodes (Math, Input, Output)
  - [x] Simple workflow demo
  - [x] Integrated with development workflow
- [ ] Advanced UI features (Next)
  - [ ] Undo/redo system
  - [ ] Keyboard shortcuts
  - [ ] Connection validation visual feedback
  - [ ] JSON editor integration (Monaco)
  - [ ] Dual-mode editing with sync

### Phase 5: Type System & Utilities (Q2 2026)

- [ ] Enhanced type system
  - [ ] DataType class implementation
  - [ ] TypeValidator for advanced validation
  - [ ] Built-in types (primitives, objects, arrays)
- [ ] Utility framework
  - [ ] Custom error classes
  - [ ] Logger utility
  - [ ] Serialization utilities

### Phase 6: Developer Experience (Q3 2026)

- [ ] CLI tools
  - [ ] Project scaffolding
  - [ ] Node generator templates
  - [ ] Development server
  - [ ] Build and bundle tools
- [ ] Development tools
  - [ ] VS Code extension
  - [ ] Node debugging interface
  - [ ] Hot reload support
  - [ ] Testing utilities

### Phase 7: Ecosystem & Content (Q3-Q4 2026)

- [ ] Documentation and examples
  - [ ] Interactive documentation website
  - [ ] Comprehensive API reference
  - [ ] Tutorial series and guides
  - [ ] Example applications showcase
- [ ] Official node libraries
  - [ ] Math operations
  - [ ] HTTP/REST nodes
  - [ ] Data transformation
  - [ ] Logic and control flow

### Phase 8: Production Ready (Q4 2026)

- [ ] Quality assurance
  - [ ] 80%+ test coverage across all packages
  - [ ] Integration and E2E tests
  - [ ] Performance benchmarks
  - [ ] Security audit
- [ ] Release preparation
  - [ ] Migration guides
  - [ ] Production deployment examples
  - [ ] v1.0.0 stable release

## 🏗️ Architecture

ReactFlo builds on top of React Flow, adding a declarative layer and execution engine:

```
┌──────────────────────────────────────────────┐
│         User Applications                    │
│  (Define nodes with @decorators)             │
├──────────────────────────────────────────────┤
│    @reactflo/react (Workflow Builder)        │
│  (Bridges decorators ↔ React Flow)           │
├──────────────────────────────────────────────┤
│         React Flow                           │
│  (Canvas, UI, pan/zoom, rendering)           │
├──────────────────────────────────────────────┤
│   @reactflo/core (Workflow Engine)           │
│  (Node system, execution, validation)        │
└──────────────────────────────────────────────┘
```

**Why React Flow?** We leverage React Flow for the UI layer (canvas, connections, rendering) and focus ReactFlo on what's missing: declarative node definitions, automatic registration, and powerful execution.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Inspired by Node-RED, React Flow, and modern workflow automation tools.

---

**We build the how, you focus on the what.**

**Status:** ✅ **Phases 1-3 Complete** | 🚧 **Phase 4 80% Complete** | 3.8/8 major phases done

**Next Milestone:** React Package Completion & Advanced Features (Q1 2026)
