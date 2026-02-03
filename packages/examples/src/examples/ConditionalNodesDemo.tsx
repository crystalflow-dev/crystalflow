/**
 * Conditional Flow Example
 *
 * This example demonstrates conditional branching using IfNode and SwitchNode.
 * It shows how to create workflows that make decisions and route data based on conditions.
 */

import { WorkflowBuilder } from '@reactflo/react';
import { IfNode, SwitchNode } from '@reactflo/core';
import {
  NumberInputNode,
  StringInputNode,
  AddNode,
  MultiplyNode,
  ModuloNode,
  DisplayNode,
  BooleanInputNode,
  CompareNode,
  IsPositiveNode,
  IsEvenNode,
  RangeCheckNode,
} from '../nodes';
import '../styles/reactflow.css';

/**
 * Conditional Flow Example Component
 */
function ConditionalNodesDemo() {
  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Conditional Flow Workflow</h2>
        <p>
          This example demonstrates conditional branching with <strong>IfNode</strong> and{' '}
          <strong>SwitchNode</strong>:
        </p>
        <ul>
          <li>
            <strong>IfNode</strong>: Routes data based on a boolean condition. Connect a boolean
            value to the <code>value</code> input and data to the <code>data</code> input. The data
            flows to either the <code>thenOutput</code> (true) or <code>elseOutput</code> (false).
          </li>
          <li>
            <strong>SwitchNode</strong>: Multi-case branching node with dynamic outputs. Set the{' '}
            <code>cases</code> property to define possible values (e.g., [1, 2, 3]). The node will
            create outputs <code>case_0</code>, <code>case_1</code>, etc., plus a{' '}
            <code>default</code> output. Connect the value to match to <code>value</code> input and
            data to pass through to <code>data</code> input.
          </li>
        </ul>
        <h3>Example Workflow Ideas:</h3>
        <ul>
          <li>
            <strong>Basic If Test:</strong> NumberInput(5) → IsPositive → IfNode (connect IsPositive
            result to value, NumberInput to data) → Display nodes on then/else branches
          </li>
          <li>
            <strong>Number Comparison:</strong> Two NumberInputs → Compare (a=10, b=5, operation=gt)
            → IfNode → Display "Greater" or "Not Greater"
          </li>
          <li>
            <strong>Even/Odd Routing:</strong> NumberInput → IsEven → IfNode → Display "Even" or
            "Odd"
          </li>
          <li>
            <strong>Switch Cases:</strong> NumberInput(2) → SwitchNode with cases [0,1,2,3] → 5
            Display nodes (case_0, case_1, case_2, case_3, default) showing different messages
          </li>
          <li>
            <strong>Modulo Switch:</strong> NumberInput(7) → Modulo(value, 3) → SwitchNode cases
            [0,1,2] → Display remainder results
          </li>
          <li>
            <strong>Range Grading:</strong> NumberInput(85) → RangeCheck with different ranges →
            IfNode → Display grade tiers
          </li>
          <li>
            <strong>Nested Conditions:</strong> NumberInput → IsPositive → IfNode → then branch goes
            to IsEven → another IfNode → classify as "Positive Even" or "Positive Odd"
          </li>
        </ul>
      </div>
      <div className="workflow-container">
        <WorkflowBuilder
          nodes={[
            NumberInputNode,
            StringInputNode,
            BooleanInputNode,
            AddNode,
            MultiplyNode,
            ModuloNode,
            CompareNode,
            IsPositiveNode,
            IsEvenNode,
            RangeCheckNode,
            IfNode,
            SwitchNode,
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

export default ConditionalNodesDemo;
