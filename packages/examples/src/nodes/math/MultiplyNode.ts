import { defineNode, Input, Output, Node } from '@crystalflow/core';

/**
 * Multiply Numbers Node
 * Multiplies two numbers
 */
@defineNode({
  type: 'math.multiply',
  label: 'Multiply',
  category: 'Math',
  description: 'Multiplies two numbers',
  color: '#2196F3',
})
export class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 1, required: true })
  a: number = 1;

  @Input({ type: 'number', label: 'B', defaultValue: 1, required: true })
  b: number = 1;

  @Output({ type: 'number', label: 'Product' })
  product: number = 0;

  execute(): void {
    this.product = this.a * this.b;
  }
}
