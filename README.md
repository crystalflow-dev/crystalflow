<div align="center">
  <img src="assets/logo/reactflo-logo-blue.png" alt="ReactFlo Logo" width="500" />
</div>

<br/>

# ReactFlo

**Build your own AI automation platform, workflow builder, or no-code tool.**

ReactFlo is a **declarative framework** for building visual workflow editors—like Make.com, Zapier, n8n, or LangFlow. Stop building workflow infrastructure from scratch. Focus on your unique features while ReactFlo handles the complexity.

## 🎯 Vision

The AI automation space is exploding. Everyone needs workflow builders:
- **AI Developers** building agent orchestration platforms
- **No-Code Entrepreneurs** creating automation tools
- **Data Teams** building ETL and pipeline tools
- **Enterprises** automating business processes

But building a workflow editor is hard. You need:
- Visual canvas with drag-and-drop
- Execution engine with error handling
- JSON serialization for storage
- Type-safe connections
- Real-time updates
- Undo/redo, validation, debugging...

**ReactFlo gives you all of this.** Stop reinventing the wheel.

**We build the how, you focus on the what.**

ReactFlo is a framework, not a finished product. It provides everything you need to build custom workflow applications for your specific domain—whether that's AI agent automation, business process tools, data pipelines, or creative workflows.

## ✨ Key Features

### 🤖 Perfect for AI & Automation
- **AI Agent Workflows** - Build LangChain/LangGraph visual tools, RAG pipelines, multi-agent systems
- **No-Code Automation** - Create Zapier/Make.com alternatives for non-technical users
- **Data Pipelines** - Visual ETL for data scientists and analysts

### 🚀 Developer Experience
- **Declarative Node System** - Define nodes using TypeScript decorators (@defineNode, @Input, @Output, @Property)
- **Automatic Discovery** - Nodes are automatically detected and registered—no manual wiring
- **Type-Safe Connections** - Built-in validation for node inputs and outputs
- **Zero UI Boilerplate** - Declare your nodes, ReactFlo generates the UI automatically

### 🎨 Production-Ready UI
- **Visual Workflow Builder** - Built on React Flow for production-ready UI
- **Flexible Styling System** - Comprehensive customization with classNames, styles, and ReactFlow props
- **Dual-Mode Editing** - Visual builder + JSON editor with real-time sync

### ⚡ Robust Execution
- **Execution Engine** - Handles workflow execution, async operations, and error handling
- **JSON Workflow Format** - Import/export workflows as well-structured JSON
- **Real-Time Events** - Monitor execution with event hooks
- **Extensible** - Plugin system for custom node types and behaviors

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

## 🤖 What Can You Build?

ReactFlo is perfect for building:

### AI & Automation Platforms
- **AI Agent Orchestration** - Build LangFlow/Flowise alternatives
- **ChatGPT Workflow Builders** - Let users chain AI prompts visually
- **RAG Pipeline Builders** - Visual tools for retrieval-augmented generation
- **Multi-Agent Systems** - Coordinate multiple AI agents

### No-Code/Low-Code Tools
- **Automation Platforms** - Your own Zapier, Make.com, or n8n
- **Business Process Automation** - Workflow tools for enterprises
- **Integration Platforms** - Connect APIs and webhooks visually

### Data & Analytics
- **ETL Tools** - Visual data transformation pipelines
- **Data Processing** - Real-time data enrichment and routing
- **Analytics Workflows** - Build data analysis tools

### Developer Tools
- **CI/CD Pipelines** - Visual deployment workflows
- **Testing Automation** - Orchestrate test suites
- **DevOps Tools** - Infrastructure automation

### IoT & Smart Systems
- **Smart Home Automation** - Visual programming for IoT
- **Edge Computing** - Workflow processing on edge devices
- **Sensor Data Processing** - Real-time IoT data flows

## 📦 Packages

ReactFlo is organized as a monorepo with multiple packages:

- `@reactflo/core` ✅ - Core workflow engine and node system (100% complete)
- `@reactflo/types` ✅ - TypeScript type definitions (100% complete)
- `@reactflo/react` 🚧 - React components bridging decorators to React Flow (80% complete)
- `@reactflo/examples` 🚧 - Example applications and demos (in progress)
- `@reactflo/landing` 🚧 - Marketing/landing page (Next.js)
- `@reactflo/docs-site` ✅ - Official documentation site (Mintlify)
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

### Phase 9: Server-Side Execution Architecture (Future)

- [ ] Server infrastructure
  - [ ] Create @reactflo/server package
  - [ ] Design REST API specification (OpenAPI)
  - [ ] Implement workflow management endpoints
  - [ ] Implement execution endpoints
  - [ ] Build execution queue system
  - [ ] Add real-time event streaming (WebSocket/SSE)
- [ ] Client integration
  - [ ] Create @reactflo/client SDK
  - [ ] Implement adapter pattern for local/remote execution
  - [ ] Update @reactflo/react for remote execution support
- [ ] Production features
  - [ ] Authentication & authorization (JWT, API keys)
  - [ ] Workflow persistence (database integration)
  - [ ] Error handling & monitoring
  - [ ] Server deployment configuration
- [ ] Documentation & migration
  - [ ] API documentation (Swagger UI)
  - [ ] Client SDK documentation
  - [ ] Migration guide from local to remote
  - [ ] Integration & E2E tests

## 🏗️ Architecture

ReactFlo builds on top of React Flow, adding a **declarative layer** and execution engine:

**For Developers:** Declare nodes with decorators, not manual UI code.  
**For Non-Developers:** Visual drag-and-drop workflow builder—no coding required.

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
