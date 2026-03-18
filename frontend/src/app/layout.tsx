import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthInit } from '@/components/AuthInit';
import './globals.css';

export const metadata: Metadata = {
  title: 'TasksDone — The Agency OS That Actually Ships',
  description: 'Replace 6 tools with one platform built for real agencies. Tasks, clients, campaigns, invoices, AI, and more — all in one place.',
  keywords: 'agency management, project management, client portal, task management, invoicing, AI tools',
  openGraph: {
    title: 'TasksDone — The Agency OS That Actually Ships',
    description: 'Replace 6 tools with one platform built for real agencies.',
    siteName: 'TasksDone',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})()` }} />
      </head>
      <body>
        <ErrorBoundary>
          <AuthInit />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
              duration: 4000,
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
