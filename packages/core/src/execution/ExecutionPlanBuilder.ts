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
  ConditionalStep,
  ConditionalBranch,
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
   * Get all downstream nodes connected to a specific output port
   *
   * Analyzes the workflow's connections to find all nodes that receive
   * data from the specified output port of a node. This is essential for
   * building conditional branches, as each output port represents a different
   * execution path.
   *
   * @param nodeId - The source node ID
   * @param portId - The output port ID to trace from
   * @param workflow - The workflow containing the connections
   * @returns Array of node IDs that are connected to this output port
   *
   * @example
   * ```typescript
   * // For an IfNode with outputs 'thenOutput' and 'elseOutput':
   * const thenNodes = this.getDownstreamNodesForPort(ifNodeId, 'thenOutput', workflow);
   * const elseNodes = this.getDownstreamNodesForPort(ifNodeId, 'elseOutput', workflow);
   * // thenNodes = ['add-node-1', 'display-node-1']
   * // elseNodes = ['multiply-node-1']
   * ```
   */
  private getDownstreamNodesForPort(nodeId: NodeId, portId: string, workflow: Workflow): NodeId[] {
    const downstreamNodes: NodeId[] = [];

    // Iterate through all connections to find matches
    for (const connection of workflow.connections.values()) {
      // Check if this connection originates from the specified node and port
      if (connection.sourceNodeId === nodeId && connection.sourcePort === portId) {
        downstreamNodes.push(connection.targetNodeId);
      }
    }

    return downstreamNodes;
  }

  /**
   * Build execution steps for a specific node and its downstream nodes
   *
   * This is a recursive helper that builds a chain of execution steps starting
   * from a given node. It handles:
   * - Regular nodes: Creates NodeExecutionStep and recurses on downstream nodes
   * - Conditional nodes: Creates ConditionalStep with nested branches
   * - Cycle detection: Uses visited set to prevent infinite recursion
   * - Multiple downstream nodes: Builds steps for all connected nodes
   *
   * The recursion stops when:
   * - Node has already been visited (cycle detection)
   * - Node has no downstream connections (leaf node)
   *
   * @param nodeId - ID of the node to build steps for
   * @param workflow - The workflow containing the nodes
   * @param visited - Set of already visited node IDs to prevent cycles
   * @returns Array of execution plan steps for this node and downstream nodes
   * @throws Error if node not found in workflow
   *
   * @example
   * ```typescript
   * // Build steps starting from a specific node
   * const steps = this.buildStepsForNode('add-node-1', workflow, new Set());
   * // Returns: [NodeExecutionStep, NodeExecutionStep, ...]
   *
   * // With conditional node:
   * const steps = this.buildStepsForNode('if-node-1', workflow, new Set());
   * // Returns: [ConditionalStep with nested branch steps]
   * ```
   */
  private buildStepsForNode(
    nodeId: NodeId,
    workflow: Workflow,
    visited: Set<NodeId>
  ): ExecutionPlanStep[] {
    // Cycle detection: if we've already visited this node, stop recursion
    if (visited.has(nodeId)) {
      return [];
    }

    // Mark node as visited
    visited.add(nodeId);

    // Get the node from workflow
    const node = workflow.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found in workflow`);
    }

    const steps: ExecutionPlanStep[] = [];

    // Check if this is a conditional node
    if (this.isConditionalNode(node)) {
      // Build ConditionalStep with all branches
      const conditionalStep = this.buildConditionalStep(node, workflow, visited);
      steps.push(conditionalStep);
    } else {
      // Regular node: create NodeExecutionStep
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

      // Find all downstream nodes from all output ports
      const outputs = node.getOutputs();
      const downstreamNodeIds = new Set<NodeId>();

      for (const output of outputs) {
        const connectedNodes = this.getDownstreamNodesForPort(node.id, output.id, workflow);
        connectedNodes.forEach((id) => downstreamNodeIds.add(id));
      }

      // Recursively build steps for all downstream nodes
      for (const downstreamId of downstreamNodeIds) {
        const downstreamSteps = this.buildStepsForNode(downstreamId, workflow, visited);
        steps.push(...downstreamSteps);
      }
    }

    return steps;
  }

  /**
   * Build a ConditionalStep for a conditional node
   *
   * This method analyzes a conditional node and creates a ConditionalStep
   * that represents all possible execution branches. Each output port of
   * the conditional node becomes a separate branch in the step.
   *
   * Phase 2 Implementation:
   * - Detect all output ports of the conditional node
   * - For each output port, find connected downstream nodes
   * - Recursively build execution steps for each branch
   * - Handle nested conditionals through recursion
   * - Support both if-else and switch-case patterns
   *
   * Branch Building:
   * - Each output port = one branch
   * - Branch steps are built recursively using buildStepsForNode()
   * - Visited set shared across all branches for cycle detection
   * - Empty branches allowed (no downstream connections)
   *
   * @param node - The conditional node implementing IConditionalNode
   * @param workflow - The workflow containing the node
   * @param visited - Set of already visited nodes to prevent cycles
   * @returns ConditionalStep with all branches fully built
   * @throws Error if node has no outputs or invalid structure
   *
   * @example
   * ```typescript
   * const ifNode = workflow.nodes.get(ifNodeId);
   * if (this.isConditionalNode(ifNode)) {
   *   const step = this.buildConditionalStep(ifNode, workflow, new Set());
   *   // step = {
   *   //   type: ExecutionStepType.Conditional,
   *   //   branches: [
   *   //     { id: 'thenOutput', condition: 'thenOutput', steps: [NodeExecutionStep, ...] },
   *   //     { id: 'elseOutput', condition: 'elseOutput', steps: [NodeExecutionStep, ...] }
   *   //   ]
   *   // }
   * }
   * ```
   */
  private buildConditionalStep(
    node: Node & IConditionalNode,
    workflow: Workflow,
    visited: Set<NodeId>
  ): ConditionalStep {
    // Get all output ports of the conditional node
    const outputs = node.getOutputs();

    if (outputs.length === 0) {
      throw new Error(`Conditional node ${node.id} has no output ports - cannot build branches`);
    }

    // Build branches for each output port
    const branches: ConditionalBranch[] = [];

    for (const output of outputs) {
      // Find all nodes connected to this output port
      const downstreamNodeIds = this.getDownstreamNodesForPort(node.id, output.id, workflow);

      // Recursively build steps for all downstream nodes in this branch
      const branchSteps: ExecutionPlanStep[] = [];
      for (const downstreamId of downstreamNodeIds) {
        const steps = this.buildStepsForNode(downstreamId, workflow, visited);
        branchSteps.push(...steps);
      }

      // Create branch structure
      const branch: ConditionalBranch = {
        id: output.id,
        condition: output.id,
        steps: branchSteps,
        label: output.label,
      };

      branches.push(branch);
    }

    // Determine conditional type based on output ports
    // Convention: if/else has 2 branches, switch can have many
    const conditionalType = outputs.length === 2 ? 'if-else' : 'switch';

    // Create ConditionalStep
    // Note: conditionInput field removed (future enhancement for visualization)
    // Runtime decisions are made by evaluateCondition() method
    const step: ConditionalStep = {
      id: this._generateStepId(),
      type: ExecutionStepType.Conditional,
      nodeId: node.id,
      conditionalType: conditionalType,
      branches: branches,
      metadata: {
        nodeName: node.label || node.id,
        nodeType: node.type,
      },
    };

    return step;
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
