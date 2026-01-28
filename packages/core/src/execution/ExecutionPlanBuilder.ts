/**
 * ExecutionPlanBuilder - Builds execution plans from workflows
 *
 * Analyzes workflow structure and generates an ExecutionPlan that represents
 * how the workflow should be executed. Phase 1 handles simple linear workflows
 * and basic multiple entry points (all merging at same point).
 */

import { Workflow } from '../workflow/Workflow';
import { ExecutionPlan } from './ExecutionPlan';
import {
  ExecutionPlanStep,
  ExecutionStepType,
  NodeExecutionStep,
  NodeId,
  IConditionalNode,
} from '@reactflo/types';
import { Node } from '../node/Node';

/**
 * Options for building execution plans
 */
export interface ExecutionPlanBuilderOptions {
  /**
   * Strategy for handling multiple entry points
   * - 'parallel': Wrap in ParallelStep (default, better performance)
   * - 'sequential': Execute in topological order (simpler, Phase 1 only)
   *
   * Note: Phase 1 only supports simple patterns where all entry branches
   * merge at the same point. Complex patterns will throw an error.
   */
  entryPointStrategy?: 'parallel' | 'sequential';

  /**
   * Generate unique step IDs using this prefix
   */
  stepIdPrefix?: string;
}

/**
 * ExecutionPlanBuilder
 *
 * Phase 1 Scope:
 * - Build plans for linear workflows (simple topological order)
 * - Handle single entry point
 * - Handle multiple entry points (sequential strategy only in Phase 1)
 * - Generate NodeExecutionStep for each node
 * - Validate node references
 *
 * Phase 4 Scope (Future):
 * - Parallel entry point wrapper
 * - Detect common merge points
 * - Handle intermediate merge patterns
 * - Generate ConditionalStep, LoopStep, ParallelStep
 */
export class ExecutionPlanBuilder {
  private _options: Required<ExecutionPlanBuilderOptions>;
  private _stepCounter: number = 0;

  constructor(options?: ExecutionPlanBuilderOptions) {
    this._options = {
      entryPointStrategy: options?.entryPointStrategy || 'sequential',
      stepIdPrefix: options?.stepIdPrefix || 'step',
    };
  }

  /**
   * Build an execution plan from a workflow
   *
   * @param workflow - The workflow to build a plan for
   * @returns ExecutionPlan ready for execution
   * @throws Error if workflow is invalid or contains unsupported patterns
   */
  public build(workflow: Workflow): ExecutionPlan {
    // Reset step counter for each build
    this._stepCounter = 0;

    // Validate workflow first
    const validationResult = workflow.validate();
    if (!validationResult.valid) {
      const errors = validationResult.errors.map((e) => e.message).join(', ');
      throw new Error(`Cannot build execution plan: workflow validation failed. ${errors}`);
    }

    // Get execution order from workflow (topological sort)
    const executionOrder = workflow.getExecutionOrder();

    if (executionOrder.length === 0) {
      throw new Error('Cannot build execution plan: workflow has no nodes');
    }

    // Phase 1: Simple sequential execution
    // Build NodeExecutionStep for each node in topological order
    const steps: ExecutionPlanStep[] = [];
    const visited = new Set<NodeId>();

    for (const nodeId of executionOrder) {
      if (visited.has(nodeId)) {
        continue;
      }

      // Validate node exists
      const node = workflow.nodes.get(nodeId);
      if (!node) {
        throw new Error(`Cannot build execution plan: node ${nodeId} not found in workflow`);
      }

      // Create NodeExecutionStep
      const step: NodeExecutionStep = {
        id: this._generateStepId(),
        type: ExecutionStepType.NodeExecution,
        nodeId: nodeId,
        nodeType: node.type,
        metadata: {
          nodeName: node.label || nodeId,
        },
      };

      steps.push(step);
      visited.add(nodeId);
    }

    // Create and validate the execution plan
    const plan = new ExecutionPlan(steps);
    plan.validate();

    return plan;
  }

  /**
   * Check if a node implements the IConditionalNode interface
   *
   * This is a TypeScript **type guard** that performs both a runtime check (Learning time ;) )
   * and provides compile-time type information to TypeScript.
   *
   * **Why the return type is `node is Node & IConditionalNode`:**
   *
   * Instead of returning a regular `boolean`, we use a **type predicate**.
   * This tells TypeScript: "if this function returns true, then the `node`
   * parameter is guaranteed to be both a `Node` AND implement `IConditionalNode`."
   *
   * This enables **type narrowing** - after the check, TypeScript knows the
   * node has the `evaluateCondition()` method and allows you to call it safely
   * without type errors.
   *
   * **Without type predicate (regular boolean):**
   * ```typescript
   * if (this.isConditionalNode(node)) {
   *   node.evaluateCondition(); // ❌ TypeScript error: method doesn't exist
   * }
   * ```
   *
   * **With type predicate (type guard):**
   * ```typescript
   * if (this.isConditionalNode(node)) {
   *   node.evaluateCondition(); // ✅ TypeScript knows this is safe!
   * }
   * ```
   *
   * **How it works:**
   * 1. Runtime: Checks if the node has an `evaluateCondition` function
   * 2. Compile-time: TypeScript narrows the type within the if-block
   * 3. Type safety: Prevents calling methods that don't exist
   *
   * @param node - Node to check
   * @returns Type predicate indicating if node implements IConditionalNode
   *
   * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
   *
   * @example
   * ```typescript
   * const node = workflow.nodes.get(nodeId);
   * if (this.isConditionalNode(node)) {
   *   // TypeScript knows node is Node & IConditionalNode here
   *   const branch = node.evaluateCondition();
   *   console.log(`Active branch: ${branch}`);
   * } else {
   *   // TypeScript knows node is just Node here
   *   console.log('Regular node, not conditional');
   * }
   * ```
   */
  public isConditionalNode(node: Node): node is Node & IConditionalNode {
    return typeof (node as any).evaluateCondition === 'function';
  }

  /**
   * Generate a unique step ID
   */
  private _generateStepId(): string {
    return `${this._options.stepIdPrefix}-${++this._stepCounter}`;
  }

  /**
   * Get builder options
   */
  public getOptions(): Readonly<ExecutionPlanBuilderOptions> {
    return { ...this._options };
  }

  /**
   * Update builder options
   */
  public setOptions(options: Partial<ExecutionPlanBuilderOptions>): void {
    this._options = {
      ...this._options,
      ...options,
    };
  }
}
