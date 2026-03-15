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
  const [form, setForm] = useState({ title: '', priority: 'medium', status: 'todo', description: '', link: '', dueDate: '' });
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const [editDesc, setEditDesc] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editingField, setEditingField] = useState<'desc' | 'link' | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try { const r = await apiClient.get('/tasks'); setTasks(r.data || []); }
    catch {} finally { setLoading(false); }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      await apiClient.post('/tasks', {
        title: form.title, priority: form.priority, status: form.status,
        description: form.description || undefined,
        dueDate: form.dueDate || undefined,
      });
      setForm({ title: '', priority: 'medium', status: 'todo', description: '', link: '', dueDate: '' });
      setShowForm(false); load();
    } catch {} finally { setSaving(false); }
  }

  async function openTask(t: any) {
    setSelected(t);
    setEditDesc(t.description || '');
    setEditLink(t.link || '');
    setEditingField(null);
    setCommentText('');
    try { const r = await apiClient.get(`/tasks/${t.id}/comments`); setComments(r.data || []); }
    catch { setComments([]); }
  }

  async function saveField(field: 'desc' | 'link') {
    if (!selected) return;
    const body = field === 'desc' ? { description: editDesc } : { link: editLink };
    try {
      await apiClient.patch(`/tasks/${selected.id}`, body);
      setSelected({ ...selected, ...body });
      setTasks(ts => ts.map(t => t.id === selected.id ? { ...t, ...body } : t));
    } catch {}
    setEditingField(null);
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !selected) return;
    setSavingComment(true);
    try {
      const r = await apiClient.post(`/tasks/${selected.id}/comments`, { body: commentText.trim() });
      setComments(prev => [...prev, r.data]);
      setCommentText('');
    } catch {} finally { setSavingComment(false); }
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

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display text-lg font-bold mb-4">New Task</h2>
            <form onSubmit={create} className="space-y-4">
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Task title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <textarea className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 resize-none" placeholder="Description (optional)" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Link (optional)" type="url" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="low">Low Priority</option><option value="medium">Medium Priority</option><option value="high">High Priority</option>
                </select>
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="review">Review</option><option value="done">Done</option>
                </select>
              </div>
              <input type="date" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-white/5">
              <div className="flex-1 pr-4">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">{selected.status?.replace('_',' ')}</p>
                <h2 className="font-display text-xl font-bold text-white">{selected.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[selected.priority] || ''}`}>{selected.priority}</span>
                  {selected.due_date && <span className="text-xs text-slate-500">Due: {new Date(selected.due_date).toLocaleDateString()}</span>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition text-xl flex-shrink-0">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Description</label>
                  {editingField !== 'desc' && <button onClick={() => { setEditingField('desc'); setEditDesc(selected.description || ''); }} className="text-xs text-brand-blue hover:opacity-80">Edit</button>}
                </div>
                {editingField === 'desc' ? (
                  <div className="space-y-2">
                    <textarea className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 resize-none" rows={4} placeholder="Add description..." value={editDesc} onChange={e => setEditDesc(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveField('desc')} className="px-4 py-1.5 gradient-bg rounded-lg text-xs font-semibold text-white">Save</button>
                      <button onClick={() => setEditingField(null)} className="px-4 py-1.5 border border-white/10 rounded-lg text-xs text-slate-400">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed min-h-[2rem]">{selected.description || <span className="text-slate-600 italic">No description. Click Edit to add one.</span>}</p>
                )}
              </div>

              {/* Link */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Link</label>
                  {editingField !== 'link' && <button onClick={() => { setEditingField('link'); setEditLink(selected.link || ''); }} className="text-xs text-brand-blue hover:opacity-80">Edit</button>}
                </div>
                {editingField === 'link' ? (
                  <div className="space-y-2">
                    <input className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" type="url" placeholder="https://..." value={editLink} onChange={e => setEditLink(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveField('link')} className="px-4 py-1.5 gradient-bg rounded-lg text-xs font-semibold text-white">Save</button>
                      <button onClick={() => setEditingField(null)} className="px-4 py-1.5 border border-white/10 rounded-lg text-xs text-slate-400">Cancel</button>
                    </div>
                  </div>
                ) : selected.link ? (
                  <a href={selected.link} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline break-all">{selected.link}</a>
                ) : (
                  <p className="text-sm text-slate-600 italic">No link added.</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-3">Comments ({comments.length})</label>
                <div className="space-y-3 mb-4">
                  {comments.map(c => (
                    <div key={c.id} className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">{c.name?.[0]?.toUpperCase() || '?'}</div>
                        <span className="text-xs font-semibold text-white">{c.name || 'User'}</span>
                        <span className="text-[10px] text-slate-600 ml-auto">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pl-8">{c.body}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-sm text-slate-600 italic text-center py-4">No comments yet.</p>}
                </div>
                <form onSubmit={addComment} className="flex gap-2">
                  <input className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                  <button type="submit" disabled={savingComment || !commentText.trim()} className="px-4 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">{savingComment ? '...' : 'Send'}</button>
                </form>
              </div>
            </div>
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
                    <div key={t.id} onClick={() => openTask(t)} className="bg-[#0a0d12] border border-white/5 rounded-xl p-3 hover:border-brand-blue/30 transition cursor-pointer">
                      <p className="text-sm text-white mb-2 leading-snug">{t.title}</p>
                      {t.description && <p className="text-xs text-slate-500 mb-2 truncate">{t.description}</p>}
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
            <div key={t.id} onClick={() => openTask(t)} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition cursor-pointer ${i !== 0 ? 'border-t border-white/5' : ''}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-yellow-400' : 'bg-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{t.title}</p>
                {t.description && <p className="text-xs text-slate-500 truncate">{t.description}</p>}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${t.status === 'done' ? 'bg-green-500/15 text-green-400' : t.status === 'in_progress' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-slate-400'}`}>{t.status?.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
