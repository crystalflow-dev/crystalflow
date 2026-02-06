/**
 * ExecutionStateTracker
 * Framework-agnostic execution state tracking
 *
 * Tracks the state of nodes and connections during workflow execution.
 * Can be used for debugging, logging, monitoring, or visualization.
 */

import {
  ExecutionState,
  NodeExecutionStatus,
  ConnectionExecutionState,
  SerializableExecutionState,
} from '@crystalflow/types';
import type { NodeId } from '@crystalflow/types';

/**
 * ExecutionStateTracker class
 *
 * Manages execution state in a framework-agnostic way.
 * Provides methods to query and update state during execution.
 *
 * @example
 * ```typescript
 * const tracker = new ExecutionStateTracker('exec-123', 'workflow-456');
 *
 * // Start execution
 * tracker.startExecution(['node1', 'node2', 'node3']);
 *
 * // Update node state
 * tracker.setNodeState('node1', 'running');
 * tracker.setNodeOutput('node1', { result: 42 });
 * tracker.setNodeState('node1', 'success');
 *
 * // Track connections
 * tracker.setConnectionActive('node1-output-node2-input', { result: 42 });
 * tracker.setConnectionCompleted('node1-output-node2-input');
 *
 * // Query state
 * const state = tracker.getState();
 * const nodeState = tracker.getNodeState('node1');
 * ```
 */
export class ExecutionStateTracker {
  private state: ExecutionState;

  /**
   * Create a new execution state tracker
   * @param executionId - Unique execution identifier
   * @param workflowId - Workflow being executed
   */
  constructor(executionId: string, workflowId: string) {
    this.state = this.createInitialState(executionId, workflowId);
  }

  /**
   * Create initial state
   */
  private createInitialState(executionId: string, workflowId: string): ExecutionState {
    return {
      executionId,
      workflowId,
      isExecuting: false,
      currentNodeId: null,
      nodeStates: new Map(),
      connectionStates: new Map(),
      nodeOutputs: new Map(),
      executionProgress: { current: 0, total: 0 },
      executionOrder: [],
    };
  }

  // ============================================================================
  // State Queries
  // ============================================================================

  /**
   * Get complete execution state
   */
  getState(): ExecutionState {
    return {
      ...this.state,
      nodeStates: new Map(this.state.nodeStates),
      connectionStates: new Map(this.state.connectionStates),
      nodeOutputs: new Map(this.state.nodeOutputs),
    };
  }

  /**
   * Get execution ID
   */
  getExecutionId(): string {
    return this.state.executionId;
  }

  /**
   * Get workflow ID
   */
  getWorkflowId(): string {
    return this.state.workflowId;
  }

  /**
   * Check if execution is active
   */
  isExecuting(): boolean {
    return this.state.isExecuting;
  }

  /**
   * Get current node being executed
   */
  getCurrentNodeId(): string | null {
    return this.state.currentNodeId;
  }

  /**
   * Get node execution status
   * @param nodeId - Node ID to query
   * @returns Node status or 'idle' if not found
   */
  getNodeState(nodeId: NodeId): NodeExecutionStatus {
    return this.state.nodeStates.get(nodeId) || 'idle';
  }

  /**
   * Get all node states
   */
  getAllNodeStates(): Map<NodeId, NodeExecutionStatus> {
    return new Map(this.state.nodeStates);
  }

  /**
   * Get connection state
   * @param connectionId - Connection ID to query
   */
  getConnectionState(connectionId: string): ConnectionExecutionState | undefined {
    return this.state.connectionStates.get(connectionId);
  }

  /**
   * Get all connection states
   */
  getAllConnectionStates(): Map<string, ConnectionExecutionState> {
    return new Map(this.state.connectionStates);
  }

  /**
   * Get node outputs
   * @param nodeId - Node ID to query
   */
  getNodeOutputs(nodeId: NodeId): Record<string, unknown> | undefined {
    return this.state.nodeOutputs.get(nodeId);
  }

  /**
   * Get all node outputs
   */
  getAllNodeOutputs(): Map<NodeId, Record<string, unknown>> {
    return new Map(this.state.nodeOutputs);
  }

  /**
   * Get execution progress
   */
  getProgress(): { current: number; total: number } {
    return { ...this.state.executionProgress };
  }

  /**
   * Get execution order
   */
  getExecutionOrder(): NodeId[] {
    return [...this.state.executionOrder];
  }

  // ============================================================================
  // State Updates
  // ============================================================================

