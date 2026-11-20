import type { WorkflowData } from '@crystalflow/types';

const steps = [
  { id: 'api', type: 'data.mockapi', out: 'response', in: '' },
  { id: 'extract', type: 'data.extract', out: 'value', in: 'jsonObject' },
  { id: 'format', type: 'data.format', out: 'formattedText', in: 'inputValue' },
  { id: 'display', type: 'output.display', out: '', in: 'value' },
];

/** The demo's starting point: the four example nodes wired left to right. */
export const demoWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'demo',
  name: 'Mock API to display',
  nodes: steps.map((step, i) => ({
    id: step.id,
    type: step.type,
    position: { x: i * 280, y: i % 2 ? 120 : 0 },
    data: { id: step.id, type: step.type, state: 'idle' as const, data: {} },
  })),
  connections: steps.slice(1).map((step, i) => ({
    id: `c${i}`,
    source: { nodeId: steps[i].id, portId: steps[i].out },
    target: { nodeId: step.id, portId: step.in },
  })),
  metadata: {},
};
