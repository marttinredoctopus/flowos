'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Zap, Users, BarChart3, Brain,
  FileText, Clock, Target, Megaphone, CreditCard, Shield,
  ChevronDown, Star, TrendingUp, Layers, Sparkles, Play,
  CheckCheck, X, Menu,
} from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

/* ── Helpers ─────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Dashboard Mockup ────────────────────────────────────────── */
function DashboardMockup() {
  const tasks = [
    { name: 'Brand redesign proposal', status: 'In Progress', color: '#6366f1', pct: 65 },
    { name: 'Q3 content calendar', status: 'Review', color: '#8b5cf6', pct: 90 },
    { name: 'Client onboarding flow', status: 'Done', color: '#10b981', pct: 100 },
    { name: 'Ad campaign analysis', status: 'In Progress', color: '#f59e0b', pct: 40 },
  ];
  const stats = [
    { label: 'Active Projects', value: '24', delta: '+3', color: '#6366f1' },
    { label: 'Revenue (MRR)', value: '$48.2k', delta: '+18%', color: '#10b981' },
    { label: 'Open Tasks', value: '137', delta: '-12', color: '#8b5cf6' },
    { label: 'Clients', value: '31', delta: '+5', color: '#06b6d4' },
  ];
  return (
    <div style={{
      background: '#0c0d1a',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5)',
      fontFamily: 'Inter, sans-serif',
      width: '100%',
      maxWidth: 560,
    }}>
      {/* Title bar */}
      <div style={{ background: '#070810', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>TasksDone — Agency Dashboard</span>
      </div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.04)', margin: '12px 12px 0' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#111228', padding: '12px 14px', borderRadius: i === 0 ? '8px 0 0 8px' : i === 3 ? '0 8px 8px 0' : 0 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f2f9' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: s.color, marginTop: 2 }}>{s.delta}</div>
          </div>
        ))}
      </div>
      {/* Tasks */}
      <div style={{ padding: '12px 12px 4px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Active Tasks</div>
        {tasks.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#111228', borderRadius: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', width: 20, textAlign: 'right' }}>{t.pct}%</span>
            </div>
          </div>
        ))}
      </div>
      {/* AI Widget */}
      <div style={{ margin: '8px 12px 12px', padding: '12px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={12} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>AI Suggestion</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Acme Corp invoice is 7 days overdue. Send a reminder?</div>
        </div>
      </div>
    </div>
  );
}

