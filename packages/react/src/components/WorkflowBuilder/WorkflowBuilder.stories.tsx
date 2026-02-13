import type { Meta, StoryObj } from '@storybook/react-vite';
import { defineNode, Input, Output, Node } from '@crystalflow/core';
import { WorkflowBuilder } from './WorkflowBuilder';

// Example Nodes for the stories
@defineNode({
  type: 'math.add',
  label: 'Add',
  category: 'Math',
  description: 'Adds two numbers together',
  color: '#4CAF50',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 0 })
  a: number = 0;

  @Input({ type: 'number', label: 'B', defaultValue: 0 })
  b: number = 0;

  @Output({ type: 'number', label: 'Sum' })
  sum: number = 0;

  execute(): void {
    this.sum = this.a + this.b;
  }
}

@defineNode({
  type: 'math.multiply',
  label: 'Multiply',
  category: 'Math',
  description: 'Multiplies two numbers',
  color: '#2196F3',
})
class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A', defaultValue: 1 })
  a: number = 1;

  @Input({ type: 'number', label: 'B', defaultValue: 1 })
  b: number = 1;

  @Output({ type: 'number', label: 'Product' })
  product: number = 0;

  execute(): void {
    this.product = this.a * this.b;
  }
}

@defineNode({
  type: 'output.display',
  label: 'Display',
  category: 'Output',
  description: 'Displays a value',
  color: '#FF9800',
})
class DisplayNode extends Node {
  @Input({ type: 'any', label: 'Value' })
  value: any;

  execute(): void {
    console.log('Display:', this.value);
  }
}

/**
 * WorkflowBuilder is the main component that integrates React Flow with CrystalFlow's
 * decorator-based node system. It provides a complete visual workflow editor with
 * node palette, property panel, and optional JSON editor.
 */
const meta = {
  title: 'Components/WorkflowBuilder',
  component: WorkflowBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main workflow builder component with visual canvas and editing capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    nodes: {
      description: 'Array of node classes decorated with @defineNode',
    },
    showPalette: {
      description: 'Whether to show the node palette',
      control: 'boolean',
    },
    showProperties: {
      description: 'Whether to show the property panel',
      control: 'boolean',
    },
    showToolbar: {
      description: 'Whether to show the toolbar',
      control: 'boolean',
    },
    onWorkflowChange: {
      description: 'Callback when workflow changes',
      action: 'workflowChanged',
    },
    onExecute: {
      description: 'Callback when execution completes',
      action: 'executed',
    },
    onError: {
      description: 'Callback when execution fails',
      action: 'error',
    },
  },
} satisfies Meta<typeof WorkflowBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default workflow builder with all panels visible
 */
export const Default: Story = {
  args: {
    nodes: [AddNode, MultiplyNode, DisplayNode],
    showPalette: true,
    showProperties: true,
    showToolbar: true,
  },
};

/**
 * Builder with palette only (no properties panel)
 */
export const PaletteOnly: Story = {
  args: {
    nodes: [AddNode, MultiplyNode, DisplayNode],
    showPalette: true,
    showProperties: false,
    showToolbar: true,
  },
};

/**
 * Minimal builder (canvas only)
 */
export const CanvasOnly: Story = {
  args: {
    nodes: [AddNode, MultiplyNode, DisplayNode],
    showPalette: false,
    showProperties: false,
    showToolbar: false,
  },
};
