'use client';
export const dynamic = 'force-dynamic';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CheckCircle2, Target, Users, Megaphone, CreditCard, Brain, Clock, FileText, Shield, BarChart3, Zap, Globe } from 'lucide-react';

const FEATURES = [
  {
    category: 'Project & Task Management',
    color: '#6366f1',
    icon: <Target size={28} color="#6366f1" />,
    items: [
      { title: 'Kanban & List Boards', desc: 'Visualize work with drag-and-drop kanban boards or structured list views. Switch between views instantly.' },
      { title: 'Task Assignment & Due Dates', desc: 'Assign tasks to team members, set deadlines, and track completion status in real time.' },
      { title: 'Sprint Planning', desc: 'Organize tasks into sprints, set sprint goals, and track velocity across your team.' },
      { title: 'Subtasks & Dependencies', desc: 'Break large tasks into subtasks. Set task dependencies to ensure work flows in the right order.' },
      { title: 'Time Tracking', desc: 'Log time directly on tasks. Generate time reports and bill clients accurately.' },
    ],
  },
  {
    category: 'Client Management',
    color: '#f43f5e',
    icon: <Users size={28} color="#f43f5e" />,
    items: [
      { title: 'Client Profiles', desc: 'Store all client info — contacts, briefs, accounts, notes — in one organized place.' },
      { title: 'Client Portal', desc: 'Give clients their own branded portal to view projects, tasks, files, and invoices.' },
      { title: 'Client Communication Log', desc: 'Track every interaction with a client. Never lose context again.' },
      { title: 'Client Folders', desc: 'Organize all files, assets, and documents per client with a clean folder structure.' },
    ],
  },
  {
    category: 'Campaign & Content',
    color: '#06b6d4',
    icon: <Megaphone size={28} color="#06b6d4" />,
    items: [
      { title: 'Ad Campaign Tracker', desc: 'Track Facebook, Google, and TikTok campaigns. Monitor budget, spend, and ROAS in one dashboard.' },
      { title: 'Content Calendar', desc: 'Plan and schedule social media content with a drag-and-drop calendar. Never miss a posting day.' },
      { title: 'Idea Bank', desc: 'Capture and organize creative ideas with tags, categories, and AI-powered inspiration.' },
      { title: 'Campaign Builder', desc: 'Build full campaign plans with budgets, platforms, target audiences, and creative assets.' },
    ],
  },
  {
    category: 'Finance & Invoicing',
    color: '#10b981',
    icon: <CreditCard size={28} color="#10b981" />,
    items: [
      { title: 'Invoice Generation', desc: 'Create professional invoices in seconds. Send directly to clients via email or portal.' },
      { title: 'Expense Tracking', desc: 'Log and categorize business expenses. Attach receipts and link to projects.' },
      { title: 'Revenue Reports', desc: 'Track MRR, outstanding payments, and profit margins with real-time dashboards.' },
      { title: 'Payment Reminders', desc: 'Automated reminders for overdue invoices. Stop chasing payments manually.' },
    ],
  },
  {
    category: 'AI Intelligence',
    color: '#8b5cf6',
    icon: <Brain size={28} color="#8b5cf6" />,
    items: [
      { title: 'AI Campaign Builder', desc: 'Describe your goal and AI generates a complete campaign plan with tasks, copy, and strategy.' },
      { title: 'Competitor Analysis', desc: 'Analyze competitor ad strategies and content. Know what\'s working in your market.' },
      { title: 'AI Content Generator', desc: 'Generate ad copy, email templates, social posts, and proposals in seconds.' },
      { title: 'Intelligent Alerts', desc: 'AI surfaces overdue tasks, at-risk projects, and revenue insights before they become problems.' },
    ],
  },
  {
    category: 'Team & Collaboration',
    color: '#f59e0b',
    icon: <Users size={28} color="#f59e0b" />,
    items: [
      { title: 'Team Chat', desc: 'Real-time messaging with channels, direct messages, and task-linked threads.' },
      { title: 'Role-Based Access', desc: 'Control what each team member can see and do. Admin, Team Member, and Client roles.' },
      { title: 'File Sharing', desc: 'Upload and share files with your team and clients. Up to 1TB storage on Enterprise.' },
      { title: 'Meeting Notes', desc: 'Record and summarize meetings. Link notes to projects and generate action items.' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        {/* Hero */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, lineHeight: 1.15 }}>
            Everything your agency needs.<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Nothing you don't.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-2)', marginTop: 20, lineHeight: 1.65, maxWidth: 600, margin: '20px auto 0' }}>
            TasksDone replaces 5+ separate tools with one integrated platform. Here's everything included.
          </p>
        </section>

        {/* Feature categories */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
          {FEATURES.map((category, i) => (
            <div key={i} style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${category.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {category.icon}
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{category.category}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {category.items.map((item, j) => (
                  <div key={j} style={{
                    padding: '20px 22px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${category.color}40`}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={16} color={category.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section style={{ background: 'rgba(99,102,241,0.05)', borderTop: '1px solid rgba(99,102,241,0.1)', padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to try everything?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 32 }}>Start free. No credit card required.</p>
          <a href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 11, fontSize: 15, fontWeight: 600,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
            textDecoration: 'none', boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}>
            Start Free →
          </a>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
