'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  FaPaintBrush,
  FaProjectDiagram,
  FaFileCode,
  FaRocket,
  FaRobot,
  FaBrain,
} from 'react-icons/fa';

const features = [
  {
    icon: FaRobot,
    title: 'Build AI Automation Platforms',
    description:
      'Create your own Make.com, Zapier, or n8n alternative. Perfect for AI agent workflows, LangChain integrations, and automation tools.',
  },
  {
    icon: FaBrain,
    title: 'No-Code/Low-Code Builders',
    description:
      'Build visual programming environments where non-technical users can create complex logic flows without writing code.',
  },
  {
    icon: FaProjectDiagram,
    title: 'Visual Workflow Builder',
    description:
      'Drag-and-drop interface powered by React Flow. Build complex workflows visually with real-time execution.',
  },
  {
    icon: FaPaintBrush,
    title: 'Simple Decorator API',
    description:
      'Define nodes in minutes with TypeScript decorators. No boilerplate—just clean, declarative code.',
  },
  {
    icon: FaFileCode,
    title: 'Full JSON Serialization',
    description:
      'Save, load, and version control workflows. Every workflow is JSON—perfect for databases and APIs.',
  },
  {
    icon: FaRocket,
    title: 'Production-Ready Engine',
    description:
      'Robust execution with async support, error handling, cancellation, and real-time events.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      id="features"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-linear-to-b from-black to-dark-grey"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
            Perfect for AI & Automation
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-light-grey max-w-2xl mx-auto px-4">
            Whether you're building AI agent platforms, no-code tools, or data pipelines—
            <br className="hidden sm:block" />
            ReactFlo handles the complexity so you can ship faster.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-6 sm:p-8 bg-dark-grey border border-light-grey/10 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,65,255,0.2)]"
              >
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-primary">
                  <Icon />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-light-grey leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
