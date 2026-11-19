import type { Meta } from '@storybook/react-vite';

const meta = {
  title: 'Introduction',
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
} satisfies Meta;

export default meta;

/**
 * # CrystalFlow Component Library
 *
 * Welcome to the CrystalFlow Storybook! This is an interactive showcase of all the React components
 * that make up the CrystalFlow workflow builder framework.
 *
 * ## What is CrystalFlow?
 *
 * CrystalFlow is a declarative workflow builder framework that provides tools for creating custom
 * workflow applications. It uses TypeScript decorators for node definitions, React Flow for the
 * UI layer, and includes a complete execution engine with JSON serialization.
 *
 * **Core Principle:** "We build the how, you focus on the what."
 *
 * ## Component Overview
 *
 * ### Core Components
 *
 * - **WorkflowBuilder** - Main component that integrates everything together
 * - **CustomNode** - Visual representation of workflow nodes
 * - **NodePalette** - Draggable palette of available node types
 * - **PropertyPanel** - Property inspector for selected nodes
 * - **Toolbar** - Workflow-level action buttons
 * - **ConnectionLine** - Custom connection renderer
 *
 * ## Getting Started
 *
 * Browse through the component stories to see examples of each component in action.
 * Each story includes:
 *
 * - Interactive controls to modify props
 * - Documentation of all available props
 * - Multiple variations and use cases
 * - Accessibility features and testing utilities
 *
 * ## Technology Stack
 *
 * - **React 18+** - UI framework
 * - **React Flow 11+** - Canvas and node rendering
 * - **Monaco Editor** - JSON editing
 * - **TypeScript** - Type safety
 * - **Storybook 10** - Component development and documentation
 *
 * ## Development Workflow
 *
 * 1. Develop components in isolation using Storybook
 * 2. Test different states and edge cases with stories
 * 3. Document props and behavior inline
 * 4. Use accessibility addon to ensure compliance
 * 5. Export components for use in applications
 *
 * ## Resources
 *
 * - [CrystalFlow Documentation](https://github.com/crystalflow-dev/crystalflow)
 * - [React Flow Documentation](https://reactflow.dev/)
 * - [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
 *
 * ## Contributing
 *
 * When adding new components:
 *
 * 1. Create the component in `src/components/`
 * 2. Add a corresponding `.stories.tsx` file
 * 3. Include multiple story variations
 * 4. Document all props with JSDoc comments
 * 5. Test accessibility with the a11y addon
 */
export const Introduction = () => null;
