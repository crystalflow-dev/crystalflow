import { defineNode, Input, Node } from '@crystalflow/core';

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
  @Input({ type: 'any', label: 'Value', required: false })
  value: unknown;

  execute(): void {
    alert(`Display: ${this.value ? this.value : 'no value'}`);
  }
}
