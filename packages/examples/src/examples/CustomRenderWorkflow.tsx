/**
 * Custom Render Workflow Example
 *
 * Demonstrates how to use renderNodeContent to completely customize
 * what's displayed inside nodes based on node data and category
 */

import React from 'react';
import { WorkflowBuilder } from '@crystalflow/react';
import type { CustomNodeData } from '@crystalflow/react';
import { BackgroundVariant } from '@xyflow/react';

// Import example nodes
import {
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
} from '../nodes';

const nodeClasses = [
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
];

/**
 * Custom node renderer function
 * This gives you complete control over what's displayed in each node
 */
const renderNodeContent = (data: CustomNodeData): React.ReactNode => {
  const inputs = data.inputs ? Object.entries(data.inputs) : [];

  // Different rendering based on category
  switch (data.category) {
    case 'Input': {
      // Input nodes: Show icon and current value prominently
      return (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📥</div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
            {data.label}
          </div>
          {inputs.map(
            ([key]) =>
              data[key] !== undefined && (
                <div
                  key={key}
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#3282b8',
                    marginTop: '8px',
                  }}
                >
                  {String(data[key])}
                </div>
              )
          )}
        </div>
      );
    }

    case 'Math': {
      // Math nodes: Show operation symbol
      const symbol = data.label.includes('Add')
        ? '+'
        : data.label.includes('Multiply')
          ? '×'
          : data.label.includes('Subtract')
            ? '−'
            : '=';
      return (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fbbf24' }}>{symbol}</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>{data.label}</div>
        </div>
      );
    }

    case 'Output': {
      // Output nodes: Show result with large display
      return (
        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>📤</div>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '8px',
            }}
          >
            {data.label}
          </div>
          {inputs.map(([key, port]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#34d399', marginBottom: '4px' }}>
                {port.label || key}
              </div>
              {data[key] !== undefined && (
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    padding: '8px',
                    background: 'rgba(52, 211, 153, 0.1)',
                    borderRadius: '4px',
                  }}
                >
                  {String(data[key])}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    default: {
      // Default rendering for other categories
      const outputs = data.outputs ? Object.entries(data.outputs) : [];
      return (
        <div style={{ padding: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{data.label}</div>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>{data.type}</div>
          {inputs.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              {inputs.map(([key, port]) => (
                <div key={key} style={{ fontSize: '12px', marginBottom: '4px' }}>
                  ← {port.label || key}
                </div>
              ))}
            </div>
          )}
          {outputs.length > 0 && (
            <div>
              {outputs.map(([key, port]) => (
                <div
                  key={key}
                  style={{ fontSize: '12px', marginBottom: '4px', textAlign: 'right' }}
                >
                  {port.label || key} →
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  }
};

/**
 * Custom palette item renderer function
 * Customize how nodes appear in the palette sidebar
 */
const renderPaletteItem = (item: {
  type: string;
  label: string;
  category?: string;
}): React.ReactNode => {
  // Determine emoji based on category
  const emoji =
    item.category === 'Input'
      ? '📥'
      : item.category === 'Math'
        ? '🔢'
        : item.category === 'Output'
          ? '📤'
          : '📦';

  // Determine color based on category
  const color =
    item.category === 'Input'
      ? '#3282b8'
      : item.category === 'Math'
        ? '#fbbf24'
        : item.category === 'Output'
          ? '#34d399'
          : '#888';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '13px', color }}>{item.label}</div>
        <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>{item.type}</div>
      </div>
    </div>
  );
};

/**
 * Custom toolbar renderer function
 * Customize the toolbar with your own buttons and layout
 */
const renderToolbar = (actions: {
  onExecute: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  canExecute: boolean;
}): React.ReactNode => {
  return (
    <div
      style={{
        padding: '12px 20px',
        backgroundColor: '#2c3e50',
        borderBottom: '2px solid #34495e',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {/* Execute button with emoji */}
      <button
        onClick={actions.onExecute}
        disabled={!actions.canExecute}
        style={{
          padding: '8px 16px',
          backgroundColor: actions.canExecute ? '#27ae60' : '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: actions.canExecute ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ▶️ Execute
      </button>

      {/* Save button */}
      <button
        onClick={actions.onSave}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        💾 Save
      </button>

      {/* Load button */}
      <button
        onClick={actions.onLoad}
        style={{
          padding: '8px 16px',
          backgroundColor: '#9b59b6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        📂 Load
      </button>

      {/* Clear button */}
      <button
        onClick={actions.onClear}
        style={{
          padding: '8px 16px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        🗑️ Clear
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Status indicator */}
      <div style={{ fontSize: '12px', color: '#ecf0f1', opacity: 0.8 }}>
        {actions.canExecute ? '✅ Ready to execute' : '⚠️ Add nodes to execute'}
      </div>
    </div>
  );
};

/**
 * Custom Render Workflow Example
 */
export const CustomRenderWorkflow: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <WorkflowBuilder
          nodes={nodeClasses}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          // Custom node renderer - this is where the magic happens!
          renderNodeContent={renderNodeContent}
          // Custom palette item renderer - customize the palette sidebar!
          renderPaletteItem={renderPaletteItem}
          // Custom toolbar renderer - customize the toolbar!
          renderToolbar={renderToolbar}
          reactFlowCustomization={{
            reactFlowProps: {
              snapToGrid: true,
              snapGrid: [15, 15],
            },
            backgroundProps: {
              variant: BackgroundVariant.Dots,
              gap: 20,
              size: 1.5,
              color: '#ddd',
            },
            showBackground: true,
            showControls: true,
            showMiniMap: true,
          }}
          onWorkflowChange={(nodes, edges) => {
            console.log('Workflow changed:', { nodeCount: nodes.length, edgeCount: edges.length });
          }}
        />
      </div>
    </div>
  );
};
