import type { Metadata, Viewport } from 'next';
import SiteDocument from '@/components/next/SiteDocument';
import { dark, light } from '@/lib/palette';
import './next.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://crystalflow.dev'),
  title: 'CrystalFlow: TypeScript framework for workflow editors',
  description:
    'Write each node as a decorated TypeScript class. CrystalFlow gives you the React canvas, the execution engine and JSON save and load.',
  openGraph: {
    type: 'website',
    title: 'CrystalFlow: TypeScript framework for workflow editors',
    description: 'Node classes in, a visual workflow editor out.',
    images: ['/share.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/logo/crystalflow-icon-blue-light.svg' },
  other: { 'site-kind': 'software', 'page-type': 'software' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: light['--p-bg'] },
    { media: '(prefers-color-scheme: dark)', color: dark['--p-bg'] },
  ],
};

export default function NextLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteDocument>{children}</SiteDocument>;
}
