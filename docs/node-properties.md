# Node Properties

Node properties are configuration values that can be set in the UI properties panel but are not part of the workflow's data flow. Unlike inputs and outputs, properties are not connected to other nodes and represent static configuration that affects how the node executes.

## Usage

Use the `@Property` decorator to define properties on your node class:

```typescript
import { Node, defineNode, Input, Output, Property } from '@reactflo/core';

@defineNode({
  type: 'network.http-request',
  label: 'HTTP Request',
  category: 'Network',
})
class HttpRequestNode extends Node {
  // Input - part of data flow, can be connected to other nodes
  @Input({ type: 'string', label: 'URL Override', required: false })
  urlOverride?: string;

  // Properties - configuration values, set in properties panel
  @Property({
    type: 'string',
    label: 'Base URL',
    defaultValue: 'https://api.example.com',
    description: 'Base URL for HTTP requests',
  })
  baseUrl: string = 'https://api.example.com';

  @Property({
    type: 'select',
    label: 'HTTP Method',
    defaultValue: 'GET',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'DELETE', label: 'DELETE' },
    ],
  })
  method: string = 'GET';

  @Property({
    type: 'number',
    label: 'Timeout (ms)',
    defaultValue: 5000,
    min: 1000,
    max: 60000,
    step: 1000,
    description: 'Request timeout in milliseconds',
  })
  timeout: number = 5000;

  @Property({
    type: 'boolean',
    label: 'Follow Redirects',
    defaultValue: true,
  })
  followRedirects: boolean = true;

  // Output - part of data flow
  @Output({ type: 'object', label: 'Response' })
  response: unknown;

  execute() {
    // Access property values in your execution logic
    const url = this.urlOverride || this.baseUrl;

    console.log(`Making ${this.method} request to ${url}`);
    console.log(`Timeout: ${this.timeout}ms`);
    console.log(`Follow redirects: ${this.followRedirects}`);

    // Your HTTP request logic here...
    this.response = {
      /* response data */
    };
  }
}
```

## Property Types

Properties support various types for different UI controls:

### String Properties

```typescript
@Property({
  type: 'string',
  label: 'API Key',
  defaultValue: '',
  description: 'Your API key for authentication',
})
apiKey: string = '';
```

### Number Properties

```typescript
@Property({
  type: 'number',
  label: 'Port',
  defaultValue: 3000,
  min: 1,
  max: 65535,
  step: 1,
  description: 'Port number to listen on',
})
port: number = 3000;
```

### Boolean Properties

```typescript
@Property({
  type: 'boolean',
  label: 'Enable SSL',
  defaultValue: false,
  description: 'Whether to use SSL/TLS encryption',
})
enableSsl: boolean = false;
```

### Select Properties

```typescript
@Property({
  type: 'select',
  label: 'Log Level',
  defaultValue: 'info',
  options: [
    { value: 'error', label: 'Error' },
    { value: 'warn', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' }
  ]
})
logLevel: string = 'info';
```

## Property Options

| Option         | Type                    | Description                                            |
| -------------- | ----------------------- | ------------------------------------------------------ |
| `type`         | `string`                | Property type: 'string', 'number', 'boolean', 'select' |
| `label`        | `string`                | Human-readable label for the property                  |
| `defaultValue` | `unknown`               | Default value when node is created                     |
| `description`  | `string`                | Optional description shown in tooltips                 |
| `required`     | `boolean`               | Whether the property is required (default: false)      |
| `options`      | `Array<{value, label}>` | Options for select type properties                     |
| `min`          | `number`                | Minimum value for number properties                    |
| `max`          | `number`                | Maximum value for number properties                    |
| `step`         | `number`                | Step increment for number properties                   |

## Accessing Properties

### In Node Execution

Properties are directly accessible as class members:

```typescript
execute() {
  // Direct access
  console.log(`Using timeout: ${this.timeout}`);

  // You can also use getter/setter methods
  const timeout = this.getProperty<number>('timeout');
  this.setProperty('retryCount', 3);
}
```

### Programmatic Access

