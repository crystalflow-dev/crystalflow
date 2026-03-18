/**
 * useExecutionVisuals Hook
 *
 * Subscribes to core execution state events and transforms them into
 * React Flow visual states for nodes and edges.
 *
 * This hook bridges the framework-agnostic core execution state with
 * React Flow's visual representation.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Node as ReactFlowNode } from '@xyflow/react';
import { Executor, Connection } from '@crystalflow/core';
import { ExecutionState, ConnectionExecutionState, NodeExecutionStatus } from '@crystalflow/types';

/**
 * Edge visual state for React Flow
 */
export interface EdgeVisualState {
  isActive: boolean;
  isCompleted: boolean;
  animationDelay?: number;
}

/**
 * Node visual data for React Flow
 */
export interface NodeVisualData {
  executionStatus: NodeExecutionStatus;
  outputs?: Record<string, unknown>;
  isCurrentlyExecuting?: boolean;
}

/**
 * React Flow execution state
 */
export interface ReactFlowExecutionState {
  edgeStates: Map<string, EdgeVisualState>;
  nodeVisualData: Map<string, NodeVisualData>;
  executionProgress: { current: number; total: number };
  isExecuting: boolean;
  reset: () => void; // Manual reset function
}

/**
 * Hook options
 */
export interface UseExecutionVisualsOptions {
  /** Whether to auto-reset visual state after execution completes (default: false) */
  autoReset?: boolean;
  /** Delay in ms before auto-reset (default: 3000) */
  autoResetDelay?: number;
  /**
   * How long (ms) to display a node in 'queued' state before showing 'running'.
   * This is the visual pacing delay that was previously baked into the core executor.
   * Set to 0 to disable (default: 0). Recommended: 120ms for good UX.
   */
  nodeTransitionDelay?: number;
  /**
   * Minimum duration (ms) to display a connection as active.
   * Ensures the animated edge is visible even for very fast data transfers.
   * Set to 0 to disable (default: 0). Recommended: 100ms for good UX.
   */
  connectionActiveDuration?: number;
}

/**
 * useExecutionVisuals Hook
 *
 * Subscribes to executor events and provides visual state for React Flow.
 *
 * @param executor - The executor instance to monitor
 * @param nodes - React Flow nodes (for ID mapping)
 * @param connections - Workflow connections (for edge ID mapping)
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const { edgeStates, nodeVisualData, isExecuting } = useExecutionVisuals(
 *   executor,
 *   nodes,
 *   workflow.connections,
 *   { autoReset: true, autoResetDelay: 3000 }
 * );
 *
 * // Use in edge styling
 * const styledEdges = edges.map(edge => ({
 *   ...edge,
 *   className: edgeStates.get(edge.id)?.isActive ? 'edge-active' : undefined
 * }));
 *
 * // Use in node data
 * const styledNodes = nodes.map(node => ({
 *   ...node,
 *   data: {
 *     ...node.data,
 *     executionStatus: nodeVisualData.get(node.id)?.executionStatus || 'idle'
 *   }
 * }));
 * ```
 */
