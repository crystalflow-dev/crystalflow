import { Executor } from '../../execution/Executor';
import { ExecutionStatus } from '@reactflo/types';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { defineNode, Input, Output } from '../../node/decorators';

/**
 * Test helper nodes
 */

@defineNode({
  type: 'test.add',
  label: 'Add Numbers',
  category: 'Test',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result!: number;

  execute(): void {
    this.result = this.a + this.b;
  }
}

@defineNode({
  type: 'test.multiply',
  label: 'Multiply Numbers',
  category: 'Test',
})
class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 1;

  @Input({ type: 'number', label: 'B' })
  b: number = 1;

  @Output({ type: 'number', label: 'Result' })
  result!: number;

  execute(): void {
    this.result = this.a * this.b;
  }
}

@defineNode({
  type: 'test.error',
  label: 'Error Node',
  category: 'Test',
})
class ErrorNode extends Node {
  @Input({ type: 'string', label: 'Message' })
  message: string = 'Test error';

  execute(): void {
    throw new Error(this.message);
  }
}

@defineNode({
  type: 'test.async',
  label: 'Async Node',
  category: 'Test',
})
class AsyncNode extends Node {
  @Input({ type: 'number', label: 'Delay' })
  delay: number = 100;

  @Input({ type: 'string', label: 'Value' })
  value: string = 'test';

  @Output({ type: 'string', label: 'Result' })
  result!: string;

  async execute(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
    this.result = this.value.toUpperCase();
  }
}

