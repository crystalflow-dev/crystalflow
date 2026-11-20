import { Node, Input, Output, defineNode } from '@crystalflow/core';
import type { Order } from './orders';
import { pause } from './pace';

/**
 * Count Node - Counts the orders.
 */
@defineNode({
  type: 'orders.count',
  label: 'Count',
  category: 'Math',
  description: 'Counts the orders',
  color: '#00897B',
})
export class CountNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Output({ type: 'number', label: 'Count' })
  count: number = 0;

  async execute() {
    await pause();
    const orders = this.orders ?? [];
    this.count = orders.length;
  }
}