/* ── Pricing Card ─────────────────────────────────────────────── */
function PricingCard({ plan, price, annualPrice, features, highlighted, billing }: {
  plan: string; price: number; annualPrice: number; features: string[];
  highlighted?: boolean; billing: 'monthly' | 'annual';
}) {
  const router = useRouter();
  const displayPrice = billing === 'annual' ? annualPrice : price;
  return (
    <div style={{
      background: highlighted ? 'rgba(99,102,241,0.08)' : 'var(--card)',
      border: `1px solid ${highlighted ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 16, padding: '28px 28px 32px', position: 'relative',
      boxShadow: highlighted ? '0 0 40px rgba(99,102,241,0.12)' : 'none',
      display: 'flex', flexDirection: 'column',
    }}>
      {highlighted && (
        <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
            MOST POPULAR
          </span>
        </div>
      )}
      <div style={{ fontSize: 13, fontWeight: 700, color: highlighted ? '#8b5cf6' : 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        {plan}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>${displayPrice}</span>
        <span style={{ fontSize: 14, color: 'var(--text-2)' }}>/mo</span>
      </div>
      {billing === 'annual' && price > 0 && (
        <p style={{ fontSize: 12, color: '#10b981', marginBottom: 20 }}>Save ${(price - annualPrice) * 12}/yr</p>
      )}
      {!(billing === 'annual' && price > 0) && <div style={{ marginBottom: 20 }} />}
      <button
        onClick={() => router.push(price === 0 ? '/register' : '/register?plan=' + plan.toLowerCase())}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          background: highlighted ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)',
          color: '#fff', border: highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer', marginBottom: 24,
          boxShadow: highlighted ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
      >
        {price === 0 ? 'Start Free' : 'Get Started'}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ Item ─────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', padding: '20px 0', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', gap: 16,
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={18} color="var(--text-2)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  const SOLUTION_CARDS = [
    { icon: <Target size={22} color="#6366f1" />, title: 'Know exactly what your team is doing', desc: 'Live task boards, time tracking, and project timelines — always up to date.' },
    { icon: <Users size={22} color="#8b5cf6" />, title: 'Impress clients on every touchpoint', desc: 'Branded client portals with real-time updates. No more status emails.' },
    { icon: <Megaphone size={22} color="#06b6d4" />, title: 'Run campaigns without the chaos', desc: 'Track ads, content calendars, and campaign performance in one view.' },
    { icon: <CreditCard size={22} color="#10b981" />, title: 'Track and grow your revenue', desc: 'Invoices, expenses, reports, and MRR — all connected to your work.' },
    { icon: <Brain size={22} color="#f59e0b" />, title: 'Let AI do the heavy lifting', desc: 'Generate campaign ideas, analyze competitors, and get intelligent alerts.' },
  ];

  const TESTIMONIALS = [
    { name: 'Marcus Webb', role: 'CEO, Webb Digital Agency', avatar: 'MW', text: 'We replaced Asana, Notion, and Stripe Invoicing with TasksDone in one week. We\'re saving 12 hours per week per team member.', result: 'Saved 12h/week' },
    { name: 'Sarah Kim', role: 'Media Buyer, GrowthFuel', avatar: 'SK', text: 'The AI campaign builder is insane. I used to spend 3 hours building briefs — now it takes 10 minutes. Our ROAS went up 34%.', result: '+34% ROAS' },
    { name: 'Diego Morales', role: 'Founder, DM Creative', avatar: 'DM', text: 'As a solo freelancer scaling into an agency, the client portal alone was worth it. Clients love it and churn dropped dramatically.', result: '-60% Churn' },
  ];

  const PAIN_POINTS = [
    'You\'re switching between 6 tools just to get one project done.',
    'You don\'t know what your team is actually working on right now.',
    'Clients keep asking for updates you don\'t have at your fingertips.',
    'Your revenue is scattered across spreadsheets and email threads.',
    'You\'re working harder than ever but the business isn\'t scaling.',
  ];

  const OBJECTIONS = [
    { q: 'Is it complicated to set up?', a: 'Setup takes less than 10 minutes. Import your projects, invite your team, and you\'re live. We\'ll migrate your data from Asana, Notion, Monday, and more for free.' },
    { q: 'Isn\'t it too expensive?', a: 'TasksDone replaces at least 5 tools. If you\'re paying for Asana ($12/user), Notion ($8/user), FreshBooks ($25/mo), Loomly ($30/mo), and HubSpot ($50/mo), you\'re already spending 3–5x more.' },
    { q: 'Will my team actually use it?', a: 'We designed for real agency workflows — not enterprise complexity. 94% of teams are fully adopted within 2 weeks. Most say it\'s the first tool their team actually loves.' },
    { q: 'What if I want to cancel?', a: 'Cancel anytime, no questions asked. Export your data in one click. We don\'t hold your data hostage — that\'s just the right thing to do.' },
    { q: 'Is my data secure?', a: 'SOC 2 compliant, AES-256 encrypted, hosted on AWS with 99.99% uptime SLA. Your data stays yours, always.' },
  ];

  const FEATURE_SECTIONS = [
    {
      badge: 'PROJECT MANAGEMENT',
      title: 'Finally know what your team is actually doing',
      desc: 'Kanban boards, Gantt charts, time tracking, and sprint planning — all in one place. No more "where is that task?" conversations.',
      bullets: ['Drag-and-drop kanban & list views', 'Time tracking with billing reports', 'Automated status updates to clients', 'Deadline alerts & workload balancing'],
      color: '#6366f1',
      mockup: (
        <div style={{ background: '#111228', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
          {['Brand Identity — Acme Corp', 'SEO Audit — TechVenture', 'Social Campaign — NovaFit'].map((name, i) => {
            const colors = ['#6366f1', '#8b5cf6', '#10b981'];
            const pcts = [72, 38, 91];
            const statuses = ['In Progress', 'Planning', 'Review'];
            return (
              <div key={i} style={{ padding: '12px 14px', background: '#0c0d1a', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#f1f2f9', fontWeight: 500 }}>{name}</span>
                  <span style={{ fontSize: 11, color: colors[i], background: `${colors[i]}20`, padding: '2px 8px', borderRadius: 6 }}>{statuses[i]}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pcts[i]}%`, height: '100%', background: `linear-gradient(90deg,${colors[i]},${colors[i]}aa)`, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{pcts[i]}% complete</div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      badge: 'FINANCE',
      title: 'Track every dollar. Grow your revenue.',
      desc: 'Invoices, expenses, and financial reports that connect directly to your projects. Know your MRR, outstanding payments, and profit margins at a glance.',
      bullets: ['One-click invoice generation', 'Expense tracking with categories', 'MRR & revenue dashboards', 'Overdue payment alerts'],
      color: '#10b981',
      mockup: (
        <div style={{ background: '#111228', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[{ l: 'MRR', v: '$48,240', c: '#10b981', d: '+18%' }, { l: 'Outstanding', v: '$12,400', c: '#f59e0b', d: '3 invoices' }].map((s, i) => (
              <div key={i} style={{ background: '#0c0d1a', padding: 14, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{s.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f2f9' }}>{s.v}</div>
                <div style={{ fontSize: 11, color: s.c, marginTop: 4 }}>{s.d}</div>
              </div>
            ))}
          </div>
          {['Acme Corp · $4,200 · Paid', 'TechVenture · $2,800 · Sent', 'NovaFit · $1,500 · Overdue'].map((inv, i) => {
            const colors = ['#10b981', '#6366f1', '#f43f5e'];
            const labels = ['Paid', 'Sent', 'Overdue'];
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: '#0c0d1a', borderRadius: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{inv.split(' · ')[0]} · {inv.split(' · ')[1]}</span>
                <span style={{ fontSize: 11, color: colors[i], background: `${colors[i]}20`, padding: '2px 8px', borderRadius: 6 }}>{labels[i]}</span>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      badge: 'COLLABORATION',
      title: 'Your team, your clients — finally in sync',
      desc: 'Real-time chat, client portals, file sharing, and meeting notes. Stop losing context across email threads and Slack messages.',
      bullets: ['Branded client portal access', 'Real-time team chat & mentions', 'File storage (up to 1TB)', 'Video meeting notes & summaries'],
      color: '#8b5cf6',
      mockup: (
        <div style={{ background: '#111228', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ marginBottom: 12 }}>
            {[
              { name: 'Sarah K.', msg: 'Draft is ready for review', time: '2m ago', color: '#8b5cf6' },
              { name: 'Marcus W.', msg: 'Client approved the proposal 🎉', time: '18m ago', color: '#6366f1' },
              { name: 'Diego M.', msg: 'Invoice #047 has been sent', time: '1h ago', color: '#10b981' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${m.color}30`, border: `1px solid ${m.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: m.color, flexShrink: 0 }}>
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f2f9' }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{m.time}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{m.msg}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#0c0d1a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            Message the team...
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNav />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 100, paddingBottom: 80 }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)', top: -200, left: '50%', transform: 'translateX(-60%)', animation: 'glow-pulse 7s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.09), transparent 70%)', top: 150, right: -100 }} />
          <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)', bottom: 0, left: -80 }} />
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)', backgroundSize: '72px 72px', opacity: 0.6 }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
            {/* LEFT */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s infinite' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6' }}>Trusted by 2,400+ agencies worldwide</span>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.035em', marginBottom: 20, color: 'var(--text)' }}>
                Stop juggling tools.<br />
                <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Run your agency.
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
                style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 28, maxWidth: 480 }}>
                Tasks, clients, campaigns, invoices, and AI — all connected in one system built for real agencies.
              </motion.p>

              {/* Mini benefits */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                {['Save 10+ hours/week', 'Replace 5+ tools', 'Close clients faster'].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCheck size={15} color="#10b981" />
                    <span style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => router.push('/register')} style={{
                  padding: '14px 28px', borderRadius: 11, fontSize: 15, fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 28px rgba(99,102,241,0.4)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(99,102,241,0.55)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(99,102,241,0.4)'; }}
                >
                  Start Free <ArrowRight size={16} />
                </button>
                <button onClick={() => router.push('/contact')} style={{
                  padding: '14px 24px', borderRadius: 11, fontSize: 15, fontWeight: 600,
                  background: 'transparent', color: 'var(--text)',
                  border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.22)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <Play size={15} fill="currentColor" /> Book a Demo
                </button>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 14 }}>
                No credit card required · Setup in 10 minutes · Cancel anytime
              </motion.p>
            </div>

            {/* RIGHT — dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 40, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', justifyContent: 'center' }}
              className="hero-mockup"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <DashboardMockup />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>
            Trusted by growth-focused agencies
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
            {['Apex Media', 'GrowthFuel', 'NovaCreative', 'Bolt Agency', 'Prism Labs', 'Velocity Co'].map((name, i) => (
              <span key={i} style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN SECTION ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sound familiar?</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: 'var(--text)' }}>
              Running an agency is chaos.
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 520, margin: '14px auto 0', lineHeight: 1.65 }}>
              You started your agency to do great work — not to manage spreadsheets, chase invoices, and babysit tools.
            </p>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {PAIN_POINTS.map((p, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div style={{
                padding: '22px 24px', background: 'rgba(244,63,94,0.04)',
                border: '1px solid rgba(244,63,94,0.12)', borderRadius: 12,
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(244,63,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <X size={14} color="#f43f5e" />
                </div>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{p}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── SOLUTION SECTION ────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The solution</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: 'var(--text)' }}>
                One system to run everything.
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 520, margin: '14px auto 0', lineHeight: 1.65 }}>
                Stop paying for 5 separate tools. TasksDone brings every workflow under one roof, so nothing falls through the cracks.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {SOLUTION_CARDS.map((card, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div style={{
                  padding: '24px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>{card.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE SHOWCASE ────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Built for agencies</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: 'var(--text)' }}>
              Every workflow. One platform.
            </h2>
          </div>
        </FadeUp>

        {FEATURE_SECTIONS.map((section, i) => (
          <FadeUp key={i} delay={0.05}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
              marginBottom: 100,
            }} className="feature-grid">
              {/* Text goes left on even, right on odd */}
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: section.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.badge}</span>
                <h3 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginTop: 12, marginBottom: 14, lineHeight: 1.2 }}>
                  {section.title}
                </h3>
                <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 24 }}>{section.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {section.bullets.map((b, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: `${section.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={12} color={section.color} />
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{b}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/features')} style={{
                  marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 7,
                  fontSize: 14, fontWeight: 600, color: section.color, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'gap 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.gap = '10px'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.gap = '7px'}
                >
                  Learn more <ArrowRight size={15} />
                </button>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>{section.mockup}</div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* ── AI SECTION ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, borderTop: '1px solid rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.1)' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 20 }}>
                <Sparkles size={14} color="#a78bfa" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>Powered by AI</span>
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.15 }}>
                Your AI-powered<br />agency assistant
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 500, margin: '18px auto 0', lineHeight: 1.65 }}>
                Let AI handle the thinking — while you focus on strategy and growth.
              </p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { icon: <Sparkles size={20} color="#8b5cf6" />, title: 'Generate campaign ideas', desc: 'Instantly create ad concepts, messaging angles, and creative briefs for any niche.', color: '#8b5cf6' },
              { icon: <TrendingUp size={20} color="#06b6d4" />, title: 'Analyze competitors', desc: 'Pull competitor ad data and strategies. Know exactly what\'s working in your market.', color: '#06b6d4' },
              { icon: <Brain size={20} color="#f59e0b" />, title: 'Get intelligent suggestions', desc: 'AI surfaces overdue invoices, underperforming campaigns, and team bottlenecks proactively.', color: '#f59e0b' },
              { icon: <FileText size={20} color="#10b981" />, title: 'Write faster, better', desc: 'Generate proposals, emails, reports, and client updates in seconds.', color: '#10b981' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div style={{
                  padding: '24px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
                  backdropFilter: 'blur(10px)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div style={{ textAlign: 'center', marginTop: 44 }}>
              <button onClick={() => router.push('/register')} style={{
                padding: '13px 28px', borderRadius: 11, fontSize: 15, fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 0 28px rgba(99,102,241,0.35)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Sparkles size={16} /> Let AI do the thinking
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Social proof</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: 'var(--text)' }}>
              Agencies love TasksDone
            </h2>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div style={{
                padding: '28px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, display: 'flex', flexDirection: 'column', height: '100%',
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, marginBottom: 20, flex: 1 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.role}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8 }}>{t.result}</span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── OBJECTION HANDLING (FAQ) ─────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                What's stopping you?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-2)', marginTop: 12 }}>We've heard every objection. Here's the truth.</p>
            </div>
          </FadeUp>
          {OBJECTIONS.map((item, i) => (
            <FadeUp key={i} delay={i * 0.04}>
              <FAQItem q={item.q} a={item.a} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simple pricing</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: 'var(--text)' }}>
              Start free. Upgrade when ready.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-2)', marginTop: 12, marginBottom: 28 }}>Cancel anytime. No hidden fees.</p>
            {/* Billing toggle */}
            <div style={{ display: 'inline-flex', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: 4 }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{
                  padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                  background: billing === b ? 'var(--surface)' : 'none',
                  color: billing === b ? 'var(--text)' : 'var(--text-2)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: billing === b ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                  {b === 'annual' && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.12)', padding: '1px 7px', borderRadius: 10 }}>SAVE 20%</span>}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }} className="pricing-grid">
          <FadeUp delay={0}>
            <PricingCard plan="Starter" price={0} annualPrice={0} billing={billing}
              features={['Up to 5 team members', 'Up to 3 projects', 'Up to 5 clients', 'Task & Kanban boards', 'Basic reporting', 'Email support']} />
          </FadeUp>
          <FadeUp delay={0.06}>
            <PricingCard plan="Pro" price={49} annualPrice={39} billing={billing} highlighted
              features={['Everything in Starter', 'Up to 25 team members', 'Unlimited projects & clients', 'Content Calendar', 'Ad Campaign Tracker', 'Time Tracking & Invoices', 'Client Portal', 'AI Intelligence (100/mo)', 'Priority support']} />
          </FadeUp>
          <FadeUp delay={0.12}>
            <PricingCard plan="Enterprise" price={149} annualPrice={119} billing={billing}
              features={['Everything in Pro', 'Unlimited team members', 'White-label branding', 'Public API + Webhooks', 'Facebook & Google Ads API', 'AI Intelligence (1000/mo)', 'Dedicated support', 'Custom integrations']} />
          </FadeUp>
        </div>
        <FadeUp delay={0.1}>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-3)', marginTop: 32 }}>
            Need a custom plan for large agencies?{' '}
            <Link href="/contact" style={{ color: 'var(--indigo)', textDecoration: 'none', fontWeight: 600 }}>Talk to us →</Link>
          </p>
        </FadeUp>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <FadeUp>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 24, padding: 'clamp(40px, 6vw, 64px)',
              boxShadow: '0 0 80px rgba(99,102,241,0.1)',
            }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.15, marginBottom: 18 }}>
                Ready to take control<br />of your agency?
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-2)', marginBottom: 36, lineHeight: 1.65 }}>
                Join 2,400+ agencies already using TasksDone. Start free — no credit card needed.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => router.push('/register')} style={{
                  padding: '15px 32px', borderRadius: 11, fontSize: 16, fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 32px rgba(99,102,241,0.45)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 44px rgba(99,102,241,0.6)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(99,102,241,0.45)'; }}
                >
                  Start Free <ArrowRight size={17} />
                </button>
                <button onClick={() => router.push('/contact')} style={{
                  padding: '15px 28px', borderRadius: 11, fontSize: 16, fontWeight: 600,
                  background: 'transparent', color: 'var(--text)',
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.28)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >
                  Book a Demo
                </button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 20 }}>
                No credit card · 14-day Pro trial · Cancel anytime
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      <LandingFooter />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-mockup { order: -1; }
          .feature-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .feature-grid > div { order: unset !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}
