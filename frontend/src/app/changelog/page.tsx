'use client';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const RELEASES = [
  {
    version: 'v1.3', date: 'March 14, 2025',
    changes: [
      { type: 'NEW', text: 'AI Campaign Builder — generate full campaign plans from a single prompt', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'NEW', text: 'Client Portal 2.0 — redesigned with real-time task updates and file sharing', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'IMPROVED', text: 'Dashboard load time reduced by 60%', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' },
      { type: 'IMPROVED', text: 'Mobile navigation completely redesigned for better usability', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' },
      { type: 'FIX', text: 'Invoice PDF generation on Safari was broken — now fixed', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    ],
  },
  {
    version: 'v1.2', date: 'February 10, 2025',
    changes: [
      { type: 'NEW', text: 'Content Calendar — plan and schedule social media posts across all platforms', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'NEW', text: 'Time tracking reports now include billable vs. non-billable breakdown', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'IMPROVED', text: 'Kanban board now supports up to 20 columns with custom colors', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' },
      { type: 'FIX', text: 'Task assignment dropdown not showing all team members in large workspaces', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
      { type: 'FIX', text: 'Content calendar drag-and-drop not working on Firefox', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    ],
  },
  {
    version: 'v1.1', date: 'January 20, 2025',
    changes: [
      { type: 'NEW', text: 'Ad Campaign Tracker — monitor Meta, Google, and TikTok Ads in one dashboard', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'NEW', text: 'Timeline view for projects with dependencies and milestones', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'IMPROVED', text: 'Settings page completely redesigned with better UX and clearer sections', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' },
      { type: 'FIX', text: 'File upload failing for files larger than 50MB — now supports up to 1GB', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    ],
  },
  {
    version: 'v1.0', date: 'December 1, 2024',
    changes: [
      { type: 'LAUNCH', text: 'TasksDone officially launches — welcome to your agency OS!', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
      { type: 'NEW', text: 'Tasks with Kanban & List views, priorities, due dates, and @mentions', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'NEW', text: 'Client management with profiles, communication log, and folders', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'NEW', text: 'Time tracking with one-click timers and invoice generation', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
      { type: 'NEW', text: 'Team chat with channels, DMs, and file sharing', color: '#2563EB', bg: 'rgba(37,99,235,0.12)' },
    ],
  },
];

export default function ChangelogPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Changelog</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            What&apos;s new in TasksDone
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            We ship fast. Here&apos;s everything we&apos;ve built.
          </p>
        </div>
      </section>

      {/* Subscribe */}
      <section style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px 60px' }}>
        {subscribed ? (
          <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 600, fontSize: 14 }}>You&apos;re subscribed to release updates!</div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Get release updates by email" style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
            <button onClick={() => email && setSubscribed(true)} style={{ padding: '12px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
          </div>
        )}
      </section>

      {/* Releases timeline */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {RELEASES.map((release, i) => (
            <div key={i} style={{ display: 'flex', gap: 32 }}>
              {/* Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '2px solid rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#60a5fa' }}>{release.version}</div>
                {i < RELEASES.length - 1 && <div style={{ width: 2, flex: 1, marginTop: 8, background: 'rgba(255,255,255,0.06)', minHeight: 40 }} />}
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>{release.version}</h2>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{release.date}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {release.changes.map((change, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: change.color, background: change.bg, padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 1, letterSpacing: '0.05em' }}>{change.type}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{change.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
