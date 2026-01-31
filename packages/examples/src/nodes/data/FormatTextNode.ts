import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

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
}
