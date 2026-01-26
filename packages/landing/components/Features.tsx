'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  FaPaintBrush,
  FaProjectDiagram,
  FaFileCode,
  FaFeatherAlt,
  FaShieldAlt,
  FaRocket,
} from 'react-icons/fa';

const features = [
  {
    icon: FaPaintBrush,
    title: 'Decorator-Based Definitions',
    description:
      'Define workflow nodes using TypeScript decorators. Clean, declarative, and intuitive.',
  },
  {
    icon: FaProjectDiagram,
    title: 'Visual Workflow Builder',
    description: 'Drag-and-drop interface powered by React Flow. Build complex workflows visually.',
  },
  {
    icon: FaFileCode,
    title: 'JSON Serialization',
    description:
      'Every workflow is fully serializable to JSON. Save, load, and version control your workflows.',
  },
  {
    icon: FaFeatherAlt,
    title: 'Zero Dependencies',
    description:
      'Core engine has zero dependencies. Only reflect-metadata required for decorators.',
  },
  {
    icon: FaShieldAlt,
    title: '100% Type Safe',
    description: 'Built with TypeScript. Full type inference and compile-time type checking.',
  },
  {
    icon: FaRocket,
    title: 'Execution Engine',
    description: 'Robust execution engine with events, error handling, and async support.',
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
    <section id="features" className="py-32 px-6 bg-linear-to-b from-black to-dark-grey" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Everything You Need</h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            A complete workflow framework that handles the complex parts, so you can focus on
            building.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-8 bg-dark-grey border border-light-grey/10 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,65,255,0.2)]"
              >
                <div className="text-5xl mb-4 text-primary">
                  <Icon />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-light-grey leading-relaxed">{feature.description}</p>

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
