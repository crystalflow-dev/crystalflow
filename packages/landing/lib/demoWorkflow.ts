import type { WorkflowData } from '@crystalflow/types';

/** The nodes on the canvas when the demo opens, with the port each one writes. */
const placed = [
  { id: 'orders', type: 'orders.source', x: 0, y: 100 },
  { id: 'keep', type: 'orders.keep', x: 280, y: 100 },
  // count above total, in the order of the report's two inputs, so the wires do not cross
  { id: 'count', type: 'orders.count', x: 560, y: 0 },
  { id: 'total', type: 'orders.total', x: 560, y: 200 },
  { id: 'report', type: 'orders.report', x: 840, y: 100 },
];

/** Orders, kept by status, go two ways (their count and their total) and meet again in the report. */
const wires = [
  { from: 'orders', out: 'orders', to: 'keep', in: 'orders' },
  { from: 'keep', out: 'kept', to: 'count', in: 'orders' },
  { from: 'keep', out: 'kept', to: 'total', in: 'orders' },
  { from: 'count', out: 'count', to: 'report', in: 'count' },
  { from: 'total', out: 'total', to: 'report', in: 'amount' },
];

/** The demo's starting point: an orders report with a branch and a join. */
export const demoWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'demo',
  name: 'Orders report',
  nodes: placed.map((node) => ({
    id: node.id,
    type: node.type,
    position: { x: node.x, y: node.y },
    data: { id: node.id, type: node.type, state: 'idle' as const, data: {} },
  })),
  connections: wires.map((wire, i) => ({
    id: `c${i}`,
    source: { nodeId: wire.from, portId: wire.out },
    target: { nodeId: wire.to, portId: wire.in },
  })),
  metadata: {},
};
