'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function GettingStarted() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const steps = [
    {
      number: '01',
      title: 'Install ReactFlo',
      description: 'Add ReactFlo to your project with npm or yarn',
      code: 'npm install @reactflo/core @reactflo/react',
    },
    {
      number: '02',
      title: 'Define Your Nodes',
      description: 'Use decorators to define workflow nodes',
      code: "@defineNode({ type: 'custom.node' })\nclass MyNode extends Node { ... }",
    },
    {
      number: '03',
      title: 'Build Your UI',
      description: 'Use the WorkflowBuilder component',
      code: '<WorkflowBuilder nodes={[MyNode]} />',
    },
  ];

  return (
    <section
      id="getting-started"
      className="py-32 px-6 bg-linear-to-b from-dark-grey to-black"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Get Started in Minutes</h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            Three simple steps to build your first workflow application.
          </p>
        </motion.div>

        <div className="space-y-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative w-full"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                <div className="shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-grey border-2 border-primary rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <div className="grow w-full min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-light-grey mb-4 text-sm md:text-base">{step.description}</p>
                  <div className="bg-dark-grey border border-primary/20 rounded-lg overflow-x-auto">
                    <SyntaxHighlighter
                      language={index === 0 ? 'bash' : index === 1 ? 'typescript' : 'tsx'}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#1E1E1E',
                        fontSize: '0.75rem',
                      }}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {step.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-24 w-0.5 h-12 bg-linear-to-b from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="https://github.com/fladeed/reactflo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,65,255,0.5)]"
          >
            View Documentation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
