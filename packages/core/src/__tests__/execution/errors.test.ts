import {
  ExecutionError,
  NodeExecutionError,
  ValidationError,
  TimeoutError,
  CancellationError,
  UserCancelledError,
} from '../../execution/errors';
import { CancellationReason } from '@reactflo/types';

describe('Execution Errors', () => {
  describe('ExecutionError', () => {
    it('should create basic error with message', () => {
      const error = new ExecutionError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ExecutionError);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ExecutionError');
    });

    it('should store execution context information', () => {
      const error = new ExecutionError('Test error', {
        executionId: 'exec-123',
        workflowId: 'workflow-456',
      });

      expect(error.executionId).toBe('exec-123');
      expect(error.workflowId).toBe('workflow-456');
    });

    it('should store cause error', () => {
      const causeError = new Error('Original error');
      const error = new ExecutionError('Wrapped error', {
        cause: causeError,
      });

      expect(error.cause).toBe(causeError);
    });

    it('should have proper stack trace', () => {
      const error = new ExecutionError('Test error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ExecutionError');
    });
  });

  describe('NodeExecutionError', () => {
    it('should create error with node information', () => {
      const error = new NodeExecutionError('Node failed', {
        nodeId: 'node-123',
        nodeType: 'math.add',
        executionId: 'exec-456',
        workflowId: 'workflow-789',
      });

      expect(error).toBeInstanceOf(ExecutionError);
      expect(error).toBeInstanceOf(NodeExecutionError);
      expect(error.message).toBe('Node failed');
      expect(error.name).toBe('NodeExecutionError');
      expect(error.nodeId).toBe('node-123');
      expect(error.nodeType).toBe('math.add');
      expect(error.executionId).toBe('exec-456');
      expect(error.workflowId).toBe('workflow-789');
    });

    it('should include cause error', () => {
      const originalError = new TypeError('Invalid type');
      const error = new NodeExecutionError('Node execution failed', {
        nodeId: 'node-1',
        nodeType: 'test.node',
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
    });

    it('should work without optional context', () => {
      const error = new NodeExecutionError('Simple node error', {
        nodeId: 'node-1',
        nodeType: 'test.node',
      });

      expect(error.executionId).toBeUndefined();
      expect(error.workflowId).toBeUndefined();
    });
  });

  describe('ValidationError', () => {
    it('should create error with validation errors', () => {
      const validationErrors = [
        'Workflow contains circular dependencies',
        'Connection type mismatch',
      ];

      const error = new ValidationError('Validation failed', {
        validationErrors,
        executionId: 'exec-123',
        workflowId: 'workflow-456',
      });

      expect(error).toBeInstanceOf(ExecutionError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
      expect(error.validationErrors).toEqual(validationErrors);
      expect(error.executionId).toBe('exec-123');
      expect(error.workflowId).toBe('workflow-456');
    });

    it('should handle empty validation errors array', () => {
      const error = new ValidationError('No specific errors', {
        validationErrors: [],
      });

      expect(error.validationErrors).toEqual([]);
    });

    it('should work without execution context', () => {
      const error = new ValidationError('Validation failed', {
        validationErrors: ['Error 1', 'Error 2'],
      });

      expect(error.executionId).toBeUndefined();
      expect(error.workflowId).toBeUndefined();
    });
  });

  describe('TimeoutError', () => {
    it('should create error with timeout information', () => {
      const error = new TimeoutError('Execution timed out', {
        timeoutMs: 5000,
        executionId: 'exec-123',
        workflowId: 'workflow-456',
      });

      expect(error).toBeInstanceOf(ExecutionError);
      expect(error).toBeInstanceOf(TimeoutError);
      expect(error.message).toBe('Execution timed out');
      expect(error.name).toBe('TimeoutError');
      expect(error.timeoutMs).toBe(5000);
      expect(error.executionId).toBe('exec-123');
      expect(error.workflowId).toBe('workflow-456');
    });

    it('should work without execution context', () => {
      const error = new TimeoutError('Timeout', {
        timeoutMs: 1000,
      });

      expect(error.timeoutMs).toBe(1000);
      expect(error.executionId).toBeUndefined();
      expect(error.workflowId).toBeUndefined();
    });
  });

  describe('CancellationError', () => {
    it('should create error with cancellation metadata', () => {
      const cancelledAt = new Date();
      const error = new CancellationError('Execution cancelled', {
        reason: CancellationReason.ExternalSignal,
        executionId: 'exec-123',
        workflowId: 'workflow-456',
        cancelledAt,
      });

      expect(error).toBeInstanceOf(ExecutionError);
      expect(error).toBeInstanceOf(CancellationError);
      expect(error.message).toBe('Execution cancelled');
      expect(error.name).toBe('CancellationError');
      expect(error.reason).toBe(CancellationReason.ExternalSignal);
      expect(error.cancelledAt).toBe(cancelledAt);
      expect(error.executionId).toBe('exec-123');
      expect(error.workflowId).toBe('workflow-456');
    });

    it('should work with minimal context', () => {
      const error = new CancellationError('Cancelled', {
        reason: CancellationReason.UserCancelled,
      });

      expect(error.reason).toBe(CancellationReason.UserCancelled);
      expect(error.executionId).toBeUndefined();
      expect(error.cancelledAt).toBeInstanceOf(Date); // Defaults to new Date()
    });
  });

  describe('UserCancelledError', () => {
    it('should create error for user-initiated cancellation', () => {
      const cancelledAt = new Date();
      const error = new UserCancelledError('User stopped execution', {
        executionId: 'exec-789',
        workflowId: 'workflow-123',
        cancelledAt,
      });

      expect(error).toBeInstanceOf(CancellationError);
      expect(error).toBeInstanceOf(UserCancelledError);
      expect(error.message).toBe('User stopped execution');
      expect(error.name).toBe('UserCancelledError');
      expect(error.reason).toBe(CancellationReason.UserCancelled);
      expect(error.cancelledAt).toBe(cancelledAt);
    });

    it('should inherit CancellationError properties', () => {
      const error = new UserCancelledError('Cancelled by user', {
        executionId: 'exec-1',
      });

      expect(error instanceof UserCancelledError).toBe(true);
      expect(error instanceof CancellationError).toBe(true);
      expect(error instanceof ExecutionError).toBe(true);
      expect(error.reason).toBe(CancellationReason.UserCancelled);
    });
  });

  describe('TimeoutError extends CancellationError', () => {
    it('should extend CancellationError', () => {
      const error = new TimeoutError('Timeout', {
        timeoutMs: 5000,
      });

      expect(error instanceof TimeoutError).toBe(true);
      expect(error instanceof CancellationError).toBe(true);
      expect(error instanceof ExecutionError).toBe(true);
      expect(error.reason).toBe(CancellationReason.Timeout);
    });

    it('should include timeout-specific properties', () => {
      const error = new TimeoutError('Execution timed out', {
        timeoutMs: 10000,
        executionId: 'exec-123',
        workflowId: 'workflow-456',
      });

      expect(error.timeoutMs).toBe(10000);
      expect(error.reason).toBe(CancellationReason.Timeout);
      expect(error.executionId).toBe('exec-123');
      expect(error.workflowId).toBe('workflow-456');
    });
  });

  describe('Error Hierarchy', () => {
    it('should maintain proper inheritance chain', () => {
      const nodeError = new NodeExecutionError('Test', {
        nodeId: '1',
        nodeType: 'test',
      });

      expect(nodeError instanceof NodeExecutionError).toBe(true);
      expect(nodeError instanceof ExecutionError).toBe(true);
      expect(nodeError instanceof Error).toBe(true);
    });

    it('should allow type narrowing', () => {
      const error: ExecutionError = new NodeExecutionError('Test', {
        nodeId: 'node-1',
        nodeType: 'test.type',
      });

      if (error instanceof NodeExecutionError) {
        expect(error.nodeId).toBe('node-1');
        expect(error.nodeType).toBe('test.type');
      } else {
        fail('Type narrowing failed');
      }
    });
  });

  describe('Error Messages', () => {
    it('should format descriptive error messages for NodeExecutionError', () => {
      const error = new NodeExecutionError('Failed to execute node: Division by zero', {
        nodeId: 'math-divide-1',
        nodeType: 'math.divide',
        executionId: 'exec-789',
        workflowId: 'workflow-123',
      });

      expect(error.message).toContain('Division by zero');
      expect(error.toString()).toContain('NodeExecutionError');
    });

    it('should format descriptive error messages for ValidationError', () => {
      const errors = [
        'Node "input-1" is missing required input "apiKey"',
        'Connection creates circular dependency',
      ];

      const error = new ValidationError(`Workflow validation failed with ${errors.length} errors`, {
        validationErrors: errors,
        workflowId: 'workflow-123',
      });

      expect(error.message).toContain('2 errors');
      expect(error.validationErrors).toHaveLength(2);
    });
  });
});
