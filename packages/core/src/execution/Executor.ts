import { Workflow } from '../workflow/Workflow';
import { Node } from '../node/Node';
import { ExecutionContext } from './ExecutionContext';
import {
  ExecutionError,
  NodeExecutionError,
  ValidationError,
  TimeoutError,
  CancellationError,
  UserCancelledError,
} from './errors';
import {
  ExecutionOptions,
  ExecutionResult,
  ExecutionStatus,
  NodeExecutionResult,
  NodeState,
  ExecutionId,
  CancellationReason,
} from '@crystalflow/types';
import { AsyncEventEmitter } from '../utils/AsyncEventEmitter';
import { ExecutionPlan } from './ExecutionPlan';
import { ExecutionPlanBuilder } from './ExecutionPlanBuilder';
import { PlanExecutor } from './PlanExecutor';

/**
 * Executor events
 * All event listeners can be synchronous or asynchronous.
 * The executor will wait for all listeners to complete before continuing.
 */
export interface ExecutorEvents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...args: any[]) => void | Promise<void>;
  beforeExecute: (context: ExecutionContext) => void | Promise<void>;
  afterExecute: (result: ExecutionResult) => void | Promise<void>;
  onPlanBuilt: (plan: ExecutionPlan) => void | Promise<void>;
  onStepStart: (stepId: string, stepType: string) => void | Promise<void>;
  onStepComplete: (stepId: string, stepType: string) => void | Promise<void>;
  onStepError: (stepId: string, stepType: string, error: Error) => void | Promise<void>;
  onNodeStart: (nodeId: string, node: Node) => void | Promise<void>;
  onNodeComplete: (nodeId: string, result: NodeExecutionResult) => void | Promise<void>;
  onNodeError: (nodeId: string, error: Error) => void | Promise<void>;
  onError: (error: Error) => void | Promise<void>;
  onCancellation: (
    executionId: string,
    reason: CancellationReason,
    cancelledAt: Date
  ) => void | Promise<void>;
  onBranchEnter: (nodeId: string, branchId: string, condition: string) => void | Promise<void>;
  onBranchExit: (nodeId: string, branchId: string) => void | Promise<void>;
}

/**
 * Executor orchestrates the execution of workflows.
 * It manages execution flow, data transfer, timing, and event emission.
 *
 * All event listeners (both sync and async) will be awaited before continuing execution.
 *
 * @example
 * ```typescript
 * const executor = new Executor();
 *
 * // Listen to events (can be async!)
 * executor.on('onNodeStart', async (nodeId) => {
 *   await logToDatabase(nodeId);
 *   console.log(`Node ${nodeId} started`);
 * });
 *
 * // Execute workflow
 * const result = await executor.execute(workflow, {
 *   timeout: 30000,
 *   variables: { apiKey: 'xxx' }
 * });
 * ```
 */
export class Executor extends AsyncEventEmitter<ExecutorEvents> {
  private _activeExecutions: Map<ExecutionId, ExecutionContext> = new Map();
  private _planBuilder: ExecutionPlanBuilder = new ExecutionPlanBuilder();
  private _planExecutor: PlanExecutor = new PlanExecutor();

  /**
   * Execute a workflow
   * @param workflow - The workflow to execute
   * @param options - Execution options
   * @returns Execution result with status, timing, and node results
   */
  async execute(workflow: Workflow, options: ExecutionOptions = {}): Promise<ExecutionResult> {
    // Generate execution ID
    const executionId = this.generateExecutionId();

    // Create execution context
    const context = new ExecutionContext(executionId, workflow.id, options.variables);

    // Track active execution
    this._activeExecutions.set(executionId, context);

    let timeoutHandle: NodeJS.Timeout | undefined;
    let abortListener: (() => void) | undefined;

    try {
      // Validate workflow
      const validation = workflow.validate();
      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message);
        throw new ValidationError('Workflow validation failed', {
          validationErrors: errorMessages,
          executionId,
          workflowId: workflow.id,
        });
      }

      // Set up external abort signal listener if provided
      if (options.abortSignal) {
        // Check if already aborted
        if (options.abortSignal.aborted) {
          throw new CancellationError('Execution aborted before start', {
            reason: CancellationReason.ExternalSignal,
            executionId,
            workflowId: workflow.id,
          });
        }

        // Listen for abort event
        abortListener = () => {
          context.cancel(CancellationReason.ExternalSignal);
        };
        options.abortSignal.addEventListener('abort', abortListener);
      }

      // Set up timeout if specified
      if (options.timeout && options.timeout > 0) {
        timeoutHandle = setTimeout(() => {
          context.cancel(CancellationReason.Timeout);
        }, options.timeout);
      }

      // Update status and emit event
      context.status = ExecutionStatus.Running;
      await this.emitAsync('beforeExecute', context);

      // Build execution plan
      const executionPlan = this._planBuilder.build(workflow);
      context.executionPlan = executionPlan;
      await this.emitAsync('onPlanBuilt', executionPlan);

      // Execute the plan
      await this._planExecutor.execute(executionPlan, workflow, context, this);

      // Mark as successful
      context.complete(ExecutionStatus.Success);

      // Build and return result
      const result = this.buildExecutionResult(context);
      await this.emitAsync('afterExecute', result);

