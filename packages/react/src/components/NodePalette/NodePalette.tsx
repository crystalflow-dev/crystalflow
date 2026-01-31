import { NodeConstructor } from '@reactflo/core';
import React, { useMemo, useState } from 'react';
import { NodePaletteClasses, NodePaletteStyles } from '../../types/styling';
import { cn, mergeStyles } from '../../utils/styling';
import './NodePalette.css';

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

  /**
   * Class name overrides for sub-components
   */
  classes?: NodePaletteClasses;

  /**
   * Style overrides for sub-components
   */
  styles?: NodePaletteStyles;

  /**
   * Custom renderer for palette items
   * Allows complete control over how nodes appear in the palette
   *
   * @example
   * ```tsx
   * renderPaletteItem={(item) => (
   *   <div>
   *     {item.icon} {item.label}
   *   </div>
   * )}
   * ```
   */
  renderPaletteItem?: (item: NodePaletteItem) => React.ReactNode;
}

/**
 * Default palette item renderer
 */
const defaultRenderPaletteItem = (item: NodePaletteItem): React.ReactNode => (
  <>
    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.label}</div>
    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{item.type}</div>
  </>
);

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
 * - Custom palette item rendering via renderPaletteItem
 */
export const NodePalette: React.FC<NodePaletteProps> = ({
  nodes,
  onNodeDragStart,
  groupByCategory = true,
  style,
  className,
  classes,
  styles,
  renderPaletteItem,
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

  const defaultRootStyle: React.CSSProperties = {
    width: '250px',
    padding: '10px',
    borderRight: '1px solid var(--reactflo-border-primary, #ddd)',
    overflowY: 'auto',
    backgroundColor: 'var(--reactflo-palette-bg, #f9f9f9)',
    color: 'var(--reactflo-palette-text, #333)',
    direction: 'rtl', // Move scrollbar to left
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: 'transparent transparent', // Firefox - hide by default
  };

  const defaultContentStyle: React.CSSProperties = {
    direction: 'ltr', // Reset content direction to normal
  };

  const defaultSearchStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px',
    marginBottom: '10px',
    border: '1px solid var(--reactflo-border-primary, #ccc)',
    borderRadius: '4px',
    boxSizing: 'border-box',
    backgroundColor: 'var(--reactflo-bg-primary, white)',
    color: 'var(--reactflo-text-primary, #333)',
  };

  const defaultCategoryHeaderStyle: React.CSSProperties = {
    margin: '0 0 8px 0',
    fontSize: '12px',
    color: 'var(--reactflo-text-secondary, #666)',
  };

  const defaultNodeItemStyle: React.CSSProperties = {
    padding: '8px',
    margin: '5px 0',
    border: '1px solid var(--reactflo-border-primary, #ccc)',
    borderRadius: '4px',
    cursor: 'grab',
    background: 'var(--reactflo-bg-primary, white)',
    color: 'var(--reactflo-text-primary, #333)',
    transition: 'all 0.2s',
  };

  const defaultEmptyStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--reactflo-text-disabled, #999)',
  };

  return (
    <div
      className={cn('reactflo-node-palette', className, classes?.root)}
      style={mergeStyles(defaultRootStyle, styles?.root, style)}
    >
      <div style={defaultContentStyle}>
        <h3 style={{ margin: '0 0 10px 0' }}>Node Palette</h3>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes?.search}
          style={mergeStyles(defaultSearchStyle, styles?.search)}
        />

        {/* Render grouped nodes */}
        {Object.entries(groupedNodes).map(([category, categoryNodes]) => (
          <div key={category} style={{ marginBottom: '15px' }}>
            {groupByCategory && (
              <h4
                className={classes?.categoryHeader}
                style={mergeStyles(defaultCategoryHeaderStyle, styles?.categoryHeader)}
              >
                {category}
              </h4>
            )}

            {categoryNodes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                title={node.description || node.label}
                className={classes?.nodeItem}
                data-category={node.category}
                style={mergeStyles(
                  defaultNodeItemStyle,
                  {
                    borderLeft: node.color ? `4px solid ${node.color}` : undefined,
                  },
                  styles?.nodeItem
                )}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {(renderPaletteItem || defaultRenderPaletteItem)(node)}
              </div>
            ))}
          </div>
        ))}

        {filteredNodes.length === 0 && (
          <div className={classes?.empty} style={mergeStyles(defaultEmptyStyle, styles?.empty)}>
            No nodes found
          </div>
        )}
      </div>
    </div>
  );
};
