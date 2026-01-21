# ReactFlo Quick Reference

## 🚀 Quick Commands

```bash
# Setup
./scripts/setup.sh              # Initial setup
npm install                     # Install dependencies

# Development
npm run dev                     # Watch mode (all packages)
npm run build                   # Build all packages
npm test                        # Run tests
npm run test:watch              # Tests in watch mode

# Code Quality
npm run lint                    # Check linting
npm run lint:fix                # Fix linting issues
npm run format                  # Format with Prettier
npm run typecheck               # Type checking

# Maintenance
npm run clean                   # Clean build artifacts
```

## 📦 Package Commands

```bash
# Run command in specific package
npm run build -w @reactflo/core
npm test -w @reactflo/types

# Run command in all packages
npm run build --workspaces
```

## 🏗️ Development Workflow

### 1. Creating a New Node Type

```typescript
// packages/core/src/node/Node.ts
import { NodeMetadata } from './types';

export abstract class Node {
  id: string;
  type: string;
  metadata: NodeMetadata;

  abstract execute(): void | Promise<void>;
}
```

### 2. Implementing Decorators

```typescript
// packages/core/src/node/decorators.ts
export function defineNode(metadata: NodeMetadata) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    // Decorator implementation
    return constructor;
  };
}

export function Input(config: InputConfig) {
  return function (target: any, propertyKey: string) {
    // Input decorator implementation
  };
}

export function Output(config: OutputConfig) {
  return function (target: any, propertyKey: string) {
    // Output decorator implementation
  };
}
```

### 3. Testing Your Code

```typescript
// packages/core/src/node/__tests__/Node.test.ts
import { Node } from '../Node';

describe('Node', () => {
  it('should create a node instance', () => {
    // Test implementation
  });
});
```

## 📁 File Naming Conventions

```
✅ PascalCase for classes:    Node.ts, Workflow.ts
✅ camelCase for utilities:   logger.ts, serialization.ts
✅ lowercase for folders:     node/, workflow/, execution/
✅ Test files:                *.test.ts or *.spec.ts
```

## 🎨 Code Style

```typescript
// ✅ Good
export class WorkflowBuilder {
  private nodes: Map<string, Node>;

  constructor() {
    this.nodes = new Map();
  }

  addNode(node: Node): void {
    this.nodes.set(node.id, node);
  }
}

// ❌ Avoid
export class workflow_builder {
  private _nodes: any;

  constructor() {
    this._nodes = {};
  }
}
```

## 🧪 Testing Guidelines

```typescript
// Use descriptive test names
describe('WorkflowBuilder', () => {
  describe('addNode', () => {
    it('should add a node to the workflow', () => {
      // Test implementation
    });

    it('should throw error when adding duplicate node', () => {
      // Test implementation
    });
  });
});
```

## 📝 Commit Message Format

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(core): add Node base class
fix(workflow): prevent circular connections
docs(readme): update installation instructions
test(executor): add async execution tests
refactor(types): improve type definitions
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

## 🔍 Debugging

```typescript
// Use the Logger utility
import { Logger } from './utils/logger';

const logger = new Logger('WorkflowBuilder');
logger.debug('Adding node', { nodeId: node.id });
logger.error('Failed to execute workflow', error);
```

## 🌲 Git Workflow

```bash
# Create feature branch
git checkout -b feature/node-system

# Make changes and commit
git add .
git commit -m "feat(core): implement Node base class"

# Push and create PR
git push origin feature/node-system
```

## 📚 Documentation Comments

````typescript
/**
 * Base class for all workflow nodes.
 *
 * @example
 * ```typescript
 * class MyNode extends Node {
 *   execute() {
 *     // Implementation
 *   }
 * }
 * ```
 */
export abstract class Node {
  /**
   * Executes the node's logic.
   *
   * @returns Promise that resolves when execution is complete
   * @throws {ExecutionError} When execution fails
   */
  abstract execute(): Promise<void>;
}
````

## 🎯 Best Practices

1. **Keep it Simple** - Start with the simplest implementation
2. **Test First** - Write tests before implementation when possible
3. **Type Everything** - Use TypeScript's type system fully
4. **Document Public APIs** - Add JSDoc comments to public methods
5. **Small Commits** - Commit often with clear messages
6. **Review Before Push** - Always review your changes
7. **Ask Questions** - Open discussions for architectural decisions

## 🔗 Useful Links

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🆘 Getting Help

- Open an issue for bugs
- Start a discussion for questions
- Check existing documentation first
