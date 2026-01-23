import 'reflect-metadata';
import {
  NodeId,
  NodeType,
  NodeState,
  NodeMetadata,
  PortDefinition,
  CancellationReason,
} from '@reactflo/types';
import type { ExecutionContext } from '../execution/ExecutionContext';
import { CancellationError, UserCancelledError, TimeoutError } from '../execution/errors';

/**
 * Abstract base class for all nodes in ReactFlo.
 *
 * Nodes are the building blocks of workflows. Each node represents a single
 * operation or task that can be connected to other nodes to form a workflow.
 *
 * @example
 * ```typescript
 * @defineNode({
 *   type: 'math.add',
 *   label: 'Add Numbers',
 *   category: 'Math'
 * })
 * class AddNode extends Node {
 *   @Input({ type: 'number', label: 'A' })
 *   a: number = 0;
 *
 *   @Input({ type: 'number', label: 'B' })
 *   b: number = 0;
 *
 *   @Output({ type: 'number', label: 'Result' })
 *   result: number;
 *
 *   execute() {
 *     this.result = this.a + this.b;
 *   }
 * }
 * ```
 */
export abstract class Node {
  /**
   * Index signature for dynamic input/output properties
   */
  [key: string]: unknown;

  /**
   * Unique identifier for this node instance
   */
  public readonly id: NodeId;

  /**
   * Node type identifier (e.g., 'math.add', 'http.request')
   */
  public readonly type: NodeType;

  /**
   * Current state of the node
   */
  public state: NodeState;

  /**
   * Error message if execution failed
   */
  public error?: string;

  /**
   * Metadata about the node (label, category, description, etc.)
   */
  private _metadata?: NodeMetadata;

  /**
   * Input port definitions
   */
  private _inputs?: PortDefinition[];

  /**
   * Output port definitions
   */
  private _outputs?: PortDefinition[];

  /**
   * Execution context - injected by executor during node execution
   * @internal
   */
  public _executionContext?: ExecutionContext;

  /**
   * Creates a new Node instance
   * @param id - Unique identifier for this node
   */
  constructor(id: NodeId) {
    this.id = id;
    this.type = this.getMetadata().type;
    this.state = NodeState.Idle;
  }

  /**
   * Get the metadata for this node type
   */
  public getMetadata(): NodeMetadata {
    if (!this._metadata) {
      this._metadata = Reflect.getMetadata('node:metadata', this.constructor);
      if (!this._metadata) {
        throw new Error(`Node ${this.constructor.name} is missing @defineNode decorator`);
      }
    }
    return this._metadata;
  }

  /**
   * Get input port definitions
   */
  public getInputs(): PortDefinition[] {
    if (!this._inputs) {
      this._inputs = Reflect.getMetadata('node:inputs', this.constructor) || [];
    }
    return this._inputs || [];
  }

  /**
   * Get output port definitions
   */
  public getOutputs(): PortDefinition[] {
    if (!this._outputs) {
      this._outputs = Reflect.getMetadata('node:outputs', this.constructor) || [];
    }
    return this._outputs || [];
  }

  /**
   * Get the value of an input port
   * @param portId - ID of the input port
   */
  public getInput<T = unknown>(portId: string): T {
    return this[portId] as T;
  }

  /**
   * Set the value of an input port
   * @param portId - ID of the input port
   * @param value - Value to set
   */
  public setInput<T = unknown>(portId: string, value: T): void {
    this[portId] = value;
  }

  /**
   * Get the value of an output port
   * @param portId - ID of the output port
   */
  public getOutput<T = unknown>(portId: string): T {
    return this[portId] as T;
  }

  /**
   * Set the value of an output port
   * @param portId - ID of the output port
   * @param value - Value to set
   */
  public setOutput<T = unknown>(portId: string, value: T): void {
    this[portId] = value;
  }

  /**
   * Validate inputs before execution
   * Override this method to add custom validation logic
   * @throws Error if validation fails
   */
  public validate(): void {
    const inputs = this.getInputs();

    for (const input of inputs) {
      const value = this.getInput(input.id);

      // Check required inputs
      if (input.required && (value === undefined || value === null)) {
        throw new Error(`Required input '${input.label || input.id}' is missing`);
      }
    }
  }

