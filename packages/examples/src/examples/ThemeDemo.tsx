/**
 * Theme Demo Example
 *
 * Demonstrates ReactFlo's built-in theme system with light/dark modes
 */

import React, { useState } from 'react';
import { WorkflowBuilder } from '@reactflo/react';
import { BackgroundVariant } from 'reactflow';

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
 * Theme Demo Example
 */
export const ThemeDemo: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('light');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // Apply theme CSS variables to ensure ReactFlow components inherit them
        ...(themeMode === 'dark'
          ? {
              backgroundColor: '#1e1e1e',
              color: '#e0e0e0',
            }
          : {
              backgroundColor: '#ffffff',
              color: '#2c3e50',
            }),
      }}
    >
      <div
        style={{
          padding: '20px',
          backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#2c3e50',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>ReactFlo - Theme System</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            Built-in light/dark theme support with automatic system detection
          </p>
        </div>

        {/* Theme Switcher */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setThemeMode('light')}
            style={{
              padding: '8px 16px',
              backgroundColor: themeMode === 'light' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: themeMode === 'light' ? 'bold' : 'normal',
            }}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            style={{
              padding: '8px 16px',
              backgroundColor: themeMode === 'dark' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: themeMode === 'dark' ? 'bold' : 'normal',
            }}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => setThemeMode('auto')}
            style={{
              padding: '8px 16px',
              backgroundColor: themeMode === 'auto' ? '#3498db' : '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: themeMode === 'auto' ? 'bold' : 'normal',
            }}
          >
            🔄 Auto
          </button>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <WorkflowBuilder
          nodes={nodeClasses}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          // Theme prop - accepts 'light', 'dark', 'auto', or custom Theme object
          theme={themeMode}
          reactFlowCustomization={{
            reactFlowProps: {
              snapToGrid: true,
              snapGrid: [15, 15],
            },
            backgroundProps: {
              variant: BackgroundVariant.Dots,
              gap: 20,
              size: 1.5,
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

      {/* Info Panel */}
      <div
        style={{
          padding: '15px',
          backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#34495e',
          color: 'white',
          borderTop: '2px solid',
          borderTopColor: themeMode === 'dark' ? '#404040' : '#2c3e50',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Features:</strong> Automatic theme CSS variables, system detection (auto mode),
            light/dark modes, custom theme support
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Current theme: <strong>{themeMode.toUpperCase()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
