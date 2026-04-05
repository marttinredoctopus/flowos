'use client';
import { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import { LoadingScreen, EmptyState, Modal, FormField, PriorityBadge, inputStyle, formatDate } from '@/components/ui/shared';
import { PencilSimple, Trash, SquaresFour, ListBullets, CalendarBlank, Plus, CaretLeft, CaretRight } from '@phosphor-icons/react';
import TaskDetailPanel from '@/components/tasks/TaskDetailPanel';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: '#6b7280', bg: 'rgba(107,114,128,0.06)' },
  { id: 'in_progress', label: 'In Progress', color: '#6366f1', bg: 'rgba(99,102,241,0.06)'  },
  { id: 'review',      label: 'In Review',   color: '#f59e0b', bg: 'rgba(245,158,11,0.06)'  },
  { id: 'done',        label: 'Done',        color: '#22c55e', bg: 'rgba(34,197,94,0.06)'   },
];

const PRIORITY_COLOR: Record<string, string> = {
  low: '#22c55e', medium: '#f59e0b', high: '#f97316', urgent: '#ef4444',
};

type Form = {
  title: string; description: string; project_id: string;
  priority: string; due_date: string; status: string;
};

const EMPTY: Form = { title: '', description: '', project_id: '', priority: 'medium', due_date: '', status: 'todo' };

