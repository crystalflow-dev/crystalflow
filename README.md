# ReactFlo

**A declarative workflow builder framework that lets you focus on "what to do" instead of "how to do it".**

ReactFlo is a modern, extensible framework for building visual workflow editors. Simply define your nodes with specific methods, and ReactFlo automatically detects them, generates the UI, and handles all the execution logic.

## 🎯 Vision

Stop building workflow builders from scratch. Stop writing boilerplate for node registration, connection validation, and execution orchestration. ReactFlo provides a complete, production-ready workflow system where you only define your business logic.

**We build the how, you focus on the what.**

ReactFlo is a framework, not a finished product. It provides everything you need to build custom workflow applications for your specific domain—whether that's data pipelines, automation systems, business processes, or creative tools.

## ✨ Key Features

- **Declarative Node Definition** - Define nodes using decorators (@defineNode, @Input, @Output)
- **Automatic Discovery** - Nodes are automatically detected and registered
- **Type-Safe Connections** - Built-in validation for node inputs and outputs
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
  category: 'Math'
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
      showJsonEditor={true}  // Built-in JSON editor
      editorMode="split"     // Visual + JSON side-by-side
      onWorkflowChange={(workflow) => {
        console.log('Workflow JSON:', workflow);
      }}
    />
  );
}
```

## 📦 Packages

ReactFlo is organized as a monorepo with multiple packages:

- `@reactflo/core` - Core workflow engine and node system
- `@reactflo/react` - React components bridging decorators to React Flow
- `@reactflo/cli` - Command-line tools for scaffolding and development
- `@reactflo/plugins` - Official plugin collection
- `@reactflo/types` - TypeScript type definitions

**Built on:** React Flow (for canvas/UI), TypeScript (with decorators)

## 🗺️ Roadmap

### Phase 1: Core Foundation (Current)
- [x] Project setup and repository structure
- [ ] Core workflow engine
  - [ ] Node registration system
  - [ ] Connection graph validation
  - [ ] Execution orchestrator
  - [ ] Event system for lifecycle hooks
  - [ ] JSON serialization/deserialization
- [ ] Node definition API
  - [ ] Decorator-based definition
  - [ ] Class-based definition
  - [ ] Input/Output types and validation
  - [ ] Node metadata system
- [ ] JSON Schema definition
- [ ] Basic TypeScript support

### Phase 2: Visual Builder (Q1 2026)
- [ ] React workflow builder component
  - [ ] Integrate React Flow
  - [ ] Bridge decorated nodes to React Flow nodes
  - [ ] Custom node renderer from definitions
  - [ ] Connection validation using core
  - [ ] Node palette from registry
  - [ ] Property inspector
  - [ ] Integrated JSON editor (Monaco)
  - [ ] Dual-mode editing with real-time sync
- [ ] State management integration
- [ ] Undo/redo system (via React Flow)
- [ ] Workflow serialization (save/load)

### Phase 3: Advanced Features (Q2 2026)
- [ ] Execution features
  - [ ] Async/await support
  - [ ] Parallel execution
  - [ ] Conditional branching
  - [ ] Loop nodes
  - [ ] Error handling and recovery
- [ ] Developer tools
  - [ ] Debugging interface
  - [ ] Execution visualization
  - [ ] Performance profiling
- [ ] Plugin system
  - [ ] Custom node types
  - [ ] Custom validation rules
  - [ ] Custom execution strategies

### Phase 4: Ecosystem & Tooling (Q3 2026)
- [ ] CLI tools
  - [ ] Project scaffolding
  - [ ] Node generator
  - [ ] Build and bundle tools
- [ ] Documentation site
  - [ ] Interactive examples
  - [ ] API reference
  - [ ] Guides and tutorials
- [ ] Official plugins
  - [ ] HTTP/REST nodes
  - [ ] Database nodes
  - [ ] File system nodes
  - [ ] Data transformation nodes

### Phase 5: Production Ready (Q4 2026)
- [ ] Testing infrastructure
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Migration guides
- [ ] v1.0.0 release

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

**Status:** 🚧 Under active development

**Documentation:** Coming soon
