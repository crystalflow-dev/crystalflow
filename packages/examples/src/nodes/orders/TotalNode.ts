import { Node, Input, Output, defineNode } from '@crystalflow/core';
import type { Order } from './orders';
import { pause } from './pace';

/**
 * Total Node - Adds up the totals of the orders.
 */
@defineNode({
  type: 'orders.total',
  label: 'Total',
  category: 'Math',
  description: 'Adds up the totals of the orders',
  color: '#9C27B0',
})
export class TotalNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Output({ type: 'number', label: 'Total' })
  total: number = 0;

  async execute() {
    await pause();
    const orders = this.orders ?? [];
    this.total = orders.reduce((sum, order) => sum + order.total, 0);
  }
}
