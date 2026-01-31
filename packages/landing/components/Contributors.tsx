'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaGithub, FaCode, FaBook, FaBug, FaLightbulb } from 'react-icons/fa';

const contributionAreas = [
  {
    icon: FaCode,
    title: 'Code',
    description: 'Implement features, fix bugs, improve performance',
  },
  {
    icon: FaBook,
    title: 'Documentation',
    description: 'Write guides, tutorials, and API documentation',
  },
  {
    icon: FaBug,
    title: 'Testing',
    description: 'Report bugs, write tests, improve reliability',
  },
  {
    icon: FaLightbulb,
    title: 'Ideas',
    description: 'Suggest features, provide feedback, share use cases',
  },
];

export default function Contributors() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="contributors"
      ref={ref}
      className="py-32 px-6 bg-dark-grey relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Become an Early Contributor</h2>
          <p className="text-xl text-light-grey max-w-3xl mx-auto mb-8">
            ReactFlo is open source and growing fast. Join us in building the future of workflow
            automation.
            <br />
            <span className="text-primary font-semibold">
              Shape the project from the ground up.
            </span>
          </p>
        </motion.div>

        {/* Contribution areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contributionAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-black border border-light-grey/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(42,65,255,0.2)]"
              >
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{area.title}</h3>
                <p className="text-light-grey/80 text-sm">{area.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-black border border-light-grey/10 rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Contribute?</h3>
            <p className="text-light-grey mb-8">
              Whether you're fixing a typo or building a major feature, every contribution matters.
              Check out our contribution guidelines and start making an impact today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/fladeed/reactflo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(42,65,255,0.5)] transition-all duration-300 hover:scale-105"
              >
                <FaGithub className="text-xl" />
                View on GitHub
              </a>
              <a
                href="https://github.com/fladeed/reactflo/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-light-grey/30 text-white font-semibold rounded-lg hover:border-primary transition-all duration-300"
              >
                Read Contributing Guide
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-light-grey/10">
              <div>
                <p className="text-3xl font-bold text-primary mb-1">Open</p>
                <p className="text-sm text-light-grey/60">Source</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary mb-1">MIT</p>
                <p className="text-sm text-light-grey/60">License</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-1">Active</p>
                <p className="text-sm text-light-grey/60">Development</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
