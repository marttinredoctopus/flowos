'use client';
import { useRouter } from 'next/navigation';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Kanban, CalendarDots, TrendUp, Timer, Buildings, Sparkle,
  ChatCircle, PaintBrush, CheckCircle,
} from '@phosphor-icons/react';

const FEATURES = [
  {
    icon: Kanban, color: '#2563EB', iconBg: 'rgba(37,99,235,0.12)',
    title: 'Tasks that actually get done',
    desc: 'From simple to-dos to complex multi-step campaigns — TasksDone handles it all with multiple views and powerful automation.',
    bullets: ['Kanban, List, Calendar, and Timeline views', 'Drag-and-drop with priorities and due dates', '@mentions and real-time comments', 'Recurring tasks and templates'],
  },
  {
    icon: CalendarDots, color: '#7C3AED', iconBg: 'rgba(124,58,237,0.12)',
    title: 'Plan content across every platform',
    desc: "See your entire content pipeline at a glance. Never miss a posting deadline again with visual scheduling and approval workflows.",
    bullets: ['Schedule for Instagram, Facebook, TikTok, LinkedIn, X, YouTube', 'Visual calendar with drag-and-drop scheduling', 'Content approval workflow', 'Auto-reminders for upcoming deadlines'],
  },
  {
    icon: TrendUp, color: '#10b981', iconBg: 'rgba(16,185,129,0.12)',
    title: 'Track campaigns, not spreadsheets',
    desc: "Connect your ad accounts and monitor performance in real-time. Know what's working before your client asks.",
    bullets: ['Live ROAS, CTR, CPC, and spend tracking', 'Multi-platform: Meta, Google, TikTok Ads', 'Budget alerts and performance notifications', 'Automated weekly reports'],
  },
  {
    icon: Timer, color: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)',
    title: 'Track time. Get paid faster.',
    desc: 'Know exactly how profitable each project is and bill clients with one click. No more forgotten hours.',
    bullets: ['One-click timers linked to projects and tasks', 'Automatic billable hours calculation', 'Professional invoice generation and sending', 'Payment tracking and reminders'],
  },
  {
    icon: Buildings, color: '#0EA5E9', iconBg: 'rgba(14,165,233,0.12)',
    title: 'Clients love the portal',
    desc: 'Give every client their own branded space to stay updated without endless email chains.',
    bullets: ['Unique secure login per client', 'Real-time project and task visibility', 'Deliverable approval with one click', 'Shared files and brand assets'],
  },
  {
    icon: Sparkle, color: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)',
    title: 'AI built for marketing agencies',
    desc: 'Claude-powered AI that understands your industry and gives real, actionable insights.',
    bullets: ['Competitor analysis with SWOT breakdown', 'Campaign idea generator with 3 concepts', 'Market research and trend reports', 'AI-powered task suggestions'],
  },
  {
    icon: ChatCircle, color: '#f43f5e', iconBg: 'rgba(244,63,94,0.12)',
    title: 'Chat where work happens',
    desc: 'Project-linked conversations so context is never lost. Stop switching between Slack and your PM tool.',
    bullets: ['Channels linked to projects and clients', 'Direct messages and group chats', 'File sharing and previews', 'Threaded replies and reactions'],
  },
  {
    icon: PaintBrush, color: '#f97316', iconBg: 'rgba(249,115,22,0.12)',
    title: 'Manage creative work beautifully',
    desc: 'Upload, version, review, and approve creative assets in one place. Built for the way designers actually work.',
    bullets: ['Upload designs with version history', 'Pinned feedback directly on designs', 'Brand guidelines and asset library', 'Client approval workflow'],
  },
];

export default function FeaturesPage() {
  const router = useRouter();
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 500, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>
            Everything included
          </div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 20, lineHeight: 1.1 }}>
            Every tool your agency needs
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            TasksDone replaces 6 different tools with one powerful platform. Here&apos;s everything you get.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const isEven = i % 2 === 0;
            return (
              <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                {/* Text side */}
                <div style={{ order: isEven ? 0 : 1 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.iconBg, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={26} weight="duotone" color={f.color} />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.2 }}>{f.title}</h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 24 }}>{f.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {f.bullets.map(b => (
                      <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <CheckCircle size={16} weight="duotone" color={f.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Visual side */}
                <div style={{ order: isEven ? 1 : 0, background: 'rgba(255,255,255,0.02)', border: `1px solid ${f.color}20`, borderRadius: 20, padding: 32, minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${f.color}18 0%, transparent 70%)` }} />
                  <Icon size={80} weight="duotone" color={f.color} style={{ opacity: 0.8 }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', background: 'linear-gradient(180deg, #060B18 0%, #0A1628 100%)' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 40, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Ready to replace all your tools?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
          Free 14-day trial · No credit card required
        </p>
        <button onClick={() => router.push('/register')} style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(37,99,235,0.35)' }}>
          Start for free →
        </button>
      </section>

      <LandingFooter />
    </div>
  );
}
