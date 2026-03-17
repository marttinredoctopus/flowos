'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/auth/AuthModal';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '✦', label: 'Task Management', color: '#6366f1', desc: 'Kanban boards, list views, subtasks, priorities, assignees, due dates and custom tags — all in one place.' },
  { icon: '◈', label: 'Project Tracker', color: '#a855f7', desc: 'Plan milestones, set project-level deadlines, track progress and keep teams aligned without the chaos.' },
  { icon: '◉', label: 'Team Chat', color: '#22d3ee', desc: 'Real-time channels, direct messages, file sharing and threaded replies — no more switching to Slack.' },
  { icon: '◆', label: 'Finance Hub', color: '#10b981', desc: 'Invoices, expense tracking, budget overviews and revenue reports built for growing businesses.' },
  { icon: '◇', label: 'CRM & Clients', color: '#f59e0b', desc: 'Track contacts, deals, pipeline stages and client portals. Your sales funnel without the bloat.' },
  { icon: '○', label: 'Content Calendar', color: '#f43f5e', desc: 'Plan and schedule social posts, blogs and campaigns. Drag to reschedule, filter by platform.' },
  { icon: '□', label: 'Design Hub', color: '#8b5cf6', desc: 'Asset library with Cloudflare R2 storage, brand guidelines, design briefs and feedback pins.' },
  { icon: '△', label: 'AI Assistant', color: '#06b6d4', desc: 'Claude-powered drafting, task suggestions, meeting summaries and smart automations across the whole OS.' },
  { icon: '▷', label: 'Analytics', color: '#84cc16', desc: 'Revenue charts, team velocity, project health scores and custom dashboards — data you can act on.' },
];

const STEPS = [
  { n: '01', title: 'Create your workspace', desc: 'Sign up free. Set your org name, invite teammates and you are live in under two minutes.' },
  { n: '02', title: 'Add projects & tasks', desc: 'Create projects, break them into tasks, assign owners and set due dates. Kanban or list — your choice.' },
  { n: '03', title: 'Collaborate in real-time', desc: 'Chat, comment on tasks, share files and get AI suggestions as your team works together.' },
  { n: '04', title: 'Ship faster, grow smarter', desc: 'Track finances, manage clients, analyse performance and scale — all without leaving FlowOS.' },
];

const PRICING = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    color: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.1)',
    badge: null as string | null,
    features: ['Up to 5 members', '3 active projects', 'Task management', 'Basic chat', '5 GB storage', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: 19,
    color: 'linear-gradient(160deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
    border: 'rgba(99,102,241,0.4)',
    badge: 'Most Popular' as string | null,
    features: ['Up to 25 members', 'Unlimited projects', 'Full task + kanban', 'Finance & CRM', '50 GB storage', 'AI assistant (100 calls/mo)', 'Priority support'],
    cta: 'Start 14-day trial',
  },
  {
    name: 'Agency',
    monthlyPrice: 79,
    annualPrice: 59,
    color: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    badge: null as string | null,
    features: ['Unlimited members', 'Unlimited projects', 'Client portals', 'White-label options', '500 GB storage', 'Unlimited AI calls', 'Dedicated account manager', 'Custom integrations'],
    cta: 'Contact sales',
  },
];

