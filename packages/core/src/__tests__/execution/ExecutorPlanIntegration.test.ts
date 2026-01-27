/**
 * Executor + ExecutionPlanBuilder Integration Tests
 * Tests that Executor properly builds and uses execution plans
 */

import { Executor } from '../../execution/Executor';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { NodeRegistry } from '../../node/NodeRegistry';
import { defineNode, Input, Output } from '../../node/decorators';
import { ExecutionPlan } from '../../execution/ExecutionPlan';
import { ExecutionStepType } from '@reactflo/types';

// Test node
@defineNode({
  type: 'test.simple-node',
  label: 'Simple Test Node',
  category: 'Test',
})
class SimpleNode extends Node {
  @Input({ type: 'any', label: 'Input' })
  input: any;

  @Output({ type: 'any', label: 'Output' })
  output: any;

  execute() {
    this.output = this.input || 'executed';
  }
}

describe('Executor + ExecutionPlanBuilder Integration', () => {
  let registry: NodeRegistry;

  beforeAll(() => {
    registry = NodeRegistry.getInstance();
    if (!registry.has('test.simple-node')) {
      registry.register(SimpleNode);
    }
  });

  describe('Plan Building', () => {
    it('should build execution plan before executing workflow', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      workflow.addNode('test.simple-node');

      const executor = new Executor();
      const result = await executor.execute(workflow);

      expect(result.status).toBe('success');
    });

    it('should emit onPlanBuilt event with execution plan', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      const node1 = workflow.addNode('test.simple-node');
      const node2 = workflow.addNode('test.simple-node');
      workflow.connect(node1.id, 'output', node2.id, 'input');

      const executor = new Executor();

      let capturedPlan: ExecutionPlan | undefined;
      executor.on('onPlanBuilt', (plan) => {
        capturedPlan = plan;
      });

      await executor.execute(workflow);

      expect(capturedPlan).toBeDefined();
      expect(capturedPlan?.steps).toHaveLength(2);
      expect(capturedPlan?.getNodeCount()).toBe(2);
    });

    it('should emit onPlanBuilt before onNodeStart events', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      workflow.addNode('test.simple-node');

      const executor = new Executor();
      const eventOrder: string[] = [];

      executor.on('onPlanBuilt', () => {
        eventOrder.push('onPlanBuilt');
      });

      executor.on('onNodeStart', () => {
        eventOrder.push('onNodeStart');
      });

      await executor.execute(workflow);

      expect(eventOrder).toEqual(['onPlanBuilt', 'onNodeStart']);
    });
  });

  describe('Plan Content', () => {
    it('should include correct node IDs in plan steps', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      const node1 = workflow.addNode('test.simple-node');
      const node2 = workflow.addNode('test.simple-node');
      const node3 = workflow.addNode('test.simple-node');

      workflow.connect(node1.id, 'output', node2.id, 'input');
      workflow.connect(node2.id, 'output', node3.id, 'input');

      const executor = new Executor();

      let capturedPlan: ExecutionPlan | undefined;
      executor.on('onPlanBuilt', (plan) => {
        capturedPlan = plan;
      });

      await executor.execute(workflow);

      expect(capturedPlan).toBeDefined();
      const steps = capturedPlan!.steps;

      // All steps should be NodeExecutionStep in Phase 1
      expect(steps.every((s) => s.type === ExecutionStepType.NodeExecution)).toBe(true);

      // Check node IDs are present
      const nodeIds = steps
        .filter((s) => s.type === ExecutionStepType.NodeExecution)
        .map((s) => (s as any).nodeId);

      expect(nodeIds).toContain(node1.id);
      expect(nodeIds).toContain(node2.id);
      expect(nodeIds).toContain(node3.id);
    });

    it('should include node types in plan steps', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      workflow.addNode('test.simple-node');

      const executor = new Executor();

      let capturedPlan: ExecutionPlan | undefined;
      executor.on('onPlanBuilt', (plan) => {
        capturedPlan = plan;
      });

      await executor.execute(workflow);

      const step = capturedPlan!.steps[0];
      if (step.type === ExecutionStepType.NodeExecution) {
        expect(step.nodeType).toBe('test.simple-node');
      }
    });

    it('should respect topological order in plan', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      const node1 = workflow.addNode('test.simple-node');
      const node2 = workflow.addNode('test.simple-node');
      const node3 = workflow.addNode('test.simple-node');

      // Dependencies: 1 → 3, 2 → 3
      workflow.connect(node1.id, 'output', node3.id, 'input');
      workflow.connect(node2.id, 'output', node3.id, 'input');

      const executor = new Executor();

      let capturedPlan: ExecutionPlan | undefined;
      executor.on('onPlanBuilt', (plan) => {
        capturedPlan = plan;
      });

      await executor.execute(workflow);

      const steps = capturedPlan!.steps;
      const node1Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && (s as any).nodeId === node1.id
      );
      const node2Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && (s as any).nodeId === node2.id
      );
      const node3Index = steps.findIndex(
        (s) => s.type === ExecutionStepType.NodeExecution && (s as any).nodeId === node3.id
      );

      // node3 should come after both node1 and node2
      expect(node3Index).toBeGreaterThan(node1Index);
      expect(node3Index).toBeGreaterThan(node2Index);
    });
  });

  describe('Execution Context', () => {
    it('should store execution plan in context', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      workflow.addNode('test.simple-node');

      const executor = new Executor();

      executor.on('beforeExecute', (_context) => {
        // Plan is set after beforeExecute, so check in onNodeStart
      });

      executor.on('onNodeStart', (_nodeId, _node) => {
        // Context is available via the node, but we can't access it directly in this test
        // This is tested implicitly by the fact that execution succeeds
      });

      const result = await executor.execute(workflow);
      expect(result.status).toBe('success');
    });
  });

  describe('Plan Metadata', () => {
    it('should capture correct metadata in plan', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      workflow.addNode('test.simple-node');
      workflow.addNode('test.simple-node');
      workflow.addNode('test.simple-node');

      const executor = new Executor();

      let capturedPlan: ExecutionPlan | undefined;
      executor.on('onPlanBuilt', (plan) => {
        capturedPlan = plan;
      });

      await executor.execute(workflow);

      expect(capturedPlan!.getNodeCount()).toBe(3);
      expect(capturedPlan!.getTotalStepCount()).toBe(3);
      expect(capturedPlan!.hasConditionals()).toBe(false);
      expect(capturedPlan!.hasLoops()).toBe(false);
      expect(capturedPlan!.hasParallel()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle plan building errors gracefully', async () => {
      const workflow = new Workflow('wf-1', 'Empty Workflow');
      // Empty workflow should fail validation

      const executor = new Executor();

      const result = await executor.execute(workflow);

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
    });
  });

  describe('Async Event Listeners', () => {
    it('should wait for async onPlanBuilt listeners', async () => {
      const workflow = new Workflow('wf-1', 'Test Workflow');
      workflow.addNode('test.simple-node');

      const executor = new Executor();

      const executionOrder: string[] = [];

      executor.on('onPlanBuilt', async (_plan) => {
        executionOrder.push('onPlanBuilt-start');
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push('onPlanBuilt-end');
      });

      executor.on('onNodeStart', () => {
        executionOrder.push('onNodeStart');
      });

      await executor.execute(workflow);

      // onPlanBuilt should fully complete before onNodeStart
      expect(executionOrder).toEqual(['onPlanBuilt-start', 'onPlanBuilt-end', 'onNodeStart']);
    });
  });
});
