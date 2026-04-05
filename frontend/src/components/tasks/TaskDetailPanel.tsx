'use client';
import { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  X, Check, Plus, Trash, PaperclipHorizontal, ChatCircle,
  Timer, Play, Stop, CaretDown, Flag, CalendarBlank, User,
  ArrowsClockwise, FileText, Image, FilePdf,
} from '@phosphor-icons/react';
import { PriorityBadge, formatDate, inputStyle } from '@/components/ui/shared';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const STATUSES = ['todo','in_progress','review','done'];
const STATUS_LABELS: Record<string,string> = { todo:'To Do', in_progress:'In Progress', review:'In Review', done:'Done' };
const STATUS_COLORS: Record<string,string> = { todo:'#6b7280', in_progress:'#7030EF', review:'#FFB547', done:'#00E5A0' };
const PRIORITIES  = ['low','medium','high','urgent'];
const PRIORITY_COLORS: Record<string,string> = { low:'#00E5A0', medium:'#FFB547', high:'#FF7A30', urgent:'#FF4D6A' };

function fileIcon(mime = '') {
  if (mime.startsWith('image/')) return <Image size={14} color="#7030EF" />;
  if (mime === 'application/pdf') return <FilePdf size={14} color="#FF4D6A" />;
  return <FileText size={14} color="#FFB547" />;
}
function fmtDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

interface Props {
  taskId: string | null;
  onClose: () => void;
  onUpdated?: (task: any) => void;
  teamList?: any[];
}

