'use client';
export const dynamic = 'force-dynamic';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const JOBS = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Remote (Global)', type: 'Full-time', color: '#6366f1' },
  { title: 'Product Designer (UI/UX)', dept: 'Design', location: 'Remote (Global)', type: 'Full-time', color: '#8b5cf6' },
  { title: 'Customer Success Manager', dept: 'Customer Success', location: 'Remote (EMEA)', type: 'Full-time', color: '#10b981' },
  { title: 'Growth Marketer', dept: 'Marketing', location: 'Remote (Global)', type: 'Full-time', color: '#f59e0b' },
  { title: 'AI/ML Engineer', dept: 'Engineering', location: 'Remote (Global)', type: 'Full-time', color: '#06b6d4' },
];

const PERKS = [
  { emoji: '🌍', title: 'Fully Remote', desc: 'Work from anywhere in the world. We care about output, not office attendance.' },
  { emoji: '💰', title: 'Competitive Salary', desc: 'Top-of-market compensation benchmarked to your location.' },
  { emoji: '📚', title: 'Learning Budget', desc: '$1,000/year for courses, books, and conferences.' },
  { emoji: '🏥', title: 'Health Coverage', desc: 'Full health, dental, and vision coverage for you and your family.' },
  { emoji: '🛋️', title: 'Home Office Stipend', desc: '$500 to set up your perfect workspace.' },
  { emoji: '🏖️', title: 'Unlimited PTO', desc: 'Take time when you need it. We trust you to manage your time.' },
];

export default function CareersPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Careers</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              Help us build the future of agency work
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
              We're a small team with big ambitions. If you love building products that real people use every day, we want to hear from you.
            </p>
          </div>

          {/* Perks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 64 }}>
            {PERKS.map((perk, i) => (
              <div key={i} style={{ padding: '20px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{perk.emoji}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{perk.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* Jobs */}
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 24 }}>Open positions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {JOBS.map((job, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
                padding: '20px 24px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${job.color}30`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: job.color, background: `${job.color}15`, padding: '2px 10px', borderRadius: 8, fontWeight: 600 }}>{job.dept}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{job.location}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{job.type}</span>
                  </div>
                </div>
                <a href="/contact" style={{
                  padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--text)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap',
                }}>
                  Apply →
                </a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 24 }}>
            Don't see your role? <a href="/contact" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Send us your CV anyway →</a>
          </p>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
