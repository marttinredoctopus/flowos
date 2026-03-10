'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-brand-blue' },
  { id: 'review', label: 'Review', color: 'bg-yellow-500' },
  { id: 'done', label: 'Done', color: 'bg-green-500' },
];

const PRIORITY_COLORS: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  low: 'text-slate-400 bg-white/5',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'medium', status: 'todo' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/tasks'); setTasks(r.data || []); }
    catch {} finally { setLoading(false); }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await apiClient.post('/tasks', form); setForm({ title: '', priority: 'medium', status: 'todo' }); setShowForm(false); load(); }
    catch {} finally { setSaving(false); }
  }

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">{tasks.length} tasks total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-lg text-sm transition ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Kanban</button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm transition ${view === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>List</button>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ New Task</button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display text-lg font-bold mb-4">New Task</h2>
            <form onSubmit={create} className="space-y-4">
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Task title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low Priority</option><option value="medium">Medium Priority</option><option value="high">High Priority</option>
              </select>
              <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="review">Review</option><option value="done">Done</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : view === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <span className="text-sm font-semibold text-white">{col.label}</span>
                  <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {colTasks.map(t => (
                    <div key={t.id} className="bg-[#0a0d12] border border-white/5 rounded-xl p-3 hover:border-white/10 transition cursor-pointer">
                      <p className="text-sm text-white mb-2 leading-snug">{t.title}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[t.priority] || ''}`}>{t.priority}</span>
                        {t.due_date && <span className="text-[10px] text-slate-500">{new Date(t.due_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-16"><div className="text-4xl mb-3">✅</div><p className="text-slate-400">No tasks yet</p></div>
          ) : tasks.map((t, i) => (
            <div key={t.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition cursor-pointer ${i !== 0 ? 'border-t border-white/5' : ''}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-yellow-400' : 'bg-slate-500'}`} />
              <p className="flex-1 text-sm text-white">{t.title}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full ${t.status === 'done' ? 'bg-green-500/15 text-green-400' : t.status === 'in_progress' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-slate-400'}`}>{t.status?.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
