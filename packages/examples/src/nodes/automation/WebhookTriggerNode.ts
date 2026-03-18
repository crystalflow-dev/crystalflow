import { Node, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Webhook Trigger Node - Starts workflow from an HTTP webhook
 * Simulates receiving data from an external webhook call
 */
@defineNode({
  type: 'automation.webhook-trigger',
  label: 'Webhook',
  category: 'Trigger',
  description: 'Triggers workflow from HTTP webhook',
  color: '#FF6D5A',
})
export class WebhookTriggerNode extends Node {
  @Property({
    type: 'select',
    label: 'HTTP Method',
    defaultValue: 'POST',
    options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'PATCH', label: 'PATCH' },
      { value: 'DELETE', label: 'DELETE' },
    ],
  })
  method: string = 'POST';

  @Property({
    type: 'string',
    label: 'Path',
    defaultValue: '/webhook',
    description: 'Webhook endpoint path',
  })
  path: string = '/webhook';

  @Output({ type: 'object', label: 'Body' })
  body: any;

  @Output({ type: 'object', label: 'Headers' })
  headers: any;

  execute() {
    // Simulate webhook data
    this.body = {
      event: 'user.signup',
      timestamp: new Date().toISOString(),
      data: {
        userId: '12345',
        email: 'user@example.com',
        name: 'New User',
      },
    };

    this.headers = {
      'content-type': 'application/json',
      'user-agent': 'Webhook-Client/1.0',
      'x-webhook-signature': 'sha256=abc123',
    };
  }
}
