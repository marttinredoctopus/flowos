'use client';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { MagnifyingGlass, Lightning, Users, CreditCard, Brain, Kanban, ArrowRight } from '@phosphor-icons/react';

const SIDEBAR_SECTIONS = [
  {
    label: 'Getting Started',
    icon: Lightning,
    color: '#2563EB',
    articles: ['Quick Start Guide', 'Setting Up Your Workspace', 'Inviting Your Team', 'Creating Your First Client', 'Creating Your First Project'],
  },
  {
    label: 'Task Management',
    icon: Kanban,
    color: '#7C3AED',
    articles: ['Creating and Assigning Tasks', 'Kanban & List Views', 'Timeline View', 'Task Priorities & Labels', 'Time Tracking Basics'],
  },
  {
    label: 'Client Management',
    icon: Users,
    color: '#0EA5E9',
    articles: ['Adding Clients', 'Client Portal Setup', 'Sharing Files with Clients', 'Client Permissions', 'Communication Log'],
  },
  {
    label: 'Finance & Invoicing',
    icon: CreditCard,
    color: '#10b981',
    articles: ['Creating Invoices', 'Setting Up Payment Methods', 'Tracking Expenses', 'Financial Reports', 'Recurring Invoices'],
  },
  {
    label: 'AI Features',
    icon: Brain,
    color: '#f59e0b',
    articles: ['AI Campaign Builder', 'AI Content Generator', 'Competitor Analysis', 'AI Usage Limits', 'Setting Up AI Keys'],
  },
];

const QUICK_START_CONTENT = `
## Quick Start Guide

Welcome to TasksDone! This guide will get you set up in under 10 minutes.

### Step 1: Create your workspace
After signing up, you'll be prompted to name your agency. This becomes your workspace name visible to your team and clients.

### Step 2: Invite your team
Go to **Settings → Team → Invite Member**. Enter their email and select a role:
- **Admin** — full access including billing
- **Team Member** — access to projects and clients
- **Viewer** — read-only access

### Step 3: Add your first client
Navigate to **Clients → New Client**. Add their name, contact details, and any notes. You can also enable their client portal access right away.

### Step 4: Create a project
Go to **Projects → New Project**. Link it to a client, set a due date, and add your first tasks. Choose your preferred view: Kanban, List, or Timeline.

### Step 5: Track time and bill
When working on tasks, click the timer icon to start tracking time. When ready, go to **Finance → New Invoice** to generate a professional invoice from your tracked hours.

That's it! You're ready to run your agency from one place.
`;

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('Getting Started');
  const [activeArticle, setActiveArticle] = useState('Quick Start Guide');
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero with search */}
      <section style={{ padding: '80px 24px 48px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #060B18 0%, #0A1628 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 300, borderRadius: '50%', top: -50, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Documentation</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 24, lineHeight: 1.1 }}>Documentation</h1>
          <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
            <MagnifyingGlass size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documentation..." style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* Popular articles */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Popular articles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 48 }}>
          {['Quick Start Guide', 'Setting Up Your Workspace', 'Creating Invoices', 'Client Portal Setup', 'AI Campaign Builder', 'Inviting Your Team'].map((article, i) => (
            <button key={i} onClick={() => setActiveArticle(article)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', color: 'white', textAlign: 'left' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37,99,235,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,99,235,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <span style={{ fontSize: 13, fontWeight: 500 }}>{article}</span>
              <ArrowRight size={12} color="rgba(255,255,255,0.3)" />
            </button>
          ))}
        </div>
      </section>

      {/* Main docs layout */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40 }}>
        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          {SIDEBAR_SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.label;
            return (
              <div key={section.label} style={{ marginBottom: 4 }}>
                <button onClick={() => setActiveSection(isActive ? '' : section.label)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: isActive ? `${section.color}12` : 'transparent', border: 'none', cursor: 'pointer', color: isActive ? 'white' : 'rgba(255,255,255,0.6)', textAlign: 'left', transition: 'all 0.2s' }}>
                  <Icon size={16} weight="duotone" color={section.color} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{section.label}</span>
                </button>
                {isActive && (
                  <div style={{ paddingLeft: 8, marginTop: 2 }}>
                    {section.articles.map(article => (
                      <button key={article} onClick={() => setActiveArticle(article)} style={{ width: '100%', padding: '7px 12px', borderRadius: 6, background: activeArticle === article ? 'rgba(37,99,235,0.1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: activeArticle === article ? '#60a5fa' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}>
                        {article}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '40px 48px', minHeight: 600 }}>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>{activeArticle}</h1>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Last updated: March 2025</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
            {activeArticle === 'Quick Start Guide' ? (
              <div>
                <p style={{ marginBottom: 20 }}>Welcome to TasksDone! This guide will get you set up in under 10 minutes.</p>
                {[
                  { step: '1', title: 'Create your workspace', body: "After signing up, you'll be prompted to name your agency. This becomes your workspace name visible to your team and clients." },
                  { step: '2', title: 'Invite your team', body: 'Go to Settings → Team → Invite Member. Enter their email and select a role: Admin (full access), Team Member (standard access), or Viewer (read-only).' },
                  { step: '3', title: 'Add your first client', body: "Navigate to Clients → New Client. Add their name, contact details, and any notes. You can enable client portal access right from the profile." },
                  { step: '4', title: 'Create a project', body: 'Go to Projects → New Project. Link it to a client, set a due date, and add your first tasks. Switch between Kanban, List, or Timeline views.' },
                  { step: '5', title: 'Track time and invoice', body: 'Click the timer icon on any task to start tracking time. When ready, go to Finance → New Invoice to bill clients from tracked hours.' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#60a5fa', flexShrink: 0 }}>{item.step}</div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{item.title}</h3>
                      <p style={{ margin: 0 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '16px 20px', marginTop: 16 }}>
                  <p style={{ margin: 0, color: '#10b981', fontSize: 14 }}>That&apos;s it! You&apos;re ready to run your agency from one place.</p>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: 16 }}>This article covers everything you need to know about <strong style={{ color: 'white' }}>{activeArticle}</strong>.</p>
                <p style={{ marginBottom: 16 }}>Full documentation for this topic is available. Navigate to the relevant section to find detailed guides, screenshots, and examples.</p>
                <p>Need help? Contact our support team at <a href="mailto:support@tasksdone.cloud" style={{ color: '#60a5fa', textDecoration: 'none' }}>support@tasksdone.cloud</a> — we respond within 3 minutes during business hours.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
