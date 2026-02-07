/**
 * n8n-Style Workflow Builder Example
 *
 * Recreates the distinctive look and feel of n8n's workflow automation tool:
 * - Light, clean interface
 * - Colorful category-based nodes
 * - Purple/pink accent colors
 * - Smooth bezier connections
 * - Modern, rounded UI elements
 * - Custom node renderers with service icons
 */

import React, { useCallback } from 'react';
import { WorkflowBuilder, CustomNodeData } from '@reactflo/react';
import { BackgroundVariant, ConnectionLineType } from '@xyflow/react';
import './N8NStyleWorkflow.css';
import { n8nStyleWorkflow } from '../workflows/defaultWorkflows';

// Import automation nodes
import {
  WebhookTriggerNode,
  ScheduleTriggerNode,
  HTTPRequestNode,
  SendEmailNode,
  SlackMessageNode,
  DataTransformNode,
  ConditionalSplitNode,
} from '../nodes/automation';

// Import some utility nodes
import { DisplayNode } from '../nodes';

const nodeClasses = [
  // Trigger nodes
  WebhookTriggerNode,
  ScheduleTriggerNode,

  // Action nodes
  HTTPRequestNode,
  SendEmailNode,
  SlackMessageNode,

  // Transform nodes
  DataTransformNode,

  // Logic nodes
  ConditionalSplitNode,

  // Output
  DisplayNode,
];

/**
 * Node icon mapping - matches n8n's icon-based design
 */
const nodeIcons: Record<string, string> = {
  'automation.webhook-trigger': '🪝',
  'automation.schedule-trigger': '⏰',
  'automation.http-request': '🌐',
  'automation.send-email': '📧',
  'automation.slack-message': '💬',
  'automation.data-transform': '🔄',
  'automation.conditional-split': '🔀',
  'output.display': '📺',
};

/**
 * Custom node renderer for n8n-style appearance
 * Shows large icon with service name - authentic n8n look
 */
