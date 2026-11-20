import { Node, Input, Output, defineNode } from '@crystalflow/core';
import type { Order } from './orders';
import { pause } from './pace';

/**
 * Average Node - Gives the average total of the orders, 0 when there are none.
 */
@defineNode({
  type: 'orders.average',
  label: 'Average',
  category: 'Math',
  description: 'Gives the average total of the orders, 0 when there are none',
  color: '#5C6BC0',
})
export class AverageNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Output({ type: 'number', label: 'Average' })
  average: number = 0;

  async execute() {
    await pause();
    const orders = this.orders ?? [];
    const sum = orders.reduce((all, order) => all + order.total, 0);
    this.average = orders.length ? Math.round((sum / orders.length) * 100) / 100 : 0;
  }
}
