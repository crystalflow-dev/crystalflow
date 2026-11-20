import { defineNode, Executor, Input, Node, Output, Workflow } from '@crystalflow/core';
import type { WorkflowData } from '@crystalflow/types';

/** How long each node of the example waits, so a run can be watched. Tests pass 0. */
let pause = 0;
const wait = () => new Promise((resolve) => setTimeout(resolve, pause));

type Order = { id: number; paid: boolean; total: number };

@defineNode({ type: 'engine.fetch', label: 'Fetch orders', category: 'Engine' })
export class FetchOrdersNode extends Node {
  @Output({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  async execute(): Promise<void> {
    await wait();
    this.orders = [
      { id: 1, paid: true, total: 120 },
      { id: 2, paid: false, total: 80 },
      { id: 3, paid: true, total: 45 },
    ];
  }
}

@defineNode({ type: 'engine.paid', label: 'Keep paid', category: 'Engine' })
export class KeepPaidNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Output({ type: 'array', label: 'Paid' })
  paid: Order[] = [];

  async execute(): Promise<void> {
    await wait();
    this.paid = this.orders.filter((order) => order.paid);
  }
}

@defineNode({ type: 'engine.sum', label: 'Sum totals', category: 'Engine' })
export class SumTotalsNode extends Node {
  @Input({ type: 'array', label: 'Orders' })
  orders: Order[] = [];

  @Output({ type: 'number', label: 'Total' })
  total: number = 0;

  async execute(): Promise<void> {
    await wait();
    this.total = this.orders.reduce((sum, order) => sum + order.total, 0);
  }
}

@defineNode({ type: 'engine.report', label: 'Send report', category: 'Engine' })
export class SendReportNode extends Node {
  @Input({ type: 'number', label: 'Total' })
  total: number = 0;

  @Output({ type: 'string', label: 'Message' })
  message: string = '';

  async execute(): Promise<void> {
    await wait();
    this.message = `Paid orders: ${this.total}`;
  }
}

export const engineSteps = [
  { id: 'fetch', type: 'engine.fetch', label: 'Fetch orders', out: 'orders' },
  { id: 'paid', type: 'engine.paid', label: 'Keep paid', in: 'orders', out: 'paid' },
  { id: 'sum', type: 'engine.sum', label: 'Sum totals', in: 'orders', out: 'total' },
  { id: 'report', type: 'engine.report', label: 'Send report', in: 'total', out: 'message' },
] as const;

export type StepId = (typeof engineSteps)[number]['id'];

export const engineWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'orders',
  name: 'Paid orders report',
  nodes: engineSteps.map((step, i) => ({
    id: step.id,
    type: step.type,
    position: { x: i * 200, y: 0 },
    data: { id: step.id, type: step.type, state: 'idle' as const, data: {} },
  })),
  connections: engineSteps.slice(1).map((step, i) => ({
    id: `c${i}`,
    source: { nodeId: engineSteps[i].id, portId: engineSteps[i].out },
    target: { nodeId: step.id, portId: (step as { in: string }).in },
  })),
  metadata: {},
};

/** One line of the log: an event the Executor emitted, as it happened. */
export type EngineEvent =
  | { name: 'beforeExecute' }
  | { name: 'onNodeStart'; node: StepId }
  | { name: 'onNodeComplete'; node: StepId; output: string }
  | { name: 'onNodeError'; node: StepId; message: string }
  | { name: 'onCancellation' }
  | { name: 'afterExecute'; status: string };

/** Short text for a node's output, to fit one log line. */
function brief(value: unknown): string {
  if (Array.isArray(value)) return `${value.length} ${value.length === 1 ? 'order' : 'orders'}`;
  return typeof value === 'string' ? `"${value}"` : String(value);
}

/**
 * Runs the example workflow on the real Executor and reports each event it emits.
 * Aborting the signal cancels the run; the engine stops before the next node.
 */
export async function runEngine(options: {
  onEvent: (event: EngineEvent) => void;
  signal?: AbortSignal;
  delay?: number;
}): Promise<string> {
  const { onEvent, signal, delay = 0 } = options;
  pause = delay;
  const outputOf = Object.fromEntries(engineSteps.map((step) => [step.id, step.out]));
  const executor = new Executor();
  executor.on('beforeExecute', () => onEvent({ name: 'beforeExecute' }));
  executor.on('onNodeStart', (nodeId) => onEvent({ name: 'onNodeStart', node: nodeId as StepId }));
  executor.on('onNodeComplete', (nodeId, result) =>
    onEvent({
      name: 'onNodeComplete',
      node: nodeId as StepId,
      output: brief(result.outputs[outputOf[nodeId]]),
    })
  );
  executor.on('onNodeError', (nodeId, error) =>
    onEvent({ name: 'onNodeError', node: nodeId as StepId, message: error.message })
  );
  executor.on('onCancellation', () => onEvent({ name: 'onCancellation' }));
  executor.on('afterExecute', (result) =>
    onEvent({ name: 'afterExecute', status: String(result.status) })
  );
  const result = await executor.execute(Workflow.fromJSON(engineWorkflow), {
    abortSignal: signal,
  });
  return String(result.status);
}
