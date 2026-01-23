import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkflowBuilder } from './WorkflowBuilder';

/**
 * WorkflowBuilder is the main component that integrates React Flow with ReactFlo's
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
    initialWorkflow: {
      description: 'Initial workflow data to load',
    },
    showJsonEditor: {
      description: 'Whether to show the JSON editor',
      control: 'boolean',
    },
    editorMode: {
      description: 'Editor display mode',
      control: 'select',
      options: ['visual', 'json', 'split'],
    },
    jsonEditorTheme: {
      description: 'Monaco editor theme',
      control: 'select',
      options: ['vs-dark', 'vs-light', 'hc-black'],
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
 * Default workflow builder with visual mode only
 */
export const Default: Story = {
  args: {
    nodes: [],
    showJsonEditor: false,
    editorMode: 'visual',
  },
};

/**
 * Builder with JSON editor in split view
 */
export const SplitView: Story = {
  args: {
    nodes: [],
    showJsonEditor: true,
    editorMode: 'split',
    jsonEditorTheme: 'vs-dark',
  },
};

/**
 * Builder with dark theme JSON editor
 */
export const DarkTheme: Story = {
  args: {
    nodes: [],
    showJsonEditor: true,
    editorMode: 'json',
    jsonEditorTheme: 'vs-dark',
  },
};

/**
 * Builder with sample workflow
 */
export const WithWorkflow: Story = {
  args: {
    nodes: [],
    showJsonEditor: false,
    editorMode: 'visual',
    initialWorkflow: {
      id: 'sample-workflow',
      name: 'Sample Workflow',
      version: '1.0.0',
      nodes: [
        {
          id: 'node-1',
          type: 'math.add',
          position: { x: 100, y: 100 },
          data: { label: 'Add Numbers' },
        },
        {
          id: 'node-2',
          type: 'math.multiply',
          position: { x: 300, y: 100 },
          data: { label: 'Multiply Result' },
        },
      ],
      connections: [
        {
          id: 'conn-1',
          source: 'node-1',
          sourcePort: 'result',
          target: 'node-2',
          targetPort: 'a',
        },
      ],
    },
  },
};
