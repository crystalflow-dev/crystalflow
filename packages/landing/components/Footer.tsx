import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-light-grey/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Image
              src="/logo/reactflo-logo-blue.svg"
              alt="ReactFlo Logo"
              width={150}
              height={45}
            />
            <p className="text-sm text-light-grey">
              Declarative workflow builder framework for modern web applications.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-light-grey">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#demo" className="hover:text-primary transition-colors">Demo</Link></li>
              <li><Link href="#getting-started" className="hover:text-primary transition-colors">Getting Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-light-grey">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/examples" className="hover:text-primary transition-colors">Examples</Link></li>
              <li><Link href="/api" className="hover:text-primary transition-colors">API Reference</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-light-grey">
              <li><a href="https://github.com/fladeed/reactflo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://twitter.com/reactflo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://discord.gg/reactflo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-light-grey/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-light-grey">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p>© 2026 <a href="https://www.fladeed.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-semibold">Fladeed</a>. All rights reserved.</p>
            <p className="text-xs">ReactFlo is released under the MIT License.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
