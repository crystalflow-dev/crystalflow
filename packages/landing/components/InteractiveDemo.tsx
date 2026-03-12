'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { SandpackProvider, SandpackCodeEditor, SandpackLayout } from '@codesandbox/sandpack-react';
import dynamic from 'next/dynamic';
import type { NodeConstructor } from '@crystalflow/core';
import {
  MockAPINode,
  ExtractFieldNode,
  FormatTextNode,
  DisplayNode,
} from '@crystalflow/examples/src/nodes';

// Import node source code strings (embedded for Next.js compatibility)
import {
  MockAPINodeCode,
  ExtractFieldNodeCode,
  FormatTextNodeCode,
  DisplayNodeCode,
} from '../lib/nodeSourceCode';

// Dynamically import WorkflowBuilder to avoid SSR issues
const WorkflowBuilder = dynamic(
  () => import('@crystalflow/react').then((mod) => mod.WorkflowBuilder),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-light-grey">
        Loading workflow builder...
      </div>
    ),
  }
);

export default function InteractiveDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [showCode, setShowCode] = useState(true);
  const [nodes, setNodes] = useState<NodeConstructor[]>([]);

  // Load nodes when switching to builder view
  const loadNodes = () => {
    if (nodes.length === 0) {
      setNodes([MockAPINode, ExtractFieldNode, FormatTextNode, DisplayNode]);
    }
  };

  const files = {
    '/MockAPINode.ts': {
      code: MockAPINodeCode,
      active: true,
    },
    '/ExtractFieldNode.ts': {
      code: ExtractFieldNodeCode,
    },
    '/FormatTextNode.ts': {
      code: FormatTextNodeCode,
    },
    '/DisplayNode.ts': {
      code: DisplayNodeCode,
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6">See It In Action</h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            Build real-world data workflows: fetch from APIs, extract fields, and process results.
          </p>
        </motion.div>

        {/* Toggle tabs */}
        <div className="flex justify-center mb-8 border-b border-primary/20">
          <button
            onClick={() => setShowCode(true)}
            className={`px-8 py-3 font-semibold transition-all duration-300 relative ${
              showCode ? 'text-primary' : 'text-light-grey hover:text-white'
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
              !showCode ? 'text-primary' : 'text-light-grey hover:text-white'
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
            <SandpackProvider theme="dark" template="static" files={files}>
              <SandpackLayout>
                <SandpackCodeEditor showLineNumbers showTabs style={{ height: '600px' }} readOnly />
              </SandpackLayout>
            </SandpackProvider>
          ) : (
            <div style={{ height: '600px', width: '100%', background: '#1E1E1E' }}>
              {nodes.length > 0 ? (
                <WorkflowBuilder
                  // @ts-expect-error - TypeScript sees src/ and dist/ as different types in monorepo
                  nodes={nodes}
                  theme="dark"
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
            💡{' '}
            {showCode
              ? 'These nodes demonstrate data extraction from API responses with custom properties!'
              : 'Try it: Drag Mock API → Extract Field → Format Text → Display to build a data pipeline!'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
