import {
  ExecutionId,
  WorkflowId,
  NodeId,
  ExecutionStatus,
  NodeExecutionResult,
} from '@reactflo/types';

/**
 * Serialized execution context data
 */
export interface SerializedExecutionContext {
  executionId: ExecutionId;
  workflowId: WorkflowId;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  variables: Record<string, unknown>;
  nodeResults: Array<{
    nodeId: string;
    state: string;
    outputs: Record<string, unknown>;
    error?: Error;
    startTime: string;
    endTime?: string;
    duration?: number;
  }>;
}

/**
 * ExecutionContext manages the state and data for a workflow execution.
 * It tracks execution metadata, variables, and node results.
 */
export class ExecutionContext {
  private _executionId: ExecutionId;
  private _workflowId: WorkflowId;
  private _status: ExecutionStatus;
  private _startTime: Date;
  private _endTime?: Date;
  private _variables: Map<string, unknown>;
  private _nodeResults: Map<NodeId, NodeExecutionResult>;
  private _abortController?: AbortController;

  constructor(
    executionId: ExecutionId,
    workflowId: WorkflowId,
    variables?: Record<string, unknown>
  ) {
    this._executionId = executionId;
    this._workflowId = workflowId;
    this._status = ExecutionStatus.Pending;
    this._startTime = new Date();
    this._variables = new Map(Object.entries(variables || {}));
    this._nodeResults = new Map();
    this._abortController = new AbortController();
  }

  /**
   * Get execution ID
   */
  get executionId(): ExecutionId {
    return this._executionId;
  }

  /**
   * Get workflow ID
   */
  get workflowId(): WorkflowId {
    return this._workflowId;
  }

  /**
   * Get execution status
   */
  get status(): ExecutionStatus {
    return this._status;
  }

  /**
   * Set execution status
   */
  set status(value: ExecutionStatus) {
    this._status = value;
  }

  /**
   * Get start time
   */
  get startTime(): Date {
    return this._startTime;
  }

  /**
   * Get end time
   */
  get endTime(): Date | undefined {
    return this._endTime;
  }

  /**
   * Get execution duration in milliseconds
   */
  get duration(): number | undefined {
    if (!this._endTime) {
      return undefined;
    }
    return this._endTime.getTime() - this._startTime.getTime();
  }

  /**
   * Get abort signal for cancellation support
   */
  get abortSignal(): AbortSignal | undefined {
    return this._abortController?.signal;
  }

  /**
   * Get a variable value
   */
  getVariable<T = unknown>(key: string): T | undefined {
    return this._variables.get(key) as T | undefined;
  }

  /**
   * Set a variable value
   */
  setVariable(key: string, value: unknown): void {
    this._variables.set(key, value);
  }

  /**
   * Check if a variable exists
   */
  hasVariable(key: string): boolean {
    return this._variables.has(key);
  }

  /**
   * Get all variables as a plain object
   */
  getVariables(): Record<string, unknown> {
    return Object.fromEntries(this._variables);
  }

  /**
   * Set a node execution result
   */
  setNodeResult(nodeId: NodeId, result: NodeExecutionResult): void {
    this._nodeResults.set(nodeId, result);
  }

  /**
   * Get a node execution result
   */
  getNodeResult(nodeId: NodeId): NodeExecutionResult | undefined {
    return this._nodeResults.get(nodeId);
  }

  /**
   * Get all node results
   */
  getNodeResults(): Map<NodeId, NodeExecutionResult> {
    return new Map(this._nodeResults);
  }

  /**
   * Mark execution as complete
   */
  complete(
    status: ExecutionStatus.Success | ExecutionStatus.Failed | ExecutionStatus.Cancelled
  ): void {
    this._status = status;
    this._endTime = new Date();
  }

  /**
   * Cancel the execution
   */
  cancel(): void {
    if (this._status === ExecutionStatus.Running) {
      this._abortController?.abort();
      this.complete(ExecutionStatus.Cancelled);
    }
  }

  /**
   * Check if execution was cancelled
   */
  isCancelled(): boolean {
    return this._abortController?.signal.aborted || false;
  }

  /**
   * Serialize to JSON
   */
  toJSON(): SerializedExecutionContext {
    return {
      executionId: this._executionId,
      workflowId: this._workflowId,
      status: this._status,
      startTime: this._startTime.toISOString(),
      endTime: this._endTime?.toISOString(),
      duration: this.duration,
      variables: this.getVariables(),
      nodeResults: Array.from(this._nodeResults.entries()).map(([_, result]) => ({
        ...result,
        startTime: result.startTime.toISOString(),
        endTime: result.endTime?.toISOString(),
      })),
    };
  }
}
