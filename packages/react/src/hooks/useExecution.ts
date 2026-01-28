import { useState, useCallback } from 'react';
import { Executor, Node } from '@reactflo/core';
import type { Workflow, ExecutionContext } from '@reactflo/core';
import type { ExecutionResult, NodeExecutionResult } from '@reactflo/types';

/**
 * Execution options
 */
export interface ExecutionOptions {
  timeout?: number;
  variables?: Record<string, unknown>;
  signal?: AbortSignal;
}

/**
 * Hook for executing workflows
 *
 * Provides execution control and event handling for workflows.
 *
 * @example
 * ```tsx
 * const { execute, isExecuting, result, error } = useExecution({
 *   onNodeStart: (nodeId) => console.log('Starting', nodeId),
 *   onNodeComplete: (nodeId, result) => console.log('Completed', nodeId),
 * });
 * ```
 */
export const useExecution = (eventHandlers?: {
  onBeforeExecute?: (context: ExecutionContext) => void;
  onAfterExecute?: (result: ExecutionResult) => void;
  onNodeStart?: (nodeId: string, node: Node) => void;
  onNodeComplete?: (nodeId: string, result: NodeExecutionResult) => void;
  onNodeError?: (nodeId: string, error: Error) => void;
  onError?: (error: Error) => void;
}) => {
  const [executor] = useState(() => new Executor());
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (workflow: Workflow, options?: ExecutionOptions) => {
      setIsExecuting(true);
      setError(null);
      setResult(null);

      try {
        // Register event handlers
        if (eventHandlers?.onBeforeExecute) {
          executor.on('beforeExecute', eventHandlers.onBeforeExecute);
        }
        if (eventHandlers?.onAfterExecute) {
          executor.on('afterExecute', eventHandlers.onAfterExecute);
        }
        if (eventHandlers?.onNodeStart) {
          executor.on('onNodeStart', eventHandlers.onNodeStart);
        }
        if (eventHandlers?.onNodeComplete) {
          executor.on('onNodeComplete', eventHandlers.onNodeComplete);
        }
        if (eventHandlers?.onNodeError) {
          executor.on('onNodeError', eventHandlers.onNodeError);
        }
        if (eventHandlers?.onError) {
          executor.on('onError', eventHandlers.onError);
        }

        const executionResult = await executor.execute(workflow, options);
        setResult(executionResult);
        return executionResult;
      } catch (err) {
        const executionError = err instanceof Error ? err : new Error(String(err));
        setError(executionError);
        throw executionError;
      } finally {
        setIsExecuting(false);
      }
    },
    [executor, eventHandlers]
  );

  const cancel = useCallback(() => {
    // TODO: Implement cancellation
    // This will require AbortController support in the executor
  }, []);

  const reset = useCallback(() => {
    setIsExecuting(false);
    setResult(null);
    setError(null);
  }, []);

  return {
    executor,
    execute,
    cancel,
    reset,
    isExecuting,
    result,
    error,
  };
};
