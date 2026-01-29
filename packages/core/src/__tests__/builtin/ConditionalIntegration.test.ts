import 'reflect-metadata';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { NodeRegistry } from '../../node/NodeRegistry';
import { defineNode, Input, Output } from '../../node/decorators';
import { IfNode } from '../../builtin/flow/IfNode';
import { SwitchNode } from '../../builtin/flow/SwitchNode';

/**
 * Simple node that stores a value.
 * Used to verify data flow through conditional branches.
 */
@defineNode({
  type: 'test.value',
  label: 'Value',
  category: 'Test',
})
class ValueNode extends Node {
  @Output({ type: 'any', label: 'Value' })
  value: unknown;

  execute(): void {
    // Value is set externally
  }
}

/**
 * Simple node that collects input.
 * Used to verify which branches executed.
 */
@defineNode({
  type: 'test.collector',
  label: 'Collector',
  category: 'Test',
})
class CollectorNode extends Node {
  @Input({ type: 'any', label: 'Input', required: false })
  input: unknown;

  @Output({ type: 'any', label: 'Output' })
  output: unknown;

  execute(): void {
    this.output = this.input;
  }
}

// Track execution for branch isolation tests
let executedNodes: string[] = [];

/**
 * Tracking node for verifying branch execution.
 */
@defineNode({ type: 'test.tracking-collector', label: 'Tracking Collector', category: 'Test' })
class TrackingCollectorNode extends Node {
  name: string = '';

  @Input({ type: 'any', label: 'Input', required: false })
  input: unknown;

  execute(): void {
    executedNodes.push(this.name);
  }
}

/**
 * Tracking node for switch branch verification.
 */
@defineNode({ type: 'test.switch-tracking', label: 'Switch Tracking', category: 'Test' })
class SwitchTrackingNode extends Node {
  name: string = '';

  @Input({ type: 'any', label: 'Input', required: false })
  input: unknown;

  execute(): void {
    executedNodes.push(this.name);
  }
}

