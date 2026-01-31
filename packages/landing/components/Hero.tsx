'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBolt } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-5 w-full max-w-full">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-dark-grey to-black w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(42,65,255,0.1),transparent_50%)] w-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="inline-block"
          >
            <div className="px-4 py-2 bg-dark-grey border border-primary/30 rounded-full text-sm text-light-grey flex items-center gap-2">
              <FaBolt className="text-primary" /> Declarative Workflow Framework
            </div>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
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
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-light-grey max-w-3xl mx-auto leading-relaxed px-4">
            A <span className="text-primary font-semibold">declarative framework</span> for building
            visual workflow editors.
            <br className="hidden md:block" />
            <span className="text-sm sm:text-base md:text-lg">
              Build AI automation platforms, no-code tools, and data pipelines.
            </span>
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full max-w-lg mx-auto px-4"
          >
            <Link
              href="#getting-started"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,65,255,0.5)] hover:scale-105 text-center"
            >
              <span className="relative z-10">Get Started</span>
              <div className="hidden md:block absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur" />
            </Link>

            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-light-grey/30 text-white rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(42,65,255,0.3)] text-center"
            >
              Try Demo
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-5 max-w-2xl mx-auto px-4"
          >
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">0</div>
              <div className="text-xs sm:text-sm text-light-grey">Dependencies</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">100%</div>
              <div className="text-xs sm:text-sm text-light-grey">Type Safe</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">∞</div>
              <div className="text-xs sm:text-sm text-light-grey">Possibilities</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
