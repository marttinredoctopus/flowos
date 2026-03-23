'use client';
import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import { LoadingScreen, EmptyState, Modal, FormField, StatusBadge, inputStyle, formatDate } from '@/components/ui/shared';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#22c55e','#06b6d4','#ef4444','#f97316'];
const ICONS  = ['📁','🚀','💡','🎯','📱','🛒','✨','🎨','📊','💼'];

type Form = {
  name: string; description: string; client_id: string;
  color: string; icon: string; status: string;
  start_date: string; end_date: string; budget: string;
};

const EMPTY: Form = {
  name: '', description: '', client_id: '',
  color: '#6366f1', icon: '📁', status: 'active',
  start_date: '', end_date: '', budget: '',
};

export default function Projects() {
  const [projects, setProjects]     = useState<any[]>([]);
  const [clients, setClients]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [form, setForm]             = useState<Form>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    Promise.all([
      apiGet('/api/projects').catch(() => null),
      apiGet('/api/clients').catch(() => null),
    ]).then(([p, c]) => {
      const projects = p?.data?.projects ?? p?.projects ?? p?.data ?? p ?? [];
      const clients  = c?.data?.clients  ?? c?.clients  ?? c?.data ?? c ?? [];
      setProjects(Array.isArray(projects) ? projects : []);
      setClients(Array.isArray(clients) ? clients : []);
    }).finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditProject(null);
    setForm(EMPTY);
    setShowCreate(true);
  }

  function openEdit(p: any) {
    setEditProject(p);
    setForm({
      name: p.name || '', description: p.description || '',
      client_id: p.client_id || '', color: p.color || '#6366f1',
      icon: p.icon || '📁', status: p.status || 'active',
      start_date: p.start_date ? p.start_date.slice(0, 10) : '',
      end_date: (p.end_date || p.deadline) ? (p.end_date || p.deadline).slice(0, 10) : '',
      budget: p.budget || '',
    });
    setShowCreate(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error('Project name required');
    setSaving(true);
    try {
      const payload = { ...form, budget: form.budget ? Number(form.budget) : undefined };
      if (editProject) {
        await apiPatch(`/api/projects/${editProject.id}`, payload);
        setProjects(prev => prev.map(p => p.id === editProject.id ? { ...p, ...payload } : p));
        toast.success('Project updated');
      } else {
        const res = await apiPost('/api/projects', payload);
        const newProject = res?.data?.project ?? res?.project ?? res?.data ?? res;
        if (newProject?.id) setProjects(prev => [newProject, ...prev]);
        toast.success('Project created');
      }
      setShowCreate(false);
    } catch { toast.error('Failed to save project'); }
    finally { setSaving(false); }
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    try {
      await apiDelete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const statuses = ['all', 'active', 'on_hold', 'completed', 'cancelled'];
  const filtered = filter === 'all' ? projects : projects.filter(p => (p.status || 'active') === filter);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
          + New Project
        </button>
      </div>

      {/* Status filter */}
      {projects.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', borderColor: filter === s ? '#6366f1' : 'var(--border)', background: filter === s ? 'rgba(99,102,241,0.15)' : 'transparent', color: filter === s ? '#6366f1' : 'var(--text-muted)', transition: 'all 0.15s' }}>
              {s === 'all' ? `All (${projects.length})` : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon="📁" text={filter !== 'all' ? `No ${filter.replace('_', ' ')} projects` : 'No projects yet'} action="Create Project" onAction={openCreate} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map((p: any) => (
            <div key={p.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              {/* Color bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.color || '#6366f1', borderRadius: '16px 16px 0 0' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, marginTop: 6 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${p.color || '#6366f1'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {p.icon || '📁'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.client_name || 'No client'}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => openEdit(p)} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11 }}>✏️</button>
                  <button onClick={() => deleteProject(p.id)} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: 11 }}>🗑️</button>
                </div>
              </div>

              <StatusBadge status={p.status || 'active'} />

              {p.description && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '10px 0', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {p.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                <span>✅ {p.task_count || 0} tasks</span>
                {p.end_date && <span>📅 {formatDate(p.end_date)}</span>}
                {p.budget && <span>💰 ${Number(p.budget).toLocaleString()}</span>}
              </div>

              {p.progress !== undefined && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: p.color || '#6366f1' }}>{p.progress || 0}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 99 }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${p.progress || 0}%`, background: p.color || '#6366f1' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreate && (
        <Modal title={editProject ? 'Edit Project' : 'New Project'} onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Project Name *">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ramadan Campaign 2025" style={inputStyle} autoFocus />
            </FormField>

            <FormField label="Client">
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} style={inputStyle}>
                <option value="">No client</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>

            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>

            <FormField label="Status">
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Start Date">
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="End Date">
                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
              </FormField>
            </div>

            <FormField label="Budget ($)">
              <input type="number" min="0" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="0" style={inputStyle} />
            </FormField>

            <FormField label="Color">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '3px solid white' : '3px solid transparent', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none', transition: 'all 0.15s' }} />
                ))}
              </div>
            </FormField>

            <FormField label="Icon">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ICONS.map(icon => (
                  <button key={icon} type="button" onClick={() => setForm({ ...form, icon })} style={{ width: 36, height: 36, borderRadius: 8, border: form.icon === icon ? `2px solid ${form.color}` : '2px solid var(--border)', background: form.icon === icon ? `${form.color}20` : 'var(--card)', cursor: 'pointer', fontSize: 18 }}>
                    {icon}
                  </button>
                ))}
              </div>
            </FormField>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editProject ? 'Save Changes' : 'Create Project'}
              </button>
              <button onClick={() => setShowCreate(false)} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
