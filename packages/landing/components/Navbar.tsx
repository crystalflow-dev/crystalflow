'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaGithub, FaArrowLeft } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDemoPage = pathname === '/demo';

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Examples', href: '#examples' },
    { label: 'Getting Started', href: '#getting-started' },
    { label: 'Contributors', href: '#contributors' },
    { label: 'Docs', href: '/docs' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle smooth scroll for anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-light-grey/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/crystalflow-logo-blue-dark.svg"
              alt="ReactFlo"
              width={140}
              height={40}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems
              .filter((item) => (isDemoPage ? !item.href.startsWith('#') : true))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-light-grey hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            <Link
              href={isDemoPage ? '/' : '/demo'}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(42,65,255,0.5)] transition-all duration-200 hover:scale-105"
            >
              {isDemoPage ? (
                <span className="flex items-center gap-2">
                  <FaArrowLeft />
                  Go Back
                </span>
              ) : (
                'Try Demo'
              )}
            </Link>
            <a
              href="https://github.com/fladeed/reactflo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-transparent border border-light-grey/30 text-white rounded-lg font-semibold hover:border-primary transition-all duration-200"
            >
              <FaGithub className="text-lg" />
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="flex flex-col gap-4">
              {navItems
                .filter((item) => (isDemoPage ? !item.href.startsWith('#') : true))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-light-grey hover:text-white transition-colors duration-200 py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              <Link
                href={isDemoPage ? '/' : '/demo'}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(42,65,255,0.5)] transition-all duration-200 text-center"
              >
                {isDemoPage ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaArrowLeft />
                    Go Back
                  </span>
                ) : (
                  'Try Demo'
                )}
              </Link>
              <a
                href="https://github.com/fladeed/reactflo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-2 bg-transparent border border-light-grey/30 text-white rounded-lg font-semibold hover:border-primary transition-all duration-200"
              >
                <FaGithub className="text-lg" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
