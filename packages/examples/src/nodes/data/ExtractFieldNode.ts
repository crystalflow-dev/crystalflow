import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

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
        throw new Error(`Field "${this.fieldPath}" not found in JSON object`);
      }
    }

    this.value = current;
  }
}
