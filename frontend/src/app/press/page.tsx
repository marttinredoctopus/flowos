'use client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { DownloadSimple, Envelope } from '@phosphor-icons/react';

const FACTS = [
  { label: 'Founded', value: '2024' },
  { label: 'Headquarters', value: 'Cairo, Egypt' },
  { label: 'Team Size', value: '12 people' },
  { label: 'Customers', value: '2,400+ agencies' },
  { label: 'Countries', value: '40+' },
  { label: 'Funding', value: 'Bootstrapped' },
];

const BRAND_ASSETS = [
  { label: 'Logo (Light)', desc: 'PNG, SVG · White background', ext: 'SVG' },
  { label: 'Logo (Dark)', desc: 'PNG, SVG · Dark background', ext: 'SVG' },
  { label: 'Icon Only', desc: 'Square icon mark · All formats', ext: 'PNG' },
  { label: 'Brand Guidelines', desc: 'Colors, fonts, usage rules', ext: 'PDF' },
];

export default function PressPage() {
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Press & Media</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 20, lineHeight: 1.1 }}>
            Press & Media
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Resources for journalists, podcasters, and media. For inquiries, reach us at{' '}
            <a href="mailto:press@tasksdone.cloud" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>press@tasksdone.cloud</a>
          </p>
        </div>
      </section>

      {/* Brand assets */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>Brand Assets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {BRAND_ASSETS.map((asset, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(37,99,235,0.35)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(37,99,235,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <DownloadSimple size={20} weight="duotone" color="#60a5fa" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>{asset.label}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>{asset.desc}</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', background: 'rgba(37,99,235,0.12)', padding: '3px 8px', borderRadius: 6 }}>{asset.ext}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Company facts */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>Company Facts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {FACTS.map((fact, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{fact.label}</p>
              <p style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boilerplate */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>About TasksDone (Boilerplate)</h2>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '32px' }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>
            TasksDone is an all-in-one agency management platform that replaces 6+ separate tools with a single, integrated system. Founded in 2024, TasksDone helps over 2,400 marketing agencies, creative studios, and freelancer teams manage tasks, clients, campaigns, invoices, content calendars, and AI workflows from one place. The company is headquartered in Cairo, Egypt, and serves customers in 40+ countries worldwide.
          </p>
        </div>
      </section>

      {/* Press contact */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '40px' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Envelope size={24} weight="duotone" color="#60a5fa" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>Press Contact</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 20, lineHeight: 1.65 }}>We respond to press inquiries within 24 hours. Include your publication name and deadline in your message.</p>
          <a href="mailto:press@tasksdone.cloud" style={{ display: 'inline-flex', padding: '13px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
            press@tasksdone.cloud →
          </a>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
