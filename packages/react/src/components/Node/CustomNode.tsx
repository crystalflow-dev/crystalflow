import React, { useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeExecutionStatus, PortDefinition, PropertyDefinition } from '@crystalflow/types';
import { NodeConstructor } from '@crystalflow/core';
import { previewValue } from '../../utils/previewValue';

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
  // Execution state
  executionStatus?: NodeExecutionStatus;
  executionOutputs?: Record<string, unknown>;
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
    className={`node-content ${data.executionStatus ? `execution-${data.executionStatus}` : ''}`}
    data-category={data.category}
    style={{ '--node-color': data.color } as React.CSSProperties}
  >
    <div className="node-header">
      {data.icon && <span className="node-icon">{data.icon}</span>}
      <span className="node-label">{data.label}</span>
    </div>
    <div className="node-body">
      <div className="node-type">{data.type}</div>
      {data.executionOutputs && Object.keys(data.executionOutputs).length > 0 && (
        <div
          className="node-execution-preview"
          style={{
            marginTop: 'var(--space-2)',
            padding: 'var(--space-2)',
            // a long value wraps here; without a width of its own the preview would stretch the node
            maxWidth: '240px',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div
            style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}
          >
            Output Preview:
          </div>
          {Object.entries(data.executionOutputs).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-2)',
              }}
            >
              <span style={{ opacity: 0.7 }}>{key}:</span>
              <span
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontWeight: 'var(--font-weight-medium)',
                  textAlign: 'right',
                  overflowWrap: 'anywhere',
                }}
              >
                {previewValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  // Type assert data to our CustomNodeData interface
  const nodeData = data as CustomNodeData;
  const inputs = nodeData.inputs ? Object.entries(nodeData.inputs) : [];
  const outputs = nodeData.outputs ? Object.entries(nodeData.outputs) : [];
  const renderContent = nodeData.renderNodeContent || defaultRenderNodeContent;

  // Memoize the rendered content with explicit dependencies on execution state
  // This ensures the component re-renders when execution status or outputs change
  const renderedContent = useMemo(() => {
    return renderContent(nodeData);
  }, [
    renderContent,
    nodeData.executionStatus,
    nodeData.executionOutputs,
    nodeData.label,
    nodeData.type,
    nodeData.category,
    nodeData.description,
    nodeData.icon,
    nodeData.color,
  ]);

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
      {renderedContent}

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
