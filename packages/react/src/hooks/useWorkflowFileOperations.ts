import { useCallback } from 'react';
import { Node as ReactFlowNode, Edge } from '@xyflow/react';
import {
  saveWorkflowToFile,
  loadWorkflowFromFile,
  loadWorkflowFromData,
} from '../utils/workflowConverter';
import { WorkflowData } from '@crystalflow/types';

/**
 * Hook for workflow file operations (save/load)
 */
export function useWorkflowFileOperations() {
  const saveWorkflow = useCallback(
    (nodes: ReactFlowNode[], edges: Edge[], filename = 'my-workflow') => {
      try {
        saveWorkflowToFile(nodes, edges, filename);
        return { success: true };
      } catch (error) {
        console.error('Failed to save workflow:', error);
        return { success: false, error };
      }
    },
    []
  );

  const loadWorkflow = useCallback(async () => {
    try {
      const { nodes, edges, workflowName } = await loadWorkflowFromFile();
      return { success: true, nodes, edges, workflowName };
    } catch (error) {
      console.error('Failed to load workflow:', error);
      return { success: false, error };
    }
  }, []);

  const loadFromData = useCallback((workflowData: WorkflowData) => {
    try {
      const { nodes, edges, workflowName } = loadWorkflowFromData(workflowData);
      return { success: true, nodes, edges, workflowName };
    } catch (error) {
      console.error('Failed to load workflow from data:', error);
      return { success: false, error };
    }
  }, []);

  return {
    saveWorkflow,
    loadWorkflow,
    loadFromData,
  };
}
