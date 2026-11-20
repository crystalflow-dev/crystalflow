/**
 * The source of the demo's node classes, shown on the demo page beside the builder.
 * Copied from packages/examples/src/nodes/orders so the static build needs no file access;
 * a test holds each copy to its file.
 */
export const nodeSources: { name: string; code: string }[] = [
  {
    name: 'OrdersNode.ts',
    code: `import { Node, Output, Property, defineNode } from '@crystalflow/core';
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
`,
  },
  {
    name: 'KeepStatusNode.ts',
    code: `import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';
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
`,
  },
  {
    name: 'TotalNode.ts',
    code: `import { Node, Input, Output, defineNode } from '@crystalflow/core';
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
`,
  },
  {
    name: 'CountNode.ts',
    code: `import { Node, Input, Output, defineNode } from '@crystalflow/core';
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
`,
  },
  {
    name: 'ReportNode.ts',
    code: `import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';
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
`,
  },
  {
    name: 'AverageNode.ts',
    code: `import { Node, Input, Output, defineNode } from '@crystalflow/core';
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
`,
  },
  {
    name: 'LargestNode.ts',
    code: `import { Node, Input, Output, defineNode } from '@crystalflow/core';
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
`,
  },
];
