/**
 * Utilities for converting between React Flow and CrystalFlow Workflow formats
 */

import { Node as ReactFlowNode, Edge } from '@xyflow/react';
import {
  Workflow,
  serializeWorkflow,
  deserializeWorkflow,
  NodeConstructor,
} from '@crystalflow/core';
import { WorkflowData } from '@crystalflow/types';
import { convertNodeToReactFlow } from './nodeConverter';
import { CustomNodeData } from '../components/Node/CustomNode';

/**
 * Convert React Flow nodes and edges to CrystalFlow Workflow
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
    const nodeData = rfNode.data as CustomNodeData;
    const nodeTypeName = nodeData.type;
    if (!nodeTypeName) {
      console.warn(`Node ${rfNode.id} missing type, skipping`);
      return;
    }

    try {
      // Add node to workflow using the node type string
      const node = workflow.addNode(nodeTypeName, {
        id: rfNode.id,
        position: rfNode.position,
      });

      // Copy the property values edited on the canvas. Inputs are left alone: they are filled at run time.
      if (rfNode.data.properties) {
        Object.keys(rfNode.data.properties).forEach((propKey) => {
          if (rfNode.data[propKey] !== undefined) {
            node[propKey] = rfNode.data[propKey];
          }
        });
      }
    } catch (error) {
      console.error(`Failed to add node ${rfNode.id} of type ${nodeTypeName}:`, error);
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
 * Convert CrystalFlow Workflow to React Flow nodes and edges
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

      const nodeData: Record<string, unknown> = node.toJSON ? node.toJSON() : {};
      const savedData = (nodeData.data as Record<string, unknown> | undefined) ?? {};
      // Lift the saved property values to where the property panel and execution read them.
      // Inputs stay out: they are filled at run time.
      const properties = (rfNode.data.properties as Record<string, unknown> | undefined) ?? {};
      const savedValues = Object.fromEntries(
        Object.entries(savedData).filter(([key]) => key in properties)
      );
      rfNode.data = {
        ...rfNode.data,
        ...savedValues,
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

        // Use the shared loadWorkflowFromData function
        const result = loadWorkflowFromData(workflowData);
        resolve(result);
      } catch (error) {
        console.error('Failed to load workflow:', error);
        reject(error);
      }
    };

    input.click();
  });
}

/**
 * Load workflow from WorkflowData object
 * This is the core loading logic shared by both file loading and initial workflow loading
 */
export function loadWorkflowFromData(workflowData: WorkflowData): {
  nodes: ReactFlowNode[];
  edges: Edge[];
  workflowName: string;
} {
  try {
    // Create workflow from JSON
    const workflow = Workflow.fromJSON(workflowData);

    // Convert to React Flow format
    const { nodes, edges } = workflowToReactFlow(workflow);

    return {
      nodes,
      edges,
      workflowName: workflow.name,
    };
  } catch (error) {
    console.error('Failed to load workflow from data:', error);
    throw error;
  }
}
