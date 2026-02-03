import { defineNode, Input, Output, Node } from '@reactflo/core';

/**
 * Check if a number is even
 */
@defineNode({
  type: 'logic.is-even',
  label: 'Is Even',
  category: 'Logic',
  description: 'Check if a number is even (divisible by 2)',
})
export class IsEvenNode extends Node {
  @Input({ type: 'number', label: 'Number', required: true })
  number: number = 0;

  @Output({ type: 'boolean', label: 'Result' })
  result!: boolean;

  execute(): void {
    this.result = this.number % 2 === 0;
  }
}
