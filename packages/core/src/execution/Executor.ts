import { Workflow } from '../workflow/Workflow';
import { Node } from '../node/Node';
import { ExecutionContext } from './ExecutionContext';
import { ExecutionError, NodeExecutionError, ValidationError, TimeoutError } from './errors';
import {
  ExecutionOptions,
  ExecutionResult,
  ExecutionStatus,
  NodeExecutionResult,
  NodeState,
} from '@reactflo/types';
import { AsyncEventEmitter } from '../utils/AsyncEventEmitter';

/**
 * Executor events
 * All event listeners can be synchronous or asynchronous.
 * The executor will wait for all listeners to complete before continuing.
 */
export interface ExecutorEvents {
  [key: string]: (...args: any[]) => void | Promise<void>;
  beforeExecute: (context: ExecutionContext) => void | Promise<void>;
  afterExecute: (result: ExecutionResult) => void | Promise<void>;
  onNodeStart: (nodeId: string, node: Node) => void | Promise<void>;
  onNodeComplete: (nodeId: string, result: NodeExecutionResult) => void | Promise<void>;
  onNodeError: (nodeId: string, error: Error) => void | Promise<void>;
  onError: (error: Error) => void | Promise<void>;
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

    let timeoutHandle: NodeJS.Timeout | undefined;

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

      // Set up timeout if specified
      if (options.timeout && options.timeout > 0) {
        timeoutHandle = setTimeout(() => {
          context.cancel();
        }, options.timeout);
      }

      // Update status and emit event
      context.status = ExecutionStatus.Running;
      await this.emitAsync('beforeExecute', context);

      // Get execution order (topological sort)
      const executionOrder = workflow.getExecutionOrder();

      // Execute nodes sequentially
      for (const nodeId of executionOrder) {
        // Check if execution was cancelled
        if (context.isCancelled()) {
          throw new TimeoutError('Workflow execution timed out', {
            timeoutMs: options.timeout || 0,
            executionId,
            workflowId: workflow.id,
          });
        }

        const node = workflow.nodes.get(nodeId);
        if (!node) {
          throw new ExecutionError(`Node ${nodeId} not found in workflow`, {
            executionId,
            workflowId: workflow.id,
          });
        }

        // Execute the node
        await this.executeNode(node, workflow, context);
      }

      // Mark as successful
      context.complete(ExecutionStatus.Success);

      // Build and return result
      const result = this.buildExecutionResult(context);
      await this.emitAsync('afterExecute', result);

      return result;
    } catch (error) {
      // Handle execution error
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
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(
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
      // Record error result
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
    };
  }

  /**
   * Generate a unique execution ID
   */
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
