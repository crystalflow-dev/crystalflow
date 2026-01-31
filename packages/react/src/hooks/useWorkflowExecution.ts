import { useCallback } from 'react';
import { Node as ReactFlowNode, Edge } from '@xyflow/react';
import { Workflow } from '@reactflo/core';
import { CustomNodeData } from '../components/Node/CustomNode';

/**
 * Hook for workflow execution logic
 */
export function useWorkflowExecution() {
  const executeWorkflow = useCallback(async (nodes: ReactFlowNode[], edges: Edge[]) => {
    try {
      // Create a new Workflow instance
      const workflow = new Workflow();

      // Add nodes to workflow
      nodes.forEach((rfNode) => {
        const nodeData = rfNode.data as CustomNodeData;
        const nodeTypeName = nodeData.type;
        if (!nodeTypeName) {
          console.error(`Node ${rfNode.id} missing type`);
          return;
        }

        // Prepare property values for node configuration
        const propertyData: Record<string, unknown> = {};
        if (nodeData.properties) {
          Object.keys(nodeData.properties).forEach((propKey) => {
            if (nodeData[propKey] !== undefined) {
              propertyData[propKey] = nodeData[propKey];
            }
          });
        }

        // Add node to workflow using the node type string and property configuration
        workflow.addNode(nodeTypeName, {
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
      const result = await workflow.execute();

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
