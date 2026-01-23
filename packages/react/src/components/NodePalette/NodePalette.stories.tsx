import type { Meta, StoryObj } from '@storybook/react-vite';
import { NodePalette } from './NodePalette';

/**
 * NodePalette displays available node types that can be dragged onto the workflow canvas.
 * It organizes nodes by category and provides search/filter functionality.
 */
const meta = {
  title: 'Components/NodePalette',
  component: NodePalette,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A draggable palette of available workflow nodes organized by category.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    nodes: {
      description: 'Array of node classes decorated with @defineNode',
    },
    onNodeDragStart: {
      description: 'Callback when node drag starts',
      action: 'dragStart',
    },
  },
} satisfies Meta<typeof NodePalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty palette with no nodes
 */
export const Empty: Story = {
  args: {
    nodes: [],
  },
};

/**
 * Palette with sample node types
 */
export const WithNodes: Story = {
  args: {
    nodes: [
      {
        type: 'math.add',
        label: 'Add',
        category: 'Math',
      },
      {
        type: 'math.multiply',
        label: 'Multiply',
        category: 'Math',
      },
      {
        type: 'string.concat',
        label: 'Concatenate',
        category: 'String',
      },
      {
        type: 'logic.if',
        label: 'If/Else',
        category: 'Logic',
      },
    ],
  },
};
