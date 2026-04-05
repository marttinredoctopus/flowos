'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckSquare, CalendarDots, ChartLine, ChatCircle,
  Timer, Sparkle, Users, PaintBrush, Lightning,
  Receipt, Globe, BookOpen, ArrowRight, Check,
  Star, Rocket, ShieldCheck, Database,
  CaretDown, Megaphone, Kanban, MagnifyingGlass,
  TrendUp, Target, Files, Gear, Bell, X,
} from '@phosphor-icons/react';

/* ── Feature + plan data ──────────────────────────────────── */
const FEATURES = [
  { Icon: CheckSquare, label: 'Task Management',   color: '#7030EF', to: '#DB1FFF', desc: 'Kanban, List, Calendar & Timeline' },
  { Icon: CalendarDots,label: 'Content Calendar',  color: '#00D4FF', to: '#7030EF', desc: 'Plan across all platforms' },
  { Icon: ChartLine,   label: 'Ad Campaigns',      color: '#00E5A0', to: '#00D4FF', desc: 'Track ROAS, CTR & CPC live' },
  { Icon: ChatCircle,  label: 'Team Chat',          color: '#FFB547', to: '#FF7A30', desc: 'Project-linked conversations' },
  { Icon: Timer,       label: 'Time Tracking',      color: '#00D4FF', to: '#7030EF', desc: 'One-click timers & invoices' },
  { Icon: Sparkle,     label: 'AI Intelligence',    color: '#DB1FFF', to: '#7030EF', desc: 'Competitor analysis & ideas' },
  { Icon: Users,       label: 'Client Portal',      color: '#00E5A0', to: '#00D4FF', desc: 'Real-time client visibility' },
  { Icon: PaintBrush,  label: 'Design Hub',         color: '#FF4D6A', to: '#FF7A30', desc: 'Upload, review & approve' },
];

const PLANS = [
  {
    id: 'free', name: 'Free', monthly: 0, annual: 0,
    desc: 'For freelancers getting started',
    storage: '1 GB', file: '10 MB', popular: false,
    features: ['5 clients','3 team members','3 projects','Basic Kanban','1 GB storage','Community support'],
  },
  {
    id: 'pro', name: 'Pro', monthly: 29, annual: 24,
    desc: 'For growing agencies',
    storage: '20 GB', file: '100 MB', popular: true,
    features: ['Unlimited clients','15 team members','All views','Content calendar','Time tracking','Client portal','100 AI req/mo','20 GB storage','Priority support'],
  },
  {
    id: 'agency', name: 'Agency', monthly: 59, annual: 49,
    desc: 'For large agencies',
    storage: '100 GB', file: '500 MB', popular: false,
    features: ['Everything in Pro','Unlimited members','Unlimited AI','White-label','Public API','100 GB storage','Dedicated manager'],
  },
];

/* ── Sidebar mock items ───────────────────────────────────── */
const MOCK_NAV = [
  { Icon: Kanban,       label: 'Dashboard', active: true  },
  { Icon: CheckSquare,  label: 'Tasks',     active: false },
  { Icon: Files,        label: 'Projects',  active: false },
  { Icon: Users,        label: 'Clients',   active: false },
  { Icon: CalendarDots, label: 'Content',   active: false },
  { Icon: Sparkle,      label: 'AI Tools',  active: false },
];

