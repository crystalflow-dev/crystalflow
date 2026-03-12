import { defineNode, Input, Output, Node } from '@crystalflow/core';

/**
 * Calculate modulo (remainder) of division
 */
@defineNode({
  type: 'math.modulo',
  label: 'Modulo',
  category: 'Math',
  description: 'Calculate the remainder of A divided by B (A % B)',
})
export class ModuloNode extends Node {
  @Input({ type: 'number', label: 'A', required: true })
  a: number = 0;

  @Input({ type: 'number', label: 'B', required: true })
  b: number = 1;

  @Output({ type: 'number', label: 'Result' })
  result!: number;

  execute(): void {
    if (this.b === 0) {
      throw new Error('Division by zero in modulo operation');
    }
    this.result = this.a % this.b;
  }
}
