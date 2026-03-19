'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, X } from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const PLANS = [
  {
    name: 'Starter', price: 0, annual: 0, color: '#6366f1',
    description: 'For individuals and small freelancers getting started.',
    cta: 'Start Free', href: '/register',
    features: ['Up to 5 team members', 'Up to 3 projects', 'Up to 5 clients', 'Task & Kanban boards', 'Basic reporting', '5GB storage', 'Email support'],
  },
  {
    name: 'Pro', price: 49, annual: 39, color: '#8b5cf6', popular: true,
    description: 'For growing agencies managing multiple clients.',
    cta: 'Start Pro Trial', href: '/register?plan=pro',
    features: ['Everything in Starter', 'Up to 25 team members', 'Unlimited projects & clients', 'Content Calendar', 'Ad Campaign Tracker', 'Time Tracking & Invoices', 'Client Portal', 'AI Intelligence (100/mo)', '100GB storage', 'Priority support'],
  },
  {
    name: 'Enterprise', price: 149, annual: 119, color: '#06b6d4',
    description: 'For large agencies needing full power and customization.',
    cta: 'Contact Sales', href: '/contact',
    features: ['Everything in Pro', 'Unlimited team members', 'White-label branding', 'Public API + Webhooks', 'Facebook & Google Ads API', 'AI Intelligence (1000/mo)', '1TB storage', 'Dedicated account manager', 'Custom integrations', 'SLA & SSO'],
  },
];

const COMPARE_FEATURES = [
  { feature: 'Team members', starter: '5', pro: '25', enterprise: 'Unlimited' },
  { feature: 'Projects', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Clients', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Storage', starter: '5GB', pro: '100GB', enterprise: '1TB' },
  { feature: 'Kanban & List views', starter: true, pro: true, enterprise: true },
  { feature: 'Time tracking', starter: false, pro: true, enterprise: true },
  { feature: 'Invoices & billing', starter: false, pro: true, enterprise: true },
  { feature: 'Client portal', starter: false, pro: true, enterprise: true },
  { feature: 'Content calendar', starter: false, pro: true, enterprise: true },
  { feature: 'Ad campaign tracker', starter: false, pro: true, enterprise: true },
  { feature: 'AI intelligence', starter: false, pro: '100/mo', enterprise: '1000/mo' },
  { feature: 'White-label branding', starter: false, pro: false, enterprise: true },
  { feature: 'Public API', starter: false, pro: false, enterprise: true },
  { feature: 'Facebook/Google Ads API', starter: false, pro: false, enterprise: true },
  { feature: 'Dedicated support', starter: false, pro: false, enterprise: true },
  { feature: 'Custom integrations', starter: false, pro: false, enterprise: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle2 size={16} color="#10b981" />;
  if (value === false) return <X size={14} color="var(--text-3)" />;
  return <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{value}</span>;
}

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
            Start free. Scale when ready.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-2)', marginBottom: 32 }}>No hidden fees. Cancel anytime.</p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: 4, marginBottom: 48 }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '9px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600,
                background: billing === b ? 'var(--surface)' : 'none',
                color: billing === b ? 'var(--text)' : 'var(--text-2)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
                boxShadow: billing === b ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.2s',
              }}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === 'annual' && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 12 }}>SAVE 20%</span>}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20, marginBottom: 80, textAlign: 'left' }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{
                background: plan.popular ? 'rgba(99,102,241,0.07)' : 'var(--card)',
                border: `1px solid ${plan.popular ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, padding: '28px 28px 32px', position: 'relative',
                boxShadow: plan.popular ? '0 0 40px rgba(99,102,241,0.1)' : 'none',
                display: 'flex', flexDirection: 'column',
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                    <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{plan.name}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.5 }}>{plan.description}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: billing === 'annual' && plan.price > 0 ? 4 : 24 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>${billing === 'annual' ? plan.annual : plan.price}</span>
                  {plan.price > 0 && <span style={{ fontSize: 14, color: 'var(--text-2)' }}>/mo</span>}
                </div>
                {billing === 'annual' && plan.price > 0 && (
                  <p style={{ fontSize: 12, color: '#10b981', marginBottom: 20 }}>Billed annually · Save ${(plan.price - plan.annual) * 12}/yr</p>
                )}
                <Link href={plan.href} style={{
                  display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  background: plan.popular ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)',
                  color: '#fff', textDecoration: 'none', marginBottom: 24,
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: plan.popular ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
                  transition: 'transform 0.15s',
                }}>
                  {plan.cta}
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'left' }}>
            Full feature comparison
          </h2>
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, color: 'var(--text-2)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)', minWidth: 200 }}>Feature</th>
                  {PLANS.map(p => (
                    <th key={p.name} style={{ padding: '14px 20px', textAlign: 'center', fontSize: 13, color: p.popular ? '#8b5cf6' : 'var(--text)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FEATURES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 20px', fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}><Cell value={row.starter} /></td>
                    <td style={{ padding: '12px 20px', textAlign: 'center', background: 'rgba(99,102,241,0.04)' }}><Cell value={row.pro} /></td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}><Cell value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 80, textAlign: 'left', maxWidth: 700, margin: '80px auto 0' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 32 }}>Pricing FAQ</h2>
            {[
              { q: 'Can I change plans later?', a: 'Yes, upgrade or downgrade anytime. Changes take effect immediately and we prorate any billing differences.' },
              { q: 'Is there a free trial?', a: 'The Starter plan is free forever. Pro includes a 14-day trial with full features — no credit card required.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) and ACH bank transfers for Enterprise plans.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your account settings. No cancellation fees, ever.' },
              { q: 'Do you offer discounts for non-profits or startups?', a: 'Yes — contact us at contact@tasksdone.cloud with proof of status and we\'ll set you up with a discounted plan.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{item.q}</p>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
