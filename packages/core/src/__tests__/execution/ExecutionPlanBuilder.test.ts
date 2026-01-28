/**
 * ExecutionPlanBuilder unit tests
 */

import { ExecutionPlanBuilder } from '../../execution/ExecutionPlanBuilder';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { NodeRegistry } from '../../node/NodeRegistry';
import { defineNode, Input, Output } from '../../node/decorators';
import { ExecutionStepType, IConditionalNode } from '@reactflo/types';

// Test node classes
@defineNode({
  type: 'test.simple',
  label: 'Simple Test Node',
  category: 'Test',
})
class SimpleTestNode extends Node {
  @Input({ type: 'any', label: 'Input' })
  input: any;

  @Output({ type: 'any', label: 'Output' })
  output: any;

  execute() {
    this.output = this.input;
  }
}

@defineNode({
  type: 'test.math-add',
  label: 'Add Numbers',
  category: 'Test',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result: number = 0;

  execute() {
    this.result = this.a + this.b;
  }
}

// Test conditional node
@defineNode({
  type: 'test.conditional',
  label: 'Test Conditional',
  category: 'Test',
})
class TestConditionalNode extends Node implements IConditionalNode {
  @Input({ type: 'boolean', label: 'Condition' })
  condition: boolean = false;

  @Output({ type: 'any', label: 'Then' })
  thenOutput: any;

  @Output({ type: 'any', label: 'Else' })
  elseOutput: any;

  execute() {
    // Set outputs based on condition
  }

  evaluateCondition(): string {
    return this.condition ? 'thenOutput' : 'elseOutput';
  }
}

describe('ExecutionPlanBuilder', () => {
  let registry: NodeRegistry;

  beforeAll(() => {
    registry = NodeRegistry.getInstance();

    // Register nodes only if not already registered
    if (!registry.has('test.simple')) {
      registry.register(SimpleTestNode);
    }
    if (!registry.has('test.math-add')) {
      registry.register(AddNode);
    }
    if (!registry.has('test.conditional')) {
      registry.register(TestConditionalNode);
    }
  });

  describe('constructor', () => {
    it('should create builder with default options', () => {
      const builder = new ExecutionPlanBuilder();
      const options = builder.getOptions();

      expect(options.entryPointStrategy).toBe('sequential');
      expect(options.stepIdPrefix).toBe('step');
    });

    it('should create builder with custom options', () => {
      const builder = new ExecutionPlanBuilder({
        entryPointStrategy: 'parallel',
        stepIdPrefix: 'custom',
      });
      const options = builder.getOptions();

      expect(options.entryPointStrategy).toBe('parallel');
      expect(options.stepIdPrefix).toBe('custom');
    });
  });

  describe('build - single node workflow', () => {
    it('should build plan for single node', () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      const node = workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      if (plan.steps[0].type === ExecutionStepType.NodeExecution) {
        expect(plan.steps[0].nodeId).toBe(node.id);
      }
      expect(plan.getTotalStepCount()).toBe(1);
      expect(plan.getNodeCount()).toBe(1);
    });

    it('should include node type in step', () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      const step = plan.steps[0];
      if (step.type === ExecutionStepType.NodeExecution) {
        expect(step.nodeType).toBe('test.simple');
      }
    });

    it('should include metadata in step', () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      const step = plan.steps[0];
      expect(step.metadata).toBeDefined();
      expect(step.metadata?.nodeName).toBeDefined();
    });
  });

  describe('build - linear workflow', () => {
    it('should build plan for linear workflow (2 nodes)', () => {
      const workflow = new Workflow('wf-1', 'Linear 2');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      workflow.connect(node1.id, 'output', node2.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(2);
      expect(plan.getTotalStepCount()).toBe(2);
      expect(plan.getNodeCount()).toBe(2);
    });

    it('should build plan for linear workflow (5 nodes)', () => {
      const workflow = new Workflow('wf-1', 'Linear 5');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.simple');
      const node4 = workflow.addNode('test.simple');
      const node5 = workflow.addNode('test.simple');

      workflow.connect(node1.id, 'output', node2.id, 'input');
      workflow.connect(node2.id, 'output', node3.id, 'input');
      workflow.connect(node3.id, 'output', node4.id, 'input');
      workflow.connect(node4.id, 'output', node5.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(5);
      expect(plan.getTotalStepCount()).toBe(5);
      expect(plan.getNodeCount()).toBe(5);

      // Verify execution order (topological)
      const steps = plan.steps;
      if (
        steps[0].type === ExecutionStepType.NodeExecution &&
        steps[1].type === ExecutionStepType.NodeExecution &&
        steps[2].type === ExecutionStepType.NodeExecution &&
        steps[3].type === ExecutionStepType.NodeExecution &&
        steps[4].type === ExecutionStepType.NodeExecution
      ) {
        expect(steps[0].nodeId).toBe(node1.id);
        expect(steps[1].nodeId).toBe(node2.id);
        expect(steps[2].nodeId).toBe(node3.id);
        expect(steps[3].nodeId).toBe(node4.id);
        expect(steps[4].nodeId).toBe(node5.id);
      }
    });

    it('should respect topological order', () => {
      const workflow = new Workflow('wf-1', 'Topological');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.simple');

      // Create dependencies: 1 → 3, 2 → 3
      workflow.connect(node1.id, 'output', node3.id, 'input');
      workflow.connect(node2.id, 'output', node3.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(3);

      // node3 should come after both node1 and node2
      const steps = plan.steps;
      const node1Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === node1.id
      );
      const node2Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === node2.id
      );
      const node3Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === node3.id
      );

      expect(node3Index).toBeGreaterThan(node1Index);
      expect(node3Index).toBeGreaterThan(node2Index);
    });
  });

  describe('build - step IDs', () => {
    it('should generate unique step IDs', () => {
      const workflow = new Workflow('wf-1', 'Multi Node');
      workflow.addNode('test.simple');
      workflow.addNode('test.simple');
      workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      const stepIds = plan.steps.map((s) => s.id);
      const uniqueIds = new Set(stepIds);

      expect(uniqueIds.size).toBe(stepIds.length);
    });

    it('should use default step ID prefix', () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps[0].id).toMatch(/^step-\d+$/);
    });

    it('should use custom step ID prefix', () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder({
        stepIdPrefix: 'custom',
      });
      const plan = builder.build(workflow);

      expect(plan.steps[0].id).toMatch(/^custom-\d+$/);
    });

    it('should reset step counter for each build', () => {
      const builder = new ExecutionPlanBuilder();

      // First build
      const workflow1 = new Workflow('wf-1', 'First');
      workflow1.addNode('test.simple');
      const plan1 = builder.build(workflow1);

      // Second build
      const workflow2 = new Workflow('wf-2', 'Second');
      workflow2.addNode('test.simple');
      const plan2 = builder.build(workflow2);

      // Both should start with step-1
      expect(plan1.steps[0].id).toBe('step-1');
      expect(plan2.steps[0].id).toBe('step-1');
    });
  });

  describe('build - validation', () => {
    it('should throw error for empty workflow', () => {
      const workflow = new Workflow('wf-1', 'Empty');

      const builder = new ExecutionPlanBuilder();

      expect(() => builder.build(workflow)).toThrow(
        'Cannot build execution plan: workflow has no nodes'
      );
    });

    it('should throw error for workflow with cycles', () => {
      const workflow = new Workflow('wf-1', 'Cycle');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');

      // Create cycle: 1 → 2 → 1
      workflow.connect(node1.id, 'output', node2.id, 'input');
      workflow.connect(node2.id, 'output', node1.id, 'input');

      const builder = new ExecutionPlanBuilder();

      expect(() => builder.build(workflow)).toThrow(
        'Cannot build execution plan: workflow validation failed'
      );
      expect(() => builder.build(workflow)).toThrow('circular dependencies');
    });

    it('should validate all node references', () => {
      const workflow = new Workflow('wf-1', 'Valid');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      workflow.connect(node1.id, 'output', node2.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      // All steps should reference existing nodes
      for (const step of plan.steps) {
        if (step.type === ExecutionStepType.NodeExecution) {
          expect(workflow.nodes.has(step.nodeId)).toBe(true);
        }
      }
    });
  });

  describe('build - complex workflows', () => {
    it('should handle fan-out pattern', () => {
      const workflow = new Workflow('wf-1', 'Fan Out');
      const source = workflow.addNode('test.simple');
      const target1 = workflow.addNode('test.simple');
      const target2 = workflow.addNode('test.simple');
      const target3 = workflow.addNode('test.simple');

      // One source, three targets
      workflow.connect(source.id, 'output', target1.id, 'input');
      workflow.connect(source.id, 'output', target2.id, 'input');
      workflow.connect(source.id, 'output', target3.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(4);
      expect(plan.getNodeCount()).toBe(4);

      // Source should come first
      if (plan.steps[0].type === ExecutionStepType.NodeExecution) {
        expect(plan.steps[0].nodeId).toBe(source.id);
      }
    });

    it('should handle diamond pattern', () => {
      const workflow = new Workflow('wf-1', 'Diamond');
      const start = workflow.addNode('test.simple');
      const middle1 = workflow.addNode('test.simple');
      const middle2 = workflow.addNode('test.simple');
      const end = workflow.addNode('test.simple');

      // Diamond: start → middle1 → end, start → middle2 → end
      workflow.connect(start.id, 'output', middle1.id, 'input');
      workflow.connect(start.id, 'output', middle2.id, 'input');
      workflow.connect(middle1.id, 'output', end.id, 'input');
      workflow.connect(middle2.id, 'output', end.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(4);

      const steps = plan.steps;
      const startIndex = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === start.id
      );
      const middle1Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === middle1.id
      );
      const middle2Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === middle2.id
      );
      const endIndex = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && s.nodeId === end.id
      );

      // Start before middles
      expect(middle1Index).toBeGreaterThan(startIndex);
      expect(middle2Index).toBeGreaterThan(startIndex);

      // End after middles
      expect(endIndex).toBeGreaterThan(middle1Index);
      expect(endIndex).toBeGreaterThan(middle2Index);
    });
  });

  describe('setOptions', () => {
    it('should update options', () => {
      const builder = new ExecutionPlanBuilder({
        entryPointStrategy: 'sequential',
        stepIdPrefix: 'initial',
      });

      builder.setOptions({
        stepIdPrefix: 'updated',
      });

      const options = builder.getOptions();
      expect(options.entryPointStrategy).toBe('sequential');
      expect(options.stepIdPrefix).toBe('updated');
    });

    it('should affect subsequent builds', () => {
      const builder = new ExecutionPlanBuilder({
        stepIdPrefix: 'first',
      });

      const workflow = new Workflow('wf-1', 'Test');
      workflow.addNode('test.simple');

      const plan1 = builder.build(workflow);
      expect(plan1.steps[0].id).toBe('first-1');

      builder.setOptions({ stepIdPrefix: 'second' });
      const plan2 = builder.build(workflow);
      expect(plan2.steps[0].id).toBe('second-1');
    });
  });

  describe('metadata', () => {
    it('should not have conditional flags for simple workflows', () => {
      const workflow = new Workflow('wf-1', 'Simple');
      workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.hasConditionals()).toBe(false);
      expect(plan.hasLoops()).toBe(false);
      expect(plan.hasParallel()).toBe(false);
    });
  });

  describe('getBreakpoints', () => {
    it('should return all node IDs as potential breakpoints', () => {
      const workflow = new Workflow('wf-1', 'Multi Node');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.simple');

      workflow.connect(node1.id, 'output', node2.id, 'input');
      workflow.connect(node2.id, 'output', node3.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      const breakpoints = plan.getBreakpoints();
      expect(breakpoints).toHaveLength(3);
      expect(breakpoints).toContain(node1.id);
      expect(breakpoints).toContain(node2.id);
      expect(breakpoints).toContain(node3.id);
    });
  });

  describe('isConditionalNode', () => {
    it('should return true for nodes implementing IConditionalNode', () => {
      const workflow = new Workflow('wf-1', 'Conditional Test');
      const conditionalNode = workflow.addNode('test.conditional');

      const builder = new ExecutionPlanBuilder();
      const node = workflow.nodes.get(conditionalNode.id);

      expect(node).toBeDefined();
      expect(builder.isConditionalNode(node!)).toBe(true);
    });

    it('should return false for regular nodes', () => {
      const workflow = new Workflow('wf-1', 'Regular Test');
      const regularNode = workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const node = workflow.nodes.get(regularNode.id);

      expect(node).toBeDefined();
      expect(builder.isConditionalNode(node!)).toBe(false);
    });

    it('should return false for nodes without evaluateCondition method', () => {
      const workflow = new Workflow('wf-1', 'Math Test');
      const mathNode = workflow.addNode('test.math-add');

      const builder = new ExecutionPlanBuilder();
      const node = workflow.nodes.get(mathNode.id);

      expect(node).toBeDefined();
      expect(builder.isConditionalNode(node!)).toBe(false);
    });

    it('should allow type narrowing when true', () => {
      const workflow = new Workflow('wf-1', 'Type Guard Test');
      const conditionalNode = workflow.addNode('test.conditional');

      const builder = new ExecutionPlanBuilder();
      const node = workflow.nodes.get(conditionalNode.id);

      if (node && builder.isConditionalNode(node)) {
        // TypeScript should recognize this as IConditionalNode
        const result = node.evaluateCondition();
        expect(typeof result).toBe('string');
        expect(['thenOutput', 'elseOutput']).toContain(result);
      }
    });

    it('should correctly identify mixed workflow nodes', () => {
      const workflow = new Workflow('wf-1', 'Mixed Test');
      const simpleNode = workflow.addNode('test.simple');
      const conditionalNode = workflow.addNode('test.conditional');
      const mathNode = workflow.addNode('test.math-add');

      const builder = new ExecutionPlanBuilder();

      const simple = workflow.nodes.get(simpleNode.id);
      const conditional = workflow.nodes.get(conditionalNode.id);
      const math = workflow.nodes.get(mathNode.id);

      expect(builder.isConditionalNode(simple!)).toBe(false);
      expect(builder.isConditionalNode(conditional!)).toBe(true);
      expect(builder.isConditionalNode(math!)).toBe(false);
    });
  });
});