describe('Conditional Flow Integration Tests', () => {
  let registry: NodeRegistry;

  beforeAll(() => {
    registry = NodeRegistry.getInstance();

    // Register test node types if not already registered
    if (!registry.has('test.value')) {
      registry.register(ValueNode);
    }
    if (!registry.has('test.collector')) {
      registry.register(CollectorNode);
    }
    if (!registry.has('flow.if')) {
      registry.register(IfNode);
    }
    if (!registry.has('flow.switch')) {
      registry.register(SwitchNode);
    }
    if (!registry.has('test.tracking-collector')) {
      registry.register(TrackingCollectorNode);
    }
    if (!registry.has('test.switch-tracking')) {
      registry.register(SwitchTrackingNode);
    }
  });

  beforeEach(() => {
    // Clear execution tracking before each test
    executedNodes = [];
  });

  describe('IfNode - True Path', () => {
    it('should execute then branch when condition is true', async () => {
      const workflow = new Workflow();

      // Create nodes
      const ifNode = workflow.addNode('flow.if');
      const thenCollector = workflow.addNode('test.collector');
      const elseCollector = workflow.addNode('test.collector');

      // Configure IfNode with true condition
      ifNode.condition = true;
      ifNode.value = 'then-data';

      // Connect both branches
      workflow.connect(ifNode.id, 'thenOutput', thenCollector.id, 'input');
      workflow.connect(ifNode.id, 'elseOutput', elseCollector.id, 'input');

      // Execute workflow
      const result = await workflow.execute();

      // Verify
      expect(result.status).toBe('success');
      expect(thenCollector.output).toBe('then-data');
      expect(elseCollector.output).toBeUndefined();
    });

    it('should flow data through then branch correctly', async () => {
      const workflow = new Workflow();

      // Create nodes: value -> if -> collector
      const valueNode = workflow.addNode('test.value');
      const ifNode = workflow.addNode('flow.if');
      const thenCollector = workflow.addNode('test.collector');

      // Configure
      valueNode.value = { count: 42 };
      ifNode.condition = true;

      // Connect: value -> if.data, if.then -> collector
      workflow.connect(valueNode.id, 'value', ifNode.id, 'value');
      workflow.connect(ifNode.id, 'thenOutput', thenCollector.id, 'input');

      // Execute
      const result = await workflow.execute();

      // Verify data flowed through
      expect(result.status).toBe('success');
      expect(thenCollector.output).toEqual({ count: 42 });
    });
  });

  describe('IfNode - False Path', () => {
    it('should execute else branch when condition is false', async () => {
      const workflow = new Workflow();

      // Create nodes
      const ifNode = workflow.addNode('flow.if');
      const thenCollector = workflow.addNode('test.collector');
      const elseCollector = workflow.addNode('test.collector');

      // Configure IfNode with false condition
      ifNode.condition = false;
      ifNode.value = 'else-data';

      // Connect both branches
      workflow.connect(ifNode.id, 'thenOutput', thenCollector.id, 'input');
      workflow.connect(ifNode.id, 'elseOutput', elseCollector.id, 'input');

      // Execute workflow
      const result = await workflow.execute();

      // Verify
      expect(result.status).toBe('success');
      expect(thenCollector.output).toBeUndefined();
      expect(elseCollector.output).toBe('else-data');
    });

    it('should flow data through else branch correctly', async () => {
      const workflow = new Workflow();

      // Create nodes: value -> if -> collector
      const valueNode = workflow.addNode('test.value');
      const ifNode = workflow.addNode('flow.if');
      const elseCollector = workflow.addNode('test.collector');

      // Configure
      valueNode.value = { count: 42 };
      ifNode.condition = false;

      // Connect: value -> if.data, if.else -> collector
      workflow.connect(valueNode.id, 'value', ifNode.id, 'value');
      workflow.connect(ifNode.id, 'elseOutput', elseCollector.id, 'input');

      // Execute
      const result = await workflow.execute();

      // Verify data flowed through
      expect(result.status).toBe('success');
      expect(elseCollector.output).toEqual({ count: 42 });
    });
  });

  describe('SwitchNode - Case Match', () => {
    it('should execute matching case branch', async () => {
      const workflow = new Workflow();

      // Create nodes
      const switchNode = workflow.addNode('flow.switch');
      const case0Collector = workflow.addNode('test.collector');
      const case1Collector = workflow.addNode('test.collector');
      const case2Collector = workflow.addNode('test.collector');
      const defaultCollector = workflow.addNode('test.collector');

      // Configure SwitchNode
      switchNode.value = 'orange';
      switchNode.cases = ['apple', 'orange', 'banana'];
      switchNode.data = 'case1-data';

      // Connect all branches
      workflow.connect(switchNode.id, 'case_0', case0Collector.id, 'input');
      workflow.connect(switchNode.id, 'case_1', case1Collector.id, 'input');
      workflow.connect(switchNode.id, 'case_2', case2Collector.id, 'input');
      workflow.connect(switchNode.id, 'default', defaultCollector.id, 'input');

      // Execute workflow
      const result = await workflow.execute();

      // Verify only case_1 executed
      expect(result.status).toBe('success');
      expect(case0Collector.output).toBeUndefined();
      expect(case1Collector.output).toBe('case1-data');
      expect(case2Collector.output).toBeUndefined();
      expect(defaultCollector.output).toBeUndefined();
    });

    it('should flow data through matching case correctly', async () => {
      const workflow = new Workflow();

      // Create nodes: value -> switch -> collector
      const valueNode = workflow.addNode('test.value');
      const switchNode = workflow.addNode('flow.switch');
      const case1Collector = workflow.addNode('test.collector');

      // Configure
      valueNode.value = { price: 2.5 };
      switchNode.value = 'orange';
      switchNode.cases = ['apple', 'orange', 'banana'];

      // Connect: value -> switch.data, switch.case_1 -> collector
      workflow.connect(valueNode.id, 'value', switchNode.id, 'data');
      workflow.connect(switchNode.id, 'case_1', case1Collector.id, 'input');

      // Execute
      const result = await workflow.execute();

      // Verify data flowed through
      expect(result.status).toBe('success');
      expect(case1Collector.output).toEqual({ price: 2.5 });
    });
  });

  describe('SwitchNode - Default Case', () => {
    it('should execute default branch when no case matches', async () => {
      const workflow = new Workflow();

      // Create nodes
      const switchNode = workflow.addNode('flow.switch');
      const case0Collector = workflow.addNode('test.collector');
      const case1Collector = workflow.addNode('test.collector');
      const defaultCollector = workflow.addNode('test.collector');

      // Configure SwitchNode with non-matching value
      switchNode.value = 'grape';
      switchNode.cases = ['apple', 'orange'];
      switchNode.data = 'default-data';

      // Connect all branches
      workflow.connect(switchNode.id, 'case_0', case0Collector.id, 'input');
      workflow.connect(switchNode.id, 'case_1', case1Collector.id, 'input');
      workflow.connect(switchNode.id, 'default', defaultCollector.id, 'input');

      // Execute workflow
      const result = await workflow.execute();

      // Verify only default executed
      expect(result.status).toBe('success');
      expect(case0Collector.output).toBeUndefined();
      expect(case1Collector.output).toBeUndefined();
      expect(defaultCollector.output).toBe('default-data');
    });

    it('should flow data through default branch correctly', async () => {
      const workflow = new Workflow();

      // Create nodes: value -> switch -> collector
      const valueNode = workflow.addNode('test.value');
      const switchNode = workflow.addNode('flow.switch');
      const defaultCollector = workflow.addNode('test.collector');

      // Configure
      valueNode.value = { price: 3.0 };
      switchNode.value = 'grape';
      switchNode.cases = ['apple', 'orange'];

      // Connect: value -> switch.data, switch.default -> collector
      workflow.connect(valueNode.id, 'value', switchNode.id, 'data');
      workflow.connect(switchNode.id, 'default', defaultCollector.id, 'input');

      // Execute
      const result = await workflow.execute();

      // Verify data flowed through
      expect(result.status).toBe('success');
      expect(defaultCollector.output).toEqual({ price: 3.0 });
    });
  });

  describe('Branch Isolation', () => {
    it('should only execute active branch in IfNode', async () => {
      const workflow = new Workflow();

      // Create nodes
      const ifNode = workflow.addNode('flow.if');
      const thenCollector = workflow.addNode('test.tracking-collector');
      const elseCollector = workflow.addNode('test.tracking-collector');

      // Name collectors for tracking
      thenCollector.name = 'then';
      elseCollector.name = 'else';

      // Configure
      ifNode.condition = true;

      // Connect both branches
      workflow.connect(ifNode.id, 'thenOutput', thenCollector.id, 'input');
      workflow.connect(ifNode.id, 'elseOutput', elseCollector.id, 'input');

      // Execute
      await workflow.execute();

      // Verify only then branch executed
      expect(executedNodes).toContain('then');
      expect(executedNodes).not.toContain('else');
    });

    it('should only execute active branch in SwitchNode', async () => {
      const workflow = new Workflow();

      // Create nodes
      const switchNode = workflow.addNode('flow.switch');
      const case0Collector = workflow.addNode('test.switch-tracking');
      const case1Collector = workflow.addNode('test.switch-tracking');
      const defaultCollector = workflow.addNode('test.switch-tracking');

      // Name collectors for tracking
      case0Collector.name = 'case_0';
      case1Collector.name = 'case_1';
      defaultCollector.name = 'default';

      // Configure - match case_1
      switchNode.value = 'b';
      switchNode.cases = ['a', 'b', 'c'];

      // Connect all branches
      workflow.connect(switchNode.id, 'case_0', case0Collector.id, 'input');
      workflow.connect(switchNode.id, 'case_1', case1Collector.id, 'input');
      workflow.connect(switchNode.id, 'default', defaultCollector.id, 'input');

      // Execute
      await workflow.execute();

      // Verify only case_1 branch executed
      expect(executedNodes).toContain('case_1');
      expect(executedNodes).not.toContain('case_0');
      expect(executedNodes).not.toContain('default');
    });
  });
});
