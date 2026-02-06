# Storybook Quick Reference

## Running Storybook

```bash
# From React package
cd packages/react
npm run storybook

# From root
npm run storybook --workspace=@crystalflow/react
```

**URL:** http://localhost:6006/

## Building Static Storybook

```bash
npm run build-storybook
```

Output: `storybook-static/`

## Creating a New Story

### 1. Create the story file

File: `src/components/MyComponent/MyComponent.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered', // or 'padded', 'fullscreen'
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    propName: {
      description: 'Prop description',
      control: 'text', // or 'boolean', 'number', 'select', etc.
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    propName: 'value',
  },
};

export const Variant: Story = {
  args: {
    propName: 'different value',
  },
};
```

### 2. Control Types

```typescript
argTypes: {
  text: { control: 'text' },
  number: { control: 'number' },
  boolean: { control: 'boolean' },
  select: {
    control: 'select',
    options: ['option1', 'option2']
  },
  radio: {
    control: 'radio',
    options: ['a', 'b', 'c']
  },
  color: { control: 'color' },
  date: { control: 'date' },
  callback: { action: 'clicked' }, // Logs to Actions panel
}
```

### 3. Story Variations

```typescript
// Basic
export const Basic: Story = { args: {} };

// With state
export const Active: Story = { args: { isActive: true } };

// Loading
export const Loading: Story = { args: { isLoading: true } };

// Error
export const Error: Story = { args: { error: 'Error message' } };

// Empty
export const Empty: Story = { args: { items: [] } };

// With data
export const WithData: Story = {
  args: {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
  },
};
```

## Layout Options

```typescript
parameters: {
  layout: 'centered',  // Component centered in canvas
  layout: 'padded',    // Component with padding
  layout: 'fullscreen', // Full canvas width/height
}
```

## Documentation

### Component Description

```typescript
const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    docs: {
      description: {
        component: 'Detailed component description with **markdown** support.',
      },
    },
  },
};
```

### Story Description

```typescript
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Description of this specific story variation.',
      },
    },
  },
  args: {},
};
```

## Actions

Log events to the Actions panel:

```typescript
argTypes: {
  onClick: { action: 'clicked' },
  onChange: { action: 'changed' },
  onSubmit: { action: 'submitted' },
}
```

## Decorators

Wrap stories with providers or context:

```typescript
const meta = {
  // ...
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

## Play Function (Interactions)

Test component interactions:

```typescript
import { userEvent, within } from '@storybook/test';

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await userEvent.type(canvas.getByRole('textbox'), 'Hello');
  },
};
```

## Addons

### Available Addons

1. **Controls** - Dynamically interact with props
2. **Actions** - Log event handlers
3. **Docs** - Auto-generate documentation
4. **A11y** - Accessibility testing
5. **Vitest** - Component testing integration

### Using A11y

Automatically checks accessibility on each story. View results in the A11y panel.

## Tips

### Multiple Stories per Component

Create stories for:

- Default state
- Loading state
- Error state
- Empty state
- With different data
- Different themes (light/dark)
- Selected/unselected
- Active/inactive

### Naming Convention

```
ComponentName.stories.tsx
```

### Story Names

```typescript
export const Default: Story = {};
export const WithData: Story = {};
export const Loading: Story = {};
export const Error: Story = {};
export const Selected: Story = {};
```

### Hidden Stories

Exclude story from sidebar:

```typescript
export const HiddenStory: Story = {
  parameters: {
    docs: { disable: true },
  },
};
```

## Monorepo Integration

Storybook is configured with path aliases:

```typescript
import { Node } from '@crystalflow/core';
import { NodeMetadata } from '@crystalflow/types';
```

These resolve to the source files in sibling packages.

## React Flow Integration

React Flow styles are automatically loaded:

```typescript
// Already included in preview.ts
import 'reactflow/dist/style.css';
```

## Monaco Editor

Monaco Editor is available for JSON editing stories:

```typescript
import Editor from '@monaco-editor/react';

export const WithMonaco: Story = {
  render: () => (
    <Editor
      height="400px"
      defaultLanguage="json"
      defaultValue="{}"
      theme="vs-dark"
    />
  ),
};
```

## Troubleshooting

### Story not showing

- Check file naming: `*.stories.tsx`
- Verify export statement: `export const StoryName: Story = {}`
- Check console for errors

### Props not updating

- Ensure argTypes are defined
- Use `args` in story definition
- Check control type matches prop type

### Imports failing

- Verify path aliases in `.storybook/main.ts`
- Check package dependencies
- Ensure packages are built

## Resources

- [Storybook Docs](https://storybook.js.org/docs)
- [CSF Format](https://storybook.js.org/docs/api/csf)
- [Addons](https://storybook.js.org/docs/addons)
- [React Flow](https://reactflow.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
