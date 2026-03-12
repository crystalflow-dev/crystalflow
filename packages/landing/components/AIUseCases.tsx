'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaRobot, FaCode, FaDatabase, FaChartLine, FaBrain, FaCogs } from 'react-icons/fa';

const useCases = [
  {
    icon: FaRobot,
    title: 'AI Agent Orchestration',
    description:
      'Build platforms like LangFlow or Flowise. Connect LLMs, vector databases, and AI tools in visual workflows.',
    examples: ['ChatGPT workflow builders', 'Multi-agent systems', 'RAG pipelines'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FaBrain,
    title: 'No-Code Automation',
    description:
      'Create your own Zapier or Make.com. Let non-technical users automate anything without code.',
    examples: ['Business process automation', 'Integration platforms', 'Webhook orchestration'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FaDatabase,
    title: 'Data Pipeline Builders',
    description:
      'Visual ETL tools for data scientists. Transform, enrich, and route data with drag-and-drop simplicity.',
    examples: ['Data transformation flows', 'API data processing', 'Real-time analytics'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FaChartLine,
    title: 'Business Logic Engines',
    description:
      'Let business users define complex rules visually. No developer required for workflow changes.',
    examples: ['Approval workflows', 'Decision trees', 'Form builders'],
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FaCode,
    title: 'Developer Tools',
    description:
      'Build CI/CD pipelines, deployment workflows, or testing automation with visual interfaces.',
    examples: ['DevOps automation', 'Testing orchestration', 'Build pipelines'],
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: FaCogs,
    title: 'IoT & Edge Computing',
    description:
      'Create visual programming environments for IoT devices, smart home automation, or edge computing.',
    examples: ['Smart home flows', 'Sensor data processing', 'Edge AI workflows'],
    color: 'from-teal-500 to-blue-500',
  },
];

export default function AIUseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <section id="use-cases" ref={ref} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-dark-grey">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
            What Can You Build?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-light-grey max-w-3xl mx-auto px-4">
            From AI automation platforms to no-code tools—CrystalFlow powers the next generation of
            workflow applications
          </p>
        </motion.div>

        {/* Use cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-black border border-light-grey/10 rounded-2xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,65,255,0.2)]"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-2.5 sm:p-3 rounded-lg bg-linear-to-br ${useCase.color} mb-3 sm:mb-4`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{useCase.title}</h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-light-grey leading-relaxed mb-3 sm:mb-4">
                    {useCase.description}
                  </p>

                  {/* Examples */}
                  <div className="space-y-2">
                    <p className="text-xs text-light-grey/60 font-semibold uppercase tracking-wider mb-2">
                      Use Cases
                    </p>
                    {useCase.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-primary text-sm mt-0.5">•</span>
                        <span className="text-light-grey text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 sm:mt-16 px-4"
        >
          <p className="text-base sm:text-lg text-light-grey mb-4 sm:mb-6">
            Don't see your use case? CrystalFlow is a framework—build{' '}
            <span className="text-primary font-semibold">anything</span>.
          </p>
          <a
            href="#getting-started"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold text-base sm:text-lg rounded-lg hover:shadow-[0_0_30px_rgba(42,65,255,0.5)] transition-all duration-300 hover:scale-105"
          >
            Start Building
          </a>
        </motion.div>
      </div>
    </section>
  );
}
