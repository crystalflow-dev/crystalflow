# JSON Editor in CrystalFlow

The CrystalFlow workflow builder includes a powerful integrated JSON editor, allowing users to work with workflows in both visual and text formats.

## Features

- **Monaco Editor** - Same editor that powers VS Code
- **Dual-Mode Editing** - Switch between visual builder and JSON editor
- **Real-Time Sync** - Changes in one mode instantly reflect in the other
- **Live Validation** - JSON syntax and schema validation as you type
- **Auto-Complete** - IntelliSense for node types, properties, and structure
- **Error Highlighting** - Visual indicators for invalid JSON or schema violations
- **Format & Beautify** - One-click JSON formatting
- **Diff View** - Compare workflow versions

## Editor Modes

### Visual Mode

Traditional drag-and-drop interface with nodes and connections on a canvas.

### JSON Mode

Full-featured code editor for direct JSON manipulation.

### Split Mode

Both visual and JSON editors side-by-side with real-time synchronization.

## Usage

### Basic Setup

```tsx
import { WorkflowBuilder } from '@crystalflow/react';

function App() {
  return <WorkflowBuilder nodes={[...myNodes]} showJsonEditor={true} editorMode="split" />;
}
```

### Configuration Options

```tsx
<WorkflowBuilder
  nodes={[...myNodes]}
  // JSON Editor Options
  showJsonEditor={true}
  editorMode="split" // 'visual' | 'json' | 'split'
  jsonEditorTheme="vs-dark" // 'vs-dark' | 'vs-light' | 'hc-black'
  // Sync Options
  syncToVisual={true} // JSON changes → Visual
  syncToJson={true} // Visual changes → JSON
  syncDelay={500} // Debounce delay (ms)
  // Validation
  validateOnType={true} // Real-time validation
  autoFormat={true} // Auto-format JSON
  // Callbacks
  onWorkflowChange={(workflow) => {
    console.log('Workflow changed:', workflow);
  }}
  onJsonError={(errors) => {
    console.log('JSON errors:', errors);
  }}
/>
```

## Editor Modes in Detail

### Split Mode (Recommended)

Most powerful mode - see both representations simultaneously:

```tsx
<WorkflowBuilder editorMode="split" showJsonEditor={true} />
```

**Features:**

- Visual builder on left, JSON editor on right (or top/bottom)
- Real-time bidirectional sync
- Changes in either editor update the other instantly
- Best for learning the JSON structure
- Ideal for debugging

### Visual-Only Mode

Traditional workflow builder without JSON editor:

```tsx
<WorkflowBuilder editorMode="visual" showJsonEditor={false} />
```

**Use Cases:**

- Non-technical users
- Production environments
- Simplified interface

### JSON-Only Mode

Code editor for power users:

```tsx
<WorkflowBuilder editorMode="json" showJsonEditor={true} />
```

**Features:**

- Full Monaco editor features
- Keyboard shortcuts
- Multi-cursor editing
- Find & replace
- Code folding

**Use Cases:**

- Bulk editing
- Copy/paste workflows
- Version control integration
- Template creation

## Real-Time Validation

The JSON editor validates workflows as you type:

```json
{
  "version": "1.0.0",
  "id": "my-workflow",
  "name": "Test Workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "math.add",  ← Validates node type exists
      "position": { "x": 100, "y": 100 },
      "data": {
        "inputs": {
          "a": 5,  ← Validates input types
          "b": "invalid"  ← Error: expected number
        }
      }
    }
  ],
  "connections": []  ← Validates connection references
}
```

**Validation Levels:**

- 🔴 **Error** - Invalid JSON or schema violations
- 🟡 **Warning** - Valid but potentially problematic
- 🔵 **Info** - Suggestions and best practices

## IntelliSense & Auto-Complete

The editor provides intelligent suggestions:

### Node Types

Type `"type": "` and get suggestions for all registered nodes:

```json
{
  "type": "math.|"
           ↑
  Suggestions:
  - math.add
  - math.subtract
  - math.multiply
  - math.divide
}
```

### Properties

Auto-complete for node properties based on type:

```json
{
  "type": "math.add",
  "data": {
    "|"
     ↑
    Suggestions:
    - inputs
    - outputs
    - label
    - config
  }
}
```

### Port Names

Suggestions for input/output port names:

```json
{
  "type": "math.add",
  "data": {
    "inputs": {
      "|"
       ↑
      Suggestions:
      - a (number, required)
      - b (number, required)
    }
  }
}
```

## Keyboard Shortcuts

