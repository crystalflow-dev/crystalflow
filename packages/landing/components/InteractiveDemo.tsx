'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { SandpackProvider, SandpackCodeEditor, SandpackLayout } from '@codesandbox/sandpack-react';
import dynamic from 'next/dynamic';
import type { NodeConstructor } from '@reactflo/core';

// Dynamically import WorkflowBuilder to avoid SSR issues
const WorkflowBuilder = dynamic(
  () => import('@reactflo/react').then((mod) => mod.WorkflowBuilder),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-light-grey">Loading workflow builder...</div> }
);

export default function InteractiveDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [showCode, setShowCode] = useState(true);
  const [nodes, setNodes] = useState<NodeConstructor[]>([]);

  // Load nodes when switching to builder view
  const loadNodes = async () => {
    if (nodes.length === 0) {
      const { AddNode } = await import('@reactflo/examples/src/nodes/math/AddNode');
      const { MultiplyNode } = await import('@reactflo/examples/src/nodes/math/MultiplyNode');
      const { DisplayNode } = await import('@reactflo/examples/src/nodes/output/DisplayNode');
      setNodes([AddNode, MultiplyNode, DisplayNode]);
    }
  };

  const files = {
    '/AddNode.ts': {
      code: `import { Node, Input, Output, defineNode } from '@reactflo/core';

@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
export class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}`,
      active: true,
    },
    '/MultiplyNode.ts': {
      code: `import { Node, Input, Output, defineNode } from '@reactflo/core';

@defineNode({
  type: 'math.multiply',
  label: 'Multiply Numbers',
  category: 'Math',
})
export class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 1;

  @Input({ type: 'number', label: 'B' })
  b: number = 1;

  @Output({ type: 'number', label: 'Result' })
  result: number;

  execute() {
    this.result = this.a * this.b;
  }
}`,
    },
    '/DisplayNode.ts': {
      code: `import { Node, Input, defineNode } from '@reactflo/core';

@defineNode({
  type: 'output.display',
  label: 'Display Value',
  category: 'Output',
})
export class DisplayNode extends Node {
  @Input({ type: 'any', label: 'Value' })
  value: any;

  execute() {
    console.log('Output:', this.value);
  }
}`,
    },
  };

  return (
    <section id="demo" className="py-32 px-6 bg-linear-to-b from-dark-grey to-black" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            Define your nodes with decorators, then build workflows visually.
          </p>
        </motion.div>

        {/* Toggle tabs */}
        <div className="flex justify-center mb-8 border-b border-primary/20">
          <button
            onClick={() => setShowCode(true)}
            className={`px-8 py-3 font-semibold transition-all duration-300 relative ${
              showCode
                ? 'text-primary'
                : 'text-light-grey hover:text-white'
            }`}
          >
            Node Definitions
            {showCode && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(42,65,255,0.8)]" />
            )}
          </button>
          <button
            onClick={() => {
              setShowCode(false);
              loadNodes();
            }}
            className={`px-8 py-3 font-semibold transition-all duration-300 relative ${
              !showCode
                ? 'text-primary'
                : 'text-light-grey hover:text-white'
            }`}
          >
            Live Workflow Builder
            {!showCode && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(42,65,255,0.8)]" />
            )}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-dark-grey border border-primary/20 rounded-2xl overflow-hidden"
        >
          {showCode ? (
            <SandpackProvider
              theme="dark"
              template="static"
              files={files}
            >
              <SandpackLayout>
                <SandpackCodeEditor 
                  showLineNumbers 
                  showTabs 
                  style={{ height: '600px' }}
                  readOnly
                />
              </SandpackLayout>
            </SandpackProvider>
          ) : (
            <div style={{ height: '600px', width: '100%', background: '#1E1E1E' }}>
              {nodes.length > 0 ? (
                <WorkflowBuilder
                  nodes={nodes}
                  showJsonEditor={false}
                  onWorkflowChange={(workflow) => {
                    console.log('Workflow updated:', workflow);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-light-grey">
                  Loading workflow builder...
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-light-grey">
            💡 {showCode 
              ? 'Edit the code to see how ReactFlo nodes are defined, then switch to the builder!' 
              : 'Drag nodes from the palette and connect them to build your workflow!'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
