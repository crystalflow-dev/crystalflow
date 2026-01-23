/**
 * Execution error classes for ReactFlo execution engine
 */

/**
 * Base error class for execution-related errors
 */
export class ExecutionError extends Error {
  public readonly executionId?: string;
  public readonly workflowId?: string;
  public readonly cause?: Error;

  constructor(
    message: string,
    options?: {
      executionId?: string;
      workflowId?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'ExecutionError';
    this.executionId = options?.executionId;
    this.workflowId = options?.workflowId;
    this.cause = options?.cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error that occurs during node execution
 */
export class NodeExecutionError extends ExecutionError {
  public readonly nodeId: string;
  public readonly nodeType: string;

  constructor(
    message: string,
    options: {
      nodeId: string;
      nodeType: string;
      executionId?: string;
      workflowId?: string;
      cause?: Error;
    }
  ) {
    super(message, {
      executionId: options.executionId,
      workflowId: options.workflowId,
      cause: options.cause,
    });
    this.name = 'NodeExecutionError';
    this.nodeId = options.nodeId;
    this.nodeType = options.nodeType;
  }
}

/**
 * Error for workflow validation failures
 */
export class ValidationError extends ExecutionError {
  public readonly validationErrors: string[];

  constructor(
    message: string,
    options: {
      validationErrors: string[];
      executionId?: string;
      workflowId?: string;
    }
  ) {
    super(message, {
      executionId: options.executionId,
      workflowId: options.workflowId,
    });
    this.name = 'ValidationError';
    this.validationErrors = options.validationErrors;
  }
}

/**
 * Error for execution timeout
 */
export class TimeoutError extends ExecutionError {
  public readonly timeoutMs: number;

  constructor(
    message: string,
    options: {
      timeoutMs: number;
      executionId?: string;
      workflowId?: string;
    }
  ) {
    super(message, {
      executionId: options.executionId,
      workflowId: options.workflowId,
    });
    this.name = 'TimeoutError';
    this.timeoutMs = options.timeoutMs;
  }
}
