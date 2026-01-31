/**
 * Node source code for Sandpack editor
 * These are manually copied to work with Next.js build
 */

export const MockAPINodeCode = `import { Node, Output, Property, defineNode } from '@reactflo/core';

/**
 * Mock API Node - Simulates an API response with user data
 * In a real scenario, this would make an actual HTTP request
 */
@defineNode({
  type: 'data.mockapi',
  label: 'Mock API',
  category: 'Data',
  description: 'Simulates an API response with user data',
  color: '#2196F3',
})
export class MockAPINode extends Node {
  @Property({
    type: 'select',
    label: 'Endpoint',
    defaultValue: 'users',
    options: [
      { value: 'users', label: 'Users API' },
      { value: 'posts', label: 'Posts API' },
      { value: 'products', label: 'Products API' },
    ],
  })
  endpoint: string = 'users';

  @Output({ type: 'object', label: 'Response' })
  response: any = {};

  execute() {
    // Simulate API responses based on endpoint
    const mockData = {
      users: {
        status: 200,
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          username: 'johndoe',
          address: {
            street: '123 Main St',
            city: 'San Francisco',
            country: 'USA',
          },
          stats: {
            followers: 1523,
            posts: 42,
            likes: 8934,
          },
        },
      },
      posts: {
        status: 200,
        data: {
          id: 101,
          title: 'Getting Started with ReactFlo',
          content: 'Build visual workflows with ease...',
          author: 'John Doe',
          likes: 245,
          comments: 18,
        },
      },
      products: {
        status: 200,
        data: {
          id: 501,
          name: 'Premium Subscription',
          price: 29.99,
          currency: 'USD',
          features: ['Unlimited workflows', 'Priority support', 'Advanced analytics'],
        },
      },
    };

    this.response = mockData[this.endpoint as keyof typeof mockData] || mockData.users;
  }
}`;

export const ExtractFieldNodeCode = `import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

/**
 * Extract Field Node - Extracts a specific field from a JSON object
 * Supports nested path notation (e.g., "data.address.city")
 */
@defineNode({
  type: 'data.extract',
  label: 'Extract Field',
  category: 'Data',
  description: 'Extracts a field from JSON using dot notation',
  color: '#4CAF50',
})
export class ExtractFieldNode extends Node {
  @Input({ type: 'object', label: 'JSON Object' })
  jsonObject: any;

  @Property({
    type: 'string',
    label: 'Field Path',
    defaultValue: 'data.name',
    description: 'Use dot notation for nested fields (e.g., data.address.city)',
  })
  fieldPath: string = 'data.name';

  @Output({ type: 'any', label: 'Value' })
  value: any = undefined;

  execute() {
    if (!this.jsonObject) {
      throw new Error('No JSON object provided');
    }

    // Split the path and traverse the object
    const path = this.fieldPath.split('.');
    let current = this.jsonObject;

    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        throw new Error(\`Field "\${this.fieldPath}" not found in JSON object\`);
      }
    }

    this.value = current;
  }
}`;

export const FormatTextNodeCode = `import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

/**
 * Format Text Node - Formats text with a custom template
 * Use {value} as a placeholder for the input value
 */
@defineNode({
  type: 'data.format',
  label: 'Format Text',
  category: 'Data',
  description: 'Formats text using a template with placeholders',
  color: '#9C27B0',
})
export class FormatTextNode extends Node {
  @Input({ type: 'any', label: 'Value' })
  inputValue: any;

  @Property({
    type: 'string',
    label: 'Template',
    defaultValue: 'User: {value}',
    description: 'Use {value} as placeholder',
  })
  template: string = 'User: {value}';

  @Output({ type: 'string', label: 'Formatted Text' })
  formattedText: string = '';

  execute() {
    // Convert value to string if it's an object
    let valueStr: string;
    if (typeof this.inputValue === 'object') {
      valueStr = JSON.stringify(this.inputValue, null, 2);
    } else {
      valueStr = String(this.inputValue);
    }

    // Replace {value} placeholder with actual value
    this.formattedText = this.template.replace(/{value}/g, valueStr);
  }
}`;

export const DisplayNodeCode = `import { defineNode, Input, Node } from '@reactflo/core';

/**
 * Display Result Node
 * Displays a value to the console
 */
@defineNode({
  type: 'output.display',
  label: 'Display',
  category: 'Output',
  description: 'Displays a value',
  color: '#FF9800',
})
export class DisplayNode extends Node {
  @Input({ type: 'any', label: 'Value', required: true })
  value: unknown;

  execute(): void {
    alert(\`Display: \${this.value}\`);
  }
}`;
