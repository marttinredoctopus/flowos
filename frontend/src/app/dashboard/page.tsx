'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, t] = await Promise.all([
          apiClient.get('/projects').then(r => r.data).catch(() => []),
          apiClient.get('/tasks').then(r => r.data).catch(() => []),
        ]);
        setProjects(Array.isArray(p) ? p : []);
        setTasks(Array.isArray(t) ? t : []);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const myTasks = tasks.filter(t => t.assignee_id === user?.id);
  const doneTasks = tasks.filter(t => t.status === 'done');
  const inProgress = tasks.filter(t => t.status === 'in_progress');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your agency overview for today.</p>
        </div>
        <NotificationBell />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length, icon: '📁', color: 'text-brand-blue', href: '/dashboard/projects' },
          { label: 'My Tasks', value: myTasks.length, icon: '✅', color: 'text-brand-purple', href: '/dashboard/tasks' },
          { label: 'In Progress', value: inProgress.length, icon: '⚡', color: 'text-yellow-400', href: '/dashboard/tasks' },
          { label: 'Completed', value: doneTasks.length, icon: '🏆', color: 'text-green-400', href: '/dashboard/tasks' },
        ].map(s => (
          <Link key={s.label} href={s.href} className="p-5 rounded-2xl bg-[#0f1117] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-0.5 cursor-pointer">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display text-3xl font-bold mb-1 ${s.color}`}>{loading ? '–' : s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-brand-blue text-xs hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">📁</div>
              <p className="text-slate-400 text-sm mb-4">No projects yet</p>
              <Link href="/dashboard/projects" className="px-4 py-2 gradient-bg rounded-lg text-sm font-medium text-white">Create project</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer group">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color || '#4f8cff' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-brand-blue transition">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.client_name || 'No client'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full gradient-bg rounded-full" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{p.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold">My Tasks</h2>
            <Link href="/dashboard/tasks" className="text-brand-blue text-xs hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}</div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-slate-400 text-sm mb-4">No tasks assigned</p>
              <Link href="/dashboard/tasks" className="px-4 py-2 gradient-bg rounded-lg text-sm font-medium text-white">Browse tasks</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-yellow-400' : 'bg-slate-500'}`} />
                  <p className="flex-1 text-sm text-white truncate">{t.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    t.status === 'done' ? 'bg-green-500/20 text-green-400' :
                    t.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/5 text-slate-400'}`}>
                    {t.status?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
