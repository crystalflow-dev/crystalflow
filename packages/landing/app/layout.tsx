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
  title: 'ReactFlo - Declarative Workflow Builder Framework',
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
  authors: [{ name: 'ReactFlo Team' }],
  creator: 'ReactFlo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reactflo.dev',
    title: 'ReactFlo - Declarative Workflow Builder Framework',
    description:
      'Build powerful workflow applications with TypeScript decorators, visual editing, and JSON serialization.',
    siteName: 'ReactFlo',
    images: [
      {
        url: '/logo/reactflo-logo.svg',
        width: 1200,
        height: 630,
        alt: 'ReactFlo Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReactFlo - Declarative Workflow Builder Framework',
    description:
      'Build powerful workflow applications with TypeScript decorators, visual editing, and JSON serialization.',
    images: ['/logo/reactflo-logo.svg'],
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