const renderNodeContent = (data: CustomNodeData, theme?: 'light' | 'dark'): React.ReactNode => {
  // Debug: Log the data to see what we're receiving
  console.log('[N8N renderNodeContent] Received data:', {
    type: data.type,
    label: data.label,
    category: data.category,
    executionStatus: data.executionStatus,
    executionOutputs: data.executionOutputs,
    keys: Object.keys(data),
  });

  const icon = nodeIcons[data.type] || '⚙️';
  const categoryColors: Record<string, string> = {
    Trigger: '#FF6D5A',
    Action: '#00D09C',
    Transform: '#FFA500',
    Logic: '#10B981',
    Output: '#7B68EE',
  };
  const color = categoryColors[data.category || ''] || '#999999';
  const isDark = theme === 'dark';

  // Fallbacks for missing data
  const displayLabel = data.label || data.type || 'Unknown Node';
  const displayCategory = data.category || 'General';

  return (
    <div
      className={`${data.executionStatus ? `execution-${data.executionStatus}` : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
      }}
    >
      {/* Large icon on left - n8n style */}
      <div
        style={{
          fontSize: '24px',
          lineHeight: '1',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Service name and type */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: isDark ? '#E0E0E0' : '#333',
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {displayLabel}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: isDark ? '#999' : '#999',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {displayCategory}
        </div>

        {/* Execution output preview - shows after execution completes */}
        {data.executionOutputs && Object.keys(data.executionOutputs).length > 0 && (
          <div
            style={{
              marginTop: '8px',
              padding: '6px',
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: '4px',
              fontSize: '10px',
              color: isDark ? '#999' : '#666',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Output:</div>
            {Object.entries(data.executionOutputs).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '2px',
                }}
              >
                <span style={{ opacity: 0.7 }}>{key}:</span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 500,
                  }}
                >
                  {String(value).slice(0, 20)}
                  {String(value).length > 20 ? '...' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color indicator bar on right - n8n style */}
      <div
        style={{
          width: '3px',
          height: '32px',
          background: color,
          borderRadius: '2px',
          flexShrink: 0,
        }}
      />
    </div>
  );
};

/**
 * Custom palette item renderer - shows icon + name
 */
const renderPaletteItem = (data: CustomNodeData, theme?: 'light' | 'dark'): React.ReactNode => {
  const icon = nodeIcons[data.type] || '⚙️';
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
      }}
    >
      <span style={{ fontSize: '20px', lineHeight: '1' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: isDark ? '#E0E0E0' : '#333',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.label}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: '#999',
            marginTop: '2px',
          }}
        >
          {data.category}
        </div>
      </div>
    </div>
  );
};

interface N8NStyleWorkflowProps {
  theme?: 'light' | 'dark';
}

/**
 * n8n-Style Workflow Builder
 *
 * Features the distinctive n8n visual design:
 * - Clean white/light gray color scheme (light) or dark mode
 * - Category-based node colors
 * - Purple branding accent
 * - Smooth animations and interactions
 * - Modern, polished UI
 * - Icon-based node rendering
 */
export const N8NStyleWorkflow: React.FC<N8NStyleWorkflowProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  // Memoize render functions to prevent unnecessary re-renders
  const memoizedRenderNodeContent = useCallback(
    (data: CustomNodeData) => renderNodeContent(data, theme),
    [theme]
  );

  const memoizedRenderPaletteItem = useCallback(
    (data: CustomNodeData) => renderPaletteItem(data, theme),
    [theme]
  );

  return (
    <div className="n8n-workflow-container" data-theme={theme}>
      <WorkflowBuilder
        nodes={nodeClasses}
        initialWorkflow={n8nStyleWorkflow}
        showPalette={true}
        showProperties={true}
        showToolbar={true}
        theme={theme}
        // Custom renderers for n8n-style appearance
        renderNodeContent={memoizedRenderNodeContent}
        renderPaletteItem={memoizedRenderPaletteItem}
        // Toolbar configuration
        toolbarOptions={{
          showExecute: true,
          showSave: true,
          showLoad: true,
          showClear: true,
          showUndoRedo: true,
        }}
        // Custom class names for n8n styling
        classes={{
          root: 'n8n-workflow-root',
          toolbar: 'n8n-toolbar',
          palette: 'n8n-palette',
          canvas: 'n8n-canvas',
          properties: 'n8n-properties',
        }}
        // Inline styles for layout
        styles={{
          root: {
            backgroundColor: isDark ? '#1A1A1A' : '#F7F7F7',
          },
          toolbar: {
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderBottom: `1px solid ${isDark ? '#3A3A3A' : '#E0E0E0'}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          },
          palette: {
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderRight: `1px solid ${isDark ? '#3A3A3A' : '#E0E0E0'}`,
          },
          properties: {
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderLeft: `1px solid ${isDark ? '#3A3A3A' : '#E0E0E0'}`,
          },
        }}
        // ReactFlow customization for n8n look
        reactFlowCustomization={{
          reactFlowProps: {
            // Smooth movement, no grid snapping
            snapToGrid: false,
            defaultViewport: { x: 0, y: 0, zoom: 1 },
            minZoom: 0.3,
            maxZoom: 1.5,
            connectionLineType: ConnectionLineType.SmoothStep,

            // Smooth interactions
            zoomOnScroll: true,
            panOnScroll: false,
            panOnDrag: true,
            nodesDraggable: true,
            nodesConnectable: true,
            elementsSelectable: true,
            fitView: false,

            // Default edge styling (n8n style)

            // Connection line styling (while dragging)
            connectionLineStyle: {
              stroke: '#EA4B71',
              strokeWidth: 3,
            },
          },
          // Subtle dot background
          backgroundProps: {
            variant: BackgroundVariant.Dots,
            gap: 20,
            size: 1,
            color: isDark ? '#444' : '#D0D0D0',
            style: { opacity: 0.4 },
          },
          showBackground: true,
          // Clean, minimal controls
          controlsProps: {
            showZoom: true,
            showFitView: true,
            showInteractive: false,
            position: 'bottom-left',
            style: {
              backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
              border: `1px solid ${isDark ? '#3A3A3A' : '#E0E0E0'}`,
              borderRadius: '8px',
              boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            },
          },
          showControls: true,
          // MiniMap with n8n colors
          miniMapProps: {
            nodeColor: (node) => {
              const category = node.data?.category;
              switch (category) {
                case 'Trigger':
                  return '#FF6D5A';
                case 'Action':
                  return '#00D09C';
                case 'Transform':
                  return '#FFA500';
                case 'Logic':
                  return '#10B981';
                case 'Output':
                  return '#7B68EE';
                default:
                  return '#999999';
              }
            },
            nodeStrokeColor: isDark ? '#1A1A1A' : '#FFFFFF',
            nodeBorderRadius: 8,
            maskColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
            position: 'bottom-right',
            style: {
              backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
              border: `1px solid ${isDark ? '#3A3A3A' : '#E0E0E0'}`,
              borderRadius: '8px',
              boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
          },
          showMiniMap: true,
        }}
      />
    </div>
  );
};