      return result;
    } catch (error) {
      // Handle cancellation errors specially
      if (
        error instanceof CancellationError ||
        error instanceof TimeoutError ||
        error instanceof UserCancelledError
      ) {
        // Mark as cancelled (already set by cancel() but ensure it)
        context.complete(ExecutionStatus.Cancelled);

        // Emit cancellation event
        const reason = context.cancellationReason || CancellationReason.Timeout;
        const cancelledAt = context.cancelledAt || new Date();
        await this.emitAsync('onCancellation', executionId, reason, cancelledAt);

        const result = this.buildExecutionResult(context, error as ExecutionError);
        await this.emitAsync('afterExecute', result);

        return result;
      }

      // Handle other execution errors
      const executionError =
        error instanceof ExecutionError
          ? error
          : new ExecutionError(String(error), {
              executionId,
              workflowId: workflow.id,
              cause: error as Error,
            });

      context.complete(ExecutionStatus.Failed);

      await this.emitAsync('onError', executionError);

      const result = this.buildExecutionResult(context, executionError);
      await this.emitAsync('afterExecute', result);

      return result;
    } finally {
      // Clear timeout
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      // Remove abort signal listener
      if (abortListener && options.abortSignal) {
        options.abortSignal.removeEventListener('abort', abortListener);
      }

      // Remove from active executions
      this._activeExecutions.delete(executionId);
    }
  }

  /**
   * Execute a single node
   */
  public async executeNode(
    node: Node,
    workflow: Workflow,
    context: ExecutionContext
  ): Promise<void> {
    const startTime = new Date();

    try {
      // Emit node start event
      await this.emitAsync('onNodeStart', node.id, node);

      // Transfer data from connected nodes
      this.transferNodeData(node.id, workflow);

      // Inject execution context into node for cancellation support
      node._executionContext = context;

      // Execute the node (calls validate + execute + state management)
      await node.run();

      // Record execution result
      const endTime = new Date();

      const result: NodeExecutionResult = {
        nodeId: node.id,
        state: node.state,
        outputs: this.extractNodeOutputs(node),
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
      };

      context.setNodeResult(node.id, result);

      // Emit node complete event
      await this.emitAsync('onNodeComplete', node.id, result);
    } catch (error) {
      // If it's a cancellation error, let it propagate immediately
      if (
        error instanceof CancellationError ||
        error instanceof TimeoutError ||
        error instanceof UserCancelledError
      ) {
        throw error;
      }

      // Record error result for non-cancellation errors
      const nodeError = new NodeExecutionError(
        `Node execution failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          nodeId: node.id,
          nodeType: node.type,
          executionId: context.executionId,
          workflowId: context.workflowId,
          cause: error instanceof Error ? error : undefined,
        }
      );

      const result: NodeExecutionResult = {
        nodeId: node.id,
        state: NodeState.Error,
        outputs: {},
        error: nodeError,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
      };

      context.setNodeResult(node.id, result);

      // Emit node error event
      await this.emitAsync('onNodeError', node.id, nodeError);

      // Re-throw to stop execution
      throw nodeError;
    } finally {
      // Clear execution context from node
      node._executionContext = undefined;
    }
  }

  /**
   * Transfer data from connected nodes to the target node
   */
  private transferNodeData(targetNodeId: string, workflow: Workflow): void {
    for (const connection of workflow.connections.values()) {
      if (connection.targetNodeId === targetNodeId) {
        const sourceNode = workflow.nodes.get(connection.sourceNodeId);
        const targetNode = workflow.nodes.get(connection.targetNodeId);

        if (sourceNode && targetNode) {
          connection.transferData(sourceNode, targetNode);
        }
      }
    }
  }

  /**
   * Extract output values from a node
   */
  private extractNodeOutputs(node: Node): Record<string, unknown> {
    const outputs: Record<string, unknown> = {};
    const outputPorts = node.getOutputs();

    for (const output of outputPorts) {
      const value = node.getOutput(output.id);
      if (value !== undefined) {
        outputs[output.id] = value;
      }
    }

    return outputs;
  }

  /**
   * Build execution result
   */
  private buildExecutionResult(context: ExecutionContext, error?: Error): ExecutionResult {
    return {
      id: context.executionId,
      workflowId: context.workflowId,
      status: context.status,
      startTime: context.startTime,
      endTime: context.endTime,
      duration: context.duration,
      nodeResults: context.getNodeResults(),
      error,
      cancellationReason: context.cancellationReason,
      cancelledAt: context.cancelledAt,
    };
  }

  /**
   * Generate a unique execution ID
   */
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cancel a specific execution by ID
   * @param executionId - The ID of the execution to cancel
   * @param reason - The reason for cancellation (defaults to UserCancelled)
   * @returns true if execution was found and cancelled, false otherwise
   */
  cancel(
    executionId: ExecutionId,
    reason: CancellationReason = CancellationReason.UserCancelled
  ): boolean {
    const context = this._activeExecutions.get(executionId);
    if (context) {
      context.cancel(reason);
      return true;
    }
    return false;
  }

  /**
   * Cancel all active executions
   * @param reason - The reason for cancellation (defaults to UserCancelled)
   * @returns Number of executions that were cancelled
   */
  cancelAll(reason: CancellationReason = CancellationReason.UserCancelled): number {
    let count = 0;
    for (const context of this._activeExecutions.values()) {
      context.cancel(reason);
      count++;
    }
    return count;
  }

  /**
   * Check if an execution is currently active
   * @param executionId - The ID of the execution to check
   * @returns true if the execution is active, false otherwise
   */
  isExecutionActive(executionId: ExecutionId): boolean {
    return this._activeExecutions.has(executionId);
  }

  /**
   * Get the number of active executions
   * @returns Number of currently running executions
   */
  getActiveExecutionCount(): number {
    return this._activeExecutions.size;
  }
}
