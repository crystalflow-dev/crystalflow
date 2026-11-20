import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';
import { pause } from './pace';

/**
 * Report Node - the end of the workflow: one sentence from a count and an amount.
 * The sentence is an output, so it shows on the node after a run.
 */
@defineNode({
  type: 'orders.report',
  label: 'Report',
  category: 'Output',
  description: 'Writes a count and an amount into a sentence',
  color: '#FF9800',
})
export class ReportNode extends Node {
  @Input({ type: 'number', label: 'Count' })
  count: number = 0;

  @Input({ type: 'number', label: 'Amount' })
  amount: number = 0;

  @Property({
    type: 'string',
    label: 'Sentence',
    defaultValue: '{count} orders, {amount} €',
    description: 'Use {count} and {amount} as placeholders',
  })
  sentence: string = '{count} orders, {amount} €';

  @Output({ type: 'string', label: 'Report' })
  report: string = '';

  async execute() {
    await pause();
    const amount = Number(this.amount ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
    this.report = this.sentence
      .replace(/{count}/g, String(this.count ?? 0))
      .replace(/{amount}/g, amount);
  }
}
