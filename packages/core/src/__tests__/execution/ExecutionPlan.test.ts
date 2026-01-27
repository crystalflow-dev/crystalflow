/**
 * ExecutionPlan unit tests
 */

import { ExecutionPlan, SerializedExecutionPlan } from '../../execution/ExecutionPlan';
import { ExecutionPlanStep, ExecutionStepType } from '@reactflo/types';

describe('ExecutionPlan', () => {
  describe('constructor', () => {
    it('should create a plan with steps', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);

      expect(plan.steps).toBe(steps);
      expect(plan.steps).toHaveLength(1);
    });

    it('should throw error if steps array is empty', () => {
      expect(() => new ExecutionPlan([])).toThrow('ExecutionPlan requires at least one step');
    });

    it('should throw error if steps is null', () => {
      expect(() => new ExecutionPlan(null as any)).toThrow(
        'ExecutionPlan requires at least one step'
      );
    });

    it('should analyze steps and generate metadata', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-2',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const metadata = plan.getMetadata();

      expect(metadata.nodeCount).toBe(2);
      expect(metadata.stepCount).toBe(2);
      expect(metadata.hasConditionals).toBe(false);
      expect(metadata.hasLoops).toBe(false);
      expect(metadata.hasParallel).toBe(false);
      expect(metadata.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('flatten', () => {
    it('should flatten simple linear plan', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-2',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const flattened = plan.flatten();

      expect(flattened).toHaveLength(2);
      expect(flattened[0].id).toBe('step-1');
      expect(flattened[1].id).toBe('step-2');
    });

    it('should flatten plan with conditional branches', () => {
      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: 'if-node',
        conditionalType: 'if-else',
        conditionInput: 'condition',
        branches: [
          {
            id: 'then-branch',
            condition: 'then',
            steps: [
              {
                id: 'step-then-1',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'then-node-1',
                nodeType: 'test.node',
              },
              {
                id: 'step-then-2',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'then-node-2',
                nodeType: 'test.node',
              },
            ],
          },
          {
            id: 'else-branch',
            condition: 'else',
            steps: [
              {
                id: 'step-else-1',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'else-node-1',
                nodeType: 'test.node',
              },
            ],
          },
        ],
      };

      const plan = new ExecutionPlan([conditionalStep]);
      const flattened = plan.flatten();

      // Should include: conditional step + 2 then steps + 1 else step = 4 total
      expect(flattened).toHaveLength(4);
      expect(flattened[0].id).toBe('step-conditional');
      expect(flattened[1].id).toBe('step-then-1');
      expect(flattened[2].id).toBe('step-then-2');
      expect(flattened[3].id).toBe('step-else-1');
    });

    it('should flatten plan with loop body steps', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 10,
        bodySteps: [
          {
            id: 'step-body-1',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node-1',
            nodeType: 'test.node',
          },
          {
            id: 'step-body-2',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node-2',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = new ExecutionPlan([loopStep]);
      const flattened = plan.flatten();

      // Should include: loop step + 2 body steps = 3 total
      expect(flattened).toHaveLength(3);
      expect(flattened[0].id).toBe('step-loop');
      expect(flattened[1].id).toBe('step-body-1');
      expect(flattened[2].id).toBe('step-body-2');
    });

    it('should flatten plan with parallel branches', () => {
      const parallelStep: ParallelStep = {
        id: 'step-parallel',
        type: ExecutionStepType.Parallel,
        nodeId: 'parallel-node',
        branches: [
          {
            id: 'branch-1',
            steps: [
              {
                id: 'step-branch-1-1',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'branch-1-node-1',
                nodeType: 'test.node',
              },
            ],
          },
          {
            id: 'branch-2',
            steps: [
              {
                id: 'step-branch-2-1',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'branch-2-node-1',
                nodeType: 'test.node',
              },
              {
                id: 'step-branch-2-2',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'branch-2-node-2',
                nodeType: 'test.node',
              },
            ],
          },
        ],
        mergeStrategy: 'all',
      };

      const plan = new ExecutionPlan([parallelStep]);
      const flattened = plan.flatten();

      // Should include: parallel step + 1 branch-1 step + 2 branch-2 steps = 4 total
      expect(flattened).toHaveLength(4);
      expect(flattened[0].id).toBe('step-parallel');
      expect(flattened[1].id).toBe('step-branch-1-1');
      expect(flattened[2].id).toBe('step-branch-2-1');
      expect(flattened[3].id).toBe('step-branch-2-2');
    });

    it('should flatten deeply nested plan', () => {
      const nestedPlan: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-loop',
          type: ExecutionStepType.Loop,
          nodeId: 'loop-node',
          loopType: 'for',
          conditionInput: 'iterations',
          maxIterations: 5,
          bodySteps: [
            {
              id: 'step-conditional',
              type: ExecutionStepType.Conditional,
              nodeId: 'if-node',
              conditionalType: 'if-else',
              conditionInput: 'condition',
              branches: [
                {
                  id: 'then-branch',
                  condition: 'then',
                  steps: [
                    {
                      id: 'step-nested',
                      type: ExecutionStepType.NodeExecution,
                      nodeId: 'nested-node',
                      nodeType: 'test.node',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const plan = new ExecutionPlan(nestedPlan);
      const flattened = plan.flatten();

      // Should include: node-1, loop, conditional, nested-node = 4 total
      expect(flattened).toHaveLength(4);
      expect(flattened[0].id).toBe('step-1');
      expect(flattened[1].id).toBe('step-loop');
      expect(flattened[2].id).toBe('step-conditional');
      expect(flattened[3].id).toBe('step-nested');
    });
  });

  describe('getBreakpoints', () => {
    it('should return all node IDs from NodeExecutionSteps', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-2',
          nodeType: 'test.node',
        },
        {
          id: 'step-3',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-3',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const breakpoints = plan.getBreakpoints();

      expect(breakpoints).toHaveLength(3);
      expect(breakpoints).toContain('node-1');
      expect(breakpoints).toContain('node-2');
      expect(breakpoints).toContain('node-3');
    });

    it('should return node IDs from nested steps', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 10,
        bodySteps: [
          {
            id: 'step-body',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = new ExecutionPlan([loopStep]);
      const breakpoints = plan.getBreakpoints();

      expect(breakpoints).toHaveLength(1);
      expect(breakpoints).toContain('body-node');
    });

    it('should deduplicate node IDs', () => {
      // In theory, same node could appear in multiple branches
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const breakpoints = plan.getBreakpoints();

      expect(breakpoints).toHaveLength(1);
      expect(breakpoints).toContain('node-1');
    });
  });

  describe('serialize', () => {
    it('should serialize plan with metadata', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      const serialized = plan.serialize();

      expect(serialized.version).toBe('1.0.0');
      expect(serialized.steps).toBe(steps);
      expect(serialized.metadata).toBeDefined();
      expect(serialized.metadata?.nodeCount).toBe(1);
      expect(serialized.metadata?.stepCount).toBe(1);
      expect(serialized.metadata?.createdAt).toBeInstanceOf(Date);
    });

    it('should serialize complex plan', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 10,
        bodySteps: [
          {
            id: 'step-body',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = new ExecutionPlan([loopStep]);
      const serialized = plan.serialize();

      expect(serialized.metadata?.hasLoops).toBe(true);
      expect(serialized.metadata?.nodeCount).toBe(1);
      expect(serialized.metadata?.stepCount).toBe(2);
    });
  });

  describe('validate', () => {
    it('should validate valid plan', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      expect(() => plan.validate()).not.toThrow();
    });

    it('should throw error for duplicate step IDs', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-1', // Duplicate!
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-2',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      expect(() => plan.validate()).toThrow('Duplicate step ID found: step-1');
    });

    it('should throw error for conditional with no branches', () => {
      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: 'if-node',
        conditionalType: 'if-else',
        conditionInput: 'condition',
        branches: [], // Empty!
      };

      const plan = new ExecutionPlan([conditionalStep]);
      expect(() => plan.validate()).toThrow(
        'Conditional step step-conditional must have at least one branch'
      );
    });

    it('should throw error for loop with no body steps', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 10,
        bodySteps: [], // Empty!
      };

      const plan = new ExecutionPlan([loopStep]);
      expect(() => plan.validate()).toThrow('Loop step step-loop must have at least one body step');
    });

    it('should throw error for loop with invalid maxIterations', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 0, // Invalid!
        bodySteps: [
          {
            id: 'step-body',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = new ExecutionPlan([loopStep]);
      expect(() => plan.validate()).toThrow('Loop step step-loop maxIterations must be positive');
    });

    it('should throw error for parallel with no branches', () => {
      const parallelStep: ParallelStep = {
        id: 'step-parallel',
        type: ExecutionStepType.Parallel,
        branches: [], // Empty!
        mergeStrategy: 'all',
      };

      const plan = new ExecutionPlan([parallelStep]);
      expect(() => plan.validate()).toThrow(
        'Parallel step step-parallel must have at least one branch'
      );
    });
  });

  describe('fromSerialized', () => {
    it('should create plan from serialized data', () => {
      const serialized: SerializedExecutionPlan = {
        version: '1.0.0',
        steps: [
          {
            id: 'step-1',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'node-1',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = ExecutionPlan.fromSerialized(serialized);

      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].id).toBe('step-1');
    });

    it('should throw error for unsupported version', () => {
      const serialized: SerializedExecutionPlan = {
        version: '2.0.0', // Unsupported!
        steps: [
          {
            id: 'step-1',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'node-1',
            nodeType: 'test.node',
          },
        ],
      };

      expect(() => ExecutionPlan.fromSerialized(serialized)).toThrow(
        'Unsupported ExecutionPlan version: 2.0.0'
      );
    });

    it('should validate plan after deserialization', () => {
      const serialized: SerializedExecutionPlan = {
        version: '1.0.0',
        steps: [
          {
            id: 'step-1',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'node-1',
            nodeType: 'test.node',
          },
          {
            id: 'step-1', // Duplicate!
            type: ExecutionStepType.NodeExecution,
            nodeId: 'node-2',
            nodeType: 'test.node',
          },
        ],
      };

      expect(() => ExecutionPlan.fromSerialized(serialized)).toThrow(
        'Duplicate step ID found: step-1'
      );
    });
  });

  describe('metadata getters', () => {
    it('should return total step count', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 10,
        bodySteps: [
          {
            id: 'step-body-1',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node-1',
            nodeType: 'test.node',
          },
          {
            id: 'step-body-2',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node-2',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = new ExecutionPlan([loopStep]);
      expect(plan.getTotalStepCount()).toBe(3); // loop + 2 body steps
    });

    it('should return node count', () => {
      const steps: ExecutionPlanStep[] = [
        {
          id: 'step-1',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-1',
          nodeType: 'test.node',
        },
        {
          id: 'step-2',
          type: ExecutionStepType.NodeExecution,
          nodeId: 'node-2',
          nodeType: 'test.node',
        },
      ];

      const plan = new ExecutionPlan(steps);
      expect(plan.getNodeCount()).toBe(2);
    });

    it('should detect conditionals', () => {
      const conditionalStep: ConditionalStep = {
        id: 'step-conditional',
        type: ExecutionStepType.Conditional,
        nodeId: 'if-node',
        conditionalType: 'if-else',
        conditionInput: 'condition',
        branches: [
          {
            id: 'branch',
            condition: 'condition',
            steps: [
              {
                id: 'step-nested',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'nested-node',
                nodeType: 'test.node',
              },
            ],
          },
        ],
      };

      const plan = new ExecutionPlan([conditionalStep]);
      expect(plan.hasConditionals()).toBe(true);
      expect(plan.hasLoops()).toBe(false);
      expect(plan.hasParallel()).toBe(false);
    });

    it('should detect loops', () => {
      const loopStep: LoopStep = {
        id: 'step-loop',
        type: ExecutionStepType.Loop,
        nodeId: 'loop-node',
        loopType: 'for',
        conditionInput: 'iterations',
        maxIterations: 10,
        bodySteps: [
          {
            id: 'step-body',
            type: ExecutionStepType.NodeExecution,
            nodeId: 'body-node',
            nodeType: 'test.node',
          },
        ],
      };

      const plan = new ExecutionPlan([loopStep]);
      expect(plan.hasConditionals()).toBe(false);
      expect(plan.hasLoops()).toBe(true);
      expect(plan.hasParallel()).toBe(false);
    });

    it('should detect parallel', () => {
      const parallelStep: ParallelStep = {
        id: 'step-parallel',
        type: ExecutionStepType.Parallel,
        branches: [
          {
            id: 'branch-1',
            steps: [
              {
                id: 'step-branch-1',
                type: ExecutionStepType.NodeExecution,
                nodeId: 'branch-node-1',
                nodeType: 'test.node',
              },
            ],
          },
        ],
        mergeStrategy: 'all',
      };

      const plan = new ExecutionPlan([parallelStep]);
      expect(plan.hasConditionals()).toBe(false);
      expect(plan.hasLoops()).toBe(false);
      expect(plan.hasParallel()).toBe(true);
    });
  });
});
