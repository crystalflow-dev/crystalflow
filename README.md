<div align="center">
  <img src="assets/logo/crystalflow-logo-blue-dark.png" alt="CrystalFlow Logo" width="500" />
</div>

<br/>

<p align="center">
  <a href="https://github.com/fladeed/crystalflow/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/crystalflow/crystalflow/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/fladeed/crystalflow/releases"><img src="https://img.shields.io/github/v/release/crystalflow/crystalflow?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

# CrystalFlow

**A declarative framework for building visual workflow editors.**

CrystalFlow gives you everything needed to build custom workflow applications—AI agent platforms, automation tools, data pipelines, or no-code builders. Define nodes with TypeScript decorators, get a production-ready visual editor with execution engine included.

**We build the how, you focus on the what.**

Built on React Flow. Inspired by Node-RED, LangFlow, and modern automation platforms.

## Vision

The AI automation space is exploding. Every team needs workflow builders:

- AI developers building agent orchestration platforms
- No-code entrepreneurs creating automation tools
- Data teams building ETL and pipeline tools
- Enterprises automating business processes

But building a workflow editor is hard. Visual canvas, execution engine, JSON serialization, type-safe connections, validation, debugging—it's a lot.

**CrystalFlow gives you all of this.** Stop reinventing the wheel.

CrystalFlow is a framework, not a finished product. It provides the infrastructure so you can focus on your unique features and domain-specific nodes.

## Quick Start

**Define nodes with decorators:**

```typescript
import { Node, Input, Output, defineNode } from '@crystalflow/core';

@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' }) a: number;
  @Input({ type: 'number', label: 'B' }) b: number;
  @Output({ type: 'number', label: 'Result' }) result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

**Get a visual builder:**

```tsx
import { WorkflowBuilder } from '@crystalflow/react';

<WorkflowBuilder
  nodes={[AddNode]}
  onWorkflowChange={(workflow) => console.log(workflow)}
/>
```

Full guide: [Getting Started](https://docs.crystalflow.dev/getting-started)

## Getting Started

```bash
npm install

npm run build

npm run dev
```

The dev command starts watch mode for all packages plus the examples dev server with hot-reload.

More details: [Development Workflow](https://docs.crystalflow.dev/guides/development-workflow)

## Documentation

- [Getting Started](https://docs.crystalflow.dev/getting-started) - Complete guide to using CrystalFlow
- [Core Concepts](https://docs.crystalflow.dev/core-concepts) - Nodes, workflows, and execution
- [API Reference](https://docs.crystalflow.dev/api-reference) - Complete API documentation
- [Examples](https://docs.crystalflow.dev/examples) - Sample workflows and use cases

## What You Can Build

CrystalFlow is perfect for:

- AI agent orchestration platforms (LangFlow/Flowise alternatives)
- No-code automation tools (Zapier, Make.com, n8n alternatives)
- Data pipelines and ETL tools
- Business process automation
- CI/CD workflow builders
- IoT and smart home automation
- Visual programming environments

## Packages

CrystalFlow is organized as a monorepo:

- `@crystalflow/core` - Core workflow engine and node system
- `@crystalflow/types` - TypeScript type definitions
- `@crystalflow/react` - React components bridging decorators to React Flow
- `@crystalflow/examples` - Example applications
- `@crystalflow/landing` - Marketing/landing page
- `@crystalflow/docs-site` - Official documentation site
- `@crystalflow/cli` - CLI tools (planned)
- `@crystalflow/plugins` - Official plugins (planned)

**Built on:** React Flow, TypeScript with decorators

## Architecture

CrystalFlow adds a declarative layer and execution engine on top of React Flow:

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#e8f4f8','primaryTextColor':'#1a1a1a','primaryBorderColor':'#2563eb','lineColor':'#2563eb','secondaryColor':'#f0fdf4','tertiaryColor':'#fef3c7'}}}%%
graph TB
    A["<b>👤 User Applications</b><br/><br/>Define nodes with @decorators<br/>TypeScript classes with metadata"]
    B["<b>🔗 @crystalflow/react</b><br/><br/>Workflow Builder Component<br/>Bridges decorators ↔ React Flow<br/>Visual editor, palette, properties"]
    C["<b>🎨 React Flow</b><br/><br/>Canvas & UI Layer<br/>Pan, zoom, drag & drop<br/>Node & edge rendering"]
    D["<b>⚙️ @crystalflow/core</b><br/><br/>Workflow Engine<br/>Node system & registry<br/>Execution & validation"]
    
    A -->|"registers nodes"| B
    B -->|"renders UI"| C
    B -->|"executes workflows"| D
    
    style A fill:#dcfce7,stroke:#16a34a,stroke-width:3px,color:#14532d,rx:25,ry:25
    style B fill:#dbeafe,stroke:#2563eb,stroke-width:3px,color:#1e3a8a,rx:25,ry:25
    style C fill:#f3e8ff,stroke:#9333ea,stroke-width:3px,color:#581c87,rx:25,ry:25
    style D fill:#fed7aa,stroke:#ea580c,stroke-width:3px,color:#7c2d12,rx:25,ry:25
    
    classDef default font-size:14px,font-family:system-ui
```

We leverage React Flow for the UI layer and focus CrystalFlow on declarative node definitions, automatic registration, and powerful execution.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**We build the how, you focus on the what.**

