import { defineNode, Input, Output, Node } from '@crystalflow/core';

/**
 * Subtract Numbers Node
 * Subtracts B from A
 */
@defineNode({
  type: 'math.subtract',
  label: 'Subtract',
  category: 'Math',
  description: 'Subtracts B from A',
  color: '#FF5722',
})
export class SubtractNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 0 })
  a: number = 0;

  @Input({ type: 'number', label: 'B', defaultValue: 0 })
  b: number = 0;

  @Output({ type: 'number', label: 'Difference' })
  difference: number = 0;

  execute(): void {
    this.difference = this.a - this.b;
  }
}
