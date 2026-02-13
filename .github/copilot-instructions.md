# GitHub Copilot Instructions for CrystalFlow

## Project Overview

CrystalFlow is a declarative workflow builder framework that provides tools for creating custom workflow applications. It uses TypeScript decorators for node definitions, React Flow for the UI layer, and includes a complete execution engine with JSON serialization.

**Core Principle:** "We build the how, you focus on the what."

## Important: No Backward Compatibility Required

**Version 1.0.0 has not been published yet.** Therefore:

- **DO NOT maintain backward compatibility** for any changes
- **DO NOT keep deprecated methods** or legacy code
- **DO NOT add compatibility layers** or fallback logic
- Feel free to make breaking changes to improve the codebase
- Focus on clean, maintainable code over compatibility concerns

Once version 1.0.0 is published, semantic versioning and backward compatibility rules will apply.

## Documentation Organization Rules

**File Placement:**
- **README.md** and **CONTRIBUTING.md** should remain in the project root (uppercase)
- **ALL other markdown files** must be placed in the `docs/` folder with proper categorization
- Never create new markdown files in the root directory (except README.md and CONTRIBUTING.md)

**Naming Convention:**
- Use **kebab-case** (lowercase with dashes) for all markdown files
- Examples: `get-started.md`, `development-workflow.md`, `project-status.md`
- ❌ NEVER use: `GET_STARTED.md`, `DEVELOPMENT_WORKFLOW.md`, `Project_Status.md`
- ✅ ALWAYS use: `get-started.md`, `development-workflow.md`, `project-status.md`

**Documentation Categories:**
- `docs/guides/` - Getting started guides and quick references for users
- `docs/concepts/` - Core concepts, architecture, and technical explanations
- `docs/advanced/` - Advanced topics and customization guides
- `docs/development/` - Development workflow, setup, project status, and contributor docs
- `docs/design/` - Brand guidelines and design documentation
- `docs/design-notes/` - Design decisions and technical notes

**When Creating New Documentation:**
1. Determine the appropriate category folder
2. Create file in the correct category folder with kebab-case naming
3. Update `docs/documentation-index.md` with the new file reference
4. Use relative paths when linking between docs

**Reference Format:**
- From root to docs: `[link text](docs/category/filename.md)`
- From docs to root: `[link text](../README.md)` or `[link text](../CONTRIBUTING.md)`
- Between docs (same category): `[link text](filename.md)`
- Between docs (different categories): `[link text](../other-category/filename.md)`

## Architecture

```
User Applications (decorated nodes)
         ↓
@crystalflow/react (bridges decorators → React Flow)
         ↓
React Flow (canvas, rendering, UI primitives)
         ↓
@crystalflow/core (execution engine, validation)
```

## Technology Stack

- **TypeScript 5.3+** with strict mode and experimental decorators
- **React 18+** for UI components
- **React Flow 11+** for visual workflow canvas
- **Monaco Editor** for JSON editing
- **Reflect-metadata** for decorator metadata
- **Jest** for testing
- **ESLint + Prettier** for code quality

## Package Structure (Monorepo)

```
packages/
├── core/          # Node system, workflow engine, execution (zero dependencies)
├── types/         # Shared TypeScript type definitions
├── react/         # React components (depends on React Flow + Monaco)
├── examples/      # Example applications demonstrating CrystalFlow usage
├── landing/       # Marketing/landing page (Next.js with conditional navigation)
├── docs-site/     # Official documentation (Mintlify)
├── cli/           # CLI tools (future)
└── plugins/       # Official plugins (future)
```

### Landing Page Architecture

The landing page (`packages/landing/`) is built with Next.js and features:

- **Conditional Navigation**: Navbar adapts based on current route
  - Home page (`/`): Shows all navigation items (Features, Use Cases, Roadmap, etc.)
  - Demo page (`/demo`): Shows only Docs link, hides anchor links that don't exist on demo page
  - Button text changes: "Try Demo" on home → "Go Back" with arrow icon on demo page
- **Separate Demo Page**: Interactive workflow demo at `/demo` route for better focus and direct linking
- **Component Structure**:
  - `Navbar.tsx`: Conditional rendering with `usePathname()` hook
  - `Hero.tsx`: AI automation messaging with floating code/workflow visualizations
  - `Roadmap.tsx`: 9-phase compact grid with MVP highlighting (Phases 1-4)
  - `AIUseCases.tsx`: 6 use case cards emphasizing AI/automation capabilities
  - `Contributors.tsx`: "Become an Early Contributor" section
  - `InteractiveDemo.tsx`: Full workflow builder on separate demo page
