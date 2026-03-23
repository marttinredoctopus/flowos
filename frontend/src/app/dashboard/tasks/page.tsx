'use client';
import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import { LoadingScreen, EmptyState, Modal, FormField, PriorityBadge, inputStyle, formatDate } from '@/components/ui/shared';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: '#6b7280', bg: 'rgba(107,114,128,0.06)' },
  { id: 'in_progress', label: 'In Progress', color: '#6366f1', bg: 'rgba(99,102,241,0.06)'  },
  { id: 'review',      label: 'In Review',   color: '#f59e0b', bg: 'rgba(245,158,11,0.06)'  },
  { id: 'done',        label: 'Done',        color: '#22c55e', bg: 'rgba(34,197,94,0.06)'   },
];

type Form = {
  title: string; description: string; project_id: string;
  priority: string; due_date: string; status: string;
};

const EMPTY: Form = { title: '', description: '', project_id: '', priority: 'medium', due_date: '', status: 'todo' };

function isOverdue(date: string) {
  return !!date && new Date(date) < new Date();
}

export default function Tasks() {
  const [tasks, setTasks]           = useState<any[]>([]);
  const [projects, setProjects]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask]     = useState<any>(null);
  const [form, setForm]             = useState<Form>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [dragging, setDragging]     = useState<string | null>(null);
  const [dragOver, setDragOver]     = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet('/api/tasks').catch(() => null),
      apiGet('/api/projects').catch(() => null),
    ]).then(([t, p]) => {
      const tasks    = t?.data?.tasks    ?? t?.tasks    ?? t?.data    ?? t    ?? [];
      const projects = p?.data?.projects ?? p?.projects ?? p?.data    ?? p    ?? [];
      setTasks(Array.isArray(tasks) ? tasks : []);
      setProjects(Array.isArray(projects) ? projects : []);
    }).finally(() => setLoading(false));
  }, []);

  function openCreate(status = 'todo') {
    setEditTask(null);
    setForm({ ...EMPTY, status });
    setShowCreate(true);
  }

  function openEdit(t: any) {
    setEditTask(t);
    setForm({
      title: t.title || '', description: t.description || '',
      project_id: t.project_id || '', priority: t.priority || 'medium',
      due_date: t.due_date ? t.due_date.slice(0, 10) : '',
      status: t.status || 'todo',
    });
    setShowCreate(true);
  }

  async function save() {
    if (!form.title.trim()) return toast.error('Task title required');
    setSaving(true);
    try {
      if (editTask) {
        await apiPatch(`/api/tasks/${editTask.id}`, form);
        setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...form } : t));
        toast.success('Task updated');
      } else {
        const res = await apiPost('/api/tasks', form);
        const newTask = res?.data?.task ?? res?.task ?? res?.data ?? res;
        if (newTask?.id) setTasks(prev => [newTask, ...prev]);
        toast.success('Task created');
      }
      setShowCreate(false);
    } catch { toast.error('Failed to save task'); }
    finally { setSaving(false); }
  }

  async function deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    try {
      await apiDelete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  async function moveTask(taskId: string, newStatus: string) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await apiPatch(`/api/tasks/${taskId}`, { status: newStatus }); }
    catch { toast.error('Failed to move task'); }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => openCreate()} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
          + New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon="✅" text="No tasks yet. Create your first task!" action="Create Task" onAction={() => openCreate()} />
      ) : (
        /* Kanban Board */
        <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, alignItems: 'start' }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => (t.status || 'todo') === col.id);
            const isOver = dragOver === col.id;
            return (
              <div key={col.id} className="kanban-column"
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.preventDefault(); if (dragging) moveTask(dragging, col.id); setDragging(null); setDragOver(null); }}
                style={{ background: isOver ? `${col.color}12` : col.bg, border: `1px solid ${isOver ? col.color : 'var(--border)'}`, borderRadius: 14, padding: 12, minHeight: 200, transition: 'all 0.15s' }}
              >
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--card)', padding: '2px 7px', borderRadius: 99 }}>{colTasks.length}</span>
                </div>

                {/* Tasks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colTasks.map(task => (
                    <div key={task.id}
                      draggable
                      onDragStart={() => setDragging(task.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      style={{ background: 'var(--card)', border: '1px solid var(--border)', borderLeft: `3px solid ${col.color}`, borderRadius: 8, padding: '10px 12px', cursor: 'grab', opacity: dragging === task.id ? 0.5 : 1 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>{task.title}</div>
                        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                          <button onClick={() => openEdit(task)} style={{ padding: '2px 4px', borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)' }}>✏️</button>
                          <button onClick={() => deleteTask(task.id)} style={{ padding: '2px 4px', borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#ef4444' }}>🗑️</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <PriorityBadge priority={task.priority || 'medium'} />
                        {task.due_date && (
                          <span style={{ fontSize: 10, color: isOverdue(task.due_date) ? '#ef4444' : 'var(--text-muted)', fontWeight: isOverdue(task.due_date) ? 700 : 400 }}>
                            📅 {formatDate(task.due_date)}{isOverdue(task.due_date) ? ' ⚠️' : ''}
                          </span>
                        )}
                      </div>
                      {task.project_name && (
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>📁 {task.project_name}</div>
                      )}
                    </div>
                  ))}

                  {/* Add task button */}
                  <button onClick={() => openCreate(col.id)}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = col.color; (e.currentTarget as HTMLButtonElement).style.color = col.color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
                  >
                    + Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showCreate && (
        <Modal title={editTask ? 'Edit Task' : 'New Task'} onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Task Title *">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" style={inputStyle} autoFocus />
            </FormField>

            <FormField label="Project">
              <select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} style={inputStyle}>
                <option value="">No project</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Priority">
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </FormField>
              <FormField label="Status">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Due Date">
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inputStyle} />
            </FormField>

            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Add details..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}
              </button>
              <button onClick={() => setShowCreate(false)} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
