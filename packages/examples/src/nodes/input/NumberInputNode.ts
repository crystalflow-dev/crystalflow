import { defineNode, Input, Output, Node } from '@reactflo/core';

/**
 * Number Input Node
 * Provides a configurable number value as output
 */
@defineNode({
  type: 'input.number',
  label: 'Number',
  category: 'Input',
  description: 'Outputs a configurable number value',
  color: '#9C27B0',
})
export class NumberInputNode extends Node {
  @Input({ type: 'number', label: 'Value', defaultValue: 0 })
  inputValue: number = 0;

  @Output({ type: 'number', label: 'Value' })
  value: number = 0;

  execute(): void {
    // Output the input value
    this.value = this.inputValue;
  }
}
