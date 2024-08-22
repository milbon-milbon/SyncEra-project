// frontend/src/app/layout.tsx
import React from 'react';
import type { Viewport, Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SyncEra',
  description: 'Your page description.',
  icons: {
    icon: '/favicon.ico',
  },
};

// viewportオブジェクトをエクスポート
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>{/* Next.jsのviewportは自動設定されるため、手動での設定は不要 */}</head>
      <body>{children}</body>
    </html>
  );
}
