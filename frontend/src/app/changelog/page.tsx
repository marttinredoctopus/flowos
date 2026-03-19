import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const RELEASES = [
  {
    version: 'v2.4.0', date: 'March 14, 2025', tag: 'Major',
    tagColor: '#6366f1', changes: [
      { type: 'new', text: 'AI Campaign Builder: Generate full campaign plans from a single prompt' },
      { type: 'new', text: 'Client Portal 2.0: Redesigned with real-time task updates and file sharing' },
      { type: 'new', text: 'Sprint planning board for agile agency teams' },
      { type: 'improved', text: 'Dashboard load time reduced by 60%' },
      { type: 'improved', text: 'Mobile app navigation completely redesigned' },
      { type: 'fixed', text: 'Invoice PDF generation on Safari was broken — now fixed' },
    ],
  },
  {
    version: 'v2.3.2', date: 'February 28, 2025', tag: 'Patch',
    tagColor: '#10b981', changes: [
      { type: 'fixed', text: 'Task assignment dropdown not showing all team members' },
      { type: 'fixed', text: 'Content calendar drag-and-drop not working on Firefox' },
      { type: 'fixed', text: 'Email notifications for overdue invoices sending duplicate messages' },
    ],
  },
  {
    version: 'v2.3.0', date: 'February 10, 2025', tag: 'Minor',
    tagColor: '#8b5cf6', changes: [
      { type: 'new', text: 'Competitor Analysis: Track and compare competitor ad strategies' },
      { type: 'new', text: 'Time tracking reports now include billable vs. non-billable breakdown' },
      { type: 'new', text: 'Webhook support for task completion and invoice payment events' },
      { type: 'improved', text: 'Kanban board now supports up to 20 columns' },
    ],
  },
  {
    version: 'v2.2.0', date: 'January 20, 2025', tag: 'Minor',
    tagColor: '#8b5cf6', changes: [
      { type: 'new', text: 'Idea Bank: Save and organize creative ideas with AI-powered tags' },
      { type: 'new', text: 'Forms builder: Create intake forms and share with clients' },
      { type: 'improved', text: 'Settings page completely redesigned with better UX' },
      { type: 'fixed', text: 'File upload failing for files > 50MB — now supports up to 1GB' },
    ],
  },
];

const typeColor: Record<string, string> = { new: '#10b981', improved: '#6366f1', fixed: '#f59e0b' };
const typeBg: Record<string, string> = { new: 'rgba(16,185,129,0.1)', improved: 'rgba(99,102,241,0.1)', fixed: 'rgba(245,158,11,0.1)' };

export default function ChangelogPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Changelog</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              What's new in TasksDone
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-2)' }}>We ship new features every week. Here's what we've been building.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {RELEASES.map((release, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: release.tagColor }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{release.version}</h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: release.tagColor, background: `${release.tagColor}18`, padding: '3px 10px', borderRadius: 8 }}>{release.tag}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 'auto' }}>{release.date}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {release.changes.map((change, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: typeColor[change.type], background: typeBg[change.type], padding: '2px 8px', borderRadius: 6, flexShrink: 0, textTransform: 'uppercase', marginTop: 1 }}>
                        {change.type}
                      </span>
                      <span style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>{change.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