  /**
   * Execute the node's logic
   * This method must be implemented by all node classes
   * @throws Error if execution fails
   */
  public abstract execute(): void | Promise<void>;

  /**
   * Run the node (validate, execute, and handle state)
   * This method is called by the workflow executor
   */
  public async run(): Promise<void> {
    try {
      this.state = NodeState.Running;
      this.error = undefined;

      // Validate inputs
      this.validate();

      // Execute node logic
      await this.execute();

      this.state = NodeState.Success;
    } catch (error) {
      this.state = NodeState.Error;
      this.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * Reset the node to its initial state
   */
  public reset(): void {
    this.state = NodeState.Idle;
    this.error = undefined;
  }

  /**
   * Serialize node instance data to JSON
   */
  public toJSON(): Record<string, unknown> {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    const data: Record<string, unknown> = {};

    // Serialize input values
    for (const input of inputs) {
      const value = this.getInput(input.id);
      if (value !== undefined) {
        data[input.id] = value;
      }
    }

    // Serialize output values
    for (const output of outputs) {
      const value = this.getOutput(output.id);
      if (value !== undefined) {
        data[output.id] = value;
      }
    }

    return {
      id: this.id,
      type: this.type,
      state: this.state,
      error: this.error,
      data,
    };
  }

  /**
   * Load node instance data from JSON
   * @param json - JSON data to load
   */
  public fromJSON(json: Record<string, unknown>): void {
    if (json.state) {
      this.state = json.state as NodeState;
    }
    if (json.error) {
      this.error = json.error as string;
    }
    if (json.data && typeof json.data === 'object') {
      const data = json.data as Record<string, unknown>;
      // Load input values
      const inputs = this.getInputs();
      for (const input of inputs) {
        if (data[input.id] !== undefined) {
          this.setInput(input.id, data[input.id]);
        }
      }
    }
  }

  /**
   * Check if execution has been cancelled
   * Long-running nodes should call this periodically to respect cancellation requests
   *
   * @throws {CancellationError} If execution has been cancelled
   *
   * @example
   * ```typescript
   * async execute() {
   *   for (let i = 0; i < 1000; i++) {
   *     this.checkCancellation(); // Check every iteration
   *     await processItem(i);
   *   }
   * }
   * ```
   */
  protected checkCancellation(): void {
    if (this._executionContext?.isCancelled()) {
      const reason = this._executionContext.cancellationReason || CancellationReason.Timeout;
      const cancelledAt = this._executionContext.cancelledAt;

      // Throw appropriate error based on cancellation reason
      switch (reason) {
        case CancellationReason.Timeout:
          throw new TimeoutError('Execution timed out', {
            timeoutMs: 0, // Executor handles actual timeout value
            executionId: this._executionContext.executionId,
            workflowId: this._executionContext.workflowId,
          });

        case CancellationReason.UserCancelled:
          throw new UserCancelledError('Execution cancelled by user', {
            executionId: this._executionContext.executionId,
            workflowId: this._executionContext.workflowId,
            cancelledAt,
          });

        case CancellationReason.ExternalSignal:
          throw new CancellationError('Execution cancelled by external signal', {
            reason: CancellationReason.ExternalSignal,
            executionId: this._executionContext.executionId,
            workflowId: this._executionContext.workflowId,
            cancelledAt,
          });

        default:
          throw new CancellationError('Execution cancelled', {
            reason,
            executionId: this._executionContext.executionId,
            workflowId: this._executionContext.workflowId,
            cancelledAt,
          });
      }
    }
  }

  /**
   * Get the abort signal for this execution
   * Use this with AbortSignal-compatible APIs (fetch, etc.)
   *
   * @returns AbortSignal if available, undefined otherwise
   *
   * @example
   * ```typescript
   * async execute() {
   *   const response = await fetch(this.url, {
   *     signal: this.abortSignal // Automatically cancelled
   *   });
   * }
   * ```
   */
  protected get abortSignal(): AbortSignal | undefined {
    return this._executionContext?.abortSignal;
  }
}
