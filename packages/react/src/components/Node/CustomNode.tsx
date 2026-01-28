import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { PortDefinition, PropertyDefinition } from '@reactflo/types';
import { NodeConstructor } from '@reactflo/core';
import './CustomNode.css';

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
const defaultRenderNodeContent = (data: CustomNodeData): React.ReactNode => {
  const inputs = data.inputs ? Object.entries(data.inputs) : [];
  const outputs = data.outputs ? Object.entries(data.outputs) : [];

  return (
    <div className="node-content" data-category={data.category}>
      {/* Node Header */}
      <div className="node-header">
        {data.icon && <span className="node-icon">{data.icon}</span>}
        <span className="node-label">{data.label}</span>
      </div>
      <div className="node-type">{data.type}</div>

      {/* Port Labels */}
      {(inputs.length > 0 || outputs.length > 0) && (
        <div className="node-ports">
          <div className="node-inputs">
            {inputs.map(([key, port]) => (
              <div key={key} className="port-label">
                {port.label || key}
                {data[key] !== undefined && (
                  <span className="port-value">: {String(data[key])}</span>
                )}
              </div>
            ))}
          </div>
          <div className="node-outputs">
            {outputs.map(([key, port]) => (
              <div key={key} className="port-label">
                {port.label || key}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CustomNode: React.FC<NodeProps<CustomNodeData>> = memo(({ data }) => {
  const inputs = data.inputs ? Object.entries(data.inputs) : [];
  const outputs = data.outputs ? Object.entries(data.outputs) : [];

  // Calculate handle positions
  const inputHandleSpacing = inputs.length > 1 ? 100 / (inputs.length + 1) : 50;
  const outputHandleSpacing = outputs.length > 1 ? 100 / (outputs.length + 1) : 50;

  // Use custom renderer if provided, otherwise use default
  const renderContent = data.renderNodeContent || defaultRenderNodeContent;

  return (
    <>
      {/* Input Handles */}
      {inputs.map(([key, port], index) => {
        const position = (index + 1) * inputHandleSpacing;
        return (
          <Handle
            key={`input-${key}`}
            type="target"
            position={Position.Left}
            id={key}
            style={{
              top: `${position}%`,
            }}
            title={`${port.label || key} (${port.type})`}
          />
        );
      })}

      {/* Node Content - Using standard div that ReactFlow styles */}
      {renderContent(data)}

      {/* Output Handles */}
      {outputs.map(([key, port], index) => {
        const position = (index + 1) * outputHandleSpacing;
        return (
          <Handle
            key={`output-${key}`}
            type="source"
            position={Position.Right}
            id={key}
            style={{
              top: `${position}%`,
            }}
            title={`${port.label || key} (${port.type})`}
          />
        );
      })}
    </>
  );
});

CustomNode.displayName = 'CustomNode';
