import React, { createContext, useContext, useState, useCallback } from 'react';
import { Workflow, Node } from '@crystalflow/core';
import type { WorkflowData, ExecutionResult } from '@crystalflow/types';

/**
 * Workflow context state
 */
export interface WorkflowContextState {
  /**
   * Current workflow instance
   */
  workflow: Workflow | null;

  /**
   * Set workflow instance
   */
  setWorkflow: (workflow: Workflow | null) => void;

  /**
   * Add node to workflow
   */
  addNode: (nodeType: string, options?: { position?: { x: number; y: number } }) => string;

  /**
   * Remove node from workflow
   */
  removeNode: (nodeId: string) => void;

  /**
   * Update node data
   */
  updateNode: (nodeId: string, data: Partial<Node>) => void;

  /**
   * Connect two nodes
   */
  connectNodes: (
    sourceNodeId: string,
    sourcePort: string,
    targetNodeId: string,
    targetPort: string
  ) => void;

  /**
   * Disconnect two nodes
   */
  disconnectNodes: (connectionId: string) => void;

  /**
   * Execute workflow
   */
  executeWorkflow: () => Promise<ExecutionResult>;

  /**
   * Clear workflow
   */
  clearWorkflow: () => void;

  /**
   * Export workflow to JSON
   */
  exportWorkflow: () => WorkflowData | null;

  /**
   * Import workflow from JSON
   */
  importWorkflow: (json: WorkflowData) => void;
}

/**
 * Workflow context
 */
const WorkflowContext = createContext<WorkflowContextState | undefined>(undefined);

/**
 * WorkflowProvider Props
 */
export interface WorkflowProviderProps {
  children: React.ReactNode;
  initialWorkflow?: Workflow;
}

/**
 * WorkflowProvider component
 *
 * Provides workflow state and actions to child components.
 *
 * @example
 * ```tsx
 * <WorkflowProvider>
 *   <WorkflowBuilder nodes={[AddNode]} />
 * </WorkflowProvider>
 * ```
 */
export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
  children,
  initialWorkflow,
}) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(initialWorkflow || null);

  const addNode = useCallback(
    (nodeType: string, options?: { position?: { x: number; y: number } }): string => {
      if (!workflow) {
        throw new Error('No workflow instance');
      }

      const node = workflow.addNode(nodeType, options);
      return node.id;
    },
    [workflow]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      if (!workflow) {
        throw new Error('No workflow instance');
      }
      workflow.removeNode(nodeId);
    },
    [workflow]
  );

  const updateNode = useCallback(
    (nodeId: string, data: Partial<Node>) => {
      if (!workflow) {
        throw new Error('No workflow instance');
      }
      const node = workflow.getNode(nodeId);
      if (node) {
        Object.assign(node, data);
      }
    },
    [workflow]
  );

  const connectNodes = useCallback(
    (sourceNodeId: string, sourcePort: string, targetNodeId: string, targetPort: string) => {
      if (!workflow) {
        throw new Error('No workflow instance');
      }
      workflow.connect(sourceNodeId, sourcePort, targetNodeId, targetPort);
    },
    [workflow]
  );

  const disconnectNodes = useCallback(
    (connectionId: string) => {
      if (!workflow) {
        throw new Error('No workflow instance');
      }
      workflow.removeConnection(connectionId);
    },
    [workflow]
  );

  const executeWorkflow = useCallback(async () => {
    if (!workflow) {
      throw new Error('No workflow instance');
    }
    return await workflow.execute();
  }, [workflow]);

  const clearWorkflow = useCallback(() => {
    setWorkflow(null);
  }, []);

  const exportWorkflow = useCallback((): WorkflowData | null => {
    if (!workflow) {
      return null;
    }
    return workflow.toJSON();
  }, [workflow]);

  const importWorkflow = useCallback((json: WorkflowData) => {
    const newWorkflow = Workflow.fromJSON(json);
    setWorkflow(newWorkflow);
  }, []);

  const value: WorkflowContextState = {
    workflow,
    setWorkflow,
    addNode,
    removeNode,
    updateNode,
    connectNodes,
    disconnectNodes,
    executeWorkflow,
    clearWorkflow,
    exportWorkflow,
    importWorkflow,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

/**
 * useWorkflowContext hook
 *
 * Access workflow context from any child component.
 *
 * @example
 * ```tsx
 * const { workflow, addNode, executeWorkflow } = useWorkflowContext();
 * ```
 */
export const useWorkflowContext = (): WorkflowContextState => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within WorkflowProvider');
  }
  return context;
};