```typescript
// Get property value
const timeout = node.getProperty<number>('timeout');

// Set property value
node.setProperty('timeout', 10000);

// Get all property definitions
const properties = node.getProperties();
```

## Differences from Inputs/Outputs

| Aspect            | Inputs/Outputs                  | Properties                 |
| ----------------- | ------------------------------- | -------------------------- |
| **Purpose**       | Data flow between nodes         | Node configuration         |
| **Connections**   | Can be connected to other nodes | Cannot be connected        |
| **UI**            | Shown as ports on node canvas   | Edited in properties panel |
| **Values**        | Set by connections or user      | Set by user only           |
| **Serialization** | Saved with workflow data        | Saved with workflow data   |

## JSON Serialization

Properties are automatically serialized in workflow JSON:

```json
{
  "id": "node-1",
  "type": "network.http-request",
  "position": { "x": 100, "y": 100 },
  "data": {
    "baseUrl": "https://api.custom.com",
    "method": "POST",
    "timeout": 10000,
    "followRedirects": true
  }
}
```

## Best Practices

1. **Use properties for configuration** that doesn't change during workflow execution
2. **Use inputs for data** that flows between nodes
3. **Provide sensible default values** for all properties
4. **Add descriptions** to help users understand what each property does
5. **Set appropriate constraints** (min/max for numbers, options for selects)
6. **Use required sparingly** - most properties should have reasonable defaults

## React UI Integration

The React package automatically generates UI controls for properties:

- `string` → Text input field
- `number` → Numeric input with min/max/step controls
- `boolean` → Checkbox or toggle
- `select` → Dropdown with options

Properties are edited in the PropertyPanel component and changes are applied immediately to the node instance.

## Global Properties and Inheritance

ReactFlo supports property inheritance, allowing you to create base classes with global properties that are shared across multiple node types. This is useful for organization-wide configuration, common settings, or specialized node categories.

### Creating Base Classes

You can create your own base classes by extending the `Node` class and defining common properties:

```typescript
import { Node, defineNode, Property } from '@reactflo/core';

// Create a base class for your organization's nodes
abstract class MyAppBaseNode extends Node {
  @Property({
    type: 'boolean',
    label: 'Debug Mode',
    defaultValue: false,
    description: 'Enable debug logging for this node',
  })
  debugMode: boolean = false;

  @Property({
    type: 'string',
    label: 'Environment',
    defaultValue: 'production',
    description: 'Application environment (dev, staging, production)',
  })
  environment: string = 'production';

  @Property({
    type: 'string',
    label: 'API Key',
    defaultValue: '',
    description: 'Global API key for external services',
  })
  apiKey: string = '';

  // Common utility methods
  protected log(message: string): void {
    if (this.debugMode) {
      console.log(`[${this.environment}] ${this.id}: ${message}`);
    }
  }
}

// Create specialized base classes
abstract class ApiNodeBase extends MyAppBaseNode {
  @Property({
    type: 'string',
    label: 'Base URL',
    defaultValue: 'https://api.example.com',
    description: 'Base URL for API requests',
  })
  baseUrl: string = 'https://api.example.com';

  @Property({
    type: 'number',
    label: 'Request Timeout',
    defaultValue: 5000,
    min: 1000,
    max: 30000,
    step: 1000,
    description: 'Request timeout in milliseconds',
  })
  requestTimeout: number = 5000;
}
```

### Using Inherited Properties

Concrete nodes automatically inherit properties from their base classes:

```typescript
@defineNode({
  type: 'myapp.http-fetch',
  label: 'HTTP Fetch',
  category: 'API',
})
class HttpFetchNode extends ApiNodeBase {
  @Input({ type: 'string', label: 'Endpoint' })
  endpoint: string = '';

  @Property({
    type: 'select',
    label: 'HTTP Method',
    defaultValue: 'GET',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'DELETE', label: 'DELETE' },
    ],
  })
  method: string = 'GET';

  @Output({ type: 'object', label: 'Response' })
  response: unknown;

  execute() {
    // Access inherited properties
    this.log(`Making ${this.method} request`);

    const url = `${this.baseUrl}${this.endpoint}`;
    console.log(`URL: ${url}`);
    console.log(`Timeout: ${this.requestTimeout}ms`);
    console.log(`Environment: ${this.environment}`);

    // Your HTTP logic here using this.apiKey, etc.
    this.response = { status: 200, data: 'success' };
  }
}
```

