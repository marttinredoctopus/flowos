'use client';
export const dynamic = 'force-dynamic';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function CookiesPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 8 }}>Cookie Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 40 }}>Last updated: March 14, 2025</p>
          {[
            { title: 'What are cookies?', content: 'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how you use it.' },
            { title: 'Cookies we use', content: 'Essential cookies (required for login and session management), preference cookies (theme selection, sidebar state), and analytics cookies (page views, feature usage — you can opt out).' },
            { title: 'Third-party cookies', content: 'We use Stripe for payment processing (their cookies manage payment sessions) and Vercel Analytics for performance monitoring. We do not use Google Ads or Facebook Pixel cookies.' },
            { title: 'Managing cookies', content: 'You can control cookies through your browser settings. Disabling essential cookies will prevent you from logging in. Analytics cookies can be disabled without affecting functionality.' },
            { title: 'Contact', content: 'Questions? Email privacy@tasksdone.cloud.' },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{section.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </article>
      </div>
      <LandingFooter />
    </div>
  );
}
