# GitHub Copilot Instructions for ReactFlo

## Project Overview

ReactFlo is a declarative workflow builder framework that provides tools for creating custom workflow applications. It uses TypeScript decorators for node definitions, React Flow for the UI layer, and includes a complete execution engine with JSON serialization.

**Core Principle:** "We build the how, you focus on the what."

## Architecture

```
User Applications (decorated nodes)
         ↓
@reactflo/react (bridges decorators → React Flow)
         ↓
React Flow (canvas, rendering, UI primitives)
         ↓
@reactflo/core (execution engine, validation)
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
├── cli/           # CLI tools (future)
└── plugins/       # Official plugins (future)
```

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
import { WorkflowError, NodeExecutionError } from './utils/errors';

throw new NodeExecutionError(`Failed to execute node ${nodeId}`, { cause: error });
```

### Logging

```typescript
import { Logger } from './utils/logger';

const logger = new Logger('ComponentName');
logger.debug('Message', { context });
logger.error('Error occurred', error);
```

## Package-Specific Guidelines

### @reactflo/core

- **Zero external dependencies** (except reflect-metadata) - keep it lightweight
- All exports must be in `src/index.ts`
- Use `reflect-metadata` for decorator metadata
- Validate all inputs and throw descriptive errors
- Node base class provides: validate(), execute(), run(), reset(), toJSON(), fromJSON()
- Use index signature `[key: string]: unknown` for dynamic properties
- Prefer `unknown` over `any` for type safety

### @reactflo/types

- Pure type definitions only
- No runtime code
- Export all types from `src/index.ts`

### @reactflo/react

- Use React 18+ features (hooks, concurrent mode)
- Leverage React Flow - don't rebuild canvas
- Use Monaco Editor for JSON editing
- All components should be functional (no classes)
- Use TypeScript generics for reusable components

## Important Patterns

### Node Registration

```typescript
import { NodeRegistry } from '@reactflo/core';

const registry = NodeRegistry.getInstance();
registry.register(AddNode);
registry.register(MultiplyNode);
```

### Workflow Creation

```typescript
import { Workflow } from '@reactflo/core';

const workflow = new Workflow();
workflow.addNode(AddNode, { position: { x: 100, y: 100 } });
workflow.connect(sourceRef, targetRef);
await workflow.execute();
```

### Serialization

```typescript
import { serializeWorkflow, deserializeWorkflow } from '@reactflo/core';

// Export
const json = serializeWorkflow(workflow.toJSON());

// Import
const workflowData = deserializeWorkflow(json);
const workflow = Workflow.fromJSON(workflowData);
```

### React Component Usage

```tsx
import { WorkflowBuilder } from '@reactflo/react';

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
3. **Keep Core Lightweight** - @reactflo/core has zero deps
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
❌ Don't add dependencies to @reactflo/core
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

- **Phase:** Basic Execution Engine (Phase 3 - Next)
- **Completed:** Phase 1 (Node System - 100%), Phase 2 (Workflow System - 100%)
- **Next:** Phase 3 (Basic Execution Engine), then Phase 3.5 (Control Flow Epic REACTFLO-50)
- **Priority:** Executor class, ExecutionContext, then advanced control flow features

## Control Flow Epic (REACTFLO-50)

The Control Flow & Advanced Execution epic includes:
- Engine support for conditional/branching execution
- Loop execution framework
- Parallel processing capabilities  
- Control flow nodes (If/Else, Switch/Case, For/While loops)
- Advanced flow control (Try/Catch, Race, Parallel execution)

This epic bridges the execution engine with sophisticated workflow automation capabilities.

## Questions?

Check these files:

- `README.md` - Project overview
- `GET_STARTED.md` - Comprehensive guide
- `DOCUMENTATION_INDEX.md` - All documentation
- `QUICK_REFERENCE.md` - Developer commands
