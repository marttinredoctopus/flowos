'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  TrendUp, CheckSquare, Kanban, Users, Lightning,
  Receipt, Sparkle, ArrowRight, Circle, Clock,
  Star, Fire, Target, ChartBar,
} from '@phosphor-icons/react';

/* ── helpers ───────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
function isOverdue(date: string) { return new Date(date) < new Date(); }
function fmtDate(d: string) {
  const dt = new Date(d);
  const now = new Date();
  const diff = Math.round((dt.getTime() - now.getTime()) / 86400000);
  if (diff === 0)  return 'Today';
  if (diff === 1)  return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0)   return `${Math.abs(diff)}d overdue`;
  return `in ${diff}d`;
}
function priorityColor(p: string) {
  if (p === 'urgent') return '#FF4D6A';
  if (p === 'high')   return '#FFB547';
  if (p === 'medium') return '#00D4FF';
  return '#4A4A65';
}
function getPriorityGrad(p: string) {
  if (p === 'urgent') return 'linear-gradient(135deg,#FF4D6A,#FF7A30)';
  if (p === 'high')   return 'linear-gradient(135deg,#FFB547,#FF7A30)';
  if (p === 'medium') return 'linear-gradient(135deg,#00D4FF,#7030EF)';
  return 'linear-gradient(135deg,#4A4A65,#6B6B88)';
}

/* ── skeleton ───────────────────────────────────────────────── */
function Skeleton({ w = '100%', h = 16, r = 8 }: { w?: string|number; h?: number; r?: number }) {
  return (
    <div className="animate-shimmer" style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }} />
  );
}

/* ── Stat card ──────────────────────────────────────────────── */
function StatCard({
  label, value, icon: Icon, color, from, to, sub, delay = 0,
}: {
  label: string; value: number|string; icon: any;
  color: string; from: string; to: string;
  sub?: string; delay?: number;
}) {
  const [count, setCount] = useState(0);
  const target = typeof value === 'number' ? value : 0;

  useEffect(() => {
    let frame: any;
    let start = 0;
    const dur = 900 + delay;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      start = Math.round(ease * target);
      setCount(start);
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    const timeout = setTimeout(() => { frame = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [target, delay]);

  return (
    <div
      className="card-hover-effect animate-fade-up"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}ms`,
        cursor: 'default',
      }}
    >
      {/* Ambient gradient blob */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at top right, ${from}18 0%, transparent 60%)`,
      }} />

      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 12, marginBottom: 16,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 24px ${from}40`,
      }}>
        <Icon size={18} color="#fff" weight="fill" />
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
      <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'var(--font-display)' }}>
        {typeof value === 'number' ? count : value}
      </div>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{sub}</p>}

      {/* Bottom gradient line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${from}, ${to})`,
        opacity: 0.6,
      }} />
    </div>
  );
}

/* ── AI suggestion card ─────────────────────────────────────── */
const AI_SUGGESTIONS = [
  { text: 'You have 3 high-priority tasks overdue. Consider reassigning 1 to balance workload.', tag: 'Productivity' },
  { text: "Tuesday is your team's most productive day — schedule important reviews then.", tag: 'Insight' },
  { text: 'Your campaign CTR is 18% above industry average. Time to scale the budget.', tag: 'Growth' },
];

/* ── Quick action ───────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, href, color, from, to, delay = 0 }: any) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      className="animate-fade-up"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '18px 12px',
        background: hov ? `linear-gradient(135deg, ${from}18, ${to}18)` : 'var(--card)',
        border: `1px solid ${hov ? from + '50' : 'var(--border)'}`,
        borderRadius: 16,
        textDecoration: 'none',
        transition: 'all 0.22s cubic-bezier(.16,1,.3,1)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hov ? `0 12px 28px ${from}25` : 'none',
        animationDelay: `${delay}ms`,
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 6px 20px ${from}40`,
        transition: 'transform 0.2s',
        transform: hov ? 'scale(1.1) rotate(-4deg)' : 'scale(1)',
      }}>
        <Icon size={20} color="#fff" weight="fill" />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </Link>
  );
}

/* ── Task row ────────────────────────────────────────────────── */
function TaskRow({ task }: { task: any }) {
  const [hov, setHov] = useState(false);
  const overdue = task.due_date && isOverdue(task.due_date);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        borderRadius: 12,
        background: hov ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
    >
      {/* Priority dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: priorityColor(task.priority),
        boxShadow: `0 0 6px ${priorityColor(task.priority)}80`,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
          {task.project_name || 'No project'}
          {task.due_date && (
            <span style={{ color: overdue ? '#FF4D6A' : 'var(--text-3)' }}> · {fmtDate(task.due_date)}</span>
          )}
        </p>
      </div>

      {/* Priority badge */}
      <span style={{
        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
        background: getPriorityGrad(task.priority),
        color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase',
        opacity: 0.9,
      }}>{task.priority || 'low'}</span>
    </div>
  );
}

