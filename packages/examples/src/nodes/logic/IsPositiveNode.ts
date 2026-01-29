import { defineNode, Input, Output, Node } from '@reactflo/core';

/**
 * Check if a number is positive
 */
@defineNode({
  type: 'logic.is-positive',
  label: 'Is Positive',
  category: 'Logic',
  description: 'Check if a number is greater than zero',
})
export class IsPositiveNode extends Node {
  @Input({ type: 'number', label: 'Number', required: true })
  number: number = 0;

  @Output({ type: 'boolean', label: 'Result' })
  result!: boolean;

  execute(): void {
    this.result = this.number > 0;
  }
}
