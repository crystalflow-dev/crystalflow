/**
 * PlanExecutor executes an ExecutionPlan step-by-step.
 * 
 * Phase 1: Supports NodeExecutionStep only (serial execution)
 * Phase 2-4: Will add ConditionalStep, LoopStep, ParallelStep support
 * Phase 5: Will add debugging (pause, resume, step-over, breakpoints)
 */

import { ExecutionPlan } from './ExecutionPlan';
import { ExecutionContext } from './ExecutionContext';
import { Workflow } from '../workflow/Workflow';
import { Node } from '../node/Node';
import {
  ExecutionStepType,
  NodeExecutionResult,
  NodeState,
  ExecutionResult,
  ExecutionStatus,
} from '@reactflo/types';
import {
  ExecutionError,
  NodeExecutionError,
  CancellationError,
  TimeoutError,
  UserCancelledError,
} from './errors';

/**
 * PlanExecutor events
 * Can be emitted by PlanExecutor to notify about step execution progress
 */
export interface PlanExecutorEvents {
  onStepStart?: (stepId: string, step: any) => void | Promise<void>;
  onStepComplete?: (stepId: string, step: any) => void | Promise<void>;
  onStepError?: (stepId: string, error: Error) => void | Promise<void>;
  onNodeStart?: (nodeId: string, node: Node) => void | Promise<void>;
  onNodeComplete?: (nodeId: string, result: NodeExecutionResult) => void | Promise<void>;
  onNodeError?: (nodeId: string, error: Error) => void | Promise<void>;
}

/**
 * PlanExecutor executes execution plans step-by-step
 */
export class PlanExecutor {
  private _events: PlanExecutorEvents = {};
  private _currentStepIndex: number = -1;

  /**
   * Register event handlers
   */
  on<K extends keyof PlanExecutorEvents>(
    event: K,
    handler: PlanExecutorEvents[K]
  ): void {
    this._events[event] = handler;
  }

  /**
   * Execute an execution plan
   * @param plan - The execution plan to execute
   * @param workflow - The workflow containing the nodes
   * @param context - The execution context
   * @returns Execution result
   */
  async execute(
    plan: ExecutionPlan,
    workflow: Workflow,
    context: ExecutionContext
  ): Promise<void> {
    // Execute each step sequentially
    for (let i = 0; i < plan.steps.length; i++) {
      this._currentStepIndex = i;
      const step = plan.steps[i];

      // Check cancellation before each step
      if (context.isCancelled()) {
        // Cancellation error will be thrown by the caller
        return;
      }

      // Execute the step based on its type
      await this.executeStep(step, workflow, context);
    }
  }

  /**
   * Execute a single step
   * Routes to the appropriate executor based on step type
   */
  private async executeStep(
    step: any,
    workflow: Workflow,
    context: ExecutionContext
  ): Promise<void> {
    // Emit step start event
    await this.emitAsync('onStepStart', step.id, step);

    try {
      switch (step.type) {
        case ExecutionStepType.NodeExecution:
          await this.executeNodeStep(step, workflow, context);
          break;

        case ExecutionStepType.Conditional:
          throw new ExecutionError('ConditionalStep not yet implemented (Phase 2)', {
            executionId: context.executionId,
            workflowId: context.workflowId,
          });

        case ExecutionStepType.Loop:
          throw new ExecutionError('LoopStep not yet implemented (Phase 3)', {
            executionId: context.executionId,
            workflowId: context.workflowId,
          });

        case ExecutionStepType.Parallel:
          throw new ExecutionError('ParallelStep not yet implemented (Phase 4)', {
            executionId: context.executionId,
            workflowId: context.workflowId,
          });

        case ExecutionStepType.Merge:
          throw new ExecutionError('MergeStep not yet implemented (Phase 4)', {
            executionId: context.executionId,
            workflowId: context.workflowId,
          });

        default:
          throw new ExecutionError(`Unknown step type: ${(step as any).type}`, {
            executionId: context.executionId,
            workflowId: context.workflowId,
          });
      }

      // Emit step complete event
      await this.emitAsync('onStepComplete', step.id, step);
    } catch (error) {
      // Emit step error event
      await this.emitAsync('onStepError', step.id, error);
      throw error;
    }
  }

  /**
   * Execute a NodeExecutionStep
   * Executes a single node from the workflow
   */
  private async executeNodeStep(
    step: any,
    workflow: Workflow,
    context: ExecutionContext
  ): Promise<void> {
    const nodeId = step.nodeId;
    const node = workflow.nodes.get(nodeId);

    if (!node) {
      throw new ExecutionError(`Node ${nodeId} not found in workflow`, {
        executionId: context.executionId,
        workflowId: context.workflowId,
      });
    }

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
   * Emit an event asynchronously
   */
  private async emitAsync(
    event: keyof PlanExecutorEvents,
    ...args: any[]
  ): Promise<void> {
    const handler = this._events[event] as ((...args: any[]) => void | Promise<void>) | undefined;
    if (handler) {
      await handler(...args);
    }
  }

  /**
   * Get current step index
   */
  get currentStepIndex(): number {
    return this._currentStepIndex;
  }

  // ============================================================================
  // Debugging Methods (Stubs for Phase 5)
  // ============================================================================

  /**
   * Pause execution at the next step
   * @stub Phase 5 - Advanced Debugging
   */
  pause(): void {
    throw new Error('pause() not yet implemented (Phase 5)');
  }

  /**
   * Resume execution from paused state
   * @stub Phase 5 - Advanced Debugging
   */
  resume(): void {
    throw new Error('resume() not yet implemented (Phase 5)');
  }

  /**
   * Execute the current step and pause at the next step
   * @stub Phase 5 - Advanced Debugging
   */
  stepOver(): void {
    throw new Error('stepOver() not yet implemented (Phase 5)');
  }

  /**
   * Step into the current step (e.g., into a loop or conditional)
   * @stub Phase 5 - Advanced Debugging
   */
  stepInto(): void {
    throw new Error('stepInto() not yet implemented (Phase 5)');
  }

  /**
   * Step out of the current nested execution context
   * @stub Phase 5 - Advanced Debugging
   */
  stepOut(): void {
    throw new Error('stepOut() not yet implemented (Phase 5)');
  }

  /**
   * Set a breakpoint at a specific node
   * @stub Phase 5 - Advanced Debugging
   */
  setBreakpoint(nodeId: string): void {
    throw new Error('setBreakpoint() not yet implemented (Phase 5)');
  }

  /**
   * Remove a breakpoint from a node
   * @stub Phase 5 - Advanced Debugging
   */
  removeBreakpoint(nodeId: string): void {
    throw new Error('removeBreakpoint() not yet implemented (Phase 5)');
  }
}