- **Design System**: Consistent colors (primary: #2A41FF, secondary: #10B981), spacing (py-32), and animations (Framer Motion)

## Key Concepts

### 1. Decorator-Based Node Definitions

Nodes are defined using TypeScript decorators:

```typescript
@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
class AddNode extends Node {
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

### 1.1. Property System (NEW)

**Properties vs Inputs - Critical Distinction:**

- **@Property** = Static configuration values (shown in properties panel)
- **@Input** = Dynamic data flow connections (connected via handles)
- **@Output** = Computed results (generated during execution)

```typescript
@defineNode({
  type: 'examples.config-demo',
  label: 'Configuration Demo',
  category: 'Examples',
})
class ConfigDemoNode extends Node {
  // Properties: Static configuration (not connected)
  @Property({
    type: 'string',
    label: 'Base Message',
    defaultValue: 'Hello, World!',
    description: 'Base message to process',
  })
  baseMessage: string = 'Hello, World!';

  @Property({
    type: 'select',
    label: 'Transform Type',
    defaultValue: 'uppercase',
    options: [
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'lowercase', label: 'lowercase' },
    ],
  })
  transformType: string = 'uppercase';

  @Property({
    type: 'number',
    label: 'Repeat Count',
    defaultValue: 1,
    min: 1,
    max: 10,
    step: 1,
  })
  repeatCount: number = 1;

  // Input: Data flow (can be connected)
  @Input({ type: 'string', label: 'Message Override', required: false })
  messageOverride?: string;

  // Output: Computed result
  @Output({ type: 'string', label: 'Result' })
  result: string;

  execute() {
    const message = this.messageOverride || this.baseMessage;
    this.result = this.transformMessage(message);
  }
}
```

### 1.2. Property Inheritance

Properties support inheritance for base node classes:

```typescript
// Base class with global properties
class BaseNode extends Node {
  @Property({
    type: 'boolean',
    label: 'Enable Logging',
    defaultValue: false,
  })
  enableLogging: boolean = false;

  @Property({
    type: 'number',
    label: 'Timeout (ms)',
    defaultValue: 30000,
    min: 1000,
    max: 300000,
  })
  timeout: number = 30000;
}

// Child class inherits properties
@defineNode({ type: 'http.request', label: 'HTTP Request' })
class HttpRequestNode extends BaseNode {
  // Inherits enableLogging and timeout properties automatically

  @Property({ type: 'string', label: 'URL', required: true })
  url: string = '';

  execute() {
    if (this.enableLogging) {
      console.log(`Making request to ${this.url} with timeout ${this.timeout}ms`);
    }
  }
}
```

**Property System Features:**

- Type-safe property definitions with constraints
- Support for string, number, boolean, select types
- Min/max/step constraints for numbers
- Options array for select dropdowns
- Default values and validation
- Inheritance from base classes
- Automatic UI generation in properties panel

**Important:**

- Decorators are for Node classes (business logic), not React components
- React components consume decorated nodes
- `experimentalDecorators: true` is enabled in tsconfig

### 2. JSON Workflow Format

All workflows are serializable to/from JSON:

```json
{
  "version": "1.0.0",
  "id": "workflow-id",
  "name": "Workflow Name",
  "nodes": [...],
  "connections": [...],
  "variables": {}
}
```

- Schema version: 1.0.0
- Formal JSON Schema at `schema/workflow.schema.json`
- Utilities: `serializeWorkflow()`, `deserializeWorkflow()`, `validateWorkflowJSON()`

### 3. React Flow Integration

The visual builder is built on React Flow:

- Don't reinvent canvas/pan/zoom - use React Flow
- Bridge decorated nodes → React Flow nodes
- Custom node renderer based on metadata

### 4. Dual-Mode Editing

The UI supports:

- **Visual Mode** - Drag-and-drop node editor
- **JSON Mode** - Monaco Editor for code editing
- **Split Mode** - Both views with real-time sync

## Coding Conventions

### File Naming

- **PascalCase** for classes: `Node.ts`, `Workflow.ts`, `NodeRegistry.ts`
- **camelCase** for utilities: `logger.ts`, `serialization.ts`
- **lowercase** for folders: `node/`, `workflow/`, `execution/`
- **Test files**: `*.test.ts` or `*.spec.ts`

### Code Style

- Use **strict TypeScript** - avoid `any` unless necessary
- Prefer **interfaces** over types for object shapes
- Use **arrow functions** for callbacks
- Use **async/await** over promises
- Export **named exports** (no default exports)

### Error Handling

```typescript
import { ExecutionError, NodeExecutionError, ValidationError, TimeoutError } from '@crystalflow/core';

