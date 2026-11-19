import 'reflect-metadata';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://crystalflow.dev'),
  title: 'CrystalFlow - Declarative Workflow Builder Framework',
  description:
    'Build powerful workflow applications with TypeScript decorators, visual editing, and JSON serialization. Zero dependencies, 100% type-safe.',
  keywords: [
    'workflow',
    'builder',
    'react',
    'typescript',
    'decorators',
    'visual editor',
    'flow',
    'automation',
  ],
  authors: [{ name: 'CrystalFlow Team' }],
  creator: 'CrystalFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crystalflow.dev',
    title: 'CrystalFlow - Declarative Workflow Builder Framework',
    description:
      'Build powerful workflow applications with TypeScript decorators, visual editing, and JSON serialization.',
    siteName: 'CrystalFlow',
    images: [
      {
        url: 'https://crystalflow.dev/landing.png',
        width: 1200,
        height: 630,
        alt: 'CrystalFlow - Declarative Workflow Builder Framework',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrystalFlow - Declarative Workflow Builder Framework',
    description:
      'Build powerful workflow applications with TypeScript decorators, visual editing, and JSON serialization.',
    images: [
      {
        url: 'https://crystalflow.dev/landing.png',
        alt: 'CrystalFlow - Declarative Workflow Builder Framework',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
