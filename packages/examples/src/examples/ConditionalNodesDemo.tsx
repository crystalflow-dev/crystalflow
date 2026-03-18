/**
 * Conditional Flow Example
 *
 * This example demonstrates conditional branching using IfNode and SwitchNode.
 * It shows how to create workflows that make decisions and route data based on conditions.
 */

import { WorkflowBuilder } from '@crystalflow/react';
import { IfNode, SwitchNode } from '@crystalflow/core';
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
import { conditionalWorkflow } from '../workflows/defaultWorkflows';

interface ConditionalNodesDemoProps {
  theme?: 'light' | 'dark';
}

/**
 * Conditional Flow Example Component
 */
function ConditionalNodesDemo({ theme = 'light' }: ConditionalNodesDemoProps) {
  return (
    <div className="example-container">
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
          initialWorkflow={conditionalWorkflow}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default ConditionalNodesDemo;
