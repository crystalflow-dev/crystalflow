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
  CancellationReason,
} from '@reactflo/types';
import {
  ExecutionError,
  NodeExecutionError,
  CancellationError,
  TimeoutError,
  UserCancelledError,
} from './errors';
import type { Executor } from './Executor';

/**
 * PlanExecutor executes execution plans step-by-step
 * Events are emitted through the Executor that owns this PlanExecutor
 */
export class PlanExecutor {
  private _currentStepIndex: number = -1;

  /**
   * Execute an execution plan
   * @param plan - The execution plan to execute
   * @param workflow - The workflow containing the nodes
   * @param context - The execution context
   * @param executor - The executor instance for event emission
   * @returns Execution result
   */
  async execute(
    plan: ExecutionPlan,
    workflow: Workflow,
    context: ExecutionContext,
    executor: Executor
  ): Promise<void> {
    // Execute each step sequentially
    for (let i = 0; i < plan.steps.length; i++) {
      this._currentStepIndex = i;
      const step = plan.steps[i];

      // Check cancellation before each step
      if (context.isCancelled()) {
        // Throw appropriate error based on cancellation reason
        const reason = context.cancellationReason || CancellationReason.Timeout;
        const cancelledAt = context.cancelledAt || new Date();

        // Emit cancellation event
        await executor.emitAsync('onCancellation', context.executionId, reason, cancelledAt);

        switch (reason) {
          case CancellationReason.Timeout:
            throw new TimeoutError('Workflow execution timed out', {
              timeoutMs: 0, // Will be set by Executor
              executionId: context.executionId,
              workflowId: context.workflowId,
            });

          case CancellationReason.UserCancelled:
            throw new UserCancelledError('Workflow execution was cancelled by user', {
              executionId: context.executionId,
              workflowId: context.workflowId,
              cancelledAt: context.cancelledAt,
            });

          case CancellationReason.ExternalSignal:
            throw new CancellationError('Workflow execution was cancelled by external signal', {
              reason: CancellationReason.ExternalSignal,
              executionId: context.executionId,
              workflowId: context.workflowId,
              cancelledAt: context.cancelledAt,
            });

          default:
            throw new CancellationError('Workflow execution was cancelled', {
              reason: reason || CancellationReason.UserCancelled,
              executionId: context.executionId,
              workflowId: context.workflowId,
              cancelledAt: context.cancelledAt,
            });
        }
      }

      // Execute the step based on its type
      await this.executeStep(step, workflow, context, executor);
    }
  }

  /**
   * Execute a single step
   * Routes to the appropriate executor based on step type
   */
  private async executeStep(
    step: any,
    workflow: Workflow,
    context: ExecutionContext,
    executor: Executor
  ): Promise<void> {
    // Emit step start event (will be added in future phases)
    // await executor.emitAsync('onStepStart', step.id, step);

    try {
      switch (step.type) {
        case ExecutionStepType.NodeExecution:
          await this.executeNodeStep(step, workflow, context, executor);
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

      // Emit step complete event (will be added in future phases)
      // await executor.emitAsync('onStepComplete', step.id, step);
    } catch (error) {
      // Emit step error event (will be added in future phases)
      // await executor.emitAsync('onStepError', step.id, error);
      throw error;
    }
  }

  /**
   * Execute a NodeExecutionStep
   * Delegates to Executor's executeNode method
   */
  private async executeNodeStep(
    step: any,
    workflow: Workflow,
    context: ExecutionContext,
    executor: Executor
  ): Promise<void> {
    const nodeId = step.nodeId;
    const node = workflow.nodes.get(nodeId);

    if (!node) {
      throw new ExecutionError(`Node ${nodeId} not found in workflow`, {
        executionId: context.executionId,
        workflowId: context.workflowId,
      });
    }

    // Delegate to Executor's executeNode method
    await (executor as any).executeNode(node, workflow, context);
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
