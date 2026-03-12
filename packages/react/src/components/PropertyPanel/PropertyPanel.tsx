import { useState, useEffect } from 'react';
import { Node as ReactFlowNode } from '@xyflow/react';
import { FiSettings, FiX, FiBox, FiChevronRight, FiZap, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CustomNodeData } from '../Node/CustomNode';
import { PropertyDefinition } from '@crystalflow/types';
import { PropertyPanelClasses, PropertyPanelStyles } from '../../types/styling';
import { cn, mergeStyles } from '../../utils/styling';

/**
 * PropertyPanel Props
 */
export interface PropertyPanelProps {
  node?: ReactFlowNode;
  onUpdate?: (updates: Partial<CustomNodeData>) => void;
  onClose?: () => void;
  style?: React.CSSProperties;
  className?: string;
  classes?: PropertyPanelClasses;
  styles?: PropertyPanelStyles;
}

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

/**
 * Collapsible Section Component
 */
function CollapsibleSection({
  title,
  icon,
  defaultExpanded = true,
  children,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`property-section ${isExpanded ? 'property-section--expanded' : ''}`}>
      <div
        className="property-section__header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="property-section__title">
          {icon && <span className="property-section__icon">{icon}</span>}
          {title}
        </div>
        <FiChevronRight className="property-section__chevron" size={16} />
      </div>
      {isExpanded && <div className="property-section__content">{children}</div>}
    </div>
  );
}

/**
 * PropertyPanel Component
 * Modern redesign with collapsible sections and improved UX
 */
export function PropertyPanel({
  node,
  onUpdate,
  onClose,
  style,
  className,
  classes,
  styles,
}: PropertyPanelProps) {
  const [propertyValues, setPropertyValues] = useState<Record<string, unknown>>({});

  // Initialize property values from node data
  useEffect(() => {
    if (node?.data) {
      const nodeData = node.data as CustomNodeData;
      const values: Record<string, unknown> = {};
      if (nodeData.properties) {
        Object.entries(nodeData.properties).forEach(
          ([key, propDef]: [string, PropertyDefinition]) => {
            values[key] = nodeData[key] !== undefined ? nodeData[key] : propDef.defaultValue;
          }
        );
      }
      setPropertyValues(values);
    }
  }, [node?.id]);

  // Handle property value change
  const handlePropertyChange = (key: string, value: unknown) => {
    setPropertyValues((prev) => ({ ...prev, [key]: value }));
    onUpdate?.({ [key]: value });
  };

  // Render input control based on property type
  const renderPropertyControl = (key: string, propDef: PropertyDefinition) => {
    const value = propertyValues[key] !== undefined ? propertyValues[key] : propDef.defaultValue;

    switch (propDef.type) {
      case 'select':
        return (
          <select
            className="property-select"
            value={String(value || '')}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
          >
            {propDef.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="property-checkbox">
            <input
              type="checkbox"
              className="property-checkbox__input"
              checked={Boolean(value)}
              onChange={(e) => handlePropertyChange(key, e.target.checked)}
            />
            <span className="property-checkbox__label">{propDef.label || key}</span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            className="property-input"
            value={Number(value || 0)}
            min={propDef.min}
            max={propDef.max}
            step={propDef.step || 1}
            onChange={(e) => handlePropertyChange(key, parseFloat(e.target.value))}
          />
        );

      case 'array':
        return (
          <div className="property-array">
            <div className="property-array__input-row">
              <input
                type="text"
                className="property-input property-array__input"
                placeholder="Enter value and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    const text = input.value.trim();
                    if (text) {
                      const parsedValue = parseValue(text);
                      const currentArray = Array.isArray(value) ? (value as unknown[]) : [];
                      handlePropertyChange(key, [...currentArray, parsedValue]);
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                className="property-array__add-btn"
                onClick={() => {
                  const input = document.querySelector(
                    `[placeholder="Enter value and press Enter"]`
                  ) as HTMLInputElement;
                  const text = input?.value.trim();
                  if (text) {
                    const parsedValue = parseValue(text);
                    const currentArray = Array.isArray(value) ? (value as unknown[]) : [];
                    handlePropertyChange(key, [...currentArray, parsedValue]);
                    input.value = '';
                  }
                }}
                type="button"
              >
                <FiPlus size={14} />
                Add
              </button>
            </div>

            {Array.isArray(value) && value.length > 0 ? (
              <div className="property-array__list">
                {value.map((item, index) => (
                  <div key={index} className="property-array__item">
                    <span className="property-array__item-value">{String(item)}</span>
                    <button
                      className="property-array__item-remove"
                      onClick={() => {
                        const newArray = (value as unknown[]).filter((_, i) => i !== index);
                        handlePropertyChange(key, newArray);
                      }}
                      type="button"
                      title="Remove item"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="property-array__empty">No items yet</div>
            )}
          </div>
        );

      case 'string':
      default:
        return (
          <input
            type="text"
            className="property-input"
            value={String(value || '')}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
          />
        );
    }
  };

  if (!node) {
    return (
      <div
        className={cn('property-panel', className, classes?.root)}
        style={mergeStyles(styles?.root, style)}
      >
        <div className="property-panel__empty">
          <FiBox className="property-panel__empty-icon" size={48} />
          <div>Select a node to view its properties</div>
        </div>
      </div>
    );
  }

  const nodeData = node.data as CustomNodeData;

  return (
    <div
      className={cn('property-panel', className, classes?.root)}
      style={mergeStyles(styles?.root, style)}
    >
      {/* Header */}
      <div className="property-panel__header">
        <h3 className="property-panel__title">
          <FiSettings className="property-panel__title-icon" size={18} />
          Properties
        </h3>
        {onClose && (
          <button
            className="property-panel__close"
            onClick={onClose}
            title="Close properties panel"
            type="button"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="property-panel__content">
        {/* Node Info Card */}
        <div className="property-panel__node-info">
          <div className="property-panel__node-info-row">
            <span className="property-panel__node-info-label">Label:</span>
            <span className="property-panel__node-info-value">{nodeData.label}</span>
          </div>
          <div className="property-panel__node-info-row">
            <span className="property-panel__node-info-label">Type:</span>
            <code className="property-panel__node-info-code">{nodeData.type}</code>
          </div>
          {nodeData.category && (
            <div className="property-panel__node-info-row">
              <span className="property-panel__node-info-label">Category:</span>
              <span className="property-panel__node-info-value">{nodeData.category}</span>
            </div>
          )}
          {nodeData.description && (
            <div className="property-panel__node-description">{nodeData.description}</div>
          )}
        </div>

        {/* Properties Section */}
        {nodeData.properties && Object.keys(nodeData.properties).length > 0 && (
          <CollapsibleSection
            title="Configuration"
            icon={<FiZap size={16} />}
            defaultExpanded={true}
          >
            {Object.entries(nodeData.properties).map(
              ([key, propDef]: [string, PropertyDefinition]) => (
                <div key={key} className="property-group">
                  <label className="property-group__label">
                    {propDef.label || key}
                    {propDef.required && <span className="property-group__required">*</span>}
                  </label>
                  {renderPropertyControl(key, propDef)}
                  {propDef.description && (
                    <div className="property-group__description">{propDef.description}</div>
                  )}
                </div>
              )
            )}
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}

// Helper function to parse string values
function parseValue(text: string): unknown {
  const num = Number(text);
  if (!isNaN(num) && text !== '') {
    return num;
  }
  if (text === 'true') return true;
  if (text === 'false') return false;
  return text;
}