describe('Executor', () => {
  let executor: Executor;

  beforeEach(() => {
    executor = new Executor();
  });

  describe('Basic Execution', () => {
    it('should execute a workflow with a single node', async () => {
      const workflow = new Workflow('test-workflow', 'Test Workflow');
      const node = new AddNode('node1');
      node.a = 5;
      node.b = 3;

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const result = await executor.execute(workflow);

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.workflowId).toBe('test-workflow');
      expect(result.nodeResults.size).toBe(1);

      const nodeResult = result.nodeResults.get('node1');
      expect(nodeResult).toBeDefined();
      expect(nodeResult?.outputs.result).toBe(8);
    });

    it('should execute nodes in topological order', async () => {
      const workflow = new Workflow('test-workflow', 'Test Workflow');

      // Create nodes
      const node1 = new AddNode('node1');
      node1.a = 2;
      node1.b = 3;

      const node2 = new MultiplyNode('node2');
      node2.b = 2;

      // Add nodes to workflow
      workflow['_nodes'].set('node1', node1);
      workflow['_nodes'].set('node2', node2);
      workflow['_graph'].addNode('node1');
      workflow['_graph'].addNode('node2');

      // Connect: node1.result -> node2.a
      const connection = workflow.connect('node1', 'result', 'node2', 'a');

      expect(connection).toBeDefined();

      const result = await executor.execute(workflow);

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.nodeResults.size).toBe(2);

      // Check execution order
      const node1Result = result.nodeResults.get('node1');
      const node2Result = result.nodeResults.get('node2');

      expect(node1Result?.outputs.result).toBe(5); // 2 + 3
      expect(node2Result?.outputs.result).toBe(10); // 5 * 2
    });

    it('should execute a complex workflow with multiple connections', async () => {
      const workflow = new Workflow('complex-workflow', 'Complex Workflow');

      // node1: 2 + 3 = 5
      const node1 = new AddNode('node1');
      node1.a = 2;
      node1.b = 3;

      // node2: 4 + 6 = 10
      const node2 = new AddNode('node2');
      node2.a = 4;
      node2.b = 6;

      // node3: 5 * 10 = 50
      const node3 = new MultiplyNode('node3');

      workflow['_nodes'].set('node1', node1);
      workflow['_nodes'].set('node2', node2);
      workflow['_nodes'].set('node3', node3);
      workflow['_graph'].addNode('node1');
      workflow['_graph'].addNode('node2');
      workflow['_graph'].addNode('node3');

      // Connect: node1.result -> node3.a, node2.result -> node3.b
      workflow.connect('node1', 'result', 'node3', 'a');
      workflow.connect('node2', 'result', 'node3', 'b');

      const result = await executor.execute(workflow);

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.nodeResults.size).toBe(3);

      const node3Result = result.nodeResults.get('node3');
      expect(node3Result?.outputs.result).toBe(50); // 5 * 10
    });
  });

  describe('Error Handling', () => {
    it('should stop execution on node error', async () => {
      const workflow = new Workflow('error-workflow', 'Error Workflow');

      const node1 = new AddNode('node1');
      node1.a = 1;
      node1.b = 2;

      const errorNode = new ErrorNode('error-node');
      errorNode.message = 'Intentional error';

      const node3 = new AddNode('node3');

      workflow['_nodes'].set('node1', node1);
      workflow['_nodes'].set('error-node', errorNode);
      workflow['_nodes'].set('node3', node3);
      workflow['_graph'].addNode('node1');
      workflow['_graph'].addNode('error-node');
      workflow['_graph'].addNode('node3');

      // Create dependency: node1 -> error-node -> node3
      workflow['_graph'].addEdge('node1', 'error-node');
      workflow['_graph'].addEdge('error-node', 'node3');

      const result = await executor.execute(workflow);

      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Intentional error');

      // node1 should have executed, error-node failed, node3 should not execute
      expect(result.nodeResults.size).toBeLessThanOrEqual(2);
      expect(result.nodeResults.get('node1')).toBeDefined();
      expect(result.nodeResults.get('node3')).toBeUndefined();
    });

    it('should emit error events', async () => {
      const workflow = new Workflow('error-workflow', 'Error Workflow');
      const errorNode = new ErrorNode('error-node');

      workflow['_nodes'].set('error-node', errorNode);
      workflow['_graph'].addNode('error-node');

      const onError = jest.fn();
      const onNodeError = jest.fn();

      executor.on('onError', onError);
      executor.on('onNodeError', onNodeError);

      await executor.execute(workflow);

      expect(onError).toHaveBeenCalled();
      expect(onNodeError).toHaveBeenCalled();
    });
  });

  describe('Execution Options', () => {
    it.skip('should support timeout option', async () => {
      // TODO: Implement proper timeout cancellation that interrupts running nodes
      const workflow = new Workflow('timeout-workflow', 'Timeout Workflow');
      const asyncNode = new AsyncNode('async-node');
      asyncNode.delay = 500; // 500ms delay

      workflow['_nodes'].set('async-node', asyncNode);
      workflow['_graph'].addNode('async-node');

      const result = await executor.execute(workflow, { timeout: 50 }); // 50ms timeout

      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.error?.name).toBe('TimeoutError');
    }, 10000);

    it('should pass variables to execution context', async () => {
      const workflow = new Workflow('vars-workflow', 'Variables Workflow');
      const node = new AddNode('node1');

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const result = await executor.execute(workflow, {
        variables: { apiKey: 'test-key', userId: 123 },
      });

      expect(result.status).toBe(ExecutionStatus.Success);
      // Variables are stored in context but not directly accessible in result
      // This is tested in ExecutionContext tests
    });
  });

  describe('Events', () => {
    it('should emit beforeExecute and afterExecute events', async () => {
      const workflow = new Workflow('event-workflow', 'Event Workflow');
      const node = new AddNode('node1');

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const beforeExecute = jest.fn();
      const afterExecute = jest.fn();

      executor.on('beforeExecute', beforeExecute);
      executor.on('afterExecute', afterExecute);

      await executor.execute(workflow);

      expect(beforeExecute).toHaveBeenCalledTimes(1);
      expect(afterExecute).toHaveBeenCalledTimes(1);
    });

    it('should emit onNodeStart and onNodeComplete events', async () => {
      const workflow = new Workflow('event-workflow', 'Event Workflow');
      const node1 = new AddNode('node1');
      const node2 = new AddNode('node2');

      workflow['_nodes'].set('node1', node1);
      workflow['_nodes'].set('node2', node2);
      workflow['_graph'].addNode('node1');
      workflow['_graph'].addNode('node2');

      const onNodeStart = jest.fn();
      const onNodeComplete = jest.fn();

      executor.on('onNodeStart', onNodeStart);
      executor.on('onNodeComplete', onNodeComplete);

      await executor.execute(workflow);

      expect(onNodeStart).toHaveBeenCalledTimes(2);
      expect(onNodeComplete).toHaveBeenCalledTimes(2);
    });
  });

  describe('Execution Result', () => {
    it('should include timing information', async () => {
      const workflow = new Workflow('timing-workflow', 'Timing Workflow');
      const asyncNode = new AsyncNode('async-node');
      asyncNode.delay = 50;

      workflow['_nodes'].set('async-node', asyncNode);
      workflow['_graph'].addNode('async-node');

      const result = await executor.execute(workflow);

      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThanOrEqual(45); // Allow some timing variance
    });

    it('should serialize outputs to JSON', async () => {
      const workflow = new Workflow('json-workflow', 'JSON Workflow');
      const node = new AddNode('node1');
      node.a = 10;
      node.b = 20;

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const result = await executor.execute(workflow);

      expect(result.status).toBe(ExecutionStatus.Success);

      // Verify JSON serialization
      const json = JSON.stringify(result, (_key, value) => {
        // Convert Map to Array for JSON
        if (value instanceof Map) {
          return Array.from(value.entries());
        }
        return value;
      });

      expect(json).toBeDefined();
      expect(typeof json).toBe('string');

      const parsed = JSON.parse(json);
      expect(parsed.workflowId).toBe('json-workflow');
    });
  });

  describe('Async Event Listeners', () => {
    it('should wait for async event listeners to complete', async () => {
      const workflow = new Workflow('async-event-workflow', 'Async Event Workflow');
      const node = new AddNode('node1');
      node.a = 5;
      node.b = 3;

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const executionOrder: string[] = [];

      // Add async listener that takes time
      executor.on('onNodeStart', async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        executionOrder.push('async-start');
      });

      executor.on('onNodeComplete', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push('async-complete');
      });

      await executor.execute(workflow);

      // Both async listeners should have completed
      expect(executionOrder).toEqual(['async-start', 'async-complete']);
    });

    it('should wait for multiple async listeners on same event', async () => {
      const workflow = new Workflow('multi-async-workflow', 'Multi Async Workflow');
      const node = new AddNode('node1');

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const results: string[] = [];

      executor.on('beforeExecute', async () => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        results.push('listener1');
      });

      executor.on('beforeExecute', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push('listener2');
      });

      executor.on('beforeExecute', async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        results.push('listener3');
      });

      await executor.execute(workflow);

      // All async listeners should have completed
      expect(results).toHaveLength(3);
      expect(results).toContain('listener1');
      expect(results).toContain('listener2');
      expect(results).toContain('listener3');
    });

    it('should support mix of sync and async listeners', async () => {
      const workflow = new Workflow('mixed-workflow', 'Mixed Workflow');
      const node = new AddNode('node1');

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const results: string[] = [];

      // Sync listener
      executor.on('onNodeStart', () => {
        results.push('sync-listener');
      });

      // Async listener
      executor.on('onNodeStart', async () => {
        await new Promise((resolve) => setTimeout(resolve, 15));
        results.push('async-listener');
      });

      // Another sync listener
      executor.on('onNodeStart', () => {
        results.push('sync-listener-2');
      });

      await executor.execute(workflow);

      expect(results).toHaveLength(3);
      expect(results).toContain('sync-listener');
      expect(results).toContain('async-listener');
      expect(results).toContain('sync-listener-2');
    });

    it('should handle async listener that modifies external state', async () => {
      const workflow = new Workflow('state-workflow', 'State Workflow');
      const node1 = new AddNode('node1');
      const node2 = new AddNode('node2');

      workflow['_nodes'].set('node1', node1);
      workflow['_nodes'].set('node2', node2);
      workflow['_graph'].addNode('node1');
      workflow['_graph'].addNode('node2');

      const nodeExecutionLog: Array<{ nodeId: string; timestamp: number }> = [];

      executor.on('onNodeComplete', async (nodeId) => {
        // Simulate async logging to external system
        await new Promise((resolve) => setTimeout(resolve, 5));
        nodeExecutionLog.push({
          nodeId,
          timestamp: Date.now(),
        });
      });

      await executor.execute(workflow);

      // Log should contain both nodes (order may vary)
      expect(nodeExecutionLog).toHaveLength(2);
      const nodeIds = nodeExecutionLog.map((log) => log.nodeId);
      expect(nodeIds).toContain('node1');
      expect(nodeIds).toContain('node2');
    });

    it('should propagate async listener errors', async () => {
      const workflow = new Workflow('error-listener-workflow', 'Error Listener Workflow');
      const node = new AddNode('node1');

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      executor.on('onNodeStart', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error('Async listener failed');
      });

      const result = await executor.execute(workflow);

      // Execution should fail due to async listener error
      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Async listener failed');
    });

    it('should handle async beforeExecute and afterExecute events', async () => {
      const workflow = new Workflow('before-after-workflow', 'Before After Workflow');
      const node = new AddNode('node1');

      workflow['_nodes'].set('node1', node);
      workflow['_graph'].addNode('node1');

      const events: string[] = [];

      executor.on('beforeExecute', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push('before');
      });

      executor.on('afterExecute', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push('after');
      });

      await executor.execute(workflow);

      expect(events).toEqual(['before', 'after']);
    });

    it('should wait for async listeners even when execution fails', async () => {
      const workflow = new Workflow('fail-workflow', 'Fail Workflow');
      const errorNode = new ErrorNode('error-node');

      workflow['_nodes'].set('error-node', errorNode);
      workflow['_graph'].addNode('error-node');

      const events: string[] = [];

      executor.on('onNodeError', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push('error-handled');
      });

      executor.on('afterExecute', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        events.push('after-executed');
      });

      const result = await executor.execute(workflow);

      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(events).toContain('error-handled');
      expect(events).toContain('after-executed');
    });
  });
});
