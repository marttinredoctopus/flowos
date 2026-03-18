'use client';
import { useState, useEffect } from 'react';
import { Plus, FolderKanban, ChevronRight, Trash2, Copy, Play, X } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['All', 'General', 'Marketing', 'Development', 'Design', 'Sales', 'Operations'];
const COLORS     = ['#7c6fe0', '#4a9eff', '#ef5350', '#ffc107', '#4caf82', '#f97316', '#ec4899'];
const ICONS      = ['📋', '🚀', '💼', '🎨', '📊', '🏗️', '📱', '✨', '🎯', '💡'];
const PRIORITIES = ['low', 'medium', 'high'];

const INPUT  = 'w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40';
const BTN    = 'px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50';

const STARTER_TEMPLATES = [
  {
    name: 'Social Media Campaign', category: 'Marketing', icon: '📱', color: '#4a9eff', isPublic: true,
    description: 'Full social media campaign workflow from strategy to launch',
    tasks: [
      { title: 'Define campaign goals & KPIs', priority: 'high',   offset_days: 0 },
      { title: 'Research target audience',     priority: 'high',   offset_days: 1 },
      { title: 'Create content calendar',      priority: 'medium', offset_days: 3 },
      { title: 'Design visual assets',         priority: 'medium', offset_days: 5 },
      { title: 'Write captions & copy',        priority: 'medium', offset_days: 7 },
      { title: 'Schedule posts',               priority: 'low',    offset_days: 9 },
      { title: 'Monitor & report results',     priority: 'medium', offset_days: 14 },
    ],
  },
  {
    name: 'Website Redesign', category: 'Development', icon: '🏗️', color: '#7c6fe0', isPublic: true,
    description: 'Complete website redesign from discovery to launch',
    tasks: [
      { title: 'Discovery & requirements gathering', priority: 'high',   offset_days: 0 },
      { title: 'Sitemap & wireframes',               priority: 'high',   offset_days: 3 },
      { title: 'UI design mockups',                  priority: 'high',   offset_days: 7 },
      { title: 'Client approval of designs',         priority: 'medium', offset_days: 14 },
      { title: 'Frontend development',               priority: 'high',   offset_days: 16 },
      { title: 'Backend integration',                priority: 'high',   offset_days: 25 },
      { title: 'QA testing',                         priority: 'medium', offset_days: 35 },
      { title: 'Launch & handover',                  priority: 'high',   offset_days: 42 },
    ],
  },
  {
    name: 'Client Onboarding', category: 'Operations', icon: '🤝', color: '#4caf82', isPublic: true,
    description: 'Standard client onboarding workflow',
    tasks: [
      { title: 'Send welcome email & contract',  priority: 'high',   offset_days: 0 },
      { title: 'Kick-off meeting',               priority: 'high',   offset_days: 1 },
      { title: 'Gather brand assets & info',     priority: 'medium', offset_days: 2 },
      { title: 'Set up client folder & tools',   priority: 'medium', offset_days: 3 },
      { title: 'Create project plan',            priority: 'high',   offset_days: 5 },
      { title: 'First delivery',                 priority: 'high',   offset_days: 14 },
    ],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates]     = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('All');
  const [showCreate, setShowCreate]   = useState(false);
  const [showApply, setShowApply]     = useState<any>(null);
  const [showPreview, setShowPreview] = useState<any>(null);
  const [saving, setSaving]           = useState(false);
  const [clients, setClients]         = useState<any[]>([]);

  const [newTpl, setNewTpl] = useState({
    name: '', description: '', category: 'General', color: '#7c6fe0', icon: '📋', isPublic: false,
    tasks: [{ title: '', priority: 'medium', offset_days: 0 }],
  });

  const [applyForm, setApplyForm] = useState({ projectName: '', clientId: '', startDate: '', assigneeId: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [{ data: tpls }, { data: cls }] = await Promise.all([
        apiClient.get('/templates'),
        apiClient.get('/clients').catch(() => ({ data: [] })),
      ]);
      // If no templates yet, show starters (will be created on first use)
      setTemplates(tpls?.length ? tpls : []);
      setClients(cls || []);
    } catch { toast.error('Failed to load templates'); }
    finally { setLoading(false); }
  }

  async function seedStarters() {
    for (const tpl of STARTER_TEMPLATES) {
      try {
        const { data } = await apiClient.post('/templates', tpl);
        setTemplates(t => [...t, { ...data, task_count: tpl.tasks.length }]);
      } catch {}
    }
    toast.success('Starter templates added!');
  }

  async function create() {
    if (!newTpl.name.trim()) return toast.error('Name required');
    const validTasks = newTpl.tasks.filter(t => t.title.trim());
    if (!validTasks.length) return toast.error('Add at least one task');
    setSaving(true);
    try {
      const { data } = await apiClient.post('/templates', { ...newTpl, tasks: validTasks });
      setTemplates(t => [{ ...data, task_count: validTasks.length }, ...t]);
      setShowCreate(false);
      setNewTpl({ name:'', description:'', category:'General', color:'#7c6fe0', icon:'📋', isPublic:false, tasks:[{ title:'', priority:'medium', offset_days:0 }] });
      toast.success('Template created!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create');
    } finally { setSaving(false); }
  }

  async function applyTemplate() {
    if (!applyForm.projectName.trim()) return toast.error('Project name required');
    setSaving(true);
    try {
      const { data } = await apiClient.post(`/templates/${showApply.id}/apply`, applyForm);
      toast.success(data.message);
      setShowApply(null);
      setApplyForm({ projectName: '', clientId: '', startDate: '', assigneeId: '' });
      router.push('/dashboard/projects');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to apply template');
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete template?')) return;
    try {
      await apiClient.delete(`/templates/${id}`);
      setTemplates(t => t.filter(x => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Cannot delete'); }
  }

  const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Apply Template</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Creating project from <strong style={{ color: 'var(--text)' }}>{showApply.name}</strong></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Project Name *</label>
                <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="e.g. Nike Q4 Campaign"
                  value={applyForm.projectName} onChange={e => setApplyForm(f => ({ ...f, projectName: e.target.value }))} autoFocus />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Client (optional)</label>
                <select className={INPUT + ' appearance-none'} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  value={applyForm.clientId} onChange={e => setApplyForm(f => ({ ...f, clientId: e.target.value }))}>
                  <option value="">No client</option>
                  {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Start Date</label>
                <input type="date" className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  value={applyForm.startDate} onChange={e => setApplyForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--surface)' }}>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{showApply.task_count || 0} tasks</span>
                <span style={{ color: 'var(--text-muted)' }}> will be created with relative due dates</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={applyTemplate} disabled={saving} className={BTN + ' flex-1 flex items-center justify-center gap-2'}>
                <Play size={14} /> {saving ? 'Creating...' : 'Create Project'}
              </button>
              <button onClick={() => setShowApply(null)} className="flex-1 px-5 py-2.5 rounded-xl text-sm border hover:bg-white/5 transition"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>New Template</h3>
              <button onClick={() => setShowCreate(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Name *</label>
                  <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    placeholder="Template name" value={newTpl.name} onChange={e => setNewTpl(t => ({ ...t, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Category</label>
                  <select className={INPUT + ' appearance-none'} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    value={newTpl.category} onChange={e => setNewTpl(t => ({ ...t, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Description</label>
                <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="What is this template for?" value={newTpl.description} onChange={e => setNewTpl(t => ({ ...t, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setNewTpl(t => ({ ...t, color: c }))}
                        className="w-6 h-6 rounded-full transition" style={{ background: c, outline: newTpl.color === c ? `2px solid white` : 'none', outlineOffset: 2 }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Icon</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {ICONS.map(icon => (
                      <button key={icon} onClick={() => setNewTpl(t => ({ ...t, icon }))}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center ${newTpl.icon === icon ? 'ring-2 ring-violet-500' : ''}`}
                        style={{ background: 'var(--surface)' }}>{icon}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Tasks</label>
                  <button onClick={() => setNewTpl(t => ({ ...t, tasks: [...t.tasks, { title: '', priority: 'medium', offset_days: (t.tasks.at(-1)?.offset_days || 0) + 2 }] }))}
                    className="text-xs" style={{ color: 'var(--blue)' }}>+ Add Task</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {newTpl.tasks.map((task, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input className={INPUT + ' col-span-5'} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        placeholder="Task title" value={task.title}
                        onChange={e => setNewTpl(t => { const tasks = [...t.tasks]; tasks[i] = { ...tasks[i], title: e.target.value }; return { ...t, tasks }; })} />
                      <select className={INPUT + ' col-span-3 appearance-none'} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={task.priority}
                        onChange={e => setNewTpl(t => { const tasks = [...t.tasks]; tasks[i] = { ...tasks[i], priority: e.target.value }; return { ...t, tasks }; })}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <div className="col-span-3 flex items-center gap-1">
                        <input type="number" min={0} className={INPUT + ' text-xs'} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          placeholder="Day" value={task.offset_days}
                          onChange={e => setNewTpl(t => { const tasks = [...t.tasks]; tasks[i] = { ...tasks[i], offset_days: +e.target.value }; return { ...t, tasks }; })} />
                      </div>
                      <button onClick={() => setNewTpl(t => ({ ...t, tasks: t.tasks.filter((_, j) => j !== i) }))}
                        className="col-span-1 text-slate-500 hover:text-red-400 transition text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Day = days after project start date</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={create} disabled={saving} className={BTN + ' flex-1'}>{saving ? 'Creating...' : 'Create Template'}</button>
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl text-sm border hover:bg-white/5 transition"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Templates 📋</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Create projects instantly from reusable templates</p>
        </div>
        <div className="flex gap-3">
          {templates.length === 0 && (
            <button onClick={seedStarters} className="px-4 py-2.5 text-sm border rounded-xl hover:bg-white/5 transition"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>+ Add Starters</button>
          )}
          <button onClick={() => setShowCreate(true)} className={BTN + ' flex items-center gap-2'}>
            <Plus size={15} /> New Template
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${filter === cat ? 'gradient-bg text-white font-semibold' : 'hover:bg-white/5'}`}
            style={{ background: filter === cat ? undefined : 'var(--card)', color: filter === cat ? 'white' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-5xl mb-3">📋</div>
          <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>No templates yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Create a template to quickly spin up projects</p>
          <button onClick={() => setShowCreate(true)} className={BTN}>Create Template</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tpl: any) => (
            <div key={tpl.id} className="rounded-2xl p-5 flex flex-col gap-3 group" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: tpl.color + '22' }}>{tpl.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{tpl.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--text-dim)' }}>{tpl.category}</span>
                  </div>
                </div>
                <button onClick={() => remove(tpl.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/5 transition text-slate-500 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>

              {tpl.description && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tpl.description}</p>
              )}

              <div className="flex items-center gap-3 text-xs mt-auto" style={{ color: 'var(--text-dim)' }}>
                <span>📝 {tpl.task_count || 0} tasks</span>
                {tpl.use_count > 0 && <span>· Used {tpl.use_count}×</span>}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowApply(tpl)} className={BTN + ' flex-1 flex items-center justify-center gap-1.5 !py-2 !px-3 !text-xs'}>
                  <Play size={12} /> Use Template
                </button>
                <button onClick={() => setShowPreview(tpl)} className="px-3 py-2 rounded-xl text-xs border hover:bg-white/5 transition"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Panel */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(null)}>
          <div className="h-full w-full max-w-sm p-6 overflow-y-auto" style={{ background: 'var(--card)', borderLeft: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{showPreview.icon}</span>
                <h3 className="font-bold" style={{ color: 'var(--text)' }}>{showPreview.name}</h3>
              </div>
              <button onClick={() => setShowPreview(null)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            {showPreview.description && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{showPreview.description}</p>}
            <PreviewTasks templateId={showPreview.id} />
            <button onClick={() => { setShowApply(showPreview); setShowPreview(null); }} className={BTN + ' w-full mt-4 flex items-center justify-center gap-2'}>
              <Play size={14} /> Use This Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewTasks({ templateId }: { templateId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const PRIORITY_COLOR: Record<string, string> = { high: '#ef5350', medium: '#ffc107', low: '#4caf82' };

  useEffect(() => {
    apiClient.get(`/templates/${templateId}`).then(r => setTasks(r.data.tasks || [])).catch(() => {});
  }, [templateId]);

  if (!tasks.length) return <div className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Loading tasks...</div>;

  return (
    <div className="space-y-2">
      {tasks.map((t: any, i: number) => (
        <div key={t.id || i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: PRIORITY_COLOR[t.priority] + '33', color: PRIORITY_COLOR[t.priority] }}>{i+1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{t.title}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Day {t.offset_days} · {t.priority}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
