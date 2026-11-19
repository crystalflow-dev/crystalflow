'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaSpinner,
  FaCircle,
  FaCode,
  FaProjectDiagram,
  FaRocket,
  FaPalette,
  FaCogs,
  FaTools,
  FaBook,
  FaShieldAlt,
  FaServer,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

interface Phase {
  id: number;
  name: string;
  title: string;
  status: 'complete' | 'in-progress' | 'planned';
  progress?: number;
  icon: React.ComponentType<{ className?: string }>;
  quarter?: string;
  features: string[];
  details?: string[];
}

const phases: Phase[] = [
  {
    id: 1,
    name: 'Phase 1',
    title: 'Core Node System',
    status: 'complete',
    progress: 100,
    icon: FaCode,
    quarter: 'Q4 2025',
    features: [
      'Node base class with decorators',
      'NodeRegistry with factory',
      'Type-safe decorator system',
      'Comprehensive unit tests (139 tests)',
    ],
  },
  {
    id: 2,
    name: 'Phase 2',
    title: 'Workflow System',
    status: 'complete',
    progress: 100,
    icon: FaProjectDiagram,
    quarter: 'Q4 2025',
    features: [
      'Workflow orchestration',
      'Connection validation',
      'Graph structure & topological sorting',
      'JSON serialization',
    ],
  },
  {
    id: 3,
    name: 'Phase 3',
    title: 'Execution Engine',
    status: 'complete',
    progress: 100,
    icon: FaRocket,
    quarter: 'Q4 2025',
    features: [
      'Serial execution with async support',
      'Event system with async listeners',
      'Enhanced cancellation system',
      'Error handling & timing tracking',
    ],
  },
  {
    id: 4,
    name: 'Phase 4',
    title: 'React Package',
    status: 'in-progress',
    progress: 80,
    icon: FaPalette,
    quarter: 'Q1 2026',
    features: [
      'Visual workflow builder',
      'Property system integration',
      'WorkflowBuilder refactoring',
      'Examples package with demos',
    ],
    details: ['Monaco JSON editor (next)', 'Dual-mode editing (next)', 'Undo/redo system (next)'],
  },
  {
    id: 5,
    name: 'Phase 5',
    title: 'Type System & Utilities',
    status: 'planned',
    icon: FaCogs,
    quarter: 'Q2 2026',
    features: [
      'Enhanced type system',
      'DataType class & TypeValidator',
      'Built-in types library',
      'Utility framework',
    ],
  },
  {
    id: 6,
    name: 'Phase 6',
    title: 'Developer Experience',
    status: 'planned',
    icon: FaTools,
    quarter: 'Q3 2026',
    features: [
      'CLI tools for scaffolding',
      'VS Code extension',
      'Node generator templates',
      'Development server & hot reload',
    ],
  },
  {
    id: 7,
    name: 'Phase 7',
    title: 'Ecosystem & Content',
    status: 'planned',
    icon: FaBook,
    quarter: 'Q3-Q4 2026',
    features: [
      'Interactive documentation',
      'Tutorial series & guides',
      'Official node libraries',
      'Example applications showcase',
    ],
  },
  {
    id: 8,
    name: 'Phase 8',
    title: 'Production Ready',
    status: 'planned',
    icon: FaShieldAlt,
    quarter: 'Q4 2026',
    features: [
      '80%+ test coverage',
      'Integration & E2E tests',
      'Performance benchmarks',
      'v1.0.0 stable release',
    ],
  },
  {
    id: 9,
    name: 'Phase 9',
    title: 'Server-Side Execution',
    status: 'planned',
    icon: FaServer,
    quarter: 'Future',
    features: [
      'REST API & server package',
      'Real-time event streaming',
      'Authentication & authorization',
      'Workflow persistence & queuing',
    ],
  },
];

const StatusIcon = ({ status }: { status: Phase['status']; progress?: number }) => {
  if (status === 'complete') {
    return <FaCheckCircle className="w-6 h-6 text-secondary" />;
  } else if (status === 'in-progress') {
    return <FaSpinner className="w-6 h-6 text-primary animate-spin" />;
  }
  return <FaCircle className="w-6 h-6 text-light-grey/30" />;
};

