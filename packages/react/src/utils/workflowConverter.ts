/**
 * Utilities for converting between React Flow and ReactFlo Workflow formats
 */

import { Node as ReactFlowNode, Edge } from 'reactflow';
import { Workflow, serializeWorkflow, deserializeWorkflow, NodeConstructor } from '@reactflo/core';
import { WorkflowData } from '@reactflo/types';
import { convertNodeToReactFlow } from './nodeConverter';

/**
 * Convert React Flow nodes and edges to ReactFlo Workflow
 */
export function reactFlowToWorkflow(
  nodes: ReactFlowNode[],
  edges: Edge[],
  workflowId?: string,
  workflowName?: string
): Workflow {
  const workflow = new Workflow(workflowId, workflowName);

  // Add nodes to workflow
  nodes.forEach((rfNode) => {
    const nodeType = rfNode.data.type;
    if (!nodeType) {
      console.warn(`Node ${rfNode.id} missing type, skipping`);
      return;
    }

    try {
      // Add node to workflow using its type string
      const node = workflow.addNode(nodeType, {
        id: rfNode.id,
        position: rfNode.position,
      });

      // Set input values from node data
      if (rfNode.data.inputs) {
        Object.keys(rfNode.data.inputs).forEach((inputKey) => {
          if (rfNode.data[inputKey] !== undefined) {
            node[inputKey] = rfNode.data[inputKey];
          }
        });
      }
    } catch (error) {
      console.error(`Failed to add node ${rfNode.id} of type ${nodeType}:`, error);
      throw error;
    }
  });

  // Add connections
  edges.forEach((edge) => {
    if (edge.source && edge.target && edge.sourceHandle && edge.targetHandle) {
      try {
        workflow.connect(edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
      } catch (error) {
        console.error(`Failed to create connection ${edge.id}:`, error);
        throw error;
      }
    }
  });

  return workflow;
}

/**
 * Convert ReactFlo Workflow to React Flow nodes and edges
 */
export function workflowToReactFlow(workflow: Workflow): {
  nodes: ReactFlowNode[];
  edges: Edge[];
} {
  const nodes: ReactFlowNode[] = [];
  const edges: Edge[] = [];

  // Convert workflow nodes to React Flow nodes
  workflow.nodes.forEach((node, nodeId) => {
    const nodeClass = node.constructor as NodeConstructor;
    const position =
      node.position &&
      typeof node.position === 'object' &&
      'x' in node.position &&
      'y' in node.position
        ? (node.position as { x: number; y: number })
        : { x: 0, y: 0 };

    try {
      // Create React Flow node using the converter
      const rfNode = convertNodeToReactFlow(nodeClass, nodeId, position);

      // Copy actual values from the node instance
      const nodeData = node.toJSON ? node.toJSON() : {};
      rfNode.data = {
        ...rfNode.data,
        ...nodeData,
      };

      nodes.push(rfNode);
    } catch (error) {
      console.error(`Failed to convert node ${nodeId}:`, error);
      throw error;
    }
  });

  // Convert workflow connections to React Flow edges
  workflow.connections.forEach((connection, connectionId) => {
    edges.push({
      id: connectionId,
      source: connection.sourceNodeId,
      sourceHandle: connection.sourcePort,
      target: connection.targetNodeId,
      targetHandle: connection.targetPort,
      type: 'smoothstep',
    });
  });

  return { nodes, edges };
}

/**
 * Save workflow to JSON file
 */
export function saveWorkflowToFile(
  nodes: ReactFlowNode[],
  edges: Edge[],
  workflowName?: string
): void {
  try {
    // Convert to workflow
    const workflow = reactFlowToWorkflow(
      nodes,
      edges,
      undefined,
      workflowName || 'Untitled Workflow'
    );

    // Serialize to JSON
    const json = serializeWorkflow(workflow.toJSON());

    // Create blob and download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName || 'workflow'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to save workflow:', error);
    throw error;
  }
}

/**
 * Load workflow from JSON file
 */
export function loadWorkflowFromFile(): Promise<{
  nodes: ReactFlowNode[];
  edges: Edge[];
  workflowName: string;
}> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      try {
        const text = await file.text();
        const workflowData: WorkflowData = deserializeWorkflow(text);

        // Create workflow from JSON
        const workflow = Workflow.fromJSON(workflowData);

        // Convert to React Flow format
        const { nodes, edges } = workflowToReactFlow(workflow);

        resolve({
          nodes,
          edges,
          workflowName: workflow.name,
        });
      } catch (error) {
        console.error('Failed to load workflow:', error);
        reject(error);
      }
    };

    input.click();
  });
}
