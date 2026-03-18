'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Avatar } from '@/components/ui/Avatar';

// ── Shared sub-components ────────────────────────────────────────────────────

function Greeting({ subtitle }: { subtitle?: string }) {
  const { user } = useAuthStore();
  const h = new Date().getHours();
  const msg = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        {msg}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
      </h1>
      <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
        {subtitle || "Here's your agency overview for today."}
      </p>
      <p className="text-xs font-medium" style={{ color: 'var(--text-dim, var(--text-muted))' }}>
        {dateStr} · TasksDone
      </p>
    </div>
  );
}

function QuickActions() {
  const router = useRouter();
  const actions = [
    { label: '+ New Task',     href: '/dashboard/tasks?new=1',  color: 'var(--indigo, #6366f1)' },
    { label: '+ New Project',  href: '/dashboard/projects',     color: 'var(--cyan, #06b6d4)' },
    { label: 'View Reports',   href: '/dashboard/reports',      color: 'var(--emerald, #10b981)' },
    { label: 'Open Chat',      href: '/dashboard/chat',         color: 'var(--violet, #8b5cf6)' },
  ];
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {actions.map(a => (
        <button
          key={a.label}
          onClick={() => router.push(a.href)}
          className="px-3 h-8 rounded-lg text-xs font-semibold transition"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: a.color }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = a.color;
            e.currentTarget.style.background = a.color + '15';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'var(--card)';
          }}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

function StatCards({ stats }: { stats: { icon: string; label: string; value: string | number; color: string; change?: string; isWarning?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 dash-stats">
      {stats.map((s, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl card-hover-effect"
          style={{
            background: 'var(--card)',
            border: `1px solid ${s.isWarning && Number(s.value) > 0 ? s.color + '44' : 'var(--border)'}`,
            borderBottom: `3px solid ${s.color}`,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = s.color + '88';
            (e.currentTarget as HTMLDivElement).style.borderBottomColor = s.color;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${s.color}18`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = s.isWarning && Number(s.value) > 0 ? s.color + '44' : 'var(--border)';
            (e.currentTarget as HTMLDivElement).style.borderBottomColor = s.color;
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          <div className="mb-3" style={{ transition: 'transform 0.25s ease', display: 'inline-block' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1) rotate(4deg)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) rotate(0deg)'; }}
          >
            <img src={s.icon} alt="" width={40} height={40} loading="lazy" style={{ display: 'block' }} />
          </div>
          <div
            className="text-3xl font-bold mb-1"
            style={{ color: s.isWarning && Number(s.value) > 0 ? s.color : 'var(--text)' }}
          >
            {s.value}
          </div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          {s.change && (
            <div className="text-xs mt-1.5 font-semibold" style={{ color: s.color }}>{s.change}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsWidget({ projects, title = 'Recent Projects' }: { projects: any[]; title?: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</h2>
        <Link href="/dashboard/projects" className="text-xs" style={{ color: 'var(--blue)' }}>View all →</Link>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <img src="/icons/3d/projects.svg" alt="" width={48} height={48} className="mx-auto mb-2" />
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>No projects yet</p>
          <Link href="/dashboard/projects" className="px-4 py-2 gradient-bg rounded-lg text-sm font-semibold text-white hover:opacity-90 transition inline-block">Create project</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.slice(0, 5).map((p: any) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: 'var(--surface)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--card-hover, var(--border))'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)'; }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color || '#7c6fe0' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                {p.client_name ? (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium inline-block mt-0.5"
                    style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    {p.client_name}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No client</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-16 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.progress || 0}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{p.progress || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TasksWidget({ tasks, title = 'My Tasks', emptyMsg = 'No tasks assigned' }: { tasks: any[]; title?: string; emptyMsg?: string }) {
  const pc: Record<string, string> = { high: '#ef5350', medium: '#ffc107', low: '#4caf82' };
  const statusColor: Record<string, { bg: string; text: string }> = {
    done:        { bg: '#4caf8222', text: '#4caf82' },
    in_progress: { bg: '#4a9eff22', text: '#4a9eff' },
    review:      { bg: '#ffc10722', text: '#ffc107' },
    todo:        { bg: 'var(--surface)', text: 'var(--text-muted)' },
  };
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</h2>
        <Link href="/dashboard/tasks" className="text-xs" style={{ color: 'var(--blue)' }}>View all →</Link>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{emptyMsg}</p>
          <Link href="/dashboard/tasks" className="px-4 py-2 gradient-bg rounded-lg text-sm font-semibold text-white hover:opacity-90 transition inline-block">Browse tasks</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.slice(0, 6).map((t: any) => {
            const sc = statusColor[t.status] || statusColor.todo;
            const borderColor = pc[t.priority] || '#7b7fa8';
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-xl overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  borderLeft: `3px solid ${borderColor}`,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--card-hover, var(--border))'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)'; }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{t.title}</p>
                  {t.due_date && (
                    <p className="text-xs mt-0.5" style={{ color: new Date(t.due_date) < new Date() && t.status !== 'done' ? '#ef5350' : 'var(--text-muted)' }}>
                      Due {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 capitalize"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  {t.status?.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeamWidget({ team }: { team: any[] }) {
  const ROLE_COLOR: Record<string, string> = { admin: '#ef5350', manager: '#ffc107', member: '#4a9eff', viewer: '#7b7fa8' };
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Team</h2>
        <Link href="/dashboard/team" className="text-xs" style={{ color: 'var(--blue)' }}>View all →</Link>
      </div>
      <div className="space-y-2">
        {team.slice(0, 6).map((m: any) => (
          <div key={m.user_id || m.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--surface)' }}>
            <Avatar name={m.name} size={28} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{m.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.email}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize flex-shrink-0"
              style={{ background: (ROLE_COLOR[m.role] || '#7b7fa8') + '22', color: ROLE_COLOR[m.role] || '#7b7fa8' }}>
              {m.role}
            </span>
          </div>
        ))}
        {team.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No team members yet</p>}
      </div>
    </div>
  );
}

// ── Role dashboards ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks]       = useState<any[]>([]);
  const [team, setTeam]         = useState<any[]>([]);
  const [stats, setStats]       = useState<any>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/projects').then(r => r.data).catch(() => []),
      apiClient.get('/tasks').then(r => r.data).catch(() => []),
      apiClient.get('/team').then(r => r.data).catch(() => []),
      apiClient.get('/dashboard/stats').then(r => r.data).catch(() => null),
    ]).then(([p, t, tm, s]) => {
      setProjects(Array.isArray(p) ? p : []);
      setTasks(Array.isArray(t) ? t : []);
      setTeam(Array.isArray(tm) ? tm : []);
      setStats(s);
    }).finally(() => setLoading(false));
  }, []);

  const myTasks    = tasks.filter(t => t.assignee_id === user?.id);
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const doneCount  = tasks.filter(t => t.status === 'done').length;
  const overdue    = tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Greeting />
      <QuickActions />
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}
        </div>
      ) : (
        <StatCards stats={[
          { icon: '/icons/3d/projects.svg',     label: 'Active Projects',   value: stats?.activeProjects ?? projects.filter(p => p.status !== 'completed').length, color: 'var(--blue)' },
          { icon: '/icons/3d/tasks.svg',         label: 'Open Tasks',         value: stats?.openTasks ?? tasks.filter(t => t.status !== 'done').length,               color: 'var(--purple)' },
          { icon: '/icons/3d/clock-broken.svg',  label: 'Overdue',            value: stats?.overdueCount ?? overdue,                                                   color: 'var(--red)',    isWarning: true },
          { icon: '/icons/3d/clients.svg',       label: 'Team Members',       value: stats?.teamCount ?? team.length,                                                  color: 'var(--teal)' },
        ]} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <ProjectsWidget projects={projects} />
        </div>
        <div className="flex flex-col gap-6">
          <TasksWidget tasks={myTasks.length > 0 ? myTasks : tasks} title={myTasks.length > 0 ? 'My Tasks' : 'All Tasks'} />
          <TeamWidget team={team} />
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects]         = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [teamTasks, setTeamTasks]       = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/projects').then(r => r.data).catch(() => []),
      apiClient.get('/tasks?status=review').then(r => r.data).catch(() => []),
      apiClient.get('/tasks').then(r => r.data).catch(() => []),
    ]).then(([p, rev, t]) => {
      setProjects(Array.isArray(p) ? p : []);
      setPendingReviews(Array.isArray(rev) ? rev : []);
      setTeamTasks(Array.isArray(t) ? t : []);
    }).finally(() => setLoading(false));
  }, []);

  const overdue = teamTasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length;
  const myProjects = projects.filter(p => p.manager_id === user?.id || p.manager_name === user?.name);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Greeting subtitle="Here's what your team is working on." />
      <QuickActions />
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}
        </div>
      ) : (
        <StatCards stats={[
          { icon: '/icons/3d/projects.svg',    label: 'My Projects',     value: myProjects.length,          color: 'var(--blue)' },
          { icon: '/icons/3d/review.svg',      label: 'Needs Review',    value: pendingReviews.length,       color: 'var(--yellow)', isWarning: pendingReviews.length > 0 },
          { icon: '/icons/3d/tasks.svg',       label: 'Team Open Tasks', value: teamTasks.filter(t => t.status !== 'done').length, color: 'var(--purple)' },
          { icon: '/icons/3d/clock-broken.svg',label: 'Overdue Tasks',   value: overdue,                     color: 'var(--red)', isWarning: overdue > 0 },
        ]} />
      )}

      {pendingReviews.length > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--yellow)' }}>
            👀 {pendingReviews.length} task{pendingReviews.length !== 1 ? 's' : ''} waiting for your review
          </div>
          <div className="space-y-2">
            {pendingReviews.slice(0, 4).map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#ffc107' }} />
                <p className="flex-1 text-sm" style={{ color: 'var(--text)' }}>{t.title}</p>
                <Link href="/dashboard/tasks" className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)' }}>Review</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsWidget projects={myProjects.length ? myProjects : projects} title="My Projects" />
        <TasksWidget tasks={teamTasks} title="Team Tasks" emptyMsg="No open tasks" />
      </div>
    </div>
  );
}

function MemberDashboard() {
  const { user } = useAuthStore();
  const [myTasks, setMyTasks]     = useState<any[]>([]);
  const [projects, setProjects]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/tasks').then(r => r.data).catch(() => []),
      apiClient.get('/projects').then(r => r.data).catch(() => []),
    ]).then(([t, p]) => {
      const allTasks = Array.isArray(t) ? t : [];
      const mine = allTasks.filter((task: any) => task.assignee_id === user?.id);
      setMyTasks(mine.length > 0 ? mine : allTasks);
      setProjects(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  }, []);

  const openTasks = myTasks.filter(t => t.status !== 'done');
  const dueToday  = myTasks.filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const doneTasks = myTasks.filter(t => t.status === 'done');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Greeting subtitle="Here's what you're working on today." />
      <QuickActions />
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}
        </div>
      ) : (
        <StatCards stats={[
          { icon: '/icons/3d/tasks.svg',        label: 'My Open Tasks',  value: openTasks.length, color: 'var(--blue)' },
          { icon: '/icons/3d/clock-broken.svg', label: 'Due Today',       value: dueToday.length,  color: 'var(--yellow)', isWarning: dueToday.length > 0 },
          { icon: '/icons/3d/target.svg',       label: 'Completed',       value: doneTasks.length, color: 'var(--green)' },
          { icon: '/icons/3d/projects.svg',     label: 'My Projects',     value: projects.length,  color: 'var(--purple)' },
        ]} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksWidget tasks={openTasks} title="My Tasks" emptyMsg="All caught up! 🎉" />
        <ProjectsWidget projects={projects} />
      </div>
    </div>
  );
}

function ClientDashboard() {
  const [projects, setProjects]            = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading]              = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/projects').then(r => r.data).catch(() => []),
      apiClient.get('/tasks?status=client_approval').then(r => r.data).catch(() => []),
    ]).then(([p, a]) => {
      setProjects(Array.isArray(p) ? p : []);
      setPendingApprovals(Array.isArray(a) ? a : []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Greeting subtitle="Here's how your projects are going." />

      {pendingApprovals.length > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(74,158,255,0.06)', border: '1px solid rgba(74,158,255,0.2)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--blue)' }}>
            🔔 {pendingApprovals.length} item{pendingApprovals.length !== 1 ? 's' : ''} waiting for your approval
          </div>
          <div className="space-y-2">
            {pendingApprovals.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)' }}>
                <p className="flex-1 text-sm" style={{ color: 'var(--text)' }}>{item.title}</p>
                <Link href="/dashboard/tasks" className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>Review</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectsWidget projects={projects} title="Your Projects" />
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (user?.role === 'manager') return <ManagerDashboard />;
  if (user?.role === 'member')  return <MemberDashboard />;
  if (user?.role === 'client')  return <ClientDashboard />;
  return <AdminDashboard />;   // admin + default
}
