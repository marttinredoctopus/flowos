import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

const ROADMAP = [
  {
    quarter: 'Q1 2025', status: 'shipped', label: 'Shipped',
    color: '#10b981', icon: <CheckCircle2 size={16} color="#10b981" />,
    items: [
      'AI Campaign Builder (generate full campaign plans)',
      'Client Portal 2.0 redesign',
      'Sprint planning & agile boards',
      'Webhook integrations',
      'Competitor Analysis tool',
    ],
  },
  {
    quarter: 'Q2 2025', status: 'in-progress', label: 'In Progress',
    color: '#6366f1', icon: <Clock size={16} color="#6366f1" />,
    items: [
      'Native mobile apps (iOS & Android)',
      'Zapier & Make.com integrations',
      'Advanced reporting & custom dashboards',
      'Team performance analytics',
      'AI-powered meeting summaries',
    ],
  },
  {
    quarter: 'Q3 2025', status: 'planned', label: 'Planned',
    color: '#8b5cf6', icon: <Sparkles size={16} color="#8b5cf6" />,
    items: [
      'White-label client portal (Enterprise)',
      'Facebook Ads & Google Ads native integration',
      'Automated proposal generation',
      'Resource planning & capacity management',
      'Multi-language support',
    ],
  },
  {
    quarter: 'Q4 2025', status: 'planned', label: 'Planned',
    color: '#f59e0b', icon: <Sparkles size={16} color="#f59e0b" />,
    items: [
      'Public API v2 with full CRUD access',
      'AI-powered financial forecasting',
      'Agency marketplace for finding subcontractors',
      'Custom workflow automation builder',
      'SOC 2 Type II certification',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Roadmap</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              Where we're headed
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto' }}>
              Our public roadmap. Vote on features, track progress, and see what's coming next.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {ROADMAP.map((quarter, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: `1px solid ${quarter.status === 'shipped' ? `${quarter.color}30` : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, padding: '28px 32px',
                opacity: quarter.status === 'planned' ? 0.8 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{quarter.quarter}</h2>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: quarter.color, background: `${quarter.color}15`, padding: '3px 10px', borderRadius: 8 }}>
                    {quarter.icon} {quarter.label}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                  {quarter.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: quarter.color, flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 14, color: quarter.status === 'shipped' ? 'var(--text)' : 'var(--text-2)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: 32, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Have a feature request?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>We build what our users need. Send us your idea and it could make the next roadmap.</p>
            <a href="/contact" style={{
              display: 'inline-flex', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none',
            }}>
              Submit a Feature Request →
            </a>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
