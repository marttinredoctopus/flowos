'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  on_hold: 'bg-yellow-500/20 text-yellow-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#4f8cff' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/projects'); setProjects(r.data || []); }
    catch {} finally { setLoading(false); }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await apiClient.post('/projects', form); setForm({ name: '', description: '', color: '#4f8cff' }); setShowForm(false); load(); }
    catch {} finally { setSaving(false); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projects total</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ New Project</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display text-lg font-bold mb-4">New Project</h2>
            <form onSubmit={create} className="space-y-4">
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Project name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <textarea className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 resize-none" placeholder="Description" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="flex items-center gap-3"><label className="text-sm text-slate-400">Color:</label><input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24"><div className="text-5xl mb-4">📁</div><p className="text-slate-400 mb-6">No projects yet. Create your first one!</p><button onClick={() => setShowForm(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Create Project</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p: any) => (
            <div key={p.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all hover:-translate-y-0.5 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold text-white" style={{ background: p.color || '#4f8cff' }}>
                  {p.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.client_name || 'No client'}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || 'bg-white/5 text-slate-400'}`}>{p.status || 'active'}</span>
              </div>
              {p.description && <p className="text-sm text-slate-400 mb-4 line-clamp-2">{p.description}</p>}
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>Progress</span><span>{p.progress || 0}%</span></div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full gradient-bg rounded-full transition-all" style={{ width: `${p.progress || 0}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
