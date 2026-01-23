import React from 'react';

/**
 * Node palette item
 */
export interface NodePaletteItem {
  type: string;
  label: string;
  category: string;
  description?: string;
  icon?: string;
}

/**
 * NodePalette Props
 */
export interface NodePaletteProps {
  /**
   * Available node types
   */
  nodes: NodePaletteItem[];

  /**
   * Callback when node is dragged
   */
  onNodeDragStart?: (nodeType: string) => void;

  /**
   * Whether to group by category
   */
  groupByCategory?: boolean;

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
 * NodePalette component
 *
 * Displays available node types that can be dragged onto the canvas.
 * Nodes are automatically generated from the NodeRegistry.
 *
 * Features:
 * - Lists all registered nodes
 * - Groups nodes by category
 * - Supports drag-and-drop to canvas
 * - Search/filter functionality
 */
export const NodePalette: React.FC<NodePaletteProps> = ({
  nodes,
  onNodeDragStart,
  // groupByCategory = true,
  style,
  className,
}) => {
  // TODO: Implement node palette
  // - Display node list
  // - Group by category
  // - Add drag handlers
  // - Add search/filter
  // - Show node icons/descriptions

  return (
    <div
      className={className}
      style={{
        width: '250px',
        padding: '10px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        ...style,
      }}
    >
      <h3>Node Palette</h3>
      {/* TODO: Render node list */}
      {nodes.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={() => onNodeDragStart?.(node.type)}
          style={{
            padding: '8px',
            margin: '5px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'grab',
            background: 'white',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{node.label}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{node.category}</div>
        </div>
      ))}
    </div>
  );
};