// Execution errors include context
throw new NodeExecutionError(`Failed to execute node ${nodeId}`, {
  nodeId,
  nodeType: 'math.add',
  executionId,
  workflowId,
  cause: error
});

// All execution errors have executionId and workflowId
catch (error) {
  if (error instanceof NodeExecutionError) {
    console.error(`Node ${error.nodeId} of type ${error.nodeType} failed`);
  }
}
```

### Logging

```typescript
import { Logger } from './utils/logger';

const logger = new Logger('ComponentName');
logger.debug('Message', { context });
logger.error('Error occurred', error);
```

## Development Workflow

### Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start development mode (watch all packages + examples dev server)
npm run dev
```

Development mode uses `concurrently` to run all TypeScript watch modes in parallel with the Vite dev server:

- Watches `@crystalflow/types` and rebuilds on changes (cyan output)
- Watches `@crystalflow/core` and rebuilds on changes (magenta output)
- Watches `@crystalflow/react` and rebuilds on changes (blue output)
- Runs Vite dev server for `@crystalflow/examples` (green output)

Changes to any package are automatically compiled and hot-reloaded in the browser.

**See [docs/development-workflow.md](../docs/development-workflow.md) for detailed development instructions.**

### Key Commands

- `npm run dev` - Watch mode for all packages + examples dev server (parallel)
- `npm run build` - Build all packages
- `npm test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all build artifacts

### Development Configuration

- **Root tsconfig.json**: `moduleResolution: "bundler"` (changed from "node")
- **Build configs**: Override with `moduleResolution: "node"` for library builds
- **Vite config**: Watches `node_modules/@crystalflow/*/dist` for hot-reload
- **No Vite aliases**: Examples consume built packages (production-like)
- **Concurrently**: Color-coded output for easy debugging

### TypeScript Module Resolution Change

The root `tsconfig.json` was updated from `moduleResolution: "node"` to `moduleResolution: "bundler"` to fix build issues. Individual packages override this in their `tsconfig.build.json` with `"moduleResolution": "node"` for proper library builds.

## Package-Specific Guidelines

### @crystalflow/core

- **Zero external dependencies** (except reflect-metadata) - keep it lightweight
- All exports must be in `src/index.ts`
- Use `reflect-metadata` for decorator metadata
- Validate all inputs and throw descriptive errors
- Node base class provides: validate(), execute(), run(), reset(), toJSON(), fromJSON()
- Use index signature `[key: string]: unknown` for dynamic properties
- Prefer `unknown` over `any` for type safety

### @crystalflow/types

- Pure type definitions only
- No runtime code
- Export all types from `src/index.ts`

### @crystalflow/react

- Use React 18+ features (hooks, concurrent mode)
- Leverage React Flow - don't rebuild canvas
- Use Monaco Editor for JSON editing
- All components should be functional (no classes)
- Use TypeScript generics for reusable components
- **CSS files**: All component styles go in `src/styles/` folder (automatically imported via import.meta.glob)
- **No manual CSS imports**: Just create `.css` files in styles folder—they're auto-detected and injected at runtime
- **CSS-in-JS approach**: Styles are bundled as strings and injected when WorkflowBuilder mounts

### Styling Consistency Rules (CRITICAL)

**All React components and styles MUST follow these rules for consistency:**

#### 1. CSS Variables Only - Zero Hardcoded Values
- ❌ **NEVER** use hardcoded colors: `#1e1e1e`, `rgba(0,0,0,0.5)`, `white`, `black`
- ❌ **NEVER** use old CSS custom properties: `--crystalflow-*` prefix is deprecated
- ✅ **ALWAYS** use theme variables from `src/styles/global.css`

**Color Variables:**
```css
/* Backgrounds */
--color-bg-primary, --color-bg-secondary, --color-bg-tertiary, --color-bg-elevated

/* Text */
--color-text-primary, --color-text-secondary, --color-text-tertiary

/* Borders */
--color-border-light, --color-border-medium, --color-border-strong

/* Primary brand */
--color-primary-50 through --color-primary-900

/* Semantic colors */
--color-error-*, --color-success-*, --color-warning-*
```

**Spacing Variables:**
```css
--space-1 (4px), --space-2 (8px), --space-3 (12px), --space-4 (16px),
--space-5 (20px), --space-6 (24px), --space-7 (28px), --space-8 (32px)
```

**Typography Variables:**
```css
/* Families */
--font-family-base, --font-family-mono

