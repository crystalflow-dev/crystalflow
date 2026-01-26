import { Node, defineNode, Input, Output, Property, getNodeRegistry } from '../node';

/**
 * Test inheritance with user-defined base classes
 * This demonstrates how users can create their own base classes
 * and have properties properly inherited.
 */

// User creates their own base class extending Node
abstract class MyAppBaseNode extends Node {
  @Property({
    type: 'boolean',
    label: 'Debug Mode',
    defaultValue: false,
    description: 'Enable debug logging',
  })
  debugMode: boolean = false;

  @Property({
    type: 'string',
    label: 'Environment',
    defaultValue: 'production',
    description: 'Application environment',
  })
  environment: string = 'production';

  protected log(message: string): void {
    if (this.debugMode) {
      // eslint-disable-next-line no-console
      console.log(`[${this.environment}] ${this.id}: ${message}`);
    }
  }
}

// User creates a specialized base for API nodes
abstract class ApiNodeBase extends MyAppBaseNode {
  @Property({
    type: 'string',
    label: 'API Base URL',
    defaultValue: 'https://api.example.com',
    description: 'Base URL for API requests',
  })
  apiBaseUrl: string = 'https://api.example.com';

  @Property({
    type: 'number',
    label: 'Timeout (ms)',
    defaultValue: 5000,
    min: 1000,
    max: 30000,
    description: 'Request timeout in milliseconds',
  })
  timeout: number = 5000;
}

// Concrete implementation using two levels of inheritance
@defineNode({
  type: 'myapp.api-fetch',
  label: 'API Fetch',
  category: 'API',
})
class ApiFetchNode extends ApiNodeBase {
  @Input({ type: 'string', label: 'Endpoint' })
  endpoint: string = '';

  @Property({
    type: 'select',
    label: 'Method',
    defaultValue: 'GET',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
    ],
  })
  method: string = 'GET';

  @Output({ type: 'object', label: 'Response' })
  response: unknown;

  execute() {
    this.log(`Making ${this.method} request to ${this.apiBaseUrl}${this.endpoint}`);
    this.log(`Timeout: ${this.timeout}ms`);

    // Mock response
    this.response = {
      status: 200,
      data: 'success',
    };
  }
}

// Simple node extending only the base
@defineNode({
  type: 'myapp.simple-processor',
  label: 'Simple Processor',
  category: 'Processing',
})
class SimpleProcessorNode extends MyAppBaseNode {
  @Input({ type: 'string', label: 'Input' })
  input: string = '';

  @Output({ type: 'string', label: 'Output' })
  output: string = '';

  execute() {
    this.log(`Processing: ${this.input}`);
    this.output = this.input.toUpperCase();
  }
}

describe('User-defined inheritance', () => {
  test('should inherit properties from multiple inheritance levels', () => {
    const registry = getNodeRegistry();
    const definition = registry.getDefinition('myapp.api-fetch');

    const propertyIds = definition.properties.map((p) => p.id);

    // Should have properties from all levels
    expect(propertyIds).toContain('debugMode'); // From MyAppBaseNode
    expect(propertyIds).toContain('environment'); // From MyAppBaseNode
    expect(propertyIds).toContain('apiBaseUrl'); // From ApiNodeBase
    expect(propertyIds).toContain('timeout'); // From ApiNodeBase
    expect(propertyIds).toContain('method'); // From ApiFetchNode itself

    expect(definition.properties).toHaveLength(5);
  });

  test('should create instances with inherited properties', () => {
    const registry = getNodeRegistry();
    const node = registry.create('myapp.api-fetch', 'test-1') as ApiFetchNode;

    // All properties should be available with default values
    expect(node.debugMode).toBe(false);
    expect(node.environment).toBe('production');
    expect(node.apiBaseUrl).toBe('https://api.example.com');
    expect(node.timeout).toBe(5000);
    expect(node.method).toBe('GET');
  });

  test('should allow setting inherited properties', () => {
    const registry = getNodeRegistry();
    const node = registry.create('myapp.api-fetch', 'test-2') as ApiFetchNode;

    // Set properties from different inheritance levels
    node.setProperty('debugMode', true);
    node.setProperty('environment', 'development');
    node.setProperty('apiBaseUrl', 'https://dev-api.example.com');
    node.setProperty('timeout', 10000);
    node.setProperty('method', 'POST');

    expect(node.debugMode).toBe(true);
    expect(node.environment).toBe('development');
    expect(node.apiBaseUrl).toBe('https://dev-api.example.com');
    expect(node.timeout).toBe(10000);
    expect(node.method).toBe('POST');
  });

  test('should serialize all inherited properties', () => {
    const registry = getNodeRegistry();
    const node = registry.create('myapp.api-fetch', 'test-3') as ApiFetchNode;

    node.setProperty('debugMode', true);
    node.setProperty('apiBaseUrl', 'https://custom.api.com');

    const json = node.toJSON();

    expect(json.data).toMatchObject({
      debugMode: true,
      environment: 'production', // default
      apiBaseUrl: 'https://custom.api.com',
      timeout: 5000, // default
      method: 'GET', // default
    });
  });

  test('should deserialize all inherited properties', () => {
    const registry = getNodeRegistry();
    const node = registry.create('myapp.simple-processor', 'test-4') as SimpleProcessorNode;

    const json = {
      id: 'test-4',
      type: 'myapp.simple-processor',
      data: {
        debugMode: true,
        environment: 'staging',
        input: 'hello world',
      },
    };

    node.fromJSON(json);

    expect(node.debugMode).toBe(true);
    expect(node.environment).toBe('staging');
    expect(node.input).toBe('hello world');
  });
});
