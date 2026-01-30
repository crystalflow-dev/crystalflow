import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomNode } from './CustomNode';

/**
 * CustomNode is the visual representation of workflow nodes on the canvas.
 * It renders nodes based on their decorator metadata, showing inputs, outputs,
 * and properties in a dynamic layout.
 */
const meta = {
  title: 'Components/Node/CustomNode',
  component: CustomNode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable node component that renders workflow nodes based on their metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Node data including type, label, and other properties',
    },
    id: {
      description: 'Unique identifier for the node',
    },
    selected: {
      description: 'Whether the node is currently selected',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CustomNode>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic node with minimal configuration
 */
export const Basic: Story = {
  args: {
    id: 'node-1',
    type: 'custom',
    position: { x: 0, y: 0 },
    zIndex: 0,
    isConnectable: true,
    dragging: false,
    data: {
      label: 'Basic Node',
      type: 'basic',
    },
    selected: false,
  } as any,
};

/**
 * Selected node showing active state
 */
export const Selected: Story = {
  args: {
    id: 'node-2',
    type: 'custom',
    position: { x: 0, y: 0 },
    zIndex: 0,
    isConnectable: true,
    dragging: false,
    data: {
      label: 'Selected Node',
      type: 'basic',
    },
    selected: true,
  } as any,
};

/**
 * Node with inputs and outputs
 */
export const WithPorts: Story = {
  args: {
    id: 'node-3',
    type: 'custom',
    position: { x: 0, y: 0 },
    zIndex: 0,
    isConnectable: true,
    dragging: false,
    data: {
      label: 'Math Add',
      type: 'math.add',
      inputs: {
        a: { id: 'a', type: 'number', label: 'A' },
        b: { id: 'b', type: 'number', label: 'B' },
      },
      outputs: {
        result: { id: 'result', type: 'number', label: 'Result' },
      },
    },
    selected: false,
  } as any,
};
