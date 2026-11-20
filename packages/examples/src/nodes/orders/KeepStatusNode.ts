import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';
import type { Order } from './orders';
import { pause } from './pace';

/**
 * Keep by Status Node - passes on only the orders in one status.
 */
@defineNode({
  type: 'orders.keep',
  label: 'Keep by status',
  category: 'Orders',
  description: 'Keeps the orders that are in the chosen status',
  color: '#4CAF50',
})
export class KeepStatusNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Property({
    type: 'select',
    label: 'Status',
    defaultValue: 'paid',
    options: [
      { value: 'paid', label: 'Paid' },
      { value: 'pending', label: 'Pending' },
      { value: 'refunded', label: 'Refunded' },
    ],
  })
  status: string = 'paid';

  @Output({ type: 'array', label: 'Kept' })
  kept: Order[] = [];

  async execute() {
    await pause();
    this.kept = (this.orders ?? []).filter((order) => order.status === this.status);
  }
}
