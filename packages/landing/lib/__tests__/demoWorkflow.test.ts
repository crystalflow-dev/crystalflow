import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Executor, Workflow } from '@crystalflow/core';
import type { WorkflowData } from '@crystalflow/types';
import {
  AverageNode,
  LargestNode,
  ordersByPeriod,
  setPace,
} from '../../../examples/src/nodes/orders';
import { demoWorkflow } from '../demoWorkflow';
import { nodeSources } from '../nodeSourceCode';

// the two spare nodes are not on the canvas; naming them here registers them for the rewiring tests
const spares = [AverageNode, LargestNode];

beforeAll(() => setPace(0));

/** The demo workflow with some properties set, as the property panel would set them. */
function withProperties(properties: Record<string, Record<string, unknown>>): WorkflowData {
  return {
    ...demoWorkflow,
    nodes: demoWorkflow.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        data: { ...(node.data.data as object), ...(properties[node.id] ?? {}) },
      },
    })),
  } as WorkflowData;
}

async function run(data: WorkflowData) {
  const outputs: Record<string, Record<string, unknown>> = {};
  const order: string[] = [];
  const executor = new Executor();
  executor.on('onNodeComplete', (nodeId, result) => {
    order.push(nodeId);
    outputs[nodeId] = result.outputs;
  });
  const result = await executor.execute(Workflow.fromJSON(data));
  return { status: String(result.status), outputs, order };
}

describe('the demo workflow', () => {
  it('runs on the real executor and ends in the report sentence', async () => {
    const { status, outputs, order } = await run(demoWorkflow);

    expect(status).toBe('success');
    expect(outputs.orders.orders).toHaveLength(5);
    expect(outputs.keep.kept).toHaveLength(3);
    expect(outputs.total.total).toBe(375);
    expect(outputs.count.count).toBe(3);
    expect(outputs.report.report).toBe('3 orders, 375 €');
    // a branch and a join: both middle nodes run after the filter and before the report
    expect(order.slice(0, 2)).toEqual(['orders', 'keep']);
    expect(order.slice(2, 4).sort()).toEqual(['count', 'total']);
    expect(order[4]).toBe('report');
  });

  it('gives a valid report for every period and every status', async () => {
    for (const period of Object.keys(ordersByPeriod)) {
      for (const status of ['paid', 'pending', 'refunded']) {
        const kept = ordersByPeriod[period].filter((order) => order.status === status);
        const sum = kept.reduce((all, order) => all + order.total, 0);
        const result = await run(withProperties({ orders: { period }, keep: { status } }));

        expect(result.status).toBe('success');
        expect(kept.length).toBeGreaterThan(0);
        expect(result.outputs.report.report).toBe(
          `${kept.length} orders, ${sum.toLocaleString('en-US')} €`
        );
      }
    }
  });

  it('writes the sentence the property asks for', async () => {
    const result = await run(
      withProperties({ report: { sentence: '{amount} € in {count} sales' } })
    );
    expect(result.outputs.report.report).toBe('375 € in 3 sales');
  });

  it.each([
    ['orders.average', 'average', '3 orders, 125 €'],
    ['orders.largest', 'largest', '3 orders, 210 €'],
  ])('takes the spare %s node in place of the total', async (type, port, sentence) => {
    expect(spares).toHaveLength(2);
    const rewired: WorkflowData = {
      ...demoWorkflow,
      nodes: demoWorkflow.nodes.map((node) =>
        node.id === 'total' ? { ...node, type, data: { ...node.data, type } } : node
      ),
      connections: demoWorkflow.connections.map((wire) =>
        wire.source.nodeId === 'total'
          ? { ...wire, source: { nodeId: 'total', portId: port } }
          : wire
      ),
    };
    const result = await run(rewired);
    expect(result.status).toBe('success');
    expect(result.outputs.report.report).toBe(sentence);
  });

  it('gives zero, not an error, when the spare nodes get no orders', async () => {
    for (const Spare of spares) {
      const node = new Spare('spare') as InstanceType<typeof Spare> & { orders: unknown[] };
      node.orders = [];
      await node.execute();
      const value = 'average' in node ? node.average : node.largest;
      expect(value).toBe(0);
    }
  });
});

describe('the node source shown on the demo page', () => {
  it('matches the files it was copied from', () => {
    expect(nodeSources.map((file) => file.name)).toEqual([
      'OrdersNode.ts',
      'KeepStatusNode.ts',
      'TotalNode.ts',
      'CountNode.ts',
      'ReportNode.ts',
      'AverageNode.ts',
      'LargestNode.ts',
    ]);
    for (const file of nodeSources) {
      const path = join(__dirname, '../../../examples/src/nodes/orders', file.name);
      expect(file.code).toBe(readFileSync(path, 'utf8'));
    }
  });
});
