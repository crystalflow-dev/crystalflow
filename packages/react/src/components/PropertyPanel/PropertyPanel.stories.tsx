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
    selectedNode: {
      description: 'The currently selected node',
    },
    onPropertyChange: {
      description: 'Callback when a property value changes',
      action: 'propertyChanged',
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
    selectedNode: null,
  },
};

/**
 * Panel showing properties of a selected node
 */
export const WithSelectedNode: Story = {
  args: {
    selectedNode: {
      id: 'node-1',
      type: 'math.add',
      data: {
        label: 'Add Numbers',
        properties: {
          a: 5,
          b: 10,
        },
      },
    },
  },
};
