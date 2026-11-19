import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

// Lazy load heavy components with syntax highlighters
const AIUseCases = dynamic(() => import('@/components/AIUseCases'), {
  loading: () => <div className="py-32 bg-dark-grey" />,
});
const Roadmap = dynamic(() => import('@/components/Roadmap'), {
  loading: () => <div className="py-32 bg-dark-grey" />,
});
const CodeExample = dynamic(() => import('@/components/CodeExample'), {
  loading: () => <div className="py-32 bg-dark-grey" />,
});
const GettingStarted = dynamic(() => import('@/components/GettingStarted'), {
  loading: () => <div className="py-32 bg-dark-grey" />,
});
const Contributors = dynamic(() => import('@/components/Contributors'), {
  loading: () => <div className="py-32 bg-dark-grey" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <AIUseCases />
      <Roadmap />
      <CodeExample />
      <GettingStarted />
      <Contributors />
      <Footer />
    </main>
  );
}