/* Sizes */
--font-size-xs, --font-size-sm, --font-size-base, --font-size-lg, --font-size-xl, --font-size-2xl, --font-size-3xl

/* Weights */
--font-weight-normal, --font-weight-medium, --font-weight-semibold, --font-weight-bold
```

**Other Variables:**
```css
/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl

/* Border radius */
--radius-sm, --radius-md, --radius-lg, --radius-full

/* Transitions */
--transition-fast (150ms), --transition-normal (300ms), --transition-slow (500ms)
--ease-in, --ease-out, --ease-in-out
```

#### 2. Dark Mode Support
- ✅ **ALWAYS** use `[data-theme="dark"]` selector for dark mode overrides
- ❌ **NEVER** use `.react-flow.dark` or `.dark` selectors
- ✅ Test all components in both light and dark modes

```css
/* Light mode (default in :root) */
.component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* Dark mode override */
[data-theme="dark"] .component {
  background: var(--color-bg-primary); /* Theme variable adjusts automatically */
}
```

#### 3. Consistent Component Patterns

**Headers:**
```tsx
<div style={{
  padding: 'var(--space-4)',
  borderBottom: '1px solid var(--color-border-light)',
  background: 'var(--color-bg-secondary)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-base)',
}}>
```

**Buttons:**
```tsx
<button style={{
  padding: 'var(--space-2) var(--space-4)',
  border: '1px solid var(--color-border-medium)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-bg-elevated)',
  color: 'var(--color-text-primary)',
  fontSize: 'var(--font-size-sm)',
  transition: 'all var(--transition-fast) var(--ease-out)',
}}>
```

**Hover States:**
```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.background = 'var(--color-bg-tertiary)';
  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = 'var(--color-bg-elevated)';
  e.currentTarget.style.boxShadow = 'none';
}}
```

#### 4. Inline Styles Best Practices
- When using inline styles, **ALWAYS** use CSS variable references
- Keep hover state changes minimal and consistent
- Use theme variables for all colors, spacing, typography

```tsx
// ✅ GOOD - Uses theme variables
style={{
  background: 'var(--color-bg-primary)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-md)',
}}

// ❌ BAD - Hardcoded values
style={{
  background: '#1e1e1e',
  padding: '16px',
  borderRadius: '8px',
}}
```

#### 5. Before Making Style Changes - Checklist
- [ ] Are you using CSS variables for ALL colors?
- [ ] Are you using spacing variables (`--space-*`) not hardcoded pixels?
- [ ] Are you using typography variables for fonts and sizes?
- [ ] Have you added dark mode support with `[data-theme="dark"]`?
- [ ] Are transitions using `--transition-*` and `--ease-*` variables?
- [ ] Did you test in both light and dark modes?
- [ ] Are you following the established component patterns?

#### 6. Reference Documentation
When making style changes, refer to:
- **Theme System**: `packages/react/src/styles/global.css` - All available variables
- **Consistency Audit**: `docs/STYLING_CONSISTENCY_AUDIT.md` - Component examples and patterns
- **Component Examples**: PropertyPanel, NodePalette, CustomNode, Toolbar - All follow these rules

#### 7. Adding New Components
When creating new components:
1. Use existing CSS variables exclusively
2. Add to `src/styles/` folder if creating separate CSS file
3. Follow established spacing/typography conventions
4. Include dark mode support from the start
5. Match existing component patterns (headers, buttons, panels)

**This ensures a modern, consistent, startup-quality aesthetic across the entire framework.**

## Important Patterns

### Node Registration

```typescript
import { NodeRegistry } from '@crystalflow/core';

const registry = NodeRegistry.getInstance();
registry.register(AddNode);
registry.register(MultiplyNode);
```

### Workflow Creation and Execution

```typescript
import { Workflow, Executor } from '@crystalflow/core';

const workflow = new Workflow();
workflow.addNode(AddNode, { position: { x: 100, y: 100 } });
workflow.connect('sourceNodeId', 'outputPort', 'targetNodeId', 'inputPort');

// Execute workflow (returns ExecutionResult)
const result = await workflow.execute({
  timeout: 30000,
  variables: { apiKey: 'xxx' },
});

// Or use Executor directly with events
const executor = new Executor();
executor.on('onNodeStart', (nodeId, node) => {
  console.log(`Node ${nodeId} starting...`);
});
const result = await executor.execute(workflow, options);
```

### Serialization

```typescript
import { serializeWorkflow, deserializeWorkflow } from '@crystalflow/core';

