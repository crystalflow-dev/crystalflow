import { useState } from 'react';
import SimpleWorkflow from './examples/SimpleWorkflow';
import ConditionalNodesDemo from './examples/ConditionalNodesDemo';
import { StyledWorkflow } from './examples/StyledWorkflow';
import { CustomRenderWorkflow } from './examples/CustomRenderWorkflow';
import { ThemeDemo } from './examples/ThemeDemo';
import './App.css';

type ExampleType = 'simple' | 'styled' | 'custom' | 'theme' | 'conditional';

function App() {
  const [currentExample, setCurrentExample] = useState<ExampleType>('simple');

  return (
    <div className="app">
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
            onClick={() => setCurrentExample('theme')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentExample === 'theme' ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentExample === 'theme' ? 'bold' : 'normal',
            }}
          >
            Theme Demo
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
            Conditional Nodes Demo
          </button>
        </div>
      </header>

      <div className="app-content">
        {currentExample === 'simple' && <SimpleWorkflow />}
        {currentExample === 'styled' && <StyledWorkflow />}
        {currentExample === 'custom' && <CustomRenderWorkflow />}
        {currentExample === 'theme' && <ThemeDemo />}
        {currentExample === 'conditional' && <ConditionalNodesDemo />}
      </div>
    </div>
  );
}

export default App;
