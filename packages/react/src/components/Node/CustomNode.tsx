import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PortDefinition, PropertyDefinition } from '@reactflo/types';
import { NodeConstructor } from '@reactflo/core';

/**
 * Custom node data
 * Note: We extend ReactFlow's node system, not replace it
 */
export interface CustomNodeData {
  label: string;
  type: string;
  category?: string;
  description?: string;
  icon?: string;
  color?: string;
  inputs?: Record<string, PortDefinition>;
  outputs?: Record<string, PortDefinition>;
  properties?: Record<string, PropertyDefinition>;
  nodeClass?: NodeConstructor;
  renderNodeContent?: (data: CustomNodeData) => React.ReactNode;
  [key: string]: unknown;
}

/**
 * CustomNode component
 *
 * Extends ReactFlow's node system with our decorator metadata.
 * Uses ReactFlow's styling system and components.
 *
 * Features:
 * - Built on ReactFlow's node foundation
 * - Renders handles based on @Input/@Output decorators
 * - Supports ReactFlow's className and style props
 * - Leverages ReactFlow's selection and state management
 * - Supports custom node content rendering via renderNodeContent
 */

/**
 * Default node content renderer
 */
const defaultRenderNodeContent = (data: CustomNodeData): React.ReactNode => (
  <div
    className="node-content"
    data-category={data.category}
    style={{ '--node-color': data.color } as React.CSSProperties}
  >
    <div className="node-header">
      {data.icon && <span className="node-icon">{data.icon}</span>}
      <span className="node-label">{data.label}</span>
    </div>
    <div className="node-body">
      <div className="node-type">{data.type}</div>
    </div>
  </div>
);

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  // Type assert data to our CustomNodeData interface
  const nodeData = data as CustomNodeData;
  const inputs = nodeData.inputs ? Object.entries(nodeData.inputs) : [];
  const outputs = nodeData.outputs ? Object.entries(nodeData.outputs) : [];
  const renderContent = nodeData.renderNodeContent || defaultRenderNodeContent;

  return (
    <>
      {/* Input Handles */}
      {inputs.map(([key, port], index) => {
        const portDef = port as PortDefinition;
        const position = inputs.length > 1 ? ((index + 1) * 100) / (inputs.length + 1) : 50;
        return (
          <Handle
            key={key}
            type="target"
            position={Position.Left}
            id={key}
            style={{ top: `${position}%` }}
            title={`${portDef.label || key} (${portDef.type})`}
          />
        );
      })}

      {/* Node Content */}
      {renderContent(nodeData)}

      {/* Output Handles */}
      {outputs.map(([key, port], index) => {
        const portDef = port as PortDefinition;
        const position = outputs.length > 1 ? ((index + 1) * 100) / (outputs.length + 1) : 50;
        return (
          <Handle
            key={key}
            type="source"
            position={Position.Right}
            id={key}
            style={{ top: `${position}%` }}
            title={`${portDef.label || key} (${portDef.type})`}
          />
        );
      })}
    </>
  );
};

CustomNode.displayName = 'CustomNode';
