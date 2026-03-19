'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  CheckCircle2, Clock, AlertCircle, ThumbsUp, ThumbsDown,
  MessageCircle, Send, X, Play, Image as ImageIcon, FileText,
  FolderKanban, CalendarDays, Palette, TrendingUp, Bell,
  ChevronDown, ChevronRight, Star, Zap, Activity,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://tasksdone.cloud/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PortalData {
  client: { id: string; name: string; company?: string; avatar_url?: string };
  projects: Project[];
  content: ContentPiece[];
  designs?: Design[];
  tasks?: Task[];
  activity?: ActivityItem[];
  insights?: string[];
  stats: {
    totalProjects: number; activeProjects: number;
    completedTasks: number; pendingTasks: number;
    pendingApprovals: number; overallProgress: number;
    nextDeliverable?: { name: string; date: string };
  };
}

interface Project {
  id: string; name: string; status: string; progress: number;
  start_date?: string; end_date?: string; service_type?: string;
}

interface Design {
  id: string; title: string; asset_type: string; status: string;
  deadline?: string; brief_content?: string;
}

interface ContentPiece {
  id: string; title: string; platform: string; content_type: string;
  status: string; publish_at?: string; caption?: string; media_urls?: string[];
  rejection_note?: string;
}

interface Task {
  id: string; title: string; status: string; due_date?: string;
  project_name?: string;
}

interface ActivityItem {
  id: string; action: string; entity_name?: string; actor_name?: string;
  entity_type?: string; created_at: string; meta?: any;
}

