'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { MessageSquare, Book, Video, Mail } from 'lucide-react';

const TOPICS = [
  { q: 'How do I invite team members?', a: 'Go to Settings → Team → Invite Member. Enter their email and select a role (Admin, Team Member). They\'ll receive an email invitation.' },
  { q: 'How do I give clients portal access?', a: 'Open a client profile, click "Portal Access", and enable it. The client will receive a login link to their private portal.' },
  { q: 'How do I create an invoice?', a: 'Go to Finance → Invoices → New Invoice. Select a client, add line items, and click Send. Your client will receive a PDF via email.' },
  { q: 'Can I import data from Asana or Notion?', a: 'Yes! Go to Settings → Import. We support CSV import from Asana, Trello, Notion, Monday.com, and ClickUp. Our team can also do the migration for you.' },
  { q: 'How does the AI work?', a: 'TasksDone AI uses OpenAI GPT-4 under the hood. You can use it to generate campaign plans, write proposals, analyze competitors, and get intelligent suggestions across the platform.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Settings → Billing → Cancel Plan. Your account will remain active until the end of the billing period. You can export all your data before canceling.' },
  { q: 'Is my data secure?', a: 'Yes. We\'re AES-256 encrypted, SOC 2 compliant, and hosted on AWS with 99.99% uptime. Your data is backed up every hour and you can export it anytime.' },
  { q: 'Do you have a mobile app?', a: 'The web app is fully responsive and works great on mobile. Native iOS and Android apps are coming in Q2 2025 — sign up for early access at our roadmap page.' },
];

export default function HelpPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Help Center</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              How can we help?
            </h1>
          </div>

          {/* Support channels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 56 }}>
            {[
              { icon: <Book size={22} color="#6366f1" />, title: 'Documentation', desc: 'Full docs and guides', href: '/docs', color: '#6366f1' },
              { icon: <MessageSquare size={22} color="#8b5cf6" />, title: 'Live Chat', desc: 'Talk to us in-app', href: '#', color: '#8b5cf6' },
              { icon: <Mail size={22} color="#10b981" />, title: 'Email Support', desc: 'support@tasksdone.cloud', href: 'mailto:support@tasksdone.cloud', color: '#10b981' },
              { icon: <Video size={22} color="#f59e0b" />, title: 'Video Tutorials', desc: 'Watch and learn', href: '#', color: '#f59e0b' },
            ].map((channel, i) => (
              <a key={i} href={channel.href} style={{
                display: 'block', padding: '24px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${channel.color}30`; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `${channel.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {channel.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{channel.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>{channel.desc}</p>
              </a>
            ))}
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TOPICS.map((item, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{item.q}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
