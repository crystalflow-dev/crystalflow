/**
 * Simple Workflow Builder Example
 *
 * This example demonstrates how to create a basic workflow builder
 * with custom nodes using decorators.
 */

import { WorkflowBuilder } from '@reactflo/react';
import {
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  SubtractNode,
  DisplayNode,
} from '../nodes';
import 'reactflow/dist/style.css';

/**
 * Simple Workflow Example Component
 */
function SimpleWorkflow() {
  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Simple Workflow Builder</h2>
        <p>
          Drag nodes from the palette onto the canvas. Start with Number nodes to provide input
          values, then connect them to Math operations (Add, Multiply, Subtract), and finally to a
          Display node to see the result. Connect nodes by dragging from output handles (right side)
          to input handles (left side).
        </p>
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
          ]}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
        />
      </div>
    </div>
  );
}

export default SimpleWorkflow;
