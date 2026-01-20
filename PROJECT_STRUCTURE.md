# ReactFlo Project Structure

This document outlines the complete file and directory structure for the ReactFlo framework.

## Overview

ReactFlo is organized as a monorepo using npm workspaces (or pnpm/yarn workspaces). This allows us to maintain multiple related packages in a single repository.

## Directory Structure

```
reactflo/
├── packages/
│   ├── core/                          # Core workflow engine
│   │   ├── src/
│   │   │   ├── index.ts               # Main entry point
│   │   │   ├── node/                  # Node system
│   │   │   │   ├── Node.ts            # Base Node class
│   │   │   │   ├── NodeRegistry.ts    # Node registration system
│   │   │   │   ├── NodeFactory.ts     # Node instantiation
│   │   │   │   ├── decorators.ts      # Node decorators (@Input, @Output, etc.)
│   │   │   │   └── types.ts           # Node type definitions
│   │   │   ├── workflow/              # Workflow management
│   │   │   │   ├── Workflow.ts        # Workflow container
│   │   │   │   ├── Connection.ts      # Connection between nodes
│   │   │   │   ├── Graph.ts           # Workflow graph structure
│   │   │   │   └── Validator.ts       # Connection validation
│   │   │   ├── execution/             # Execution engine
│   │   │   │   ├── Executor.ts        # Main execution orchestrator
│   │   │   │   ├── ExecutionContext.ts # Execution state management
│   │   │   │   ├── ExecutionStrategy.ts # Execution strategies
│   │   │   │   └── AsyncExecutor.ts   # Async execution handler
│   │   │   ├── events/                # Event system
│   │   │   │   ├── EventEmitter.ts    # Event emitter
│   │   │   │   └── events.ts          # Event type definitions
│   │   │   ├── types/                 # Data types
│   │   │   │   ├── DataType.ts        # Type system
│   │   │   │   ├── TypeValidator.ts   # Type validation
│   │   │   │   └── builtinTypes.ts    # Built-in types (string, number, etc.)
│   │   │   └── utils/                 # Utilities
│   │   │       ├── serialization.ts   # Workflow serialization
│   │   │       ├── logger.ts          # Logging utility
│   │   │       └── errors.ts          # Custom error classes
│   │   ├── tests/                     # Unit tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── react/                         # React UI components
│   │   ├── src/
│   │   │   ├── index.ts               # Main entry point
│   │   │   ├── components/            # React components
│   │   │   │   ├── WorkflowBuilder/   # Main builder component
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── WorkflowBuilder.tsx
│   │   │   │   │   ├── Canvas.tsx     # Workflow canvas
│   │   │   │   │   └── styles.css
│   │   │   │   ├── Node/              # Node component
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── NodeComponent.tsx
│   │   │   │   │   ├── NodeHeader.tsx
│   │   │   │   │   ├── NodePort.tsx   # Input/Output ports
│   │   │   │   │   └── styles.css
│   │   │   │   ├── Connection/        # Connection component
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── ConnectionLine.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── NodePalette/       # Node library/palette
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── NodePalette.tsx
│   │   │   │   │   ├── NodeCategory.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── PropertyPanel/     # Property inspector
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── PropertyPanel.tsx
│   │   │   │   │   ├── PropertyEditor.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   └── Toolbar/           # Toolbar
│   │   │   │       ├── index.tsx
│   │   │   │       ├── Toolbar.tsx
│   │   │   │       └── styles.css
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   │   ├── useWorkflow.ts
│   │   │   │   ├── useNode.ts
│   │   │   │   ├── useConnection.ts
│   │   │   │   ├── usePanZoom.ts
│   │   │   │   └── useSelection.ts
│   │   │   ├── context/               # React context
│   │   │   │   ├── WorkflowContext.tsx
│   │   │   │   └── ThemeContext.tsx
│   │   │   ├── store/                 # State management
│   │   │   │   ├── workflowStore.ts
│   │   │   │   └── types.ts
│   │   │   └── utils/                 # UI utilities
│   │   │       ├── canvas.ts          # Canvas utilities
│   │   │       ├── geometry.ts        # Geometric calculations
│   │   │       └── theme.ts           # Theme utilities
│   │   ├── tests/                     # Unit tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── cli/                           # CLI tools
│   │   ├── src/
│   │   │   ├── index.ts               # CLI entry point
│   │   │   ├── commands/              # CLI commands
│   │   │   │   ├── init.ts            # Initialize project
│   │   │   │   ├── generate.ts        # Generate node
│   │   │   │   ├── build.ts           # Build project
│   │   │   │   └── dev.ts             # Development server
│   │   │   ├── templates/             # Code templates
│   │   │   │   ├── node.ts.template
│   │   │   │   ├── workflow.ts.template
│   │   │   │   └── project/           # Project templates
│   │   │   ├── utils/                 # CLI utilities
│   │   │   │   ├── filesystem.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── prompts.ts
│   │   │   └── config/                # CLI configuration
│   │   │       └── defaults.ts
│   │   ├── bin/                       # Executable files
│   │   │   └── reactflo.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── types/                         # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── node.ts                # Node-related types
│   │   │   ├── workflow.ts            # Workflow-related types
│   │   │   ├── execution.ts           # Execution-related types
│   │   │   └── ui.ts                  # UI-related types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── plugins/                       # Official plugins
│       ├── src/
│       │   ├── index.ts
│       │   ├── http/                  # HTTP nodes
│       │   ├── data/                  # Data manipulation nodes
│       │   ├── logic/                 # Logic nodes
│       │   └── utils/                 # Utility nodes
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── examples/                          # Example applications
│   ├── basic/                         # Basic usage example
│   ├── advanced/                      # Advanced features example
│   └── custom-nodes/                  # Custom node example
│
├── docs/                              # Documentation
│   ├── getting-started.md
│   ├── core-concepts.md
│   ├── api-reference/
│   ├── guides/
│   └── examples/
│
├── scripts/                           # Build and utility scripts
│   ├── build.sh
│   ├── test.sh
│   ├── publish.sh
│   └── setup.sh
│
├── .github/                           # GitHub configuration
│   ├── workflows/                     # CI/CD workflows
│   │   ├── ci.yml
│   │   ├── publish.yml
│   │   └── test.yml
│   └── ISSUE_TEMPLATE/
│
├── package.json                       # Root package.json (workspace)
├── tsconfig.json                      # Root TypeScript config
├── tsconfig.build.json                # Build-specific TS config
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── jest.config.js                     # Jest configuration
├── lerna.json                         # Lerna configuration (optional)
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

## Package Descriptions

### @reactflo/core
The core engine that powers ReactFlo. Contains:
- Node registration and management
- Workflow graph structure
- Execution engine
- Type system and validation
- Event system

**Dependencies:** None (zero dependencies)

### @reactflo/react
React components for building workflow UIs. Contains:
- WorkflowBuilder component
- Canvas with pan/zoom
- Node rendering
- Connection drawing
- Property inspector

**Dependencies:** react, react-dom, @reactflo/core

### @reactflo/cli
Command-line tools for developers. Contains:
- Project scaffolding
- Node generator
- Development server
- Build tools

**Dependencies:** commander, inquirer, @reactflo/core

### @reactflo/types
Shared TypeScript type definitions used across all packages.

**Dependencies:** None

### @reactflo/plugins
Collection of official pre-built nodes for common use cases.

**Dependencies:** @reactflo/core

## Development Workflow

1. **Initial Setup:**
   ```bash
   npm install
   npm run bootstrap  # Install dependencies for all packages
   npm run build      # Build all packages
   ```

2. **Development:**
   ```bash
   npm run dev        # Start development mode with watch
   ```

3. **Testing:**
   ```bash
   npm test           # Run all tests
   npm run test:watch # Run tests in watch mode
   ```

4. **Building:**
   ```bash
   npm run build      # Build all packages
   ```

## Next Steps

1. Initialize the monorepo structure with workspace configuration
2. Create the core package with basic node system
3. Implement the workflow engine
4. Build the React components
5. Add examples and documentation

## Notes

- All packages use TypeScript for type safety
- Jest for testing
- ESLint + Prettier for code quality
- Conventional Commits for version management
- Semantic versioning for releases
