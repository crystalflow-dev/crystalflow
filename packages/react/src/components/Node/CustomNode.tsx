import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

/**
 * Custom node data
 */
export interface CustomNodeData {
  label: string;
  type: string;
  category?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  [key: string]: any;
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
  // TODO: Implement custom node rendering
  // - Render node header with label
  // - Render input handles
  // - Render output handles
  // - Show node state/status
  // - Handle selection styling

  return (
    <div
      style={{
        padding: '10px',
        border: selected ? '2px solid #1a192b' : '1px solid #ddd',
        borderRadius: '5px',
        background: 'white',
        minWidth: '150px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{data.type}</div>

      {/* TODO: Render input handles */}
      <Handle type="target" position={Position.Left} />

      {/* TODO: Render output handles */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
