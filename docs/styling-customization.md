# Styling & UI Customization Guide

## Overview

ReactFlo provides a comprehensive styling system that allows you to customize every aspect of the workflow builder UI. The API is inspired by popular UI libraries like Material-UI and Chakra UI, offering multiple approaches to styling:

1. **Class Names** - Apply custom CSS classes to components
2. **Inline Styles** - Use React style objects for direct styling
3. **ReactFlow Props** - Pass props directly to underlying ReactFlow components
4. **Component Props** - Customize individual sub-components

This flexibility allows you to integrate ReactFlo seamlessly into any design system or brand guidelines.

## Table of Contents

- [Basic Styling](#basic-styling)
- [Theme System](#theme-system)
- [WorkflowBuilder Customization](#workflowbuilder-customization)
- [ReactFlow Customization](#reactflow-customization)
- [Node Styling](#node-styling)
- [Custom Rendering](#custom-rendering)
- [Toolbar Customization](#toolbar-customization)
- [Component-Specific Customization](#component-specific-customization)
- [Advanced Patterns](#advanced-patterns)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

---

## Theme System

ReactFlo includes a comprehensive theme system with built-in light and dark modes, using a unified set of CSS variables for easy customization.

### Unified CSS Variables

ReactFlo uses a **single set of CSS variables** (`--reactflo-*`) that control the appearance of **all** components:

- **ReactFlo Components**: Toolbar, NodePalette, PropertyPanel, CustomNode
- **ReactFlow Components**: Controls, MiniMap, Background, Edges, Handles

This unified approach means:

- ✅ Change theme once, updates everywhere
- ✅ No duplicate variable definitions
- ✅ Consistent theming across the entire workflow builder
- ✅ Simple customization - just override CSS variables

### How Theme Detection Works

ReactFlo applies theme CSS variables to the WorkflowBuilder root element via inline styles. These CSS variables cascade to all child components:

- **ReactFlo Components**: Directly use `--reactflo-*` variables in their styles
- **ReactFlow Components**: CSS overrides map ReactFlow's hardcoded colors to `--reactflo-*` variables

The theme system automatically:

1. Sets all `--reactflo-*` CSS variables based on the theme
2. ReactFlow components inherit these via CSS overrides
3. Applies theme class (`.reactflo-theme-light` or `.reactflo-theme-dark`) for additional customization
4. Adds `data-theme` attribute for custom CSS targeting

This ensures consistent theming across all UI elements with a single source of truth.

### Using Built-in Themes

Simply pass the `theme` prop to WorkflowBuilder:

```tsx
import { WorkflowBuilder } from '@reactflo/react';

// Light theme (default)
<WorkflowBuilder theme="light" nodes={nodeClasses} />

// Dark theme
<WorkflowBuilder theme="dark" nodes={nodeClasses} />

// Auto - detects system preference
<WorkflowBuilder theme="auto" nodes={nodeClasses} />
```

### Theme Switcher Example

Create an interactive theme switcher:

```tsx
import { useState } from 'react';
import { WorkflowBuilder } from '@reactflo/react';

function ThemedWorkflow() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTheme('light')}>☀️ Light</button>
        <button onClick={() => setTheme('dark')}>🌙 Dark</button>
        <button onClick={() => setTheme('auto')}>🔄 Auto</button>
      </div>

      <WorkflowBuilder theme={theme} nodes={nodeClasses} />
    </div>
  );
}
```

### Custom Theme Configuration

Create a custom theme with the `createTheme` helper:

```tsx
import { WorkflowBuilder, createTheme } from '@reactflo/react';

// Create custom light theme
const customLight = createTheme('light', {
  toolbar: {
    background: '#e3f2fd',
    text: '#1565c0',
    border: '#90caf9',
  },
  node: {
    background: '#ffffff',
    border: '#2196f3',
    text: '#1565c0',
  },
  button: {
    primary: '#1976d2',
    secondary: '#e3f2fd',
  },
});

<WorkflowBuilder theme={customLight} nodes={nodeClasses} />;

// Create custom dark theme
const customDark = createTheme('dark', {
  canvas: {
    background: '#0a0a0a',
    grid: '#1a1a1a',
  },
  node: {
    background: '#1e1e1e',
    border: '#404040',
    text: '#e0e0e0',
  },
});

<WorkflowBuilder theme={customDark} nodes={nodeClasses} />;
```

### Full Theme Object

For complete control, provide a full theme object:

```tsx
import { WorkflowBuilder, Theme } from '@reactflo/react';

const myTheme: Theme = {
  mode: 'dark',
  colors: {
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      tertiary: '#0f3460',
    },
    text: {
      primary: '#eee',
      secondary: '#aaa',
      disabled: '#666',
    },
    border: {
      primary: '#0f3460',
      secondary: '#16213e',
      focus: '#e94560',
    },
    toolbar: {
      background: '#16213e',
      text: '#eee',
      border: '#0f3460',
    },
    palette: {
      background: '#16213e',
      categoryHeader: '#0f3460',
      itemHover: '#1a1a2e',
      text: '#eee',
      textSecondary: '#aaa',
    },
    properties: {
      background: '#16213e',
      header: '#0f3460',
      text: '#eee',
      border: '#0f3460',
    },
    canvas: {
      background: '#0f0f1e',
      grid: '#1a1a2e',
    },
    node: {
      background: '#16213e',
      border: '#0f3460',
      text: '#eee',
      header: '#1a1a2e',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    button: {
      primary: '#e94560',
      secondary: '#16213e',
      hover: '#1a1a2e',
      active: '#c23b52',
      disabled: '#0f3460',
      text: '#eee',
    },
    status: {
      success: '#2ecc71',
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
    },
  },
};

<WorkflowBuilder theme={myTheme} nodes={nodeClasses} />;
```

### CSS Variables

All themes use CSS variables that control **both ReactFlo and ReactFlow** components. Override them in your CSS to customize any aspect:

```css
/* Override specific theme variables - affects ALL components */
.my-workflow {
  --reactflo-node-bg: #ffffff;
  --reactflo-node-border: #e0e0e0;
  --reactflo-node-text: #333333;
  --reactflo-toolbar-bg: #f5f5f5;
  --reactflo-button-primary: #007bff;
  /* These variables also style ReactFlow controls, minimap, edges, etc. */
}

/* Dark mode overrides */
[data-theme='dark'] .my-workflow {
  --reactflo-node-bg: #2d2d2d;
  --reactflo-node-border: #404040;
  --reactflo-node-text: #e0e0e0;
}
```

**Available CSS Variables (used by both ReactFlo & ReactFlow):**

| Variable                      | Affects                          | Light Default | Dark Default |
| ----------------------------- | -------------------------------- | ------------- | ------------ |
| `--reactflo-bg-primary`       | Canvas, main backgrounds         | `#ffffff`     | `#1e1e1e`    |
| `--reactflo-bg-secondary`     | Toolbar, MiniMap background      | `#f9f9f9`     | `#2d2d2d`    |
| `--reactflo-text-primary`     | All text, Controls icons         | `#333333`     | `#e0e0e0`    |
| `--reactflo-text-secondary`   | Secondary labels                 | `#666666`     | `#b0b0b0`    |
| `--reactflo-border-primary`   | Edges, borders, Controls         | `#dddddd`     | `#404040`    |
| `--reactflo-node-bg`          | Custom nodes, MiniMap nodes      | `#ffffff`     | `#2d2d2d`    |
| `--reactflo-node-border`      | Node borders, MiniMap strokes    | `#dddddd`     | `#404040`    |
| `--reactflo-toolbar-bg`       | Toolbar background               | `#f9f9f9`     | `#2d2d2d`    |
| `--reactflo-button-primary`   | Buttons, Handles, selected edges | `#3498db`     | `#5dade2`    |
| `--reactflo-button-secondary` | Controls buttons                 | `#f9f9f9`     | `#2d2d2d`    |
| `--reactflo-button-hover`     | Button hover, Controls hover     | `#e3e3e3`     | `#3a3a3a`    |
| `--reactflo-canvas-bg`        | Canvas background                | `#ffffff`     | `#1e1e1e`    |
| `--reactflo-canvas-grid`      | Background pattern               | `#e3e3e3`     | `#2a2a2a`    |
| `--reactflo-status-success`   | Success indicators               | `#27ae60`     | `#2ecc71`    |
| `--reactflo-status-error`     | Error indicators                 | `#e74c3c`     | `#e74c3c`    |

**Key Benefits:**

- 🎨 Single variable controls multiple components
- 🔄 Change once, updates everywhere (nodes, controls, minimap, etc.)
- 🎯 Predictable - same variable names across all features
- 📝 Override any aspect by setting CSS variables

See the full list with all categories in the [API Reference](#api-reference) section.

### System Theme Detection

When using `theme="auto"`, ReactFlo automatically detects the user's system preference:

```tsx
<WorkflowBuilder
  theme="auto" // Respects prefers-color-scheme media query
  nodes={nodeClasses}
/>
```

This uses the browser's `prefers-color-scheme` media query to select light or dark mode.

### Troubleshooting Theme Issues

If some components aren't respecting the theme:

**Issue**: ReactFlow components (Controls, MiniMap) not themed correctly

**Solution**: Ensure WorkflowBuilder has sufficient space and CSS variables cascade properly:

```tsx
// ✅ Good - Theme variables applied to parent container
<div style={{ height: '100vh' }}>
  <WorkflowBuilder theme="dark" nodes={nodeClasses} />
</div>

// ❌ Bad - No height, theme variables might not apply
<WorkflowBuilder theme="dark" nodes={nodeClasses} />
```

**Issue**: Custom styles overriding theme

**Solution**: Use CSS specificity or `!important` (sparingly):

```css
/* Override with higher specificity */
.reactflo-theme-dark .reactflow-controls button {
  background: var(--xy-controls-button-background-color);
}
```

**Issue**: Theme not updating on system preference change

**Solution**: Use `theme="auto"` and ensure window is defined:

```tsx
const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

// Listen to system changes
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => setTheme('auto'); // Force re-render
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}, []);
```

### Example: Complete Theme Demo

See [ThemeDemo example](../packages/examples/src/examples/ThemeDemo.tsx) for a complete implementation with:

- Theme switcher buttons
- Light/dark/auto modes
- System preference detection
- Smooth theme transitions

```tsx
import { WorkflowBuilder } from '@reactflo/react';

<WorkflowBuilder
  theme="auto"
  nodes={nodeClasses}
  reactFlowCustomization={{
    backgroundProps: {
      // Background automatically adapts to theme
      variant: BackgroundVariant.Dots,
    },
  }}
/>;
```

---

## Basic Styling

### Using Class Names

Apply custom CSS classes to any component using the `className` prop:

```tsx
<WorkflowBuilder className="my-workflow-builder" nodes={[AddNode, MultiplyNode]} />
```

```css
/* Your CSS file */
.my-workflow-builder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

### Using Inline Styles

Apply inline styles using the `style` prop:

```tsx
<WorkflowBuilder
  style={{
    backgroundColor: '#f5f5f5',
    border: '2px solid #ddd',
    borderRadius: '8px',
  }}
  nodes={[AddNode, MultiplyNode]}
/>
```

---

## WorkflowBuilder Customization

The `WorkflowBuilder` component supports granular styling of all its sub-components.

### Component Structure

```
WorkflowBuilder (root)
├── Toolbar (toolbar)
├── Main Content
│   ├── NodePalette (palette)
│   ├── WorkflowCanvas (canvas)
│   └── PropertyPanel (properties)
```

### Using `classes` Prop

Apply custom classes to sub-components:

```tsx
<WorkflowBuilder
  classes={{
    root: 'workflow-root',
    toolbar: 'workflow-toolbar',
    palette: 'workflow-palette',
    canvas: 'workflow-canvas',
    properties: 'workflow-properties',
  }}
  nodes={nodeClasses}
/>
```

```css
/* Your CSS */
.workflow-toolbar {
  background: #2c3e50;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.workflow-palette {
  background: white;
  border-right: 2px solid #3498db;
}

.workflow-canvas {
  background: #ecf0f1;
}

.workflow-properties {
  background: white;
  border-left: 2px solid #3498db;
}
```

### Using `styles` Prop

Apply inline styles to sub-components:

```tsx
<WorkflowBuilder
  styles={{
    root: {
      backgroundColor: '#ecf0f1',
    },
    toolbar: {
      backgroundColor: '#34495e',
      borderBottom: '2px solid #2c3e50',
    },
    palette: {
      backgroundColor: '#ffffff',
      width: '300px', // Override default width
    },
    properties: {
      backgroundColor: '#ffffff',
      width: '350px', // Override default width
    },
  }}
  nodes={nodeClasses}
/>
```

---

## ReactFlow Customization

### ReactFlow Props

Pass props directly to the underlying ReactFlow component:

```tsx
<WorkflowBuilder
  reactFlowCustomization={{
    reactFlowProps: {
      // Grid snapping
      snapToGrid: true,
      snapGrid: [15, 15],

      // Viewport control
      defaultViewport: { x: 50, y: 50, zoom: 1 },
      minZoom: 0.2,
      maxZoom: 2,

      // Connection style
      connectionLineType: 'smoothstep', // 'default' | 'straight' | 'step' | 'smoothstep'

      // Interaction controls
      zoomOnScroll: true,
      panOnScroll: false,
      panOnDrag: true,
      nodesDraggable: true,
      nodesConnectable: true,
      elementsSelectable: true,
      selectNodesOnDrag: false,

      // Keyboard shortcuts
      deleteKeyCode: 'Backspace',
      selectionKeyCode: 'Shift',
      multiSelectionKeyCode: 'Meta',
    },
  }}
  nodes={nodeClasses}
/>
```

### Background Customization

Customize the canvas background pattern:

```tsx
import { BackgroundVariant } from 'reactflow';

<WorkflowBuilder
  reactFlowCustomization={{
    backgroundProps: {
      variant: BackgroundVariant.Dots, // 'dots' | 'lines' | 'cross'
      gap: 20, // Gap between grid elements
      size: 1.5, // Size of grid elements
      color: '#aaa', // Color of grid elements
      className: 'custom-background',
      style: { opacity: 0.5 },
    },
    showBackground: true, // Toggle background visibility
  }}
  nodes={nodeClasses}
/>;
```

**Background Variants:**

- `BackgroundVariant.Dots` - Dotted grid pattern
- `BackgroundVariant.Lines` - Line grid pattern
- `BackgroundVariant.Cross` - Cross pattern

### Controls Customization

Customize the zoom and fit view controls:

```tsx
<WorkflowBuilder
  reactFlowCustomization={{
    controlsProps: {
      showZoom: true,
      showFitView: true,
      showInteractive: true,
      position: 'bottom-left', // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
      className: 'custom-controls',
      style: {
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
      },
    },
    showControls: true, // Toggle controls visibility
  }}
  nodes={nodeClasses}
/>
```

### MiniMap Customization

Customize the mini-map overview:

```tsx
<WorkflowBuilder
  reactFlowCustomization={{
    miniMapProps: {
      // Node coloring function
      nodeColor: (node) => {
        if (node.data?.category === 'Input') return '#3498db';
        if (node.data?.category === 'Math') return '#e74c3c';
        if (node.data?.category === 'Output') return '#2ecc71';
        return '#95a5a6';
      },

      // Appearance
      nodeStrokeColor: '#333',
      nodeBorderRadius: 4,
      maskColor: 'rgba(0, 0, 0, 0.2)',

      // Position
      position: 'bottom-right',

      // Styling
      className: 'custom-minimap',
      style: {
        backgroundColor: 'white',
        border: '2px solid #ddd',
      },
    },
    showMiniMap: true, // Toggle minimap visibility
  }}
  nodes={nodeClasses}
/>
```

---

## Node Styling

ReactFlo uses ReactFlow's built-in class-based styling system for nodes. This allows you to customize node appearance using standard CSS while leveraging ReactFlow's optimized rendering.

### Default Node Classes

ReactFlo automatically applies these CSS classes to custom nodes:

```
.react-flow__node-custom          - Root node wrapper (applied by ReactFlow)
  └─ .node-content                - Node content container
       ├─ .node-header            - Node header section
       │    ├─ .node-label        - Node label text
       │    └─ .node-type         - Node type text
       ├─ .node-ports             - Ports container
       │    ├─ .node-inputs       - Input ports section
       │    │    └─ .port-label   - Input port label
       │    └─ .node-outputs      - Output ports section
       │         └─ .port-label   - Output port label
       └─ .react-flow__handle      - Connection handles (applied by ReactFlow)
```

### Basic Node Styling

Create a CSS file to customize your nodes:

```css
/* Global node styling */
.react-flow__node-custom {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.react-flow__node-custom.selected {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.node-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 6px 6px 0 0;
}

.node-label {
  font-weight: bold;
  font-size: 14px;
}

.node-type {
  font-size: 11px;
  opacity: 0.8;
}

.port-label {
  font-size: 12px;
  color: #666;
}

.react-flow__handle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #555;
  border: 2px solid white;
}
```

### Category-Based Styling

Style nodes differently based on their category using CSS attribute selectors or wrapper classes:

```css
/* Using wrapper class in your app */
.styled-canvas .react-flow__node-custom[data-category='input'] {
  border-color: #3498db;
}

.styled-canvas .react-flow__node-custom[data-category='input'] .node-header {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.styled-canvas .react-flow__node-custom[data-category='math'] {
  border-color: #e74c3c;
}

.styled-canvas .react-flow__node-custom[data-category='math'] .node-header {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.styled-canvas .react-flow__node-custom[data-category='output'] {
  border-color: #2ecc71;
}

.styled-canvas .react-flow__node-custom[data-category='output'] .node-header {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}
```

### Advanced Node Effects

Add animations, shadows, and interactive effects:

```css
/* Hover effects */
.react-flow__node-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glow effect */
.react-flow__node-custom {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(233, 69, 96, 0.3);
}

/* Pulse animation */
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(233, 69, 96, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(233, 69, 96, 0.6);
  }
}

.react-flow__node-custom {
  animation: pulse 3s ease-in-out infinite;
}

/* Glass morphism */
.react-flow__node-custom {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Using CSS Variables for Theming

Create themeable nodes with CSS custom properties:

```css
:root {
  --node-bg: white;
  --node-border: #ddd;
  --node-header-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --node-text: #333;
  --node-shadow: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --node-bg: #2c3e50;
  --node-border: #34495e;
  --node-header-bg: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  --node-text: #ecf0f1;
  --node-shadow: rgba(0, 0, 0, 0.3);
}

.react-flow__node-custom {
  background: var(--node-bg);
  border-color: var(--node-border);
  color: var(--node-text);
  box-shadow: 0 2px 4px var(--node-shadow);
}

.node-header {
  background: var(--node-header-bg);
}
```

### Complete Node Styling Example

See the [StyledWorkflow example](../packages/examples/src/examples/StyledWorkflow.tsx) for a complete cyberpunk-themed implementation with:

- Category-based node coloring
- Gradient backgrounds and glows
- Pulse animations
- Custom handle styling
- Dark theme integration

```tsx
import './StyledWorkflow.css';

<div className="styled-canvas">
  <WorkflowBuilder
    nodes={nodeClasses}
    reactFlowCustomization={{
      backgroundProps: {
        variant: BackgroundVariant.Dots,
        color: '#2c3e50',
      },
    }}
  />
</div>;
```

---

## Custom Rendering

ReactFlo provides powerful custom rendering capabilities that give you complete control over how components are displayed. This goes beyond styling to allow you to completely replace the rendering logic for nodes, palette items, and toolbar.

### Custom Node Content Rendering

The `renderNodeContent` prop allows you to completely customize what's displayed inside each node on the canvas.

**Basic Example:**

```tsx
import { WorkflowBuilder, CustomNodeData } from '@reactflo/react';

<WorkflowBuilder
  nodes={nodeClasses}
  renderNodeContent={(data: CustomNodeData) => (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <h3>{data.label}</h3>
      <p>{data.type}</p>
    </div>
  )}
/>;
```

**Category-Based Rendering:**

```tsx
const renderNodeContent = (data: CustomNodeData) => {
  const inputs = data.inputs ? Object.entries(data.inputs) : [];

  switch (data.category) {
    case 'Input':
      return (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>📥</div>
          <div style={{ fontWeight: 'bold' }}>{data.label}</div>
          {inputs.map(([key]) => (
            <div key={key} style={{ fontSize: '20px', color: '#3282b8' }}>
              {String(data[key])}
            </div>
          ))}
        </div>
      );

    case 'Math':
      const symbol = data.label.includes('Add') ? '+' : '×';
      return (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{symbol}</div>
          <div style={{ fontSize: '12px' }}>{data.label}</div>
        </div>
      );

    case 'Output':
      return (
        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: '32px', textAlign: 'center' }}>📤</div>
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>{data.label}</div>
          {inputs.map(([key, port]) => (
            <div key={key}>
              <div style={{ fontSize: '11px', color: '#34d399' }}>{port.label || key}</div>
              {data[key] !== undefined && (
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{String(data[key])}</div>
              )}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div style={{ padding: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>{data.label}</div>
          <div style={{ fontSize: '11px', color: '#888' }}>{data.type}</div>
        </div>
      );
  }
};

<WorkflowBuilder nodes={nodeClasses} renderNodeContent={renderNodeContent} />;
```

**What You Can Access:**

The `CustomNodeData` interface provides:

- `label` - Node label
- `type` - Node type identifier
- `category` - Node category
- `inputs` - Input port definitions
- `outputs` - Output port definitions
- All node property values (accessible via `data[propertyName]`)

**Important Notes:**

- Connection handles are automatically rendered around your custom content
- Your render function should return valid React elements
- Changes to property values will trigger re-renders automatically
- Use `React.memo()` for performance optimization with complex renderers

### Custom Palette Item Rendering

The `renderPaletteItem` prop lets you customize how nodes appear in the sidebar palette.

**Basic Example:**

```tsx
<WorkflowBuilder
  nodes={nodeClasses}
  renderPaletteItem={(item) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>📦</span>
      <div>
        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>{item.type}</div>
      </div>
    </div>
  )}
/>
```

**Category-Based Palette Items:**

```tsx
const renderPaletteItem = (item: { type: string; label: string; category?: string }) => {
  // Determine emoji based on category
  const emoji =
    item.category === 'Input'
      ? '📥'
      : item.category === 'Math'
        ? '🔢'
        : item.category === 'Output'
          ? '📤'
          : '📦';

  // Determine color based on category
  const color =
    item.category === 'Input'
      ? '#3282b8'
      : item.category === 'Math'
        ? '#fbbf24'
        : item.category === 'Output'
          ? '#34d399'
          : '#888';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '13px', color }}>{item.label}</div>
        <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>{item.type}</div>
      </div>
    </div>
  );
};

<WorkflowBuilder nodes={nodeClasses} renderPaletteItem={renderPaletteItem} />;
```

### Custom Toolbar Rendering

The `renderToolbar` prop gives you complete control over the toolbar, while still providing access to all workflow actions.

**Basic Example:**

```tsx
<WorkflowBuilder
  nodes={nodeClasses}
  renderToolbar={(actions) => (
    <div style={{ padding: '12px', backgroundColor: '#2c3e50', display: 'flex', gap: '10px' }}>
      <button
        onClick={actions.onExecute}
        disabled={!actions.canExecute}
        style={{
          padding: '8px 16px',
          backgroundColor: actions.canExecute ? '#27ae60' : '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        ▶️ Execute
      </button>

      <button
        onClick={actions.onSave}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        💾 Save
      </button>

      <button
        onClick={actions.onLoad}
        style={{
          padding: '8px 16px',
          backgroundColor: '#9b59b6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        📂 Load
      </button>

      <button
        onClick={actions.onClear}
        style={{
          padding: '8px 16px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        🗑️ Clear
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ color: '#ecf0f1', fontSize: '12px' }}>
        {actions.canExecute ? '✅ Ready' : '⚠️ Add nodes'}
      </div>
    </div>
  )}
/>
```

**Available Actions:**

The `renderToolbar` function receives an actions object with:

- `onExecute: () => void` - Execute the workflow
- `onSave: () => void` - Save workflow to file
- `onLoad: () => void` - Load workflow from file
- `onClear: () => void` - Clear the canvas
- `canExecute: boolean` - Whether workflow can be executed

**Complete Example:**

See [CustomRenderWorkflow example](../packages/examples/src/examples/CustomRenderWorkflow.tsx) for a full implementation with:

- Category-specific node layouts
- Icon-based palette items
- Custom styled toolbar
- Dynamic value displays
- Emoji-enhanced UI

---

## Toolbar Customization

Beyond custom rendering, ReactFlo provides fine-grained control over toolbar buttons.

### Toolbar Options

Configure which buttons appear in the toolbar:

```tsx
<WorkflowBuilder
  toolbarOptions={{
    showExecute: true, // Show execute button
    showSave: true, // Show save button
    showLoad: true, // Show load button
    showClear: true, // Show clear button
    showUndoRedo: false, // Show undo/redo buttons (default: false)
  }}
/>
```

**Example - Execute-Only Toolbar:**

```tsx
<WorkflowBuilder
  toolbarOptions={{
    showExecute: true,
    showSave: false,
    showLoad: false,
    showClear: false,
    showUndoRedo: false,
  }}
/>
```

### Toolbar Icons

Customize or remove toolbar button icons:

```tsx
<WorkflowBuilder
  toolbarIcons={{
    execute: '▶', // Custom execute icon
    save: '💾', // Keep default save icon
    load: null, // Remove load icon
    clear: '✖', // Custom clear icon (X symbol)
    undo: '↶', // Custom undo icon
    redo: '↷', // Custom redo icon
  }}
/>
```

**Icon Options:**

- **String value** - Replace with custom icon/text
- **`null` / `false` / `''`** - Remove icon entirely
- **`undefined`** - Use default icon

**Example - Text-Only Buttons:**

```tsx
<WorkflowBuilder
  toolbarIcons={{
    execute: null, // No icon, just "Execute" text
    save: null, // No icon, just "Save" text
    load: null, // No icon, just "Load" text
    clear: null, // No icon, just "Clear" text
  }}
/>
```

**Example - Custom Unicode Icons:**

```tsx
<WorkflowBuilder
  toolbarIcons={{
    execute: '▸', // Right-pointing triangle
    save: '⊕', // Circled plus
    load: '↓', // Down arrow
    clear: '⊗', // Circled times
  }}
/>
```

### Combined Toolbar Customization

Use `toolbarOptions`, `toolbarIcons`, and `toolbarProps` together:

```tsx
<WorkflowBuilder
  // Show only execute and clear
  toolbarOptions={{
    showExecute: true,
    showSave: false,
    showLoad: false,
    showClear: true,
  }}
  // Custom icons
  toolbarIcons={{
    execute: '🚀',
    clear: '🗑️',
  }}
  // Custom styles
  toolbarProps={{
    style: {
      backgroundColor: '#2c3e50',
      borderBottom: '3px solid #34495e',
    },
    classes: {
      button: 'custom-toolbar-button',
    },
  }}
/>
```

---

## Component-Specific Customization

### NodePalette Customization

Customize the node palette sidebar:

```tsx
<WorkflowBuilder
  nodePaletteProps={{
    // Behavior
    groupByCategory: true,

    // Class names
    classes: {
      root: 'custom-palette',
      search: 'custom-palette-search',
      categoryHeader: 'custom-palette-category',
      nodeItem: 'custom-palette-item',
      empty: 'custom-palette-empty',
    },

    // Styles
    styles: {
      root: {
        width: '300px',
        backgroundColor: '#f9f9f9',
      },
      search: {
        borderColor: '#3498db',
        borderWidth: '2px',
      },
      categoryHeader: {
        color: '#2c3e50',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
      nodeItem: {
        borderRadius: '8px',
        transition: 'all 0.3s ease',
      },
    },
  }}
  nodes={nodeClasses}
/>
```

### PropertyPanel Customization

Customize the properties panel:

```tsx
<WorkflowBuilder
  propertyPanelProps={{
    // Class names
    classes: {
      root: 'custom-properties',
      header: 'custom-properties-header',
      group: 'custom-properties-group',
      label: 'custom-properties-label',
      input: 'custom-properties-input',
      empty: 'custom-properties-empty',
    },

    // Styles
    styles: {
      root: {
        width: '350px',
        backgroundColor: 'white',
      },
      header: {
        color: '#2c3e50',
        borderBottom: '2px solid #ecf0f1',
        paddingBottom: '10px',
      },
      label: {
        color: '#34495e',
        fontSize: '14px',
      },
      input: {
        borderColor: '#3498db',
        borderWidth: '2px',
        borderRadius: '4px',
      },
    },
  }}
  nodes={nodeClasses}
/>
```

### Toolbar Customization

Customize the toolbar:

```tsx
<WorkflowBuilder
  toolbarProps={{
    // Class names
    classes: {
      root: 'custom-toolbar',
      button: 'custom-toolbar-button',
      buttonGroup: 'custom-toolbar-group',
      buttonDisabled: 'custom-toolbar-button-disabled',
      buttonActive: 'custom-toolbar-button-active',
    },

    // Styles
    styles: {
      root: {
        backgroundColor: '#2c3e50',
        padding: '15px',
      },
      button: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        padding: '10px 20px',
      },
      buttonDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      buttonActive: {
        backgroundColor: '#e74c3c',
      },
    },
  }}
  nodes={nodeClasses}
/>
```

---

## Advanced Patterns

### Theming with CSS Variables

Create a theme using CSS variables:

```css
/* theme.css */
:root {
  --workflow-bg: #ecf0f1;
  --toolbar-bg: #34495e;
  --palette-bg: white;
  --properties-bg: white;
  --accent-color: #3498db;
  --border-color: #bdc3c7;
  --text-color: #2c3e50;
}

.workflow-root {
  background: var(--workflow-bg);
}

.workflow-toolbar {
  background: var(--toolbar-bg);
  border-bottom: 2px solid var(--accent-color);
}

.workflow-palette {
  background: var(--palette-bg);
  border-right: 2px solid var(--border-color);
}
```

```tsx
import './theme.css';

<WorkflowBuilder
  classes={{
    root: 'workflow-root',
    toolbar: 'workflow-toolbar',
    palette: 'workflow-palette',
  }}
  nodes={nodeClasses}
/>;
```

### Dark Mode Theme

Implement a dark mode theme:

```tsx
const darkTheme = {
  classes: {
    root: 'dark-workflow',
    toolbar: 'dark-toolbar',
    palette: 'dark-palette',
    canvas: 'dark-canvas',
    properties: 'dark-properties',
  },
  styles: {
    root: {
      backgroundColor: '#1a1a1a',
    },
    toolbar: {
      backgroundColor: '#2d2d2d',
      borderBottom: '1px solid #404040',
    },
    palette: {
      backgroundColor: '#252525',
      borderRight: '1px solid #404040',
    },
    properties: {
      backgroundColor: '#252525',
      borderLeft: '1px solid #404040',
    },
  },
  reactFlowCustomization: {
    backgroundProps: {
      variant: BackgroundVariant.Dots,
      color: '#404040',
    },
  },
};

<WorkflowBuilder {...darkTheme} nodes={nodeClasses} />;
```

### Responsive Styling

Create responsive layouts:

```tsx
const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

function MyWorkflow() {
  const isMobile = useResponsiveLayout();

  return (
    <WorkflowBuilder
      showPalette={!isMobile}
      showProperties={!isMobile}
      styles={{
        palette: {
          width: isMobile ? '100%' : '250px',
        },
        properties: {
          width: isMobile ? '100%' : '300px',
        },
      }}
      nodes={nodeClasses}
    />
  );
}
```

---

## Complete Examples

### Example 1: Minimal Styling

```tsx
import { WorkflowBuilder } from '@reactflo/react';
import { AddNode, MultiplyNode } from './nodes';

export function MinimalWorkflow() {
  return <WorkflowBuilder nodes={[AddNode, MultiplyNode]} style={{ height: '100vh' }} />;
}
```

### Example 2: Custom Theme

```tsx
import { WorkflowBuilder } from '@reactflo/react';
import { BackgroundVariant } from 'reactflow';
import { AddNode, MultiplyNode, DisplayNode } from './nodes';

export function ThemedWorkflow() {
  return (
    <WorkflowBuilder
      nodes={[AddNode, MultiplyNode, DisplayNode]}
      classes={{
        toolbar: 'custom-toolbar',
        palette: 'custom-palette',
        properties: 'custom-properties',
      }}
      styles={{
        root: {
          backgroundColor: '#f0f2f5',
        },
      }}
      reactFlowCustomization={{
        backgroundProps: {
          variant: BackgroundVariant.Dots,
          gap: 15,
          color: '#d0d0d0',
        },
        miniMapProps: {
          nodeColor: '#4a90e2',
          position: 'bottom-right',
        },
      }}
    />
  );
}
```

### Example 3: Full Customization

See [`packages/examples/src/examples/StyledWorkflow.tsx`](../packages/examples/src/examples/StyledWorkflow.tsx) for a complete example demonstrating all customization options.

---

## Best Practices

### 1. Use CSS Classes for Themes

Prefer CSS classes over inline styles for reusable themes:

✅ **Good:**

```tsx
<WorkflowBuilder classes={{ root: 'my-theme' }} />
```

❌ **Avoid:**

```tsx
<WorkflowBuilder
  style={
    {
      /* lots of inline styles */
    }
  }
/>
```

### 2. Combine Approaches

Use both classes and styles for maximum flexibility:

```tsx
<WorkflowBuilder
  classes={{ toolbar: 'toolbar-base' }} // Base styling via CSS
  styles={{ toolbar: { height: '60px' } }} // Dynamic override
/>
```

### 3. Leverage ReactFlow Features

Use ReactFlow's built-in features instead of reinventing:

```tsx
<WorkflowBuilder
  reactFlowCustomization={{
    reactFlowProps: {
      snapToGrid: true, // Use built-in snapping
      snapGrid: [15, 15],
    },
  }}
/>
```

### 4. Keep Styles Maintainable

Organize your styles in separate files:

```
src/
├── components/
│   └── MyWorkflow.tsx
├── styles/
│   ├── workflow-theme.css
│   └── dark-theme.css
└── themes/
    └── workflowTheme.ts
```

### 5. Test Across Browsers

Ensure your custom styles work across different browsers, especially:

- Chrome/Edge (Chromium)
- Firefox
- Safari

### 6. Consider Accessibility

When customizing styles, maintain accessibility:

```tsx
<WorkflowBuilder
  styles={{
    button: {
      minHeight: '44px', // Touch target size
      fontSize: '16px', // Readable text
    },
  }}
/>
```

### 7. Use TypeScript

TypeScript provides excellent autocomplete and type safety:

```tsx
import { WorkflowBuilderProps } from '@reactflo/react';

const myTheme: Partial<WorkflowBuilderProps> = {
  classes: {
    root: 'my-workflow',
    toolbar: 'my-toolbar',
  },
  styles: {
    root: {
      backgroundColor: '#f5f5f5',
    },
  },
};

<WorkflowBuilder {...myTheme} nodes={nodeClasses} />;
```

### 8. Optimize Custom Renderers

When using `renderNodeContent`, `renderPaletteItem`, or `renderToolbar`:

**Extract Renderers Outside Component:**

```tsx
// ❌ Bad - Creates new function on every render
function MyWorkflow() {
  return <WorkflowBuilder renderNodeContent={(data) => <div>{data.label}</div>} />;
}

// ✅ Good - Reuses same function reference
const renderNodeContent = (data: CustomNodeData) => <div>{data.label}</div>;

function MyWorkflow() {
  return <WorkflowBuilder renderNodeContent={renderNodeContent} />;
}
```

**Use React.memo for Complex Components:**

```tsx
const ComplexNodeRenderer = React.memo(({ data }: { data: CustomNodeData }) => {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});

const renderNodeContent = (data: CustomNodeData) => <ComplexNodeRenderer data={data} />;
```

**Avoid Heavy Computations:**

```tsx
// ❌ Bad - Recalculates on every render
const renderNodeContent = (data: CustomNodeData) => {
  const heavyComputation = processData(data); // Expensive
  return <div>{heavyComputation}</div>;
};

// ✅ Good - Use useMemo or compute in advance
const nodeDataCache = new Map();

const renderNodeContent = (data: CustomNodeData) => {
  if (!nodeDataCache.has(data.id)) {
    nodeDataCache.set(data.id, processData(data));
  }
  return <div>{nodeDataCache.get(data.id)}</div>;
};
```

### 9. Choose the Right Customization Level

Use the appropriate level of customization for your needs:

| Need                     | Solution                 | Complexity         |
| ------------------------ | ------------------------ | ------------------ |
| Change colors/fonts      | CSS classes              | ⭐ Low             |
| Adjust layout            | Inline styles            | ⭐ Low             |
| Theme integration        | CSS variables            | ⭐⭐ Medium        |
| Category-specific styles | CSS with data attributes | ⭐⭐ Medium        |
| Custom node layouts      | `renderNodeContent`      | ⭐⭐⭐ High        |
| Complete UI redesign     | All render props         | ⭐⭐⭐⭐ Very High |

**Start simple and progressively enhance:**

```tsx
// Level 1: Just change colors
<WorkflowBuilder style={{ backgroundColor: '#f0f0f0' }} />

// Level 2: Add category colors
<WorkflowBuilder className="themed-workflow" /> // + CSS

// Level 3: Custom node rendering
<WorkflowBuilder renderNodeContent={customRenderer} />
```

---

## API Reference

### WorkflowBuilder Props

| Prop                     | Type                                   | Description                              |
| ------------------------ | -------------------------------------- | ---------------------------------------- |
| `className`              | `string`                               | Root component class name                |
| `style`                  | `React.CSSProperties`                  | Root component inline styles             |
| `theme`                  | `Theme \| 'light' \| 'dark' \| 'auto'` | Theme configuration (default: 'light')   |
| `classes`                | `WorkflowBuilderClasses`               | Class names for sub-components           |
| `styles`                 | `WorkflowBuilderStyles`                | Inline styles for sub-components         |
| `reactFlowCustomization` | `ReactFlowCustomization`               | ReactFlow component customization        |
| `nodePaletteProps`       | `Partial<NodePaletteProps>`            | Node palette customization               |
| `propertyPanelProps`     | `Partial<PropertyPanelProps>`          | Property panel customization             |
| `toolbarProps`           | `Partial<ToolbarProps>`                | Toolbar customization                    |
| `toolbarOptions`         | `ToolbarOptions`                       | Configure which toolbar buttons to show  |
| `toolbarIcons`           | `ToolbarIcons`                         | Customize or remove toolbar button icons |
| `renderNodeContent`      | `(data: CustomNodeData) => ReactNode`  | Custom node content renderer             |
| `renderPaletteItem`      | `(item) => ReactNode`                  | Custom palette item renderer             |
| `renderToolbar`          | `(actions) => ReactNode`               | Custom toolbar renderer                  |

### WorkflowBuilderClasses

```typescript
interface WorkflowBuilderClasses {
  root?: string;
  toolbar?: string;
  palette?: string;
  canvas?: string;
  properties?: string;
}
```

### ToolbarOptions

```typescript
interface ToolbarOptions {
  showExecute?: boolean; // Default: true
  showSave?: boolean; // Default: true
  showLoad?: boolean; // Default: true
  showClear?: boolean; // Default: true
  showUndoRedo?: boolean; // Default: false
}
```

### ToolbarIcons

```typescript
interface ToolbarIcons {
  execute?: string | null | false; // Default: '▶️'
  save?: string | null | false; // Default: '💾'
  load?: string | null | false; // Default: '📁'
  clear?: string | null | false; // Default: '🗑️'
  undo?: string | null | false; // Default: '↶'
  redo?: string | null | false; // Default: '↷'
}
```

### Theme

```typescript
interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

interface ThemeColors {
  background: { primary: string; secondary: string; tertiary: string };
  text: { primary: string; secondary: string; disabled: string };
  border: { primary: string; secondary: string; focus: string };
  toolbar: { background: string; text: string; border: string };
  palette: {
    background: string;
    categoryHeader: string;
    itemHover: string;
    text: string;
    textSecondary: string;
  };
  properties: { background: string; header: string; text: string; border: string };
  canvas: { background: string; grid: string };
  node: { background: string; border: string; text: string; header: string; shadow: string };
  button: {
    primary: string;
    secondary: string;
    hover: string;
    active: string;
    disabled: string;
    text: string;
  };
  status: { success: string; error: string; warning: string; info: string };
}
```

**Theme Utilities:**

```typescript
// Create custom theme
function createTheme(mode: 'light' | 'dark', overrides?: Partial<ThemeColors>): Theme;

// Detect system theme
function detectSystemTheme(): 'light' | 'dark';

// Convert theme to CSS variables
function themeToCSSVariables(theme: Theme): Record<string, string>;
```

### ReactFlowCustomization

```typescript
interface ReactFlowCustomization {
  reactFlowProps?: ReactFlowCustomProps;
  backgroundProps?: BackgroundCustomProps;
  controlsProps?: ControlsCustomProps;
  miniMapProps?: MiniMapCustomProps;
  showBackground?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
}
```

---

## Troubleshooting

### Styles Not Applying

1. **Check CSS specificity**: Your custom classes may be overridden by default styles

   ```css
   /* Increase specificity */
   .my-workflow.workflow-builder {
     background: red;
   }
   ```

2. **Use `!important` sparingly**: Only as a last resort

   ```css
   .my-workflow {
     background: red !important;
   }
   ```

3. **Verify CSS is loaded**: Check browser dev tools to ensure your CSS file is loaded

### ReactFlow Props Not Working

1. **Check prop name**: Ensure you're using the correct ReactFlow prop name
2. **Check ReactFlow version**: Some props may be version-specific
3. **Console warnings**: Check browser console for ReactFlow warnings

### Performance Issues

1. **Avoid inline styles in loops**: Extract styles outside render

   ```tsx
   // ❌ Bad
   nodes.map((node) => <div style={{ color: 'red' }}>...</div>);

   // ✅ Good
   const nodeStyle = { color: 'red' };
   nodes.map((node) => <div style={nodeStyle}>...</div>);
   ```

2. **Use CSS classes for animations**: CSS is more performant than JS animations

---

## Related Documentation

- [Getting Started](./getting-started.md)
- [Core Concepts](./core-concepts.md)
- [Node Properties](./node-properties.md)
- [React Flow Documentation](https://reactflow.dev/docs/introduction/)

---

## Questions or Issues?

- 📖 Check the [documentation index](../DOCUMENTATION_INDEX.md)
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

**Last Updated:** January 27, 2026  
**Version:** 0.1.0
