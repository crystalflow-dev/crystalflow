'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBolt } from 'react-icons/fa';
import { ReactFlow, Node, Edge, ReactFlowProvider, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

// Generate stable particle positions outside component to avoid re-computation
const particles = Array.from({ length: 20 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

// Code snippet mockups for floating effect
const codeSnippets = [
  {
    id: 'add-node',
    code: (
      <>
        <span className="text-purple-400">@defineNode</span>(
        <span className="text-yellow-300">{'{'}</span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-blue-300">type</span>:{' '}
          <span className="text-green-300">&apos;math.add&apos;</span>,
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-blue-300">label</span>:{' '}
          <span className="text-green-300">&apos;Add&apos;</span>,
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-blue-300">category</span>:{' '}
          <span className="text-green-300">&apos;Math&apos;</span>
        </span>
        <br />
        <span className="text-yellow-300">{'}'}</span>)
        <br />
        <span className="text-purple-400">class</span>{' '}
        <span className="text-cyan-300">AddNode</span>{' '}
        <span className="text-purple-400">extends</span> <span className="text-cyan-300">Node</span>{' '}
        <span className="text-yellow-300">{'{'}</span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-purple-400">@Input</span>(
          <span className="text-yellow-300">{'{'}</span> <span className="text-blue-300">type</span>
          : <span className="text-green-300">&apos;number&apos;</span>{' '}
          <span className="text-yellow-300">{'}'}</span>)
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-cyan-300">a</span>: <span className="text-purple-400">number</span>{' '}
          = <span className="text-orange-300">0</span>;
        </span>
        <br />
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-purple-400">@Output</span>(
          <span className="text-yellow-300">{'{'}</span> <span className="text-blue-300">type</span>
          : <span className="text-green-300">&apos;number&apos;</span>{' '}
          <span className="text-yellow-300">{'}'}</span>)
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-cyan-300">sum</span>:{' '}
          <span className="text-purple-400">number</span> ={' '}
          <span className="text-orange-300">0</span>;
        </span>
        <br />
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-cyan-300">execute</span>(){' '}
          <span className="text-yellow-300">{'{'}</span>
        </span>
        <br />
        <span className="ml-4">
          {' '}
          <span className="text-purple-400">this</span>.<span className="text-cyan-300">sum</span> ={' '}
          <span className="text-purple-400">this</span>.<span className="text-cyan-300">a</span> +{' '}
          <span className="text-purple-400">this</span>.<span className="text-cyan-300">b</span>;
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-yellow-300">{'}'}</span>
        </span>
        <br />
        <span className="text-yellow-300">{'}'}</span>
      </>
    ),
    position: { x: '5%', y: '16%' },
  },
  {
    id: 'json-extract-node',
    code: (
      <>
        <span className="text-purple-400">@defineNode</span>(
        <span className="text-yellow-300">{'{'}</span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-blue-300">type</span>:{' '}
          <span className="text-green-300">&apos;data.extract&apos;</span>,
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-blue-300">label</span>:{' '}
          <span className="text-green-300">&apos;Extract Value&apos;</span>,
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-blue-300">category</span>:{' '}
          <span className="text-green-300">&apos;Data&apos;</span>
        </span>
        <br />
        <span className="text-yellow-300">{'}'}</span>)
        <br />
        <span className="text-purple-400">class</span>{' '}
        <span className="text-cyan-300">JsonExtractNode</span>{' '}
        <span className="text-yellow-300">{'{'}</span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-purple-400">@Input</span>(
          <span className="text-yellow-300">{'{'}</span> <span className="text-blue-300">type</span>
          : <span className="text-green-300">&apos;object&apos;</span>{' '}
          <span className="text-yellow-300">{'}'}</span>)
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-cyan-300">data</span>: <span className="text-purple-400">any</span>;
        </span>
        <br />
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-purple-400">@Output</span>(
          <span className="text-yellow-300">{'{'}</span> <span className="text-blue-300">type</span>
          : <span className="text-green-300">&apos;number&apos;</span>{' '}
          <span className="text-yellow-300">{'}'}</span>)
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-cyan-300">value</span>:{' '}
          <span className="text-purple-400">number</span>;
        </span>
        <br />
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-cyan-300">execute</span>(){' '}
          <span className="text-yellow-300">{'{'}</span>
        </span>
        <br />
        <span className="ml-4">
          {' '}
          <span className="text-purple-400">this</span>.<span className="text-cyan-300">value</span>{' '}
          = <span className="text-purple-400">this</span>.
          <span className="text-cyan-300">data</span>.<span className="text-cyan-300">score</span>;
        </span>
        <br />
        <span className="ml-2">
          {' '}
          <span className="text-yellow-300">{'}'}</span>
        </span>
        <br />
        <span className="text-yellow-300">{'}'}</span>
      </>
    ),
    position: { x: '8%', y: '56%' },
  },
];

