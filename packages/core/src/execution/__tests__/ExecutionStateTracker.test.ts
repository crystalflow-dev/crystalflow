/**
 * ExecutionStateTracker Tests
 */

import { ExecutionStateTracker } from '../ExecutionStateTracker';

describe('ExecutionStateTracker', () => {
  let tracker: ExecutionStateTracker;
  const executionId = 'test-exec-123';
  const workflowId = 'workflow-456';

  beforeEach(() => {
    tracker = new ExecutionStateTracker(executionId, workflowId);
  });

  describe('initialization', () => {
    it('should initialize with correct IDs', () => {
      expect(tracker.getExecutionId()).toBe(executionId);
      expect(tracker.getWorkflowId()).toBe(workflowId);
    });

    it('should start with isExecuting false', () => {
      expect(tracker.isExecuting()).toBe(false);
    });

    it('should have no current node', () => {
      expect(tracker.getCurrentNodeId()).toBeNull();
    });

    it('should have empty node states', () => {
      expect(tracker.getAllNodeStates().size).toBe(0);
    });

    it('should have empty connection states', () => {
      expect(tracker.getAllConnectionStates().size).toBe(0);
    });

    it('should have zero progress', () => {
      const progress = tracker.getProgress();
      expect(progress.current).toBe(0);
      expect(progress.total).toBe(0);
    });
  });

  describe('startExecution', () => {
    it('should set isExecuting to true', () => {
      tracker.startExecution(['node1', 'node2']);
      expect(tracker.isExecuting()).toBe(true);
    });

    it('should set execution order', () => {
      const order = ['node1', 'node2', 'node3'];
      tracker.startExecution(order);
      expect(tracker.getExecutionOrder()).toEqual(order);
    });

    it('should NOT pre-queue all nodes (for conditional branch support)', () => {
      tracker.startExecution(['node1', 'node2', 'node3']);
      // Nodes should be idle until explicitly queued
      expect(tracker.getNodeState('node1')).toBe('idle');
      expect(tracker.getNodeState('node2')).toBe('idle');
      expect(tracker.getNodeState('node3')).toBe('idle');
    });

    it('should set progress total', () => {
      tracker.startExecution(['node1', 'node2', 'node3']);
      const progress = tracker.getProgress();
      expect(progress.current).toBe(0);
      expect(progress.total).toBe(3);
    });

    it('should set start time', () => {
      tracker.startExecution(['node1']);
      const state = tracker.getState();
      expect(state.startTime).toBeInstanceOf(Date);
    });
  });

  describe('setNodeState', () => {
    beforeEach(() => {
      tracker.startExecution(['node1', 'node2']);
    });

    it('should update node state', () => {
      tracker.setNodeState('node1', 'running');
      expect(tracker.getNodeState('node1')).toBe('running');
    });

    it('should set current node when state is running', () => {
      tracker.setNodeState('node1', 'running');
      expect(tracker.getCurrentNodeId()).toBe('node1');
    });

    it('should increment progress when node succeeds', () => {
      tracker.setNodeState('node1', 'running');
      tracker.setNodeState('node1', 'success');
      const progress = tracker.getProgress();
      expect(progress.current).toBe(1);
    });

    it('should increment progress when node errors', () => {
      tracker.setNodeState('node1', 'running');
      tracker.setNodeState('node1', 'error');
      const progress = tracker.getProgress();
      expect(progress.current).toBe(1);
    });

    it('should clear current node when it completes', () => {
      tracker.setNodeState('node1', 'running');
      expect(tracker.getCurrentNodeId()).toBe('node1');
      tracker.setNodeState('node1', 'success');
      expect(tracker.getCurrentNodeId()).toBeNull();
    });

    it('should handle multiple node state transitions', () => {
      tracker.setNodeState('node1', 'running');
      tracker.setNodeState('node1', 'success');
      tracker.setNodeState('node2', 'running');
      tracker.setNodeState('node2', 'error');

      expect(tracker.getNodeState('node1')).toBe('success');
      expect(tracker.getNodeState('node2')).toBe('error');
      expect(tracker.getProgress().current).toBe(2);
    });
  });

  describe('setNodeOutput', () => {
    it('should store node outputs', () => {
      const outputs = { result: 42, message: 'success' };
      tracker.setNodeOutput('node1', outputs);
      expect(tracker.getNodeOutputs('node1')).toEqual(outputs);
    });

    it('should return undefined for non-existent node', () => {
      expect(tracker.getNodeOutputs('nonexistent')).toBeUndefined();
    });

    it('should update existing outputs', () => {
      tracker.setNodeOutput('node1', { value: 1 });
      tracker.setNodeOutput('node1', { value: 2 });
      expect(tracker.getNodeOutputs('node1')).toEqual({ value: 2 });
    });
  });

  describe('connection tracking', () => {
    it('should activate a connection', () => {
      tracker.setConnectionActive('conn1', 'node1', 'output1', 'node2', 'input1', { value: 42 });

      const connection = tracker.getConnectionState('conn1');
      expect(connection).toBeDefined();
      expect(connection?.state).toBe('active');
      expect(connection?.sourceNodeId).toBe('node1');
      expect(connection?.targetNodeId).toBe('node2');
      expect(connection?.data).toEqual({ value: 42 });
    });

    it('should set activation timestamp', () => {
      tracker.setConnectionActive('conn1', 'node1', 'out', 'node2', 'in');
      const connection = tracker.getConnectionState('conn1');
      expect(connection?.activatedAt).toBeInstanceOf(Date);
    });

    it('should mark connection as completed', () => {
      tracker.setConnectionActive('conn1', 'node1', 'out', 'node2', 'in');
      tracker.setConnectionCompleted('conn1');

      const connection = tracker.getConnectionState('conn1');
      expect(connection?.state).toBe('completed');
      expect(connection?.completedAt).toBeInstanceOf(Date);
    });

    it('should handle non-existent connection completion gracefully', () => {
      expect(() => {
        tracker.setConnectionCompleted('nonexistent');
      }).not.toThrow();
    });

    it('should track multiple connections', () => {
      tracker.setConnectionActive('conn1', 'node1', 'out', 'node2', 'in', 1);
      tracker.setConnectionActive('conn2', 'node2', 'out', 'node3', 'in', 2);

      expect(tracker.getAllConnectionStates().size).toBe(2);
      expect(tracker.getConnectionState('conn1')?.data).toBe(1);
      expect(tracker.getConnectionState('conn2')?.data).toBe(2);
    });
  });

  describe('completeExecution', () => {
    beforeEach(() => {
      tracker.startExecution(['node1']);
      tracker.setNodeState('node1', 'running');
    });

    it('should set isExecuting to false', () => {
      tracker.completeExecution();
      expect(tracker.isExecuting()).toBe(false);
    });

    it('should clear current node', () => {
      tracker.completeExecution();
      expect(tracker.getCurrentNodeId()).toBeNull();
    });

    it('should set end time', () => {
      tracker.completeExecution();
      const state = tracker.getState();
      expect(state.endTime).toBeInstanceOf(Date);
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      tracker.startExecution(['node1', 'node2']);
      tracker.setNodeState('node1', 'running');
      tracker.setNodeState('node1', 'success');
      tracker.setNodeOutput('node1', { result: 42 });
      tracker.setConnectionActive('conn1', 'node1', 'out', 'node2', 'in');
    });

    it('should reset all state', () => {
      tracker.reset();

      expect(tracker.isExecuting()).toBe(false);
      expect(tracker.getCurrentNodeId()).toBeNull();
      expect(tracker.getAllNodeStates().size).toBe(0);
      expect(tracker.getAllConnectionStates().size).toBe(0);
      expect(tracker.getAllNodeOutputs().size).toBe(0);
      expect(tracker.getProgress()).toEqual({ current: 0, total: 0 });
      expect(tracker.getExecutionOrder()).toEqual([]);
    });

    it('should preserve execution and workflow IDs', () => {
      tracker.reset();
      expect(tracker.getExecutionId()).toBe(executionId);
      expect(tracker.getWorkflowId()).toBe(workflowId);
    });
  });

  describe('getState', () => {
    it('should return complete state snapshot', () => {
      tracker.startExecution(['node1', 'node2']);
      tracker.setNodeState('node1', 'running');
      tracker.setNodeOutput('node1', { value: 1 });
      tracker.setConnectionActive('conn1', 'node1', 'out', 'node2', 'in');

      const state = tracker.getState();

      expect(state.executionId).toBe(executionId);
      expect(state.workflowId).toBe(workflowId);
      expect(state.isExecuting).toBe(true);
      expect(state.currentNodeId).toBe('node1');
      expect(state.nodeStates.get('node1')).toBe('running');
      expect(state.nodeOutputs.get('node1')).toEqual({ value: 1 });
      expect(state.connectionStates.has('conn1')).toBe(true);
    });

    it('should return a copy of the state', () => {
      tracker.startExecution(['node1']);
      const state1 = tracker.getState();
      const state2 = tracker.getState();

      // Should be equal but not the same reference
      expect(state1).not.toBe(state2);
      expect(state1.nodeStates).not.toBe(state2.nodeStates);
    });
  });

  describe('serialization', () => {
    beforeEach(() => {
      tracker.startExecution(['node1', 'node2']);
      tracker.setNodeState('node1', 'running');
      tracker.setNodeState('node1', 'success');
      tracker.setNodeOutput('node1', { result: 42 });
      tracker.setConnectionActive('conn1', 'node1', 'out', 'node2', 'in', 100);
      tracker.setConnectionCompleted('conn1');
    });

    it('should serialize to JSON', () => {
      const json = tracker.toJSON();

      expect(json.executionId).toBe(executionId);
      expect(json.workflowId).toBe(workflowId);
      expect(json.isExecuting).toBe(true);
      expect(json.nodeStates.node1).toBe('success');
      expect(json.nodeOutputs.node1).toEqual({ result: 42 });
      expect(json.connectionStates.conn1.state).toBe('completed');
    });

    it('should deserialize from JSON', () => {
      const json = tracker.toJSON();
      const restored = ExecutionStateTracker.fromJSON(json);

      expect(restored.getExecutionId()).toBe(executionId);
      expect(restored.getWorkflowId()).toBe(workflowId);
      expect(restored.isExecuting()).toBe(true);
      expect(restored.getNodeState('node1')).toBe('success');
      expect(restored.getNodeOutputs('node1')).toEqual({ result: 42 });
      expect(restored.getConnectionState('conn1')?.state).toBe('completed');
    });

    it('should serialize and deserialize timestamps', () => {
      tracker.completeExecution();
      const json = tracker.toJSON();
      const restored = ExecutionStateTracker.fromJSON(json);

      const originalState = tracker.getState();
      const restoredState = restored.getState();

      expect(restoredState.startTime).toBeInstanceOf(Date);
      expect(restoredState.endTime).toBeInstanceOf(Date);
      expect(restoredState.startTime?.getTime()).toBe(originalState.startTime?.getTime());
      expect(restoredState.endTime?.getTime()).toBe(originalState.endTime?.getTime());
    });
  });

  describe('edge cases', () => {
    it('should handle querying non-existent node state', () => {
      expect(tracker.getNodeState('nonexistent')).toBe('idle');
    });

    it('should handle empty execution order', () => {
      tracker.startExecution([]);
      expect(tracker.getProgress()).toEqual({ current: 0, total: 0 });
    });

    it('should handle setting state for non-queued nodes', () => {
      tracker.setNodeState('random-node', 'success');
      expect(tracker.getNodeState('random-node')).toBe('success');
    });
  });
});