### Multi-Level Inheritance

Properties are collected from the entire inheritance chain:

```typescript
// Level 1: Organization base
abstract class MyOrgNode extends Node {
  @Property({ type: 'string', label: 'Org ID', defaultValue: 'my-org' })
  orgId: string = 'my-org';
}

// Level 2: Department base
abstract class DataTeamNode extends MyOrgNode {
  @Property({ type: 'string', label: 'Data Source', defaultValue: 'primary-db' })
  dataSource: string = 'primary-db';
}

// Level 3: Concrete implementation
@defineNode({ type: 'data.processor', label: 'Data Processor', category: 'Data' })
class DataProcessorNode extends DataTeamNode {
  @Property({ type: 'number', label: 'Batch Size', defaultValue: 100 })
  batchSize: number = 100;

  execute() {
    // Has access to all inherited properties:
    // - this.orgId (from MyOrgNode)
    // - this.dataSource (from DataTeamNode)
    // - this.batchSize (from DataProcessorNode)
  }
}
```

### Property Resolution

When multiple inheritance levels define the same property ID, the child class property takes precedence:

```typescript
abstract class BaseNode extends Node {
  @Property({ type: 'number', label: 'Timeout', defaultValue: 5000 })
  timeout: number = 5000;
}

@defineNode({ type: 'custom.node', label: 'Custom Node', category: 'Custom' })
class CustomNode extends BaseNode {
  // This overrides the base timeout property
  @Property({ type: 'number', label: 'Custom Timeout', defaultValue: 10000 })
  timeout: number = 10000; // Child wins - default is 10000, not 5000
}
```

### Benefits of Property Inheritance

1. **Consistency** - Common properties across all organization nodes
2. **DRY Principle** - Define global settings once, inherit everywhere
3. **Maintainability** - Change base properties to affect all child nodes
4. **Organization** - Group related nodes with shared configuration
5. **Type Safety** - Full TypeScript support for inherited properties

### Common Use Cases

**Organization Settings:**

```typescript
abstract class CompanyBaseNode extends Node {
  @Property({ type: 'string', label: 'Company ID', defaultValue: 'acme-corp' })
  companyId: string = 'acme-corp';

  @Property({
    type: 'select',
    label: 'Environment',
    options: [
      { value: 'dev', label: 'Development' },
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Production' },
    ],
  })
  env: string = 'dev';
}
```

**Authentication:**

```typescript
abstract class SecureNode extends Node {
  @Property({ type: 'string', label: 'Auth Token', defaultValue: '' })
  authToken: string = '';

  @Property({ type: 'boolean', label: 'Verify SSL', defaultValue: true })
  verifySSL: boolean = true;
}
```

**Logging and Debugging:**

```typescript
abstract class DebuggableNode extends Node {
  @Property({ type: 'boolean', label: 'Enable Logging', defaultValue: false })
  enableLogging: boolean = false;

  @Property({
    type: 'select',
    label: 'Log Level',
    options: [
      { value: 'error', label: 'Error' },
      { value: 'warn', label: 'Warning' },
      { value: 'info', label: 'Info' },
      { value: 'debug', label: 'Debug' },
    ],
  })
  logLevel: string = 'info';
}
```

### JSON Serialization with Inheritance

All inherited properties are automatically included in workflow serialization:

```json
{
  "id": "node-1",
  "type": "myapp.http-fetch",
  "position": { "x": 100, "y": 100 },
  "data": {
    "debugMode": true,
    "environment": "staging",
    "apiKey": "secret-key",
    "baseUrl": "https://staging-api.example.com",
    "requestTimeout": 8000,
    "method": "POST"
  }
}
```

The inheritance system ensures that your workflows maintain consistent configuration across all nodes while allowing flexibility for specific use cases.
