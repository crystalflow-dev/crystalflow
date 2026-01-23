/**
 * Execution error classes for ReactFlo execution engine
 */

import { CancellationReason } from '@reactflo/types';

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
 * Base error class for cancellation-related errors
 * All cancellation errors extend this class
 */
export class CancellationError extends ExecutionError {
  public readonly reason: CancellationReason;
  public readonly cancelledAt: Date;

  constructor(
    message: string,
    options: {
      reason: CancellationReason;
      cancelledAt?: Date;
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
    this.name = 'CancellationError';
    this.reason = options.reason;
    this.cancelledAt = options.cancelledAt || new Date();
  }
}

/**
 * Error for execution timeout
 */
export class TimeoutError extends CancellationError {
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
      reason: CancellationReason.Timeout,
      executionId: options.executionId,
      workflowId: options.workflowId,
    });
    this.name = 'TimeoutError';
    this.timeoutMs = options.timeoutMs;
  }
}

/**
 * Error for user-initiated cancellation
 */
export class UserCancelledError extends CancellationError {
  constructor(
    message: string,
    options?: {
      executionId?: string;
      workflowId?: string;
      cancelledAt?: Date;
    }
  ) {
    super(message, {
      reason: CancellationReason.UserCancelled,
      executionId: options?.executionId,
      workflowId: options?.workflowId,
      cancelledAt: options?.cancelledAt,
    });
    this.name = 'UserCancelledError';
  }
}

/**
 * Error for resource limit cancellation
 */
export class ResourceLimitError extends CancellationError {
  public readonly limitType: string;
  public readonly limitValue?: number;
  public readonly currentValue?: number;

  constructor(
    message: string,
    options: {
      limitType: string;
      limitValue?: number;
      currentValue?: number;
      executionId?: string;
      workflowId?: string;
      cancelledAt?: Date;
    }
  ) {
    super(message, {
      reason: CancellationReason.ResourceLimit,
      executionId: options.executionId,
      workflowId: options.workflowId,
      cancelledAt: options.cancelledAt,
    });
    this.name = 'ResourceLimitError';
    this.limitType = options.limitType;
    this.limitValue = options.limitValue;
    this.currentValue = options.currentValue;
  }
}