// React Flow nodes for the right side
const flowNodes: Node[] = [
  {
    id: 'json-data',
    type: 'default',
    position: { x: 10, y: 40 },
    data: {
      label: (
        <div className="text-sm font-medium">
          <div className="text-blue-400">JSON Data</div>
          <div className="text-gray-300 text-xs mt-1">score: 85</div>
          <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
        </div>
      ),
    },
    style: {
      background: 'rgba(30, 30, 30, 0.95)',
      border: '2px solid #3B82F6',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      width: '140px',
      height: '70px',
    },
  },
  {
    id: 'extract-1',
    type: 'default',
    position: { x: 170, y: 40 },
    data: {
      label: (
        <div className="text-sm font-medium">
          <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
          <div className="text-purple-400">Extract</div>
          <div className="text-gray-300 text-xs mt-1">value: 85</div>
          <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
        </div>
      ),
    },
    style: {
      background: 'rgba(30, 30, 30, 0.95)',
      border: '2px solid #9C27B0',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      width: '120px',
      height: '70px',
    },
  },
  {
    id: 'bonus',
    type: 'default',
    position: { x: 170, y: 140 },
    data: {
      label: (
        <div className="text-sm font-medium">
          <div className="text-yellow-400">Bonus</div>
          <div className="text-gray-300 text-xs mt-1">10</div>
          <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
        </div>
      ),
    },
    style: {
      background: 'rgba(30, 30, 30, 0.95)',
      border: '2px solid #EAB308',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      width: '120px',
      height: '70px',
    },
  },
  {
    id: 'add-1',
    type: 'default',
    position: { x: 330, y: 90 },
    data: {
      label: (
        <div className="text-sm font-medium">
          <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
          <div className="text-green-400">Add</div>
          <div className="text-gray-300 text-xs mt-1">total: 95</div>
        </div>
      ),
    },
    style: {
      background: 'rgba(30, 30, 30, 0.95)',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      width: '120px',
      height: '70px',
    },
  },
];

const flowEdges: Edge[] = [
  {
    id: 'e1',
    source: 'json-data',
    target: 'extract-1',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#3B82F6', strokeWidth: 2 },
    type: 'default',
  },
  {
    id: 'e2',
    source: 'extract-1',
    target: 'add-1',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#9C27B0', strokeWidth: 2 },
    type: 'default',
  },
  {
    id: 'e3',
    source: 'bonus',
    target: 'add-1',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#EAB308', strokeWidth: 2 },
    type: 'default',
  },
];

// Floating code snippet component
const FloatingCodeSnippet = ({
  snippet,
  index,
}: {
  snippet: (typeof codeSnippets)[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{
      duration: 0.8,
      delay: 1.5 + index * 0.3,
      type: 'spring',
      stiffness: 100,
    }}
    className="absolute z-0 pointer-events-none"
    style={{
      left: snippet.position.x,
      top: snippet.position.y,
    }}
  >
    <div className="bg-transparent backdrop-blur-sm border border-primary/20 rounded-lg p-2 lg:p-3 shadow-2xl max-w-50 lg:max-w-[320px]">
      <div className="text-[10px] lg:text-xs text-light-grey font-mono leading-relaxed overflow-hidden">
        {snippet.code}
      </div>
      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-primary rounded-full animate-pulse" />
    </div>
  </motion.div>
);

// Floating workflow component
const FloatingWorkflow = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: 50 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{
      duration: 1,
      delay: 2.2,
      type: 'spring',
      stiffness: 80,
    }}
    className="absolute top-3/5 right-[3%] z-1 pointer-events-none"
  >
    <div className="bg-transparent backdrop-blur-sm border border-secondary/20 rounded-xl p-2 lg:p-3 shadow-2xl">
      <div className="w-48 h-32 lg:w-80 lg:h-48">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          panOnDrag={false}
          zoomOnDoubleClick={false}
          fitView
          proOptions={{ hideAttribution: true }}
        ></ReactFlow>
      </div>
      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
      <div className="text-[10px] text-light-grey/70 mt-1.5 font-medium">Live Workflow</div>
    </div>
  </motion.div>
);

export default function Hero() {
  return (
    <ReactFlowProvider>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-5">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-black via-dark-grey to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(42,65,255,0.1),transparent_50%)]" />
        </div>

        {/* Animated dots/particles background */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
        {/* Floating Code Snippets - Left Side */}
        {codeSnippets.map((snippet, index) => (
          <div key={snippet.id} className="hidden lg:block">
            <FloatingCodeSnippet snippet={snippet} index={index} />
          </div>
        ))}

        {/* Floating Workflow - Right Side */}
        <div className="hidden lg:block">
          <FloatingWorkflow />
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              <div className="px-4 py-2 bg-dark-grey border border-primary/30 rounded-full text-sm text-light-grey flex items-center gap-2">
                <FaBolt className="text-primary" /> Declarative Workflow Framework
              </div>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span
                style={{
                  textShadow:
                    '0 0 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.9), 0 0 80px rgba(0, 0, 0, 0.8)',
                }}
              >
                We build the{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
                how
              </span>
              <span
                style={{
                  textShadow:
                    '0 0 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.9), 0 0 80px rgba(0, 0, 0, 0.8)',
                }}
              >
                ,<br />
                you focus on the{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary via-primary to-secondary">
                what
              </span>
              <span
                style={{
                  textShadow:
                    '0 0 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.9), 0 0 80px rgba(0, 0, 0, 0.8)',
                }}
              >
                .
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-light-grey max-w-3xl mx-auto leading-relaxed">
              A declarative workflow builder framework that lets you focus on &quot;what to do&quot;
              instead of &quot;how to do it&quot;.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link
                href="#getting-started"
                className="group relative px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,65,255,0.5)] hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur" />
              </Link>

              <Link
                href="#demo"
                className="px-8 py-4 bg-transparent border-2 border-light-grey/30 text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(42,65,255,0.3)]"
              >
                Try Demo
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-5 max-w-2xl mx-auto"
            >
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">0</div>
                <div className="text-sm text-light-grey">Dependencies</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-secondary">100%</div>
                <div className="text-sm text-light-grey">Type Safe</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">∞</div>
                <div className="text-sm text-light-grey">Possibilities</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-light-grey/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>
    </ReactFlowProvider>
  );
}