// Export
const json = serializeWorkflow(workflow.toJSON());

// Import
const workflowData = deserializeWorkflow(json);
const workflow = Workflow.fromJSON(workflowData);
```

### React Component Usage

```tsx
import { WorkflowBuilder } from '@crystalflow/react';

<WorkflowBuilder
  nodes={[AddNode, MultiplyNode]}
  showJsonEditor={true}
  editorMode="split"
  onWorkflowChange={(workflow) => console.log(workflow)}
/>;
```

## Testing Guidelines

- Write tests alongside implementation
- Use descriptive test names: `it('should add node to workflow', ...)`
- Mock external dependencies
- Test both success and error cases
- Aim for 80%+ coverage

Example:

```typescript
describe('NodeRegistry', () => {
  describe('register', () => {
    it('should register a node type', () => {
      const registry = new NodeRegistry();
      registry.register(AddNode);
      expect(registry.has('math.add')).toBe(true);
    });
  });
});
```

## Common Tasks

### Creating a New Node Type

1. Extend `Node` base class
2. Add `@defineNode` decorator with metadata
3. Define inputs with `@Input` decorators
4. Define outputs with `@Output` decorators
5. Implement `execute()` method
6. Export from package index

### Adding a New Utility

1. Create file in `packages/core/src/utils/`
2. Export functions (not default export)
3. Add to `packages/core/src/index.ts`
4. Write tests in `__tests__/` folder

### Adding a React Component

1. Create in `packages/react/src/components/`
2. Use functional components with TypeScript
3. Define prop types interface
4. Export from `packages/react/src/index.ts`

## Best Practices

1. **Type Everything** - Leverage TypeScript fully
2. **Document Public APIs** - Use JSDoc comments
3. **Keep Core Lightweight** - @crystalflow/core has zero deps
4. **Validate Inputs** - Check types and required fields
5. **Use Decorators for Nodes** - Not for React components
6. **Leverage React Flow** - Don't rebuild canvas features
7. **Serialize Everything** - All workflows must be JSON-compatible
8. **Test as You Go** - Write tests alongside features

## Documentation

- All public APIs should have JSDoc comments
- Update README when adding features
- Create guides in `docs/` for major features
- Keep examples simple and working

## Commit Messages

Follow Conventional Commits:

```
feat(core): add async node execution support
fix(react): prevent connection to incompatible ports
docs(readme): update installation instructions
test(executor): add async execution tests
```

## What NOT to Do

❌ Don't use default exports
❌ Don't add dependencies to @crystalflow/core
❌ Don't use decorators on React components
❌ Don't rebuild canvas/pan/zoom (use React Flow)
❌ Don't use `any` type without good reason
❌ Don't commit without tests
❌ Don't break JSON serialization compatibility

## Related Files

- Architecture: `docs/core-concepts.md`
- JSON Schema: `docs/json-schema.md`, `schema/workflow.schema.json`
- Decorators: `docs/decorators-in-react.md`
- JSON Editor: `docs/json-editor.md`
- Project Status: `PROJECT_STATUS.md`
- Quick Reference: `QUICK_REFERENCE.md`

## Current Status

- **Phase:** Phase 4 🚧 100% COMPLETE (React Package - Fully Refactored with Property System)
- **Completed:**
  - Phase 1 (Node System - 100%)
  - Phase 2 (Workflow System - 100%)
  - Phase 3 (Basic Execution Engine - 100%)
  - Phase 4 - React Package Structure (100%)
  - Phase 4 - Core React Components (100%)
  - Phase 4 - Property System Integration (100%)
  - Phase 4 - WorkflowBuilder Refactoring (100%)
  - Phase 4 - Examples Package (100%)
- **Latest Updates:**
  - @Property decorator system with inheritance support
  - WorkflowBuilder refactored for Single Responsibility Principle
  - PropertyPanel updated to handle @Property vs @Input correctly
  - Input nodes converted to use @Property for configuration
- **Next:** Phase 5 - Monaco Editor integration, dual-mode editing
- **Tests:** 279 passing tests across all packages
- **Working Examples:** 1 (Complete workflow with property system and drag-and-drop)

## Execution Engine (Phase 3 - COMPLETED)

The serial execution engine is fully implemented with:

### Core Components

- **Executor** - Main orchestrator with AsyncEventEmitter support
- **ExecutionContext** - Manages state, variables, timing, and node results
- **Error Classes** - ExecutionError, NodeExecutionError, ValidationError, TimeoutError
- **AsyncEventEmitter** - Custom event emitter that supports async listeners

### Features

- ✅ Serial execution (nodes execute sequentially in topological order)
- ✅ Automatic data propagation between connected nodes
- ✅ Event system with async support (beforeExecute, afterExecute, onNodeStart, onNodeComplete, onNodeError, onError)
- ✅ Error handling (stops on first error with detailed context)
- ✅ Timing and duration tracking for workflow and nodes
- ✅ Variables support (pass variables to execution context)
- ✅ Full JSON serialization of ExecutionResult
- ✅ Workflow validation before execution
- ✅ AbortSignal support for cancellation

### Event System

The Executor uses `AsyncEventEmitter` which supports both synchronous and asynchronous event listeners. The executor will wait for all listeners (including async ones) to complete before continuing execution.

```typescript
const executor = new Executor();

