import { WorkflowData, NodeData, ConnectionData } from '../index';

describe('@crystalflow/types', () => {
  it('should export WorkflowData interface', () => {
    const workflow: WorkflowData = {
      id: 'test',
      name: 'Test',
      version: '1.0.0',
      nodes: [],
      connections: [],
    };
    expect(workflow).toBeDefined();
  });

  it('should export NodeData interface', () => {
    const node: NodeData = {
      id: 'node-1',
      type: 'test.node',
      position: { x: 0, y: 0 },
      data: {},
    };
    expect(node).toBeDefined();
  });

  it('should export ConnectionData interface', () => {
    const connection: ConnectionData = {
      id: 'conn-1',
      source: { nodeId: 'node-1', portId: 'out' },
      target: { nodeId: 'node-2', portId: 'in' },
    };
    expect(connection).toBeDefined();
  });
});
