# Storybook for CrystalFlow

This directory contains the Storybook setup for the CrystalFlow React package, providing an interactive development environment for building and testing components in isolation.

## What is Storybook?

Storybook is a tool for developing UI components in isolation. It allows you to:

- Build components in isolation without worrying about app-specific dependencies
- View different states and edge cases of components
- Document components with interactive examples
- Test accessibility and interactions
- Share components with the team

## Getting Started

### Running Storybook

From the React package directory:

```bash
npm run storybook
```

Or from the root of the monorepo:

```bash
npm run storybook --workspace=@crystalflow/react
```

This will start Storybook on http://localhost:6006

### Building Storybook

To build a static version of Storybook for deployment:

```bash
npm run build-storybook
```

## Structure

```
.storybook/
├── main.ts          # Storybook configuration
└── preview.ts       # Global preview settings

src/
├── Introduction.stories.tsx                    # Welcome page
└── components/
    ├── WorkflowBuilder/
    │   └── WorkflowBuilder.stories.tsx
    ├── Node/
    │   └── CustomNode.stories.tsx
    ├── NodePalette/
    │   └── NodePalette.stories.tsx
    ├── PropertyPanel/
    │   └── PropertyPanel.stories.tsx
    ├── Toolbar/
    │   └── Toolbar.stories.tsx
    └── Connection/
        └── ConnectionLine.stories.tsx
```

## Writing Stories

Stories are written in TypeScript using the Component Story Format (CSF3):

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    // Define controls
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const WithState: Story = {
  args: {
    // Props for this variation
  },
};
```

## Addons

The following Storybook addons are installed:

- **@storybook/addon-docs** - Automatic documentation generation
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-vitest** - Integration with Vitest
- **@chromatic-com/storybook** - Visual testing with Chromatic

## Features

### Autodocs

All components with the `'autodocs'` tag automatically generate documentation pages based on:

- TypeScript prop types
- JSDoc comments
- Story examples

### Controls

Interactive controls are automatically generated from prop types, allowing you to modify component props in real-time.

### Accessibility Testing

The a11y addon automatically checks components for accessibility issues and provides feedback.

### Backgrounds

Switch between light and dark backgrounds to test component appearance.

## Vite Configuration

Storybook uses Vite as the build tool. The configuration in `vite.config.ts` is automatically merged with Storybook's config, providing:

- Path aliases for @crystalflow/core and @crystalflow/types
- React plugin for JSX support
- Fast hot module replacement (HMR)

## Integration with CrystalFlow

The Storybook setup is configured to work with:

- **React Flow** - Automatically includes React Flow styles
- **Monaco Editor** - Monaco types and workers are configured
- **TypeScript decorators** - Experimental decorators are enabled
- **Monorepo structure** - Path aliases resolve to sibling packages

## Tips

### Component Isolation

Write stories that work in isolation without requiring full application context. Use mock data and callbacks.

### Multiple Variations

Create multiple story variations to showcase different states:

- Empty/Default/With Data
- Loading/Success/Error
- Selected/Unselected
- Light/Dark theme

### Documentation

Use JSDoc comments on props to provide rich documentation:

```typescript
/**
 * Callback when workflow changes
 * @param workflow - The updated workflow data
 */
onWorkflowChange?: (workflow: WorkflowData) => void;
```

### Testing

Use the play function to test component interactions:

```typescript
export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Story Format](https://storybook.js.org/docs/api/csf)
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Addons](https://storybook.js.org/docs/addons)
