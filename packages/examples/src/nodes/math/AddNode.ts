import { defineNode, Input, Output, Node } from '@crystalflow/core';

/**
 * Add Numbers Node
 * Adds two numbers together
 */
@defineNode({
  type: 'math.add',
  label: 'Add',
  category: 'Math',
  description: 'Adds two numbers together',
  color: '#4CAF50',
})
export class AddNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 0, required: true })
  a: number = 0;

  @Input({ type: 'number', label: 'B', defaultValue: 0, required: true })
  b: number = 0;

  @Output({ type: 'number', label: 'Sum' })
  sum: number = 0;

  execute(): void {
    this.sum = this.a + this.b;
  }
}
