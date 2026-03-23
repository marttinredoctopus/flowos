'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CheckCircle, X as XIcon, CaretDown } from '@phosphor-icons/react';

const PLANS = [
  {
    id: 'free', name: 'Free', monthly: 0, annual: 0,
    desc: 'For freelancers and solo consultants',
    color: '#6b7280',
    features: ['5 clients', '3 projects', '3 team members', '1GB storage', 'Kanban & List views', 'Basic tasks'],
  },
  {
    id: 'pro', name: 'Pro', monthly: 29, annual: 24,
    desc: 'For growing agencies',
    color: '#2563EB', highlighted: true,
    features: ['Unlimited clients', 'Unlimited projects', '15 team members', '20GB storage', 'All views incl. Timeline', 'Time tracking & invoicing', 'Client portal', 'Content calendar', 'Ad campaign tracker', '100 AI requests/mo'],
  },
  {
    id: 'agency', name: 'Agency', monthly: 59, annual: 49,
    desc: 'For large agencies scaling up',
    color: '#7C3AED',
    features: ['Everything in Pro', 'Unlimited team members', '100GB storage', 'White-label branding', 'Public API', 'Unlimited AI requests', 'Dedicated support', 'Custom domain portal'],
  },
];

const TABLE_ROWS: Array<{ label: string; free: boolean | string; pro: boolean | string; agency: boolean | string; section: string }> = [
  { label: 'Clients', free: '5', pro: '∞', agency: '∞', section: 'Limits' },
  { label: 'Team members', free: '3', pro: '15', agency: '∞', section: 'Limits' },
  { label: 'Projects', free: '3', pro: '∞', agency: '∞', section: 'Limits' },
  { label: 'Storage', free: '1GB', pro: '20GB', agency: '100GB', section: 'Limits' },
  { label: 'Kanban view', free: true, pro: true, agency: true, section: 'Views' },
  { label: 'List view', free: true, pro: true, agency: true, section: 'Views' },
  { label: 'Calendar view', free: false, pro: true, agency: true, section: 'Views' },
  { label: 'Timeline view', free: false, pro: true, agency: true, section: 'Views' },
  { label: 'Time tracking', free: false, pro: true, agency: true, section: 'Features' },
  { label: 'Invoicing', free: false, pro: true, agency: true, section: 'Features' },
  { label: 'Client portal', free: false, pro: true, agency: true, section: 'Features' },
  { label: 'Content calendar', free: false, pro: true, agency: true, section: 'Features' },
  { label: 'Ad campaign tracker', free: false, pro: true, agency: true, section: 'Features' },
  { label: 'AI requests', free: 'None', pro: '100/mo', agency: '∞', section: 'AI' },
  { label: 'White-label', free: false, pro: false, agency: true, section: 'Enterprise' },
  { label: 'Public API', free: false, pro: false, agency: true, section: 'Enterprise' },
  { label: 'Dedicated support', free: false, pro: false, agency: true, section: 'Enterprise' },
];

const FAQS = [
  { q: 'Can I change plans at any time?', a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades take effect at the end of your billing period.' },
  { q: 'Is there a free trial?', a: 'Yes! Pro and Agency plans come with a 14-day free trial. No credit card required to start.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) via Stripe. Annual plans can also be paid by bank transfer.' },
  { q: 'Can I add more team members?', a: "Yes. On Pro, you can add up to 15 members. On Agency, there's no limit. Need more on Pro? Contact us." },
  { q: 'What happens to my data if I cancel?', a: 'Your data is kept for 30 days after cancellation so you can export everything. After 30 days it\'s permanently deleted.' },
  { q: 'Do you offer discounts for nonprofits or startups?', a: 'Yes! We offer 50% off for registered nonprofits and qualifying early-stage startups. Email us at hello@tasksdone.cloud.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{q}</span>
        <CaretDown size={16} weight="bold" color="rgba(255,255,255,0.4)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
      </button>
      {open && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, paddingBottom: 20, margin: 0 }}>{a}</p>}
    </div>
  );
}

function CheckVal({ val }: { val: boolean | string }) {
  if (val === true) return <CheckCircle size={18} weight="duotone" color="#10b981" />;
  if (val === false) return <XIcon size={16} weight="bold" color="rgba(255,255,255,0.15)" />;
  return <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{val}</span>;
}

export default function PricingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
            Simple, honest pricing
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.7 }}>
            No hidden fees. No per-seat surprises. Cancel anytime.
          </p>
          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: 4, gap: 2 }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: '8px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: billing === b ? 'rgba(37,99,235,0.8)' : 'transparent', color: billing === b ? 'white' : 'rgba(255,255,255,0.5)' }}>
                {b === 'monthly' ? 'Monthly' : 'Annual'}{b === 'annual' && <span style={{ marginLeft: 6, fontSize: 11, background: '#10b981', color: 'white', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>-17%</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: plan.highlighted ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${plan.highlighted ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: '32px 28px', position: 'relative', boxShadow: plan.highlighted ? '0 0 60px rgba(37,99,235,0.12)' : 'none', display: 'flex', flexDirection: 'column' }}>
              {plan.highlighted && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', alignSelf: 'flex-start', marginTop: 8 }}>$</span>
                  <span style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.03em' }}>{billing === 'annual' ? plan.annual : plan.monthly}</span>
                  {plan.monthly > 0 && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', paddingBottom: 6 }}>/mo</span>}
                </div>
                {billing === 'annual' && plan.monthly > 0 && <p style={{ fontSize: 12, color: '#10b981' }}>Save ${(plan.monthly - plan.annual) * 12}/year</p>}
                {plan.monthly === 0 && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Free forever</p>}
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>{plan.desc}</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <CheckCircle size={14} weight="duotone" color={plan.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/register')} style={{ width: '100%', padding: '13px', borderRadius: 10, border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)', background: plan.highlighted ? 'linear-gradient(135deg,#0EA5E9,#2563EB)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: plan.highlighted ? '0 4px 20px rgba(37,99,235,0.3)' : 'none', transition: 'opacity 0.2s' }}>
                {plan.monthly === 0 ? 'Start Free' : 'Start 14-day trial'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 32, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em' }}>Compare plans</h2>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Feature</div>
            {['Free', 'Pro', 'Agency'].map(p => (
              <div key={p} style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: p === 'Pro' ? '#60a5fa' : 'white' }}>{p}</div>
            ))}
          </div>
          {TABLE_ROWS.map((row, i) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < TABLE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <div style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{row.label}</div>
              {(['free', 'pro', 'agency'] as const).map(p => (
                <div key={p} style={{ padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckVal val={row[p]} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 32, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em' }}>Frequently asked questions</h2>
        {FAQS.map(f => <FAQItem key={f.q} {...f} />)}
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>Still not sure?</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28, fontSize: 16 }}>Talk to our team — we&apos;ll help you find the right plan.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/contact')} style={{ padding: '13px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Book a demo</button>
          <button onClick={() => router.push('/register')} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}>Start free →</button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
