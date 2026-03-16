'use client';

import { useState, useEffect, useRef } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';

const FEATURES = [
  { icon: '🎯', color: '#7c6fe0', dim: '#7c6fe022', title: 'Task & Project Management', desc: 'Kanban, List, Calendar. Every view your team needs to stay aligned and deliver on time.' },
  { icon: '📅', color: '#4a9eff', dim: '#4a9eff22', title: 'Content Calendar', desc: 'Plan and schedule content across every platform in one unified calendar. Goodbye spreadsheets.' },
  { icon: '📈', color: '#ff6b9d', dim: '#ff6b9d22', title: 'Ad Campaign Tracker', desc: 'Track ROAS, CTR, CPC across Facebook, Google, and TikTok. All metrics in one dashboard.' },
  { icon: '💬', color: '#00c9b1', dim: '#00c9b122', title: 'Team Chat', desc: 'Real-time messaging with channels, DMs, and task links. Kill the WhatsApp chaos.' },
  { icon: '⏱', color: '#ffc107', dim: '#ffc10722', title: 'Time Tracking', desc: 'One-click timers, billable hours, and auto reports per client. Know where every hour goes.' },
  { icon: '🤖', color: '#7c6fe0', dim: '#7c6fe022', title: 'AI Intelligence', desc: 'Competitor analysis, market research, and campaign ideas powered by AI. Win more pitches.' },
  { icon: '🧾', color: '#ff7043', dim: '#ff704322', title: 'Invoicing', desc: 'Create, send, and track invoices. Stripe integration so you get paid faster with less chasing.' },
  { icon: '👥', color: '#4a9eff', dim: '#4a9eff22', title: 'Client Portal', desc: 'Branded portals where clients track progress, approve work, and review reports.' },
  { icon: '⚡', color: '#4caf82', dim: '#4caf8222', title: 'Automation', desc: 'Auto-assign tasks, send reminders, and trigger actions without lifting a finger.' },
];

const STEPS = [
  { num: '01', color: '#7c6fe0', title: 'Create workspace', desc: 'Set up your agency workspace in 60 seconds. No credit card required.' },
  { num: '02', color: '#4a9eff', title: 'Add clients & team', desc: 'Invite your team, onboard clients, and assign roles instantly.' },
  { num: '03', color: '#ff6b9d', title: 'Run your projects', desc: 'Create projects, assign tasks, track time, and manage content calendars.' },
  { num: '04', color: '#4caf82', title: 'Get paid', desc: 'Send invoices, track time, and close the loop on every project.' },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    desc: 'For freelancers & small teams',
    features: ['Up to 5 members', '3 active projects', 'Task & project management', 'Team chat', 'Basic reporting'],
    cta: 'Get started free',
    accent: '#7c6fe0',
    popular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 49, annual: 39 },
    desc: 'For growing agencies',
    features: ['Unlimited members', 'Unlimited projects', 'Content calendar', 'Time tracking', 'Invoicing & expenses', 'Client portal', 'AI Intelligence'],
    cta: 'Start free trial',
    accent: '#4a9eff',
    popular: true,
  },
  {
    name: 'Agency',
    price: { monthly: 99, annual: 79 },
    desc: 'For established agencies',
    features: ['Everything in Pro', 'Custom branding', 'Advanced analytics', 'Automation workflows', 'Priority support', 'Dedicated onboarding'],
    cta: 'Contact sales',
    accent: '#ff6b9d',
    popular: false,
  },
];

