import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';

/**
 * HTTP Request Node - Makes HTTP requests to external APIs
 */
@defineNode({
  type: 'automation.http-request',
  label: 'HTTP Request',
  category: 'Action',
  description: 'Makes HTTP requests to APIs',
  color: '#00D09C',
})
export class HTTPRequestNode extends Node {
  @Property({
    type: 'select',
    label: 'Method',
    defaultValue: 'GET',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'PATCH', label: 'PATCH' },
      { value: 'DELETE', label: 'DELETE' },
    ],
  })
  method: string = 'GET';

  @Property({
    type: 'string',
    label: 'URL',
    defaultValue: 'https://api.example.com/data',
    description: 'API endpoint URL',
  })
  url: string = 'https://api.example.com/data';

  @Property({
    type: 'boolean',
    label: 'Send Body',
    defaultValue: false,
  })
  sendBody: boolean = false;

  @Input({ type: 'object', label: 'Body', required: false })
  body?: any;

  @Output({ type: 'object', label: 'Response' })
  response: any;

  @Output({ type: 'number', label: 'Status Code' })
  statusCode: number = 0;

  execute() {
    // Simulate HTTP request
    if (this.method === 'GET') {
      this.response = {
        success: true,
        data: {
          items: [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 2', value: 200 },
            { id: 3, name: 'Item 3', value: 300 },
          ],
          total: 3,
        },
      };
      this.statusCode = 200;
    } else if (this.method === 'POST' || this.method === 'PUT') {
      this.response = {
        success: true,
        message: 'Resource created successfully',
        data: this.body || { id: Date.now() },
      };
      this.statusCode = this.method === 'POST' ? 201 : 200;
    } else {
      this.response = {
        success: true,
        message: 'Operation completed',
      };
      this.statusCode = 200;
    }
  }
}
