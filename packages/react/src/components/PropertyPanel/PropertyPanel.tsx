import React, { useState, useEffect } from 'react';
import { Node as ReactFlowNode } from 'reactflow';
import { CustomNodeData } from '../Node/CustomNode';
import { PortDefinition, PropertyDefinition } from '@reactflo/types';
import { PropertyPanelClasses, PropertyPanelStyles } from '../../types/styling';
import { cn, mergeStyles } from '../../utils/styling';

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

  /**
   * Class name overrides for sub-components
   */
  classes?: PropertyPanelClasses;

  /**
   * Style overrides for sub-components
   */
  styles?: PropertyPanelStyles;
}

/**
 * PropertyPanel component
 *
 * Displays and allows editing of properties for the selected node.
 * Properties are automatically generated from @Property decorator metadata.
 *
 * Features:
 * - Shows all node properties (not inputs - those are for data flow)
 * - Type-appropriate input controls (text, number, boolean, select, etc.)
 * - Support for property constraints (min/max/step for numbers)
 * - Select dropdowns for enumerated values
 * - Real-time property updates
 * - Default value display
 * - Required field indicators
 */
export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  node,
  onUpdate,
  onClose,
  style,
  className,
  classes,
  styles,
}) => {
  // Local state for property values
  const [propertyValues, setPropertyValues] = useState<Record<string, unknown>>({});

  // Initialize/update local state when node changes
  useEffect(() => {
    if (node?.data) {
      const values: Record<string, unknown> = {};
      if (node.data.properties) {
        Object.entries(node.data.properties).forEach(
          ([key, propDef]: [string, PropertyDefinition]) => {
            values[key] = node.data[key] !== undefined ? node.data[key] : propDef.defaultValue;
          }
        );
      }
      setPropertyValues(values);
    }
  }, [node?.id]); // Only reset when node ID changes

  const defaultRootStyle: React.CSSProperties = {
    width: '300px',
    padding: '10px',
    borderLeft: '1px solid var(--reactflo-properties-border, #ddd)',
    backgroundColor: 'var(--reactflo-properties-bg, #f9f9f9)',
    color: 'var(--reactflo-properties-text, #333)',
  };

  const defaultEmptyStyle: React.CSSProperties = {
    color: 'var(--reactflo-text-secondary, #666)',
    textAlign: 'center',
    marginTop: '20px',
  };

  const defaultHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  };

  const defaultGroupStyle: React.CSSProperties = {
    marginBottom: '12px',
  };

  const defaultLabelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'var(--reactflo-text-primary, #333)',
  };

  const defaultInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px',
    border: '1px solid var(--reactflo-border-primary, #ccc)',
    borderRadius: '4px',
    backgroundColor: 'var(--reactflo-bg-primary, white)',
    color: 'var(--reactflo-text-primary, #333)',
    fontSize: '13px',
    boxSizing: 'border-box',
  };

  if (!node) {
    return (
      <div
        className={cn(className, classes?.root)}
        style={mergeStyles(defaultRootStyle, styles?.root, style)}
      >
        <p className={classes?.empty} style={mergeStyles(defaultEmptyStyle, styles?.empty)}>
          Select a node to view properties
        </p>
      </div>
    );
  }

  const { data } = node;

  return (
    <div
      className={cn(className, classes?.root)}
      style={mergeStyles(defaultRootStyle, { overflowY: 'auto' }, styles?.root, style)}
    >
      {/* Header */}
      <div className={classes?.header} style={mergeStyles(defaultHeaderStyle, styles?.header)}>
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
        style={{
          marginBottom: '20px',
          padding: '10px',
          background: 'var(--reactflo-bg-secondary, #f5f5f5)',
          border: '1px solid var(--reactflo-border-secondary, #e0e0e0)',
          borderRadius: '4px',
        }}
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
          <div
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: 'var(--reactflo-text-secondary, #666)',
            }}
          >
            {data.description}
          </div>
        )}
      </div>

      {/* Properties */}
      {data.properties && Object.keys(data.properties).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Properties</h4>
          {Object.entries(data.properties).map(([key, propDef]: [string, PropertyDefinition]) => (
            <div
              key={key}
              className={classes?.group}
              style={mergeStyles(defaultGroupStyle, styles?.group)}
            >
              <label
                className={classes?.label}
                style={mergeStyles(defaultLabelStyle, styles?.label)}
              >
                {propDef.label || key}
                {propDef.required && <span style={{ color: 'red' }}> *</span>}
              </label>

              {/* Render different control types based on property definition */}
              {propDef.type === 'select' && propDef.options ? (
                <select
                  value={
                    propertyValues[key] !== undefined
                      ? String(propertyValues[key])
                      : String(propDef.defaultValue || '')
                  }
                  className={classes?.input}
                  style={mergeStyles(defaultInputStyle, styles?.input)}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log(`Update property ${key}:`, value);

                    // Update local state immediately for responsive UI
                    setPropertyValues((prev) => ({ ...prev, [key]: value }));

                    // Notify parent component
                    if (onUpdate) {
                      onUpdate({ [key]: value });
                    }
                  }}
                >
                  {propDef.options.map((option: { value: string; label: string }) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : propDef.type === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={
                    propertyValues[key] !== undefined
                      ? Boolean(propertyValues[key])
                      : Boolean(propDef.defaultValue)
                  }
                  style={{
                    marginRight: '8px',
                    transform: 'scale(1.2)',
                  }}
                  onChange={(e) => {
                    const value = e.target.checked;
                    console.log(`Update property ${key}:`, value);

                    // Update local state immediately for responsive UI
                    setPropertyValues((prev) => ({ ...prev, [key]: value }));

                    // Notify parent component
                    if (onUpdate) {
                      onUpdate({ [key]: value });
                    }
                  }}
                />
              ) : (
                <input
                  type={propDef.type === 'number' ? 'number' : 'text'}
                  value={
                    propertyValues[key] !== undefined
                      ? String(propertyValues[key])
                      : String(propDef.defaultValue || '')
                  }
                  placeholder={`Enter ${propDef.type}`}
                  min={propDef.min}
                  max={propDef.max}
                  step={propDef.step}
                  className={classes?.input}
                  style={mergeStyles(defaultInputStyle, styles?.input)}
                  onChange={(e) => {
                    const value =
                      propDef.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                    console.log(`Update property ${key}:`, value);

                    // Update local state immediately for responsive UI
                    setPropertyValues((prev) => ({ ...prev, [key]: value }));

                    // Notify parent component
                    if (onUpdate) {
                      onUpdate({ [key]: value });
                    }
                  }}
                />
              )}

              {propDef.description && (
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--reactflo-text-secondary, #666)',
                    marginTop: '2px',
                  }}
                >
                  {propDef.description}
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
          {Object.entries(data.outputs).map(([key, port]: [string, PortDefinition]) => (
            <div
              key={key}
              style={{
                marginBottom: '8px',
                padding: '8px',
                background: 'var(--reactflo-bg-secondary, #f5f5f5)',
                border: '1px solid var(--reactflo-border-secondary, #e0e0e0)',
                borderRadius: '4px',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{port.label || key}</div>
              <div style={{ fontSize: '11px', color: 'var(--reactflo-text-secondary, #666)' }}>
                Type: {port.type}
              </div>
              {port.description && (
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--reactflo-text-secondary, #666)',
                    marginTop: '2px',
                  }}
                >
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
