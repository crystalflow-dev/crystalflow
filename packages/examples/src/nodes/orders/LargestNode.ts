import { Node, Input, Output, defineNode } from '@crystalflow/core';
import type { Order } from './orders';
import { pause } from './pace';

/**
 * Largest Node - Gives the largest total among the orders, 0 when there are none.
 */
@defineNode({
  type: 'orders.largest',
  label: 'Largest',
  category: 'Math',
  description: 'Gives the largest total among the orders, 0 when there are none',
  color: '#D81B60',
})
export class LargestNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Output({ type: 'number', label: 'Largest' })
  largest: number = 0;

  async execute() {
    await pause();
    const orders = this.orders ?? [];
    this.largest = orders.reduce((top, order) => Math.max(top, order.total), 0);
  }
}
