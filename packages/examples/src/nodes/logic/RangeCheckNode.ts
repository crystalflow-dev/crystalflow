import { defineNode, Input, Output, Node } from '@reactflo/core';

/**
 * Check if a number is within a range
 */
@defineNode({
  type: 'logic.range-check',
  label: 'Range Check',
  category: 'Logic',
  description: 'Check if a number is between min and max (inclusive)',
})
export class RangeCheckNode extends Node {
  @Input({ type: 'number', label: 'Value', required: true })
  value: number = 0;

  @Input({ type: 'number', label: 'Min', required: true })
  min: number = 0;

  @Input({ type: 'number', label: 'Max', required: true })
  max: number = 100;

  @Output({ type: 'boolean', label: 'In Range' })
  inRange!: boolean;

  execute(): void {
    this.inRange = this.value >= this.min && this.value <= this.max;
  }
}