// Synchronous event listeners
executor.on('beforeExecute', (context) => {
  console.log('Starting execution...');
});

// Asynchronous event listeners - executor waits for them!
executor.on('onNodeStart', async (nodeId, node) => {
  await logToDatabase(nodeId); // ✅ Executor waits
  await sendWebhook(node); // ✅ Executor waits
  console.log(`Executing ${nodeId}`);
});

executor.on('onNodeComplete', async (nodeId, result) => {
  await persistToStorage(result); // ✅ Executor waits
  console.log(`${nodeId} completed:`, result.outputs);
});

executor.on('onNodeError', async (nodeId, error) => {
  await notifyErrorService(error); // ✅ Executor waits
  console.error(`${nodeId} failed:`, error);
});

executor.on('afterExecute', async (result) => {
  await saveExecutionResult(result); // ✅ Executor waits
  console.log(`Execution ${result.status}`);
});

const result = await executor.execute(workflow, options);
```

**Key Features:**

- Both sync and async listeners are supported
- Executor waits for all listeners to complete before continuing
- Multiple listeners on the same event execute in parallel (via Promise.all)
- If any listener throws/rejects, execution stops with that error

### ExecutionResult

```typescript
interface ExecutionResult {
  id: string; // Unique execution ID
  workflowId: string; // Workflow being executed
  status: ExecutionStatus; // success, failed, cancelled
  startTime: Date; // When execution started
  endTime?: Date; // When execution ended
  duration?: number; // Duration in milliseconds
  nodeResults: Map<NodeId, NodeExecutionResult>; // Results for each node
  error?: Error; // Error if execution failed
}

interface NodeExecutionResult {
  nodeId: string;
  state: NodeState; // Success, Error
  outputs: Record<string, any>; // All output values (fully serializable)
  error?: Error;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}
```

### Execution Flow

1. Validate workflow (cycles, connections, required inputs)
2. Create ExecutionContext with unique executionId
3. Get topological order of nodes from Graph
4. For each node sequentially:
   - Check for cancellation (between nodes)
   - Emit `onNodeStart`
   - Transfer data from connected predecessor nodes
   - Execute node (validate → execute → update state)
   - Store execution result with outputs
   - Emit `onNodeComplete`
   - If error: emit `onNodeError` and stop execution
5. Return ExecutionResult with all timing and node data

### Cancellation System (ENHANCED - Phase 5 COMPLETE)

CrystalFlow provides comprehensive cancellation support:

**Cancellation Mechanisms:**

- ✅ **Timeout-based** - Set `timeout` in execution options
- ✅ **User-initiated** - Call `executor.cancel(executionId, reason)`
- ✅ **External signal** - Pass `abortSignal` in execution options
- ✅ **Between-node checks** - Automatic checks in execution loop
- ✅ **Mid-node checks** - Nodes call `this.checkCancellation()`

**Cancellation Reasons:**

- `timeout` - Execution exceeded timeout limit
- `user-cancelled` - User explicitly cancelled via API
- `external-signal` - Cancelled via AbortController/AbortSignal
- `resource-limit` - Resource constraints (reserved for future)

**Error Hierarchy:**

```typescript
CancellationError (base)
├── TimeoutError
└── UserCancelledError
```

**Cancellation API:**

```typescript
// Cancel specific execution
executor.cancel(executionId, CancellationReason.UserCancelled);

// Cancel all active executions
executor.cancelAll(CancellationReason.UserCancelled);

// Check if execution is active
if (executor.isExecutionActive(executionId)) {
  executor.cancel(executionId);
}

