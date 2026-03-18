'use client';
import { useState, useEffect } from 'react';
import { Plus, Zap, Play, Pause, Trash2, ChevronDown, Activity } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const TRIGGERS = [
  { value: 'task_completed',    label: 'Task Completed',    color: 'var(--emerald)' },
  { value: 'task_created',      label: 'Task Created',      color: 'var(--indigo)' },
  { value: 'task_overdue',      label: 'Task Overdue',      color: 'var(--rose)' },
  { value: 'client_created',    label: 'New Client Added',  color: 'var(--cyan)' },
  { value: 'invoice_created',   label: 'Invoice Created',   color: 'var(--amber)' },
  { value: 'invoice_paid',      label: 'Invoice Paid',      color: 'var(--emerald)' },
  { value: 'project_created',   label: 'Project Created',   color: 'var(--violet)' },
  { value: 'project_completed', label: 'Project Completed', color: 'var(--emerald)' },
];

const ACTIONS = [
  { value: 'send_email',          label: 'Send Email',         color: 'var(--cyan)' },
  { value: 'create_task',         label: 'Create Task',        color: 'var(--indigo)' },
  { value: 'create_notification', label: 'Send Notification',  color: 'var(--violet)' },
  { value: 'send_webhook',        label: 'Trigger Webhook',    color: 'var(--amber)' },
];

const INPUT  = 'w-full px-3 py-2.5 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500/40';
const SELECT = 'w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 appearance-none';
const BTN    = 'px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50';

