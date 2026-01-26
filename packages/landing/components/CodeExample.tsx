'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeExample() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const decoratorCode = `@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result: number;

  execute() {
    this.result = this.a + this.b;
  }
}`;

  const uiCode = `import { WorkflowBuilder } from '@reactflo/react';

function MyApp() {
  return (
    <WorkflowBuilder 
      nodes={[AddNode, MultiplyNode]}
      onWorkflowChange={(workflow) => {
        console.log('Workflow updated:', workflow);
      }}
    />
  );
}`;

  return (
    <section id="examples" className="py-32 px-6 bg-dark-grey" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Simple Yet Powerful</h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            Define nodes with decorators, build workflows visually, execute anywhere.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4">
              <span className="text-sm text-primary font-semibold">STEP 1</span>
              <h3 className="text-2xl font-bold mt-2">Define Your Nodes</h3>
            </div>
            <div className="bg-black border border-primary/20 rounded-xl overflow-hidden">
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: '#000000',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {decoratorCode}
              </SyntaxHighlighter>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-4">
              <span className="text-sm text-secondary font-semibold">STEP 2</span>
              <h3 className="text-2xl font-bold mt-2">Build Your UI</h3>
            </div>
            <div className="bg-black border border-secondary/20 rounded-xl overflow-hidden">
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: '#000000',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {uiCode}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