// Listen to cancellation events
executor.on('onCancellation', (executionId, reason, cancelledAt) => {
  console.log(`Execution ${executionId} cancelled: ${reason}`);
});
```

**Mid-Node Cancellation:**

```typescript
class LongRunningNode extends Node {
  async execute() {
    for (let i = 0; i < 1000; i++) {
      this.checkCancellation(); // Throws CancellationError if cancelled
      await processItem(i);
    }
  }
}
```

**ExecutionResult with Cancellation:**

```typescript
interface ExecutionResult {
  status: 'success' | 'failed' | 'cancelled';
  cancellationReason?: CancellationReason;
  cancelledAt?: Date;
  // ... other fields
}
```

## React Package (Phase 4 - COMPLETE)

The React package has been substantially refactored and improved with:

### Package Structure (Refactored for Single Responsibility)

- **Components** - Focused, single-purpose components
  - **WorkflowBuilder**: Main orchestrator component (refactored from 300+ lines to 80 lines)
  - **WorkflowCanvas**: Pure React Flow rendering component
  - **CustomNode**: Full node renderer with decorator metadata parsing
  - **NodePalette**: Drag-and-drop palette with category grouping and search
  - **PropertyPanel**: Complete property inspector supporting @Property decorators
  - **Toolbar**: Full toolbar with save/load/execute/clear actions

- **Focused Hooks** (NEW) - Each hook has a single responsibility
  - **useReactFlowState**: React Flow state management (nodes, edges, selection)
  - **useWorkflowExecution**: Workflow execution logic
  - **useWorkflowFileOperations**: Save/load operations with error handling
  - **useNodePalette**: Drag & drop logic and node creation
  - **useWorkflow**: Core workflow operations and state (existing)
  - **useNodeRegistry**: Access to registered node types (existing)
  - **useExecution**: Workflow execution with event handlers (existing)

- **Utilities**
  - nodeConverter.ts: Converts decorated nodes to React Flow format (supports @Property)
  - workflowConverter.ts: Serialization/deserialization utilities
  - Save/load workflow to/from JSON files

### Property System Integration

- **PropertyPanel** now properly handles @Property decorated values instead of @Input
- **Type-aware controls**: String, number, boolean, select with options
- **Property constraints**: Min/max/step for numbers, required fields
- **Default value support**: Shows and applies property defaults
- **Real-time updates**: Property changes immediately reflected in workflow
- **Inheritance support**: Properties from base classes automatically included

### Architecture Benefits After Refactoring

✅ **Single Responsibility**: Each hook/component has one clear purpose  
✅ **Testability**: Each piece can be tested in isolation  
✅ **Reusability**: Hooks can be used in other components  
✅ **Maintainability**: Changes to one concern don't affect others  
✅ **Readability**: Much easier to understand each piece  
✅ **Flexibility**: Can compose different workflows easily

### Current State (UPDATED)

- ✅ Package structure complete and refactored
- ✅ All core components fully implemented with single responsibility
- ✅ Property system fully integrated (@Property decorator support)
- ✅ WorkflowBuilder refactored into focused components and hooks
- ✅ Node converter supports properties extraction
- ✅ PropertyPanel handles properties vs inputs correctly
- ✅ Workflow execution applies property values correctly
- ✅ Input nodes converted to use @Property for configuration
- ✅ Package builds successfully with TypeScript strict mode
- ✅ All tests passing (279 tests)
- ⏳ Monaco JSON editor (next)
- ⏳ Dual-mode editing (next)
- ⏳ Undo/redo system (next)

### Examples Package (UPDATED)

- ✅ Package initialized with Vite
- ✅ Babel decorator support configured
- ✅ Example nodes: NumberInput, StringInput, Add, Multiply, Subtract, Display, **ConfigDemoNode**
- ✅ **ConfigDemoNode**: Demonstrates @Property system with all supported types
- ✅ **Input nodes refactored**: Use @Property instead of @Input for configuration
- ✅ SimpleWorkflow demo with full UI including property panel
- ✅ Development workflow integration
- ✅ Hot-reload with watch modes

### Next Steps

1. Integrate Monaco Editor for JSON editing
2. Implement dual-mode editing (visual + JSON with sync)
3. Add undo/redo system with history management
4. Implement keyboard shortcuts
5. Add connection validation visual feedback
6. Create additional example workflows

## Control Flow Epic (CRYSTALFLOW-50)

The Control Flow & Advanced Execution epic includes:

- Engine support for conditional/branching execution
- Loop execution framework
- Parallel processing capabilities
- Control flow nodes (If/Else, Switch/Case, For/While loops)
- Advanced flow control (Try/Catch, Race, Parallel execution)

This epic bridges the execution engine with sophisticated workflow automation capabilities.

## Server-Side Execution Architecture Epic (Future)

A future architectural enhancement to move workflow execution from client-side to server-side:

### Architecture Overview

```
┌─────────────────────┐
│   React Client      │
│  (@crystalflow/react)  │
│  - Visual Builder   │
│  - UI Components    │
└──────────┬──────────┘
           │ HTTP/WebSocket
           │ REST API
