'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const FIELD_TYPES = ['Short Text','Long Text','Email','Phone','Number','Date','Dropdown','Multi-choice','Rating','Yes/No'];
const FIELD_ICONS: Record<string,string> = {
  'Short Text': 'T', 'Long Text': '¶', 'Email': '@', 'Phone': '📞', 'Number': '#',
  'Date': '📅', 'Dropdown': '▼', 'Multi-choice': '☑', 'Rating': '⭐', 'Yes/No': '?',
};

interface FormField { id: string; type: string; label: string; required: boolean; options?: string[] }

export default function FormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeForm, setActiveForm] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [showResponses, setShowResponses] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadForms(); }, []);

  async function loadForms() {
    try {
      const r = await apiClient.get('/forms');
      setForms(r.data);
    } catch {} finally { setLoading(false); }
  }

  async function createForm(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await apiClient.post('/forms', { title: newTitle, fields: [] });
      setForms(prev => [r.data, ...prev]);
      setNewTitle('');
      setCreating(false);
      openForm(r.data);
      toast.success('Form created!');
    } catch { toast.error('Failed'); }
  }

  async function openForm(form: any) {
    try {
      const r = await apiClient.get(`/forms/${form.id}`);
      setActiveForm(r.data);
      setFields(r.data.fields || []);
      setShowResponses(false);
    } catch {}
  }

  async function saveForm() {
    if (!activeForm) return;
    setSaving(true);
    try {
      await apiClient.patch(`/forms/${activeForm.id}`, { fields });
      setForms(prev => prev.map(f => f.id === activeForm.id ? { ...f, fields } : f));
      toast.success('Saved!');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function loadResponses(formId: string) {
    try {
      const r = await apiClient.get(`/forms/${formId}/responses`);
      setResponses(r.data);
      setShowResponses(true);
    } catch {}
  }

  async function deleteForm(id: string) {
    if (!confirm('Delete this form?')) return;
    try {
      await apiClient.delete(`/forms/${id}`);
      setForms(prev => prev.filter(f => f.id !== id));
      if (activeForm?.id === id) setActiveForm(null);
      toast.success('Deleted');
    } catch {}
  }

  function addField(type: string) {
    const newField: FormField = {
      id: Math.random().toString(36).slice(2),
      type, label: type, required: false,
      options: ['Dropdown','Multi-choice'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields(prev => [...prev, newField]);
  }

  function updateField(id: string, update: Partial<FormField>) {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...update } : f));
  }

  function removeField(id: string) {
    setFields(prev => prev.filter(f => f.id !== id));
  }

  function moveField(id: string, dir: 'up' | 'down') {
    const idx = fields.findIndex(f => f.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === fields.length - 1) return;
    const next = [...fields];
    [next[idx], next[dir === 'up' ? idx - 1 : idx + 1]] = [next[dir === 'up' ? idx - 1 : idx + 1], next[idx]];
    setFields(next);
  }

  const publicUrl = activeForm ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api','')}/forms/${activeForm.slug}` : '';

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0c0d11]">
        <div className="p-3 border-b border-white/5">
          {creating ? (
            <form onSubmit={createForm} className="flex gap-2">
              <input autoFocus required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                placeholder="Form title" />
              <button type="submit" className="px-2 py-1.5 gradient-bg rounded-lg text-xs text-white">✓</button>
              <button type="button" onClick={() => setCreating(false)} className="px-2 py-1.5 text-slate-400 text-xs">✕</button>
            </form>
          ) : (
            <button onClick={() => setCreating(true)} className="w-full py-2 gradient-bg rounded-xl text-xs font-semibold text-white hover:opacity-90">
              + New Form
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-1">{[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />)}</div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8"><p className="text-slate-500 text-xs">No forms yet</p></div>
          ) : (
            forms.map(f => (
              <div key={f.id} className={`group flex items-center gap-1 mb-0.5 px-2 py-2 rounded-lg cursor-pointer transition ${activeForm?.id === f.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onClick={() => openForm(f)}>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{f.title}</p>
                  <p className="text-slate-500 text-[10px]">{f.response_count || 0} responses</p>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteForm(f.id); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition text-xs">🗑️</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form builder */}
      {activeForm && !showResponses ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Field palette */}
          <div className="w-48 border-r border-white/5 p-3 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Add Field</p>
            <div className="space-y-1">
              {FIELD_TYPES.map(t => (
                <button key={t} onClick={() => addField(t)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/5 hover:text-white transition">
                  <span className="w-5 text-center font-mono text-slate-600">{FIELD_ICONS[t]}</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
              <h2 className="font-semibold text-white">{activeForm.title}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => loadResponses(activeForm.id)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 transition">
                  📊 Responses ({activeForm.response_count || 0})
                </button>
                <button onClick={() => { navigator.clipboard.writeText(activeForm.slug); toast.success('Slug copied!'); }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 transition">
                  🔗 Share
                </button>
                <button onClick={saveForm} disabled={saving}
                  className="px-4 py-1.5 gradient-bg rounded-lg text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {fields.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-slate-400 text-sm">Add fields from the left panel to build your form</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl mx-auto">
                  {fields.map((field, idx) => (
                    <div key={field.id} className="bg-[#0f1117] border border-white/5 rounded-xl p-4 group">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-slate-500 font-mono w-5 text-center">{FIELD_ICONS[field.type]}</span>
                        <input value={field.label} onChange={e => updateField(field.id, { label: e.target.value })}
                          className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none border-b border-transparent focus:border-brand-blue/50" />
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                          <button onClick={() => moveField(field.id, 'up')} className="text-slate-500 hover:text-white text-xs">↑</button>
                          <button onClick={() => moveField(field.id, 'down')} className="text-slate-500 hover:text-white text-xs">↓</button>
                          <button onClick={() => removeField(field.id)} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                          <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} className="accent-brand-blue" />
                          Required
                        </label>
                        <span className="text-xs text-slate-600">{field.type}</span>
                      </div>
                      {field.options && (
                        <div className="mt-2 space-y-1">
                          {field.options.map((opt, i) => (
                            <div key={i} className="flex gap-2">
                              <input value={opt} onChange={e => {
                                const next = [...(field.options || [])]; next[i] = e.target.value;
                                updateField(field.id, { options: next });
                              }}
                                className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none" />
                              <button onClick={() => updateField(field.id, { options: field.options?.filter((_, j) => j !== i) })}
                                className="text-slate-600 hover:text-red-400 text-xs">✕</button>
                            </div>
                          ))}
                          <button onClick={() => updateField(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })}
                            className="text-xs text-brand-blue hover:underline">+ Add option</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeForm && showResponses ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setShowResponses(false)} className="text-brand-blue text-sm hover:underline">← Back to Builder</button>
            <h2 className="font-semibold text-white">{activeForm.title} — Responses ({responses.length})</h2>
          </div>
          {responses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="text-4xl mb-3">📨</div>
              <p className="text-slate-400">No responses yet. Share your form to start collecting data.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map(r => (
                <div key={r.id} className="bg-[#0f1117] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500">{new Date(r.submitted_at).toLocaleString()}</p>
                    {r.respondent_email && <p className="text-xs text-brand-blue">{r.respondent_email}</p>}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(r.data || {}).map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <span className="text-xs text-slate-500 min-w-24">{k}:</span>
                        <span className="text-xs text-white">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-white font-display font-bold text-xl mb-2">Form Builder</h2>
            <p className="text-slate-400 text-sm mb-6">Create intake forms, surveys, and feedback forms</p>
            <button onClick={() => setCreating(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90">
              + Create Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
