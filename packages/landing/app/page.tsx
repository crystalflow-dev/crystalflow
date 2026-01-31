import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AIUseCases from '@/components/AIUseCases';
import CodeExample from '@/components/CodeExample';
import Roadmap from '@/components/Roadmap';
import GettingStarted from '@/components/GettingStarted';
import Contributors from '@/components/Contributors';
import Footer from '@/components/Footer';

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