┌──────────▼──────────┐
│   API Server        │
│ (@crystalflow/server)  │
│  - REST Endpoints   │
│  - WebSocket/SSE    │
│  - Auth & Security  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Execution Engine   │
│  (@crystalflow/core)   │
│  - Workflow Engine  │
│  - Node Execution   │
└─────────────────────┘
```

### Epic Breakdown

**Story 1: API Design & Specification**

- OpenAPI 3.0 specification for REST endpoints
- WebSocket event protocol design
- Authentication & authorization strategy
- API versioning and error formats

**Story 2: Server Package Foundation**

- Create @crystalflow/server package with Express/Fastify
- Basic middleware setup (CORS, error handling, logging)
- Environment configuration
- Health check endpoints

**Story 3: Workflow Management API**

- REST endpoints for workflow CRUD operations
- Input validation using JSON schema
- Pagination and filtering for workflow lists

**Story 4: Workflow Persistence Layer**

- Database integration (PostgreSQL/MongoDB/SQLite)
- Workflow and execution result schemas
- Repository pattern implementation
- Database migrations

**Story 5: Execution API Endpoints**

- Endpoints for workflow execution (execute, status, cancel, list)
- Support for execution options (timeout, variables)
- Persist execution results to database

**Story 6: Execution Queue System**

- Queue implementation (BullMQ or in-memory)
- Priority levels and concurrency limits
- Retry logic and dead letter queue
- Graceful shutdown handling

**Story 7: Real-Time Event Streaming**

- WebSocket/SSE server for execution events
- Authentication for WebSocket connections
- Event buffering and reconnection handling
- Stream onNodeStart, onNodeComplete, etc.

**Story 8: Client SDK Implementation**

- Create @crystalflow/client package with HTTP and WebSocket clients
- TypeScript types for all API responses
- Retry logic with exponential backoff
- Connection state management

**Story 9: Adapter Pattern for React Package**

- ExecutionAdapter interface (LocalExecutionAdapter, RemoteExecutionAdapter)
- Update useExecution hook to use adapters
- Configuration to switch between local/remote modes
- Backward compatibility maintained

**Story 10: Authentication & Authorization**

- JWT-based authentication
- API key authentication option
- Role-based access control (RBAC)
- Workflow ownership and permissions

**Story 11: Error Handling & Monitoring**

- Structured logging (JSON format)
- Metrics collection (Prometheus format)
- Health check endpoints
- Performance monitoring and alerting

**Story 12: Server Configuration & Deployment**

- Docker support (Dockerfile, docker-compose)
- Process management (PM2 or cluster mode)
- Graceful shutdown and health checks
- Example deployment configs (AWS, GCP, Azure)

**Story 13: API Documentation**

- OpenAPI specification published
- Interactive API docs (Swagger UI)
- Client SDK documentation with code examples
- Migration guide from local to remote execution

**Story 14: Integration & E2E Tests**

- E2E tests for all workflows
- Load testing (concurrent executions)
- WebSocket connection tests
- CI/CD pipeline integration

**Story 15: Migration Tools & Backward Compatibility**

- CLI tool to deploy workflows to server
- Workflow export/import utilities
- Local execution mode remains available
- Version compatibility matrix

### Benefits

- **Scalability**: Handle resource-intensive workflows on powerful servers
- **Security**: Sensitive operations and credentials stay server-side
- **Shared Resources**: Multiple clients can share execution infrastructure
- **Long-Running Tasks**: Workflows continue even if browser closes
- **Centralized Logging**: All execution logs in one place
- **Version Control**: Server controls execution engine version

### Implementation Priority

**Phase 1 (MVP)**: Core Server Infrastructure (Stories 2-5)
**Phase 2**: Real-time & Client (Stories 7-9)
**Phase 3**: Production Ready (Stories 6, 10-12)
**Phase 4**: Polish (Stories 1, 13-15)

## Questions?

Check these files:

- `README.md` - Project overview
- `docs/guides/get-started.md` - Comprehensive guide
- `docs/documentation-index.md` - All documentation
- `docs/guides/quick-reference.md` - Developer commands
