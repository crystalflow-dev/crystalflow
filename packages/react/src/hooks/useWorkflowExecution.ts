import { useCallback } from 'react';
import { Node as ReactFlowNode, Edge } from 'reactflow';
import { Workflow } from '@reactflo/core';

/**
 * Hook for workflow execution logic
 */
export function useWorkflowExecution() {
  const executeWorkflow = useCallback(async (nodes: ReactFlowNode[], edges: Edge[]) => {
    try {
      console.log('Executing workflow with nodes:', nodes);
      console.log('Edges:', edges);

      // Create a new Workflow instance
      const workflow = new Workflow();

      // Add nodes to workflow
      nodes.forEach((rfNode) => {
        const nodeType = rfNode.data.type;
        if (!nodeType) {
          console.error(`Node ${rfNode.id} missing type`);
          return;
        }

        // Prepare property values for node configuration
        const propertyData: Record<string, unknown> = {};
        if (rfNode.data.properties) {
          Object.keys(rfNode.data.properties).forEach((propKey) => {
            if (rfNode.data[propKey] !== undefined) {
              propertyData[propKey] = rfNode.data[propKey];
            }
          });
        }

        // Add node to workflow using its type string and property configuration
        workflow.addNode(nodeType, {
          id: rfNode.id,
          position: rfNode.position,
          data: propertyData,
        });
      });

      // Add connections
      edges.forEach((edge) => {
        if (edge.source && edge.target && edge.sourceHandle && edge.targetHandle) {
          workflow.connect(edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
        }
      });

      // Execute the workflow
      console.log('Starting workflow execution...');
      const result = await workflow.execute();

      console.log('Workflow execution completed:', result);
      console.log('Node results:', result.nodeResults);

      return result;
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  }, []);

  return {
    executeWorkflow,
  };
}
