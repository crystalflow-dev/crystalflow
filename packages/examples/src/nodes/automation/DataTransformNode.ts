import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

/**
 * Data Transform Node - Transforms and manipulates data
 */
@defineNode({
  type: 'automation.data-transform',
  label: 'Transform Data',
  category: 'Transform',
  description: 'Transforms and manipulates data structures',
  color: '#FFA500',
})
export class DataTransformNode extends Node {
  @Property({
    type: 'select',
    label: 'Operation',
    defaultValue: 'extract',
    options: [
      { value: 'extract', label: 'Extract Fields' },
      { value: 'merge', label: 'Merge Objects' },
      { value: 'filter', label: 'Filter Array' },
      { value: 'map', label: 'Map Array' },
    ],
  })
  operation: string = 'extract';

  @Property({
    type: 'string',
    label: 'Field Path',
    defaultValue: 'data.items',
    description: 'Path to extract (use dot notation)',
  })
  fieldPath: string = 'data.items';

  @Input({ type: 'object', label: 'Data' })
  data: any;

  @Output({ type: 'object', label: 'Result' })
  result: any;

  execute() {
    if (!this.data) {
      this.result = null;
      return;
    }

    switch (this.operation) {
      case 'extract':
        this.result = this.extractField(this.data, this.fieldPath);
        break;
      case 'merge':
        this.result = { ...this.data, transformed: true, timestamp: Date.now() };
        break;
      case 'filter':
        if (Array.isArray(this.data)) {
          this.result = this.data.filter((item: any) => item != null);
        } else {
          this.result = this.data;
        }
        break;
      case 'map':
        if (Array.isArray(this.data)) {
          this.result = this.data.map((item: any) => ({
            ...item,
            processed: true,
          }));
        } else {
          this.result = this.data;
        }
        break;
      default:
        this.result = this.data;
    }
  }

  private extractField(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }
}