| Shortcut                     | Action                      |
| ---------------------------- | --------------------------- |
| `Ctrl/Cmd + S`               | Save workflow               |
| `Ctrl/Cmd + K, Ctrl/Cmd + F` | Format JSON                 |
| `Ctrl/Cmd + /`               | Toggle comment              |
| `Alt + Shift + F`            | Format document             |
| `Ctrl/Cmd + F`               | Find                        |
| `Ctrl/Cmd + H`               | Find & replace              |
| `Ctrl/Cmd + D`               | Add selection to next match |
| `Alt + Click`                | Add cursor                  |
| `Ctrl/Cmd + Z`               | Undo                        |
| `Ctrl/Cmd + Shift + Z`       | Redo                        |

## Format & Beautify

One-click JSON formatting:

**Before:**

```json
{ "version": "1.0.0", "id": "test", "name": "Test", "nodes": [], "connections": [] }
```

**After:**

```json
{
  "version": "1.0.0",
  "id": "test",
  "name": "Test",
  "nodes": [],
  "connections": []
}
```

## Error Handling

The editor provides clear error messages:

```json
{
  "version": "1.0.0",
  "id": "test",
  "nodes": [
    {
      "id": "node-1",
      "type": "invalid.type"  ← Error: Unknown node type 'invalid.type'
                                 Available types: math.add, math.multiply...
    }
  ],
  "connections": [
    {
      "source": { "nodeId": "node-2" }  ← Error: Node 'node-2' not found
    }
  ]
}
```

## Diff View

Compare workflow versions:

```tsx
import { WorkflowDiffViewer } from '@crystalflow/react';

<WorkflowDiffViewer original={previousWorkflow} modified={currentWorkflow} theme="vs-dark" />;
```

Shows:

- Added nodes (green)
- Removed nodes (red)
- Modified nodes (yellow)
- Connection changes

## Copy/Paste Workflows

Easy workflow sharing:

1. **Export**: Click "Copy JSON" button
2. **Share**: Send JSON to colleagues
3. **Import**: Paste JSON in editor
4. **Validate**: Automatic validation on paste

## Template Creation

Save common patterns as JSON templates:

```json
{
  "version": "1.0.0",
  "id": "{{ID}}",
  "name": "{{NAME}}",
  "nodes": [
    {
      "id": "input-1",
      "type": "input.{{INPUT_TYPE}}",
      "position": { "x": 100, "y": 100 },
      "data": {}
    },
    {
      "id": "output-1",
      "type": "output.{{OUTPUT_TYPE}}",
      "position": { "x": 500, "y": 100 },
      "data": {}
    }
  ],
  "connections": []
}
```

## Programmatic Access

Control the editor programmatically:

```tsx
import { useWorkflowEditor } from '@crystalflow/react';

function MyComponent() {
  const editor = useWorkflowEditor();

  return (
    <div>
      <button onClick={() => editor.switchMode('json')}>JSON Mode</button>
      <button onClick={() => editor.format()}>Format JSON</button>
      <button onClick={() => editor.validate()}>Validate</button>
      <button
        onClick={() => {
          const json = editor.getJSON();
          console.log(json);
        }}
      >
        Get JSON
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Use Split Mode for Learning

Help users understand JSON structure by seeing both views.

### 2. Enable Auto-Format

Keeps JSON clean and readable:

```tsx
<WorkflowBuilder autoFormat={true} />
```

### 3. Show Validation Errors

Display errors prominently to guide users:

```tsx
onJsonError={(errors) => {
  showNotification({
    type: 'error',
    message: errors.map(e => e.message).join('\n')
  });
}}
```

### 4. Provide Templates

Include common workflow templates:

```tsx
<WorkflowBuilder
  templates={[
    { name: 'API Workflow', json: apiTemplate },
    { name: 'Data Processing', json: dataTemplate },
  ]}
/>
```

### 5. Enable Undo/Redo

Users can experiment safely:

```tsx
<WorkflowBuilder enableHistory={true} />
```

## Performance

The JSON editor is optimized for large workflows:

- **Lazy Loading** - Editor loads on demand
- **Virtual Scrolling** - Handles large JSON files
- **Debounced Sync** - Configurable sync delay
- **Worker Validation** - Validation runs in background

## Accessibility

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and descriptions
- **High Contrast** - Supports high-contrast themes
- **Customizable Font** - Adjustable font size

## Mobile Support

The editor adapts to mobile devices:

- Touch-friendly controls
- Responsive layout
- Simplified toolbar
- Optional fullscreen mode

## See Also

- [JSON Schema Documentation](./json-schema.md)
- [Workflow API](./api-reference/)
- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
