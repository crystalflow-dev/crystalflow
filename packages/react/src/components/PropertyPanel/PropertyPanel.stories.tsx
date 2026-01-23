import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropertyPanel } from './PropertyPanel';

/**
 * PropertyPanel displays and allows editing of properties for the selected node.
 * It dynamically generates form controls based on the node's metadata.
 */
const meta = {
  title: 'Components/PropertyPanel',
  component: PropertyPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A property inspector panel for viewing and editing selected node properties.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    node: {
      description: 'The currently selected node',
    },
    onUpdate: {
      description: 'Callback when a property value changes',
      action: 'updated',
    },
    onClose: {
      description: 'Callback when panel is closed',
      action: 'closed',
    },
  },
} satisfies Meta<typeof PropertyPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Panel with no node selected
 */
export const NoSelection: Story = {
  args: {
    node: undefined,
  },
};

/**
 * Panel showing properties of a selected node
 */
export const WithSelectedNode: Story = {
  args: {
    node: {
      id: 'node-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: 'Add Numbers',
        type: 'math.add',
        category: 'Math',
        inputs: {
          a: { id: 'a', type: 'number', label: 'A', defaultValue: 5 },
          b: { id: 'b', type: 'number', label: 'B', defaultValue: 10 },
        },
        outputs: {
          result: { id: 'result', type: 'number', label: 'Result' },
        },
      },
    },
  },
};
