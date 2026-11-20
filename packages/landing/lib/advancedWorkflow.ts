import type { WorkflowData } from '@crystalflow/types';

/** The nodes on the canvas when the advanced example opens. */
const placed: { id: string; type: string; x: number; y: number; data?: Record<string, unknown> }[] =
  [
    // columns 340 apart: a node grows as wide as the values it shows after a run
    { id: 'order', type: 'triage.order', x: 0, y: 210 },
    { id: 'above', type: 'triage.above', x: 340, y: 0 },
    { id: 'if', type: 'flow.if', x: 680, y: 170 },
    { id: 'hold', type: 'triage.hold', x: 1040, y: 0 },
    // the cases are a property of the Switch: each one becomes an output port
    { id: 'switch', type: 'flow.switch', x: 1040, y: 300, data: { cases: ['paid', 'pending'] } },
    { id: 'receipt', type: 'triage.receipt', x: 1400, y: 130 },
    { id: 'reminder', type: 'triage.reminder', x: 1400, y: 320 },
    { id: 'archive', type: 'triage.archive', x: 1400, y: 510 },
  ];

/**
 * An order over the limit is held; any other goes on to the Switch, which picks one action by status.
 * Only the branch that is taken runs.
 */
const wires = [
  { from: 'order', out: 'total', to: 'above', in: 'amount' },
  { from: 'above', out: 'above', to: 'if', in: 'condition' },
  { from: 'order', out: 'order', to: 'if', in: 'value' },
  { from: 'if', out: 'thenOutput', to: 'hold', in: 'order' },
  { from: 'if', out: 'elseOutput', to: 'switch', in: 'data' },
  { from: 'order', out: 'status', to: 'switch', in: 'value' },
  { from: 'switch', out: 'case_0', to: 'receipt', in: 'order' },
  { from: 'switch', out: 'case_1', to: 'reminder', in: 'order' },
  { from: 'switch', out: 'default', to: 'archive', in: 'order' },
];

/** The advanced example's starting point: one order routed by an If and a Switch. */
export const advancedWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'advanced',
  name: 'Order triage',
  nodes: placed.map((node) => ({
    id: node.id,
    type: node.type,
    position: { x: node.x, y: node.y },
    data: { id: node.id, type: node.type, state: 'idle' as const, data: node.data ?? {} },
  })),
  connections: wires.map((wire, i) => ({
    id: `c${i}`,
    source: { nodeId: wire.from, portId: wire.out },
    target: { nodeId: wire.to, portId: wire.in },
  })),
  metadata: {},
};