const FAQ_ITEMS = [
  { q: 'Is FlowOS really free to start?', a: 'Yes — our Starter plan is free forever for up to 5 team members and 3 active projects. No credit card required.' },
  { q: 'Can I import from ClickUp or Trello?', a: 'Yes. FlowOS supports CSV import from Trello and ClickUp, and we have a one-click migration tool. Your team can be up and running in minutes.' },
  { q: 'How does the client portal work?', a: 'Each client gets a branded portal to view project status, approve deliverables, leave feedback, and download reports — without access to your internal workspace.' },
  { q: 'Do you support Arabic?', a: 'Yes. FlowOS fully supports Arabic with RTL layout. Switch the interface language in your workspace settings.' },
  { q: 'Is my data secure?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We run regular security audits and never sell your data.' },
  { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime with no penalties. You keep access until the end of your billing period.' },
];

const TESTIMONIALS = [
  { stars: 5, quote: 'We replaced 6 tools with FlowOS. Our team went from chaos to clarity in one week.', name: 'Sarah Mitchell', role: 'Founder, Pulse Creative', color: '#7c6fe0' },
  { stars: 5, quote: 'The AI competitor analysis changed how we pitch. We walk into every meeting with a full market report.', name: 'Ahmed Al-Rashidi', role: 'CEO, Momentum Digital', color: '#4a9eff' },
  { stars: 5, quote: 'The content calendar and approval flow cut our review cycles in half. Incredible product.', name: 'Layla Hassan', role: 'Managing Director, Narrative Studio', color: '#ff6b9d' },
];

const SOCIAL_PROOF = [
  'Pulse Creative', 'Momentum Digital', 'Narrative Studio', 'Bright Side Digital',
  'Norte Agency', 'Vortex Media', 'Apex Creative', 'Nova Studios', 'Orbit Digital',
  'Catalyst Agency', 'Prism Creative', 'Zenith Media',
];

const STATS = [
  { value: '2,400+', label: 'Agencies', color: '#7c6fe0' },
  { value: '98%', label: 'Satisfaction', color: '#4a9eff' },
  { value: '6 tools', label: 'Replaced', color: '#ff6b9d' },
  { value: '4.9★', label: 'Rating', color: '#4caf82' },
];

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />}

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold gradient-text">FlowOS</span>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLogin(true)}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition"
              style={{ color: 'var(--text-muted)' }}>
              Sign in
            </button>
            <button onClick={() => setShowSignup(true)}
              className="text-sm font-bold px-5 py-2 rounded-xl text-white gradient-bg hover:opacity-90 transition">
              Start free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 text-center overflow-hidden">
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-orb-3" />
        <div className="grid-pattern absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 animate-fade-up-1"
            style={{ background: 'var(--purple-dim)', color: 'var(--purple-light)', border: '1px solid var(--purple)33' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--purple)' }} />
            Agency Management · Powered by AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up-2"
            style={{ letterSpacing: 'clamp(-1px, -0.03em, -2px)' }}>
            One platform to run{' '}
            <span className="gradient-text">your entire agency</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-up-3" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            Replace Trello, Slack, Notion, Harvest, and 3 more tools. FlowOS gives your team everything to manage projects, clients, content, and campaigns — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up-4">
            <button onClick={() => setShowSignup(true)}
              className="px-8 py-4 gradient-bg rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-xl w-full sm:w-auto"
              style={{ boxShadow: '0 0 40px rgba(124,111,224,0.3)' }}>
              Start for free →
            </button>
            <button onClick={() => setShowLogin(true)}
              className="px-8 py-4 rounded-2xl font-semibold text-base transition hover:opacity-80 w-full sm:w-auto"
              style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border-hover)' }}>
              Sign in to workspace
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-up-5">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof marquee ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>Trusted by agencies worldwide</p>
        <div className="marquee-container">
          <div className="animate-marquee">
            {[...SOCIAL_PROOF, ...SOCIAL_PROOF].map((name, i) => (
              <div key={i} className="flex items-center gap-2 px-8 text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--purple)' }} />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem → Solution ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Problem */}
          <div>
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: '#ef535022', color: '#ef5350' }}>😩 The Problem</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>You're running your agency on 6 different tools</h2>
            <div className="space-y-3">
              {['Trello for tasks', 'Slack for communication', 'Google Drive for files', 'Harvest for time tracking', 'Notion for docs', 'QuickBooks for invoices'].map(p => (
                <div key={p} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#ef535011', border: '1px solid #ef535022' }}>
                  <span style={{ color: '#ef5350' }}>✕</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Solution */}
          <div>
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: '#4caf8222', color: '#4caf82' }}>✨ The Solution</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>One workspace. Everything your agency needs.</h2>
            <div className="space-y-3">
              {['Tasks, projects & kanban', 'Real-time team chat', 'File management & docs', 'Time tracking & billing', 'Client portal & approvals', 'Invoicing & reporting'].map(s => (
                <div key={s} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#4caf8211', border: '1px solid #4caf8222' }}>
                  <span style={{ color: '#4caf82' }}>✓</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 reveal">
          <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: 'var(--purple-dim)', color: 'var(--purple-light)' }}>Everything you need</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>Built for ambitious agencies</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>9 powerful modules working together so your team never needs another tool.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`reveal p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl cursor-default`}
              style={{ background: 'var(--card)', border: `1px solid ${f.color}33` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: f.dim }}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>Get started in minutes</div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>How FlowOS works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="reveal text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4"
                  style={{ background: `${s.color}22`, color: s.color, border: `2px solid ${s.color}44` }}>
                  {s.num}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12 reveal">
          <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: '#ffc10722', color: '#ffc107' }}>Simple pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>Start free. Scale as you grow.</h2>
          {/* Billing toggle */}
          <div className="billing-toggle mt-6">
            <button className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')}>Monthly</button>
            <button className={billing === 'annual' ? 'active' : ''} onClick={() => setBilling('annual')}>
              Annual <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#4caf8222', color: '#4caf82' }}>-20%</span>
            </button>
          </div>
        </div>
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className="reveal rounded-2xl p-7 relative transition-all hover:-translate-y-1"
              style={{
                background: plan.popular ? `linear-gradient(135deg, ${plan.accent}18, ${plan.accent}08)` : 'var(--card)',
                border: `1px solid ${plan.popular ? plan.accent + '55' : 'var(--border)'}`,
                boxShadow: plan.popular ? `0 0 40px ${plan.accent}22` : undefined,
              }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white gradient-bg">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <p className="font-bold text-lg mb-1" style={{ color: plan.accent }}>{plan.name}</p>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black" style={{ color: 'var(--text)' }}>
                    ${plan.price[billing]}
                  </span>
                  {plan.price[billing] > 0 && <span className="text-sm pb-1" style={{ color: 'var(--text-muted)' }}>/mo</span>}
                </div>
              </div>
              <ul className="space-y-2.5 mb-7">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text)' }}>
                    <span className="font-bold" style={{ color: plan.accent }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowSignup(true)}
                className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90"
                style={{
                  background: plan.popular ? `linear-gradient(135deg, #7c6fe0, ${plan.accent})` : 'var(--surface)',
                  color: plan.popular ? 'white' : plan.accent,
                  border: `1px solid ${plan.accent}55`,
                }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: '#ff6b9d22', color: '#ff6b9d' }}>What teams say</div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>Agency leaders love FlowOS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="reveal rounded-2xl p-7"
                style={{ background: 'var(--card)', border: `1px solid ${t.color}33` }}>
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <span key={j} style={{ color: '#ffc107' }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text)' }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 gradient-bg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16 reveal">
          <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4" style={{ background: '#00c9b122', color: '#00c9b1' }}>FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>Common questions</h2>
        </div>
        <div className="space-y-1 reveal">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="w-full flex items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.q}</span>
                <span className="faq-icon text-xl flex-shrink-0" style={{ color: 'var(--text-muted)' }}>⌄</span>
              </button>
              <div className="faq-answer">
                <p className="text-sm leading-relaxed pb-5" style={{ color: 'var(--text-muted)' }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-24 text-center reveal">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-6" style={{ background: 'var(--purple-dim)', color: 'var(--purple-light)' }}>
            Limited time: Free Pro trial for first 100 agencies
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ color: 'var(--text)', lineHeight: '1.1' }}>
            Ready to run your agency like a{' '}
            <span className="gradient-text">pro?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>
            Join 2,400+ agencies already using FlowOS. Free forever on Starter, no card required.
          </p>
          <button onClick={() => setShowSignup(true)}
            className="inline-flex items-center gap-3 px-10 py-5 gradient-bg rounded-2xl text-white text-lg font-black hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(124,111,224,0.4)' }}>
            Create free workspace →
          </button>
          <p className="text-xs mt-4" style={{ color: 'var(--text-dim)' }}>No credit card · Takes 60 seconds</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '48px 24px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="footer-grid grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="text-xl font-black gradient-text mb-2">FlowOS</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                The all-in-one platform for marketing agencies.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm transition hover:opacity-100" style={{ color: 'var(--text-muted)' }}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>© 2026 FlowOS. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-3 sm:mt-0">
              {['Privacy', 'Terms', 'Cookies'].map(l => (
                <a key={l} href="#" className="text-xs transition hover:opacity-80" style={{ color: 'var(--text-dim)' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
