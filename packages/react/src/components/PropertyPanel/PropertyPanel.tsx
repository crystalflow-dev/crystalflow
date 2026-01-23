import React, { useState, useEffect } from 'react';
import { Node as ReactFlowNode } from 'reactflow';
import { CustomNodeData } from '../Node/CustomNode';

/**
 * PropertyPanel Props
 */
export interface PropertyPanelProps {
  /**
   * Selected node
   */
  node?: ReactFlowNode<CustomNodeData>;

  /**
   * Callback when property changes
   */
  onUpdate?: (updates: Partial<CustomNodeData>) => void;

  /**
   * Callback when panel is closed
   */
  onClose?: () => void;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * PropertyPanel component
 *
 * Displays and allows editing of properties for the selected node.
 * Properties are automatically generated from @Input decorator metadata.
 *
 * Features:
 * - Shows all node inputs
 * - Type-appropriate input controls (text, number, boolean, etc.)
 * - Real-time validation
 * - Default value display
 * - Required field indicators
 */
export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  node,
  onUpdate,
  onClose,
  style,
  className,
}) => {
  // Local state for input values
  const [inputValues, setInputValues] = useState<Record<string, any>>({});

  // Initialize/update local state when node changes
  useEffect(() => {
    if (node?.data) {
      const values: Record<string, any> = {};
      if (node.data.inputs) {
        Object.keys(node.data.inputs).forEach((key) => {
          values[key] =
            node.data[key] !== undefined ? node.data[key] : node.data.inputs![key].defaultValue;
        });
      }
      setInputValues(values);
    }
  }, [node?.id]); // Only reset when node ID changes

  if (!node) {
    return (
      <div
        className={className}
        style={{
          width: '300px',
          padding: '10px',
          borderLeft: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
          ...style,
        }}
      >
        <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
          Select a node to view properties
        </p>
      </div>
    );
  }

  const { data } = node;

  return (
    <div
      className={className}
      style={{
        width: '300px',
        padding: '10px',
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h3 style={{ margin: 0 }}>Properties</h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0 5px',
            }}
            title="Close properties panel"
          >
            ✕
          </button>
        )}
      </div>

      {/* Node Info */}
      <div
        style={{ marginBottom: '20px', padding: '10px', background: 'white', borderRadius: '4px' }}
      >
        <div style={{ marginBottom: '5px' }}>
          <strong>Label:</strong> {data.label}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Type:</strong> <code style={{ fontSize: '12px' }}>{data.type}</code>
        </div>
        {data.category && (
          <div>
            <strong>Category:</strong> {data.category}
          </div>
        )}
        {data.description && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            {data.description}
          </div>
        )}
      </div>

      {/* Input Properties */}
      {data.inputs && Object.keys(data.inputs).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Inputs</h4>
          {Object.entries(data.inputs).map(([key, port]: [string, any]) => (
            <div key={key} style={{ marginBottom: '12px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                }}
              >
                {port.label || key}
                {port.required && <span style={{ color: 'red' }}> *</span>}
              </label>
              <input
                type={port.type === 'number' ? 'number' : 'text'}
                value={inputValues[key] !== undefined ? inputValues[key] : ''}
                placeholder={`Enter ${port.type}`}
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                onChange={(e) => {
                  const value =
                    port.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                  console.log(`Update ${key}:`, value);

                  // Update local state immediately for responsive UI
                  setInputValues((prev) => ({ ...prev, [key]: value }));

                  // Notify parent component
                  if (onUpdate) {
                    onUpdate({ [key]: value });
                  }
                }}
              />
              {port.description && (
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  {port.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Output Properties (read-only) */}
      {data.outputs && Object.keys(data.outputs).length > 0 && (
        <div>
          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Outputs</h4>
          {Object.entries(data.outputs).map(([key, port]: [string, any]) => (
            <div
              key={key}
              style={{
                marginBottom: '8px',
                padding: '8px',
                background: 'white',
                borderRadius: '4px',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{port.label || key}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Type: {port.type}</div>
              {port.description && (
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  {port.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
