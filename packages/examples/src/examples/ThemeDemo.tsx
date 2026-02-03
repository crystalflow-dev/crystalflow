/**
 * Theme Demo Example
 *
 * Demonstrates ReactFlo's built-in theme system with light/dark modes
 */

import React from 'react';
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

interface ThemeDemoProps {
  theme?: 'light' | 'dark';
}

/**
 * Theme Demo Example
 */
export const ThemeDemo: React.FC<ThemeDemoProps> = ({ theme = 'light' }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <WorkflowBuilder
          nodes={nodeClasses}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          // Theme prop - accepts 'light', 'dark', 'auto', or custom Theme object
          theme={theme}
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
    </div>
  );
};
