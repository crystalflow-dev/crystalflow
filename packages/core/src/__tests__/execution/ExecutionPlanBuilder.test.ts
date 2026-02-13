/**
 * ExecutionPlanBuilder unit tests
 */

import { ExecutionPlanBuilder } from '../../execution/ExecutionPlanBuilder';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { NodeRegistry } from '../../node/NodeRegistry';
import { defineNode, Input, Output } from '../../node/decorators';
import { ExecutionStepType, IConditionalNode } from '@crystalflow/types';

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
        'Cannot build execution plan: workflow has no entry nodes'
      );
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

  describe('getDownstreamNodesForPort (graph analysis)', () => {
    it('should find downstream nodes connected to a specific port', () => {
      const workflow = new Workflow('wf-1', 'Port Test');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const elseNode = workflow.addNode('test.math-add');

      // Connect thenOutput to thenNode
      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'input');

      // Connect elseOutput to elseNode
      workflow.connect(conditionalNode.id, 'elseOutput', elseNode.id, 'a');

      const builder = new ExecutionPlanBuilder();

      // Access private method via any cast for testing
      const getDownstream = (builder as any).getDownstreamNodesForPort.bind(builder);

      const thenDownstream = getDownstream(conditionalNode.id, 'thenOutput', workflow);
      const elseDownstream = getDownstream(conditionalNode.id, 'elseOutput', workflow);

      expect(thenDownstream).toHaveLength(1);
      expect(thenDownstream).toContain(thenNode.id);

      expect(elseDownstream).toHaveLength(1);
      expect(elseDownstream).toContain(elseNode.id);
    });

    it('should return empty array when no nodes connected to port', () => {
      const workflow = new Workflow('wf-1', 'Empty Port Test');
      const conditionalNode = workflow.addNode('test.conditional');

      const builder = new ExecutionPlanBuilder();
      const getDownstream = (builder as any).getDownstreamNodesForPort.bind(builder);

      const downstream = getDownstream(conditionalNode.id, 'thenOutput', workflow);

      expect(downstream).toHaveLength(0);
      expect(downstream).toEqual([]);
    });

    it('should handle multiple nodes connected to same port', () => {
      const workflow = new Workflow('wf-1', 'Multiple Connections Test');
      const conditionalNode = workflow.addNode('test.conditional');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.math-add');

      // Connect thenOutput to multiple nodes
      workflow.connect(conditionalNode.id, 'thenOutput', node1.id, 'input');
      workflow.connect(conditionalNode.id, 'thenOutput', node2.id, 'input');
      workflow.connect(conditionalNode.id, 'thenOutput', node3.id, 'a');

      const builder = new ExecutionPlanBuilder();
      const getDownstream = (builder as any).getDownstreamNodesForPort.bind(builder);

      const downstream = getDownstream(conditionalNode.id, 'thenOutput', workflow);

      expect(downstream).toHaveLength(3);
      expect(downstream).toContain(node1.id);
      expect(downstream).toContain(node2.id);
      expect(downstream).toContain(node3.id);
    });

    it('should only return nodes for specified port, not other ports', () => {
      const workflow = new Workflow('wf-1', 'Port Specificity Test');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const elseNode = workflow.addNode('test.math-add');

      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'input');
      workflow.connect(conditionalNode.id, 'elseOutput', elseNode.id, 'a');

      const builder = new ExecutionPlanBuilder();
      const getDownstream = (builder as any).getDownstreamNodesForPort.bind(builder);

      // Should only return thenNode, not elseNode
      const thenDownstream = getDownstream(conditionalNode.id, 'thenOutput', workflow);
      expect(thenDownstream).toEqual([thenNode.id]);
      expect(thenDownstream).not.toContain(elseNode.id);

      // Should only return elseNode, not thenNode
      const elseDownstream = getDownstream(conditionalNode.id, 'elseOutput', workflow);
      expect(elseDownstream).toEqual([elseNode.id]);
      expect(elseDownstream).not.toContain(thenNode.id);
    });
  });

  describe('buildConditionalStep', () => {
    it('should create ConditionalStep structure for conditional node', () => {
      const workflow = new Workflow('wf-1', 'Conditional Test');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const elseNode = workflow.addNode('test.math-add');

      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'input');
      workflow.connect(conditionalNode.id, 'elseOutput', elseNode.id, 'a');

      const builder = new ExecutionPlanBuilder();
      const buildConditional = (builder as any).buildConditionalStep.bind(builder);

      const node = workflow.nodes.get(conditionalNode.id);
      const step = buildConditional(node, workflow, new Set());

      expect(step).toBeDefined();
      expect(step.type).toBe(ExecutionStepType.Conditional);
      expect(step.nodeId).toBe(conditionalNode.id);
      expect(step.branches).toHaveLength(2); // thenOutput and elseOutput
    });

    it('should build execution steps for each branch', () => {
      const workflow = new Workflow('wf-1', 'Branch Steps Test');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const elseNode = workflow.addNode('test.math-add');

      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'input');
      workflow.connect(conditionalNode.id, 'elseOutput', elseNode.id, 'a');

      const builder = new ExecutionPlanBuilder();
      const buildConditional = (builder as any).buildConditionalStep.bind(builder);

      const node = workflow.nodes.get(conditionalNode.id);
      const step = buildConditional(node, workflow, new Set());

      // Find the branches
      const thenBranch = step.branches.find((b: any) => b.id === 'thenOutput');
      const elseBranch = step.branches.find((b: any) => b.id === 'elseOutput');

      expect(thenBranch).toBeDefined();
      expect(thenBranch.steps).toHaveLength(1);
      expect(thenBranch.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      expect(thenBranch.steps[0].nodeId).toBe(thenNode.id);

      expect(elseBranch).toBeDefined();
      expect(elseBranch.steps).toHaveLength(1);
      expect(elseBranch.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      expect(elseBranch.steps[0].nodeId).toBe(elseNode.id);
    });

    it('should handle branches with no downstream nodes', () => {
      const workflow = new Workflow('wf-1', 'Empty Branch Test');
      const conditionalNode = workflow.addNode('test.conditional');

      const builder = new ExecutionPlanBuilder();
      const buildConditional = (builder as any).buildConditionalStep.bind(builder);

      const node = workflow.nodes.get(conditionalNode.id);
      const step = buildConditional(node, workflow, new Set());

      expect(step.branches).toHaveLength(2);
      step.branches.forEach((branch: any) => {
        expect(branch.steps).toEqual([]);
      });
    });

    it('should handle nested conditional nodes (recursive building)', () => {
      const workflow = new Workflow('wf-1', 'Nested Conditional Test');
      const outerConditional = workflow.addNode('test.conditional');
      const innerConditional = workflow.addNode('test.conditional');
      const leafNode = workflow.addNode('test.simple');

      // Outer then -> Inner conditional
      workflow.connect(outerConditional.id, 'thenOutput', innerConditional.id, 'condition');
      // Inner then -> Leaf node
      workflow.connect(innerConditional.id, 'thenOutput', leafNode.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const buildConditional = (builder as any).buildConditionalStep.bind(builder);

      const node = workflow.nodes.get(outerConditional.id);
      const step = buildConditional(node, workflow, new Set());

      // Outer conditional should have branches
      const thenBranch = step.branches.find((b: any) => b.id === 'thenOutput');
      expect(thenBranch).toBeDefined();
      expect(thenBranch.steps).toHaveLength(1);

      // The branch should contain another ConditionalStep (nested)
      const innerStep = thenBranch.steps[0];
      expect(innerStep.type).toBe(ExecutionStepType.Conditional);
      expect(innerStep.nodeId).toBe(innerConditional.id);
      expect(innerStep.branches).toHaveLength(2);

      // Inner conditional's then branch should have the leaf node
      const innerThenBranch = innerStep.branches.find((b: any) => b.id === 'thenOutput');
      expect(innerThenBranch.steps).toHaveLength(1);
      expect(innerThenBranch.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      expect(innerThenBranch.steps[0].nodeId).toBe(leafNode.id);
    });

    it('should throw error if conditional node has no outputs', () => {
      // Create a mock conditional node with no outputs
      const workflow = new Workflow('wf-1', 'No Outputs Test');
      const node = workflow.addNode('test.simple'); // Regular node, not conditional

      // Manually make it conditional but with no outputs (invalid)
      (node as any).evaluateCondition = () => 'branch';
      (node as any).getOutputs = () => [];

      const builder = new ExecutionPlanBuilder();
      const buildConditional = (builder as any).buildConditionalStep.bind(builder);

      expect(() => {
        buildConditional(node, workflow, new Set());
      }).toThrow('has no output ports - cannot build branches');
    });

    it('should include branch labels from output port labels', () => {
      const workflow = new Workflow('wf-1', 'Branch Label Test');
      const conditionalNode = workflow.addNode('test.conditional');

      const builder = new ExecutionPlanBuilder();
      const buildConditional = (builder as any).buildConditionalStep.bind(builder);

      const node = workflow.nodes.get(conditionalNode.id);
      const step = buildConditional(node, workflow, new Set());

      const thenBranch = step.branches.find((b: any) => b.id === 'thenOutput');
      const elseBranch = step.branches.find((b: any) => b.id === 'elseOutput');

      expect(thenBranch.label).toBe('Then');
      expect(elseBranch.label).toBe('Else');
    });
  });

  describe('buildStepsForNode', () => {
    it('should build steps for a single node', () => {
      const workflow = new Workflow('wf-1', 'Single Node Steps');
      const node = workflow.addNode('test.simple');

      const builder = new ExecutionPlanBuilder();
      const buildSteps = (builder as any).buildStepsForNode.bind(builder);

      const steps = buildSteps(node.id, workflow, new Set());

      expect(steps).toHaveLength(1);
      expect(steps[0].type).toBe(ExecutionStepType.NodeExecution);
      expect(steps[0].nodeId).toBe(node.id);
    });

    it('should recursively build steps for connected nodes', () => {
      const workflow = new Workflow('wf-1', 'Connected Nodes');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.math-add');
      const node3 = workflow.addNode('test.simple');

      workflow.connect(node1.id, 'output', node2.id, 'a');
      workflow.connect(node2.id, 'result', node3.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const buildSteps = (builder as any).buildStepsForNode.bind(builder);

      const steps = buildSteps(node1.id, workflow, new Set());

      expect(steps).toHaveLength(3);
      expect(steps[0].nodeId).toBe(node1.id);
      expect(steps[1].nodeId).toBe(node2.id);
      expect(steps[2].nodeId).toBe(node3.id);
    });

    it('should handle conditional nodes by building ConditionalStep', () => {
      const workflow = new Workflow('wf-1', 'Conditional Node Steps');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');

      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const buildSteps = (builder as any).buildStepsForNode.bind(builder);

      const steps = buildSteps(conditionalNode.id, workflow, new Set());

      expect(steps).toHaveLength(1);
      expect(steps[0].type).toBe(ExecutionStepType.Conditional);
      expect(steps[0].nodeId).toBe(conditionalNode.id);
      expect(steps[0].branches).toHaveLength(2);

      // Check that the then branch has the downstream node
      const thenBranch = steps[0].branches.find((b: any) => b.id === 'thenOutput');
      expect(thenBranch.steps).toHaveLength(1);
      expect(thenBranch.steps[0].nodeId).toBe(thenNode.id);
    });

    it('should prevent infinite recursion with cycle detection', () => {
      const workflow = new Workflow('wf-1', 'Cycle Detection');
      const node1 = workflow.addNode('test.simple');
      const visited = new Set<string>();
      visited.add(node1.id);

      const builder = new ExecutionPlanBuilder();
      const buildSteps = (builder as any).buildStepsForNode.bind(builder);

      const steps = buildSteps(node1.id, workflow, visited);

      // Should return empty array since node is already visited
      expect(steps).toEqual([]);
    });

    it('should throw error if node not found', () => {
      const workflow = new Workflow('wf-1', 'Missing Node');

      const builder = new ExecutionPlanBuilder();
      const buildSteps = (builder as any).buildStepsForNode.bind(builder);

      expect(() => {
        buildSteps('non-existent-node', workflow, new Set());
      }).toThrow('Node non-existent-node not found in workflow');
    });

    it('should handle multiple downstream nodes from different output ports', () => {
      const workflow = new Workflow('wf-1', 'Multiple Outputs');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.simple');

      // Add a second output to node1 for testing
      const outputs = node1.getOutputs();
      if (outputs.length > 0) {
        workflow.connect(node1.id, outputs[0].id, node2.id, 'input');
        workflow.connect(node1.id, outputs[0].id, node3.id, 'input');
      }

      const builder = new ExecutionPlanBuilder();
      const buildSteps = (builder as any).buildStepsForNode.bind(builder);

      const steps = buildSteps(node1.id, workflow, new Set());

      // Should have node1 + both downstream nodes
      expect(steps.length).toBeGreaterThan(1);
      expect(steps[0].nodeId).toBe(node1.id);
    });
  });

  describe('build - conditional workflow integration', () => {
    it('should build plan with conditional node using buildStepsForNode', () => {
      const workflow = new Workflow('wf-1', 'Simple Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const elseNode = workflow.addNode('test.math-add');

      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'input');
      workflow.connect(conditionalNode.id, 'elseOutput', elseNode.id, 'a');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      // Should have 1 ConditionalStep (which contains nested NodeExecutionSteps in branches)
      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].type).toBe(ExecutionStepType.Conditional);

      const conditionalStep = plan.steps[0];
      if (conditionalStep.type === ExecutionStepType.Conditional) {
        expect(conditionalStep.nodeId).toBe(conditionalNode.id);
        expect(conditionalStep.branches).toHaveLength(2);

        // Check then branch
        const thenBranch = conditionalStep.branches.find((b) => b.id === 'thenOutput');
        expect(thenBranch).toBeDefined();
        expect(thenBranch!.steps).toHaveLength(1);
        expect(thenBranch!.steps[0].type).toBe(ExecutionStepType.NodeExecution);

        // Check else branch
        const elseBranch = conditionalStep.branches.find((b) => b.id === 'elseOutput');
        expect(elseBranch).toBeDefined();
        expect(elseBranch!.steps).toHaveLength(1);
        expect(elseBranch!.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      }
    });

    it('should build plan with mixed regular and conditional nodes', () => {
      const workflow = new Workflow('wf-1', 'Mixed Workflow');
      const inputNode = workflow.addNode('test.simple');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.math-add');
      const elseNode = workflow.addNode('test.simple');

      // Regular node -> Conditional node
      workflow.connect(inputNode.id, 'output', conditionalNode.id, 'condition');
      // Conditional branches
      workflow.connect(conditionalNode.id, 'thenOutput', thenNode.id, 'a');
      workflow.connect(conditionalNode.id, 'elseOutput', elseNode.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      // Should have 2 steps: InputNode (regular), ConditionalNode (with branches)
      expect(plan.steps).toHaveLength(2);
      expect(plan.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      if (plan.steps[0].type === ExecutionStepType.NodeExecution) {
        expect(plan.steps[0].nodeId).toBe(inputNode.id);
      }
      expect(plan.steps[1].type).toBe(ExecutionStepType.Conditional);
      if (plan.steps[1].type === ExecutionStepType.Conditional) {
        expect(plan.steps[1].nodeId).toBe(conditionalNode.id);
      }
    });

    it('should build plan with nested conditional nodes', () => {
      const workflow = new Workflow('wf-1', 'Nested Conditionals');
      const outerConditional = workflow.addNode('test.conditional');
      const innerConditional = workflow.addNode('test.conditional');
      const leafNode = workflow.addNode('test.simple');

      // Outer then -> Inner conditional
      workflow.connect(outerConditional.id, 'thenOutput', innerConditional.id, 'condition');
      // Inner then -> Leaf node
      workflow.connect(innerConditional.id, 'thenOutput', leafNode.id, 'input');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      // Should have 1 outer ConditionalStep
      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].type).toBe(ExecutionStepType.Conditional);

      const outerStep = plan.steps[0];
      if (outerStep.type === ExecutionStepType.Conditional) {
        const thenBranch = outerStep.branches.find((b) => b.id === 'thenOutput');
        expect(thenBranch).toBeDefined();
        expect(thenBranch!.steps).toHaveLength(1);

        // Then branch should contain another ConditionalStep
        const innerStep = thenBranch!.steps[0];
        expect(innerStep.type).toBe(ExecutionStepType.Conditional);

        if (innerStep.type === ExecutionStepType.Conditional) {
          const innerThenBranch = innerStep.branches.find((b) => b.id === 'thenOutput');
          expect(innerThenBranch).toBeDefined();
          expect(innerThenBranch!.steps).toHaveLength(1);
          expect(innerThenBranch!.steps[0].type).toBe(ExecutionStepType.NodeExecution);
          if (innerThenBranch!.steps[0].type === ExecutionStepType.NodeExecution) {
            expect(innerThenBranch!.steps[0].nodeId).toBe(leafNode.id);
          }
        }
      }
    });

    it('should handle workflow with conditional node and no downstream connections', () => {
      const workflow = new Workflow('wf-1', 'Empty Branches');
      workflow.addNode('test.conditional');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].type).toBe(ExecutionStepType.Conditional);

      const conditionalStep = plan.steps[0];
      if (conditionalStep.type === ExecutionStepType.Conditional) {
        expect(conditionalStep.branches).toHaveLength(2);
        conditionalStep.branches.forEach((branch) => {
          expect(branch.steps).toEqual([]);
        });
      }
    });

    it('should build plan with conditional node in middle of workflow chain', () => {
      const workflow = new Workflow('wf-1', 'Conditional in Middle');
      const input = workflow.addNode('test.simple');
      const conditional = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const output = workflow.addNode('test.math-add');

      // Input -> Conditional
      workflow.connect(input.id, 'output', conditional.id, 'condition');
      // Then branch -> Output
      workflow.connect(conditional.id, 'thenOutput', thenNode.id, 'input');
      workflow.connect(thenNode.id, 'output', output.id, 'a');

      const builder = new ExecutionPlanBuilder();
      const plan = builder.build(workflow);

      // Input (regular), Conditional (with then branch containing thenNode and output)
      expect(plan.steps).toHaveLength(2);
      expect(plan.steps[0].type).toBe(ExecutionStepType.NodeExecution);
      if (plan.steps[0].type === ExecutionStepType.NodeExecution) {
        expect(plan.steps[0].nodeId).toBe(input.id);
      }
      expect(plan.steps[1].type).toBe(ExecutionStepType.Conditional);

      const conditionalStep = plan.steps[1];
      if (conditionalStep.type === ExecutionStepType.Conditional) {
        const thenBranch = conditionalStep.branches.find((b) => b.id === 'thenOutput');
        expect(thenBranch!.steps).toHaveLength(2);

        if (thenBranch!.steps[0].type === ExecutionStepType.NodeExecution) {
          expect(thenBranch!.steps[0].nodeId).toBe(thenNode.id);
        }
        if (thenBranch!.steps[1].type === ExecutionStepType.NodeExecution) {
          expect(thenBranch!.steps[1].nodeId).toBe(output.id);
        }
      }
    });
  });
});
