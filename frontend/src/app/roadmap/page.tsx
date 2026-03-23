'use client';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ArrowUp } from '@phosphor-icons/react';

interface RoadmapItem {
  title: string;
  desc: string;
  votes: number;
  tag: string;
  tagColor: string;
}

const PLANNED: RoadmapItem[] = [
  { title: 'Native iOS & Android apps', desc: 'Full-featured mobile apps for managing work on the go.', votes: 284, tag: 'Mobile', tagColor: '#2563EB' },
  { title: 'Zapier & Make.com integrations', desc: 'Connect TasksDone to 5,000+ apps via Zapier and Make.', votes: 201, tag: 'Integrations', tagColor: '#7C3AED' },
  { title: 'White-label client portal', desc: 'Customize the portal with your agency brand and domain.', votes: 178, tag: 'Enterprise', tagColor: '#0EA5E9' },
  { title: 'Automated proposal generation', desc: 'Generate professional proposals from project templates.', votes: 143, tag: 'AI', tagColor: '#f59e0b' },
];

const IN_PROGRESS: RoadmapItem[] = [
  { title: 'Advanced reporting dashboards', desc: 'Custom dashboards with drag-and-drop widgets and exports.', votes: 312, tag: 'Analytics', tagColor: '#10b981' },
  { title: 'Team performance analytics', desc: 'Track individual and team productivity over time.', votes: 256, tag: 'Analytics', tagColor: '#10b981' },
  { title: 'AI meeting summaries', desc: 'Auto-summarize meeting notes and generate action items.', votes: 189, tag: 'AI', tagColor: '#f59e0b' },
];

const SHIPPED: RoadmapItem[] = [
  { title: 'AI Campaign Builder', desc: 'Generate full campaign plans from a single prompt.', votes: 0, tag: 'AI', tagColor: '#10b981' },
  { title: 'Content Calendar', desc: 'Plan and schedule social content across all platforms.', votes: 0, tag: 'Content', tagColor: '#10b981' },
  { title: 'Ad Campaign Tracker', desc: 'Monitor Meta, Google, and TikTok Ads in real-time.', votes: 0, tag: 'Analytics', tagColor: '#10b981' },
  { title: 'Timeline view', desc: 'Gantt-style timeline view for projects with dependencies.', votes: 0, tag: 'Tasks', tagColor: '#10b981' },
  { title: 'Client Portal 2.0', desc: 'Redesigned portal with real-time updates and file sharing.', votes: 0, tag: 'Clients', tagColor: '#10b981' },
];

function RoadmapCard({ item, showVotes }: { item: RoadmapItem; showVotes: boolean }) {
  const [votes, setVotes] = useState(item.votes);
  const [voted, setVoted] = useState(false);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {showVotes && (
          <button onClick={() => { if (!voted) { setVotes(v => v + 1); setVoted(true); } }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 12px', borderRadius: 10, border: `1px solid ${voted ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)'}`, background: voted ? 'rgba(37,99,235,0.1)' : 'transparent', cursor: voted ? 'default' : 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
            <ArrowUp size={14} weight="bold" color={voted ? '#60a5fa' : 'rgba(255,255,255,0.4)'} />
            <span style={{ fontSize: 12, fontWeight: 700, color: voted ? '#60a5fa' : 'rgba(255,255,255,0.4)' }}>{votes}</span>
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>{item.title}</h3>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
          <div style={{ marginTop: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: item.tagColor, background: `${item.tagColor}18`, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.04em' }}>{item.tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [featureRequest, setFeatureRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const columns = [
    { label: 'Planned', color: '#2563EB', borderColor: 'rgba(37,99,235,0.2)', items: PLANNED, showVotes: true },
    { label: 'In Progress', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.2)', items: IN_PROGRESS, showVotes: true },
    { label: 'Shipped', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)', items: SHIPPED, showVotes: false },
  ];

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Public Roadmap</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            What we&apos;re building next
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Vote on features, track what&apos;s in progress, and see what just shipped.
          </p>
        </div>
      </section>

      {/* Kanban columns */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {columns.map(col => (
            <div key={col.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>{col.label}</h2>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 99 }}>{col.items.length}</span>
              </div>
              <div style={{ background: `${col.color}05`, border: `1px solid ${col.borderColor}`, borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 200 }}>
                {col.items.map((item, i) => (
                  <RoadmapCard key={i} item={item} showVotes={col.showVotes} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Request a feature */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>Request a feature</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Have an idea? We read every request and prioritize based on votes.</p>
          {submitted ? (
            <div style={{ padding: '16px 24px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 600, fontSize: 14 }}>Thanks! Your request has been submitted.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea value={featureRequest} onChange={e => setFeatureRequest(e.target.value)} placeholder="Describe the feature you'd like to see..." rows={3} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }} />
              <button onClick={() => featureRequest.trim() && setSubmitted(true)} style={{ padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Submit Request →</button>
            </div>
          )}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