interface Comment {
  id: string; body: string; author_name: string; author_avatar?: string;
  created_at: string; replies: Comment[]; parent_id?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:             { label: 'Active',            color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  completed:          { label: 'Completed',          color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  in_progress:        { label: 'In Progress',        color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  done:               { label: 'Done',               color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  todo:               { label: 'To Do',              color: '#8b949e', bg: 'rgba(139,148,158,0.1)' },
  draft:              { label: 'Draft',              color: '#8b949e', bg: 'rgba(139,148,158,0.1)' },
  scheduled:          { label: 'Scheduled',          color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  published:          { label: 'Published',          color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  approved:           { label: 'Approved',           color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  client_approved:    { label: 'Approved',           color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  revision_required:  { label: 'Changes Requested',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  review:             { label: 'In Review',          color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  brief_received:     { label: 'Brief Received',     color: '#8b949e', bg: 'rgba(139,148,158,0.1)' },
  in_design:          { label: 'In Design',          color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
};

function Badge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#8b949e', bg: 'rgba(139,148,158,0.1)' };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
      background: cfg.bg, color: cfg.color, textTransform: 'capitalize' as any }}>
      {cfg.label}
    </span>
  );
}

function Avatar({ name, url, size = 36 }: { name: string; url?: string; size?: number }) {
  if (url) return <img src={url} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' as any }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: '#fff',
    }}>{name?.[0]?.toUpperCase() || '?'}</div>
  );
}

function formatDate(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const PLATFORM_ICON: Record<string, string> = {
  instagram: '📸', facebook: '📘', twitter: '🐦', x: '🐦',
  tiktok: '🎵', youtube: '📺', linkedin: '💼', other: '📄',
};

const ACTION_ICON: Record<string, { icon: React.ReactNode; color: string }> = {
  task_created:     { icon: <FolderKanban size={14} />, color: '#6366f1' },
  task_completed:   { icon: <CheckCircle2 size={14} />, color: '#22c55e' },
  design_uploaded:  { icon: <Palette size={14} />, color: '#8b5cf6' },
  design_approved:  { icon: <ThumbsUp size={14} />, color: '#22c55e' },
  design_rejected:  { icon: <ThumbsDown size={14} />, color: '#f59e0b' },
  content_approved: { icon: <ThumbsUp size={14} />, color: '#22c55e' },
  content_rejected: { icon: <ThumbsDown size={14} />, color: '#f59e0b' },
  comment_added:    { icon: <MessageCircle size={14} />, color: '#6366f1' },
  file_uploaded:    { icon: <FileText size={14} />, color: '#0ea5e9' },
  project_created:  { icon: <FolderKanban size={14} />, color: '#6366f1' },
};

// ─── Approval Modal ───────────────────────────────────────────────────────────
function ApprovalModal({
  item, type, token, onDone, onClose,
}: {
  item: any; type: 'design' | 'content'; token: string;
  onDone: (id: string, approved: boolean, note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<boolean | null>(null);

  const submit = async (approved: boolean) => {
    setDecision(approved);
    setLoading(true);
    try {
      const endpoint = type === 'design'
        ? `${API}/design/briefs/${item.id}/approve`
        : `${API}/content-pieces/${item.id}/approve`;

      await axios.post(endpoint, { approved, note }, {
        headers: { Authorization: `Bearer portal-${token}` },
      });
      onDone(item.id, approved, note);
      onClose();
    } catch {
      setLoading(false);
      setDecision(null);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 28, width: '100%', maxWidth: 480,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f2f9', margin: 0 }}>
              {type === 'design' ? 'Review Design' : 'Review Content'}
            </h3>
            <p style={{ fontSize: 13, color: '#8b949e', margin: '4px 0 0' }}>{item.title}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a comment or feedback (optional)..."
          rows={3}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, resize: 'none',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#f1f2f9', fontSize: 13, outline: 'none', marginBottom: 16,
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => submit(false)} disabled={loading}
            style={{
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading && decision === false ? 0.6 : 1,
            }}>
            <ThumbsDown size={15} /> Request Changes
          </button>
          <button onClick={() => submit(true)} disabled={loading}
            style={{
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: 'linear-gradient(135deg,#22c55e,#16a34a)',
              border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading && decision === true ? 0.7 : 1,
            }}>
            <ThumbsUp size={15} /> {loading && decision === true ? 'Approving…' : 'Approve ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Comment Thread ────────────────────────────────────────────────────────────
function CommentThread({ entityType, entityId, token }: {
  entityType: string; entityId: string; token: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/comments?entityType=${entityType}&entityId=${entityId}`, {
        headers: { Authorization: `Bearer portal-${token}` },
      });
      setComments(data);
    } catch {}
  }, [entityType, entityId, token]);

  useEffect(() => { if (open) load(); }, [open, load]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post(`${API}/comments`, {
        entityType, entityId, body: text.trim(),
        parentId: replyTo?.id || null,
      }, { headers: { Authorization: `Bearer portal-${token}` } });
      setComments(prev => replyTo
        ? prev.map(c => c.id === replyTo.id ? { ...c, replies: [...(c.replies || []), data] } : c)
        : [...prev, data]
      );
      setText('');
      setReplyTo(null);
    } finally { setSending(false); }
  };

  const total = comments.reduce((n, c) => n + 1 + (c.replies?.length || 0), 0);

  return (
    <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: 0,
      }}>
        <MessageCircle size={13} />
        {total > 0 ? `${total} comment${total !== 1 ? 's' : ''}` : 'Add comment'}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: 12 }}>
              <CommentBubble c={c} onReply={() => setReplyTo(c)} />
              {c.replies?.map(r => (
                <div key={r.id} style={{ marginLeft: 32, marginTop: 6 }}>
                  <CommentBubble c={r} onReply={() => {}} />
                </div>
              ))}
            </div>
          ))}

          {replyTo && (
            <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 6, display: 'flex', gap: 8 }}>
              Replying to {replyTo.author_name}
              <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 11 }}>Cancel</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              style={{
                flex: 1, padding: '8px 10px', borderRadius: 8, resize: 'none',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f2f9', fontSize: 13, outline: 'none',
              }}
            />
            <button onClick={send} disabled={!text.trim() || sending} style={{
              padding: '8px 12px', borderRadius: 8, background: '#6366f1',
              border: 'none', color: '#fff', cursor: 'pointer', flexShrink: 0,
              opacity: !text.trim() || sending ? 0.5 : 1,
            }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentBubble({ c, onReply }: { c: Comment; onReply: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Avatar name={c.author_name || 'You'} url={c.author_avatar} size={26} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f2f9' }}>{c.author_name || 'Client'}</span>
          <span style={{ fontSize: 11, color: '#8b949e' }}>{timeAgo(c.created_at)}</span>
        </div>
        <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5, background: 'rgba(255,255,255,0.03)',
          padding: '6px 10px', borderRadius: '0 8px 8px 8px' }}>
          {c.body}
        </div>
        <button onClick={onReply} style={{ fontSize: 11, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', marginTop: 3 }}>
          Reply
        </button>
      </div>
    </div>
  );
}

// ─── Media Preview ─────────────────────────────────────────────────────────────
function MediaPreview({ urls }: { urls?: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  if (!urls?.length) return null;

  const isVideo = (u: string) => /\.(mp4|webm|mov)$/i.test(u);
  const isImage = (u: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(u);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
        {urls.slice(0, 4).map((url, i) => (
          <div key={i} style={{
            width: 80, height: 80, borderRadius: 8, overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)', cursor: 'pointer', position: 'relative',
            border: '1px solid rgba(255,255,255,0.08)',
          }} onClick={() => setLightbox(url)}>
            {isVideo(url) ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={24} color="#8b5cf6" />
              </div>
            ) : isImage(url) ? (
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' as any }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="#8b949e" />
              </div>
            )}
            {i === 3 && urls.length > 4 && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, fontWeight: 700,
              }}>+{urls.length - 4}</div>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setLightbox(null)}>
          <button style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><X size={18} /></button>
          {isVideo(lightbox) ? (
            <video src={lightbox} controls style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
          ) : (
            <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' as any }} onClick={e => e.stopPropagation()} />
          )}
        </div>
      )}
    </>
  );
}

// ─── Main Portal Component ─────────────────────────────────────────────────────
export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'overview' | 'designs' | 'content' | 'timeline'>('overview');
  const [approvalItem, setApprovalItem] = useState<{ item: any; type: 'design' | 'content' } | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const { data: res } = await axios.get(`${API}/portal/${token}`);
      setData(res);
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Portal not found or link has expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080b10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.3)',
          borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#8b949e', fontSize: 14 }}>Loading your workspace...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#080b10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40, maxWidth: 380 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h2 style={{ color: '#f1f2f9', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Access Unavailable</h2>
        <p style={{ color: '#8b949e', fontSize: 14 }}>{error}</p>
      </div>
    </div>
  );

  if (!data) return null;

  const { client, projects, content, designs = [], tasks = [], activity = [], stats, insights = [] } = data;

  const needsApproval = [
    ...designs.filter(d => d.status === 'review' && !approvedIds.has(d.id)),
    ...content.filter(c => c.status === 'review' && !approvedIds.has(c.id)),
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080b10', color: '#f1f2f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <header style={{
        background: 'rgba(8,11,16,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={client.name} url={client.avatar_url} size={40} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f2f9', lineHeight: 1.2 }}>{client.name}</div>
            {client.company && <div style={{ fontSize: 12, color: '#8b949e' }}>{client.company}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {needsApproval.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
            }}>
              <Bell size={13} color="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>
                {needsApproval.length} pending approval{needsApproval.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <div style={{ fontSize: 12, color: '#8b949e', padding: '6px 12px',
            background: 'rgba(255,255,255,0.04)', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.07)' }}>
            Powered by TasksDone
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

        {/* ─── HERO STATS ────────────────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          {/* Progress + Next Delivery + Status */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 16, padding: '24px 28px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Overall Progress</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      width: `${stats.overallProgress || 0}%`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#6366f1', minWidth: 48 }}>
                    {stats.overallProgress || 0}%
                  </span>
                </div>
              </div>

              {stats.nextDeliverable && (
                <div style={{ textAlign: 'center', padding: '0 20px', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Next Delivery</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f2f9' }}>{stats.nextDeliverable.name}</div>
                  <div style={{ fontSize: 12, color: '#6366f1' }}>{formatDate(stats.nextDeliverable.date)}</div>
                </div>
              )}

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Status</div>
                <div style={{
                  fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 20,
                  background: stats.activeProjects > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)',
                  color: stats.activeProjects > 0 ? '#22c55e' : '#6366f1',
                }}>
                  {stats.activeProjects > 0 ? '🟢 In Progress' : '✅ All Done'}
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { label: 'Active Projects', value: stats.activeProjects, icon: <FolderKanban size={16} />, color: '#6366f1' },
              { label: 'Tasks Done', value: stats.completedTasks, icon: <CheckCircle2 size={16} />, color: '#22c55e' },
              { label: 'In Progress', value: stats.pendingTasks, icon: <Clock size={16} />, color: '#f59e0b' },
              { label: 'Awaiting Approval', value: needsApproval.length, icon: <AlertCircle size={16} />, color: needsApproval.length > 0 ? '#f59e0b' : '#8b949e' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f2f9', marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#8b949e' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── AI INSIGHTS ───────────────────────────────────────── */}
        {insights.length > 0 && (
          <div className="fade-up" style={{
            background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: 14, padding: '18px 20px', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Zap size={16} color="#8b5cf6" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6' }}>AI Insights</span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {insights.map((ins, i) => (
                <div key={i} style={{
                  padding: '8px 14px', borderRadius: 20, fontSize: 13,
                  background: 'rgba(139,92,246,0.08)', color: '#c4b5fd',
                  border: '1px solid rgba(139,92,246,0.15)',
                }}>
                  <TrendingUp size={11} style={{ display: 'inline', marginRight: 6 }} />
                  {ins}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PENDING APPROVALS BANNER ──────────────────────────── */}
        {needsApproval.length > 0 && (
          <div className="fade-up" style={{
            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 14, padding: '16px 20px', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <AlertCircle size={15} color="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>Action Required — {needsApproval.length} item{needsApproval.length > 1 ? 's' : ''} need your review</span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {needsApproval.map(item => {
                const type = designs.find(d => d.id === item.id) ? 'design' : 'content';
                return (
                  <button key={item.id} onClick={() => setApprovalItem({ item, type })} style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                    color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {type === 'design' ? <Palette size={12} /> : <CalendarDays size={12} />}
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TABS ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {([
            { id: 'overview', label: 'Overview', icon: <Activity size={13} /> },
            { id: 'designs', label: `Designs (${designs.length})`, icon: <Palette size={13} /> },
            { id: 'content', label: `Content (${content.length})`, icon: <CalendarDays size={13} /> },
            { id: 'timeline', label: 'Timeline', icon: <Clock size={13} /> },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#6366f1' : '#8b949e',
              borderBottom: `2px solid ${tab === t.id ? '#6366f1' : 'transparent'}`,
              transition: 'all 0.15s',
            }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ─── TAB: OVERVIEW ─────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Projects */}
            <div style={panelStyle}>
              <h3 style={panelTitle}><FolderKanban size={14} /> Projects</h3>
              {projects.length === 0 ? <EmptyState label="No projects yet" /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {projects.map(p => (
                    <div key={p.id} style={rowStyle}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f2f9', marginBottom: 4 }}>{p.name}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Badge status={p.status} />
                          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, minWidth: 60 }}>
                            <div style={{ height: '100%', width: `${p.progress}%`, background: '#6366f1', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#8b949e' }}>{p.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div style={panelStyle}>
              <h3 style={panelTitle}><CheckCircle2 size={14} /> Recent Tasks</h3>
              {tasks.length === 0 ? <EmptyState label="No tasks" /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {tasks.slice(0, 8).map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        background: t.status === 'done' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${t.status === 'done' ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {t.status === 'done' && <CheckCircle2 size={10} color="#22c55e" />}
                      </div>
                      <span style={{ fontSize: 13, color: t.status === 'done' ? '#8b949e' : '#f1f2f9',
                        textDecoration: t.status === 'done' ? 'line-through' : 'none', flex: 1 }}>
                        {t.title}
                      </span>
                      {t.due_date && <span style={{ fontSize: 11, color: '#8b949e', flexShrink: 0 }}>{formatDate(t.due_date)}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: DESIGNS ──────────────────────────────────────── */}
        {tab === 'designs' && (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {designs.length === 0 ? (
              <div style={{ gridColumn: '1/-1' }}><EmptyState label="No designs yet" /></div>
            ) : designs.map(d => {
              const isApproved = approvedIds.has(d.id) || ['client_approved', 'approved'].includes(d.status);
              return (
                <div key={d.id} style={{ ...panelStyle, position: 'relative' }}>
                  {isApproved && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12, background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20,
                      padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#22c55e',
                    }}>✓ Approved</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: '#8b949e', textTransform: 'capitalize' }}>{d.asset_type}</span>
                    <Badge status={d.status} />
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f1f2f9', marginBottom: 8 }}>{d.title}</h4>
                  {d.brief_content && (
                    <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6, marginBottom: 10,
                      display: '-webkit-box', overflow: 'hidden', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any }}>
                      {d.brief_content}
                    </p>
                  )}
                  {d.deadline && (
                    <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 12 }}>
                      <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />Due {formatDate(d.deadline)}
                    </div>
                  )}

                  {!isApproved && d.status === 'review' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                      <button onClick={() => setApprovalItem({ item: d, type: 'design' })} style={rejectBtnStyle}>
                        <ThumbsDown size={12} /> Request Changes
                      </button>
                      <button onClick={() => {
                        setApprovalItem({ item: d, type: 'design' });
                      }} style={approveBtnStyle}>
                        <ThumbsUp size={12} /> Approve
                      </button>
                    </div>
                  )}

                  <CommentThread entityType="design" entityId={d.id} token={token} />
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB: CONTENT ──────────────────────────────────────── */}
        {tab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {content.length === 0 ? <EmptyState label="No content pieces yet" /> :
              content.map(c => {
                const isApproved = approvedIds.has(c.id) || ['approved', 'published'].includes(c.status);
                return (
                  <div key={c.id} style={{ ...panelStyle }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                      }}>
                        {PLATFORM_ICON[c.platform] || '📄'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f2f9' }}>{c.title}</span>
                          <Badge status={c.status} />
                          {isApproved && <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>✓ Approved</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#8b949e', marginBottom: c.caption ? 8 : 0 }}>
                          {c.platform} · {c.content_type}
                          {c.publish_at && <> · {formatDate(c.publish_at)}</>}
                        </div>
                        {c.caption && (
                          <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.6, marginBottom: 10,
                            display: '-webkit-box', overflow: 'hidden', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any }}>
                            {c.caption}
                          </p>
                        )}
                        <MediaPreview urls={c.media_urls} />
                        {c.rejection_note && (
                          <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8,
                            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <span style={{ fontSize: 12, color: '#f59e0b' }}>💬 Your feedback: {c.rejection_note}</span>
                          </div>
                        )}
                      </div>
                      {!isApproved && c.status === 'review' && (
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                          <button onClick={() => setApprovalItem({ item: c, type: 'content' })} style={{ ...rejectBtnStyle, padding: '8px 12px' }}>
                            <ThumbsDown size={12} />
                          </button>
                          <button onClick={() => setApprovalItem({ item: c, type: 'content' })} style={{ ...approveBtnStyle, padding: '8px 12px' }}>
                            <ThumbsUp size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    <CommentThread entityType="content" entityId={c.id} token={token} />
                  </div>
                );
              })}
          </div>
        )}

        {/* ─── TAB: TIMELINE ─────────────────────────────────────── */}
        {tab === 'timeline' && (
          <div style={{ maxWidth: 680 }}>
            {activity.length === 0 ? <EmptyState label="No activity yet" /> :
              activity.map((a, i) => {
                const meta = ACTION_ICON[a.action] || { icon: <Activity size={14} />, color: '#8b949e' };
                return (
                  <div key={a.id} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: meta.color + '1a', border: `1px solid ${meta.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color,
                      }}>{meta.icon}</div>
                      {i < activity.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', marginTop: 4 }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: 13, color: '#f1f2f9' }}>
                            {a.actor_name && <strong>{a.actor_name} </strong>}
                            {a.action.replace(/_/g, ' ')}
                            {a.entity_name && <em style={{ color: '#8b5cf6' }}> "{a.entity_name}"</em>}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: '#8b949e', flexShrink: 0, marginLeft: 12 }}>
                          {timeAgo(a.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      {approvalItem && (
        <ApprovalModal
          item={approvalItem.item}
          type={approvalItem.type}
          token={token}
          onClose={() => setApprovalItem(null)}
          onDone={(id, approved) => {
            if (approved) setApprovedIds(s => new Set([...s, id]));
            setApprovalItem(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Micro components ─────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8b949e' }}>
      <Star size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
      <p style={{ fontSize: 13 }}>{label}</p>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14, padding: '18px 20px',
};

const panelTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: '#f1f2f9',
  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
};

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
};

const approveBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
  padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', color: '#fff',
};

const rejectBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
  padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b',
};
