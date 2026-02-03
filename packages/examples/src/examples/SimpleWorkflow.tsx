/**
 * Simple Workflow Builder Example
 *
 * This example demonstrates how to create a basic workflow builder
 * with custom nodes using decorators.
 */

import { useState } from 'react';
import { WorkflowBuilder } from '@reactflo/react';
import {
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
  ConfigDemoNode,
} from '../nodes';

/**
 * Simple Workflow Example Component
 */
function SimpleWorkflow() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  return (
    <div className="example-container">
      <div className="example-info">
        {/* Theme Switcher */}
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '6px',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Theme:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['light', 'dark', 'auto'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: theme === themeOption ? '#007acc' : 'white',
                  color: theme === themeOption ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (theme !== themeOption) {
                    e.currentTarget.style.background = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme !== themeOption) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {themeOption === 'auto'
                  ? '🔄 Auto'
                  : themeOption === 'dark'
                    ? '🌙 Dark'
                    : '☀️ Light'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="workflow-container">
        <WorkflowBuilder
          nodes={[
            NumberInputNode,
            StringInputNode,
            AddNode,
            MultiplyNode,
            SubtractNode,
            DisplayNode,
            ConfigDemoNode,
          ]}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          theme={theme} // Apply selected theme
          toolbarOptions={{
            showExecute: true,
            showSave: true,
            showLoad: true,
            showClear: true,
            showUndoRedo: true, // Enable undo/redo buttons
          }}
        />
      </div>
    </div>
  );
}

export default SimpleWorkflow;