export default function TaskDetailPanel({ taskId, onClose, onUpdated, teamList = [] }: Props) {
  const [task,        setTask]        = useState<any>(null);
  const [comments,    setComments]    = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [subtasks,    setSubtasks]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);

  /* edit state */
  const [editTitle, setEditTitle] = useState(false);
  const [title,     setTitle]     = useState('');
  const [saving,    setSaving]    = useState(false);

  /* comment */
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  /* subtask */
  const [newSubtask, setNewSubtask] = useState('');

  /* attachment */
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* timer */
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalLogged,  setTotalLogged]  = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const entryRef = useRef<string | null>(null);

  /* active tab */
  const [activeTab, setActiveTab] = useState<'subtasks'|'comments'|'attachments'>('subtasks');

  /* ─── Load ─────────────────────────────────────── */
  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    setTask(null);
    Promise.all([
      apiGet(`/api/tasks/${taskId}`),
      apiGet(`/api/tasks/${taskId}/comments`),
      apiGet(`/api/tasks/${taskId}/attachments`),
    ]).then(([t, c, a]) => {
      setTask(t);
      setTitle(t.title || '');
      setSubtasks(t.subtasks || []);
      setComments(Array.isArray(c) ? c : []);
      setAttachments(Array.isArray(a) ? a : []);
      // total time from time_entries
      apiGet(`/api/time-entries?taskId=${taskId}`).then(te => {
        const entries = te?.entries || te?.data || te || [];
        const total = Array.isArray(entries)
          ? entries.reduce((sum: number, e: any) => sum + (e.duration_seconds || 0), 0)
          : 0;
        setTotalLogged(total);
      }).catch(() => {});
    }).catch(() => toast.error('Failed to load task'))
    .finally(() => setLoading(false));
  }, [taskId]);

  /* ─── Timer ─────────────────────────────────────── */
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function startTimer() {
    try {
      const res = await apiPost('/api/time-entries', { taskId, action: 'start' });
      entryRef.current = res?.id || res?.entry?.id;
      setTimerRunning(true);
      setTimerSeconds(0);
      timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } catch { toast.error('Failed to start timer'); }
  }

  async function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTimerRunning(false);
    try {
      if (entryRef.current) {
        await apiPatch(`/api/time-entries/${entryRef.current}`, { action: 'stop' });
        setTotalLogged(prev => prev + timerSeconds);
      }
    } catch { /* best-effort */ }
    setTimerSeconds(0);
  }

  /* ─── Field update ───────────────────────────────── */
  async function updateField(field: string, value: any) {
    setTask((prev: any) => ({ ...prev, [field]: value }));
    try {
      const updated = await apiPatch(`/api/tasks/${taskId}`, { [field]: value });
      onUpdated?.(updated);
    } catch { toast.error('Failed to update'); }
  }

  async function saveTitle() {
    setEditTitle(false);
    if (!title.trim() || title === task?.title) return;
    setSaving(true);
    await updateField('title', title.trim());
    setSaving(false);
  }

  /* ─── Subtasks ────────────────────────────────────── */
  async function addSubtask() {
    if (!newSubtask.trim()) return;
    try {
      const res = await apiPost('/api/tasks', {
        title: newSubtask.trim(),
        parentId: taskId,
        projectId: task?.project_id,
        status: 'todo',
        priority: 'medium',
      });
      const created = res?.task || res;
      if (created?.id) setSubtasks(prev => [...prev, created]);
      setNewSubtask('');
    } catch { toast.error('Failed to add subtask'); }
  }

  async function toggleSubtask(id: string, done: boolean) {
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, status: done ? 'done' : 'todo' } : s));
    apiPatch(`/api/tasks/${id}`, { status: done ? 'done' : 'todo' }).catch(() => {});
  }

  async function deleteSubtask(id: string) {
    setSubtasks(prev => prev.filter(s => s.id !== id));
    apiDelete(`/api/tasks/${id}`).catch(() => {});
  }

  /* ─── Comments ────────────────────────────────────── */
  async function addComment() {
    if (!newComment.trim()) return;
    setAddingComment(true);
    try {
      const res = await apiPost(`/api/tasks/${taskId}/comments`, { body: newComment.trim() });
      setComments(prev => [...prev, res]);
      setNewComment('');
    } catch { toast.error('Failed to add comment'); }
    finally { setAddingComment(false); }
  }

  /* ─── Attachments ─────────────────────────────────── */
  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = (window as any).__TASKSDONE_AUTH_TOKEN__;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'tasks');
      const r = await fetch(`${API}/upload/single`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!r.ok) throw new Error('Upload failed');
      const data = await r.json();
      const url = data.url || data.data?.url;
      const res = await apiPost(`/api/tasks/${taskId}/attachments`, {
        name: file.name, file_url: url, mime_type: file.type, size_bytes: file.size,
      });
      setAttachments(prev => [res, ...prev]);
      toast.success('Attached!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  async function removeAttachment(id: string) {
    setAttachments(prev => prev.filter(a => a.id !== id));
    apiDelete(`/api/tasks/${taskId}/attachments/${id}`).catch(() => {});
  }

  /* ─── Render ─────────────────────────────────────── */
  if (!taskId) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(3px)' }} />

      {/* Panel */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 700, maxWidth: '95vw', background: 'var(--card)', borderLeft: '1px solid var(--border)', zIndex: 201, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #7030EF', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : !task ? null : (
          <>
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editTitle ? (
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') { setEditTitle(false); setTitle(task.title); }}}
                    autoFocus
                    style={{ ...inputStyle, fontSize: 18, fontWeight: 700, width: '100%' }}
                  />
                ) : (
                  <h2 onClick={() => setEditTitle(true)} style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0, cursor: 'text', lineHeight: 1.4, padding: '6px 8px', borderRadius: 6, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    {task.title}
                  </h2>
                )}
                {task.project_name && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, marginTop: 2 }}>📁 {task.project_name}</div>
                )}
              </div>
              <button onClick={onClose} style={{ padding: '6px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
              {/* Main content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>Description</label>
                  <textarea
                    defaultValue={task.description || ''}
                    onBlur={e => { if (e.target.value !== (task.description || '')) updateField('description', e.target.value); }}
                    placeholder="Add a description..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Caption */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>Caption / Copy</label>
                  <textarea
                    defaultValue={task.caption || ''}
                    onBlur={e => { if (e.target.value !== (task.caption || '')) updateField('caption', e.target.value); }}
                    placeholder="Social media caption or copy for this task..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Tabs */}
                <div>
                  <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                    {([
                      { id:'subtasks',    label: `Subtasks (${subtasks.length})` },
                      { id:'comments',    label: `Comments (${comments.length})` },
                      { id:'attachments', label: `Attachments (${attachments.length})` },
                    ] as const).map(t => (
                      <button key={t.id} onClick={() => setActiveTab(t.id)}
                        style={{ padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500, color: activeTab === t.id ? '#7030EF' : 'var(--text-muted)', borderBottom: activeTab === t.id ? '2px solid #7030EF' : '2px solid transparent', marginBottom: -1, transition: 'all 0.15s' }}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Subtasks tab */}
                  {activeTab === 'subtasks' && (
                    <div>
                      {subtasks.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, marginBottom: 10, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 99, width: `${Math.round((subtasks.filter(s=>s.status==='done').length/subtasks.length)*100)}%`, background: 'linear-gradient(90deg,#7030EF,#DB1FFF)', transition: 'width 0.3s' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {subtasks.map((s: any) => (
                              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--surface)', group: true } as any}>
                                <button onClick={() => toggleSubtask(s.id, s.status !== 'done')}
                                  style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${s.status==='done' ? '#7030EF' : 'var(--border)'}`, background: s.status==='done' ? '#7030EF' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                                  {s.status==='done' && <Check size={11} color="white" weight="bold" />}
                                </button>
                                <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', textDecoration: s.status==='done' ? 'line-through' : 'none', opacity: s.status==='done' ? 0.6 : 1 }}>{s.title}</span>
                                <button onClick={() => deleteSubtask(s.id)} style={{ padding: '2px 4px', borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', opacity: 0.6, display: 'flex', alignItems: 'center' }}><Trash size={12} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubtask()} placeholder="Add a subtask..." style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                        <button onClick={addSubtask} disabled={!newSubtask.trim()} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: newSubtask.trim() ? 1 : 0.5 }}>Add</button>
                      </div>
                    </div>
                  )}

                  {/* Comments tab */}
                  {activeTab === 'comments' && (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        {comments.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No comments yet. Start the conversation!</p>}
                        {comments.map((c: any) => (
                          <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                              {(c.name || c.user?.name || '?')[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{c.name || c.user?.name}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleString()}</span>
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, background: 'var(--surface)', padding: '8px 12px', borderRadius: '0 10px 10px 10px' }}>{c.body || c.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <textarea value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(); }}} placeholder="Add a comment... (Enter to send)" rows={2} style={{ ...inputStyle, flex: 1, resize: 'none', fontSize: 13 }} />
                        <button onClick={addComment} disabled={addingComment || !newComment.trim()} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-end', opacity: newComment.trim() ? 1 : 0.5 }}>Send</button>
                      </div>
                    </div>
                  )}

                  {/* Attachments tab */}
                  {activeTab === 'attachments' && (
                    <div>
                      <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={uploadFile} />
                      <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', width: '100%', justifyContent: 'center', marginBottom: 12 }}>
                        <PaperclipHorizontal size={15} /> {uploading ? 'Uploading...' : 'Click to attach a file'}
                      </button>
                      {attachments.length === 0 && !uploading && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>No attachments yet</p>}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {attachments.map((a: any) => (
                          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--surface)', borderRadius: 8 }}>
                            {fileIcon(a.mime_type)}
                            <a href={a.file_url} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: 13, color: 'var(--text)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</a>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.size_bytes ? `${(a.size_bytes/1024).toFixed(0)}KB` : ''}</span>
                            <button onClick={() => removeAttachment(a.id)} style={{ padding: '3px 5px', borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', display: 'flex', alignItems: 'center', opacity: 0.7 }}><Trash size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right sidebar — metadata */}
              <div style={{ width: 220, flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>

                {/* Status */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Status</div>
                  <select value={task.status || 'todo'} onChange={e => updateField('status', e.target.value)}
                    style={{ ...inputStyle, width: '100%', fontSize: 12, color: STATUS_COLORS[task.status] || '#6b7280', fontWeight: 700 }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Priority</div>
                  <select value={task.priority || 'medium'} onChange={e => updateField('priority', e.target.value)}
                    style={{ ...inputStyle, width: '100%', fontSize: 12, color: PRIORITY_COLORS[task.priority] || '#FFB547', fontWeight: 700 }}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Assignee</div>
                  <select value={task.assignee_id || ''} onChange={e => updateField('assignee_id', e.target.value || null)}
                    style={{ ...inputStyle, width: '100%', fontSize: 12 }}>
                    <option value="">Unassigned</option>
                    {teamList.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                {/* Due date */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Due Date</div>
                  <input type="date" value={task.due_date ? task.due_date.slice(0,10) : ''}
                    onChange={e => updateField('due_date', e.target.value || null)}
                    style={{ ...inputStyle, width: '100%', fontSize: 12, boxSizing: 'border-box' }} />
                </div>

                {/* Repeat */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Repeat</div>
                  <select value={task.repeat_type || 'none'} onChange={e => updateField('repeat_type', e.target.value)}
                    style={{ ...inputStyle, width: '100%', fontSize: 12 }}>
                    <option value="none">No repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Time Tracking */}
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Time Tracking</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: timerRunning ? '#7030EF' : 'var(--text)', textAlign: 'center', fontFamily: 'monospace', marginBottom: 8, letterSpacing: 1 }}>
                    {fmtDuration(timerRunning ? timerSeconds : 0)}
                  </div>
                  {totalLogged > 0 && !timerRunning && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 6 }}>
                      Total: {fmtDuration(totalLogged)}
                    </div>
                  )}
                  <button onClick={timerRunning ? stopTimer : startTimer}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: timerRunning ? 'rgba(255,77,106,0.15)' : 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: timerRunning ? '#FF4D6A' : 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {timerRunning ? <><Stop size={13} /> Stop</> : <><Play size={13} /> Start Timer</>}
                  </button>
                </div>

                {/* Meta */}
                <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingTop: 4 }}>
                  <div>Created {task.created_at ? new Date(task.created_at).toLocaleDateString() : '—'}</div>
                  {task.updated_at && <div>Updated {new Date(task.updated_at).toLocaleDateString()}</div>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </>
  );
}
