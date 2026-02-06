import { useCallback } from 'react';
import { Node as ReactFlowNode, Edge } from '@xyflow/react';
import { Workflow, Executor } from '@crystalflow/core';
import { CustomNodeData } from '../components/Node/CustomNode';

/**
 * Options for workflow execution
 */
export interface WorkflowExecutionOptions {
  executor?: Executor;
  timeout?: number;
  variables?: Record<string, unknown>;
}

/**
 * Hook for workflow execution logic
 */
export function useWorkflowExecution() {
  const executeWorkflow = useCallback(
    async (nodes: ReactFlowNode[], edges: Edge[], options?: WorkflowExecutionOptions) => {
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

        // Execute the workflow with custom executor if provided
        let result;
        if (options?.executor) {
          result = await options.executor.execute(workflow, {
            timeout: options.timeout,
            variables: options.variables,
          });
        } else {
          result = await workflow.execute({
            timeout: options?.timeout,
            variables: options?.variables,
          });
        }

        return result;
      } catch (error) {
        console.error('Workflow execution failed:', error);
        throw error;
      }
    },
    []
  );

  return {
    executeWorkflow,
  };
}
