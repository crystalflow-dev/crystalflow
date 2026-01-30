import 'reflect-metadata';
import { Node as ReactFlowNode } from '@xyflow/react';
import { NodeMetadata, PortDefinition, PropertyDefinition } from '@reactflo/types';
import { NodeConstructor } from '@reactflo/core';

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
): ReactFlowNode {
  // Get node metadata from decorator
  const metadata: NodeMetadata = Reflect.getMetadata('node:metadata', nodeClass);

  if (!metadata) {
    throw new Error(`Node class ${nodeClass.name} is missing @defineNode decorator`);
  }

  // Get input ports metadata
  const inputPorts: PortDefinition[] = Reflect.getMetadata('node:inputs', nodeClass) || [];

  // Get output ports metadata
  const outputPorts: PortDefinition[] = Reflect.getMetadata('node:outputs', nodeClass) || [];

  // Get properties metadata
  const propertyDefinitions: PropertyDefinition[] =
    Reflect.getMetadata('node:properties', nodeClass) || [];

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

  // Check if node has dynamic outputs (nodes with getOutputs method)
  // For dynamic output nodes, we need to call getOutputs() with property values
  try {
    const tempInstance = new nodeClass(`temp-${Date.now()}`);
    
    // Apply property default values to the instance
    propertyDefinitions.forEach((prop) => {
      if (prop.defaultValue !== undefined) {
        (tempInstance as any)[prop.id] = prop.defaultValue;
      }
    });

    // If node has getOutputs method, use it to get initial outputs
    if (typeof (tempInstance as any).getOutputs === 'function') {
      const dynamicOutputs = (tempInstance as any).getOutputs();
      console.log('Initial dynamic outputs for', nodeClass.name, ':', dynamicOutputs);
      
      // Replace static outputs with dynamic ones
      const dynOutputs: Record<string, PortDefinition> = {};
      dynamicOutputs.forEach((port: PortDefinition) => {
        dynOutputs[port.id] = port;
      });
      
      // Merge with any static outputs
      Object.assign(outputs, dynOutputs);
    }
  } catch (error) {
    console.warn('Could not instantiate node for dynamic outputs:', error);
  }

  // Convert properties to object format
  const properties: Record<string, PropertyDefinition> = {};
  const propertyValues: Record<string, unknown> = {};
  propertyDefinitions.forEach((prop) => {
    properties[prop.id] = prop;
    // Initialize with default value
    if (prop.defaultValue !== undefined) {
      propertyValues[prop.id] = prop.defaultValue;
    }
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
      properties,
      nodeClass, // Store reference to the original class
      ...inputValues, // Add default input values as properties
      ...propertyValues, // Add default property values
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
