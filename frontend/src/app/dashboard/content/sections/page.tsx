'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Lightbulb, Target, Camera, CalendarDays, Plus, Trash2,
  ChevronDown, ChevronUp, Edit3, Check, X,
} from 'lucide-react';
import api from '@/lib/api';

const SECTIONS = [
  { id: 'strategy',      label: 'Strategy',       icon: Lightbulb,    color: '#6366f1', desc: 'Brand positioning, goals, and overall direction' },
  { id: 'action_plan',   label: 'Action Plan',     icon: Target,       color: '#8b5cf6', desc: 'Specific campaigns, tasks, and deliverables' },
  { id: 'shooting_plan', label: 'Shooting Plan',   icon: Camera,       color: '#0ea5e9', desc: 'Photo and video shoot schedules and scripts' },
  { id: 'calendar',      label: 'Content Calendar',icon: CalendarDays, color: '#22c55e', desc: 'Publishing schedule and post timeline' },
] as const;
type SectionId = typeof SECTIONS[number]['id'];

interface SectionItem {
  id: string; section: SectionId; title: string; body?: string;
  status: string; position: number; created_by_name?: string; updated_at: string;
}

const STATUS_OPTIONS = ['draft', 'in_review', 'approved', 'published'];
const STATUS_COLOR: Record<string, string> = {
  draft: '#8b949e', in_review: '#f59e0b', approved: '#22c55e', published: '#6366f1',
};

export default function ContentSectionsPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId') || '';

  const [items, setItems] = useState<SectionItem[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState(clientId);
  const [activeSection, setActiveSection] = useState<SectionId>('strategy');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<{ title: string; body: string; status: string }>({ title: '', body: '', status: 'draft' });

  useEffect(() => {
    api.get('/clients').then(r => setClients(r.data || [])).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/content-sections?clientId=${selectedClient}`);
      setItems(data);
    } finally { setLoading(false); }
  }, [selectedClient]);

  useEffect(() => { load(); }, [load]);

  const sectionItems = items.filter(i => i.section === activeSection);

  const addItem = async () => {
    if (!form.title.trim() || !selectedClient) return;
    setSaving(true);
    try {
      const { data } = await api.post('/content-sections', {
        clientId: selectedClient, section: activeSection,
        title: form.title, body: form.body, status: 'draft',
        position: sectionItems.length,
      });
      setItems(prev => [...prev, data]);
      setForm({ title: '', body: '' });
      setAdding(false);
    } finally { setSaving(false); }
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/content-sections/${id}`, editForm);
      setItems(prev => prev.map(i => i.id === id ? data : i));
      setEditing(null);
    } finally { setSaving(false); }
  };

  const deleteItem = async (id: string) => {
    await api.delete(`/content-sections/${id}`);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const startEdit = (item: SectionItem) => {
    setEditForm({ title: item.title, body: item.body || '', status: item.status });
    setEditing(item.id);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } } .fu { animation: fadeUp 0.3s ease both; }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f2f9', margin: 0 }}>Content Strategy Hub</h1>
          <p style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>Strategy · Action Plan · Shooting Plan · Calendar</p>
        </div>
        <select
          value={selectedClient}
          onChange={e => setSelectedClient(e.target.value)}
          style={{
            padding: '9px 14px', borderRadius: 10, fontSize: 13,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: selectedClient ? '#f1f2f9' : '#8b949e', outline: 'none', minWidth: 200,
          }}>
          <option value="">Select a client...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const count = items.filter(i => i.section === s.id).length;
          const active = activeSection === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
              borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
              background: active ? s.color + '18' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? s.color + '50' : 'rgba(255,255,255,0.07)'}`,
              color: active ? s.color : '#8b949e',
            }}>
              <Icon size={14} />
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{s.label}</span>
              {count > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                  background: active ? s.color : 'rgba(255,255,255,0.08)',
                  color: active ? '#fff' : '#8b949e',
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {!selectedClient ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8b949e' }}>
          <Lightbulb size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontSize: 14 }}>Select a client to view their content strategy</p>
        </div>
      ) : (
        <>
          {/* Active section info */}
          {(() => {
            const sec = SECTIONS.find(s => s.id === activeSection)!;
            return (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 16, padding: '12px 16px',
                background: sec.color + '0d', border: `1px solid ${sec.color}25`, borderRadius: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <sec.icon size={14} color={sec.color} />
                  <span style={{ fontSize: 13, color: sec.color, fontWeight: 600 }}>{sec.label}</span>
                  <span style={{ fontSize: 12, color: '#8b949e' }}>— {sec.desc}</span>
                </div>
                <button onClick={() => setAdding(!adding)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: sec.color, border: 'none', color: '#fff',
                }}>
                  <Plus size={12} /> Add Item
                </button>
              </div>
            );
          })()}

          {/* Add form */}
          {adding && (
            <div className="fu" style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '16px 18px', marginBottom: 14,
            }}>
              <input
                autoFocus
                placeholder="Title..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                style={inputSt}
              />
              <textarea
                placeholder="Details, notes, or body (optional)..."
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                rows={3}
                style={{ ...inputSt, marginTop: 8, resize: 'none' }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={addItem} disabled={!form.title.trim() || saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px',
                    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: '#6366f1', border: 'none', color: '#fff',
                    opacity: !form.title.trim() || saving ? 0.6 : 1 }}>
                  <Check size={13} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setAdding(false); setForm({ title: '', body: '' }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px',
                    borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8b949e' }}>
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Items */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#8b949e', fontSize: 13 }}>Loading...</div>
          ) : sectionItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#8b949e' }}>
              {(() => { const s = SECTIONS.find(x => x.id === activeSection)!; return <s.icon size={28} style={{ opacity: 0.25, marginBottom: 10 }} />; })()}
              <p style={{ fontSize: 13 }}>No {activeSection.replace(/_/g, ' ')} items yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sectionItems.map(item => (
                <div key={item.id} className="fu" style={{
                  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '14px 16px',
                }}>
                  {editing === item.id ? (
                    <div>
                      <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        style={{ ...inputSt, marginBottom: 8 }} />
                      <textarea value={editForm.body} onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))}
                        rows={3} style={{ ...inputSt, resize: 'none', marginBottom: 8 }} />
                      <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                        style={{ ...inputSt, marginBottom: 10, width: 'auto' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => saveEdit(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#6366f1', border: 'none', color: '#fff' }}>
                          <Check size={12} /> Save
                        </button>
                        <button onClick={() => setEditing(null)} style={{ padding: '7px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8b949e' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: item.body ? 8 : 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f2f9' }}>{item.title}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                            background: STATUS_COLOR[item.status] + '18', color: STATUS_COLOR[item.status],
                          }}>{item.status.replace(/_/g, ' ')}</span>
                        </div>
                        {item.body && (
                          <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => startEdit(item)} style={iconBtn}><Edit3 size={13} /></button>
                        <button onClick={() => deleteItem(item.id)} style={{ ...iconBtn, color: '#ef4444' }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const inputSt: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f2f9', fontSize: 13, outline: 'none', boxSizing: 'border-box',
};

const iconBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)', color: '#8b949e',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};
