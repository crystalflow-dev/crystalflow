import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';
import { pause } from '../orders/pace';

/**
 * Above Limit Node - answers true when an amount is over the limit. Its answer feeds an If node.
 */
@defineNode({
  type: 'triage.above',
  label: 'Above limit',
  category: 'Logic',
  description: 'True when the amount is over the limit',
  color: '#5C6BC0',
})
export class AboveNode extends Node {
  @Input({ type: 'number', label: 'Amount' })
  amount: number = 0;

  @Property({ type: 'number', label: 'Limit (€)', defaultValue: 500, min: 0, step: 50 })
  limit: number = 500;

  @Output({ type: 'boolean', label: 'Above' })
  above: boolean = false;

  async execute() {
    await pause();
    this.above = Number(this.amount ?? 0) > Number(this.limit ?? 0);
  }
}
