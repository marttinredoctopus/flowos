import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function PressPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Press</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>Press & Media</h1>
            <p style={{ fontSize: 16, color: 'var(--text-2)' }}>For media inquiries, please contact <a href="mailto:press@tasksdone.cloud" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>press@tasksdone.cloud</a></p>
          </div>

          {/* Brand assets */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>Brand Assets</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {['Logo (Light)', 'Logo (Dark)', 'Icon Only', 'Brand Guidelines'].map((asset, i) => (
                <div key={i} style={{
                  padding: '32px 24px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, textAlign: 'center', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{asset}</p>
                  <p style={{ fontSize: 12, color: '#6366f1', marginTop: 8 }}>Download →</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key facts */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>Key Facts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { label: 'Founded', value: '2022' },
                { label: 'Headquarters', value: 'Cairo, Egypt' },
                { label: 'Team Size', value: '12 people' },
                { label: 'Customers', value: '2,400+ agencies' },
                { label: 'Countries', value: '40+' },
                { label: 'Funding', value: 'Bootstrapped' },
              ].map((fact, i) => (
                <div key={i} style={{ padding: '16px 20px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{fact.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{fact.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Boilerplate */}
          <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '28px 32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>About TasksDone (Boilerplate)</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>
              TasksDone is an all-in-one agency management platform that replaces 5+ separate tools with a single, integrated system. Founded in 2022 by former agency owner Karim Hassan, TasksDone helps over 2,400 marketing agencies, creative studios, and freelancer teams manage tasks, clients, campaigns, invoices, and AI workflows from one place. The company is headquartered in Cairo, Egypt, and serves customers in 40+ countries worldwide.
            </p>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
