import Navbar from '@/components/Navbar';
import InteractiveDemo from '@/components/InteractiveDemo';
import Footer from '@/components/Footer';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <InteractiveDemo />
      <Footer />
    </main>
  );
}
