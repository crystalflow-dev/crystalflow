/**
 * Styled Workflow Example
 *
 * Demonstrates the extensive styling customization capabilities of ReactFlo
 */

import React from 'react';
import { WorkflowBuilder } from '@reactflo/react';
import { BackgroundVariant } from '@xyflow/react';
import './StyledWorkflow.css';

// Import example nodes
import {
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
  ConfigDemoNode,
} from '../nodes';

const nodeClasses = [
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
  ConfigDemoNode,
];

/**
 * Styled Workflow Example
 *
 * Shows how to customize:
 * - Component class names
 * - Component styles
 * - ReactFlow props
 * - Background, Controls, MiniMap
 */
export const StyledWorkflow: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <WorkflowBuilder
          nodes={nodeClasses}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          // Configure which toolbar buttons to show
          toolbarOptions={{
            showExecute: true,
            showSave: true,
            showLoad: true,
            showClear: true,
            showUndoRedo: false, // Hide undo/redo for this example
          }}
          // Customize toolbar icons (or remove them)
          toolbarIcons={{
            execute: '▶', // Simple arrow instead of emoji
            save: '💾', // Keep save emoji
            load: null, // Remove load icon
            clear: '✖', // X symbol for clear
          }}
          // Custom class names for all components
          classes={{
            root: 'styled-workflow-root',
            toolbar: 'styled-toolbar',
            palette: 'styled-palette',
            canvas: 'styled-canvas',
            properties: 'styled-properties',
          }}
          // Custom inline styles
          styles={{
            root: {
              backgroundColor: '#1a1a2e',
            },
            toolbar: {
              backgroundColor: '#16213e',
              borderBottom: '3px solid #0f3460',
            },
            palette: {
              background: 'linear-gradient(180deg, #16213e 0%, #0f3460 100%)',
              borderRight: '1px solid #374151',
            },
            properties: {
              background: 'linear-gradient(180deg, #16213e 0%, #0f3460 100%)',
              borderLeft: '1px solid #374151',
            },
          }}
          // ReactFlow customization
          reactFlowCustomization={{
            // ReactFlow props
            reactFlowProps: {
              snapToGrid: false, // Disabled for smooth movement
              defaultViewport: { x: 50, y: 50, zoom: 1 },
              minZoom: 0.2,
              maxZoom: 2,
              zoomOnScroll: true,
              panOnScroll: false,
              panOnDrag: true,
              selectNodesOnDrag: false,
            },
            // Background customization
            backgroundProps: {
              variant: BackgroundVariant.Dots,
              gap: 20,
              size: 1.5,
              color: '#95a5a6',
            },
            // Controls customization
            controlsProps: {
              showZoom: true,
              showFitView: true,
              showInteractive: true,
              position: 'bottom-left',
            },
            // MiniMap customization
            miniMapProps: {
              nodeColor: (node: { data?: { category?: string } }) => {
                // Color nodes by category
                if (node.data?.category === 'Input') return '#3498db';
                if (node.data?.category === 'Math') return '#e74c3c';
                if (node.data?.category === 'Output') return '#2ecc71';
                if (node.data?.category === 'Examples') return '#9b59b6';
                return '#95a5a6';
              },
              nodeStrokeColor: '#7f8c8d',
              nodeBorderRadius: 4,
              maskColor: 'rgba(0, 0, 0, 0.3)',
              position: 'bottom-right',
            },
            showBackground: true,
            showControls: true,
            showMiniMap: true,
          }}
          // Node Palette customization
          nodePaletteProps={{
            groupByCategory: true,
            classes: {
              root: 'custom-palette-root',
              search: 'custom-palette-search',
              categoryHeader: 'custom-palette-category',
              nodeItem: 'custom-palette-item',
            },
            styles: {
              search: {
                backgroundColor: '#0f3460',
                borderColor: '#4b5563',
                borderWidth: '1px',
                color: '#ffffff',
                outline: 'none',
              },
              categoryHeader: {
                color: '#9ca3af',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '12px',
                letterSpacing: '1px',
              },
              nodeItem: {
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              },
            },
          }}
          // Property Panel customization
          propertyPanelProps={{
            classes: {
              root: 'custom-properties-root',
              header: 'custom-properties-header',
              group: 'custom-properties-group',
              label: 'custom-properties-label',
              input: 'custom-properties-input',
            },
            styles: {
              header: {
                color: '#9ca3af',
                borderBottom: '1px solid #4b5563',
                paddingBottom: '10px',
              },
              label: {
                color: '#ffffff',
                fontWeight: 'bold',
              },
              input: {
                backgroundColor: '#0f3460',
                borderColor: '#4b5563',
                borderWidth: '1px',
                color: '#ffffff',
                borderRadius: '8px',
              },
            },
          }}
          // Toolbar customization
          toolbarProps={{
            classes: {
              button: 'custom-toolbar-button',
              buttonGroup: 'custom-toolbar-group',
            },
            styles: {
              button: {
                background: '#374151',
                color: 'white',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              },
            },
          }}
          onWorkflowChange={(nodes, edges) => {
            console.log('Workflow changed:', { nodeCount: nodes.length, edgeCount: edges.length });
          }}
        />
      </div>
    </div>
  );
};
