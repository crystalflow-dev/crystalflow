'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBolt } from 'react-icons/fa';

// Generate stable particle positions outside component to avoid re-computation
const particles = Array.from({ length: 20 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

export default function Hero() {
  return (
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
            We build the{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
              how
            </span>
            ,<br />
            you focus on the{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary via-primary to-secondary">
              what
            </span>
            .
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
  );
}
