import { useState } from 'react';
import SimpleWorkflow from './examples/SimpleWorkflow';
import './App.css';

function App() {
  const [currentExample] = useState<string>('simple');

  return (
    <div className="app">
      <header className="app-header">
        <h1>ReactFlo Examples</h1>
        <p>Interactive workflow builder demonstrations</p>
      </header>

      <div className="app-content">{currentExample === 'simple' && <SimpleWorkflow />}</div>
    </div>
  );
}

export default App;
