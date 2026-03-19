'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, TrendingUp, CheckCircle2, Clock, Palette, CalendarDays,
  FolderKanban, Zap, Download, RefreshCw, Star, BarChart3,
} from 'lucide-react';
import api from '@/lib/api';

interface ReportData {
  client: { name: string; company?: string };
  period: string;
  generatedAt: string;
  overview: { overallProgress: number; activeProjects: number; totalProjects: number };
  tasks: { total: number; completedThisPeriod: number; pending: number };
  designs: { total: number; approved: number; pendingReview: number; revisions: number };
  content: { total: number; published: number; approved: number; scheduled: number; drafts: number };
  recentActivity: any[];
  projects: any[];
  narrative: string;
  insights: string[];
}

const ACTION_LABELS: Record<string, string> = {
  task_created: 'Task created', task_completed: 'Task completed',
  design_uploaded: 'Design uploaded', design_approved: 'Design approved',
  design_rejected: 'Changes requested', content_approved: 'Content approved',
  content_rejected: 'Changes requested', comment_added: 'Comment added',
  file_uploaded: 'File uploaded',
};

export default function ClientReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/clients/${id}/report?period=${period}`);
      setReport(data);
    } finally { setLoading(false); }
  }, [id, period]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
      <RefreshCw size={20} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!report) return null;

  const { overview, tasks, designs, content } = report;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } } .fu { animation: fadeUp 0.35s ease both; }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={() => router.push(`/dashboard/clients/${id}`)}
          style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', color: '#8b949e', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f2f9', margin: 0 }}>
            Performance Report — {report.client.name}
          </h1>
          <p style={{ fontSize: 13, color: '#8b949e', margin: '3px 0 0' }}>
            Generated {new Date(report.generatedAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['week', 'month'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: period === p ? '#6366f1' : 'rgba(255,255,255,0.04)',
              border: period === p ? 'none' : '1px solid rgba(255,255,255,0.08)',
              color: period === p ? '#fff' : '#8b949e',
            }}>{p === 'week' ? 'This Week' : 'This Month'}</button>
          ))}
        </div>
      </div>

      {/* AI Narrative */}
      {report.narrative && (
        <div className="fu" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '20px 22px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Zap size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.7, margin: 0 }}>{report.narrative}</p>
          </div>
        </div>
      )}

      {/* Insight pills */}
      {report.insights.length > 0 && (
        <div className="fu" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {report.insights.map((ins, i) => (
            <span key={i} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: 'rgba(34,197,94,0.08)', color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.15)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Star size={10} /> {ins}
            </span>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="fu" style={{ marginBottom: 20,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: '#8b949e' }}>Overall Project Completion</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#6366f1' }}>{overview.overallProgress}%</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 5, width: `${overview.overallProgress}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 1.2s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: '#8b949e' }}>
            <FolderKanban size={11} style={{ display: 'inline', marginRight: 4 }} />
            {overview.activeProjects} active / {overview.totalProjects} total projects
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="fu" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Tasks Done', value: tasks.completedThisPeriod, sub: `${tasks.pending} pending`, color: '#22c55e', icon: <CheckCircle2 size={16} /> },
          { label: 'Pending Tasks', value: tasks.pending, sub: `${tasks.total} total`, color: '#f59e0b', icon: <Clock size={16} /> },
          { label: 'Designs Approved', value: designs.approved, sub: `${designs.pendingReview} in review`, color: '#8b5cf6', icon: <Palette size={16} /> },
          { label: 'Content Live', value: content.published, sub: `${content.scheduled} scheduled`, color: '#6366f1', icon: <CalendarDays size={16} /> },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f2f9', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f2f9', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#8b949e' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two cols: Projects + Activity */}
      <div className="fu" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Projects */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f1f2f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={14} color="#6366f1" /> Project Breakdown
          </h3>
          {report.projects.length === 0
            ? <p style={{ fontSize: 13, color: '#8b949e' }}>No projects yet</p>
            : report.projects.map((p: any) => (
              <div key={p.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#f1f2f9' }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700 }}>{p.progress}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: p.status === 'completed' ? '#22c55e' : '#6366f1', borderRadius: 3 }} />
                </div>
              </div>
            ))
          }
        </div>

        {/* Activity */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f1f2f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} color="#6366f1" /> Recent Activity
          </h3>
          {report.recentActivity.length === 0
            ? <p style={{ fontSize: 13, color: '#8b949e' }}>No activity yet</p>
            : report.recentActivity.slice(0, 8).map((a: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#c9d1d9' }}>
                    {a.actor_name && <strong>{a.actor_name} — </strong>}
                    {ACTION_LABELS[a.action] || a.action.replace(/_/g, ' ')}
                    {a.entity_name && <em style={{ color: '#8b5cf6' }}> "{a.entity_name}"</em>}
                  </div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Content breakdown */}
      <div className="fu" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 22px' }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f1f2f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarDays size={14} color="#6366f1" /> Content Summary
        </h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Published', value: content.published, color: '#22c55e' },
            { label: 'Approved', value: content.approved, color: '#6366f1' },
            { label: 'Scheduled', value: content.scheduled, color: '#8b5cf6' },
            { label: 'Drafts', value: content.drafts, color: '#8b949e' },
            { label: 'Total', value: content.total, color: '#f1f2f9' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8b949e' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
