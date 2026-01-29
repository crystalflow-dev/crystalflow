import { Node, defineNode, Input, Output, Property, getNodeRegistry } from '../node';

/**
 * Test node with properties
 */
@defineNode({
  type: 'test.http-request',
  label: 'HTTP Request',
  category: 'Network',
  description: 'Make HTTP requests with configurable settings',
})
class HttpRequestNode extends Node {
  // Input (data flow)
  @Input({ type: 'string', label: 'URL Override', required: false })
  urlOverride?: string;

  // Properties (configuration - not part of data flow)
  @Property({
    type: 'string',
    label: 'Base URL',
    defaultValue: 'https://api.example.com',
    description: 'Base URL for the HTTP request',
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
    description: 'Whether to follow HTTP redirects',
  })
  followRedirects: boolean = true;

  // Output
  @Output({ type: 'object', label: 'Response' })
  response: unknown;

  execute() {
    // Use the property values in execution logic
    const url = this.urlOverride || this.baseUrl;

    console.log(`Making ${this.method} request to ${url} with timeout ${this.timeout}ms`);

    console.log(`Follow redirects: ${this.followRedirects}`);

    // Mock response
    this.response = {
      status: 200,
      data: 'Mock response data',
      config: {
        method: this.method,
        url,
        timeout: this.timeout,
        followRedirects: this.followRedirects,
      },
    };
  }
}

// Test the implementation
describe('Property decorator system', () => {
  test('should register node with properties', () => {
    const registry = getNodeRegistry();
    expect(registry.has('test.http-request')).toBe(true);
  });

  test('should get node definition with properties', () => {
    const registry = getNodeRegistry();
    const definition = registry.getDefinition('test.http-request');

    expect(definition.properties).toHaveLength(4);
    expect(definition.properties[0]).toMatchObject({
      id: 'baseUrl',
      label: 'Base URL',
      type: 'string',
      defaultValue: 'https://api.example.com',
      description: 'Base URL for the HTTP request',
    });
    expect(definition.properties[1]).toMatchObject({
      id: 'method',
      label: 'HTTP Method',
      type: 'select',
      defaultValue: 'GET',
      options: expect.arrayContaining([
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
      ]),
    });
    expect(definition.properties[2]).toMatchObject({
      id: 'timeout',
      label: 'Timeout (ms)',
      type: 'number',
      defaultValue: 5000,
      min: 1000,
      max: 60000,
      step: 1000,
    });
    expect(definition.properties[3]).toMatchObject({
      id: 'followRedirects',
      label: 'Follow Redirects',
      type: 'boolean',
      defaultValue: true,
    });
  });

  test('should create node instance with default property values', () => {
    const registry = getNodeRegistry();
    const node = registry.create('test.http-request', 'test-node-1') as HttpRequestNode;

    expect(node.baseUrl).toBe('https://api.example.com');
    expect(node.method).toBe('GET');
    expect(node.timeout).toBe(5000);
    expect(node.followRedirects).toBe(true);
  });

  test('should get and set property values', () => {
    const registry = getNodeRegistry();
    const node = registry.create('test.http-request', 'test-node-2') as HttpRequestNode;

    // Test getProperty
    expect(node.getProperty('baseUrl')).toBe('https://api.example.com');
    expect(node.getProperty('method')).toBe('GET');

    // Test setProperty
    node.setProperty('baseUrl', 'https://api.custom.com');
    node.setProperty('method', 'POST');

    expect(node.baseUrl).toBe('https://api.custom.com');
    expect(node.method).toBe('POST');
  });

  test('should serialize properties in toJSON', () => {
    const registry = getNodeRegistry();
    const node = registry.create('test.http-request', 'test-node-3') as HttpRequestNode;

    node.setProperty('baseUrl', 'https://api.custom.com');
    node.setProperty('timeout', 10000);

    const json = node.toJSON();

    expect(json.data).toMatchObject({
      baseUrl: 'https://api.custom.com',
      method: 'GET', // default value
      timeout: 10000,
      followRedirects: true, // default value
    });
  });

  test('should deserialize properties from JSON', () => {
    const registry = getNodeRegistry();
    const node = registry.create('test.http-request', 'test-node-4') as HttpRequestNode;

    const json = {
      id: 'test-node-4',
      type: 'test.http-request',
      data: {
        baseUrl: 'https://api.loaded.com',
        method: 'DELETE',
        timeout: 15000,
        followRedirects: false,
      },
    };

    node.fromJSON(json);

    expect(node.baseUrl).toBe('https://api.loaded.com');
    expect(node.method).toBe('DELETE');
    expect(node.timeout).toBe(15000);
    expect(node.followRedirects).toBe(false);
  });

  test('should execute with property values', async () => {
    const registry = getNodeRegistry();
    const node = registry.create('test.http-request', 'test-node-5') as HttpRequestNode;

    node.setProperty('method', 'POST');
    node.setProperty('timeout', 3000);
    node.setInput('urlOverride', 'https://override.com/api');

    await node.run();

    const response = node.getOutput('response') as {
      config: {
        method: string;
        url: string;
        timeout: number;
        followRedirects: boolean;
      };
    };
    expect(response.config).toMatchObject({
      method: 'POST',
      url: 'https://override.com/api',
      timeout: 3000,
      followRedirects: true,
    });
  });
});
