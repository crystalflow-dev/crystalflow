/**
 * ExecutionPlan - Represents the complete execution flow of a workflow
 * 
 * The execution plan is a tree structure containing steps that define
 * how a workflow should be executed. It's built by the ExecutionPlanBuilder
 * and executed by the PlanExecutor.
 * 
 * IMPORTANT - Multiple Entry Points:
 * Workflows can have multiple entry points (nodes with no incoming connections).
 * The ExecutionPlan enforces a single linear sequence at the top level, so the
 * ExecutionPlanBuilder must handle multiple entry points by:
 * 
 * Option 1 (Recommended): Wrap entry points in a virtual ParallelStep
 *   - Create a ParallelStep at the beginning with one branch per entry point
 *   - Add MergeStep after to synchronize before continuing
 *   - This allows true parallel execution of independent entry paths
 * 
 * Option 2: Sequential execution in topological order
 *   - Execute entry points one by one in dependency order
 *   - Simpler but loses parallelism opportunities
 * 
 * Option 3: Virtual root step (not recommended)
 *   - Create a virtual "start" step that doesn't correspond to a real node
 *   - Adds complexity and makes debugging harder
 * 
 * TODO: Implement multiple entry point handling in ExecutionPlanBuilder.build()
 * with configurable strategy (parallel vs sequential).
 */

import {
  ExecutionPlanStep,
  ExecutionStepType,
  NodeId,
  ConditionalStep,
  LoopStep,
  ParallelStep,
} from '@reactflo/types';

/**
 * Serialized representation of an execution plan
 */
export interface SerializedExecutionPlan {
  version: string;
  steps: ExecutionPlanStep[];
  metadata?: {
    nodeCount: number;
    stepCount: number;
    hasConditionals: boolean;
    hasLoops: boolean;
    hasParallel: boolean;
    createdAt: Date;
  };
}

/**
 * ExecutionPlan class
 * 
 * Holds the complete execution plan for a workflow and provides
 * utilities for traversal, analysis, and serialization.
 */
export class ExecutionPlan {
  /**
   * Array of top-level execution steps
   */
  public readonly steps: ExecutionPlanStep[];

  /**
   * Metadata about the plan
   */
  private readonly _metadata: {
    nodeCount: number;
    stepCount: number;
    hasConditionals: boolean;
    hasLoops: boolean;
    hasParallel: boolean;
    createdAt: Date;
  };

  /**
   * Create a new execution plan
   * @param steps - Array of execution steps
   */
  constructor(steps: ExecutionPlanStep[]) {
    if (!steps || steps.length === 0) {
      throw new Error('ExecutionPlan requires at least one step');
    }

    this.steps = steps;
    this._metadata = this._analyzeSteps(steps);
  }

  /**
   * Flatten the execution plan into a linear array of all steps
   * Uses depth-first traversal to extract all nested steps
   * 
   * @returns Flattened array of all steps in execution order
   */
  public flatten(): ExecutionPlanStep[] {
    const result: ExecutionPlanStep[] = [];
    this._flattenRecursive(this.steps, result);
    return result;
  }

  /**
   * Recursive helper for flatten
   */
  private _flattenRecursive(
    steps: ExecutionPlanStep[],
    result: ExecutionPlanStep[]
  ): void {
    for (const step of steps) {
      result.push(step);

      // Recursively flatten nested steps
      switch (step.type) {
        case ExecutionStepType.Conditional: {
          const conditionalStep = step as ConditionalStep;
          for (const branch of conditionalStep.branches) {
            this._flattenRecursive(branch.steps, result);
          }
          if (conditionalStep.defaultBranch) {
            this._flattenRecursive(conditionalStep.defaultBranch.steps, result);
          }
          break;
        }

        case ExecutionStepType.Loop: {
          const loopStep = step as LoopStep;
          this._flattenRecursive(loopStep.bodySteps, result);
          break;
        }

        case ExecutionStepType.Parallel: {
          const parallelStep = step as ParallelStep;
          for (const branch of parallelStep.branches) {
            this._flattenRecursive(branch.steps, result);
          }
          break;
        }

        // NodeExecution and Merge don't have nested steps
        case ExecutionStepType.NodeExecution:
        case ExecutionStepType.Merge:
          break;
      }
    }
  }

  /**
   * Get all node IDs that can be used as breakpoints
   * Returns node IDs from all NodeExecutionSteps in the plan
   * 
   * @returns Array of node IDs that can have breakpoints
   */
  public getBreakpoints(): NodeId[] {
    const nodeIds = new Set<NodeId>();
    const allSteps = this.flatten();

    for (const step of allSteps) {
      if (step.type === ExecutionStepType.NodeExecution) {
        nodeIds.add(step.nodeId);
      }
    }

    return Array.from(nodeIds);
  }

  /**
   * Serialize the execution plan to JSON
   * Useful for persistence, visualization, and debugging
   * 
   * @returns Serialized representation of the plan
   */
  public serialize(): SerializedExecutionPlan {
    return {
      version: '1.0.0',
      steps: this.steps,
      metadata: {
        ...this._metadata,
      },
    };
  }

