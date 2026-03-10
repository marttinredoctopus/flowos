'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

function formatHours(seconds: number) {
  const h = Math.round(seconds / 3600);
  return h > 0 ? `${h}h` : `${Math.round(seconds / 60)}m`;
}

export default function ReportsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/reports/overview').then(r => r.data).catch(() => null),
      apiClient.get('/reports/projects').then(r => r.data).catch(() => []),
    ]).then(([ov, pr]) => {
      setOverview(ov);
      setProjects(pr || []);
    }).finally(() => setLoading(false));
  }, []);

  const totalTasks = overview?.tasks?.total || 0;
  const doneTasks = overview?.tasks?.byStatus?.done || 0;
  const completion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8"><h1 className="font-display text-2xl font-bold text-white">Reports</h1><p className="text-slate-400 text-sm mt-1">Agency performance overview</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: overview?.projects?.total ?? 0, icon: '📁', color: 'text-brand-blue' },
          { label: 'Total Tasks', value: totalTasks, icon: '✅', color: 'text-brand-purple' },
          { label: 'Completed', value: doneTasks, icon: '🏆', color: 'text-green-400' },
          { label: 'Clients', value: overview?.clients?.total ?? 0, icon: '👥', color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display text-3xl font-bold mb-1 ${s.color}`}>{loading ? '–' : s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-5">Task Completion Rate</h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full gradient-bg rounded-full transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <span className="font-display text-xl font-bold gradient-text w-14 text-right">{completion}%</span>
          </div>
          <p className="text-slate-500 text-sm">{doneTasks} of {totalTasks} tasks completed</p>
          {overview?.tasks?.byStatus && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[['todo','To Do','text-slate-400'],['in_progress','In Progress','text-yellow-400'],['done','Done','text-green-400']].map(([k,l,c]) => (
                <div key={k} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className={`font-bold text-xl ${c}`}>{overview.tasks.byStatus[k] || 0}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-5">Time Tracked</h2>
          <div className="font-display text-4xl font-bold gradient-text mb-1">
            {loading ? '–' : formatHours(overview?.timeTracking?.totalSeconds || 0)}
          </div>
          <p className="text-slate-400 text-sm mb-4">Total time logged</p>
          {overview?.campaigns && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white font-bold">{Number(overview.campaigns.impressions || 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500">Impressions</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white font-bold">{Number(overview.campaigns.clicks || 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500">Clicks</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {projects.length > 0 && (
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-5">Project Progress</h2>
          <div className="space-y-4">
            {projects.map((p: any) => {
              const pct = p.task_count > 0 ? Math.round((p.done_count / p.task_count) * 100) : 0;
              return (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color || '#4f8cff' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full gradient-bg rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 flex-shrink-0 w-20 text-right">{p.done_count}/{p.task_count} tasks</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
