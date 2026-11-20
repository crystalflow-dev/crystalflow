import { Node, Output, Property, defineNode } from '@crystalflow/core';
import { pause } from '../orders/pace';

export type TriageOrder = { id: number; customer: string; status: string; total: number };

/** The sample orders the Order node offers. */
export const triageOrders: TriageOrder[] = [
  { id: 1045, customer: 'Harbor Tea', status: 'paid', total: 210 },
  { id: 1042, customer: 'Nord Cycles', status: 'pending', total: 80 },
  { id: 1044, customer: 'Kiln Studio', status: 'refunded', total: 60 },
  { id: 1051, customer: 'Atlas Books', status: 'paid', total: 2400 },
];

/**
 * Order Node - the start of the triage: one order, with its total and status on ports of their own
 * so the nodes that decide can read them.
 */
@defineNode({
  type: 'triage.order',
  label: 'Order',
  category: 'Orders',
  description: 'Loads one order',
  color: '#2196F3',
})
export class OrderNode extends Node {
  @Property({
    type: 'select',
    label: 'Order',
    defaultValue: '1045',
    options: triageOrders.map((order) => ({
      value: String(order.id),
      label: `#${order.id} ${order.customer}, ${order.status}, ${order.total} €`,
    })),
  })
  pick: string = '1045';

  @Output({ type: 'object', label: 'Order' })
  order?: TriageOrder;

  @Output({ type: 'number', label: 'Total' })
  total: number = 0;

  @Output({ type: 'string', label: 'Status' })
  status: string = '';

  async execute() {
    await pause();
    const order = triageOrders.find((one) => String(one.id) === this.pick) ?? triageOrders[0];
    this.order = order;
    this.total = order.total;
    this.status = order.status;
  }
}
