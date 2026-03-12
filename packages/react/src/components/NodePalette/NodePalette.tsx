import { NodeConstructor } from '@crystalflow/core';
import React, { useMemo, useState } from 'react';
import { NodePaletteClasses, NodePaletteStyles } from '../../types/styling';
import { cn, mergeStyles } from '../../utils/styling';

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
    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
      {item.label}
    </div>
    <div
      style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-tertiary)',
        marginTop: 'var(--space-1)',
        fontFamily: 'var(--font-family-mono)',
      }}
    >
      {item.type}
    </div>
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
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

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
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid var(--color-border-light)`,
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-base)',
  };

  const defaultContentStyle: React.CSSProperties = {
    padding: 'var(--space-4)',
    paddingRight: 'var(--space-3)',
    flex: 1,
    overflowY: 'auto',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
  };

  const defaultHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-4)',
    margin: 0,
    borderBottom: `1px solid var(--color-border-light)`,
    background: 'var(--color-bg-secondary)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    flexShrink: 0,
  };

  const defaultSearchStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-2) var(--space-3)',
    marginBottom: 'var(--space-4)',
    border: `1px solid var(--color-border-medium)`,
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-family-base)',
    outline: 'none',
    transition: 'all var(--transition-fast) var(--ease-out)',
  };

  const defaultCategoryHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-2) var(--space-3)',
    margin: '0 0 var(--space-2) 0',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-secondary)',
    background: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background var(--transition-fast) var(--ease-out)',
  };

  const defaultNodeItemStyle: React.CSSProperties = {
    padding: 'var(--space-3)',
    marginBottom: 'var(--space-2)',
    border: `1px solid var(--color-border-light)`,
    borderRadius: 'var(--radius-sm)',
    cursor: 'grab',
    background: 'var(--color-bg-elevated)',
    color: 'var(--color-text-primary)',
    transition: 'all var(--transition-fast) var(--ease-out)',
    fontSize: 'var(--font-size-sm)',
  };

  const defaultEmptyStyle: React.CSSProperties = {
    padding: 'var(--space-8)',
    textAlign: 'center',
    color: 'var(--color-text-tertiary)',
    fontSize: 'var(--font-size-sm)',
  };

  return (
    <div
      className={cn('crystalflow-node-palette', className, classes?.root)}
      style={mergeStyles(defaultRootStyle, styles?.root, style)}
    >
      {/* Header */}
      <div style={defaultHeaderStyle}>
        <span>Nodes</span>
      </div>

      {/* Content */}
      <div style={defaultContentStyle}>
        {/* Search box */}
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes?.search}
          style={mergeStyles(defaultSearchStyle, styles?.search)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary-500)';
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary-50)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-medium)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Render grouped nodes with collapsible categories */}
        {Object.entries(groupedNodes).map(([category, categoryNodes]) => {
          const isCollapsed = collapsedCategories.has(category);
          return (
            <div key={category} style={{ marginBottom: 'var(--space-4)' }}>
              {groupByCategory && (
                <div
                  className={classes?.categoryHeader}
                  style={mergeStyles(defaultCategoryHeaderStyle, styles?.categoryHeader)}
                  onClick={() => toggleCategory(category)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-secondary)';
                  }}
                >
                  <span>{category}</span>
                  <span
                    style={{
                      transition: 'transform var(--transition-fast) var(--ease-out)',
                      transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    ▶
                  </span>
                </div>
              )}

              {!isCollapsed && (
                <div
                  style={{
                    animation: 'slideDown 0.2s ease-out',
                  }}
                >
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
                          borderLeft: `3px solid ${node.color || 'var(--color-border-strong)'}`,
                        },
                        styles?.nodeItem
                      )}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        e.currentTarget.style.transform = 'translateX(-2px)';
                        e.currentTarget.style.borderTopColor = 'var(--color-border-medium)';
                        e.currentTarget.style.borderRightColor = 'var(--color-border-medium)';
                        e.currentTarget.style.borderBottomColor = 'var(--color-border-medium)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.borderTopColor = 'var(--color-border-light)';
                        e.currentTarget.style.borderRightColor = 'var(--color-border-light)';
                        e.currentTarget.style.borderBottomColor = 'var(--color-border-light)';
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.style.cursor = 'grab';
                      }}
                    >
                      {(renderPaletteItem || defaultRenderPaletteItem)(node)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className={classes?.empty} style={mergeStyles(defaultEmptyStyle, styles?.empty)}>
            No nodes found
          </div>
        )}
      </div>
    </div>
  );
};
