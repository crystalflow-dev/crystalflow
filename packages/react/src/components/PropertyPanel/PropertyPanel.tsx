import React from 'react';

/**
 * PropertyPanel Props
 */
export interface PropertyPanelProps {
  /**
   * Selected node ID
   */
  selectedNodeId?: string;

  /**
   * Selected node data
   */
  selectedNode?: any;

  /**
   * Callback when property changes
   */
  onPropertyChange?: (nodeId: string, property: string, value: any) => void;

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
  selectedNodeId,
  selectedNode,
  // onPropertyChange,
  style,
  className,
}) => {
  // TODO: Implement property panel
  // - Display node properties
  // - Render appropriate input controls based on type
  // - Add validation
  // - Handle value changes
  // - Show default values

  if (!selectedNodeId || !selectedNode) {
    return (
      <div
        className={className}
        style={{
          width: '300px',
          padding: '10px',
          borderLeft: '1px solid #ddd',
          ...style,
        }}
      >
        <p style={{ color: '#666' }}>Select a node to view properties</p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: '300px',
        padding: '10px',
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
        ...style,
      }}
    >
      <h3>Properties</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Node:</strong> {selectedNode.label || selectedNodeId}
      </div>
      {/* TODO: Render property inputs */}
    </div>
  );
};
