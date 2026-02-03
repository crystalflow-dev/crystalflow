/**
 * Execution type definitions
 */

import { NodeId, NodeState } from './node';
import { WorkflowId } from './workflow';

/**
 * Execution identifier
 */
export type ExecutionId = string;

/**
 * Execution status
 */
export enum ExecutionStatus {
  Pending = 'pending',
  Running = 'running',
  Success = 'success',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

/**
 * Cancellation reason
 * Tracks why an execution was cancelled
 */
export enum CancellationReason {
  /** Execution exceeded the configured timeout limit */
  Timeout = 'timeout',
  /** User explicitly cancelled the execution */
  UserCancelled = 'user-cancelled',
  /** Cancelled by an external AbortSignal */
  ExternalSignal = 'external-signal',
}

/**
 * Execution result
 */
export interface ExecutionResult {
  id: ExecutionId;
  workflowId: WorkflowId;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  nodeResults: Map<NodeId, NodeExecutionResult>;
  error?: Error;
  /** The reason for cancellation, if execution was cancelled */
  cancellationReason?: CancellationReason;
  /** Timestamp when execution was cancelled */
  cancelledAt?: Date;
}

/**
 * Node execution result
 */
export interface NodeExecutionResult {
  nodeId: NodeId;
  state: NodeState;
  outputs: Record<string, unknown>;
  error?: Error;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

/**
 * Execution context
 */
export interface ExecutionContextData {
  executionId: ExecutionId;
  workflowId: WorkflowId;
  variables: Map<string, unknown>;
  abortSignal?: AbortSignal;
}

/**
 * Execution options
 */
export interface ExecutionOptions {
  parallel?: boolean;
  timeout?: number;
  retryOnError?: boolean;
  maxRetries?: number;
  variables?: Record<string, unknown>;
  /** External AbortSignal to cancel execution */
  abortSignal?: AbortSignal;
}

// ============================================================================
// Execution Plan Types
// ============================================================================

/**
 * Step type discriminator for execution plan steps
 */
export enum ExecutionStepType {
  /** Execute a single node */
  NodeExecution = 'node-execution',
  /** Conditional branching (if/else, switch/case) */
  Conditional = 'conditional',
  /** Loop execution (for, while, forEach) */
  Loop = 'loop',
  /** Parallel execution of multiple branches */
  Parallel = 'parallel',
  /** Merge point for parallel branches */
  Merge = 'merge',
}

/**
 * Base interface for all execution plan steps
 */
export interface BaseExecutionStep {
  /** Unique identifier for this step */
  id: string;
  /** Type discriminator */
  type: ExecutionStepType;
  /** Optional metadata for debugging/visualization */
  metadata?: Record<string, unknown>;
}

/**
 * Step that executes a single node in the workflow
 */
export interface NodeExecutionStep extends BaseExecutionStep {
  type: ExecutionStepType.NodeExecution;
  /** ID of the node to execute */
  nodeId: NodeId;
  /** Node type for debugging */
  nodeType: string;
}

/**
 * Conditional branch definition
 */
export interface ConditionalBranch {
  /** Branch identifier (e.g., 'then', 'else', 'case-1') */
  id: string;
  /** Condition expression or key to evaluate */
  condition: string;
  /** Steps to execute if condition is true */
  steps: ExecutionPlanStep[];
  /** Optional label for debugging */
  label?: string;
}

/**
 * Step that executes conditional branching (if/else, switch/case)
 * Phase 2 implementation
 *
 * TODO: Future enhancements for post-MVP:
 * - Add `conditionInput` field to track which input port(s) drive the branching
 *   decision (useful for visualization/debugging).
 * - Add `conditionalType` field ('if-else' | 'switch' | 'custom') for UI rendering
 *   hints. Not needed for MVP since evaluateCondition() handles runtime decisions
 *   and users can create any branching logic (3-way compare, multi-route, etc).
 */
export interface ConditionalStep extends BaseExecutionStep {
  type: ExecutionStepType.Conditional;
  /** ID of the conditional node */
  nodeId: NodeId;
  /** All possible branches */
  branches: ConditionalBranch[];
  /** Default branch if no conditions match (optional) */
  defaultBranch?: ConditionalBranch;
}

/**
 * Step that executes a loop (for, while, forEach)
 * Phase 3 implementation
 */
export interface LoopStep extends BaseExecutionStep {
  type: ExecutionStepType.Loop;
  /** ID of the loop node */
  nodeId: NodeId;
  /** Type of loop ('for', 'while', 'forEach') */
  loopType: 'for' | 'while' | 'forEach';
  /** Input port for loop condition/array (Phase 3) */
  conditionInput?: string;
  /** Steps to execute in loop body */
  bodySteps: ExecutionPlanStep[];
  /** Maximum iterations (safety limit) */
  maxIterations: number;
}

/**
 * Parallel branch definition
 */
export interface ParallelBranch {
  /** Branch identifier */
  id: string;
  /** Steps to execute in this branch */
  steps: ExecutionPlanStep[];
  /** Optional label for debugging */
  label?: string;
}

/**
 * Step that executes multiple branches in parallel
 * Phase 4 implementation
 */
export interface ParallelStep extends BaseExecutionStep {
  type: ExecutionStepType.Parallel;
  /** ID of the parallel node (if any) */
  nodeId?: NodeId;
  /** All parallel branches */
  branches: ParallelBranch[];
  /** Merge strategy ('all', 'race', 'any') */
  mergeStrategy: 'all' | 'race' | 'any';
}

/**
 * Step that merges parallel branches back into single execution path
 * Phase 4 implementation
 */
export interface MergeStep extends BaseExecutionStep {
  type: ExecutionStepType.Merge;
  /** IDs of branches being merged */
  branchIds: string[];
  /** Merge strategy */
  strategy: 'all' | 'race' | 'any';
}

/**
 * Union type for all execution plan steps
 */
export type ExecutionPlanStep =
  | NodeExecutionStep
  | ConditionalStep
  | LoopStep
  | ParallelStep
  | MergeStep;
