import { Workflow } from '../workflow/Workflow';
import { Node } from '../node/Node';
import { NodeRegistry } from '../node/NodeRegistry';
import { defineNode, Input, Output } from '../node/decorators';
import 'reflect-metadata';

// Test nodes for workflow testing
@defineNode({
  autoRegister: false,
  type: 'test.add',
  label: 'Add',
  category: 'Test',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result: number = 0;

  execute(): void {
    this.result = this.a + this.b;
  }

  reset(): void {
    this.result = 0;
  }

  // Override to provide port information for testing
  getOutputPorts() {
    return [{ name: 'result', type: 'number', label: 'Result' }];
  }

  getInputPorts() {
    return [
      { name: 'a', type: 'number', label: 'A' },
      { name: 'b', type: 'number', label: 'B' },
    ];
  }

  getOutputValue(portName: string): unknown {
    return this[portName];
  }

  setInputValue(portName: string, value: unknown): void {
    this[portName] = value;
  }
}

@defineNode({
  autoRegister: false,
  type: 'test.multiply',
  label: 'Multiply',
  category: 'Test',
})
class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 1;

  @Input({ type: 'number', label: 'B' })
  b: number = 1;

  @Output({ type: 'number', label: 'Result' })
  result: number = 0;

  execute(): void {
    this.result = this.a * this.b;
  }

  reset(): void {
    this.result = 0;
  }

  // Override to provide port information for testing
  getOutputPorts() {
    return [{ name: 'result', type: 'number', label: 'Result' }];
  }

  getInputPorts() {
    return [
      { name: 'a', type: 'number', label: 'A' },
      { name: 'b', type: 'number', label: 'B' },
    ];
  }

  getOutputValue(portName: string): unknown {
    return this[portName];
  }

  setInputValue(portName: string, value: unknown): void {
    this[portName] = value;
  }
}

