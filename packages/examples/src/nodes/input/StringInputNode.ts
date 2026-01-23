import { defineNode, Input, Output, Node } from '@reactflo/core';

/**
 * String Input Node
 * Provides a configurable string value as output
 */
@defineNode({
  type: 'input.string',
  label: 'Text',
  category: 'Input',
  description: 'Outputs a configurable text value',
  color: '#9C27B0',
})
export class StringInputNode extends Node {
  @Input({ type: 'string', label: 'Text', defaultValue: '' })
  inputValue: string = '';

  @Output({ type: 'string', label: 'Value' })
  value: string = '';

  execute(): void {
    // Output the input value
    this.value = this.inputValue;
  }
}