const FAQ = [
  { q: 'Can I use FlowOS for free?', a: 'Yes — the Starter plan is free forever with up to 5 members and 3 active projects. No credit card required.' },
  { q: 'How does the AI assistant work?', a: 'FlowOS uses Claude (Anthropic) to draft content, summarise meetings, suggest task priorities and automate repetitive work. Pro gets 100 calls/month; Agency is unlimited.' },
  { q: 'Can I migrate from Trello, Asana or Notion?', a: 'We support CSV import for tasks and projects. Direct integrations with Trello and Asana are on our roadmap for Q3.' },
  { q: 'Is my data secure?', a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Files are stored on Cloudflare R2 with private access controls. We never sell your data.' },
  { q: 'Can clients access FlowOS?', a: 'Yes. Pro and Agency plans include a read-only client portal that can be shared with external stakeholders without giving them full account access.' },
  { q: 'What happens after the trial?', a: 'After your 14-day trial ends you drop to the Starter plan automatically — no unexpected charges. Upgrade any time to restore Pro features.' },
];

const STATS = [
  { value: '12k+', label: 'Teams using FlowOS' },
  { value: '3.2M', label: 'Tasks completed' },
  { value: '98%', label: 'Customer satisfaction' },
  { value: '40%', label: 'Faster project delivery' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  const open = (mode: 'login' | 'signup') => setAuthMode(mode);

  return (
    <div style={{ background: '#07080f', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0f1117}::-webkit-scrollbar-thumb{background:#2d2f3e;border-radius:3px}
        a{color:inherit;text-decoration:none}
        input,button,textarea,select{font-family:inherit}
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        .outfit{font-family:'Outfit',system-ui,sans-serif}
        .hover-lift{transition:transform 0.2s,box-shadow 0.2s}
        .hover-lift:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,0.4)}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse-glow{0%,100%{opacity:0.6}50%{opacity:1}}
      `}</style>

      {/* ── NAVBAR ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,8,15,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="outfit" style={{ fontWeight: 800, fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>F</span>
            FlowOS
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {['Features', 'How it works', 'Pricing', 'FAQ'].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >{label}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => open('login')}
              style={{ padding: '0.5rem 1.2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >Sign in</button>
            <button
              onClick={() => open('signup')}
              style={{ padding: '0.5rem 1.2rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}
            >Get started free</button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: '7rem 1.5rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse-glow 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse-glow 5s ease-in-out infinite 1s' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: 100, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 600, marginBottom: '1.75rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
            Now in public beta — join 12,000+ teams
          </div>

          <h1 className="outfit" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            One OS for your<br />
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>entire business</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.22rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 2.5rem' }}>
            Tasks, projects, chat, finance, CRM, content calendar, design hub and AI — all connected in a single workspace. Stop juggling 8 tools.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => open('signup')} style={{ padding: '0.9rem 2.2rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
              Start for free →
            </button>
            <button onClick={() => open('login')} style={{ padding: '0.9rem 2.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer' }}>
              Sign in
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Free forever plan · No credit card required · Setup in 2 min</p>
        </div>

        {/* App mockup */}
        <div style={{ maxWidth: 960, margin: '4rem auto 0', animation: 'float 6s ease-in-out infinite' }}>
          <div style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 100px rgba(0,0,0,0.7), 0 0 80px rgba(99,102,241,0.12)' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
              <span style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>flowos.app/dashboard</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', minHeight: 360 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {['Dashboard','Tasks','Projects','Chat','Finance','CRM','Content','Design'].map((item, i) => (
                  <div key={item} style={{ padding: '0.45rem 0.75rem', borderRadius: 7, fontSize: '0.8rem', fontWeight: 500, background: i === 1 ? 'rgba(99,102,241,0.15)' : 'transparent', color: i === 1 ? '#818cf8' : 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: i === 1 ? '#6366f1' : 'rgba(255,255,255,0.15)' }} />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[{ label: 'Total tasks', val: '142', color: '#6366f1' },{ label: 'In progress', val: '38', color: '#f59e0b' },{ label: 'Completed', val: '94', color: '#10b981' },{ label: 'Overdue', val: '10', color: '#f43f5e' }].map((s) => (
                    <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.25rem' }}>{s.label}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Design new homepage mockups','Review Q4 budget proposal','Set up client onboarding flow','Push API v2 to production'].map((t, i) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${['#6366f1','#10b981','#f59e0b','#6366f1'][i]}`, background: i === 1 ? '#10b981' : 'transparent', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: i === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', textDecoration: i === 1 ? 'line-through' : 'none', flex: 1 }}>{t}</span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 100, background: ['rgba(99,102,241,0.15)','rgba(16,185,129,0.15)','rgba(245,158,11,0.15)','rgba(239,68,68,0.15)'][i], color: ['#818cf8','#6ee7b7','#fcd34d','#fca5a5'][i] }}>
                        {['Design','Done','Finance','Dev'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {STATS.map(({ value, label }) => (
            <Reveal key={label}>
              <div className="outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{value}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem' }}>{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700, marginBottom: '1rem' }}>Everything you need</div>
            <h2 className="outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Nine powerful modules.<br /><span style={{ color: 'rgba(255,255,255,0.4)' }}>One monthly price.</span>
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map(({ icon, label, color, desc }, i) => (
              <Reveal key={label} delay={i * 60}>
                <div className="hover-lift" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.75rem', cursor: 'default' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.3rem', color }}>
                    {icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{label}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '6rem 1.5rem', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700, marginBottom: '1rem' }}>Getting started</div>
            <h2 className="outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Up and running in minutes</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 28, top: 52, bottom: 52, width: 1, background: 'linear-gradient(to bottom, #6366f1, transparent)', opacity: 0.3 }} />
            {STEPS.map(({ n, title, desc }, i) => (
              <Reveal key={n} delay={i * 100}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#818cf8', flexShrink: 0 }}>
                    {n}
                  </div>
                  <div style={{ paddingTop: '0.75rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.4rem' }}>{title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, fontSize: '0.92rem' }}>{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 1050, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700, marginBottom: '1rem' }}>Pricing</div>
            <h2 className="outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>Simple, transparent pricing</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: 100 }}>
              <button onClick={() => setAnnual(false)} style={{ padding: '0.4rem 1.1rem', borderRadius: 100, border: 'none', cursor: 'pointer', background: !annual ? '#fff' : 'transparent', color: !annual ? '#07080f' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>Monthly</button>
              <button onClick={() => setAnnual(true)} style={{ padding: '0.4rem 1.1rem', borderRadius: 100, border: 'none', cursor: 'pointer', background: annual ? '#fff' : 'transparent', color: annual ? '#07080f' : 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Annual
                <span style={{ padding: '1px 7px', borderRadius: 100, background: '#6366f1', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>-35%</span>
              </button>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {PRICING.map(({ name, monthlyPrice, annualPrice, color, border, badge, features, cta }, i) => (
              <Reveal key={name} delay={i * 80}>
                <div style={{ background: color, border: `1px solid ${border}`, borderRadius: 20, padding: '2rem', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {badge && (
                    <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '0 0 10px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{badge}</div>
                  )}
                  <div className="outfit" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', marginTop: badge ? '0.5rem' : 0 }}>{name}</div>
                  <div style={{ marginBottom: '1.75rem' }}>
                    <span className="outfit" style={{ fontSize: '2.8rem', fontWeight: 900 }}>${annual ? annualPrice : monthlyPrice}</span>
                    {(annual ? annualPrice : monthlyPrice) > 0
                      ? <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>/mo</span>
                      : <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}> forever</span>}
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, marginBottom: '2rem' }}>
                    {features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)' }}>
                        <span style={{ color: '#10b981', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => open('signup')}
                    style={{ width: '100%', padding: '0.8rem', background: i === 1 ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.08)', border: i === 1 ? 'none' : '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                  >{cta}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '6rem 1.5rem', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700, marginBottom: '1rem' }}>FAQ</div>
            <h2 className="outfit" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Frequently asked questions</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ.map(({ q, a }, i) => (
              <Reveal key={i} delay={i * 50}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '1.1rem 1.5rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', textAlign: 'left' }}
                  >
                    {q}
                    <span style={{ color: '#818cf8', fontSize: '1.2rem', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7 }}>{a}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <Reveal>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 className="outfit" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.1 }}>
              Ready to run your<br />
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>business on one OS?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Join thousands of teams that replaced 5+ tools with FlowOS. Start free — no credit card, no time limit on the Starter plan.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => open('signup')} style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
                Create free workspace
              </button>
              <button onClick={() => open('login')} style={{ padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer' }}>
                Sign in
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="outfit" style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>F</span>
            FlowOS
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Security', 'Status', 'Blog'].map((item) => (
              <span key={item} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >{item}</span>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.2)' }}>© 2025 FlowOS · All rights reserved</p>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
    </div>
  );
}
