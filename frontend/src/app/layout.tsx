import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthInit } from '@/components/AuthInit';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#7030EF',
};

export const metadata: Metadata = {
  title: 'TasksDone — The Agency OS That Actually Ships',
  description: 'Replace 6 tools with one platform built for real agencies. Tasks, clients, campaigns, invoices, AI, and more — all in one place.',
  keywords: 'agency management, project management, client portal, task management, invoicing, AI tools',
  metadataBase: new URL('https://tasksdone.cloud'),
  openGraph: {
    title: 'TasksDone — The Agency OS That Actually Ships',
    description: 'Replace 6 tools with one platform built for real agencies.',
    siteName: 'TasksDone',
    type: 'website',
    url: 'https://tasksdone.cloud',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TasksDone — The Agency OS That Actually Ships',
    description: 'Replace 6 tools with one platform built for real agencies.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})()` }} />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <AuthInit />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--text)',
                border: '1px solid rgba(112,48,239,0.25)',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(112,48,239,0.1)',
                fontSize: '13px',
                fontFamily: 'var(--font-body, "DM Sans"), sans-serif',
                backdropFilter: 'blur(20px)',
              },
              duration: 4000,
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