/* ── Project row ─────────────────────────────────────────────── */
function ProjectRow({ project }: { project: any }) {
  const [hov, setHov] = useState(false);
  const progress = project.progress || Math.floor(Math.random() * 80 + 10);
  const colors = ['#7030EF','#DB1FFF','#00D4FF','#00E5A0','#FFB547','#FF4D6A'];
  const color = project.color || colors[Math.abs(project.id || 0) % colors.length];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 12,
        background: hov ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background 0.15s', cursor: 'pointer',
      }}
    >
      {/* Project color dot */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: `0 4px 12px ${color}40`,
      }}>
        {project.icon || '📁'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          {/* Progress bar */}
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', borderRadius: 2, width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}CC)`, transition: 'width 1s ease' }} />
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>{progress}%</span>
        </div>
      </div>

      {/* Task count */}
      <span style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{project.task_count || 0} tasks</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const [stats,    setStats]    = useState<any>(null);
  const [tasks,    setTasks]    = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [aiIdx,    setAiIdx]    = useState(0);

  useEffect(() => {
    Promise.all([
      apiGet('/api/dashboard/stats').catch(() => null),
      apiGet('/api/tasks?limit=8&status=in_progress').catch(() => null),
      apiGet('/api/projects?limit=6').catch(() => null),
    ]).then(([sd, td, pd]) => {
      setStats(sd?.data || sd || {});
      const t = td?.data?.tasks ?? td?.tasks ?? td?.data ?? td ?? [];
      const p = pd?.data?.projects ?? pd?.projects ?? pd?.data ?? pd ?? [];
      setTasks(Array.isArray(t) ? t : []);
      setProjects(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  }, []);

  // Rotate AI suggestion
  useEffect(() => {
    const t = setInterval(() => setAiIdx(i => (i + 1) % AI_SUGGESTIONS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const activePro = stats?.active_projects ?? stats?.activeProjects ?? projects.length ?? 0;
  const openTasks = stats?.open_tasks ?? stats?.pendingTasks ?? 0;
  const dueToday  = stats?.due_today ?? stats?.dueToday ?? 0;
  const members   = stats?.team_members ?? stats?.teamMembers ?? 0;

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--bg)',
      padding: '28px 32px 48px',
      maxWidth: 1280,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 600, height: 600,
        background: 'radial-gradient(ellipse at top right, rgba(112,48,239,0.06) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '30%', width: 400, height: 400,
        background: 'radial-gradient(ellipse, rgba(219,31,255,0.04) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="animate-fade-up" style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <h1 style={{
              fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800,
              fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif',
              letterSpacing: '-0.035em', color: 'var(--text)',
              lineHeight: 1.15,
            }}>
              {getGreeting()},{' '}
              <span className="gradient-text">{firstName}</span> 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 6 }}>
              Here&apos;s your agency performance overview for today.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/dashboard/tasks?new=1"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 12,
              background: 'var(--grad-brand)',
              color: '#fff', textDecoration: 'none',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--font-display)',
              boxShadow: '0 8px 24px rgba(112,48,239,0.35)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <Lightning size={16} weight="fill" />
            Quick Create
          </Link>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }} className="dash-stats">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px 24px' }}>
                <Skeleton w={40} h={40} r={12} />
                <div style={{ marginTop: 16 }}><Skeleton w="60%" h={10} /></div>
                <div style={{ marginTop: 8 }}><Skeleton w="40%" h={32} /></div>
              </div>
            ))
          ) : (
            <>
              <StatCard label="Active Projects" value={activePro} icon={Kanban}      color="#7030EF" from="#7030EF" to="#DB1FFF" sub="Currently in progress"  delay={0} />
              <StatCard label="Open Tasks"      value={openTasks} icon={CheckSquare} color="#00E5A0" from="#00E5A0" to="#00D4FF" sub="Awaiting completion"    delay={80} />
              <StatCard label="Due Today"       value={dueToday}  icon={Clock}       color="#FFB547" from="#FFB547" to="#FF7A30" sub="Need attention now"     delay={160} />
              <StatCard label="Team Members"    value={members}   icon={Users}       color="#00D4FF" from="#00D4FF" to="#7030EF" sub="Active collaborators"   delay={240} />
            </>
          )}
        </div>

        {/* ── AI Suggestions banner ───────────────────────────── */}
        <div
          className="animate-fade-up-2"
          style={{
            marginBottom: 24,
            padding: '14px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(112,48,239,0.12), rgba(219,31,255,0.08))',
            border: '1px solid rgba(112,48,239,0.2)',
            display: 'flex', alignItems: 'center', gap: 14,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'var(--grad-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(112,48,239,0.4)',
          }}>
            <Sparkle size={18} color="#fff" weight="fill" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#A580FF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Insight</p>
              <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 100, background: 'rgba(165,128,255,0.15)', color: '#A580FF', fontWeight: 600 }}>
                {AI_SUGGESTIONS[aiIdx].tag}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{AI_SUGGESTIONS[aiIdx].text}</p>
          </div>
          {/* Pagination dots */}
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {AI_SUGGESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setAiIdx(i)}
                style={{
                  width: i === aiIdx ? 16 : 6, height: 6, borderRadius: 3,
                  background: i === aiIdx ? 'var(--grad-brand)' : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Projects + Tasks ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Active Projects */}
          <div className="card-base animate-fade-up-3" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(112,48,239,0.35)' }}>
                  <Kanban size={15} color="#fff" weight="fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Active Projects</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{activePro} running</p>
                </div>
              </div>
              <Link
                href="/dashboard/projects"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#A580FF', fontWeight: 600, textDecoration: 'none' }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ padding: '8px 6px' }}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Skeleton w={34} h={34} r={10} />
                    <div style={{ flex: 1 }}><Skeleton w="70%" h={12} /><div style={{ marginTop: 6 }}><Skeleton h={4} /></div></div>
                  </div>
                ))
              ) : projects.length === 0 ? (
                <EmptySlate Icon={Kanban} text="No projects yet" action="Create Project" href="/dashboard/projects" />
              ) : (
                projects.slice(0, 5).map(p => <ProjectRow key={p.id} project={p} />)
              )}
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="card-base animate-fade-up-4" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#00E5A0,#00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,229,160,0.3)' }}>
                  <CheckSquare size={15} color="#fff" weight="fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>In Progress</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{tasks.length} active tasks</p>
                </div>
              </div>
              <Link
                href="/dashboard/tasks"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#00E5A0', fontWeight: 600, textDecoration: 'none' }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ padding: '8px 6px' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Skeleton w={8} h={8} r={100} />
                    <div style={{ flex: 1 }}><Skeleton w="80%" h={12} /><div style={{ marginTop: 4 }}><Skeleton w="50%" h={10} /></div></div>
                    <Skeleton w={50} h={18} r={100} />
                  </div>
                ))
              ) : tasks.length === 0 ? (
                <EmptySlate Icon={CheckSquare} text="No tasks in progress" action="Create Task" href="/dashboard/tasks" />
              ) : (
                tasks.slice(0, 6).map(t => <TaskRow key={t.id} task={t} />)
              )}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ────────────────────────────────────── */}
        <div className="animate-fade-up-5">
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Actions</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }} className="quick-actions-grid">
            <QuickAction icon={CheckSquare} label="New Task"      href="/dashboard/tasks?new=1"         from="#00E5A0" to="#00D4FF"  delay={0} />
            <QuickAction icon={Kanban}      label="New Project"   href="/dashboard/projects"             from="#7030EF" to="#DB1FFF"  delay={40} />
            <QuickAction icon={Users}       label="Add Client"    href="/dashboard/clients"              from="#FF4D6A" to="#FF7A30"  delay={80} />
            <QuickAction icon={Receipt}     label="New Invoice"   href="/dashboard/finance/invoices"     from="#00E5A0" to="#7030EF"  delay={120} />
            <QuickAction icon={Sparkle}     label="AI Generate"   href="/dashboard/intelligence/generate"from="#DB1FFF" to="#7030EF"  delay={160} />
            <QuickAction icon={ChartBar}    label="View Reports"  href="/dashboard/reports"              from="#FFB547" to="#FF4D6A"  delay={200} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Empty slate ─────────────────────────────────────────────── */
function EmptySlate({ Icon, text, action, href }: { Icon: any; text: string; action: string; href: string }) {
  return (
    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px', background: 'linear-gradient(135deg,rgba(112,48,239,0.12),rgba(219,31,255,0.08))', border: '1px solid rgba(112,48,239,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color="#A580FF" weight="duotone" />
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>{text}</p>
      <Link
        href={href}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 10,
          background: 'var(--grad-brand)',
          color: '#fff', fontSize: 12, fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(112,48,239,0.3)',
        }}
      >
        {action} <ArrowRight size={11} />
      </Link>
    </div>
  );
}