  /**
   * Get metadata about the execution plan
   */
  public getMetadata() {
    return { ...this._metadata };
  }

  /**
   * Get the total number of steps (including nested)
   */
  public getTotalStepCount(): number {
    return this.flatten().length;
  }

  /**
   * Get the total number of unique nodes in the plan
   */
  public getNodeCount(): number {
    return this._metadata.nodeCount;
  }

  /**
   * Check if plan has conditional steps
   */
  public hasConditionals(): boolean {
    return this._metadata.hasConditionals;
  }

  /**
   * Check if plan has loop steps
   */
  public hasLoops(): boolean {
    return this._metadata.hasLoops;
  }

  /**
   * Check if plan has parallel steps
   */
  public hasParallel(): boolean {
    return this._metadata.hasParallel;
  }

  /**
   * Validate the execution plan structure
   * 
   * Checks for:
   * - Duplicate step IDs across the entire plan
   * - Empty branches in conditional steps
   * - Empty body steps in loop steps
   * - Invalid maxIterations values in loop steps
   * - Empty branches in parallel steps
   * 
   * Note on Cycles:
   * Cycles are structurally impossible in ExecutionPlan by design because
   * steps are organized in a tree structure where each step directly contains
   * its nested steps (not references to them). You cannot create a circular
   * reference in a tree - a step cannot contain itself directly or indirectly
   * because that would require infinite nesting at creation time.
   * 
   * Note on Node References:
   * This method does NOT validate whether nodeId values reference actual nodes
   * that exist in the workflow. That validation must be performed by the
   * ExecutionPlanBuilder during plan construction, where it has access to the
   * Workflow object. ExecutionPlan is intentionally decoupled from Workflow
   * to maintain separation of concerns.
   * 
   * TODO: Add node reference validation in ExecutionPlanBuilder.build() to
   * ensure all nodeId values in NodeExecutionSteps reference existing nodes.
   * 
   * @throws Error if validation fails
   */
  public validate(): void {
    // Basic validation - ensure no duplicate step IDs
    const stepIds = new Set<string>();
    const allSteps = this.flatten();

    for (const step of allSteps) {
      if (stepIds.has(step.id)) {
        throw new Error(`Duplicate step ID found: ${step.id}`);
      }
      stepIds.add(step.id);

      // Validate step-specific constraints
      switch (step.type) {
        case ExecutionStepType.Conditional: {
          const conditionalStep = step as ConditionalStep;
          if (conditionalStep.branches.length === 0) {
            throw new Error(
              `Conditional step ${step.id} must have at least one branch`
            );
          }
          break;
        }

        case ExecutionStepType.Loop: {
          const loopStep = step as LoopStep;
          if (loopStep.bodySteps.length === 0) {
            throw new Error(`Loop step ${step.id} must have at least one body step`);
          }
          if (loopStep.maxIterations <= 0) {
            throw new Error(
              `Loop step ${step.id} maxIterations must be positive`
            );
          }
          break;
        }

        case ExecutionStepType.Parallel: {
          const parallelStep = step as ParallelStep;
          if (parallelStep.branches.length === 0) {
            throw new Error(
              `Parallel step ${step.id} must have at least one branch`
            );
          }
          break;
        }

        case ExecutionStepType.NodeExecution:
        case ExecutionStepType.Merge:
          // No additional validation needed
          break;
      }
    }
  }

  /**
   * Analyze steps to gather metadata
   */
  private _analyzeSteps(steps: ExecutionPlanStep[]) {
    const nodeIds = new Set<NodeId>();
    let hasConditionals = false;
    let hasLoops = false;
    let hasParallel = false;

    const allSteps: ExecutionPlanStep[] = [];
    this._flattenRecursive(steps, allSteps);

    for (const step of allSteps) {
      if (step.type === ExecutionStepType.NodeExecution) {
        nodeIds.add(step.nodeId);
      } else if (step.type === ExecutionStepType.Conditional) {
        hasConditionals = true;
      } else if (step.type === ExecutionStepType.Loop) {
        hasLoops = true;
      } else if (step.type === ExecutionStepType.Parallel) {
        hasParallel = true;
      }
    }

    return {
      nodeCount: nodeIds.size,
      stepCount: allSteps.length,
      hasConditionals,
      hasLoops,
      hasParallel,
      createdAt: new Date(),
    };
  }

  /**
   * Create ExecutionPlan from serialized data
   * @param data - Serialized execution plan
   * @returns ExecutionPlan instance
   */
  public static fromSerialized(data: SerializedExecutionPlan): ExecutionPlan {
    if (data.version !== '1.0.0') {
      throw new Error(
        `Unsupported ExecutionPlan version: ${data.version}. Expected 1.0.0`
      );
    }

    const plan = new ExecutionPlan(data.steps);
    plan.validate();
    return plan;
  }
}