describe('Workflow', () => {
  let registry: NodeRegistry;

  beforeEach(() => {
    registry = NodeRegistry.getInstance();
    registry.clear();
    registry.register(AddNode);
    registry.register(MultiplyNode);
  });

  afterEach(() => {
    registry.clear();
  });

  describe('constructor', () => {
    it('should create a workflow with default values', () => {
      const workflow = new Workflow();

      expect(workflow.id).toBeDefined();
      expect(workflow.name).toBe('Untitled Workflow');
      expect(workflow.version).toBe('1.0.0');
      expect(workflow.nodes.size).toBe(0);
      expect(workflow.connections.size).toBe(0);
    });

    it('should create a workflow with custom id and name', () => {
      const workflow = new Workflow('custom-id', 'Custom Workflow');

      expect(workflow.id).toBe('custom-id');
      expect(workflow.name).toBe('Custom Workflow');
    });
  });

  describe('addNode', () => {
    it('should add a node to the workflow', () => {
      const workflow = new Workflow();
      const node = workflow.addNode('test.add');

      expect(workflow.nodes.size).toBe(1);
      expect(node).toBeInstanceOf(AddNode);
      expect(workflow.nodes.get(node.id)).toBe(node);
    });

    it('should throw error for unknown node type', () => {
      const workflow = new Workflow();

      expect(() => workflow.addNode('unknown.type')).toThrow(
        "Node type 'unknown.type' is not registered"
      );
    });

    it('should configure node with provided config', () => {
      const workflow = new Workflow();
      const config = {
        id: 'custom-node-id',
        position: { x: 100, y: 200 },
        data: { a: 5, b: 10 },
      };

      const node = workflow.addNode('test.add', config);

      expect(node.id).toBe('custom-node-id');
      expect(node.position).toEqual({ x: 100, y: 200 });
      expect((node as AddNode).a).toBe(5);
      expect((node as AddNode).b).toBe(10);
    });
  });

  describe('removeNode', () => {
    it('should remove a node from the workflow', () => {
      const workflow = new Workflow();
      const node = workflow.addNode('test.add');
      const nodeId = node.id;

      expect(workflow.removeNode(nodeId)).toBe(true);
      expect(workflow.nodes.size).toBe(0);
      expect(workflow.getNode(nodeId)).toBeUndefined();
    });

    it('should return false for non-existent node', () => {
      const workflow = new Workflow();

      expect(workflow.removeNode('non-existent')).toBe(false);
    });

    it('should remove connections when removing node', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');
      const node2 = workflow.addNode('test.multiply');

      workflow.connect(node1.id, 'result', node2.id, 'a');
      expect(workflow.connections.size).toBe(1);

      workflow.removeNode(node1.id);
      expect(workflow.connections.size).toBe(0);
    });
  });

  describe('connect', () => {
    it('should create a connection between two nodes', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');
      const node2 = workflow.addNode('test.multiply');

      const connection = workflow.connect(node1.id, 'result', node2.id, 'a');

      expect(workflow.connections.size).toBe(1);
      expect(connection.sourceNodeId).toBe(node1.id);
      expect(connection.targetNodeId).toBe(node2.id);
    });

    it('should throw error for non-existent source node', () => {
      const workflow = new Workflow();
      const node2 = workflow.addNode('test.multiply');

      expect(() => {
        workflow.connect('non-existent', 'result', node2.id, 'a');
      }).toThrow("Source node 'non-existent' not found");
    });

    it('should throw error for non-existent target node', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');

      expect(() => {
        workflow.connect(node1.id, 'result', 'non-existent', 'a');
      }).toThrow("Target node 'non-existent' not found");
    });
  });

  describe('validate', () => {
    it('should validate a simple workflow', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');
      const node2 = workflow.addNode('test.multiply');
      workflow.connect(node1.id, 'result', node2.id, 'a');

      const result = workflow.validate();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect circular dependencies', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');
      const node2 = workflow.addNode('test.multiply');

      workflow.connect(node1.id, 'result', node2.id, 'a');
      workflow.connect(node2.id, 'result', node1.id, 'a');

      const result = workflow.validate();

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Workflow contains circular dependencies',
          }),
        ])
      );
    });
  });

  describe('execute', () => {
    it('should execute nodes in correct order', async () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add', { data: { a: 2, b: 3 } });
      const node2 = workflow.addNode('test.multiply', { data: { b: 2 } });

      workflow.connect(node1.id, 'result', node2.id, 'a');

      await workflow.execute();

      expect((node1 as AddNode).result).toBe(5);
      expect((node2 as MultiplyNode).result).toBe(10); // 5 * 2
    });

    it('should return failed status for invalid workflow', async () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');
      const node2 = workflow.addNode('test.multiply');

      // Create circular dependency
      workflow.connect(node1.id, 'result', node2.id, 'a');
      workflow.connect(node2.id, 'result', node1.id, 'a');

      const result = await workflow.execute();

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Workflow validation failed');
    });
  });

  describe('serialization', () => {
    it('should serialize workflow to JSON', () => {
      const workflow = new Workflow('test-workflow', 'Test Workflow');
      const node1 = workflow.addNode('test.add', { data: { a: 5 } });
      const node2 = workflow.addNode('test.multiply');

      workflow.connect(node1.id, 'result', node2.id, 'a');

      const json = workflow.toJSON();

      expect(json.id).toBe('test-workflow');
      expect(json.name).toBe('Test Workflow');
      expect(json.version).toBe('1.0.0');
      expect(json.nodes).toHaveLength(2);
      expect(json.connections).toHaveLength(1);
    });

    it('should deserialize workflow from JSON', () => {
      const workflowData = {
        version: '1.0.0',
        id: 'test-workflow',
        name: 'Test Workflow',
        nodes: [
          {
            id: 'node1',
            type: 'test.add',
            position: { x: 0, y: 0 },
            data: { a: 5, b: 3 },
          },
        ],
        connections: [],
        metadata: { testVar: 'value' },
      };

      const workflow = Workflow.fromJSON(workflowData);

      expect(workflow.id).toBe('test-workflow');
      expect(workflow.name).toBe('Test Workflow');
      expect(workflow.nodes.size).toBe(1);
      expect(workflow.metadata).toEqual({ testVar: 'value' });
    });
  });

  describe('getExecutionOrder', () => {
    it('should return correct execution order', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add');
      const node2 = workflow.addNode('test.multiply');
      const node3 = workflow.addNode('test.add');

      workflow.connect(node1.id, 'result', node2.id, 'a');
      workflow.connect(node2.id, 'result', node3.id, 'a');

      const order = workflow.getExecutionOrder();

      expect(order).toEqual([node1.id, node2.id, node3.id]);
    });
  });

  describe('reset', () => {
    it('should reset all nodes in the workflow', () => {
      const workflow = new Workflow();
      const node1 = workflow.addNode('test.add', { data: { a: 5, b: 3 } }) as AddNode;
      const node2 = workflow.addNode('test.multiply') as MultiplyNode;

      // Execute to set results
      node1.execute();
      node2.execute();

      expect(node1.result).toBe(8);
      expect(node2.result).toBe(1);

      workflow.reset();

      expect(node1.result).toBe(0);
      expect(node2.result).toBe(0);
    });
  });
});
