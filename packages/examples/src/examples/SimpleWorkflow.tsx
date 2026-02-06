/**
 * Simple Workflow Builder Example
 *
 * This example demonstrates how to create a basic workflow builder
 * with custom nodes using decorators.
 */

import { WorkflowBuilder } from '@crystalflow/react';
import {
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
  ConfigDemoNode,
} from '../nodes';
import { simpleWorkflow } from '../workflows/defaultWorkflows';

interface SimpleWorkflowProps {
  theme?: 'light' | 'dark';
}

/**
 * Simple Workflow Example Component
 */
function SimpleWorkflow({ theme = 'light' }: SimpleWorkflowProps) {
  return (
    <div className="example-container">
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
          initialWorkflow={simpleWorkflow}
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
            showUISettings: true, // Enable UI settings
          }}
        />
      </div>
    </div>
  );
}

export default SimpleWorkflow;
