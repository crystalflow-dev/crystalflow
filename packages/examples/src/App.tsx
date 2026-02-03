import { useState } from 'react';
import SimpleWorkflow from './examples/SimpleWorkflow';
import ConditionalNodesDemo from './examples/ConditionalNodesDemo';
import { StyledWorkflow } from './examples/StyledWorkflow';
import { CustomRenderWorkflow } from './examples/CustomRenderWorkflow';
import { InfoPopup } from './components/InfoPopup';
import './App.css';

type ExampleType = 'simple' | 'styled' | 'custom' | 'conditional';

// Example information content
const exampleInfo: Record<ExampleType, { title: string; content: React.ReactNode }> = {
  simple: {
    title: 'Simple Workflow Builder',
    content: (
      <>
        <p>
          This example demonstrates the basic workflow builder with custom nodes using decorators.
        </p>
        <h3>Available Nodes:</h3>
        <ul>
          <li>
            <strong>Input Nodes:</strong> NumberInput, StringInput - Provide static values
          </li>
          <li>
            <strong>Math Nodes:</strong> Add, Multiply, Subtract - Perform arithmetic operations
          </li>
          <li>
            <strong>Output Node:</strong> Display - Shows the result in the console
          </li>
          <li>
            <strong>Config Demo:</strong> Demonstrates the @Property decorator system
          </li>
        </ul>
        <h3>How to Use:</h3>
        <ol>
          <li>Drag nodes from the left palette onto the canvas</li>
          <li>Click a node to see its properties in the right panel</li>
          <li>Connect nodes by dragging from an output handle to an input handle</li>
          <li>Click "Execute" in the toolbar to run the workflow</li>
          <li>Use Save/Load to persist your workflow as JSON</li>
        </ol>
      </>
    ),
  },
  conditional: {
    title: 'Conditional Flow Workflow',
    content: (
      <>
        <p>
          This example demonstrates conditional branching with <strong>IfNode</strong> and{' '}
          <strong>SwitchNode</strong>:
        </p>
        <ul>
          <li>
            <strong>IfNode</strong>: Routes data based on a boolean condition. Connect a boolean
            value to the <code>value</code> input and data to the <code>data</code> input. The data
            flows to either the <code>thenOutput</code> (true) or <code>elseOutput</code> (false).
          </li>
          <li>
            <strong>SwitchNode</strong>: Multi-case branching node with dynamic outputs. Set the{' '}
            <code>cases</code> property to define possible values (e.g., [1, 2, 3]). The node will
            create outputs <code>case_0</code>, <code>case_1</code>, etc., plus a{' '}
            <code>default</code> output.
          </li>
        </ul>
        <h3>Example Workflow Ideas:</h3>
        <ul>
          <li>
            <strong>Basic If Test:</strong> NumberInput(5) → IsPositive → IfNode → Display nodes on
            then/else branches
          </li>
          <li>
            <strong>Number Comparison:</strong> Two NumberInputs → Compare → IfNode → Display
            "Greater" or "Not Greater"
          </li>
          <li>
            <strong>Even/Odd Routing:</strong> NumberInput → IsEven → IfNode → Display "Even" or
            "Odd"
          </li>
          <li>
            <strong>Switch Cases:</strong> NumberInput(2) → SwitchNode with cases [0,1,2,3] → 5
            Display nodes
          </li>
        </ul>
      </>
    ),
  },
  custom: {
    title: 'Custom Node Rendering',
    content: (
      <>
        <p>
          This example demonstrates complete control over node appearance using custom render
          functions.
        </p>
        <h3>Custom Renderers:</h3>
        <ul>
          <li>
            <strong>renderNodeContent:</strong> Customize what's displayed inside each node based on
            category
          </li>
          <li>
            <strong>renderPaletteItem:</strong> Customize how nodes appear in the palette sidebar
          </li>
          <li>
            <strong>renderToolbar:</strong> Create a completely custom toolbar with your own layout
            and styling
          </li>
        </ul>
        <h3>Category-Based Layouts:</h3>
        <ul>
          <li>
            <strong>Input Nodes:</strong> Display emoji icons (📥) with prominent current values
          </li>
          <li>
            <strong>Math Nodes:</strong> Show large operation symbols (+, ×, −)
          </li>
          <li>
            <strong>Output Nodes:</strong> Display emoji (📺) with formatted output preview
          </li>
        </ul>
      </>
    ),
  },
  styled: {
    title: 'Styled Workflow Example',
    content: (
      <>
        <p>
          This example demonstrates the extensive styling customization capabilities of ReactFlo.
        </p>
        <h3>Customization Options:</h3>
        <ul>
          <li>
            <strong>className:</strong> Custom CSS class names for all components
          </li>
          <li>
            <strong>styles:</strong> Inline style overrides for precise control
          </li>
          <li>
            <strong>ReactFlow props:</strong> Direct access to React Flow configuration
          </li>
          <li>
            <strong>Component props:</strong> Toolbar, Palette, PropertyPanel customization
          </li>
        </ul>
        <h3>ReactFlow Customization:</h3>
        <ul>
          <li>Snap to grid (20x20)</li>
          <li>Cross background pattern</li>
          <li>Controls position: bottom-left</li>
          <li>MiniMap position: top-right</li>
          <li>Custom node/edge colors</li>
        </ul>
      </>
    ),
  },
};

