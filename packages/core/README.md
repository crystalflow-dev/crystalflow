# @reactflo/core

Core workflow engine for ReactFlo framework.

## Overview

This package contains the fundamental building blocks of ReactFlo:

- **Node System:** Base classes and decorators for defining nodes
- **Workflow Engine:** Graph structure and connection management
- **Execution Engine:** Orchestration and execution of workflows
- **Type System:** Type definitions and validation
- **Event System:** Lifecycle hooks and event handling
- **Serialization:** JSON import/export with validation

## Installation

```bash
npm install @reactflo/core
```

## Usage

### Define Nodes

```typescript
import { Node, defineNode, Input, Output } from '@reactflo/core';

@defineNode({
  type: 'math.add',
  label: 'Add',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number' })
  a: number;

  @Input({ type: 'number' })
  b: number;

  @Output({ type: 'number' })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}
```

### Import/Export Workflows

```typescript
import { Workflow, serializeWorkflow, deserializeWorkflow } from '@reactflo/core';

const workflow = new Workflow();
// ... build workflow ...

// Export to JSON
const json = serializeWorkflow(workflow.toJSON());
await fs.writeFile('workflow.json', json);

// Import from JSON
const loadedJson = await fs.readFile('workflow.json', 'utf-8');
const workflowData = deserializeWorkflow(loadedJson);
const loadedWorkflow = Workflow.fromJSON(workflowData);
```

## License

MIT
