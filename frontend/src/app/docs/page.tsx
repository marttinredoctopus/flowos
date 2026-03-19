import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Book, Zap, Users, CreditCard, Brain, ArrowRight, Search } from 'lucide-react';

const DOCS_SECTIONS = [
  {
    icon: <Zap size={22} color="#6366f1" />, color: '#6366f1',
    title: 'Getting Started',
    articles: ['Quick Start Guide', 'Setting Up Your Workspace', 'Inviting Your Team', 'Creating Your First Client', 'Creating Your First Project'],
  },
  {
    icon: <Book size={22} color="#8b5cf6" />, color: '#8b5cf6',
    title: 'Task Management',
    articles: ['Creating and Assigning Tasks', 'Kanban & List Views', 'Task Priorities & Labels', 'Sprint Planning', 'Time Tracking Basics'],
  },
  {
    icon: <Users size={22} color="#06b6d4" />, color: '#06b6d4',
    title: 'Client Management',
    articles: ['Adding Clients', 'Client Portal Setup', 'Sharing Files with Clients', 'Client Communication Log', 'Managing Client Permissions'],
  },
  {
    icon: <CreditCard size={22} color="#10b981" />, color: '#10b981',
    title: 'Finance & Invoicing',
    articles: ['Creating Invoices', 'Setting Up Payment Methods', 'Tracking Expenses', 'Financial Reports', 'Recurring Invoices'],
  },
  {
    icon: <Brain size={22} color="#f59e0b" />, color: '#f59e0b',
    title: 'AI Features',
    articles: ['AI Campaign Builder', 'AI Content Generator', 'Competitor Analysis Tool', 'Setting Up AI Keys', 'AI Usage Limits'],
  },
];

export default function DocsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        {/* Hero */}
        <section style={{ background: 'rgba(99,102,241,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 56px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Documentation</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
            How can we help?
          </h1>
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              placeholder="Search documentation..."
              style={{
                width: '100%', padding: '13px 16px 13px 44px', borderRadius: 12,
                background: 'var(--card)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text)', fontSize: 15, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </section>

        {/* Quick links */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Popular articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 56 }}>
            {['Quick Start Guide', 'Setting Up Your Workspace', 'Creating Invoices', 'Client Portal Setup', 'AI Campaign Builder', 'Inviting Your Team'].map((article, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{article}</span>
                <ArrowRight size={14} color="var(--text-3)" />
              </div>
            ))}
          </div>

          {/* Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {DOCS_SECTIONS.map((section, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${section.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {section.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{section.title}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {section.articles.map((article, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                    >
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: section.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{article}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Help CTA */}
          <div style={{ marginTop: 56, textAlign: 'center', padding: 32, background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Can't find what you need?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>Our support team responds in under 3 minutes during business hours.</p>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none',
            }}>
              Contact Support →
            </Link>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