function App() {
  const [currentExample, setCurrentExample] = useState<ExampleType>('simple');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  return (
    <div className="app">
      {/* Info Popup - Shows current example info */}
      <InfoPopup title={exampleInfo[currentExample].title}>
        {exampleInfo[currentExample].content}
      </InfoPopup>

      {/* Theme Switcher - Compact Fixed Position Top Left */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          display: 'inline-flex',
          gap: '4px',
          padding: '4px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 9998,
        }}
      >
        {(['light', 'dark', 'auto'] as const).map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            title={`Switch to ${themeOption} theme`}
            style={{
              padding: '6px 10px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background:
                theme === themeOption ? 'var(--color-primary-500)' : 'transparent',
              color: theme === themeOption ? 'white' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              textTransform: 'capitalize',
              transition: 'all var(--transition-fast) var(--ease-out)',
              fontWeight: theme === themeOption ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
            }}
            onMouseEnter={(e) => {
              if (theme !== themeOption) {
                e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== themeOption) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {themeOption === 'light' ? '☀️' : themeOption === 'dark' ? '🌙' : '⚙️'}
          </button>
        ))}
      </div>

      <header className="app-header">
        <div>
          <h1>ReactFlo Examples</h1>
          <p>Interactive workflow builder demonstrations</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentExample('simple')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentExample === 'simple' ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentExample === 'simple' ? 'bold' : 'normal',
            }}
          >
            Simple Workflow
          </button>
          <button
            onClick={() => setCurrentExample('styled')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentExample === 'styled' ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentExample === 'styled' ? 'bold' : 'normal',
            }}
          >
            Styled Workflow
          </button>
          <button
            onClick={() => setCurrentExample('custom')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentExample === 'custom' ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentExample === 'custom' ? 'bold' : 'normal',
            }}
          >
            Custom Render
          </button>
          <button
            onClick={() => setCurrentExample('conditional')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentExample === 'conditional' ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentExample === 'conditional' ? 'bold' : 'normal',
            }}
          >
            Conditional Nodes
          </button>
        </div>
      </header>

      <div className="app-content">
        {currentExample === 'simple' && <SimpleWorkflow theme={theme} />}
        {currentExample === 'styled' && <StyledWorkflow />}
        {currentExample === 'custom' && <CustomRenderWorkflow />}
        {currentExample === 'conditional' && <ConditionalNodesDemo theme={theme} />}
      </div>
    </div>
  );
}

export default App;
