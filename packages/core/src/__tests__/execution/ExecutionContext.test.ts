import { ExecutionContext } from '../../execution/ExecutionContext';
import { ExecutionStatus, NodeState, CancellationReason } from '@reactflo/types';

describe('ExecutionContext', () => {
  let context: ExecutionContext;
  const executionId = 'exec-123';
  const workflowId = 'workflow-456';

  beforeEach(() => {
    context = new ExecutionContext(executionId, workflowId, { apiKey: 'test', userId: 123 });
  });

  describe('Initialization', () => {
    it('should initialize with correct properties', () => {
      expect(context.executionId).toBe(executionId);
      expect(context.workflowId).toBe(workflowId);
      expect(context.status).toBe(ExecutionStatus.Pending);
      expect(context.startTime).toBeInstanceOf(Date);
      expect(context.endTime).toBeUndefined();
      expect(context.duration).toBeUndefined();
    });

    it('should initialize variables from constructor', () => {
      expect(context.getVariable('apiKey')).toBe('test');
      expect(context.getVariable('userId')).toBe(123);
    });

    it('should initialize with empty variables if not provided', () => {
      const ctx = new ExecutionContext('exec-1', 'workflow-1');
      expect(ctx.getVariables()).toEqual({});
    });
  });

  describe('Status Management', () => {
    it('should allow status updates', () => {
      context.status = ExecutionStatus.Running;
      expect(context.status).toBe(ExecutionStatus.Running);

      context.status = ExecutionStatus.Success;
      expect(context.status).toBe(ExecutionStatus.Success);
    });

    it('should complete with success status', () => {
      context.complete(ExecutionStatus.Success);

      expect(context.status).toBe(ExecutionStatus.Success);
      expect(context.endTime).toBeInstanceOf(Date);
      expect(context.duration).toBeGreaterThanOrEqual(0);
    });

    it('should complete with failed status', () => {
      context.complete(ExecutionStatus.Failed);

      expect(context.status).toBe(ExecutionStatus.Failed);
      expect(context.endTime).toBeInstanceOf(Date);
    });

    it('should complete with cancelled status', () => {
      context.complete(ExecutionStatus.Cancelled);

      expect(context.status).toBe(ExecutionStatus.Cancelled);
      expect(context.endTime).toBeInstanceOf(Date);
    });
  });

  describe('Variable Management', () => {
    it('should get and set variables', () => {
      context.setVariable('newVar', 'newValue');
      expect(context.getVariable('newVar')).toBe('newValue');
    });

    it('should check if variable exists', () => {
      expect(context.hasVariable('apiKey')).toBe(true);
      expect(context.hasVariable('nonExistent')).toBe(false);
    });

    it('should return undefined for non-existent variables', () => {
      expect(context.getVariable('nonExistent')).toBeUndefined();
    });

    it('should get all variables as object', () => {
      context.setVariable('extra', 'value');

      const vars = context.getVariables();
      expect(vars).toEqual({
        apiKey: 'test',
        userId: 123,
        extra: 'value',
      });
    });

    it('should handle complex variable types', () => {
      const complexVar = {
        nested: { value: 123 },
        array: [1, 2, 3],
      };

      context.setVariable('complex', complexVar);
      expect(context.getVariable('complex')).toEqual(complexVar);
    });
  });

  describe('Node Results Management', () => {
    const nodeResult = {
      nodeId: 'node-1',
      state: NodeState.Success,
      outputs: { result: 42 },
      startTime: new Date(),
      endTime: new Date(),
      duration: 100,
    };

    it('should set and get node results', () => {
      context.setNodeResult('node-1', nodeResult);

      const retrieved = context.getNodeResult('node-1');
      expect(retrieved).toEqual(nodeResult);
    });

    it('should return undefined for non-existent node result', () => {
      expect(context.getNodeResult('non-existent')).toBeUndefined();
    });

    it('should get all node results', () => {
      const result1 = { ...nodeResult, nodeId: 'node-1' };
      const result2 = { ...nodeResult, nodeId: 'node-2' };

      context.setNodeResult('node-1', result1);
      context.setNodeResult('node-2', result2);

      const allResults = context.getNodeResults();
      expect(allResults.size).toBe(2);
      expect(allResults.get('node-1')).toEqual(result1);
      expect(allResults.get('node-2')).toEqual(result2);
    });

    it('should track node results with errors', () => {
      const errorResult = {
        nodeId: 'error-node',
        state: NodeState.Error,
        outputs: {},
        error: new Error('Test error'),
        startTime: new Date(),
        endTime: new Date(),
        duration: 50,
      };

      context.setNodeResult('error-node', errorResult);

      const retrieved = context.getNodeResult('error-node');
      expect(retrieved?.state).toBe(NodeState.Error);
      expect(retrieved?.error).toBeDefined();
    });
  });

  describe('Cancellation', () => {
    it('should provide abort signal', () => {
      expect(context.abortSignal).toBeDefined();
      expect(context.abortSignal).toBeInstanceOf(AbortSignal);
    });

    it('should cancel execution with default reason (Timeout)', () => {
      context.status = ExecutionStatus.Running;
      context.cancel();

      expect(context.status).toBe(ExecutionStatus.Cancelled);
      expect(context.isCancelled()).toBe(true);
      expect(context.abortSignal?.aborted).toBe(true);
      expect(context.cancellationReason).toBe(CancellationReason.Timeout);
      expect(context.cancelledAt).toBeInstanceOf(Date);
    });

    it('should cancel execution with UserCancelled reason', () => {
      context.status = ExecutionStatus.Running;
      context.cancel(CancellationReason.UserCancelled);

      expect(context.status).toBe(ExecutionStatus.Cancelled);
      expect(context.isCancelled()).toBe(true);
      expect(context.cancellationReason).toBe(CancellationReason.UserCancelled);
      expect(context.cancelledAt).toBeInstanceOf(Date);
    });

    it('should cancel execution with ExternalSignal reason', () => {
      context.status = ExecutionStatus.Running;
      context.cancel(CancellationReason.ExternalSignal);

      expect(context.status).toBe(ExecutionStatus.Cancelled);
      expect(context.isCancelled()).toBe(true);
      expect(context.cancellationReason).toBe(CancellationReason.ExternalSignal);
      expect(context.cancelledAt).toBeInstanceOf(Date);
    });

    it('should not cancel if not running', () => {
      expect(context.status).toBe(ExecutionStatus.Pending);
      context.cancel();

      // Should not change status if not running
      expect(context.status).toBe(ExecutionStatus.Pending);
      expect(context.cancellationReason).toBeUndefined();
      expect(context.cancelledAt).toBeUndefined();
    });

    it('should expose cancellationReason getter', () => {
      context.status = ExecutionStatus.Running;
      context.cancel(CancellationReason.UserCancelled);

      expect(context.cancellationReason).toBe(CancellationReason.UserCancelled);
    });

    it('should expose cancelledAt getter', () => {
      const beforeCancel = new Date();
      context.status = ExecutionStatus.Running;
      context.cancel();
      const afterCancel = new Date();

      expect(context.cancelledAt).toBeInstanceOf(Date);
      expect(context.cancelledAt!.getTime()).toBeGreaterThanOrEqual(beforeCancel.getTime());
      expect(context.cancelledAt!.getTime()).toBeLessThanOrEqual(afterCancel.getTime());
    });
  });

  describe('Timing', () => {
    it('should track duration after completion', async () => {
      const startTime = Date.now();

      await new Promise((resolve) => setTimeout(resolve, 50));

      context.complete(ExecutionStatus.Success);

      const endTime = Date.now();
      const expectedDuration = endTime - startTime;

      expect(context.duration).toBeGreaterThanOrEqual(40); // Allow 10ms margin for timer precision
      expect(context.duration).toBeLessThanOrEqual(expectedDuration + 50); // Allow some margin
    });

    it('should return undefined duration before completion', () => {
      expect(context.duration).toBeUndefined();
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize to JSON', () => {
      const nodeResult = {
        nodeId: 'node-1',
        state: NodeState.Success,
        outputs: { result: 123 },
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
      };

      context.setNodeResult('node-1', nodeResult);
      context.complete(ExecutionStatus.Success);

      const json = context.toJSON();

      expect(json.executionId).toBe(executionId);
      expect(json.workflowId).toBe(workflowId);
      expect(json.status).toBe(ExecutionStatus.Success);
      expect(json.startTime).toBeDefined();
      expect(json.endTime).toBeDefined();
      expect(json.duration).toBeGreaterThanOrEqual(0);
      expect(json.variables).toEqual({ apiKey: 'test', userId: 123 });
      expect(json.nodeResults).toHaveLength(1);
      expect(json.nodeResults[0].nodeId).toBe('node-1');
    });

    it('should serialize dates as ISO strings', () => {
      context.complete(ExecutionStatus.Success);
      const json = context.toJSON();

      expect(typeof json.startTime).toBe('string');
      expect(typeof json.endTime).toBe('string');

      // Verify valid ISO format
      expect(new Date(json.startTime as string).toISOString()).toBe(json.startTime);
    });

    it('should handle incomplete execution in JSON', () => {
      const json = context.toJSON();

      expect(json.endTime).toBeUndefined();
      expect(json.duration).toBeUndefined();
      expect(json.nodeResults).toHaveLength(0);
    });

    it('should serialize cancellation metadata', () => {
      context.status = ExecutionStatus.Running;
      context.cancel(CancellationReason.UserCancelled);
      context.complete(ExecutionStatus.Cancelled);

      const json = context.toJSON();

      expect(json.status).toBe(ExecutionStatus.Cancelled);
      expect(json.cancellationReason).toBe(CancellationReason.UserCancelled);
      expect(json.cancelledAt).toBeDefined();
      expect(typeof json.cancelledAt).toBe('string');
      expect(new Date(json.cancelledAt as string).toISOString()).toBe(json.cancelledAt);
    });

    it('should not include cancellation metadata if not cancelled', () => {
      context.complete(ExecutionStatus.Success);
      const json = context.toJSON();

      expect(json.cancellationReason).toBeUndefined();
      expect(json.cancelledAt).toBeUndefined();
    });
  });
});
