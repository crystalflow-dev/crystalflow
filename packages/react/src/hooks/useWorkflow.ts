import { useState, useCallback } from 'react';
import { Workflow, Node } from '@crystalflow/core';
import type { WorkflowData, ExecutionResult, ExecutionOptions } from '@crystalflow/types';

/**
 * Hook for managing workflow state
 *
 * Provides state and actions for working with a Workflow instance.
 *
 * @example
 * ```tsx
 * const {
 *   workflow,
 *   addNode,
 *   removeNode,
 *   connect,
 *   execute
 * } = useWorkflow();
 * ```
 */
export const useWorkflow = (initialWorkflow?: Workflow) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(initialWorkflow || null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(() => {
    const newWorkflow = new Workflow();
    setWorkflow(newWorkflow);
    return newWorkflow;
  }, []);

  const addNode = useCallback(
    (nodeType: string, options?: { position?: { x: number; y: number } }): string => {
      if (!workflow) {
        const newWorkflow = createWorkflow();
        const node = newWorkflow.addNode(nodeType, options);
        return node.id;
      }
      const node = workflow.addNode(nodeType, options);
      return node.id;
    },
    [workflow, createWorkflow]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      if (!workflow) return;
      workflow.removeNode(nodeId);
    },
    [workflow]
  );

  const updateNode = useCallback(
    (nodeId: string, data: Partial<Node>) => {
      if (!workflow) return;
      const node = workflow.getNode(nodeId);
      if (node) {
        Object.assign(node, data);
      }
    },
    [workflow]
  );

  const connect = useCallback(
    (sourceNodeId: string, sourcePort: string, targetNodeId: string, targetPort: string) => {
      if (!workflow) return;
      workflow.connect(sourceNodeId, sourcePort, targetNodeId, targetPort);
    },
    [workflow]
  );

  const disconnect = useCallback(
    (connectionId: string) => {
      if (!workflow) return;
      workflow.removeConnection(connectionId);
    },
    [workflow]
  );

  const execute = useCallback(
    async (options?: ExecutionOptions) => {
      if (!workflow) {
        throw new Error('No workflow to execute');
      }

      setIsExecuting(true);
      setError(null);

      try {
        const result = await workflow.execute(options);
        setExecutionResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsExecuting(false);
      }
    },
    [workflow]
  );

  const clear = useCallback(() => {
    setWorkflow(null);
    setExecutionResult(null);
    setError(null);
  }, []);

  const exportJSON = useCallback((): WorkflowData | null => {
    if (!workflow) return null;
    return workflow.toJSON();
  }, [workflow]);

  const importJSON = useCallback((json: WorkflowData) => {
    const newWorkflow = Workflow.fromJSON(json);
    setWorkflow(newWorkflow);
  }, []);

  return {
    workflow,
    setWorkflow,
    createWorkflow,
    addNode,
    removeNode,
    updateNode,
    connect,
    disconnect,
    execute,
    clear,
    exportJSON,
    importJSON,
    isExecuting,
    executionResult,
    error,
  };
};
