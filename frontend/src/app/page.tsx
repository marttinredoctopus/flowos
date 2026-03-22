'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Brain, BarChart3, FileText,
  ChevronDown, Star, Sparkles, CheckCircle2, X,
  FolderKanban, CalendarDays, Receipt, TrendingUp, Rocket, Users,
} from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

/* ── FadeUp ──────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── Dashboard Mockup ────────────────────────────────────────── */
function DashboardMockup() {
  const tasks = [
    { name: 'Brand redesign proposal', pct: 65, color: '#6366f1' },
    { name: 'Q3 content calendar',     pct: 90, color: '#8b5cf6' },
    { name: 'Client onboarding flow',  pct: 100, color: '#10b981' },
    { name: 'Ad campaign analysis',    pct: 40, color: '#f59e0b' },
  ];
  const stats = [
    { label: 'Projects', value: '24', delta: '+3', color: '#6366f1' },
    { label: 'MRR',      value: '$48k', delta: '+18%', color: '#10b981' },
    { label: 'Tasks',    value: '137', delta: '-12', color: '#8b5cf6' },
    { label: 'Clients',  value: '31', delta: '+5', color: '#06b6d4' },
  ];
  return (
    <div style={{ background: '#0c0d1a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 0 60px rgba(99,102,241,0.12), 0 40px 80px rgba(0,0,0,0.5)', width: '100%', maxWidth: 540 }}>
      <div style={{ background: '#07080f', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        {['#f43f5e','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 8 }}>TasksDone — Dashboard</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.03)', margin: '10px 10px 0' }}>
        {stats.map((s,i) => (
          <div key={i} style={{ background: '#111228', padding: '10px 12px', borderRadius: i===0?'7px 0 0 7px':i===3?'0 7px 7px 0':0 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f2f9' }}>{s.value}</div>
            <div style={{ fontSize: 9, color: s.color, marginTop: 2 }}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 10px 4px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Active Tasks</div>
        {tasks.map((t,i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#111228', borderRadius: 7, marginBottom: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
            <div style={{ width: 56, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', width: 24, textAlign: 'right' }}>{t.pct}%</span>
          </div>
        ))}
      </div>
      <div style={{ margin: '6px 10px 10px', padding: '10px 12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.16)', borderRadius: 9, display: 'flex', gap: 9 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={11} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>AI Insight</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Acme Corp invoice overdue 7 days — send reminder?</div>
        </div>
      </div>
    </div>
  );
}

/* ── Feature Card ────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <div
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 22px', transition: 'border-color 0.2s,transform 0.2s,background 0.2s' }}
      onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor='rgba(99,102,241,0.25)'; d.style.transform='translateY(-3px)'; d.style.background='rgba(99,102,241,0.03)'; }}
      onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor='rgba(255,255,255,0.06)'; d.style.transform='translateY(0)'; d.style.background='rgba(255,255,255,0.02)'; }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={18} color={color} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ── FAQ Item ────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.5 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={16} color="rgba(255,255,255,0.4)" /></motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, paddingBottom: 20, margin: 0 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Pricing Card ────────────────────────────────────────────── */
function PricingCard({ plan, price, annualPrice, features, highlighted, billing, cta }: {
  plan: string; price: number; annualPrice: number; features: string[];
  highlighted?: boolean; billing: 'monthly' | 'annual'; cta?: string;
}) {
  const router = useRouter();
  const display = billing === 'annual' ? annualPrice : price;
  const savings = price > 0 ? Math.round((1 - annualPrice / price) * 100) : 0;
  return (
    <div
      style={{ background: highlighted ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${highlighted ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '32px 28px', position: 'relative', boxShadow: highlighted ? '0 0 50px rgba(99,102,241,0.1)' : 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
    >
      {highlighted && (
        <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.05em' }}>MOST POPULAR</span>
        </div>
      )}
      <p style={{ fontSize: 12, fontWeight: 700, color: highlighted ? '#818cf8' : 'rgba(255,255,255,0.4)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 14px' }}>{plan}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', alignSelf: 'flex-start', marginTop: 8 }}>$</span>
        <span style={{ fontSize: 44, fontWeight: 800, color: '#f1f2f9', letterSpacing: '-0.03em', lineHeight: 1 }}>{display}</span>
        {price > 0 && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', paddingBottom: 6 }}>/mo</span>}
      </div>
      {billing === 'annual' && savings > 0 && <p style={{ fontSize: 12, color: '#10b981', marginBottom: 4 }}>Save {savings}% annually</p>}
      {price === 0 && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 0 }}>Free forever</p>}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <CheckCircle2 size={14} color={highlighted ? '#6366f1' : '#10b981'} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
      <button onClick={() => router.push('/register')} style={{ width: '100%', padding: '13px', borderRadius: 10, background: highlighted ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)', border: highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: highlighted ? '0 0 24px rgba(99,102,241,0.3)' : 'none', transition: 'opacity 0.2s' }}>
        {cta || (price === 0 ? 'Start Free' : 'Get Started')}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <div style={{ background: '#06070d', minHeight: '100vh', color: '#f1f2f9', fontFamily: 'Inter,-apple-system,sans-serif' }}>
      <LandingNav />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% -10%,rgba(99,102,241,0.11),transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 40, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, color: '#818cf8', fontWeight: 600 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
                The operating system for modern agencies
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1 style={{ fontSize: 'clamp(38px,6vw,72px)', fontWeight: 900, lineHeight: 1.08, textAlign: 'center', letterSpacing: '-0.03em', margin: '0 0 24px' }}>
              Run your agency<br />
              <span style={{ background: 'linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                without the chaos
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Projects, clients, tasks, invoices, content, and AI — all in one place. Replace 6 disconnected tools with one platform built for agencies.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <button
                onClick={() => router.push('/register')}
                style={{ padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 0 32px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.15s,box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 0 44px rgba(99,102,241,0.55)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 0 32px rgba(99,102,241,0.4)'; }}
              >
                Start Free — No credit card <ArrowRight size={15} />
              </button>
              <button
                onClick={() => router.push('/login')}
                style={{ padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color='#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.7)'; }}
              >
                Sign In
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>Free 14-day trial · No credit card · Cancel anytime</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 64 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(ellipse at center,rgba(99,102,241,0.07),transparent 70%)', pointerEvents: 'none' }} />
                <DashboardMockup />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── LOGO BAR ─────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Trusted by teams at</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            {['Horizon Media','Apex Creative','Nova Agency','Orbit Studios','Pulse Digital'].map((name,i) => (
              <span key={i} style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.13)', letterSpacing: '-0.01em' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>The problem</p>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>Your tools are fighting each other</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                You're paying for Asana, Notion, Slack, HubSpot, and QuickBooks — and still losing track of everything.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
              {['Client updates buried in Slack threads','Invoices in one tool, tasks in another','No single view of all project status','AI tools disconnected from your workflow'].map((item,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 10, background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.12)' }}>
                  <X size={14} color="#f43f5e" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 6-FEATURE GRID ───────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Everything in one place</p>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>One platform for your entire operation</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
                TasksDone replaces the tools you're duct-taping together — with one clean, fast platform.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="feature-grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              <FeatureCard icon={FolderKanban} color="#6366f1" title="Project Management" desc="Kanban boards, timelines, and task dependencies built for multi-client agencies." />
              <FeatureCard icon={Users} color="#8b5cf6" title="Client Management" desc="Full client profiles, portals, and communication history. Never lose context." />
              <FeatureCard icon={CalendarDays} color="#06b6d4" title="Content Calendar" desc="Plan and schedule content for all clients from one drag-and-drop calendar." />
              <FeatureCard icon={Brain} color="#a855f7" title="AI Intelligence" desc="Generate campaigns, write copy, analyze competitors — all inside your workflow." />
              <FeatureCard icon={Receipt} color="#10b981" title="Invoicing & Finance" desc="Create invoices, track expenses, and see your agency cash flow in real time." />
              <FeatureCard icon={BarChart3} color="#f59e0b" title="Analytics & Reports" desc="Real-time dashboards: project progress, team utilization, and revenue trends." />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SHOWCASE 1: Projects ─────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div className="feature-2col" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <FadeUp>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 20 }}>
                <FolderKanban size={12} color="#818cf8" /><span style={{ fontSize: 11, color: '#818cf8', fontWeight: 600, letterSpacing: '0.05em' }}>PROJECTS</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 16, lineHeight: 1.2 }}>Every project, every client — always on track</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 24 }}>Switch between Kanban, list, and timeline views. Set milestones, track blockers, and send automated progress reports to clients.</p>
              {['Kanban, List & Timeline views','Client-facing project portals','Automated status reports','Task dependencies & blockers'].map((f,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <CheckCircle2 size={13} color="#6366f1" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{f}</span>
                </div>
              ))}
              <button onClick={() => router.push('/register')} style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', cursor: 'pointer', transition: 'all 0.2s' }}>
                Try free <ArrowRight size={13} />
              </button>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
              {[{name:'Q3 Campaign',client:'Acme Corp',pct:72,color:'#6366f1'},{name:'Website Redesign',client:'Nova Inc',pct:45,color:'#8b5cf6'},{name:'Social Strategy',client:'Orbit Co',pct:90,color:'#10b981'}].map((p,i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: i<2?'1px solid rgba(255,255,255,0.05)':'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{p.name}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.client}</div></div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SHOWCASE 2: Finance ──────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="feature-2col" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <FadeUp delay={0.05}>
            <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 16, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>This month</div><div style={{ fontSize: 32, fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em' }}>$24,800</div></div>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} color="#10b981" /></div>
              </div>
              {[{label:'Acme Corp — Retainer',amount:'$4,500',status:'Paid',sc:'#10b981'},{label:'Nova Inc — Project',amount:'$8,200',status:'Sent',sc:'#f59e0b'},{label:'Orbit Studios — Design',amount:'$2,100',status:'Draft',sc:'#6366f1'}].map((inv,i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i<2?'1px solid rgba(255,255,255,0.05)':'none' }}>
                  <div><div style={{ fontSize: 12, color: '#e2e8f0', marginBottom: 2 }}>{inv.label}</div><span style={{ fontSize: 10, color: inv.sc, padding: '2px 7px', borderRadius: 4, background: `${inv.sc}15`, fontWeight: 600 }}>{inv.status}</span></div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{inv.amount}</span>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
                <Receipt size={12} color="#10b981" /><span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, letterSpacing: '0.05em' }}>FINANCE</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 16, lineHeight: 1.2 }}>Get paid faster, track every dollar</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 24 }}>Create professional invoices in seconds, auto-send reminders, and see your agency's cash flow at a glance.</p>
              {['One-click invoice creation','Automated payment reminders','Expense tracking & reports','Multi-currency support'].map((f,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{f}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── AI SECTION ───────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>AI Intelligence</p>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>Your agency's AI co-pilot</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>AI that knows your clients, projects, and workflows — so you can move 3× faster.</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="feature-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              <FeatureCard icon={Sparkles} color="#a855f7" title="Campaign Builder" desc="Generate full campaign plans with tasks, timelines, and deliverables from one sentence." />
              <FeatureCard icon={FileText} color="#6366f1" title="Content Generator" desc="Write social posts, email sequences, and ad copy tailored to each client's voice." />
              <FeatureCard icon={TrendingUp} color="#06b6d4" title="Competitor Analysis" desc="Research competitors, surface gaps, and find opportunities clients can act on today." />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 16 }}>{[1,2,3,4,5].map(i => <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />)}</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.025em' }}>Agencies love TasksDone</h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="feature-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {[
                {name:'Sarah K.',role:'Agency Director @ Horizon',quote:'We replaced Asana, Notion, and QuickBooks. Saved $800/mo and our team actually uses it.'},
                {name:'Marco R.',role:'Creative Director @ Apex',quote:'The AI campaign builder saves my team 6+ hours every week. It\'s like having an extra strategist.'},
                {name:'Priya M.',role:'Founder @ Nova Agency',quote:'The client portal made us look 10× more professional. Clients stopped asking for status updates.'},
              ].map((t,i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 22px' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>{[1,2,3,4,5].map(j => <Star key={j} size={11} color="#f59e0b" fill="#f59e0b" />)}</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 16 }}>"{t.quote}"</p>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{t.role}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Pricing</p>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.15 }}>Simple, transparent pricing</h2>
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4 }}>
                {(['monthly','annual'] as const).map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{ padding: '8px 20px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: billing===b?'rgba(99,102,241,0.2)':'transparent', color: billing===b?'#818cf8':'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>
                    {b==='monthly'?'Monthly':'Annual'}
                  </button>
                ))}
              </div>
              {billing==='annual' && <p style={{ fontSize: 12, color: '#10b981', marginTop: 10 }}>Save up to 20% with annual billing</p>}
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              <PricingCard plan="Starter" price={0} annualPrice={0} billing={billing} cta="Start Free"
                features={['Up to 5 team members','3 projects','5 clients','Task & Kanban boards','Basic reporting','Email support']} />
              <PricingCard plan="Pro" price={49} annualPrice={39} billing={billing} highlighted cta="Start Pro Trial"
                features={['Everything in Starter','Up to 25 team members','Unlimited projects & clients','Content Calendar','Invoicing & Finance','Client Portal','AI Intelligence (100/mo)','Priority support']} />
              <PricingCard plan="Enterprise" price={149} annualPrice={119} billing={billing} cta="Talk to Sales"
                features={['Everything in Pro','Unlimited team members','White-label branding','Public API & Webhooks','Ads API integration','AI Intelligence (1000/mo)','Dedicated support']} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.025em', textAlign: 'center', marginBottom: 48 }}>Common questions</h2>
          </FadeUp>
          <FadeUp delay={0.05}>
            {[
              {q:'Can I import data from my existing tools?',a:'Yes. TasksDone supports imports from Asana, Trello, Notion, and CSV. Your data migrates in minutes, not days.'},
              {q:'Does my team need training to use it?',a:'Most teams are productive on day one. We include onboarding walkthroughs and live support for all plans.'},
              {q:'Is my data secure?',a:'All data is encrypted at rest and in transit (AES-256, TLS 1.3). SOC 2 Type II compliant with 99.9% uptime SLA.'},
              {q:'Can I white-label it for clients?',a:'Yes — white-label branding is available on Enterprise. Add your logo, custom domain, and brand colors.'},
              {q:'What happens when my trial ends?',a:'You\'ll be notified 3 days before and moved to the free Starter plan. No surprise charges, ever.'},
            ].map((item,i) => <FAQItem key={i} q={item.q} a={item.a} />)}
          </FadeUp>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <FadeUp>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 0 40px rgba(99,102,241,0.35)' }}>
              <Rocket size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 18, lineHeight: 1.1 }}>Ready to run a better agency?</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginBottom: 40, lineHeight: 1.7 }}>Join hundreds of agencies who moved from chaos to clarity. Start free today — no credit card needed.</p>
            <button
              onClick={() => router.push('/register')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 0 40px rgba(99,102,241,0.4)', transition: 'transform 0.15s,box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 0 56px rgba(99,102,241,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 0 40px rgba(99,102,241,0.4)'; }}
            >
              Start Free <ArrowRight size={16} />
            </button>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>Free forever on Starter · 14-day Pro trial · No credit card</p>
          </FadeUp>
        </div>
      </section>

      <LandingFooter />

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .feature-grid-6, .feature-grid-3, .pricing-grid { grid-template-columns: repeat(2,1fr) !important; }
          .feature-2col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .pain-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .feature-grid-6, .feature-grid-3, .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