export function useExecutionVisuals(
  executor: Executor | null,
  nodes: ReactFlowNode[],
  connections: ReadonlyMap<string, Connection>,
  options: UseExecutionVisualsOptions = {},
  version?: number
): ReactFlowExecutionState {
  const {
    autoReset = false,
    autoResetDelay = 3000,
    nodeTransitionDelay = 0,
    connectionActiveDuration = 0,
  } = options;

  // State
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [activeConnectionIds, setActiveConnectionIds] = useState<Set<string>>(new Set());
  const [completedConnectionIds, setCompletedConnectionIds] = useState<Set<string>>(new Set());

  // Refs for pacing logic (stable across renders)
  const stateQueue = useRef<ExecutionState[]>([]);
  const isProcessingQueue = useRef(false);
  const lastQueuedAppliedAt = useRef<number | null>(null);
  const connectionActivatedAt = useRef<Map<string, number>>(new Map());
  const pendingCompletions = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const nodeTransitionDelayRef = useRef(nodeTransitionDelay);
  nodeTransitionDelayRef.current = nodeTransitionDelay;

  // Build connection-to-edge ID map from workflow connections
  // Each workflow connection maps to a React Flow edge ID
  const connectionToEdgeId = useMemo(() => {
    const map = new Map<string, string>();
    connections.forEach((conn) => {
      // Use the same key format as the executor uses for connection tracking
      const connKey = `${conn.sourceNodeId}-${conn.sourcePort}-${conn.targetNodeId}-${conn.targetPort}`;
      // Edge ID is the connection ID itself
      map.set(connKey, conn.id);
    });
    return map;
  }, [connections, version]); // Add version to dependencies

  // Process queued state updates with optional delay between queued→running transitions.
  //
  // The Executor awaits emitAsync() between each onStateChange, so states arrive one at a
  // time — the queue never has multiple items when we first check. We therefore track *when*
  // a queued-state was applied and delay the *next* arriving state by the remaining hold
  // time, giving React time to paint the "queued" visual before transitioning to "running".
  const flushStateQueue = useCallback(() => {
    if (isProcessingQueue.current || stateQueue.current.length === 0) return;
    isProcessingQueue.current = true;

    const processNext = () => {
      const state = stateQueue.current.shift();
      if (!state) {
        isProcessingQueue.current = false;
        return;
      }

      const delay = nodeTransitionDelayRef.current;

      // If we recently applied a queued-state, hold the next update until the
      // visual has been visible long enough — even if it arrived immediately.
      if (delay > 0 && lastQueuedAppliedAt.current !== null) {
        const remaining = delay - (Date.now() - lastQueuedAppliedAt.current);
        if (remaining > 0) {
          stateQueue.current.unshift(state);
          setTimeout(() => {
            lastQueuedAppliedAt.current = null;
            processNext();
          }, remaining);
          return; // isProcessingQueue stays true; new arrivals just queue up
        }
        lastQueuedAppliedAt.current = null;
      }

      setExecutionState(state);

      // Record when a queued-node state is applied so the next update can be held
      if (delay > 0) {
        const hasQueuedNodes = [...state.nodeStates.values()].some((s) => s === 'queued');
        if (hasQueuedNodes) {
          lastQueuedAppliedAt.current = Date.now();
        }
      }

      // Process next state via macrotask so React can commit this render first
      if (stateQueue.current.length > 0) {
        setTimeout(processNext, 0);
      } else {
        isProcessingQueue.current = false;
      }
    };

    processNext();
  }, []);

  // Subscribe to execution state changes
  useEffect(() => {
    if (!executor) return;

    const handleStateChange = (state: ExecutionState) => {
      stateQueue.current.push(state);
      flushStateQueue();
    };

    const handleConnectionActive = (connection: ConnectionExecutionState) => {
      // Map connection to React Flow edge ID using workflow connections
      const connKey = `${connection.sourceNodeId}-${connection.sourcePort}-${connection.targetNodeId}-${connection.targetPort}`;
      const edgeId = connectionToEdgeId.get(connKey);

      if (edgeId) {
        connectionActivatedAt.current.set(edgeId, Date.now());
        setActiveConnectionIds((prev) => new Set(prev).add(edgeId));
      }
    };

    const handleConnectionComplete = (connection: ConnectionExecutionState) => {
      // Map connection to React Flow edge ID using workflow connections
      const connKey = `${connection.sourceNodeId}-${connection.sourcePort}-${connection.targetNodeId}-${connection.targetPort}`;
      const edgeId = connectionToEdgeId.get(connKey);

      if (edgeId) {
        // Cancel any previously scheduled completion for this edge
        const existingTimer = pendingCompletions.current.get(edgeId);
        if (existingTimer !== undefined) clearTimeout(existingTimer);

        const activatedAt = connectionActivatedAt.current.get(edgeId) ?? Date.now();
        const elapsed = Date.now() - activatedAt;
        const remaining = Math.max(0, connectionActiveDuration - elapsed);

        // Delay completion if the edge hasn't been visible long enough
        const completeEdge = () => {
          pendingCompletions.current.delete(edgeId);
          setActiveConnectionIds((prev) => {
            const next = new Set(prev);
            next.delete(edgeId);
            return next;
          });
          setCompletedConnectionIds((prev) => new Set(prev).add(edgeId));
        };

        if (remaining > 0) {
          const timer = setTimeout(completeEdge, remaining);
          pendingCompletions.current.set(edgeId, timer);
        } else {
          completeEdge();
        }
      }
    };

    // Subscribe to events
    executor.on('onStateChange', handleStateChange);
    executor.on('onConnectionActive', handleConnectionActive);
    executor.on('onConnectionComplete', handleConnectionComplete);

    // Cleanup
    return () => {
      executor.off('onStateChange', handleStateChange);
      executor.off('onConnectionActive', handleConnectionActive);
      executor.off('onConnectionComplete', handleConnectionComplete);
      // Clear any pending timers
      pendingCompletions.current.forEach((timer) => clearTimeout(timer));
      pendingCompletions.current.clear();
      stateQueue.current = [];
      isProcessingQueue.current = false;
      lastQueuedAppliedAt.current = null;
    };
  }, [executor, connectionToEdgeId, connectionActiveDuration, flushStateQueue]);

  // Auto-reset after execution completes
  useEffect(() => {
    if (!autoReset || !executionState) return undefined;

    if (!executionState.isExecuting && completedConnectionIds.size > 0) {
      const timeout = setTimeout(() => {
        setExecutionState(null);
        setActiveConnectionIds(new Set());
        setCompletedConnectionIds(new Set());
      }, autoResetDelay);

      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [autoReset, autoResetDelay, executionState, completedConnectionIds.size]);

  // Transform core state to React Flow visual state
  // Note: edgeStates no longer needs edges prop - we track all active/completed edge IDs from events
  const edgeStates = useMemo(() => {
    const states = new Map<string, EdgeVisualState>();

    // Add states for all active and completed connections
    activeConnectionIds.forEach((edgeId) => {
      states.set(edgeId, { isActive: true, isCompleted: false });
    });

    completedConnectionIds.forEach((edgeId) => {
      if (!states.has(edgeId)) {
        states.set(edgeId, { isActive: false, isCompleted: true });
      }
    });

    return states;
  }, [activeConnectionIds, completedConnectionIds]);

  const nodeVisualData = useMemo(() => {
    const data = new Map<string, NodeVisualData>();

    if (!executionState) {
      // No execution state - all nodes idle
      nodes.forEach((node) => {
        data.set(node.id, {
          executionStatus: 'idle',
        });
      });
      return data;
    }

    nodes.forEach((node) => {
      const status = executionState.nodeStates.get(node.id) || 'idle';
      const outputs = executionState.nodeOutputs.get(node.id);
      const isCurrentlyExecuting = executionState.currentNodeId === node.id;

      data.set(node.id, {
        executionStatus: status,
        outputs,
        isCurrentlyExecuting,
      });
    });

    return data;
  }, [nodes, executionState]);

  const executionProgress = useMemo(() => {
    return executionState?.executionProgress || { current: 0, total: 0 };
  }, [executionState]);

  const isExecuting = executionState?.isExecuting || false;

  // Manual reset function (exported for external control)
  const reset = useCallback(() => {
    setExecutionState(null);
    setActiveConnectionIds(new Set());
    setCompletedConnectionIds(new Set());
  }, []);

  return {
    edgeStates,
    nodeVisualData,
    executionProgress,
    isExecuting,
    reset, // Export reset for manual control
  };
}
