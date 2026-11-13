import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

const roboto = Roboto({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gymtracker',
  description: 'Your personal fitness companion. Create workout plans, track your training sessions, monitor your progress, and stay motivated as you work towards your fitness goals.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#03091b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} min-h-full antialiased`}>
      <body className="min-h-dvh min-h-screen w-full">
        {children}
        <Analytics />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
