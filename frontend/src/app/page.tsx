'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   SHARED PRIMITIVES
───────────────────────────────────────────── */

function Icon3D({ name, size = 56 }: { name: string; size?: number }) {
  return (
    <img
      src={`/icons/3d/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      style={{
        width: size, height: size, objectFit: 'contain',
        filter: 'drop-shadow(0 0 18px rgba(91,108,255,0.45))',
        transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), filter 0.3s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.12) rotate(4deg)';
        (e.currentTarget as HTMLImageElement).style.filter = 'drop-shadow(0 0 28px rgba(91,108,255,0.75))';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1) rotate(0deg)';
        (e.currentTarget as HTMLImageElement).style.filter = 'drop-shadow(0 0 18px rgba(91,108,255,0.45))';
      }}
    />
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(91,108,255,0.12)',
      border: '1px solid rgba(91,108,255,0.35)',
      borderRadius: 100, padding: '5px 14px',
      fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
      textTransform: 'uppercase', color: '#818cf8',
    }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD MOCKUP
───────────────────────────────────────────── */
function DashboardMockup() {
  const tasks = [
    { label: 'Q2 Campaign Launch', prog: 72, color: '#6366f1' },
    { label: 'Client Onboarding', prog: 91, color: '#10b981' },
    { label: 'Brand Guidelines', prog: 45, color: '#f59e0b' },
    { label: 'Ad Creative Batch', prog: 28, color: '#ec4899' },
  ];
  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.7)',
      fontFamily: 'inherit',
      userSelect: 'none',
    }}>
      {/* Window chrome */}
      <div style={{ background: '#111827', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
        <div style={{ marginLeft: 'auto', fontSize: 11, color: '#475569' }}>tasksdone.cloud/dashboard</div>
      </div>

      <div style={{ display: 'flex', height: 380 }}>
        {/* Sidebar */}
        <div style={{ width: 52, background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 4 }}>
          {[
            { icon: '⚡', active: true },
            { icon: '✅', active: false },
            { icon: '📁', active: false },
            { icon: '💬', active: false },
            { icon: '📊', active: false },
            { icon: '🎨', active: false },
          ].map((item, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: 8,
              background: item.active ? 'rgba(99,102,241,0.2)' : 'transparent',
              borderLeft: item.active ? '2px solid #6366f1' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>{item.icon}</div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '16px 20px', background: 'linear-gradient(160deg, #0d1117 0%, #0f1623 100%)' }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { val: '12', label: 'Projects', color: '#6366f1' },
              { val: '38', label: 'Open Tasks', color: '#8b5cf6' },
              { val: '$24k', label: 'Revenue', color: '#10b981' },
              { val: '3', label: 'Overdue', color: '#ef4444' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${s.color}22`,
                borderBottom: `2px solid ${s.color}`,
                borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{s.val}</div>
                <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>ACTIVE PROJECTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.map((t, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: '#cbd5e1' }}>{t.label}</span>
                    <span style={{ fontSize: 10, color: t.color, fontWeight: 700 }}>{t.prog}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${t.prog}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}99)`, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI insight */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ fontSize: 18 }}>✨</div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#818cf8', letterSpacing: 1 }}>AI INSIGHT</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>3 tasks at risk this week — check Campaign Launch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 clamp(20px, 4vw, 60px)',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(15,23,42,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#5B6CFF,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>T</div>
        <span style={{ fontSize: 17, fontWeight: 800, background: 'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TasksDone</span>
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {['Features', 'Pricing', 'Docs'].map(l => (
          <a key={l} href="#" style={{ fontSize: 14, fontWeight: 600, color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#64748b'; }}
          >{l}</a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onLogin} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '6px 12px', transition: 'color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; }}
        >Sign In</button>
        <button onClick={onRegister} style={{ background: 'linear-gradient(135deg, #5B6CFF, #8b5cf6)', border: 'none', borderRadius: 10, padding: '8px 20px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.opacity = '0.88'; b.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.opacity = '1'; b.style.transform = 'scale(1)'; }}
        >Start Free</button>
      </div>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const proMonthly = 18, agencyMonthly = 38;
  const pro = cycle === 'monthly' ? proMonthly : Math.round(proMonthly * 0.83);
  const agency = cycle === 'monthly' ? agencyMonthly : Math.round(agencyMonthly * 0.83);

  const features = [
    { icon: 'ai',        title: 'AI Campaign Builder',  desc: 'Generate full campaigns in seconds. Brief → Strategy → Copy → Schedule. Your AI strategist works 24/7.',       color: '#f59e0b' },
    { icon: 'reports',   title: 'Smart Analytics',       desc: 'Real-time ROAS, CTR, and revenue tracking. Know what works before the client asks.',                           color: '#6366f1' },
    { icon: 'clients',   title: 'Client Portal',         desc: 'Branded portal for every client. Progress, approvals, invoices — no more status calls.',                       color: '#8b5cf6' },
    { icon: 'finance',   title: 'Finance & Invoicing',   desc: 'Professional invoices, expense tracking, and payment management. Get paid faster.',                            color: '#10b981' },
    { icon: 'tasks',     title: 'Task Management',        desc: 'Kanban, List, Calendar — all views. Subtasks, dependencies, and smart priorities baked in.',                  color: '#ec4899' },
    { icon: 'design',    title: 'Design Hub',            desc: 'Upload designs, pixel-precise comments, version history. Clients approve right in the portal.',                color: '#06b6d4' },
  ];

  const chaos = [
    { icon: 'scattered',    title: 'Lost across 6 apps',      desc: 'Trello. Notion. Slack. Drive. Harvest. Toggl. Every one a tab you\'ll forget to close.' },
    { icon: 'visibility',   title: 'Clients left in the dark', desc: 'They email. You explain. They email again. You\'re the bottleneck in your own business.' },
    { icon: 'clock-broken', title: 'Time leaking money',       desc: 'Hours untracked. Invoices late. Cash flow unpredictable. You\'re working hard, not smart.' },
  ];

  const steps = [
    { num: '01', title: 'Create your workspace', desc: 'Set up your agency in 2 minutes. Invite your team and import existing projects instantly.' },
    { num: '02', title: 'Connect your clients',  desc: 'Each client gets a branded portal with real-time progress and direct approval workflows.' },
    { num: '03', title: 'Execute at full speed', desc: 'Let AI handle strategy, automation handle reporting, and your team handle delivery.' },
  ];

  const faqs = [
    { q: 'Is it really free to start?',           a: 'Yes. The Free plan includes unlimited tasks, 2 active projects, and full core features. No credit card required. Upgrade when you\'re ready to scale.' },
    { q: 'Can I replace my current stack?',        a: 'Yes. TasksDone replaces Trello, Notion, Slack (for client comms), Harvest, and most invoicing tools. Most agencies cut 4–6 subscriptions on day one.' },
    { q: 'How does the Client Portal work?',       a: 'Every client gets their own branded link showing project progress, pending approvals, and invoices — without exposing your internal workspace.' },
    { q: 'What if I need to downgrade?',           a: 'No problem. Downgrade anytime. Your data is never deleted — files become read-only if you exceed the limit, nothing is lost.' },
    { q: 'Is there a mobile app?',                 a: 'Yes. Native iOS and Android with full feature parity — time tracking, chat, task management, and push notifications.' },
  ];

  return (
    <div style={{ background: '#0F172A', color: '#e2e8f0', fontFamily: "'Plus Jakarta Sans','Inter',-apple-system,sans-serif", overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes glow {
          from { box-shadow: 0 0 12px rgba(91,108,255,0.5), 0 0 24px rgba(91,108,255,0.2); }
          to   { box-shadow: 0 0 28px rgba(91,108,255,0.85), 0 0 56px rgba(91,108,255,0.38); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotateX(2deg); }
          50%      { transform: translateY(-12px) rotateX(0deg); }
        }
        .glow-btn { animation: glow 2.4s ease-in-out infinite alternate; }
        .float-ui { animation: float 5s ease-in-out infinite; transform-origin: center bottom; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: rgba(91,108,255,0.4); border-radius: 4px; }
      `}</style>

      {/* Cursor glow */}
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 0,
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,108,255,0.055) 0%, transparent 65%)',
        transform: `translate(${mouse.x - 350}px, ${mouse.y - 350}px)`,
        transition: 'transform 0.12s ease',
      }} />

      <Navbar onLogin={() => router.push('/login')} onRegister={() => router.push('/register')} />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px, 14vw, 160px) clamp(20px, 5vw, 80px) clamp(60px, 8vw, 100px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(91,108,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(91,108,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 50%, black 30%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', top: '12%', left: '10%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,108,255,0.12) 0%, transparent 70%)', filter: 'blur(48px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 1, width: '100%', maxWidth: 920 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 28 }}>
            <Badge>✦ The Agency OS That Actually Ships</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)', fontWeight: 900, lineHeight: 1.03, letterSpacing: '-0.035em', color: '#f8fafc', marginBottom: 0 }}
          >
            Stop managing<br />
            your agency.
            <br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 45%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Start running it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: '#94a3b8', maxWidth: 540, margin: '28px auto 40px', lineHeight: 1.75 }}
          >
            Replace 6 disconnected tools with one execution engine.
            Tasks, clients, campaigns, invoices, and AI — all working together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="glow-btn" onClick={() => router.push('/register')}
              style={{ background: 'linear-gradient(135deg, #5B6CFF, #8b5cf6)', border: 'none', borderRadius: 14, padding: '15px 34px', color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.01em', transition: 'transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)'; }}
            >Start for Free →</button>
            <button onClick={() => router.push('/login')}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '15px 32px', color: '#cbd5e1', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.1)'; b.style.borderColor = 'rgba(255,255,255,0.22)'; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.05)'; b.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >Sign In</button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ fontSize: 12, color: '#475569', marginTop: 18, letterSpacing: 0.3 }}>
            Free forever plan · No credit card required · Setup in 2 minutes
          </motion.p>
        </motion.div>

        {/* Dashboard float */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="float-ui"
          style={{ position: 'relative', zIndex: 1, marginTop: 64, width: '100%', maxWidth: 880 }}
        >
          <div style={{ position: 'absolute', bottom: -40, left: '12%', right: '12%', height: 80, background: 'radial-gradient(ellipse, rgba(91,108,255,0.32) 0%, transparent 70%)', filter: 'blur(18px)', zIndex: 0 }} />
          <DashboardMockup />
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          LOGO TICKER
      ══════════════════════════════════ */}
      <section style={{ padding: '26px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', background: 'rgba(255,255,255,0.012)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 90, background: 'linear-gradient(90deg, #0F172A, transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 90, background: 'linear-gradient(-90deg, #0F172A, transparent)', zIndex: 2 }} />
        <div style={{ display: 'flex', animation: 'ticker 24s linear infinite', width: 'max-content' }}>
          {[...Array(2)].flatMap(() =>
            ['Bolt Creative', 'Pulse Media', 'Nova Labs', 'Drift Agency', 'Apex Digital', 'Beam Studio', 'Surge Co', 'Orbit Agency', 'Flux Creative', 'Peak Media'].map((name, i) => (
              <span key={`${name}-${i}`} style={{ padding: '0 36px', fontSize: 13, fontWeight: 700, color: '#334155', letterSpacing: '0.05em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(91,108,255,0.45)', display: 'inline-block' }} />
                {name}
              </span>
            ))
          )}
        </div>
      </section>

      {/* ══════════════════════════════════
          CHAOS
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0d1117', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <Badge>⚡ The Real Problem</Badge>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f1f5f9', marginTop: 20, lineHeight: 1.08 }}>
                Your agency isn't broken.<br />
                <span style={{ color: '#f87171' }}>Your system is.</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: 15, maxWidth: 460, margin: '18px auto 0', lineHeight: 1.75 }}>
                Six tools that don't talk to each other. Six subscriptions bleeding money. Zero visibility for your clients.
              </p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {chaos.map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(248,113,113,0.12)', borderLeft: '3px solid rgba(248,113,113,0.45)', borderRadius: 16, padding: '28px 28px', transition: 'all 0.26s cubic-bezier(.22,1,.36,1)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-5px)'; el.style.background = 'rgba(248,113,113,0.04)'; el.style.borderLeftColor = 'rgba(248,113,113,0.75)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.background = 'rgba(255,255,255,0.02)'; el.style.borderLeftColor = 'rgba(248,113,113,0.45)'; }}
                >
                  <div style={{ marginBottom: 18 }}><Icon3D name={item.icon} size={52} /></div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f87171', marginBottom: 10, letterSpacing: '-0.02em' }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SYSTEM
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 5vw, 80px)', background: '#0F172A', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(91,108,255,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <Badge>🧠 The Solution</Badge>
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.4rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f8fafc', marginTop: 24, lineHeight: 1.05 }}>
              This is not a tool.
              <br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                This is your execution engine.
              </span>
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#94a3b8', maxWidth: 560, margin: '24px auto', lineHeight: 1.78 }}>
              One workspace where strategy becomes tasks, tasks become deliverables, and deliverables become invoices — automatically.
            </p>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 52 }}>
            {[
              { icon: 'projects', title: 'Unified Workspace', color: '#6366f1', bg: 'rgba(99,102,241,0.06)', items: ['Tasks & projects', 'Team chat', 'Time tracking', 'All in one place'] },
              { icon: 'clients',  title: 'Client Intelligence', color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)', items: ['Branded client portal', 'Invoicing & payments', 'Approval workflows', 'Real-time reporting'] },
              { icon: 'ai',       title: 'AI-Powered', color: '#06b6d4', bg: 'rgba(6,182,212,0.06)', items: ['Content generation', 'Competitor analysis', 'Campaign builder', 'Strategy automation'] },
            ].map((p, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div
                  style={{ background: p.bg, border: `1px solid ${p.color}28`, borderRadius: 18, padding: '28px 24px', textAlign: 'left', transition: 'transform 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = `0 20px 50px ${p.color}16`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: 18 }}><Icon3D name={p.icon} size={52} /></div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: p.color, marginBottom: 14, letterSpacing: '-0.02em' }}>{p.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {p.items.map((it, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, fontSize: 13, color: '#94a3b8' }}>
                        <span style={{ color: p.color, fontWeight: 700, fontSize: 11 }}>✓</span> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0d1117' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Badge>🚀 Features</Badge>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f1f5f9', marginTop: 20, lineHeight: 1.1 }}>
                Everything your agency needs.<br />Nothing it doesn't.
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            {features.map((f, i) => (
              <FadeUp key={i} delay={(i % 3) * 0.08}>
                <div
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 26px', transition: 'all 0.28s cubic-bezier(.22,1,.36,1)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-5px)'; el.style.borderColor = f.color + '44'; el.style.background = f.color + '0a'; el.style.boxShadow = `0 16px 40px ${f.color}12`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.025)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: 18 }}><Icon3D name={f.icon} size={54} /></div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: f.color, marginBottom: 10, letterSpacing: '-0.02em' }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          DEMO
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0F172A', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(91,108,255,0.065) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <Badge>👁️ Live Preview</Badge>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f8fafc', marginTop: 20, marginBottom: 14, lineHeight: 1.1 }}>
              This is what control feels like.
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 460, margin: '0 auto 56px', lineHeight: 1.75 }}>
              See your entire agency at a glance. No tabs. No context switching. One dashboard to run it all.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: -30, left: '14%', right: '14%', height: 60, background: 'radial-gradient(ellipse, rgba(91,108,255,0.35) 0%, transparent 70%)', filter: 'blur(15px)', zIndex: 0 }} />
              <DashboardMockup />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0d1117' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <Badge>⚡ Simple Process</Badge>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f1f5f9', marginTop: 20, lineHeight: 1.1 }}>
                Up and running in minutes.
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {steps.map((s, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: 'linear-gradient(135deg, rgba(91,108,255,0.18), rgba(139,92,246,0.14))',
                    border: '1px solid rgba(91,108,255,0.32)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: 22, fontWeight: 900, color: '#818cf8', position: 'relative',
                  }}>
                    {s.num}
                    <div style={{ position: 'absolute', inset: -5, borderRadius: 23, border: '1px solid rgba(91,108,255,0.12)' }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.02em' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
      <section style={{ padding: '64px clamp(20px, 5vw, 80px)', background: 'linear-gradient(135deg, rgba(91,108,255,0.08) 0%, rgba(139,92,246,0.06) 100%)', borderTop: '1px solid rgba(91,108,255,0.14)', borderBottom: '1px solid rgba(91,108,255,0.14)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { val: '2,400+', label: 'Agencies using TasksDone' },
            { val: '6 → 1', label: 'Tools replaced on average' },
            { val: '38%', label: 'More revenue per client' },
            { val: '4.9★', label: 'Average rating' },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.035em', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0F172A' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Badge>💬 Testimonials</Badge>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f8fafc', marginTop: 20 }}>
                Agencies that made the switch.
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { name: 'Sofia Martinez', role: 'Founder', co: 'Bolt Creative', color: '#8b5cf6', initials: 'SM', quote: 'We replaced 6 tools with TasksDone in one afternoon. Our team is faster, our clients are happier, and we invoice twice as fast.' },
              { name: 'James Okafor',   role: 'Operations Director', co: 'Pulse Media', color: '#6366f1', initials: 'JO', quote: 'The Client Portal alone is worth 10× the subscription. No more status email threads. Clients see progress in real time.' },
              { name: 'Yuki Tanaka',    role: 'Head of Growth',      co: 'Neon Agency', color: '#ec4899', initials: 'YT', quote: "TasksDone's AI built 3 campaign ideas we actually shipped. I can't imagine going back to 6 separate tools." },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 26px', transition: 'transform 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 16px 40px ${t.color}12`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ color: '#f59e0b', fontSize: 15, letterSpacing: 1, marginBottom: 16 }}>★★★★★</div>
                  <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.78, marginBottom: 24, fontStyle: 'italic' }}>"{t.quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{t.role}, {t.co}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRICING
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0d1117' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <FadeUp>
            <Badge>💰 Pricing</Badge>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f1f5f9', marginTop: 20, marginBottom: 14 }}>
              Pick your speed.
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 40 }}>Scale when you're ready. Cancel anytime.</p>
            {/* Toggle */}
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 4, marginBottom: 52, gap: 2 }}>
              {(['monthly', 'annual'] as const).map(c => (
                <button key={c} onClick={() => setCycle(c)} style={{ padding: '8px 22px', borderRadius: 9, border: 'none', background: cycle === c ? 'linear-gradient(135deg, #5B6CFF, #8b5cf6)' : 'transparent', color: cycle === c ? '#fff' : '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {c === 'monthly' ? 'Monthly' : 'Annual — save 17%'}
                </button>
              ))}
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { name: 'Free',   price: '$0',      period: 'forever', color: '#64748b', features: ['Unlimited tasks', '2 active projects', 'Client portal (1)', 'Team chat', '1 GB storage'], cta: 'Get started free', pop: false },
              { name: 'Pro',    price: `$${pro}`,  period: '/mo',     color: '#5B6CFF', features: ['Everything in Free', 'Unlimited projects', '10 clients', 'AI Campaign Builder', 'Finance & Invoicing', '50 GB storage'], cta: 'Start Pro →', pop: true },
              { name: 'Agency', price: `$${agency}`, period: '/mo',   color: '#8b5cf6', features: ['Everything in Pro', 'Unlimited clients', 'White-label portal', 'Custom domain', 'Priority support', '500 GB storage'], cta: 'Start Agency', pop: false },
            ].map((plan, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div
                  style={{
                    background: plan.pop ? 'linear-gradient(160deg, rgba(91,108,255,0.11), rgba(139,92,246,0.08))' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${plan.pop ? plan.color + '55' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 20, padding: '32px 28px', position: 'relative', textAlign: 'left',
                    transform: plan.pop ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    boxShadow: plan.pop ? `0 0 0 1px ${plan.color}25` : 'none',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 20px 50px ${plan.color}1a`; el.style.transform = plan.pop ? 'scale(1.05)' : 'scale(1.02)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = plan.pop ? `0 0 0 1px ${plan.color}25` : 'none'; el.style.transform = plan.pop ? 'scale(1.03)' : 'scale(1)'; }}
                >
                  {plan.pop && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #5B6CFF, #8b5cf6)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontSize: 13, fontWeight: 700, color: plan.color, marginBottom: 14, letterSpacing: 0.5 }}>{plan.name}</div>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 46, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.04em' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#94a3b8' }}>
                        <span style={{ width: 18, height: 18, borderRadius: 6, background: `${plan.color}20`, color: plan.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => router.push('/register')}
                    style={{ width: '100%', padding: '13px', background: plan.pop ? 'linear-gradient(135deg, #5B6CFF, #8b5cf6)' : 'rgba(255,255,255,0.06)', border: plan.pop ? 'none' : '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.84'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >{plan.cta}</button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 80px)', background: '#0F172A' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <Badge>❓ FAQ</Badge>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#f8fafc', marginTop: 20 }}>Questions answered.</h2>
            </div>
          </FadeUp>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${faqOpen === i ? 'rgba(91,108,255,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    style={{ width: '100%', padding: '18px 22px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{faq.q}</span>
                    <motion.span animate={{ rotate: faqOpen === i ? 45 : 0 }} transition={{ duration: 0.22 }}
                      style={{ fontSize: 22, color: faqOpen === i ? '#818cf8' : '#475569', flexShrink: 0, marginLeft: 16 }}>+</motion.span>
                  </button>
                  <AnimatePresence>
                    {faqOpen === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 22px 20px', fontSize: 14, color: '#64748b', lineHeight: 1.78 }}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA
      ══════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 5vw, 80px)', background: '#0d1117', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(91,108,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: 28 }}><Badge>🚀 Get Started</Badge></div>
            <h2 style={{ fontSize: 'clamp(2.4rem, 6.5vw, 4.6rem)', fontWeight: 900, letterSpacing: '-0.038em', color: '#f8fafc', lineHeight: 1.03, marginBottom: 24 }}>
              You don't need<br />more tools.
              <br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                You need control.
              </span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.75 }}>
              Join thousands of agencies that replaced chaos with clarity. Start free — no credit card, no setup fees.
            </p>
            <button className="glow-btn" onClick={() => router.push('/register')}
              style={{ background: 'linear-gradient(135deg, #5B6CFF, #8b5cf6)', border: 'none', borderRadius: 14, padding: '17px 44px', color: '#fff', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.01em', transition: 'transform 0.2s', display: 'inline-block' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)'; }}
            >Start for Free Now →</button>
            <p style={{ fontSize: 12, color: '#334155', marginTop: 18 }}>Free forever plan · No credit card · Cancel anytime</p>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer style={{ padding: 'clamp(40px, 5vw, 60px) clamp(20px, 5vw, 80px)', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0F172A' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#5B6CFF,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#fff' }}>T</div>
                <span style={{ fontSize: 17, fontWeight: 800, background: 'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TasksDone</span>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75 }}>The agency OS that actually ships. Replace 6 tools with one execution engine.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Docs', 'Help Center', 'Contact', 'Status'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', letterSpacing: '1.8px', textTransform: 'uppercase', marginBottom: 14 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map((link, j) => (
                    <a key={j} href="#" style={{ fontSize: 13, color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#818cf8'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#475569'; }}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <p style={{ fontSize: 12, color: '#334155' }}>© 2026 TasksDone. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy', 'Terms', 'Cookies'].map((l, i) => (
                <a key={i} href="#" style={{ fontSize: 12, color: '#334155', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