const EMPTY_FORM = {
  name: '', description: '',
  triggerEvent: 'task_completed',
  actionType:   'send_notification',
  actionConfig: { title: '', body: '', notify_all_admins: true },
};

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [logs, setLogs]               = useState<any[]>([]);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [form, setForm]               = useState<any>(EMPTY_FORM);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/automations');
      setAutomations(data || []);
    } catch { toast.error('Failed to load automations'); }
    finally { setLoading(false); }
  }

  async function save() {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const { data } = await apiClient.post('/automations', form);
      setAutomations(a => [data, ...a]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success('Automation created!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create');
    } finally { setSaving(false); }
  }

  async function toggle(id: string) {
    try {
      const { data } = await apiClient.patch(`/automations/${id}/toggle`);
      setAutomations(a => a.map(x => x.id === id ? data : x));
      toast.success(data.is_active ? 'Automation enabled' : 'Automation paused');
    } catch { toast.error('Failed to toggle'); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this automation?')) return;
    try {
      await apiClient.delete(`/automations/${id}`);
      setAutomations(a => a.filter(x => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  async function viewLogs(id: string) {
    setSelectedId(id);
    try {
      const { data } = await apiClient.get(`/automations/${id}/logs`);
      setLogs(data || []);
    } catch { setLogs([]); }
  }

  const triggerLabel = (v: string) => TRIGGERS.find(t => t.value === v);
  const actionLabel  = (v: string) => ACTIONS.find(a => a.value === v);

  const selectedRule = automations.find(a => a.id === selectedId);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-display font-bold text-lg mb-5" style={{ color: 'var(--text)' }}>New Automation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Name *</label>
                <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="e.g. Notify on task complete"
                  value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>Description</label>
                <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="Optional description"
                  value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Trigger */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(124,111,224,0.06)', border: '1px solid rgba(124,111,224,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-violet-400 text-xs font-bold uppercase tracking-wider">IF — Trigger</span>
                </div>
                <select className={SELECT} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  value={form.triggerEvent} onChange={e => setForm((f: any) => ({ ...f, triggerEvent: e.target.value }))}>
                  {TRIGGERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Action */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(74,158,255,0.06)', border: '1px solid rgba(74,158,255,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">THEN — Action</span>
                </div>
                <select className={SELECT + ' mb-3'} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  value={form.actionType} onChange={e => setForm((f: any) => ({ ...f, actionType: e.target.value }))}>
                  {ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>

                {form.actionType === 'create_notification' && (
                  <div className="space-y-2">
                    <input className={INPUT} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      placeholder="Notification title (use {{title}} for task name)"
                      value={form.actionConfig.title || ''}
                      onChange={e => setForm((f: any) => ({ ...f, actionConfig: { ...f.actionConfig, title: e.target.value } }))} />
                    <input className={INPUT} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      placeholder="Notification body"
                      value={form.actionConfig.body || ''}
                      onChange={e => setForm((f: any) => ({ ...f, actionConfig: { ...f.actionConfig, body: e.target.value } }))} />
                    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                      <input type="checkbox" checked={form.actionConfig.notify_all_admins || false}
                        onChange={e => setForm((f: any) => ({ ...f, actionConfig: { ...f.actionConfig, notify_all_admins: e.target.checked } }))} />
                      Notify all admins & managers
                    </label>
                  </div>
                )}

                {form.actionType === 'create_task' && (
                  <div className="space-y-2">
                    <input className={INPUT} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      placeholder="Task title (use {{title}} for trigger data)"
                      value={form.actionConfig.title || ''}
                      onChange={e => setForm((f: any) => ({ ...f, actionConfig: { ...f.actionConfig, title: e.target.value } }))} />
                    <select className={SELECT} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={form.actionConfig.priority || 'medium'}
                      onChange={e => setForm((f: any) => ({ ...f, actionConfig: { ...f.actionConfig, priority: e.target.value } }))}>
                      <option value="low">Low priority</option>
                      <option value="medium">Medium priority</option>
                      <option value="high">High priority</option>
                    </select>
                  </div>
                )}

                {form.actionType === 'send_webhook' && (
                  <input className={INPUT} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    placeholder="Webhook URL (e.g. https://hooks.zapier.com/...)"
                    value={form.actionConfig.url || ''}
                    onChange={e => setForm((f: any) => ({ ...f, actionConfig: { ...f.actionConfig, url: e.target.value } }))} />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className={BTN + ' flex-1'}>
                {saving ? 'Saving...' : 'Create Automation'}
              </button>
              <button onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                className="flex-1 px-5 py-2.5 rounded-xl text-sm border transition hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Panel */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedId(null)}>
          <div className="w-full max-w-lg rounded-2xl p-5 max-h-[70vh] overflow-y-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-3" style={{ color: 'var(--text)' }}>Run Logs — {selectedRule?.name}</h3>
            {logs.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No runs yet</p>
            ) : logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl mb-2" style={{ background: 'var(--surface)' }}>
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.status === 'success' ? 'bg-green-400' : log.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold capitalize" style={{ color: 'var(--text)' }}>{log.status}</p>
                  {log.error && <p className="text-xs text-red-400 mt-0.5">{log.error}</p>}
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{new Date(log.ran_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>Automations <Zap size={20} className="text-violet-400" /></h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Build IF/THEN rules to automate your workflow</p>
        </div>
        <button onClick={() => setShowModal(true)} className={BTN + ' flex items-center gap-2'}>
          <Plus size={16} /> New Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Rules',  value: automations.length,                                  color: 'var(--blue)' },
          { label: 'Active',       value: automations.filter(a => a.is_active).length,          color: 'var(--emerald)' },
          { label: 'Total Runs',   value: automations.reduce((s: number, a: any) => s + (a.run_count || 0), 0), color: 'var(--violet)' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}</div>
      ) : automations.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <img src="/icons/3d/robot.svg" alt="" className="w-20 h-20 mx-auto mb-4 opacity-90" />
          <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>No automations yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Create your first rule to automate repetitive tasks</p>
          <button onClick={() => setShowModal(true)} className={BTN}>Create First Rule</button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((rule: any) => {
            const trigger = triggerLabel(rule.trigger_event);
            const action  = actionLabel(rule.action_type);
            return (
              <div key={rule.id} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--card)', border: `1px solid ${rule.is_active ? 'rgba(124,111,224,0.2)' : 'var(--border)'}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: rule.is_active ? 'rgba(124,111,224,0.15)' : 'var(--surface)' }}>
                  <Zap size={18} color={rule.is_active ? 'var(--violet)' : 'var(--text-3)'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{rule.name}</p>
                    {!rule.is_active && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--text-dim)' }}>Paused</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(124,111,224,0.1)', color: 'var(--violet)' }}>
                      IF: {trigger?.label}
                    </span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(74,158,255,0.1)', color: 'var(--blue)' }}>
                      THEN: {action?.label}
                    </span>
                    {rule.run_count > 0 && (
                      <span style={{ color: 'var(--text-dim)' }}>· {rule.run_count} runs</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => viewLogs(rule.id)} title="View logs" className="p-2 rounded-xl hover:bg-white/5 transition" style={{ color: 'var(--text-dim)' }}>
                    <Activity size={15} />
                  </button>
                  <button onClick={() => toggle(rule.id)} title={rule.is_active ? 'Pause' : 'Enable'} className="p-2 rounded-xl hover:bg-white/5 transition" style={{ color: rule.is_active ? 'var(--emerald)' : 'var(--text-dim)' }}>
                    {rule.is_active ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button onClick={() => remove(rule.id)} title="Delete" className="p-2 rounded-xl hover:bg-white/5 transition text-red-400 hover:text-red-300">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
