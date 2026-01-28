import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { PortDefinition, PropertyDefinition } from '@reactflo/types';
import { NodeConstructor } from '@reactflo/core';

/**
 * Custom node data
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
  [key: string]: unknown;
}

/**
 * CustomNode component
 *
 * Renders a node on the React Flow canvas based on decorator metadata.
 * This component is dynamically created from @defineNode decorated classes.
 *
 * Features:
 * - Displays node label and type
 * - Renders input handles based on @Input decorators
 * - Renders output handles based on @Output decorators
 * - Shows node state (idle, running, success, error)
 * - Supports node selection and highlighting
 */
export const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const inputs = data.inputs ? Object.entries(data.inputs) : [];
  const outputs = data.outputs ? Object.entries(data.outputs) : [];

  // Debug logging
  console.log('CustomNode data:', {
    label: data.label,
    inputs: data.inputs,
    outputs: data.outputs,
    inputsCount: inputs.length,
    outputsCount: outputs.length,
  });

  // Calculate handle positions
  const inputHandleSpacing = inputs.length > 1 ? 100 / (inputs.length + 1) : 50;
  const outputHandleSpacing = outputs.length > 1 ? 100 / (outputs.length + 1) : 50;

  return (
    <div
      style={{
        padding: '12px',
        borderTopWidth: selected ? '2px' : '1px',
        borderTopStyle: 'solid',
        borderTopColor: selected ? '#1a192b' : '#ddd',
        borderRightWidth: selected ? '2px' : '1px',
        borderRightStyle: 'solid',
        borderRightColor: selected ? '#1a192b' : '#ddd',
        borderBottomWidth: selected ? '2px' : '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: selected ? '#1a192b' : '#ddd',
        borderLeftWidth: data.color ? '4px' : selected ? '2px' : '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: data.color || (selected ? '#1a192b' : '#ddd'),
        borderRadius: '6px',
        background: 'white',
        minWidth: '180px',
        boxShadow: selected ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
      }}
    >
      {/* Node Header */}
      <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
        {data.icon && <span style={{ marginRight: '6px' }}>{data.icon}</span>}
        {data.label}
      </div>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>{data.type}</div>

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
              background: '#555',
              width: '12px',
              height: '12px',
              border: '2px solid white',
            }}
            title={`${port.label || key} (${port.type})`}
          />
        );
      })}

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
              background: '#555',
              width: '12px',
              height: '12px',
              border: '2px solid white',
            }}
            title={`${port.label || key} (${port.type})`}
          />
        );
      })}

      {/* Port Labels (inside node) */}
      {(inputs.length > 0 || outputs.length > 0) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '10px',
          }}
        >
          {/* Input labels with values */}
          <div style={{ textAlign: 'left', flex: 1 }}>
            {inputs.map(([key, port]) => (
              <div key={key} style={{ marginBottom: '2px', color: '#888' }}>
                {port.label || key}
                {data[key] !== undefined && (
                  <span style={{ color: '#555', fontWeight: 'bold' }}>: {String(data[key])}</span>
                )}
              </div>
            ))}
          </div>

          {/* Output labels */}
          <div style={{ textAlign: 'right', flex: 1 }}>
            {outputs.map(([key, port]) => (
              <div key={key} style={{ marginBottom: '2px', color: '#888' }}>
                {port.label || key}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
