/**
 * useExecutionVisuals Hook
 *
 * Subscribes to core execution state events and transforms them into
 * React Flow visual states for nodes and edges.
 *
 * This hook bridges the framework-agnostic core execution state with
 * React Flow's visual representation.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const { autoReset = false, autoResetDelay = 3000 } = options;

  // State
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [activeConnectionIds, setActiveConnectionIds] = useState<Set<string>>(new Set());
  const [completedConnectionIds, setCompletedConnectionIds] = useState<Set<string>>(new Set());

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

  // Subscribe to execution state changes
  useEffect(() => {
    if (!executor) return;

    const handleStateChange = (state: ExecutionState) => {
      setExecutionState(state);
    };

    const handleConnectionActive = (connection: ConnectionExecutionState) => {
      // Map connection to React Flow edge ID using workflow connections
      const connKey = `${connection.sourceNodeId}-${connection.sourcePort}-${connection.targetNodeId}-${connection.targetPort}`;
      const edgeId = connectionToEdgeId.get(connKey);

      if (edgeId) {
        setActiveConnectionIds((prev) => new Set(prev).add(edgeId));
      }
    };

    const handleConnectionComplete = (connection: ConnectionExecutionState) => {
      // Map connection to React Flow edge ID using workflow connections
      const connKey = `${connection.sourceNodeId}-${connection.sourcePort}-${connection.targetNodeId}-${connection.targetPort}`;
      const edgeId = connectionToEdgeId.get(connKey);

      if (edgeId) {
        setActiveConnectionIds((prev) => {
          const next = new Set(prev);
          next.delete(edgeId);
          return next;
        });
        setCompletedConnectionIds((prev) => new Set(prev).add(edgeId));
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
    };
  }, [executor, connectionToEdgeId]);

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
