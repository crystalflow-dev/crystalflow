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
}
