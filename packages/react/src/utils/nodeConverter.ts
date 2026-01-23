import 'reflect-metadata';
import { Node as ReactFlowNode } from 'reactflow';
import { NodeMetadata, PortDefinition } from '@reactflo/types';
import { NodeConstructor } from '@reactflo/core';
import { CustomNodeData } from '../components/Node/CustomNode';

/**
 * Convert a ReactFlo Node class (with decorators) to React Flow node format
 *
 * This utility extracts metadata from @defineNode, @Input, and @Output decorators
 * and transforms it into a React Flow compatible node structure.
 *
 * @param nodeClass - The decorated Node class
 * @param nodeId - Unique identifier for this node instance
 * @param position - Canvas position {x, y}
 * @returns React Flow node object
 */
export function convertNodeToReactFlow(
  nodeClass: NodeConstructor,
  nodeId: string,
  position: { x: number; y: number }
): ReactFlowNode<CustomNodeData> {
  // Get node metadata from decorator
  const metadata: NodeMetadata = Reflect.getMetadata('node:metadata', nodeClass);

  if (!metadata) {
    throw new Error(`Node class ${nodeClass.name} is missing @defineNode decorator`);
  }

  // Get input ports metadata
  const inputPorts: PortDefinition[] = Reflect.getMetadata('node:inputs', nodeClass) || [];

  // Get output ports metadata
  const outputPorts: PortDefinition[] = Reflect.getMetadata('node:outputs', nodeClass) || [];

  console.log('convertNodeToReactFlow:', {
    nodeClass: nodeClass.name,
    metadata,
    inputPorts,
    outputPorts,
  });

  // Convert ports to object format
  const inputs: Record<string, PortDefinition> = {};
  const inputValues: Record<string, unknown> = {};
  inputPorts.forEach((port) => {
    inputs[port.id] = port;
    // Initialize with default value
    if (port.defaultValue !== undefined) {
      inputValues[port.id] = port.defaultValue;
    }
  });

  const outputs: Record<string, PortDefinition> = {};
  outputPorts.forEach((port) => {
    outputs[port.id] = port;
  });

  // Create React Flow node
  return {
    id: nodeId,
    type: 'custom', // We'll register this as the CustomNode component
    position,
    data: {
      label: metadata.label,
      type: metadata.type,
      category: metadata.category,
      description: metadata.description,
      icon: metadata.icon,
      color: metadata.color,
      inputs,
      outputs,
      nodeClass, // Store reference to the original class
      ...inputValues, // Add default values as properties
    },
  };
}

/**
 * Get node type information for the palette
 *
 * @param nodeClass - The decorated Node class
 * @returns Node palette item with type and metadata
 */
export function getNodePaletteItem(nodeClass: NodeConstructor) {
  const metadata: NodeMetadata = Reflect.getMetadata('node:metadata', nodeClass);

  if (!metadata) {
    throw new Error(`Node class ${nodeClass.name} is missing @defineNode decorator`);
  }

  return {
    type: metadata.type,
    label: metadata.label,
    category: metadata.category,
    description: metadata.description,
    icon: metadata.icon,
    color: metadata.color,
    nodeClass,
  };
}

/**
 * Extract all node classes from an array and get their palette items
 *
 * @param nodeClasses - Array of decorated Node classes
 * @returns Array of palette items
 */
export function getNodePaletteItems(nodeClasses: NodeConstructor[]) {
  return nodeClasses.map(getNodePaletteItem);
}
