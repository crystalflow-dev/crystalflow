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
  /** Cancelled due to a node execution error */
  NodeError = 'node-error',
  /** Cancelled due to resource constraints (memory, CPU, etc.) */
  ResourceLimit = 'resource-limit',
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
