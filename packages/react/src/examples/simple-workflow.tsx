/**
 * Simple WorkflowBuilder Example
 *
 * This example demonstrates how to create a basic workflow builder
 * with custom nodes using decorators.
 */

import { defineNode, Input, Output, Node } from '@reactflo/core';
import { WorkflowBuilder } from '../components/WorkflowBuilder/WorkflowBuilder';

// Example Node 1: Add Numbers
@defineNode({
  type: 'math.add',
  label: 'Add',
  category: 'Math',
  description: 'Adds two numbers together',
  color: '#4CAF50',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 0, required: true })
  a: number = 0;

  @Input({ type: 'number', label: 'B', defaultValue: 0, required: true })
  b: number = 0;

  @Output({ type: 'number', label: 'Sum' })
  sum: number = 0;

  execute(): void {
    this.sum = this.a + this.b;
  }
}

// Example Node 2: Multiply Numbers
@defineNode({
  type: 'math.multiply',
  label: 'Multiply',
  category: 'Math',
  description: 'Multiplies two numbers',
  color: '#2196F3',
})
class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 1, required: true })
  a: number = 1;

  @Input({ type: 'number', label: 'B', defaultValue: 1, required: true })
  b: number = 1;

  @Output({ type: 'number', label: 'Product' })
  product: number = 0;

  execute(): void {
    this.product = this.a * this.b;
  }
}

// Example Node 3: Display Result
@defineNode({
  type: 'output.display',
  label: 'Display',
  category: 'Output',
  description: 'Displays a value',
  color: '#FF9800',
})
class DisplayNode extends Node {
  @Input({ type: 'number', label: 'Value', required: true })
  value: number = 0;

  execute(): void {
    // eslint-disable-next-line no-console
    console.log('Display:', this.value);
  }
}

/**
 * Simple Workflow Example Component
 */
export function SimpleWorkflowExample() {
  const handleWorkflowChange = (nodes: unknown[], edges: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log('Workflow changed:', { nodeCount: nodes.length, edgeCount: edges.length });
  };

  const handleExecute = (result: unknown) => {
    // eslint-disable-next-line no-console
    console.log('Execution result:', result);
  };

  const handleError = (error: Error) => {
    console.error('Execution error:', error);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowBuilder
        nodes={[AddNode, MultiplyNode, DisplayNode]}
        showPalette={true}
        showProperties={true}
        showToolbar={true}
        onWorkflowChange={handleWorkflowChange}
        onExecute={handleExecute}
        onError={handleError}
      />
    </div>
  );
}

export default SimpleWorkflowExample;
