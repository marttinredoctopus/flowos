'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#7b7fa8', dim: '#7b7fa822' },
  { id: 'in_progress', label: 'In Progress', color: '#4a9eff', dim: '#4a9eff22' },
  { id: 'review', label: 'Review', color: '#ffc107', dim: '#ffc10722' },
  { id: 'done', label: 'Done', color: '#4caf82', dim: '#4caf8222' },
];

const PRIORITY_CONFIG: Record<string, { color: string; dim: string; label: string }> = {
  high:   { color: '#ef5350', dim: '#ef535022', label: 'High' },
  medium: { color: '#ffc107', dim: '#ffc10722', label: 'Medium' },
  low:    { color: '#4caf82', dim: '#4caf8222', label: 'Low' },
};

export default function TasksPage() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
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

  const inputStyle = {
    background: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
  };
  const inputFocusStyle = 'focus:outline-none focus:ring-1';

  return (
    <div className="p-5 max-w-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>Tasks</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tasks.length} tasks total</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg p-0.5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {(['kanban', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold transition capitalize"
                style={{
                  background: view === v ? 'var(--purple-dim)' : 'transparent',
                  color: view === v ? 'var(--purple-light)' : 'var(--text-muted)',
                }}>
                {v === 'kanban' ? '⊞ Board' : '☰ List'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition">
            <span>+</span> New Task
          </button>
        </div>
      </div>

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border-hover)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>New Task</h2>
              <button onClick={() => setShowForm(false)} className="text-lg transition" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <form onSubmit={create} className="space-y-3">
              <input
                className={`w-full px-4 py-3 rounded-xl text-sm placeholder-slate-500 ${inputFocusStyle}`}
                style={inputStyle}
                placeholder="Task title *"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
              />
              <textarea
                className={`w-full px-4 py-3 rounded-xl text-sm placeholder-slate-500 resize-none ${inputFocusStyle}`}
                style={inputStyle}
                placeholder="Description (optional)"
                rows={2}
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <select className={`w-full px-4 py-3 rounded-xl text-sm ${inputFocusStyle}`} style={inputStyle} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
                <select className={`w-full px-4 py-3 rounded-xl text-sm ${inputFocusStyle}`} style={inputStyle} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <input
                type="date"
                className={`w-full px-4 py-3 rounded-xl text-sm ${inputFocusStyle}`}
                style={inputStyle}
                value={form.dueDate}
                onChange={e => setForm({...form, dueDate: e.target.value})}
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                  {saving ? 'Creating…' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border-hover)' }}>
            <div className="flex items-start justify-between p-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  {/* Priority badge */}
                  {selected.priority && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: PRIORITY_CONFIG[selected.priority]?.dim || 'transparent',
                        color: PRIORITY_CONFIG[selected.priority]?.color || 'var(--text-muted)',
                      }}>
                      {PRIORITY_CONFIG[selected.priority]?.label}
                    </span>
                  )}
                  {/* Status badge */}
                  {(() => {
                    const col = COLUMNS.find(c => c.id === selected.status);
                    return col ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: col.dim, color: col.color }}>
                        {col.label}
                      </span>
                    ) : null;
                  })()}
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{selected.title}</h2>
                {selected.due_date && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Due: {new Date(selected.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="text-xl transition flex-shrink-0" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Description</label>
                  {editingField !== 'desc' && (
                    <button onClick={() => { setEditingField('desc'); setEditDesc(selected.description || ''); }}
                      className="text-xs font-medium transition" style={{ color: 'var(--purple-light)' }}>Edit</button>
                  )}
                </div>
                {editingField === 'desc' ? (
                  <div className="space-y-2">
                    <textarea className={`w-full px-3 py-2.5 rounded-xl text-sm placeholder-slate-500 resize-none ${inputFocusStyle}`}
                      style={inputStyle} rows={4} placeholder="Add description…" value={editDesc}
                      onChange={e => setEditDesc(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveField('desc')} className="px-4 py-1.5 gradient-bg rounded-lg text-xs font-semibold text-white">Save</button>
                      <button onClick={() => setEditingField(null)} className="px-4 py-1.5 rounded-lg text-xs" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed min-h-[2rem]" style={{ color: selected.description ? 'var(--text)' : 'var(--text-dim)' }}>
                    {selected.description || 'No description. Click Edit to add one.'}
                  </p>
                )}
              </div>

              {/* Link */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Link</label>
                  {editingField !== 'link' && (
                    <button onClick={() => { setEditingField('link'); setEditLink(selected.link || ''); }}
                      className="text-xs font-medium transition" style={{ color: 'var(--purple-light)' }}>Edit</button>
                  )}
                </div>
                {editingField === 'link' ? (
                  <div className="space-y-2">
                    <input className={`w-full px-3 py-2.5 rounded-xl text-sm placeholder-slate-500 ${inputFocusStyle}`}
                      style={inputStyle} type="url" placeholder="https://…" value={editLink}
                      onChange={e => setEditLink(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveField('link')} className="px-4 py-1.5 gradient-bg rounded-lg text-xs font-semibold text-white">Save</button>
                      <button onClick={() => setEditingField(null)} className="px-4 py-1.5 rounded-lg text-xs" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Cancel</button>
                    </div>
                  </div>
                ) : selected.link ? (
                  <a href={selected.link} target="_blank" rel="noopener noreferrer"
                    className="text-sm break-all hover:underline" style={{ color: 'var(--blue)' }}>
                    {selected.link}
                  </a>
                ) : (
                  <p className="text-sm italic" style={{ color: 'var(--text-dim)' }}>No link added.</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-3" style={{ color: 'var(--text-muted)' }}>
                  Comments ({comments.length})
                </label>
                <div className="space-y-3 mb-4">
                  {comments.map(c => (
                    <div key={c.id} className="rounded-xl p-3" style={{ background: 'var(--surface)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                          {c.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{c.name || 'User'}</span>
                        <span className="text-[10px] ml-auto" style={{ color: 'var(--text-dim)' }}>{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm leading-relaxed pl-8" style={{ color: 'var(--text-muted)' }}>{c.body}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-sm text-center py-4 italic" style={{ color: 'var(--text-dim)' }}>No comments yet.</p>
                  )}
                </div>
                <form onSubmit={addComment} className="flex gap-2">
                  <input
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm ${inputFocusStyle}`}
                    style={inputStyle}
                    placeholder="Write a comment…"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  />
                  <button type="submit" disabled={savingComment || !commentText.trim()}
                    className="px-4 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition hover:opacity-90">
                    {savingComment ? '…' : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}
        </div>
      ) : view === 'kanban' ? (
        <div className="kanban-board grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban-column rounded-2xl p-4 flex flex-col" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                {/* Column header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{col.label}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: col.dim, color: col.color }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task cards */}
                <div className="space-y-2 flex-1 min-h-[80px]">
                  {colTasks.map(t => {
                    const pConfig = PRIORITY_CONFIG[t.priority];
                    return (
                      <div key={t.id} onClick={() => openTask(t)}
                        className="rounded-xl p-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          background: 'var(--surface)',
                          border: `1px solid var(--border)`,
                          borderLeft: `3px solid ${pConfig?.color || '#7b7fa8'}`,
                        }}>
                        <p className="text-sm font-medium mb-2 leading-snug" style={{ color: 'var(--text)' }}>{t.title}</p>
                        {t.description && (
                          <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          {pConfig && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                              style={{ background: pConfig.dim, color: pConfig.color }}>
                              {pConfig.label}
                            </span>
                          )}
                          {t.due_date && (
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {new Date(t.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add task button */}
                <button onClick={() => { setForm(f => ({ ...f, status: col.id })); setShowForm(true); }}
                  className="mt-3 w-full py-2 rounded-xl text-xs font-semibold transition border-dashed border-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = col.color; (e.currentTarget as HTMLElement).style.color = col.color; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                  + Add task
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">✅</div>
              <p style={{ color: 'var(--text-muted)' }}>No tasks yet</p>
            </div>
          ) : tasks.map((t, i) => {
            const pConfig = PRIORITY_CONFIG[t.priority];
            const col = COLUMNS.find(c => c.id === t.status);
            return (
              <div key={t.id} onClick={() => openTask(t)}
                className="flex items-center gap-4 px-5 py-3.5 transition cursor-pointer"
                style={{ borderTop: i !== 0 ? '1px solid var(--border)' : undefined }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pConfig?.color || '#7b7fa8' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{t.title}</p>
                  {t.description && <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{t.description}</p>}
                </div>
                {col && (
                  <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-semibold"
                    style={{ background: col.dim, color: col.color }}>
                    {col.label}
                  </span>
                )}
                {pConfig && (
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold"
                    style={{ background: pConfig.dim, color: pConfig.color }}>
                    {pConfig.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
