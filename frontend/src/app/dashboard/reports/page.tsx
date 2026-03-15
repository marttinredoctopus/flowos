'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#4f8cff', '#7c3aed', '#f472b6', '#34d399', '#fb923c', '#a78bfa'];

type ReportTab = 'overview' | 'projects' | 'team' | 'finance';

function KpiCard({ label, value, sub, color = '#4f8cff' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-5">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-display font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function Skeleton() {
  return <div className="bg-white/5 rounded-2xl animate-pulse h-48" />;
}

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('overview');
  const [overview, setOverview] = useState<any>(null);
  const [tasksTime, setTasksTime] = useState<any[]>([]);
  const [projStatus, setProjStatus] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const calls = [
      apiClient.get('/reports/overview').then(r => setOverview(r.data)).catch(() => {}),
      apiClient.get('/reports/tasks-over-time').then(r => setTasksTime(r.data || [])).catch(() => {}),
      apiClient.get('/reports/project-status').then(r => setProjStatus(r.data || [])).catch(() => {}),
      apiClient.get('/reports/projects').then(r => setProjects(r.data || [])).catch(() => {}),
      apiClient.get('/reports/workload').then(r => setWorkload(r.data || [])).catch(() => {}),
      apiClient.get('/reports/team').then(r => setTeam(r.data || [])).catch(() => {}),
      apiClient.get('/reports/revenue').then(r => setRevenue(r.data || [])).catch(() => {}),
      apiClient.get('/reports/finance').then(r => setFinance(r.data)).catch(() => {}),
    ];
    Promise.all(calls).finally(() => setLoading(false));
  }, []);

  const TABS: { id: ReportTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'team', label: 'Team' },
    { id: 'finance', label: 'Finance' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Reports & Analytics</h1>
        <div className="flex gap-1 bg-white/5 border border-white/5 rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard label="Total Projects" value={overview?.projects?.total ?? 0} sub={`${overview?.projects?.byStatus?.active ?? 0} active`} />
              <KpiCard label="Total Tasks" value={overview?.tasks?.total ?? 0} sub={`${overview?.tasks?.byStatus?.done ?? 0} completed`} color="#34d399" />
              <KpiCard label="Clients" value={overview?.clients?.total ?? 0} color="#f472b6" />
              <KpiCard label="Hours Logged" value={Math.round((overview?.timeTracking?.totalSeconds ?? 0) / 3600)} sub="total hours" color="#fb923c" />
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Tasks Over Time</h3>
              {loading ? <Skeleton /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={tasksTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Legend />
                    <Line type="monotone" dataKey="created" stroke="#4f8cff" strokeWidth={2} dot={false} name="Created" />
                    <Line type="monotone" dataKey="completed" stroke="#34d399" strokeWidth={2} dot={false} name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Project Status</h3>
              {loading ? <Skeleton /> : projStatus.length === 0 ? (
                <div className="flex items-center justify-center h-[220px] text-slate-500 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={projStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {projStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="font-semibold text-white">Project Progress</h3>
          </div>
          {loading ? (
            <div className="p-6"><Skeleton /></div>
          ) : (
            <div className="divide-y divide-white/5">
              {projects.map((p: any) => {
                const progress = p.task_count > 0 ? Math.round((p.done_count / p.task_count) * 100) : p.progress || 0;
                return (
                  <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">{p.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          p.status === 'active' ? 'bg-green-500/10 text-green-400' :
                          p.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-white/5 text-slate-400'
                        }`}>{p.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full gradient-bg rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{progress}%</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">{p.done_count}/{p.task_count} tasks</p>
                      <p className="text-xs text-slate-500">{p.client_name || 'No client'}</p>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No projects yet</div>}
            </div>
          )}
        </div>
      )}

      {tab === 'team' && (
        <div className="space-y-6">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Team Workload</h3>
            {loading ? <Skeleton /> : workload.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-slate-500 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workload} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Legend />
                  <Bar dataKey="active_tasks" name="Active Tasks" fill="#4f8cff" radius={[4,4,0,0]} />
                  <Bar dataKey="completed_tasks" name="Completed" fill="#34d399" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5"><h3 className="font-semibold text-white">Team Activity</h3></div>
            <div className="divide-y divide-white/5">
              {team.map((m: any) => (
                <div key={m.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{m.name?.[0]?.toUpperCase()}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white">{m.name}</p><p className="text-xs text-slate-500 capitalize">{m.role}</p></div>
                  <div className="flex gap-6 text-center">
                    <div><p className="text-sm font-bold text-white">{m.open_tasks || 0}</p><p className="text-xs text-slate-500">Open</p></div>
                    <div><p className="text-sm font-bold text-green-400">{m.done_tasks || 0}</p><p className="text-xs text-slate-500">Done</p></div>
                  </div>
                </div>
              ))}
              {team.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No team members yet</div>}
            </div>
          </div>
        </div>
      )}

      {tab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Total Invoiced" value={`$${Number(finance?.summary?.total_invoiced || 0).toLocaleString()}`} />
            <KpiCard label="Collected" value={`$${Number(finance?.summary?.total_collected || 0).toLocaleString()}`} color="#34d399" />
            <KpiCard label="Overdue" value={`$${Number(finance?.summary?.total_overdue || 0).toLocaleString()}`} color="#f87171" />
            <KpiCard label="Draft" value={`$${Number(finance?.summary?.total_draft || 0).toLocaleString()}`} color="#94a3b8" />
          </div>
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Revenue Over Time</h3>
            {loading ? <Skeleton /> : revenue.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-slate-500 text-sm">No invoice data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="invoiced" stroke="#4f8cff" strokeWidth={2} dot={false} name="Invoiced" />
                  <Line type="monotone" dataKey="collected" stroke="#34d399" strokeWidth={2} dot={false} name="Collected" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {finance?.recentInvoices?.length > 0 && (
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5"><h3 className="font-semibold text-white">Recent Invoices</h3></div>
              <div className="divide-y divide-white/5">
                {finance.recentInvoices.map((inv: any) => (
                  <div key={inv.invoice_number} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{inv.invoice_number}</p>
                      <p className="text-xs text-slate-500">{inv.client_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">${Number(inv.total_amount).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                        inv.status === 'overdue' ? 'bg-red-500/10 text-red-400' :
                        inv.status === 'sent' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-white/5 text-slate-400'
                      }`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