function isOverdue(date: string) {
  return !!date && new Date(date) < new Date();
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Tasks() {
  const [tasks, setTasks]           = useState<any[]>([]);
  const [projects, setProjects]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState<'board' | 'list' | 'calendar'>('board');
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask]     = useState<any>(null);
  const [form, setForm]             = useState<Form>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [dragging, setDragging]     = useState<string | null>(null);
  const [dragOver, setDragOver]     = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [calYear, setCalYear]       = useState(new Date().getFullYear());
  const [calMonth, setCalMonth]     = useState(new Date().getMonth());

  useEffect(() => {
    Promise.all([
      apiGet('/api/tasks').catch(() => null),
      apiGet('/api/projects').catch(() => null),
    ]).then(([t, p]) => {
      const tList = t?.data?.tasks ?? t?.tasks ?? t?.data ?? t ?? [];
      const pList = p?.data?.projects ?? p?.projects ?? p?.data ?? p ?? [];
      setTasks(Array.isArray(tList) ? tList : []);
      setProjects(Array.isArray(pList) ? pList : []);
    }).finally(() => setLoading(false));
  }, []);

  function openCreate(status = 'todo') {
    setEditTask(null);
    setForm({ ...EMPTY, status });
    setShowCreate(true);
  }

  function openEdit(t: any, e?: React.MouseEvent) {
    e?.stopPropagation();
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

  async function deleteTask(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!confirm('Delete this task?')) return;
    try {
      await apiDelete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      if (selectedTask?.id === id) setSelectedTask(null);
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  async function moveTask(taskId: string, newStatus: string) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await apiPatch(`/api/tasks/${taskId}`, { status: newStatus }); }
    catch { toast.error('Failed to move task'); }
  }

  function handleTaskUpdate(updated: any) {
    setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
    setSelectedTask((prev: any) => prev ? { ...prev, ...updated } : prev);
  }

  // Calendar helpers
  function calDays() {
    const first = new Date(calYear, calMonth, 1).getDay();
    const total = new Date(calYear, calMonth + 1, 0).getDate();
    return { first, total };
  }

  function tasksOnDay(day: number) {
    return tasks.filter(t => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === day;
    });
  }

  const colColor = (status: string) => COLUMNS.find(c => c.id === status)?.color || '#6b7280';

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {([['board', SquaresFour], ['list', ListBullets], ['calendar', CalendarBlank]] as const).map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v as any)}
                style={{ padding: '8px 14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, background: view === v ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', color: view === v ? 'white' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                <Icon size={15} />{v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => openCreate()} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15} weight="bold" /> New Task
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon="✅" text="No tasks yet. Create your first task!" action="Create Task" onAction={() => openCreate()} />
      ) : (
        <>
          {/* ── BOARD VIEW ─────────────────────────────────────── */}
          {view === 'board' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, alignItems: 'start' }}>
              {COLUMNS.map(col => {
                const colTasks = tasks.filter(t => (t.status || 'todo') === col.id);
                const isOver = dragOver === col.id;
                return (
                  <div key={col.id}
                    onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => { e.preventDefault(); if (dragging) moveTask(dragging, col.id); setDragging(null); setDragOver(null); }}
                    style={{ background: isOver ? `${col.color}12` : col.bg, border: `1px solid ${isOver ? col.color : 'var(--border)'}`, borderRadius: 14, padding: 12, minHeight: 200, transition: 'all 0.15s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: col.color }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--card)', padding: '2px 7px', borderRadius: 99 }}>{colTasks.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {colTasks.map(task => (
                        <div key={task.id}
                          draggable
                          onDragStart={() => setDragging(task.id)}
                          onDragEnd={() => { setDragging(null); setDragOver(null); }}
                          onClick={() => setSelectedTask(task)}
                          style={{ background: 'var(--card)', border: `1px solid ${selectedTask?.id === task.id ? col.color : 'var(--border)'}`, borderLeft: `3px solid ${col.color}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer', opacity: dragging === task.id ? 0.5 : 1 }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>{task.title}</div>
                            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                              <button onClick={e => openEdit(task, e)} style={{ padding: '4px 5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}><PencilSimple size={13} /></button>
                              <button onClick={e => deleteTask(task.id, e)} style={{ padding: '4px 5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', display: 'flex', alignItems: 'center' }}><Trash size={13} /></button>
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

          {/* ── LIST VIEW ──────────────────────────────────────── */}
          {view === 'list' && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px 110px 80px', gap: 0, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                {['Task', 'Project', 'Assignee', 'Priority', 'Due Date', ''].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                ))}
              </div>
              {tasks.map((task, i) => {
                const cc = colColor(task.status || 'todo');
                return (
                  <div key={task.id} onClick={() => setSelectedTask(task)}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px 110px 80px', gap: 0, padding: '12px 16px', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.12s', background: selectedTask?.id === task.id ? 'rgba(99,102,241,0.04)' : 'transparent' }}
                    onMouseEnter={e => { if (selectedTask?.id !== task.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'; }}
                    onMouseLeave={e => { if (selectedTask?.id !== task.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: cc, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{task.title}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{task.project_name || '—'}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{task.assignee_name || '—'}</span>
                    <div style={{ alignSelf: 'center' }}><PriorityBadge priority={task.priority || 'medium'} /></div>
                    <span style={{ fontSize: 12, color: isOverdue(task.due_date) ? '#ef4444' : 'var(--text-muted)', alignSelf: 'center', fontWeight: isOverdue(task.due_date) ? 700 : 400 }}>
                      {task.due_date ? formatDate(task.due_date) : '—'}
                    </span>
                    <div style={{ display: 'flex', gap: 4, alignSelf: 'center', justifyContent: 'flex-end' }}>
                      <button onClick={e => openEdit(task, e)} style={{ padding: '4px 5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><PencilSimple size={13} /></button>
                      <button onClick={e => deleteTask(task.id, e)} style={{ padding: '4px 5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', display: 'flex', alignItems: 'center' }}><Trash size={13} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CALENDAR VIEW ──────────────────────────────────── */}
          {view === 'calendar' && (() => {
            const { first, total } = calDays();
            const cells = Array.from({ length: first + total }, (_, i) => i < first ? null : i - first + 1);
            while (cells.length % 7 !== 0) cells.push(null);
            const today = new Date();
            return (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Calendar nav */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                    <CaretLeft size={14} />
                  </button>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                    <CaretRight size={14} />
                  </button>
                </div>
                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--border)' }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
                  ))}
                </div>
                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                  {cells.map((day, idx) => {
                    const isToday = day !== null && today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === day;
                    const dayTasks = day ? tasksOnDay(day) : [];
                    return (
                      <div key={idx} style={{ minHeight: 90, padding: '6px 8px', borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--border)' : 'none', borderBottom: idx < cells.length - 7 ? '1px solid var(--border)' : 'none', background: day === null ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                        {day && (
                          <>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: isToday ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? 'white' : 'var(--text-muted)', marginBottom: 4 }}>
                              {day}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {dayTasks.slice(0, 3).map(t => (
                                <div key={t.id} onClick={() => setSelectedTask(t)}
                                  style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, background: `${colColor(t.status || 'todo')}22`, color: colColor(t.status || 'todo'), fontWeight: 600, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                  {t.title}
                                </div>
                              ))}
                              {dayTasks.length > 3 && (
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{dayTasks.length - 3} more</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Task Detail Panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          projects={projects}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={(id) => deleteTask(id)}
        />
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
