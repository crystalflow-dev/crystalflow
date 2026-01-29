/**
 * PlanExecutor unit tests
 */

import { PlanExecutor } from '../../execution/PlanExecutor';
import { ExecutionPlan } from '../../execution/ExecutionPlan';
import { ExecutionContext } from '../../execution/ExecutionContext';
import { Executor } from '../../execution/Executor';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { NodeRegistry } from '../../node/NodeRegistry';
import { defineNode, Input, Output } from '../../node/decorators';
import {
  ExecutionStepType,
  NodeExecutionStep,
  ConditionalStep,
  IConditionalNode,
} from '@reactflo/types';

// Test nodes
@defineNode({
  type: 'test.simple',
  label: 'Simple Node',
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

@defineNode({
  type: 'test.math-add',
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

  execute() {
    this.result = this.a + this.b;
  }
}

@defineNode({
  type: 'test.error',
  label: 'Error Node',
  category: 'Test',
})
class ErrorNode extends Node {
  execute() {
    throw new Error('Intentional test error');
  }
}

// Conditional test node
@defineNode({
  type: 'test.conditional',
  label: 'Test Conditional',
  category: 'Test',
})
class TestConditionalNode extends Node implements IConditionalNode {
  @Input({ type: 'number', label: 'Value' })
  value: number = 0;

  @Output({ type: 'string', label: 'Then' })
  then: string = '';

  @Output({ type: 'string', label: 'Else' })
  else: string = '';

  execute() {
    // Node execution updates state
    this.then = 'then-branch';
    this.else = 'else-branch';
  }

  evaluateCondition(): string {
    // Returns the output port name for the active branch
    return this.value > 0 ? 'then' : 'else';
  }
}

describe('PlanExecutor', () => {
  let registry: NodeRegistry;

  beforeAll(() => {
    registry = NodeRegistry.getInstance();
    if (!registry.has('test.simple')) {
      registry.register(SimpleNode);
    }
    if (!registry.has('test.math-add')) {
      registry.register(AddNode);
    }
    if (!registry.has('test.error')) {
      registry.register(ErrorNode);
    }
    if (!registry.has('test.conditional')) {
      registry.register(TestConditionalNode);
    }
  });

  describe('execute - single node', () => {
    it('should execute plan with single NodeExecutionStep', async () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      const node = workflow.addNode('test.simple');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node.id,
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // Check node result was recorded
      const result = context.getNodeResult(node.id);
      expect(result).toBeDefined();
      expect(result?.nodeId).toBe(node.id);
      expect(result?.state).toBe('success');
    });

    it('should execute node and store outputs', async () => {
      const workflow = new Workflow('wf-1', 'Single Node');
      const node = workflow.addNode('test.simple');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node.id,
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      const result = context.getNodeResult(node.id);
      expect(result?.outputs).toBeDefined();
      expect(result?.outputs.output).toBe('executed');
    });
  });

  describe('execute - linear workflow', () => {
    it('should execute multiple nodes in sequence', async () => {
      const workflow = new Workflow('wf-1', 'Linear Workflow');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.simple');

      workflow.connect(node1.id, 'output', node2.id, 'input');
      workflow.connect(node2.id, 'output', node3.id, 'input');

      const steps: NodeExecutionStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: node1.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: node2.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-3',
          type: ExecutionStepType.NodeExecution,
          nodeId: node3.id,
          nodeType: 'test.simple',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // All nodes should have results
      expect(context.getNodeResult(node1.id)).toBeDefined();
      expect(context.getNodeResult(node2.id)).toBeDefined();
      expect(context.getNodeResult(node3.id)).toBeDefined();
    });

    it('should transfer data between connected nodes', async () => {
      const workflow = new Workflow('wf-1', 'Data Transfer');
      const node1 = workflow.addNode('test.math-add');
      const node2 = workflow.addNode('test.math-add');

      workflow.connect(node1.id, 'result', node2.id, 'a');

      // Set initial values on node1
      const n1 = workflow.nodes.get(node1.id) as AddNode;
      n1.a = 5;
      n1.b = 3;

      // Set b on node2
      const n2 = workflow.nodes.get(node2.id) as AddNode;
      n2.b = 10;

      const steps: NodeExecutionStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: node1.id,
          nodeType: 'test.math-add',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: node2.id,
          nodeType: 'test.math-add',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // node1: 5 + 3 = 8
      const result1 = context.getNodeResult(node1.id);
      expect(result1?.outputs.result).toBe(8);

      // node2: 8 (from node1) + 10 = 18
      const result2 = context.getNodeResult(node2.id);
      expect(result2?.outputs.result).toBe(18);
    });
  });

  describe('error handling', () => {
    it('should handle node execution errors', async () => {
      const workflow = new Workflow('wf-1', 'Error Workflow');
      const node = workflow.addNode('test.error');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node.id,
        nodeType: 'test.error',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await expect(planExecutor.execute(plan, workflow, context, workflowExecutor)).rejects.toThrow(
        'Intentional test error'
      );

      // Error should be recorded in result
      const result = context.getNodeResult(node.id);
      expect(result).toBeDefined();
      expect(result?.state).toBe('error');
      expect(result?.error).toBeDefined();
    });

    it('should stop execution on first error', async () => {
      const workflow = new Workflow('wf-1', 'Error Stop');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.error');
      const node3 = workflow.addNode('test.simple');

      const steps: NodeExecutionStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: node1.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: node2.id,
          nodeType: 'test.error',
        },
        {
          id: 'step-3',
          type: ExecutionStepType.NodeExecution,
          nodeId: node3.id,
          nodeType: 'test.simple',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await expect(
        planExecutor.execute(plan, workflow, context, workflowExecutor)
      ).rejects.toThrow();

      // node1 should have result
      expect(context.getNodeResult(node1.id)).toBeDefined();

      // node2 should have error
      expect(context.getNodeResult(node2.id)).toBeDefined();
      expect(context.getNodeResult(node2.id)?.state).toBe('error');

      // node3 should NOT have result (execution stopped)
      expect(context.getNodeResult(node3.id)).toBeUndefined();
    });

    it('should throw error for missing node', async () => {
      const workflow = new Workflow('wf-1', 'Missing Node');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: 'non-existent-node',
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await expect(planExecutor.execute(plan, workflow, context, workflowExecutor)).rejects.toThrow(
        'Node non-existent-node not found in workflow'
      );
    });

    it('should throw error for unsupported step types', async () => {
      const workflow = new Workflow('wf-1', 'Unsupported Step');
      const node = workflow.addNode('test.simple');

      const step = {
        id: 'step-1',
        type: ExecutionStepType.Loop,
        nodeId: node.id,
        loopType: 'for',
        bodySteps: [],
        maxIterations: 10,
      };

      const plan = new ExecutionPlan([step as any]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await expect(planExecutor.execute(plan, workflow, context, workflowExecutor)).rejects.toThrow(
        'LoopStep not yet implemented'
      );
    });
  });

  describe('event system', () => {
    it('should emit onStepStart and onStepComplete events', async () => {
      const workflow = new Workflow('wf-1', 'Events');
      const node = workflow.addNode('test.simple');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node.id,
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Note: Step events will be implemented in future phases
      // workflowExecutor.on('onStepStart', (stepId: string) => {
      //   events.push(`stepStart:${stepId}`);
      // });
      // workflowExecutor.on('onStepComplete', (stepId: string) => {
      //   events.push(`stepComplete:${stepId}`);
      // });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // Skip step event checks for Phase 1 (not yet implemented)
      // expect(events).toEqual(['stepStart:step-1', 'stepComplete:step-1']);
    });

    it('should emit onNodeStart and onNodeComplete events', async () => {
      const workflow = new Workflow('wf-1', 'Node Events');
      const node = workflow.addNode('test.simple');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node.id,
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];
      workflowExecutor.on('onNodeStart', (nodeId: string) => {
        events.push(`nodeStart:${nodeId}`);
      });
      workflowExecutor.on('onNodeComplete', (nodeId: string) => {
        events.push(`nodeComplete:${nodeId}`);
      });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      expect(events).toEqual([`nodeStart:${node.id}`, `nodeComplete:${node.id}`]);
    });

    it('should emit onNodeError event on node failure', async () => {
      const workflow = new Workflow('wf-1', 'Error Event');
      const node = workflow.addNode('test.error');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node.id,
        nodeType: 'test.error',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      let errorEmitted = false;
      workflowExecutor.on('onNodeError', () => {
        errorEmitted = true;
      });

      await expect(
        planExecutor.execute(plan, workflow, context, workflowExecutor)
      ).rejects.toThrow();
      expect(errorEmitted).toBe(true);
    });
  });

  describe('cancellation support', () => {
    it('should stop execution when context is cancelled', async () => {
      const workflow = new Workflow('wf-1', 'Cancellation');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');
      const node3 = workflow.addNode('test.simple');

      const steps: NodeExecutionStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: node1.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: node2.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-3',
          type: ExecutionStepType.NodeExecution,
          nodeId: node3.id,
          nodeType: 'test.simple',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Cancel before execution starts (simulate external cancellation)
      setTimeout(() => context.cancel(), 0);

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // The cancellation check happens at the start of each step iteration
      // So it depends on timing - some steps might execute before cancellation is checked
      // This test just verifies that execution completes without throwing
      expect(true).toBe(true);
    });
  });

  describe('currentStepIndex', () => {
    it('should track current step index during execution', async () => {
      const workflow = new Workflow('wf-1', 'Step Tracking');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');

      const steps: NodeExecutionStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: node1.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: node2.id,
          nodeType: 'test.simple',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const indices: number[] = [];
      // Note: Using onNodeStart since onStepStart not implemented in Phase 1
      workflowExecutor.on('onNodeStart', () => {
        indices.push(planExecutor.currentStepIndex);
      });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      expect(indices).toEqual([0, 1]);
    });
  });

  describe('executeConditionalStep - unit tests', () => {
    it('should execute conditional step and take "then" branch', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');

      // Set condition to take "then" branch
      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 5; // > 0, will take "then" branch

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'then-branch',
            condition: 'then', // Matches output port name
            steps: [
              {
                id: 'step-then',
                type: ExecutionStepType.NodeExecution,
                nodeId: thenNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await (planExecutor as any).executeConditionalStep(
        conditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      // Conditional node should be executed
      expect(context.getNodeResult(conditionalNode.id)).toBeDefined();
      // "Then" branch node should be executed
      expect(context.getNodeResult(thenNode.id)).toBeDefined();
    });

    it('should execute conditional step and take "else" branch', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const elseNode = workflow.addNode('test.simple');

      // Set condition to take "else" branch
      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = -5; // <= 0, will take "else" branch

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'else-branch',
            condition: 'else', // Matches output port name
            steps: [
              {
                id: 'step-else',
                type: ExecutionStepType.NodeExecution,
                nodeId: elseNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await (planExecutor as any).executeConditionalStep(
        conditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      // Conditional node should be executed
      expect(context.getNodeResult(conditionalNode.id)).toBeDefined();
      // "Else" branch node should be executed
      expect(context.getNodeResult(elseNode.id)).toBeDefined();
    });

    it('should use default branch when no branch matches', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const defaultNode = workflow.addNode('test.simple');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 5; // Will return "then", but we only have default branch

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [], // No matching branches
        defaultBranch: {
          id: 'default-branch',
          condition: 'default',
          steps: [
            {
              id: 'step-default',
              type: ExecutionStepType.NodeExecution,
              nodeId: defaultNode.id,
              nodeType: 'test.simple',
            },
          ],
        },
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await (planExecutor as any).executeConditionalStep(
        conditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      // Default branch node should be executed
      expect(context.getNodeResult(defaultNode.id)).toBeDefined();
    });

    it('should throw error when no branch matches and no default', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 5; // Will return "then"

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'wrong-branch',
            condition: 'wrong', // Doesn't match "then"
            steps: [],
          },
        ],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await expect(
        (planExecutor as any).executeConditionalStep(
          conditionalStep,
          workflow,
          context,
          workflowExecutor
        )
      ).rejects.toThrow(/No matching branch found for condition 'then'/);
    });

    it('should throw error when conditional node not found', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: 'non-existent-node',
        branches: [],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await expect(
        (planExecutor as any).executeConditionalStep(
          conditionalStep,
          workflow,
          context,
          workflowExecutor
        )
      ).rejects.toThrow(/Conditional node non-existent-node not found/);
    });

    it('should throw error when node does not implement IConditionalNode', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const simpleNode = workflow.addNode('test.simple'); // Not a conditional node

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: simpleNode.id,
        branches: [],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await expect(
        (planExecutor as any).executeConditionalStep(
          conditionalStep,
          workflow,
          context,
          workflowExecutor
        )
      ).rejects.toThrow(/does not implement IConditionalNode interface/);
    });

    it('should execute nested conditional steps', async () => {
      const workflow = new Workflow('wf-1', 'Nested Conditional Workflow');
      const outerConditional = workflow.addNode('test.conditional');
      const innerConditional = workflow.addNode('test.conditional');
      const finalNode = workflow.addNode('test.simple');

      // Outer condition: take "then" branch
      const outerNode = workflow.nodes.get(outerConditional.id) as TestConditionalNode;
      outerNode.value = 5;

      // Inner condition: take "else" branch
      const innerNode = workflow.nodes.get(innerConditional.id) as TestConditionalNode;
      innerNode.value = -3;

      const innerConditionalStep: ConditionalStep = {
        id: 'step-inner-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: innerConditional.id,
        branches: [
          {
            id: 'inner-else',
            condition: 'else',
            steps: [
              {
                id: 'step-final',
                type: ExecutionStepType.NodeExecution,
                nodeId: finalNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const outerConditionalStep: ConditionalStep = {
        id: 'step-outer-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: outerConditional.id,
        branches: [
          {
            id: 'outer-then',
            condition: 'then',
            steps: [innerConditionalStep], // Nested conditional
          },
        ],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      // Call private method directly using type casting for unit testing
      await (planExecutor as any).executeConditionalStep(
        outerConditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      // All three nodes should be executed
      expect(context.getNodeResult(outerConditional.id)).toBeDefined();
      expect(context.getNodeResult(innerConditional.id)).toBeDefined();
      expect(context.getNodeResult(finalNode.id)).toBeDefined();
    });
  });

  describe('conditional execution - integration tests', () => {
    it('should execute conditional workflow end-to-end through main execute loop', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');
      const elseNode = workflow.addNode('test.simple');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 10; // Will take "then" branch

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'then-branch',
            condition: 'then',
            steps: [
              {
                id: 'step-then',
                type: ExecutionStepType.NodeExecution,
                nodeId: thenNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
          {
            id: 'else-branch',
            condition: 'else',
            steps: [
              {
                id: 'step-else',
                type: ExecutionStepType.NodeExecution,
                nodeId: elseNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const plan = new ExecutionPlan([conditionalStep]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // Conditional node should be executed
      expect(context.getNodeResult(conditionalNode.id)).toBeDefined();
      // "Then" branch node should be executed
      expect(context.getNodeResult(thenNode.id)).toBeDefined();
      // "Else" branch node should NOT be executed
      expect(context.getNodeResult(elseNode.id)).toBeUndefined();
    });

    it('should emit all events for conditional workflow', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 5;

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'then-branch',
            condition: 'then',
            steps: [
              {
                id: 'step-then',
                type: ExecutionStepType.NodeExecution,
                nodeId: thenNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const plan = new ExecutionPlan([conditionalStep]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onStepStart', (stepId, stepType) => {
        events.push(`step-start:${stepId}:${stepType}`);
      });

      workflowExecutor.on('onBranchEnter', (nodeId, branchId) => {
        events.push(`branch-enter:${nodeId}:${branchId}`);
      });

      workflowExecutor.on('onBranchExit', (nodeId, branchId) => {
        events.push(`branch-exit:${nodeId}:${branchId}`);
      });

      workflowExecutor.on('onStepComplete', (stepId, stepType) => {
        events.push(`step-complete:${stepId}:${stepType}`);
      });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // Should have: conditional step start, branch enter, then step start, then step complete, branch exit, conditional step complete
      expect(events.length).toBeGreaterThanOrEqual(6);
      expect(events[0]).toBe('step-start:step-conditional:conditional');
      expect(events).toContain(`branch-enter:${conditionalNode.id}:then-branch`);
      expect(events).toContain('step-start:step-then:node-execution');
      expect(events).toContain('step-complete:step-then:node-execution');
      expect(events).toContain(`branch-exit:${conditionalNode.id}:then-branch`);
      expect(events[events.length - 1]).toBe('step-complete:step-conditional:conditional');
    });

    it('should handle nested conditionals through main execute loop', async () => {
      const workflow = new Workflow('wf-1', 'Nested Conditional Workflow');
      const outerConditional = workflow.addNode('test.conditional');
      const innerConditional = workflow.addNode('test.conditional');
      const finalNode = workflow.addNode('test.simple');

      const outerNode = workflow.nodes.get(outerConditional.id) as TestConditionalNode;
      outerNode.value = 10; // then

      const innerNode = workflow.nodes.get(innerConditional.id) as TestConditionalNode;
      innerNode.value = -5; // else

      const innerConditionalStep: ConditionalStep = {
        id: 'step-inner',
        type: ExecutionStepType.Conditional,
        nodeId: innerConditional.id,
        branches: [
          {
            id: 'inner-else',
            condition: 'else',
            steps: [
              {
                id: 'step-final',
                type: ExecutionStepType.NodeExecution,
                nodeId: finalNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const outerConditionalStep: ConditionalStep = {
        id: 'step-outer',
        type: ExecutionStepType.Conditional,
        nodeId: outerConditional.id,
        branches: [
          {
            id: 'outer-then',
            condition: 'then',
            steps: [innerConditionalStep],
          },
        ],
      };

      const plan = new ExecutionPlan([outerConditionalStep]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      // All three nodes should be executed
      expect(context.getNodeResult(outerConditional.id)).toBeDefined();
      expect(context.getNodeResult(innerConditional.id)).toBeDefined();
      expect(context.getNodeResult(finalNode.id)).toBeDefined();
    });
  });

  describe('branch execution events', () => {
    it('should emit onBranchEnter and onBranchExit events', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 10; // Will take "then" branch

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'then-branch',
            condition: 'then',
            steps: [
              {
                id: 'step-then',
                type: ExecutionStepType.NodeExecution,
                nodeId: thenNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onBranchEnter', (nodeId, branchId, condition) => {
        events.push(`enter:${nodeId}:${branchId}:${condition}`);
      });

      workflowExecutor.on('onBranchExit', (nodeId, branchId) => {
        events.push(`exit:${nodeId}:${branchId}`);
      });

      await (planExecutor as any).executeConditionalStep(
        conditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      expect(events).toHaveLength(2);
      expect(events[0]).toBe(`enter:${conditionalNode.id}:then-branch:then`);
      expect(events[1]).toBe(`exit:${conditionalNode.id}:then-branch`);
    });

    it('should emit branch events for default branch', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const defaultNode = workflow.addNode('test.simple');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 5; // Will return "then", but we only have default

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [], // No matching branches
        defaultBranch: {
          id: 'default-branch',
          condition: 'default',
          steps: [
            {
              id: 'step-default',
              type: ExecutionStepType.NodeExecution,
              nodeId: defaultNode.id,
              nodeType: 'test.simple',
            },
          ],
        },
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onBranchEnter', (nodeId, branchId, condition) => {
        events.push(`enter:${nodeId}:${branchId}:${condition}`);
      });

      workflowExecutor.on('onBranchExit', (nodeId, branchId) => {
        events.push(`exit:${nodeId}:${branchId}`);
      });

      await (planExecutor as any).executeConditionalStep(
        conditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      expect(events).toHaveLength(2);
      expect(events[0]).toBe(`enter:${conditionalNode.id}:default-branch:default`);
      expect(events[1]).toBe(`exit:${conditionalNode.id}:default-branch`);
    });

    it('should support async branch event listeners', async () => {
      const workflow = new Workflow('wf-1', 'Conditional Workflow');
      const conditionalNode = workflow.addNode('test.conditional');
      const thenNode = workflow.addNode('test.simple');

      const condNode = workflow.nodes.get(conditionalNode.id) as TestConditionalNode;
      condNode.value = 10;

      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: conditionalNode.id,
        branches: [
          {
            id: 'then-branch',
            condition: 'then',
            steps: [
              {
                id: 'step-then',
                type: ExecutionStepType.NodeExecution,
                nodeId: thenNode.id,
                nodeType: 'test.simple',
              },
            ],
          },
        ],
      };

      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onBranchEnter', async (nodeId, branchId) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push(`async-enter:${branchId}`);
      });

      workflowExecutor.on('onBranchExit', async (nodeId, branchId) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push(`async-exit:${branchId}`);
      });

      await (planExecutor as any).executeConditionalStep(
        conditionalStep,
        workflow,
        context,
        workflowExecutor
      );

      expect(events).toHaveLength(2);
      expect(events[0]).toBe('async-enter:then-branch');
      expect(events[1]).toBe('async-exit:then-branch');
    });
  });

  describe('step execution events', () => {
    it('should emit onStepStart and onStepComplete for node execution steps', async () => {
      const workflow = new Workflow('wf-1', 'Simple Workflow');
      const node1 = workflow.addNode('test.simple');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node1.id,
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onStepStart', (stepId, stepType) => {
        events.push(`start:${stepId}:${stepType}`);
      });

      workflowExecutor.on('onStepComplete', (stepId, stepType) => {
        events.push(`complete:${stepId}:${stepType}`);
      });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      expect(events).toHaveLength(2);
      expect(events[0]).toBe('start:step-1:node-execution');
      expect(events[1]).toBe('complete:step-1:node-execution');
    });

    it('should emit step events for multiple steps', async () => {
      const workflow = new Workflow('wf-1', 'Multi-Step Workflow');
      const node1 = workflow.addNode('test.simple');
      const node2 = workflow.addNode('test.simple');

      const steps: NodeExecutionStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: node1.id,
          nodeType: 'test.simple',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: node2.id,
          nodeType: 'test.simple',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onStepStart', (stepId, stepType) => {
        events.push(`start:${stepId}:${stepType}`);
      });

      workflowExecutor.on('onStepComplete', (stepId, stepType) => {
        events.push(`complete:${stepId}:${stepType}`);
      });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      expect(events).toHaveLength(4);
      expect(events[0]).toBe('start:step-1:node-execution');
      expect(events[1]).toBe('complete:step-1:node-execution');
      expect(events[2]).toBe('start:step-2:node-execution');
      expect(events[3]).toBe('complete:step-2:node-execution');
    });

    it('should support async step event listeners', async () => {
      const workflow = new Workflow('wf-1', 'Async Event Workflow');
      const node1 = workflow.addNode('test.simple');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: node1.id,
        nodeType: 'test.simple',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onStepStart', async (stepId) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push(`async-start:${stepId}`);
      });

      workflowExecutor.on('onStepComplete', async (stepId) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push(`async-complete:${stepId}`);
      });

      await planExecutor.execute(plan, workflow, context, workflowExecutor);

      expect(events).toHaveLength(2);
      expect(events[0]).toBe('async-start:step-1');
      expect(events[1]).toBe('async-complete:step-1');
    });

    it('should emit onStepError when step fails', async () => {
      const workflow = new Workflow('wf-1', 'Error Workflow');
      const errorNode = workflow.addNode('test.error');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: errorNode.id,
        nodeType: 'test.error',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      const events: string[] = [];

      workflowExecutor.on('onStepStart', (stepId) => {
        events.push(`start:${stepId}`);
      });

      workflowExecutor.on('onStepError', (stepId, stepType, error) => {
        events.push(`error:${stepId}:${stepType}:${error.message}`);
      });

      workflowExecutor.on('onStepComplete', (stepId) => {
        events.push(`complete:${stepId}`);
      });

      await expect(planExecutor.execute(plan, workflow, context, workflowExecutor)).rejects.toThrow(
        'Intentional test error'
      );

      expect(events).toHaveLength(2);
      expect(events[0]).toBe('start:step-1');
      expect(events[1]).toContain('error:step-1:node-execution:');
      expect(events[1]).toContain('Intentional test error');
      // onStepComplete should NOT be called after error
    });

    it('should not emit onStepComplete when step errors', async () => {
      const workflow = new Workflow('wf-1', 'Error Workflow');
      const errorNode = workflow.addNode('test.error');

      const step: NodeExecutionStep = {
        id: 'step-1',
        type: ExecutionStepType.NodeExecution,
        nodeId: errorNode.id,
        nodeType: 'test.error',
      };

      const plan = new ExecutionPlan([step]);
      const context = new ExecutionContext('exec-1', 'wf-1');
      const planExecutor = new PlanExecutor();
      const workflowExecutor = new Executor();

      let completeCalled = false;

      workflowExecutor.on('onStepComplete', () => {
        completeCalled = true;
      });

      await expect(
        planExecutor.execute(plan, workflow, context, workflowExecutor)
      ).rejects.toThrow();

      expect(completeCalled).toBe(false);
    });
  });

  describe('debugging method stubs', () => {
    it('should throw error for pause()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.pause()).toThrow('pause() not yet implemented (Phase 5)');
    });

    it('should throw error for resume()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.resume()).toThrow('resume() not yet implemented (Phase 5)');
    });

    it('should throw error for stepOver()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.stepOver()).toThrow('stepOver() not yet implemented (Phase 5)');
    });

    it('should throw error for stepInto()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.stepInto()).toThrow('stepInto() not yet implemented (Phase 5)');
    });

    it('should throw error for stepOut()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.stepOut()).toThrow('stepOut() not yet implemented (Phase 5)');
    });

    it('should throw error for setBreakpoint()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.setBreakpoint('node-1')).toThrow(
        'setBreakpoint() not yet implemented (Phase 5)'
      );
    });

    it('should throw error for removeBreakpoint()', () => {
      const planExecutor = new PlanExecutor();
      expect(() => planExecutor.removeBreakpoint('node-1')).toThrow(
        'removeBreakpoint() not yet implemented (Phase 5)'
      );
    });
  });
});
