'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  X, Plus, Flag, Calendar, FolderOpen, Tag, User,
  ChevronDown, Check, Send, Trash2, LayoutGrid, List,
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { Avatar } from '@/components/ui/Avatar';
import toast from 'react-hot-toast';

// ── Constants ─────────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: 'var(--text-3)',   dim: 'rgba(74,77,106,0.15)' },
  { id: 'in_progress', label: 'In Progress',  color: 'var(--indigo)',   dim: 'var(--indigo-2)' },
  { id: 'review',      label: 'Review',       color: 'var(--amber)',    dim: 'var(--amber-2)' },
  { id: 'done',        label: 'Done',         color: 'var(--emerald)',  dim: 'var(--emerald-2)' },
];

const STATUS_MAP: Record<string, { label: string; color: string; dim: string }> = {
  todo:        { label: 'To Do',       color: 'var(--text-3)',  dim: 'rgba(74,77,106,0.15)' },
  in_progress: { label: 'In Progress', color: 'var(--indigo)',  dim: 'var(--indigo-2)' },
  inprogress:  { label: 'In Progress', color: 'var(--indigo)',  dim: 'var(--indigo-2)' },
  review:      { label: 'In Review',   color: 'var(--amber)',   dim: 'var(--amber-2)' },
  done:        { label: 'Done',        color: 'var(--emerald)', dim: 'var(--emerald-2)' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  low:      { label: 'Low',      color: 'var(--emerald)' },
  medium:   { label: 'Medium',   color: 'var(--indigo)' },
  high:     { label: 'High',     color: 'var(--amber)' },
  critical: { label: 'Critical', color: 'var(--rose)' },
};

const TAGS = ['Design', 'Content', 'Social', 'Paid Ads', 'SEO', 'Video', 'Development', 'Strategy'];

// ── Shared style helpers ──────────────────────────────────────────────────────

const labelSt: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
  textTransform: 'uppercase', letterSpacing: '0.8px',
  display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7,
};
const inputSt: React.CSSProperties = {
  width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-hover)',
  borderRadius: 7, color: 'var(--text)', padding: '7px 9px',
  fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};
const selectSt: React.CSSProperties = {
  ...({} as any),
  width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-hover)',
  borderRadius: 7, color: 'var(--text)', padding: '7px 9px',
  fontSize: 12, fontFamily: 'inherit', outline: 'none',
};

// ── StatusDropdown ─────────────────────────────────────────────────────────────

function StatusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const cur = STATUS_MAP[value] || STATUS_MAP.todo;
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
        borderRadius: 6, border: `1px solid color-mix(in srgb, ${cur.color} 40%, transparent)`,
        background: cur.dim, color: cur.color,
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: cur.color, flexShrink: 0 }} />
        {cur.label}
        <ChevronDown size={11} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50,
            background: 'var(--surface)', border: '1px solid var(--border-hover)',
            borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow)', minWidth: 160,
          }}>
            {COLUMNS.map(s => (
              <button key={s.id} onClick={() => { onChange(s.id); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: value === s.id ? s.dim : 'transparent',
                  color: value === s.id ? s.color : 'var(--text-2)',
                  fontSize: 13, fontWeight: value === s.id ? 600 : 400, transition: 'background 0.1s',
                }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                {s.label}
                {value === s.id && <Check size={12} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── AssigneeDropdown ───────────────────────────────────────────────────────────

function AssigneeDropdown({ value, team, onChange }: { value: string; team: any[]; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const cur = team.find((m: any) => m.id === value);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-hover)',
        background: 'var(--input-bg)', cursor: 'pointer',
      }}>
        {cur ? (
          <><Avatar name={cur.name} size={22} /><span style={{ fontSize: 12, color: 'var(--text)', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cur.name}</span></>
        ) : (
          <><div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={12} color="var(--text-3)" /></div><span style={{ fontSize: 12, color: 'var(--text-3)' }}>Unassigned</span></>
        )}
        <ChevronDown size={11} color="var(--text-3)" />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
            background: 'var(--surface)', border: '1px solid var(--border-hover)',
            borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow)',
          }}>
            <div onClick={() => { onChange(''); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', background: !value ? 'var(--indigo-2)' : 'transparent' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={13} color="var(--text-3)" /></div>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Unassigned</span>
              {!value && <Check size={12} color="var(--indigo)" style={{ marginLeft: 'auto' }} />}
            </div>
            {team.map((m: any) => (
              <div key={m.id} onClick={() => { onChange(m.id); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', background: value === m.id ? 'var(--indigo-2)' : 'transparent' }}>
                <Avatar name={m.name} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role}</div>
                </div>
                {value === m.id && <Check size={12} color="var(--indigo)" />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── CommentItem ────────────────────────────────────────────────────────────────

function CommentItem({ comment }: { comment: any }) {
  const authorName = comment.user?.name || comment.name || 'User';
  const text = comment.body || comment.text || '';

  function renderText(t: string) {
    return t.split(/(@[\w][\w\s]*?\b)/g).map((part, i) =>
      part.startsWith('@')
        ? <span key={i} style={{ background: 'var(--indigo-2)', color: 'var(--indigo)', padding: '0 4px', borderRadius: 4, fontWeight: 600, fontSize: 12 }}>{part}</span>
        : part
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Avatar name={authorName} size={28} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{authorName}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {comment.created_at ? new Date(comment.created_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'just now'}
          </span>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px 10px 10px 10px', padding: '8px 12px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
          {renderText(text)}
        </div>
      </div>
    </div>
  );
}

// ── TaskDetailModal ───────────────────────────────────────────────────────────

function TaskDetailModal({
  task: initial, team, projects,
  onClose, onUpdate, onDelete,
}: {
  task: any; team: any[]; projects: any[];
  onClose: () => void;
  onUpdate: (t: any) => void;
  onDelete: (id: string) => void;
}) {
  const [task, setTask]         = useState(initial);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment]   = useState('');
  const [sending, setSending]   = useState(false);
  const [editingTitle, setEditingTitle]   = useState(false);
  const [editingDesc, setEditingDesc]     = useState(false);
  const [titleDraft, setTitleDraft]       = useState(initial.title);
  const [descDraft, setDescDraft]         = useState(initial.description || '');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions]   = useState(false);
  const [mentionIndex, setMentionIndex]   = useState(0);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  // Load comments
  useEffect(() => {
    apiClient.get(`/tasks/${task.id}/comments`)
      .then(r => setComments(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [task.id]);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !editingTitle && !editingDesc) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [editingTitle, editingDesc]);

  async function patch(field: string, value: any) {
    const updated = { ...task, [field]: value };
    setTask(updated);
    try {
      const r = await apiClient.patch(`/tasks/${task.id}`, { [field]: value });
      const fresh = { ...updated, ...(r.data || {}) };
      setTask(fresh);
      onUpdate(fresh);
    } catch (err: any) {
      setTask(task);
      toast.error(err?.response?.data?.error?.message || 'Update failed');
    }
  }

  async function saveTitle() {
    if (titleDraft.trim() && titleDraft !== task.title) await patch('title', titleDraft.trim());
    setEditingTitle(false);
  }

  async function saveDesc() {
    if (descDraft !== task.description) await patch('description', descDraft);
    setEditingDesc(false);
  }

  function handleCommentInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setComment(val);
    const lastAt = val.lastIndexOf('@');
    if (lastAt !== -1) {
      const after = val.slice(lastAt + 1);
      if (!after.includes(' ') && after.length <= 20) {
        setMentionSearch(after);
        setShowMentions(true);
        setMentionIndex(0);
        return;
      }
    }
    setShowMentions(false);
  }

  function insertMention(member: any) {
    const lastAt = comment.lastIndexOf('@');
    setComment(comment.slice(0, lastAt) + `@${member.name} `);
    setShowMentions(false);
    commentRef.current?.focus();
  }

  const mentionResults = team.filter((m: any) =>
    m.name.toLowerCase().includes(mentionSearch.toLowerCase())
  ).slice(0, 5);

  async function sendComment() {
    const text = comment.trim();
    if (!text || sending) return;
    setSending(true);
    // Extract @mentions
    const mentions: string[] = [];
    const regex = /@([\w][^\s@]*(?:\s[\w][^\s@]*)?)/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      const found = team.find((t: any) => t.name.toLowerCase() === m![1].trim().toLowerCase());
      if (found) mentions.push(found.id);
    }
    try {
      const r = await apiClient.post(`/tasks/${task.id}/comments`, { text, mentions });
      setComments(prev => [...prev, r.data]);
      setComment('');
      setTask((t: any) => ({ ...t, comment_count: (t.comment_count || 0) + 1 }));
    } catch { toast.error('Failed to send comment'); } finally { setSending(false); }
  }

  async function deleteTask() {
    if (!confirm('Delete this task permanently?')) return;
    try {
      await apiClient.delete(`/tasks/${task.id}`);
      onDelete(task.id);
      onClose();
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', border: '1px solid var(--border-hover)',
        borderRadius: 16, width: 760, maxWidth: '100%', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <StatusDropdown value={task.status} onChange={v => patch('status', v)} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={deleteTask} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--rose)', cursor: 'pointer' }}>
              <Trash2 size={13} />
            </button>
            <button onClick={onClose} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-2)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left — main content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Title */}
            <div>
              {editingTitle ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={e => setTitleDraft(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveTitle(); } if (e.key === 'Escape') setEditingTitle(false); }}
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', borderBottom: '2px solid var(--indigo)', paddingBottom: 4, fontSize: 20, fontWeight: 700, color: 'var(--text)', fontFamily: 'inherit' }}
                />
              ) : (
                <h2 onClick={() => { setEditingTitle(true); setTitleDraft(task.title); }}
                  style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', cursor: 'text', lineHeight: 1.3 }}
                  title="Click to edit">
                  {task.title}
                </h2>
              )}
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Description</div>
              {editingDesc ? (
                <textarea
                  autoFocus
                  value={descDraft}
                  onChange={e => setDescDraft(e.target.value)}
                  onBlur={saveDesc}
                  rows={4}
                  style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--indigo)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
                />
              ) : (
                <div
                  onClick={() => { setEditingDesc(true); setDescDraft(task.description || ''); }}
                  style={{ fontSize: 13, color: task.description ? 'var(--text-2)' : 'var(--text-3)', lineHeight: 1.7, cursor: 'text', padding: '8px 10px', borderRadius: 8, border: '1px solid transparent', minHeight: 56, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--card)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                  {task.description || 'Click to add a description…'}
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
                Comments ({comments.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {comments.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>No comments yet. Be the first!</div>
                ) : comments.map((c: any) => <CommentItem key={c.id} comment={c} />)}
              </div>

              {/* Comment input */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <textarea
                    ref={commentRef}
                    value={comment}
                    onChange={handleCommentInput}
                    onKeyDown={e => {
                      if (showMentions) {
                        if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, mentionResults.length - 1)); return; }
                        if (e.key === 'ArrowUp')   { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)); return; }
                        if (e.key === 'Enter' && mentionResults[mentionIndex]) { e.preventDefault(); insertMention(mentionResults[mentionIndex]); return; }
                        if (e.key === 'Escape') { setShowMentions(false); return; }
                      }
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComment(); }
                    }}
                    placeholder="Write a comment… Use @ to mention"
                    rows={2}
                    style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-hover)', borderRadius: 10, color: 'var(--text)', padding: '9px 44px 9px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', lineHeight: 1.5, boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--indigo)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')}
                  />
                  <button onClick={sendComment} disabled={!comment.trim() || sending}
                    style={{ position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, background: comment.trim() ? 'var(--grad-primary)' : 'var(--border)', border: 'none', borderRadius: 7, color: 'white', cursor: comment.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    <Send size={13} />
                  </button>

                  {/* @mention dropdown */}
                  {showMentions && mentionResults.length > 0 && (
                    <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 4, background: 'var(--surface)', border: '1px solid var(--border-hover)', borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow)', zIndex: 100, minWidth: 200 }}>
                      {mentionResults.map((m: any, i: number) => (
                        <div key={m.id} onMouseDown={e => { e.preventDefault(); insertMention(m); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', background: i === mentionIndex ? 'var(--indigo-2)' : 'transparent' }}>
                          <Avatar name={m.name} size={22} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: '5px 12px', fontSize: 10, color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>↑↓ navigate · Enter select · Esc close</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right — properties */}
          <div style={{ width: 220, flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '18px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Assignee */}
            <div>
              <div style={labelSt}><User size={12} /> Assignee</div>
              <AssigneeDropdown
                value={task.assignee_id || task.assignees?.[0]?.id || ''}
                team={team}
                onChange={id => patch('assigneeId', id)}
              />
            </div>

            {/* Priority */}
            <div>
              <div style={labelSt}><Flag size={12} /> Priority</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(PRIORITY_MAP).map(([val, cfg]) => (
                  <button key={val} onClick={() => patch('priority', val)}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, border: 'none', background: task.priority === val ? `color-mix(in srgb, ${cfg.color} 12%, transparent)` : 'transparent', color: task.priority === val ? cfg.color : 'var(--text-2)', fontSize: 12, fontWeight: task.priority === val ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    {cfg.label}
                    {task.priority === val && <Check size={11} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div style={labelSt}><Calendar size={12} /> Due Date</div>
              <input type="date" value={task.due_date ? task.due_date.split('T')[0] : ''}
                onChange={e => patch('due_date', e.target.value || null)}
                style={inputSt} />
              {isOverdue && <div style={{ fontSize: 11, color: 'var(--rose)', marginTop: 4 }}>⚠️ Overdue</div>}
            </div>

            {/* Project */}
            <div>
              <div style={labelSt}><FolderOpen size={12} /> Project</div>
              <select value={task.project_id || ''} onChange={e => patch('project_id', e.target.value || null)} style={selectSt}>
                <option value="">No project</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Tag */}
            <div>
              <div style={labelSt}><Tag size={12} /> Tag</div>
              <select value={task.tag || ''} onChange={e => patch('tag', e.target.value || null)} style={selectSt}>
                <option value="">No tag</option>
                {TAGS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Meta */}
            <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.7 }}>
                {task.reporter_name && <div>By {task.reporter_name}</div>}
                {task.created_at && <div>{new Date(task.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const searchParams = useSearchParams();
  const [tasks, setTasks]       = useState<any[]>([]);
  const [team, setTeam]         = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState<'kanban' | 'list'>('kanban');
  const [selected, setSelected] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOver, setDragOver]   = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', priority: 'medium', status: 'todo',
    description: '', dueDate: '', assigneeId: '', projectId: '', tag: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get('/tasks'),
      apiClient.get('/org/team'),
      apiClient.get('/projects'),
    ]).then(([t, tm, p]) => {
      setTasks(Array.isArray(t.data) ? t.data : []);
      setTeam(Array.isArray(tm.data) ? tm.data : []);
      setProjects(Array.isArray(p.data) ? p.data : (p.data?.projects || []));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const r = await apiClient.post('/tasks', {
        title:       form.title.trim(),
        priority:    form.priority,
        status:      form.status,
        description: form.description || undefined,
        dueDate:     form.dueDate     || undefined,
        assigneeId:  form.assigneeId  || undefined,
        projectId:   form.projectId   || undefined,
        tag:         form.tag         || undefined,
      });
      setTasks(prev => [r.data, ...prev]);
      setForm({ title: '', priority: 'medium', status: 'todo', description: '', dueDate: '', assigneeId: '', projectId: '', tag: '' });
      setShowForm(false);
      toast.success('Task created!');
    } catch { toast.error('Failed to create task'); } finally { setSaving(false); }
  }

  async function handleDrop(newStatus: string) {
    if (!draggedId) return;
    const task = tasks.find(t => t.id === draggedId);
    if (!task || task.status === newStatus) { setDraggedId(null); setDragOver(null); return; }
    setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status: newStatus } : t));
    setDraggedId(null); setDragOver(null);
    try { await apiClient.patch(`/tasks/${task.id}`, { status: newStatus }); }
    catch { setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t)); }
  }

  function handleTaskUpdate(updated: any) {
    setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
    if (selected?.id === updated.id) setSelected(updated);
  }

  function handleTaskDelete(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelected(null);
  }

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1600, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Tasks</h1>
          <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{tasks.length} tasks total</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
            {(['kanban', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s', background: view === v ? 'var(--indigo-2)' : 'transparent', color: view === v ? 'var(--indigo)' : 'var(--text-3)' }}>
                {v === 'kanban' ? <LayoutGrid size={13} /> : <List size={13} />}
                {v === 'kanban' ? 'Board' : 'List'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--grad-primary)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: 16 }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ width: '100%', maxWidth: 520, background: 'var(--surface)', border: '1px solid var(--border-hover)', borderRadius: 16, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>New Task</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}><X size={18} /></button>
            </div>
            <form onSubmit={createTask} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Task title *" style={{ ...inputSt, fontSize: 14, padding: '10px 12px' }} />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description (optional)" rows={2}
                style={{ ...inputSt, resize: 'none', lineHeight: 1.5 }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ ...labelSt, marginBottom: 5 }}><Flag size={11} /> Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={selectSt}>
                    {Object.entries(PRIORITY_MAP).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelSt, marginBottom: 5 }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectSt}>
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelSt, marginBottom: 5 }}><FolderOpen size={11} /> Project</label>
                  <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} style={selectSt}>
                    <option value="">No project</option>
                    {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelSt, marginBottom: 5 }}><Tag size={11} /> Tag</label>
                  <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={selectSt}>
                    <option value="">No tag</option>
                    {TAGS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ ...labelSt, marginBottom: 5 }}><Calendar size={11} /> Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={inputSt} />
              </div>

              {/* Assignee */}
              <div>
                <label style={{ ...labelSt, marginBottom: 8 }}><User size={11} /> Assign To</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <div onClick={() => setForm({ ...form, assigneeId: '' })}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, cursor: 'pointer', border: `1px solid ${!form.assigneeId ? 'var(--indigo)' : 'var(--border)'}`, background: !form.assigneeId ? 'var(--indigo-2)' : 'transparent', fontSize: 12, color: !form.assigneeId ? 'var(--indigo)' : 'var(--text-2)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={11} color="var(--text-3)" /></div>
                    Unassigned
                  </div>
                  {team.map((m: any) => (
                    <div key={m.id} onClick={() => setForm({ ...form, assigneeId: m.id })}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, cursor: 'pointer', border: `1px solid ${form.assigneeId === m.id ? 'var(--indigo)' : 'var(--border)'}`, background: form.assigneeId === m.id ? 'var(--indigo-2)' : 'transparent', fontSize: 12, color: form.assigneeId === m.id ? 'var(--indigo)' : 'var(--text-2)', fontWeight: form.assigneeId === m.id ? 600 : 400 }}>
                      <Avatar name={m.name} size={20} />
                      {m.name.split(' ')[0]}
                      {form.assigneeId === m.id && <Check size={11} color="var(--indigo)" />}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', background: 'var(--grad-primary)', color: 'white', cursor: saving ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Creating…' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selected && (
        <TaskDetailModal
          task={selected}
          team={team}
          projects={projects}
          onClose={() => setSelected(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}

      {/* Kanban / List */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 240, borderRadius: 14, background: 'var(--card)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
      ) : view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))', gap: 12, overflowX: 'auto' }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            const isOver = dragOver === col.id;
            return (
              <div key={col.id}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(col.id)}
                style={{ background: isOver ? col.dim : 'var(--card)', border: `1px solid ${isOver ? col.color : 'var(--border)'}`, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', transition: 'all 0.15s', minHeight: 120 }}>
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', flex: 1 }}>{col.label}</span>
                  <span style={{ fontSize: 11, background: col.dim, color: col.color, padding: '1px 7px', borderRadius: 99, fontWeight: 700 }}>{colTasks.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  {colTasks.map(t => {
                    const p = PRIORITY_MAP[t.priority] || PRIORITY_MAP.medium;
                    const assignees: any[] = t.assignees || [];
                    const singleAssignee = assignees[0] || (t.assignee_name ? { name: t.assignee_name } : null);
                    const due = t.due_date;
                    const overdue = due && new Date(due) < new Date() && t.status !== 'done';
                    return (
                      <div key={t.id}
                        draggable
                        onDragStart={() => setDraggedId(t.id)}
                        onDragEnd={() => { setDraggedId(null); setDragOver(null); }}
                        onClick={() => setSelected(t)}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `3px solid ${p.color}`, borderRadius: 10, padding: '10px 12px', cursor: 'grab', opacity: draggedId === t.id ? 0.5 : 1, transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.35 }}>{t.title}</p>
                        {t.description && <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99, background: `color-mix(in srgb, ${p.color} 12%, transparent)`, color: p.color, textTransform: 'uppercase' }}>{p.label}</span>
                            {t.tag && <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 99, background: 'var(--cyan-2)', color: 'var(--cyan)', textTransform: 'uppercase' }}>{t.tag}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {due && <span style={{ fontSize: 10, color: overdue ? 'var(--rose)' : 'var(--text-3)' }}>{new Date(due).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>}
                            {singleAssignee && <Avatar name={singleAssignee.name} size={20} title={singleAssignee.name} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => { setForm(f => ({ ...f, status: col.id })); setShowForm(true); }}
                  style={{ marginTop: 8, width: '100%', padding: '6px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = col.color; (e.currentTarget as HTMLButtonElement).style.color = col.color; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)'; }}>
                  + Add task
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p>No tasks yet. Create your first task!</p>
            </div>
          ) : tasks.map((t, i) => {
            const p = PRIORITY_MAP[t.priority] || PRIORITY_MAP.medium;
            const col = STATUS_MAP[t.status] || STATUS_MAP.todo;
            const assignees: any[] = t.assignees || [];
            const singleAssignee = assignees[0] || (t.assignee_name ? { name: t.assignee_name } : null);
            return (
              <div key={t.id} onClick={() => setSelected(t)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: i !== 0 ? '1px solid var(--border)' : undefined, cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 1 }}>{t.title}</p>
                  {t.description && <p style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>}
                </div>
                {t.tag && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'var(--cyan-2)', color: 'var(--cyan)', fontWeight: 700, flexShrink: 0 }}>{t.tag}</span>}
                {singleAssignee && <Avatar name={singleAssignee.name} size={24} title={singleAssignee.name} />}
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: col.dim, color: col.color, fontWeight: 600, flexShrink: 0 }}>{col.label}</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: `color-mix(in srgb, ${p.color} 12%, transparent)`, color: p.color, fontWeight: 600, flexShrink: 0 }}>{p.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