  /**
   * Start execution
   * @param executionOrder - Topological order of node execution
   */
  startExecution(executionOrder: NodeId[]): void {
    this.state.isExecuting = true;
    this.state.executionOrder = executionOrder;
    this.state.executionProgress = {
      current: 0,
      total: executionOrder.length,
    };
    this.state.startTime = new Date();

    // NOTE: We don't pre-queue all nodes here because with conditional branches
    // and loops, not all nodes in the execution order will actually execute.
    // Nodes are set to 'queued' just before execution in setNodeState('queued').
  }

  /**
   * Set node execution status
   * @param nodeId - Node ID
   * @param status - New status
   */
  setNodeState(nodeId: NodeId, status: NodeExecutionStatus): void {
    this.state.nodeStates.set(nodeId, status);

    if (status === 'running') {
      this.state.currentNodeId = nodeId;
    } else if (status === 'success' || status === 'error') {
      // Update progress when node completes
      this.state.executionProgress.current += 1;

      // Clear current node if it's the one that just completed
      if (this.state.currentNodeId === nodeId) {
        this.state.currentNodeId = null;
      }
    }
  }

  /**
   * Set node outputs
   * @param nodeId - Node ID
   * @param outputs - Output values
   */
  setNodeOutput(nodeId: NodeId, outputs: Record<string, unknown>): void {
    this.state.nodeOutputs.set(nodeId, outputs);
  }

  /**
   * Create and activate a connection
   * @param connectionId - Unique connection identifier
   * @param sourceNodeId - Source node ID
   * @param sourcePort - Source output port
   * @param targetNodeId - Target node ID
   * @param targetPort - Target input port
   * @param data - Data being transferred
   */
  setConnectionActive(
    connectionId: string,
    sourceNodeId: NodeId,
    sourcePort: string,
    targetNodeId: NodeId,
    targetPort: string,
    data?: unknown
  ): void {
    const existing = this.state.connectionStates.get(connectionId);

    this.state.connectionStates.set(connectionId, {
      id: connectionId,
      sourceNodeId,
      sourcePort,
      targetNodeId,
      targetPort,
      state: 'active',
      data,
      activatedAt: new Date(),
      completedAt: existing?.completedAt,
    });
  }

  /**
   * Mark connection as completed
   * @param connectionId - Connection identifier
   */
  setConnectionCompleted(connectionId: string): void {
    const connection = this.state.connectionStates.get(connectionId);
    if (connection) {
      connection.state = 'completed';
      connection.completedAt = new Date();
    }
  }

  /**
   * Complete execution
   */
  completeExecution(): void {
    this.state.isExecuting = false;
    this.state.currentNodeId = null;
    this.state.endTime = new Date();
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.state = this.createInitialState(this.state.executionId, this.state.workflowId);
  }

  // ============================================================================
  // Serialization
  // ============================================================================

  /**
   * Convert state to JSON-serializable format
   * Useful for debugging, logging, or transmission
   */
  toJSON(): SerializableExecutionState {
    return {
      executionId: this.state.executionId,
      workflowId: this.state.workflowId,
      isExecuting: this.state.isExecuting,
      currentNodeId: this.state.currentNodeId,
      nodeStates: Object.fromEntries(this.state.nodeStates),
      connectionStates: Object.fromEntries(this.state.connectionStates),
      nodeOutputs: Object.fromEntries(this.state.nodeOutputs),
      executionProgress: this.state.executionProgress,
      executionOrder: this.state.executionOrder,
      startTime: this.state.startTime?.toISOString(),
      endTime: this.state.endTime?.toISOString(),
    };
  }

  /**
   * Create tracker from JSON
   * @param json - Serialized execution state
   */
  static fromJSON(json: SerializableExecutionState): ExecutionStateTracker {
    const tracker = new ExecutionStateTracker(json.executionId, json.workflowId);

    tracker.state = {
      executionId: json.executionId,
      workflowId: json.workflowId,
      isExecuting: json.isExecuting,
      currentNodeId: json.currentNodeId,
      nodeStates: new Map(Object.entries(json.nodeStates)),
      connectionStates: new Map(Object.entries(json.connectionStates)),
      nodeOutputs: new Map(Object.entries(json.nodeOutputs)),
      executionProgress: json.executionProgress,
      executionOrder: json.executionOrder,
      startTime: json.startTime ? new Date(json.startTime) : undefined,
      endTime: json.endTime ? new Date(json.endTime) : undefined,
    };

    return tracker;
  }
}
