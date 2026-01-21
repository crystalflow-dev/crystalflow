# ReactFlo Workflow JSON Schema

ReactFlo workflows are fully serializable to and from JSON with a well-structured schema.

## Schema Version

Current version: **1.0.0**

## Complete Workflow JSON Structure

```json
{
  "version": "1.0.0",
  "id": "workflow-123",
  "name": "My Data Processing Workflow",
  "description": "Processes user data through multiple stages",
  "metadata": {
    "author": "John Doe",
    "createdAt": "2026-01-19T10:00:00Z",
    "updatedAt": "2026-01-19T12:30:00Z",
    "tags": ["data", "processing", "production"]
  },
  "nodes": [
    {
      "id": "node-1",
      "type": "math.add",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Add Numbers",
        "inputs": {
          "a": 5,
          "b": 3
        }
      }
    },
    {
      "id": "node-2",
      "type": "math.multiply",
      "position": { "x": 300, "y": 100 },
      "data": {
        "label": "Multiply Result",
        "inputs": {
          "a": null,
          "b": 2
        }
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "source": {
        "nodeId": "node-1",
        "portId": "result"
      },
      "target": {
        "nodeId": "node-2",
        "portId": "a"
      }
    }
  ],
  "variables": {
    "environment": "production",
    "apiKey": "{{env.API_KEY}}"
  }
}
```

## Schema Specification

### Root Object

| Field         | Type   | Required | Description                  |
| ------------- | ------ | -------- | ---------------------------- |
| `version`     | string | ✅       | Schema version (semver)      |
| `id`          | string | ✅       | Unique workflow identifier   |
| `name`        | string | ✅       | Human-readable workflow name |
| `description` | string | ❌       | Workflow description         |
| `metadata`    | object | ❌       | Additional metadata          |
| `nodes`       | array  | ✅       | Array of node objects        |
| `connections` | array  | ✅       | Array of connection objects  |
| `variables`   | object | ❌       | Global workflow variables    |

### Node Object

| Field          | Type   | Required | Description                          |
| -------------- | ------ | -------- | ------------------------------------ |
| `id`           | string | ✅       | Unique node identifier               |
| `type`         | string | ✅       | Node type (e.g., 'math.add')         |
| `position`     | object | ✅       | Canvas position {x, y}               |
| `data`         | object | ✅       | Node-specific data                   |
| `data.label`   | string | ❌       | Custom node label                    |
| `data.inputs`  | object | ❌       | Input port values                    |
| `data.outputs` | object | ❌       | Output port values (for saved state) |
| `data.config`  | object | ❌       | Node configuration                   |

### Connection Object

| Field           | Type   | Required | Description                  |
| --------------- | ------ | -------- | ---------------------------- |
| `id`            | string | ✅       | Unique connection identifier |
| `source`        | object | ✅       | Source port reference        |
| `source.nodeId` | string | ✅       | Source node ID               |
| `source.portId` | string | ✅       | Source port ID               |
| `target`        | object | ✅       | Target port reference        |
| `target.nodeId` | string | ✅       | Target node ID               |
| `target.portId` | string | ✅       | Target port ID               |

### Position Object

| Field | Type   | Required | Description            |
| ----- | ------ | -------- | ---------------------- |
| `x`   | number | ✅       | X coordinate on canvas |
| `y`   | number | ✅       | Y coordinate on canvas |

### Metadata Object

| Field       | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| `author`    | string | ❌       | Workflow author       |
| `createdAt` | string | ❌       | ISO 8601 timestamp    |
| `updatedAt` | string | ❌       | ISO 8601 timestamp    |
| `tags`      | array  | ❌       | Array of string tags  |
| `*`         | any    | ❌       | Custom fields allowed |

## Examples

### Minimal Workflow

```json
{
  "version": "1.0.0",
  "id": "minimal-workflow",
  "name": "Minimal Example",
  "nodes": [],
  "connections": []
}
```

### Simple Math Workflow

```json
{
  "version": "1.0.0",
  "id": "simple-math",
  "name": "Add and Multiply",
  "nodes": [
    {
      "id": "add-1",
      "type": "math.add",
      "position": { "x": 100, "y": 100 },
      "data": {
        "inputs": { "a": 10, "b": 20 }
      }
    },
    {
      "id": "multiply-1",
      "type": "math.multiply",
      "position": { "x": 300, "y": 100 },
      "data": {
        "inputs": { "b": 2 }
      }
    },
    {
      "id": "output-1",
      "type": "output.console",
      "position": { "x": 500, "y": 100 },
      "data": {}
    }
  ],
  "connections": [
    {
      "id": "c1",
      "source": { "nodeId": "add-1", "portId": "result" },
      "target": { "nodeId": "multiply-1", "portId": "a" }
    },
    {
      "id": "c2",
      "source": { "nodeId": "multiply-1", "portId": "result" },
      "target": { "nodeId": "output-1", "portId": "value" }
    }
  ]
}
```

### HTTP API Workflow

