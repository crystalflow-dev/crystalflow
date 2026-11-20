import 'reflect-metadata';
import { Executor, IfNode, SwitchNode, Workflow } from '@crystalflow/core';
import type { WorkflowData } from '@crystalflow/types';
import { setPace } from '../../../examples/src/nodes/orders';
import {
  AboveNode,
  ArchiveNode,
  HoldNode,
  OrderNode,
  ReceiptNode,
  ReminderNode,
} from '../../../examples/src/nodes/triage';
import { advancedWorkflow, advancedWorkflowCompact } from '../advancedWorkflow';

// naming the classes registers them with the engine
const classes = [
  OrderNode,
  AboveNode,
  IfNode,
  SwitchNode,
  HoldNode,
  ReceiptNode,
  ReminderNode,
  ArchiveNode,
];

beforeAll(() => setPace(0));

function withProperties(properties: Record<string, Record<string, unknown>>): WorkflowData {
  return {
    ...advancedWorkflow,
    nodes: advancedWorkflow.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        data: { ...(node.data.data as object), ...(properties[node.id] ?? {}) },
      },
    })),
  } as WorkflowData;
}

async function run(data: WorkflowData) {
  const ran: string[] = [];
  const messages: Record<string, unknown> = {};
  const executor = new Executor();
  executor.on('onNodeComplete', (nodeId, result) => {
    ran.push(nodeId);
    if ('message' in result.outputs) messages[nodeId] = result.outputs.message;
  });
  const result = await executor.execute(Workflow.fromJSON(data));
  return { status: String(result.status), ran: ran.sort(), messages };
}

describe('the advanced example', () => {
  it('registers every node class it places', () => {
    expect(classes).toHaveLength(8);
  });

  it.each([
    ['1045', ['switch', 'receipt'], { receipt: 'Receipt to Harbor Tea' }],
    ['1042', ['switch', 'reminder'], { reminder: 'Nord Cycles: pay in 3 days' }],
    ['1044', ['switch', 'archive'], { archive: 'Archived #1044 (refunded)' }],
    ['1051', ['hold'], { hold: 'Held 2,400 €, manager told' }],
  ])('routes order %s down one branch only', async (pick, branch, messages) => {
    const result = await run(withProperties({ order: { pick } }));

    expect(result.status).toBe('success');
    expect(result.ran).toEqual(['above', 'if', 'order', ...branch].sort());
    expect(result.messages).toEqual(messages);
  });

  it('holds a smaller order once the limit is lowered', async () => {
    const result = await run(withProperties({ above: { limit: 100 }, hold: { notify: false } }));
    expect(result.ran).toEqual(['above', 'hold', 'if', 'order']);
    expect(result.messages).toEqual({ hold: 'Held 210 €' });
  });

  it('sends a status to another action when the cases of the Switch change', async () => {
    const result = await run(
      withProperties({ order: { pick: '1044' }, switch: { cases: ['refunded', 'pending'] } })
    );
    expect(result.messages).toEqual({ receipt: 'Receipt to Kiln Studio' });
  });

  it('has a compact layout that differs in positions only', async () => {
    const bare = (data: WorkflowData) => ({
      ...data,
      nodes: data.nodes.map((node) => ({ ...node, position: undefined })),
    });
    expect(bare(advancedWorkflowCompact)).toEqual(bare(advancedWorkflow));
    expect(advancedWorkflowCompact.nodes.map((node) => node.position)).not.toEqual(
      advancedWorkflow.nodes.map((node) => node.position)
    );
  });
});
