/**
 * Execution State Types
 * Framework-agnostic execution state tracking
 */

import { NodeId } from './node';

/**
 * Node execution status
 */
export type NodeExecutionStatus = 'idle' | 'queued' | 'running' | 'success' | 'error';

/**
 * Connection execution state
 * Represents the state of data flow between nodes
 */
export interface ConnectionExecutionState {
  /** Unique identifier for this connection */
  id: string;
  /** Source node ID */
  sourceNodeId: NodeId;
  /** Source output port name */
  sourcePort: string;
  /** Target node ID */
  targetNodeId: NodeId;
  /** Target input port name */
  targetPort: string;
  /** Current state of the connection */
  state: 'idle' | 'active' | 'completed';
  /** Data being transferred (optional, for inspection) */
  data?: unknown;
  /** Timestamp when connection became active */
  activatedAt?: Date;
  /** Timestamp when data transfer completed */
  completedAt?: Date;
}

/**
 * Complete execution state
 * Tracks the state of all nodes and connections during execution
 */
export interface ExecutionState {
  /** Execution ID */
  executionId: string;
  /** Workflow ID */
  workflowId: string;
  /** Whether execution is currently active */
  isExecuting: boolean;
  /** Currently executing node ID */
  currentNodeId: string | null;
  /** Node execution states */
  nodeStates: Map<NodeId, NodeExecutionStatus>;
  /** Connection states */
  connectionStates: Map<string, ConnectionExecutionState>;
  /** Node output values */
  nodeOutputs: Map<NodeId, Record<string, unknown>>;
  /** Execution progress */
  executionProgress: {
    current: number;
    total: number;
  };
  /** Execution order (topological sort) */
  executionOrder: NodeId[];
  /** When execution started */
  startTime?: Date;
  /** When execution completed */
  endTime?: Date;
}

/**
 * Serializable execution state (for JSON export)
 */
export interface SerializableExecutionState {
  executionId: string;
  workflowId: string;
  isExecuting: boolean;
  currentNodeId: string | null;
  nodeStates: Record<NodeId, NodeExecutionStatus>;
  connectionStates: Record<string, ConnectionExecutionState>;
  nodeOutputs: Record<NodeId, Record<string, unknown>>;
  executionProgress: {
    current: number;
    total: number;
  };
  executionOrder: NodeId[];
  startTime?: string;
  endTime?: string;
}
