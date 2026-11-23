import { Node, Output, Property, defineNode } from '@crystalflow/core';
import { ordersByPeriod, type Order } from './orders';
import { pause } from './pace';

/**
 * Orders Node - the start of the workflow: the shop's orders for one period.
 * A real one would read them from an API or a database.
 */
@defineNode({
  type: 'orders.source',
  label: 'Orders',
  category: 'Orders',
  description: 'Loads the orders of a period',
  color: '#2196F3',
})
export class OrdersNode extends Node {
  @Property({
    type: 'select',
    label: 'Period',
    defaultValue: 'today',
    options: [
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday' },
      { value: 'week', label: 'Last 7 days' },
    ],
  })
  period: string = 'today';

  @Output({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  async execute() {
    await pause();
    this.orders = ordersByPeriod[this.period] ?? ordersByPeriod.today;
  }
}