export default function LandingPage() {
  const router = useRouter();
  const [scrollY,        setScrollY]        = useState(0);
  const [cycle,          setCycle]          = useState<'monthly'|'annual'>('monthly');
  const [faqOpen,        setFaqOpen]        = useState<number|null>(null);
  const [activeFeature,  setActiveFeature]  = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const scrolled = scrollY > 20;

  return (
    <div style={{
      background: '#08080F',
      color: '#E8E8F2',
      fontFamily: 'var(--font-body, "DM Sans"), sans-serif',
      overflowX: 'hidden',
    }}>

      {/* ── Announcement bar ──────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #7030EF, #DB1FFF)',
        padding: '9px 20px', textAlign: 'center',
        fontSize: 13, color: 'rgba(255,255,255,0.95)', fontWeight: 500,
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <Rocket size={14} color="#fff" weight="fill" style={{ flexShrink: 0 }} />
        <span>TasksDone is live — The OS for modern marketing agencies.</span>
        <button onClick={() => router.push('/register')} style={{
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)',
          color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 12px',
          borderRadius: 100, cursor: 'pointer',
        }}>Start free →</button>
      </div>

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, height: 62,
        display: 'flex', alignItems: 'center', padding: '0 48px',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,15,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(112,48,239,0.15)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg,#7030EF,#DB1FFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(112,48,239,0.45)',
          }}>
            <CheckSquare size={18} color="#fff" weight="fill" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif',
            fontWeight: 800, fontSize: 19, color: 'white', letterSpacing: '-0.03em',
          }}>
            Tasks<span style={{ background: 'linear-gradient(135deg,#A580FF,#DB1FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Done</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: 'Features', href: '/features' },
            { label: 'Pricing',  href: '/pricing'  },
            { label: 'Blog',     href: '/blog'     },
            { label: 'Docs',     href: '/docs'     },
          ].map(item => (
            <Link key={item.label} href={item.href}
              style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '7px 13px', borderRadius: 9, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
            >{item.label}</Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/login"
            style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
          >Log in</Link>
          <Link href="/register"
            style={{ padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 18px rgba(112,48,239,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(112,48,239,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(112,48,239,0.4)'; }}
          >
            <Rocket size={14} weight="fill" />
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '95vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 50% at 50% -5%, rgba(112,48,239,0.22) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 1, height: '55%', background: 'linear-gradient(180deg, rgba(219,31,255,0.45) 0%, transparent 100%)', left: '50%', top: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.018, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '7px 16px 7px 8px', borderRadius: 100, background: 'rgba(112,48,239,0.12)', border: '1px solid rgba(112,48,239,0.3)', animation: 'fadeUp 0.6s ease both' }}>
          <span style={{ background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkle size={10} weight="fill" /> NEW
          </span>
          <span style={{ fontSize: 13, color: '#C480FF', fontWeight: 500 }}>AI-powered competitor analysis is here →</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 'clamp(40px, 7.5vw, 86px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.045em', maxWidth: 920, marginBottom: 24, animation: 'fadeUp 0.6s 0.1s ease both' }}>
          Stop juggling tools.<br />
          <span style={{ background: 'linear-gradient(135deg, #C480FF 0%, #DB1FFF 50%, #FF4D6A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Start getting things done.
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.48)', maxWidth: 540, lineHeight: 1.75, marginBottom: 16, animation: 'fadeUp 0.6s 0.2s ease both' }}>
          TasksDone is the all-in-one operating system for modern marketing agencies.
          Replace 6 tools with one platform your whole team will love.
        </p>

        {/* Replacing pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.6s 0.25s ease both' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>Replacing:</span>
          {['Trello','ClickUp','Notion','Slack','Harvest','Monday'].map(t => (
            <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '3px 10px', borderRadius: 6, textDecoration: 'line-through', textDecorationColor: 'rgba(255,255,255,0.18)' }}>{t}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.6s 0.3s ease both' }}>
          <button onClick={() => router.push('/register')} style={{ padding: '15px 36px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #7030EF, #DB1FFF)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 36px rgba(112,48,239,0.45)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 50px rgba(112,48,239,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(112,48,239,0.45)'; }}>
            <Rocket size={16} weight="fill" />
            Start for free — no card needed
          </button>
          <button onClick={() => router.push('/login')} style={{ padding: '15px 30px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.82)', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
            Sign in to workspace <ArrowRight size={15} />
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', animation: 'fadeUp 0.6s 0.35s ease both' }}>
          Free forever · No credit card · Setup in 5 minutes
        </p>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22, animation: 'fadeUp 0.6s 0.4s ease both' }}>
          <div style={{ display: 'flex' }}>
            {['#7030EF','#DB1FFF','#00D4FF','#00E5A0','#FF4D6A'].map((c,i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${c},${c}BB)`, border: '2px solid #08080F', marginLeft: i>0?-9:0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>
                {['S','A','M','K','R'][i]}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_,i) => <Star key={i} size={13} color="#FFB547" weight="fill" />)}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Loved by 2,400+ agencies</div>
          </div>
        </div>

        {/* APP MOCKUP */}
        <div style={{ marginTop: 72, width: '100%', maxWidth: 980, position: 'relative', animation: 'fadeUp 0.8s 0.5s ease both' }}>
          <div style={{ position: 'absolute', inset: -80, borderRadius: 50, background: 'radial-gradient(ellipse, rgba(112,48,239,0.22) 0%, transparent 65%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(112,48,239,0.1)' }}>
            {/* Window chrome */}
            <div style={{ background: '#0E0E14', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: '4px 14px', fontSize: 12, color: 'rgba(255,255,255,0.22)', textAlign: 'center', maxWidth: 280, margin: '0 auto' }}>
                app.tasksdone.cloud/dashboard
              </div>
            </div>
            {/* App UI */}
            <div style={{ background: '#0B0B0F', display: 'flex', height: 400 }}>
              {/* Sidebar */}
              <div style={{ width: 180, background: '#0E0E14', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '14px 10px', flexShrink: 0 }}>
                {/* Logo in mock */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 8px', marginBottom: 16 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckSquare size={13} color="#fff" weight="fill" />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'white' }}>Tasks<span style={{ background: 'linear-gradient(135deg,#A580FF,#DB1FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Done</span></span>
                </div>
                {MOCK_NAV.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, marginBottom: 2, fontSize: 12, background: item.active ? 'rgba(112,48,239,0.18)' : 'transparent', color: item.active ? '#C480FF' : 'rgba(255,255,255,0.35)', fontWeight: item.active ? 600 : 400, transition: 'all 0.15s' }}>
                    <item.Icon size={14} weight={item.active ? 'fill' : 'regular'} color={item.active ? '#C480FF' : 'rgba(255,255,255,0.35)'} />
                    {item.label}
                  </div>
                ))}
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: '18px 20px', overflowY: 'hidden' }}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
                  {[
                    { l: 'PROJECTS',   v: '12', from: '#7030EF', to: '#DB1FFF' },
                    { l: 'OPEN TASKS', v: '48', from: '#00E5A0', to: '#00D4FF' },
                    { l: 'DUE TODAY', v: '5',  from: '#FFB547', to: '#FF7A30' },
                    { l: 'TEAM',       v: '8',  from: '#00D4FF', to: '#7030EF' },
                  ].map(s => (
                    <div key={s.l} style={{ background: `${s.from}12`, border: `1px solid ${s.from}25`, borderRadius: 10, padding: '10px 12px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.from},${s.to})`, opacity: 0.7 }} />
                      <div style={{ fontSize: 8, color: s.from, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>{s.l}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                {/* Kanban board */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {[
                    { col: 'To Do',       color: '#4B4B6A', tasks: ['SEO Audit','Write Ad Copy','Research'] },
                    { col: 'In Progress', color: '#7030EF', tasks: ['Ramadan Campaign','Meta Ads'] },
                    { col: 'In Review',   color: '#FFB547', tasks: ['Q1 Report'] },
                    { col: 'Done',        color: '#00E5A0', tasks: ['Brand Guide','Logo Design'] },
                  ].map(col => (
                    <div key={col.col} style={{ background: `${col.color}08`, border: `1px solid ${col.color}18`, borderRadius: 9, padding: 9 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.col}</span>
                      </div>
                      {col.tasks.map(t => (
                        <div key={t} style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `2px solid ${col.color}80`, borderRadius: 5, padding: '5px 7px', marginBottom: 4, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{t}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 48px', display: 'flex', justifyContent: 'center', gap: 72, flexWrap: 'wrap', background: 'rgba(112,48,239,0.03)' }}>
        {[
          { value: '2,400+', label: 'Agencies worldwide', Icon: Globe,       color: '#A580FF' },
          { value: '98%',    label: 'Satisfaction rate',  Icon: Star,        color: '#00E5A0' },
          { value: '6×',     label: 'Tools replaced',     Icon: Lightning,   color: '#DB1FFF' },
          { value: '4.9★',   label: 'Average rating',     Icon: ShieldCheck, color: '#FFB547' },
        ].map(s => (
          <div key={s.label} className="reveal" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.Icon size={18} color={s.color} weight="fill" />
            </div>
            <div style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 36, fontWeight: 900, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A580FF', marginBottom: 14, background: 'rgba(112,48,239,0.1)', padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(112,48,239,0.2)' }}>
            <Sparkle size={11} weight="fill" /> Everything you need
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.035em', marginBottom: 16 }}>
            Built for agencies,<br />
            <span style={{ color: 'rgba(255,255,255,0.28)' }}>not generic teams</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto' }}>
            Every feature designed for how marketing agencies actually work.
          </p>
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, border: '1px solid rgba(112,48,239,0.12)', borderRadius: 22, overflow: 'hidden' }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              onMouseEnter={() => setActiveFeature(i)}
              style={{
                padding: '28px 24px',
                background: activeFeature === i
                  ? `linear-gradient(135deg, ${f.color}12, ${f.to}08)`
                  : 'rgba(255,255,255,0.01)',
                borderRight: (i+1)%4!==0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderBottom: i<4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'all 0.25s',
                cursor: 'default',
                position: 'relative',
              }}
            >
              {/* Active bottom line */}
              {activeFeature === i && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.color}, ${f.to})` }} />
              )}
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: activeFeature===i ? `linear-gradient(135deg, ${f.color}, ${f.to})` : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14, transition: 'all 0.25s',
                boxShadow: activeFeature===i ? `0 8px 24px ${f.color}40` : 'none',
              }}>
                <f.Icon size={21} color={activeFeature===i ? '#fff' : 'rgba(255,255,255,0.45)'} weight={activeFeature===i ? 'fill' : 'regular'} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: activeFeature===i ? 'white' : 'rgba(255,255,255,0.65)', marginBottom: 6, fontFamily: 'var(--font-display)', transition: 'color 0.2s' }}>{f.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55 }}>{f.desc}</div>
              {activeFeature===i && (
                <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: f.color }}>
                  Explore <ArrowRight size={11} weight="bold" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: '80px 48px', background: 'rgba(112,48,239,0.03)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 900, letterSpacing: '-0.025em' }}>Loved by agency teams</h2>
        </div>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
          {[
            { quote: '"TasksDone replaced 5 different tools we were paying for. Our team is 3x more productive and clients are happier."', name: 'Sarah M.', role: 'CEO, Apex Creative', from: '#7030EF', to: '#DB1FFF' },
            { quote: '"The client portal is a game changer. No more "what\'s the update?" emails. Clients log in and see everything."', name: 'Ahmed K.', role: 'Founder, Norte Agency', from: '#00D4FF', to: '#7030EF' },
            { quote: '"We saved 20 hours a month from the time tracking and invoicing features alone. Worth every penny."', name: 'Maria L.', role: 'Ops Director, Vortex Media', from: '#00E5A0', to: '#00D4FF' },
          ].map((t,i) => (
            <div
              key={i}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 26, transition: 'all 0.22s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${t.from}35`; e.currentTarget.style.background = `${t.from}06`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_,j) => <Star key={j} size={14} color="#FFB547" weight="fill" />)}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>{t.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${t.from},${t.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', flexShrink: 0 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 48px', maxWidth: 980, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A580FF', marginBottom: 14, background: 'rgba(112,48,239,0.1)', padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(112,48,239,0.2)' }}>
            <Receipt size={11} weight="fill" /> Pricing
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 14 }}>Simple, honest pricing</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15 }}>No hidden fees. No per-seat surprises. Cancel anytime.</p>
        </div>

        {/* Billing toggle */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 4, display: 'inline-flex', gap: 4 }}>
            {['monthly','annual'].map(opt => (
              <button key={opt} onClick={() => setCycle(opt as any)} style={{ padding: '9px 24px', borderRadius: 11, border: 'none', cursor: 'pointer', background: cycle===opt ? 'linear-gradient(135deg,#7030EF,#DB1FFF)' : 'transparent', color: 'white', fontSize: 14, fontWeight: cycle===opt ? 700 : 500, transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, boxShadow: cycle===opt ? '0 4px 14px rgba(112,48,239,0.35)' : 'none' }}>
                {opt==='monthly' ? 'Monthly' : 'Annual'}
                {opt==='annual' && <span style={{ fontSize: 11, color: cycle==='annual'?'rgba(255,255,255,0.9)':'#00E5A0', fontWeight: 700 }}>-17%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {PLANS.map(plan => {
            const price = cycle==='annual' ? plan.annual : plan.monthly;
            return (
              <div key={plan.id} style={{
                borderRadius: 22, padding: 28, position: 'relative',
                background: plan.popular ? 'linear-gradient(135deg, rgba(112,48,239,0.1), rgba(219,31,255,0.06))' : 'rgba(255,255,255,0.02)',
                border: plan.popular ? '1px solid rgba(112,48,239,0.4)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: plan.popular ? '0 0 60px rgba(112,48,239,0.12), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                transform: plan.popular ? 'scale(1.03)' : 'none',
                transition: 'transform 0.2s',
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(112,48,239,0.45)', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Star size={10} weight="fill" /> MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, fontFamily: 'var(--font-display)' }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 18 }}>{plan.desc}</div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>${price}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>{price===0?' forever':'/mo'}</span>
                </div>
                {cycle==='annual' && price>0 && (
                  <div style={{ fontSize: 12, color: '#00E5A0', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendUp size={12} weight="bold" />
                    Billed ${price*12}/yr · Save ${(plan.monthly-plan.annual)*12}
                  </div>
                )}
                {/* Storage pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 9, marginBottom: 22, marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Database size={13} color="#A580FF" weight="fill" />
                  <strong style={{ color: 'white' }}>{plan.storage}</strong> · {plan.file} per file
                </div>
                {/* CTA */}
                <button onClick={() => router.push('/register')} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: plan.popular ? 'linear-gradient(135deg,#7030EF,#DB1FFF)' : 'rgba(255,255,255,0.07)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 22, transition: 'opacity 0.2s', fontFamily: 'inherit', boxShadow: plan.popular ? '0 6px 22px rgba(112,48,239,0.4)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  <Rocket size={14} weight="fill" />
                  {plan.id==='free' ? 'Start for free' : `Start ${plan.name} trial →`}
                </button>
                {/* Feature list */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 9, marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,229,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Check size={10} color="#00E5A0" weight="bold" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px 48px', maxWidth: 700, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, letterSpacing: '-0.025em' }}>Got questions?</h2>
        </div>
        <div className="reveal">
          {[
            { q: 'Is TasksDone really free forever?', a: 'Yes! Our Free plan has no time limit. No credit card required. You get 5 clients, 3 projects, and 1GB storage — completely free.' },
            { q: 'How is this different from ClickUp or Notion?', a: 'TasksDone is built specifically for marketing agencies — not generic teams. Client Portal, Ad Campaign tracking, Content Calendar, and agency billing are built-in.' },
            { q: 'Can I try Pro before paying?', a: 'Yes. You get a 14-day free trial on Pro and Agency plans. No credit card needed to start.' },
            { q: 'How does the Client Portal work?', a: 'Each client gets their own secure login. They only see their projects, approve deliverables, and view invoices — nothing else.' },
            { q: 'How does AI competitor analysis work?', a: 'Enter your brand and up to 5 competitors. Our AI gives you a full SWOT analysis and actionable recommendations in under 30 seconds.' },
            { q: 'Is my data safe?', a: 'Yes. Enterprise-grade security, SSL encryption, and daily backups. Hosted on secure servers in Frankfurt, Germany.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setFaqOpen(faqOpen===i?null:i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '19px 0', background: 'none', border: 'none', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left', gap: 16, fontFamily: 'inherit' }}>
                {item.q}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: faqOpen===i ? 'rgba(112,48,239,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${faqOpen===i ? 'rgba(112,48,239,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  transform: faqOpen===i ? 'rotate(180deg)' : 'none',
                }}>
                  <CaretDown size={13} color={faqOpen===i ? '#A580FF' : 'rgba(255,255,255,0.4)'} weight="bold" />
                </div>
              </button>
              {faqOpen===i && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.48)', lineHeight: 1.8, paddingBottom: 20 }}>{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '120px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(112,48,239,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 40% at 70% 30%, rgba(219,31,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="reveal" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A580FF', marginBottom: 20, background: 'rgba(112,48,239,0.1)', padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(112,48,239,0.2)' }}>
            <Target size={11} weight="fill" /> Get started today
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontSize: 'clamp(30px,5vw,62px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 18, lineHeight: 1.05 }}>
            Ready to run your<br />
            <span style={{ background: 'linear-gradient(135deg,#C480FF,#DB1FFF,#FF4D6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>agency smarter?</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', marginBottom: 44 }}>Join 2,400+ agencies already using TasksDone</p>
          <button onClick={() => router.push('/register')} style={{ padding: '17px 52px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #7030EF, #DB1FFF)', color: 'white', fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 14px 50px rgba(112,48,239,0.5)', letterSpacing: '-0.015em', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 64px rgba(112,48,239,0.65)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 14px 50px rgba(112,48,239,0.5)'; }}>
            <Rocket size={20} weight="fill" />
            Start for free today →
          </button>
          <p style={{ marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><ShieldCheck size={12} color="rgba(255,255,255,0.25)" /> Free forever</span>
            <span>·</span>
            <span>No credit card</span>
            <span>·</span>
            <span>Up and running in 5 minutes</span>
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '52px 48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
        <div style={{ maxWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(112,48,239,0.4)' }}>
              <CheckSquare size={16} color="#fff" weight="fill" />
            </div>
            <span style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: '-0.02em' }}>
              Tasks<span style={{ background: 'linear-gradient(135deg,#A580FF,#DB1FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Done</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', lineHeight: 1.65 }}>The operating system for modern marketing agencies.</p>
        </div>
        <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
          {[
            { title: 'Product', links: [['Features','/features'],['Pricing','/pricing'],['Changelog','/changelog'],['Roadmap','/roadmap']] },
            { title: 'Company', links: [['About','/about'],['Blog','/blog'],['Careers','/careers'],['Contact','/contact']] },
            { title: 'Support', links: [['Docs','/docs'],['Help Center','/help'],['Status','/status']] },
            { title: 'Legal',   links: [['Privacy','/privacy'],['Terms','/terms'],['Cookies','/cookies']] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>{col.title}</div>
              {col.links.map(([label,href]) => (
                <Link key={label} href={href}
                  style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.42)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='white')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.42)')}
                >{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </footer>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© 2025 TasksDone · Built for marketing agencies worldwide</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 5 }}>Made with <span style={{ color: '#FF4D6A' }}>♥</span></span>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
        .reveal { opacity:0; transform:translateY(30px); transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1); }
        .reveal.visible { opacity:1; transform:translateY(0); }
        @media (max-width:768px) {
          nav > div:nth-child(2) { display:none !important; }
          section { padding-left:20px !important; padding-right:20px !important; }
          footer { padding: 36px 20px !important; }
        }
      `}</style>
    </div>
  );
}
