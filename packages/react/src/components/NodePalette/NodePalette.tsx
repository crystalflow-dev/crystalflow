import { NodeConstructor } from '@reactflo/core';
import React, { useMemo, useState } from 'react';

/**
 * Node palette item
 */
export interface NodePaletteItem {
  type: string;
  label: string;
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  nodeClass?: NodeConstructor;
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
  groupByCategory = true,
  style,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter nodes based on search
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;

    const term = searchTerm.toLowerCase();
    return nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(term) ||
        node.type.toLowerCase().includes(term) ||
        node.category.toLowerCase().includes(term)
    );
  }, [nodes, searchTerm]);

  // Group nodes by category
  const groupedNodes = useMemo(() => {
    if (!groupByCategory) return { All: filteredNodes };

    const grouped: Record<string, NodePaletteItem[]> = {};
    filteredNodes.forEach((node) => {
      const category = node.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(node);
    });

    return grouped;
  }, [filteredNodes, groupByCategory]);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.effectAllowed = 'move';
    onNodeDragStart?.(nodeType);
  };

  return (
    <div
      className={className}
      style={{
        width: '250px',
        padding: '10px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        ...style,
      }}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>Node Palette</h3>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '6px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      />

      {/* Render grouped nodes */}
      {Object.entries(groupedNodes).map(([category, categoryNodes]) => (
        <div key={category} style={{ marginBottom: '15px' }}>
          {groupByCategory && (
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>{category}</h4>
          )}

          {categoryNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              title={node.description || node.label}
              style={{
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'grab',
                background: 'white',
                transition: 'all 0.2s',
                borderLeft: node.color ? `4px solid ${node.color}` : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{node.label}</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{node.type}</div>
            </div>
          ))}
        </div>
      ))}

      {filteredNodes.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No nodes found</div>
      )}
    </div>
  );
};
