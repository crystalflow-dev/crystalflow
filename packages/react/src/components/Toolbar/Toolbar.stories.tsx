import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from './Toolbar';

/**
 * Toolbar provides workflow-level actions like run, save, load, and view controls.
 */
const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main toolbar for workflow-level actions and controls.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toolbar with all actions
 */
export const Default: Story = {
  args: {},
};