```json
{
  "version": "1.0.0",
  "id": "api-workflow",
  "name": "Fetch and Process User Data",
  "description": "Fetches users from API and processes them",
  "metadata": {
    "author": "API Team",
    "tags": ["api", "users", "processing"]
  },
  "nodes": [
    {
      "id": "http-1",
      "type": "http.request",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Fetch Users",
        "inputs": {
          "url": "https://api.example.com/users",
          "method": "GET",
          "headers": {
            "Authorization": "Bearer {{variables.apiKey}}"
          }
        }
      }
    },
    {
      "id": "transform-1",
      "type": "data.map",
      "position": { "x": 350, "y": 100 },
      "data": {
        "label": "Extract Names",
        "config": {
          "expression": "item.name"
        }
      }
    },
    {
      "id": "filter-1",
      "type": "data.filter",
      "position": { "x": 600, "y": 100 },
      "data": {
        "label": "Active Users Only",
        "config": {
          "expression": "item.active === true"
        }
      }
    }
  ],
  "connections": [
    {
      "id": "c1",
      "source": { "nodeId": "http-1", "portId": "body" },
      "target": { "nodeId": "transform-1", "portId": "array" }
    },
    {
      "id": "c2",
      "source": { "nodeId": "transform-1", "portId": "result" },
      "target": { "nodeId": "filter-1", "portId": "array" }
    }
  ],
  "variables": {
    "apiKey": "{{env.API_KEY}}",
    "environment": "production"
  }
}
```

### Conditional Workflow

```json
{
  "version": "1.0.0",
  "id": "conditional-workflow",
  "name": "Decision Making",
  "nodes": [
    {
      "id": "input-1",
      "type": "input.number",
      "position": { "x": 100, "y": 100 },
      "data": {
        "inputs": { "value": 42 }
      }
    },
    {
      "id": "condition-1",
      "type": "logic.if",
      "position": { "x": 300, "y": 100 },
      "data": {
        "config": {
          "condition": "value > 50"
        }
      }
    },
    {
      "id": "branch-a",
      "type": "string.concat",
      "position": { "x": 500, "y": 50 },
      "data": {
        "inputs": { "b": " is greater than 50" }
      }
    },
    {
      "id": "branch-b",
      "type": "string.concat",
      "position": { "x": 500, "y": 150 },
      "data": {
        "inputs": { "b": " is less than or equal to 50" }
      }
    }
  ],
  "connections": [
    {
      "id": "c1",
      "source": { "nodeId": "input-1", "portId": "value" },
      "target": { "nodeId": "condition-1", "portId": "value" }
    },
    {
      "id": "c2",
      "source": { "nodeId": "condition-1", "portId": "true" },
      "target": { "nodeId": "branch-a", "portId": "a" }
    },
    {
      "id": "c3",
      "source": { "nodeId": "condition-1", "portId": "false" },
      "target": { "nodeId": "branch-b", "portId": "a" }
    }
  ]
}
```

## API Usage

### Export Workflow

```typescript
import { Workflow } from '@reactflo/core';

const workflow = new Workflow();
// ... build workflow ...

// Export to JSON
const json = workflow.toJSON();
console.log(JSON.stringify(json, null, 2));

// Save to file
await fs.writeFile('workflow.json', JSON.stringify(json, null, 2));
```

### Import Workflow

```typescript
import { Workflow } from '@reactflo/core';

// Load from file
const json = await fs.readFile('workflow.json', 'utf-8');
const workflowData = JSON.parse(json);

// Import workflow
const workflow = Workflow.fromJSON(workflowData);

// Execute
const result = await workflow.execute();
```

### Validation

```typescript
import { validateWorkflowJSON } from '@reactflo/core';

const json = await fs.readFile('workflow.json', 'utf-8');
const workflowData = JSON.parse(json);

// Validate against schema
const validation = validateWorkflowJSON(workflowData);

if (validation.valid) {
  console.log('Workflow is valid!');
} else {
  console.error('Validation errors:', validation.errors);
}
```

## Best Practices

### 1. Version Your Workflows

Always include the schema version:

```json
{ "version": "1.0.0", ... }
```

### 2. Use Meaningful IDs

Use descriptive IDs for easier debugging:

```json
{ "id": "fetch-users", "type": "http.request", ... }
```

### 3. Add Metadata

Include author, timestamps, and tags:

```json
{
  "metadata": {
    "author": "team@example.com",
    "createdAt": "2026-01-19T10:00:00Z",
    "tags": ["production", "api"]
  }
}
```

### 4. Use Variables for Secrets

Never hardcode sensitive data:

```json
{
  "variables": {
    "apiKey": "{{env.API_KEY}}"
  }
}
```

### 5. Document Complex Workflows

Use descriptions liberally:

```json
{
  "name": "User Processing Pipeline",
  "description": "Fetches users, filters active ones, sends notifications",
  "nodes": [
    {
      "data": {
        "label": "Fetch All Users",
        ...
      }
    }
  ]
}
```

## Migration

If the schema version changes, ReactFlo will provide migration utilities:

```typescript
import { migrateWorkflow } from '@reactflo/core';

const oldWorkflow = JSON.parse(oldJson);
const newWorkflow = migrateWorkflow(oldWorkflow, '2.0.0');
```

## JSON Schema (JSON Schema Draft 7)

A formal JSON Schema definition is available at:

- Schema: [schema/workflow.schema.json](../schema/workflow.schema.json)
- Validation: Use with AJV or similar validators

## Tools

- **Online Validator**: Coming soon
- **VS Code Extension**: Coming soon (with autocomplete)
- **CLI Validator**: `reactflo validate workflow.json`

## See Also

- [Core Concepts](./core-concepts.md)
- [Getting Started](./getting-started.md)
- [API Reference](./api-reference/)
