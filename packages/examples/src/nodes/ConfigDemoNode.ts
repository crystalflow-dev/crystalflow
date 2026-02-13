import { Node, defineNode, Input, Output, Property } from '@crystalflow/core';

/**
 * Example node demonstrating property usage
 * Properties are configuration values that can be set in the UI properties panel
 */
@defineNode({
  type: 'examples.config-demo',
  label: 'Configuration Demo',
  category: 'Examples',
  description: 'Demonstrates different types of properties for node configuration',
})
export class ConfigDemoNode extends Node {
  // Input - part of data flow, can be connected
  @Input({ type: 'string', label: 'Message Override', required: false })
  messageOverride?: string;

  // Properties - configuration values, not part of data flow
  @Property({
    type: 'string',
    label: 'Base Message',
    defaultValue: 'Hello, World!',
    description: 'Base message to process',
  })
  baseMessage: string = 'Hello, World!';

  @Property({
    type: 'select',
    label: 'Transform Type',
    defaultValue: 'uppercase',
    options: [
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'lowercase', label: 'lowercase' },
      { value: 'title', label: 'Title Case' },
      { value: 'reverse', label: 'Reverse' },
    ],
    description: 'How to transform the message',
  })
  transformType: string = 'uppercase';

  @Property({
    type: 'number',
    label: 'Repeat Count',
    defaultValue: 1,
    min: 1,
    max: 10,
    step: 1,
    description: 'How many times to repeat the message',
  })
  repeatCount: number = 1;

  @Property({
    type: 'boolean',
    label: 'Add Timestamp',
    defaultValue: false,
    description: 'Whether to add a timestamp to the message',
  })
  addTimestamp: boolean = false;

  @Property({
    type: 'string',
    label: 'Separator',
    defaultValue: ' | ',
    description: 'Separator to use when repeating messages',
  })
  separator: string = ' | ';

  // Output
  @Output({ type: 'string', label: 'Processed Message' })
  result: string = '';

  execute() {
    // Use input if provided, otherwise use property
    let message = this.messageOverride || this.baseMessage;

    // Apply transformation based on property
    switch (this.transformType) {
      case 'uppercase':
        message = message.toUpperCase();
        break;
      case 'lowercase':
        message = message.toLowerCase();
        break;
      case 'title':
        message = message.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'reverse':
        message = message.split('').reverse().join('');
        break;
    }

    // Repeat message based on property
    const messages = Array(this.repeatCount).fill(message);
    let result = messages.join(this.separator);

    // Add timestamp if configured
    if (this.addTimestamp) {
      const timestamp = new Date().toISOString();
      result = `[${timestamp}] ${result}`;
    }

    this.result = result;
  }
}
