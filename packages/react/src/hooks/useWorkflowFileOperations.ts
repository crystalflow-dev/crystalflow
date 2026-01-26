import { useCallback } from 'react';
import { Node as ReactFlowNode, Edge } from 'reactflow';
import { saveWorkflowToFile, loadWorkflowFromFile } from '../utils/workflowConverter';

/**
 * Hook for workflow file operations (save/load)
 */
export function useWorkflowFileOperations() {
  const saveWorkflow = useCallback(
    (nodes: ReactFlowNode[], edges: Edge[], filename = 'my-workflow') => {
      try {
        saveWorkflowToFile(nodes, edges, filename);
        console.log('Workflow saved successfully');
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
      console.log(`Workflow "${workflowName}" loaded successfully`);
      return { success: true, nodes, edges, workflowName };
    } catch (error) {
      console.error('Failed to load workflow:', error);
      return { success: false, error };
    }
  }, []);

  return {
    saveWorkflow,
    loadWorkflow,
  };
}
