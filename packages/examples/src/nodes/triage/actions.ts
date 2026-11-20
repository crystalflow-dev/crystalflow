import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';
import { pause } from '../orders/pace';
import type { TriageOrder } from './OrderNode';

const euros = (amount: number) => `${amount.toLocaleString('en-US')} €`;

/** Hold for Review Node - where a large order stops until someone has looked at it. */
@defineNode({
  type: 'triage.hold',
  label: 'Hold for review',
  category: 'Actions',
  description: 'Holds a large order until it is reviewed',
  color: '#E53935',
})
export class HoldNode extends Node {
  @Input({ type: 'object', label: 'Order' })
  order?: TriageOrder;

  @Property({ type: 'boolean', label: 'Notify the manager', defaultValue: true })
  notify: boolean = true;

  @Output({ type: 'string', label: 'Message' })
  message: string = '';

  async execute() {
    await pause();
    if (!this.order) throw new Error('No order to hold');
    this.message = `Held ${euros(this.order.total)}${this.notify ? ', manager told' : ''}`;
  }
}

/** Send Receipt Node - the paid branch. */
@defineNode({
  type: 'triage.receipt',
  label: 'Send receipt',
  category: 'Actions',
  description: 'Sends the receipt of a paid order',
  color: '#43A047',
})
export class ReceiptNode extends Node {
  @Input({ type: 'object', label: 'Order' })
  order?: TriageOrder;

  @Property({ type: 'string', label: 'Opening words', defaultValue: 'Receipt to' })
  opening: string = 'Receipt to';

  @Output({ type: 'string', label: 'Message' })
  message: string = '';

  async execute() {
    await pause();
    if (!this.order) throw new Error('No order to send a receipt for');
    this.message = `${this.opening} ${this.order.customer}`;
  }
}

/** Send Reminder Node - the pending branch. */
@defineNode({
  type: 'triage.reminder',
  label: 'Send reminder',
  category: 'Actions',
  description: 'Reminds the customer of an order that is not paid yet',
  color: '#FB8C00',
})
export class ReminderNode extends Node {
  @Input({ type: 'object', label: 'Order' })
  order?: TriageOrder;

  @Property({ type: 'number', label: 'Days to pay', defaultValue: 3, min: 1, max: 30 })
  days: number = 3;

  @Output({ type: 'string', label: 'Message' })
  message: string = '';

  async execute() {
    await pause();
    if (!this.order) throw new Error('No order to remind about');
    this.message = `${this.order.customer}: pay in ${this.days} days`;
  }
}

/** Archive Node - the default branch, for every status no case names. */
@defineNode({
  type: 'triage.archive',
  label: 'Archive',
  category: 'Actions',
  description: 'Files an order that needs nothing more',
  color: '#757575',
})
export class ArchiveNode extends Node {
  @Input({ type: 'object', label: 'Order' })
  order?: TriageOrder;

  @Output({ type: 'string', label: 'Message' })
  message: string = '';

  async execute() {
    await pause();
    if (!this.order) throw new Error('No order to archive');
    this.message = `Archived #${this.order.id} (${this.order.status})`;
  }
}
