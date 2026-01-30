import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectionLine } from './ConnectionLine';

/**
 * ConnectionLine is a custom connection renderer for React Flow that displays
 * connections between nodes with proper styling and validation feedback.
 */
const meta = {
  title: 'Components/Connection/ConnectionLine',
  component: ConnectionLine,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Custom connection line component for rendering connections between workflow nodes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConnectionLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default connection line
 */
export const Default: Story = {
  args: {
    connectionLineType: 'default' as any,
    fromX: 100,
    fromY: 100,
    toX: 200,
    toY: 200,
    fromPosition: 'right' as any,
    toPosition: 'left' as any,
    connectionStatus: null,
    fromNode: { id: 'node-1', position: { x: 0, y: 0 }, data: {} } as any,
    fromHandle: { id: 'output-1', type: 'source', position: 'right' } as any,
    toNode: { id: 'node-2', position: { x: 200, y: 0 }, data: {} } as any,
    toHandle: { id: 'input-1', type: 'target', position: 'left' } as any,
    pointer: { x: 200, y: 200 },
  },
};
