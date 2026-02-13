import { defineNode, Output, Node, Property } from '@crystalflow/core';

/**
 * Manual boolean input node for testing
 */
@defineNode({
  type: 'logic.boolean-input',
  label: 'Boolean Input',
  category: 'Logic',
  description: 'Manually set a boolean value (true/false)',
})
export class BooleanInputNode extends Node {
  @Property({
    type: 'boolean',
    label: 'Value',
    defaultValue: false,
  })
  value: boolean = false;

  @Output({ type: 'boolean', label: 'Output' })
  output!: boolean;

  execute(): void {
    this.output = this.value;
  }
}
