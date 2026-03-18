'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  on_hold: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e','#3b82f6','#ec4899','#14b8a6','#f97316'];

const INPUT = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition';
const LABEL = 'block text-xs font-medium text-slate-400 mb-1.5';

type ProjectForm = {
  name: string; description: string; color: string;
  clientId: string; teamMembers: string[];
  status: string; deadline: string; budget: string;
};

const EMPTY_FORM: ProjectForm = {
  name: '', description: '', color: '#6366f1',
  clientId: '', teamMembers: [], status: 'active',
  deadline: '', budget: '',
};

function ProjectModal({ project, clients, teamMembers, onClose, onSaved }: {
  project?: any; clients: any[]; teamMembers: any[]; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!project;
  const [form, setForm] = useState<ProjectForm>(project ? {
    name: project.name || '', description: project.description || '',
    color: project.color || '#6366f1', clientId: project.client_id || '',
    teamMembers: project.team_members || [], status: project.status || 'active',
    deadline: project.deadline ? project.deadline.slice(0, 10) : '',
    budget: project.budget || '',
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function toggleMember(id: string) {
    setForm(f => ({
      ...f,
      teamMembers: f.teamMembers.includes(id) ? f.teamMembers.filter(x => x !== id) : [...f.teamMembers, id],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, budget: form.budget ? Number(form.budget) : undefined, endDate: form.deadline || undefined, deadline: undefined };
      if (isEdit) await apiClient.patch(`/projects/${project.id}`, payload);
      else await apiClient.post('/projects', payload);
      toast.success(isEdit ? 'Project updated' : 'Project created');
      onSaved(); onClose();
    } catch { toast.error('Failed to save project'); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-lg">{isEdit ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {/* Name + Color */}
          <div className="flex gap-3 items-end">
            <div className="flex-1"><label className={LABEL}>Project Name *</label>
              <input className={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Website Redesign" />
            </div>
            <div>
              <label className={LABEL}>Color</label>
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-6 h-6 rounded-full border-2 transition ${form.color === c ? 'border-white scale-110' : 'border-transparent hover:border-white/40'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <textarea className={INPUT + ' resize-none'} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief project description..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Client */}
            <div>
              <label className={LABEL}>Client</label>
              <select className={INPUT} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
              </select>
            </div>
            {/* Status */}
            <div>
              <label className={LABEL}>Status</label>
              <select className={INPUT} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Deadline</label>
              <input type="date" className={INPUT} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
            <div>
              <label className={LABEL}>Budget ($)</label>
              <input type="number" min="0" className={INPUT} value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="0" />
            </div>
          </div>

          {/* Team members */}
          {teamMembers.length > 0 && (
            <div>
              <label className={LABEL}>Assign Team Members</label>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map(m => {
                  const selected = form.teamMembers.includes(m.id);
                  return (
                    <button key={m.id} type="button" onClick={() => toggleMember(m.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${selected ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold" style={{ fontSize: 9 }}>
                        {m.name?.[0]?.toUpperCase()}
                      </span>
                      {m.name}
                      {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    Promise.all([
      apiClient.get('/projects').then(r => setProjects(r.data || [])),
      apiClient.get('/clients').then(r => setClients(r.data || [])).catch(() => {}),
      apiClient.get('/org/team').then(r => setTeamMembers(r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  async function load() {
    try { const r = await apiClient.get('/projects'); setProjects(r.data || []); }
    catch { toast.error('Failed to load'); }
  }
  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    try { await apiClient.delete(`/projects/${id}`); setProjects(p => p.filter(x => x.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  }

  const statuses = ['all', 'active', 'on_hold', 'completed', 'cancelled'];
  const filtered = filter === 'all' ? projects : projects.filter(p => (p.status || 'active') === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditProject(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </button>
      </div>

      {/* Status filter */}
      {projects.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${filter === s ? 'gradient-bg text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}>
              {s === 'all' ? `All (${projects.length})` : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      {(showModal || editProject !== null) && (
        <ProjectModal
          project={editProject}
          clients={clients}
          teamMembers={teamMembers}
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSaved={load}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <img src="/icons/3d/projects.svg" alt="" className="w-20 h-20 mx-auto mb-4 opacity-80" />
          <p className="text-slate-400 mb-2 font-medium">{filter !== 'all' ? `No ${filter.replace('_',' ')} projects` : 'No projects yet'}</p>
          {filter === 'all' && <button onClick={() => setShowModal(true)} className="mt-4 px-6 py-3 gradient-bg rounded-xl font-semibold text-white text-sm">Create First Project</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: any) => (
            <div key={p.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all hover:-translate-y-0.5 group cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: p.color || '#6366f1' }}>
                  {p.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.client_name || 'No client'}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => { setEditProject(p); setShowModal(true); }} className="p-1 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => deleteProject(p.id)} className="p-1 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>

              <span className={`inline-flex text-[10px] px-2 py-0.5 rounded-full font-semibold border mb-3 ${STATUS_COLORS[p.status || 'active']}`}>
                {(p.status || 'active').replace('_',' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>

              {p.description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>}

              {/* Meta row */}
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 flex-wrap">
                {p.deadline && (
                  <span className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {new Date(p.deadline).toLocaleDateString()}
                  </span>
                )}
                {p.budget && (
                  <span className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    ${Number(p.budget).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progress</span><span>{p.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.progress || 0}%`, background: p.color || '#6366f1' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