const PhaseCard = ({ phase, index }: { phase: Phase; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const isMVP = phase.id <= 4; // Phases 1-4 are MVP

  const getStatusColor = () => {
    if (phase.status === 'complete') return 'border-secondary/40 bg-secondary/5';
    if (phase.status === 'in-progress') return 'border-primary/40 bg-primary/5';
    return 'border-light-grey/10 bg-dark-grey';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative"
    >
      <div
        className={`relative ${getStatusColor()} border rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(42,65,255,0.2)]`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* MVP Badge */}
        {isMVP && (
          <div className="absolute -top-2 -left-2 px-2 py-1 bg-secondary text-white text-xs font-bold rounded-full border-2 border-dark-grey shadow-lg">
            MVP
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Status icon */}
          <div className="shrink-0 mt-1">
            <StatusIcon status={phase.status} progress={phase.progress} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="text-base font-bold mb-0.5">{phase.title}</h3>
                <p className="text-xs text-light-grey/60">{phase.quarter}</p>
              </div>
              {phase.status === 'in-progress' && phase.progress && (
                <span className="text-sm font-bold text-primary shrink-0">{phase.progress}%</span>
              )}
            </div>

            {/* Progress bar for in-progress (compact) */}
            {phase.status === 'in-progress' && phase.progress && (
              <div className="mb-2">
                <div className="w-full bg-dark-grey rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${phase.progress}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Collapsed: Show feature count */}
            {!isExpanded && (
              <p className="text-xs text-light-grey/60">
                {phase.features.length} key features
                {phase.details && ` • ${phase.details.length} upcoming tasks`}
              </p>
            )}

            {/* Expanded: Show features */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 space-y-1"
              >
                {phase.features.map((feature, i) => (
                  <p key={i} className="text-xs text-light-grey flex items-start gap-1.5">
                    <span className="text-primary text-xs mt-0.5">•</span>
                    <span>{feature}</span>
                  </p>
                ))}
                {phase.details && phase.details.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-light-grey/10">
                    <p className="text-xs text-light-grey/60 mb-1">Up Next:</p>
                    {phase.details.map((detail, i) => (
                      <p key={i} className="text-xs text-light-grey/80 flex items-start gap-1.5">
                        <span className="text-light-grey/40">→</span>
                        <span>{detail}</span>
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Expand indicator */}
          <div className="shrink-0 text-light-grey/40 group-hover:text-primary transition-colors">
            {isExpanded ? (
              <FaChevronUp className="w-3 h-3" />
            ) : (
              <FaChevronDown className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const stats = {
    complete: phases.filter((p) => p.status === 'complete').length,
    inProgress: phases.filter((p) => p.status === 'in-progress').length,
    planned: phases.filter((p) => p.status === 'planned').length,
    total: phases.length,
  };

  return (
    <section
      id="roadmap"
      ref={ref}
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-linear-to-b from-black to-dark-grey"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
            Development Roadmap
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-light-grey mb-6 sm:mb-8 px-4">
            Building the future of workflow automation, one phase at a time
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm px-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-secondary" />
              <span className="text-light-grey">{stats.complete} Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <FaSpinner className="text-primary" />
              <span className="text-light-grey">{stats.inProgress} In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCircle className="text-light-grey/30" />
              <span className="text-light-grey">{stats.planned} Planned</span>
            </div>
          </div>

          {/* MVP Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 sm:mt-8 inline-block"
          >
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary/10 border border-secondary/30 rounded-full">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaCheckCircle className="text-secondary text-lg sm:text-xl" />
                <div>
                  <p className="text-secondary font-bold text-xs sm:text-sm">Core MVP Complete</p>
                  <p className="text-light-grey/60 text-xs">Phases 1-4 • Production Ready</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline - Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 sm:mt-16 text-center px-4"
        >
          <p className="text-xs sm:text-sm text-light-grey/60">
            Want to contribute? Check out our{' '}
            <a
              href="https://github.com/crystalflow-dev/crystalflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              GitHub repository
            </a>{' '}
            and{' '}
            <a href="/docs" className="text-primary hover:text-primary/80 transition-colors">
              documentation
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
