'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Building2, Mail, Phone, Globe, Users, FolderKanban,
  CheckSquare, Palette, CalendarDays, FileText, KeyRound, Plus,
  ExternalLink, Copy, Check, RefreshCw, Lock, Unlock,
  TrendingUp, Clock, AlertCircle,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Client {
  id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  website?: string;
  avatar_url?: string;
  brief?: string;
  accounts?: Account[];
  share_token?: string;
  portal_enabled?: boolean;
  share_token_expires_at?: string;
  project_count?: number;
  task_count?: number;
}

interface Account {
  platform: string;
  username: string;
  password: string;
}

interface Project {
  id: string; name: string; status: string; color: string;
  progress: number; start_date?: string; end_date?: string; service_type?: string;
}

interface Task {
  id: string; title: string; status: string; priority: string;
  due_date?: string; project_name?: string; project_id?: string;
  assignee_name?: string; assignee_avatar?: string;
}

interface Design {
  id: string; title: string; asset_type: string; status: string;
  deadline?: string; brief_content?: string;
}

interface ContentPiece {
  id: string; title: string; platform: string; content_type: string;
  status: string; publish_at?: string; caption?: string;
}

interface ClientFile {
  id: string; filename: string; public_url: string; mime_type?: string;
  size_bytes: number; folder?: string; created_at: string;
}

interface ClientDetail extends Client {
  projects: Project[];
  tasks: Task[];
  designs: Design[];
  content: ContentPiece[];
  files: ClientFile[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',     label: 'Overview',     icon: Building2 },
  { id: 'projects',     label: 'Projects',     icon: FolderKanban },
  { id: 'tasks',        label: 'Tasks',        icon: CheckSquare },
  { id: 'designs',      label: 'Designs',      icon: Palette },
  { id: 'content',      label: 'Content',      icon: CalendarDays },
  { id: 'files',        label: 'Files',        icon: FileText },
  { id: 'credentials',  label: 'Credentials',  icon: KeyRound },
] as const;
type TabId = typeof TABS[number]['id'];

const STATUS_COLOR: Record<string, string> = {
  active: '#22c55e', completed: '#6366f1', paused: '#f59e0b', cancelled: '#ef4444',
  todo: '#8b949e', in_progress: '#6366f1', done: '#22c55e', blocked: '#ef4444',
  brief_received: '#8b949e', in_design: '#f59e0b', review: '#6366f1',
  client_approved: '#22c55e', revision_required: '#ef4444',
  draft: '#8b949e', scheduled: '#6366f1', published: '#22c55e',
  low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626',
};

function badge(label: string, color?: string) {
  const c = color || STATUS_COLOR[label] || '#8b949e';
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
      background: c + '22', color: c, textTransform: 'capitalize',
    }}>{label.replace(/_/g, ' ')}</span>
  );
}

function formatBytes(b: number) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

function avatar(name: string, url?: string, size = 36) {
  if (url) return <img src={url} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function OverviewTab({ client }: { client: ClientDetail }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Contact info */}
      <div style={card}>
        <h3 style={cardTitle}>Contact Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {client.email && <Row icon={<Mail size={14} />} label="Email" value={client.email} />}
          {client.phone && <Row icon={<Phone size={14} />} label="Phone" value={client.phone} />}
          {client.company && <Row icon={<Building2 size={14} />} label="Company" value={client.company} />}
          {client.website && (
            <Row icon={<Globe size={14} />} label="Website" value={
              <a href={client.website} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontSize: 13 }}>
                {client.website} <ExternalLink size={11} />
              </a>
            } />
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={card}>
        <h3 style={cardTitle}>At a Glance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Projects', value: client.projects.length, icon: <FolderKanban size={16} /> },
            { label: 'Tasks', value: client.tasks.length, icon: <CheckSquare size={16} /> },
            { label: 'Designs', value: client.designs.length, icon: <Palette size={16} /> },
            { label: 'Content', value: client.content.length, icon: <CalendarDays size={16} /> },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ color: '#6366f1', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f2f9' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#8b949e' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brief */}
      {client.brief && (
        <div style={{ ...card, gridColumn: '1 / -1' }}>
          <h3 style={cardTitle}>Client Brief</h3>
          <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{client.brief}</p>
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ color: '#6366f1', marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#8b949e', width: 70, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#f1f2f9' }}>{value}</span>
    </div>
  );
}

function ProjectsTab({ projects, clientId }: { projects: Project[]; clientId: string }) {
  const router = useRouter();
  if (!projects.length) return <Empty icon={<FolderKanban size={32} />} label="No projects yet" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {projects.map(p => (
        <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          onClick={() => router.push(`/dashboard/projects/${p.id}`)}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: p.color || '#6366f1', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f2f9', marginBottom: 4 }}>{p.name}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {badge(p.status)}
              {p.service_type && <span style={{ fontSize: 11, color: '#8b949e' }}>{p.service_type}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>{p.progress}%</div>
            <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
              <div style={{ width: `${p.progress}%`, height: '100%', background: '#6366f1', borderRadius: 2 }} />
            </div>
          </div>
          <ExternalLink size={14} color="#8b949e" />
        </div>
      ))}
    </div>
  );
}

function TasksTab({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  if (!tasks.length) return <Empty icon={<CheckSquare size={32} />} label="No tasks yet" />;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'todo', 'in_progress', 'done', 'blocked'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: filter === s ? '#6366f1' : 'rgba(255,255,255,0.05)',
            border: filter === s ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
            color: filter === s ? '#fff' : '#8b949e',
          }}>{s === 'all' ? `All (${tasks.length})` : s.replace(/_/g, ' ')}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#f1f2f9', marginBottom: 4 }}>{t.title}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {badge(t.status)}
                {badge(t.priority, STATUS_COLOR[t.priority])}
                {t.project_name && (
                  <span style={{ fontSize: 11, color: '#8b949e' }}>
                    <FolderKanban size={10} style={{ marginRight: 3, display: 'inline' }} />
                    {t.project_name}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.assignee_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {avatar(t.assignee_name, t.assignee_avatar, 24)}
                  <span style={{ fontSize: 12, color: '#8b949e' }}>{t.assignee_name}</span>
                </div>
              )}
              {t.due_date && (
                <span style={{ fontSize: 11, color: '#8b949e' }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                  {new Date(t.due_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignsTab({ designs }: { designs: Design[] }) {
  if (!designs.length) return <Empty icon={<Palette size={32} />} label="No design briefs yet" />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {designs.map(d => (
        <div key={d.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#8b949e', textTransform: 'capitalize' }}>{d.asset_type}</span>
            {badge(d.status)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f2f9', marginBottom: 8 }}>{d.title}</div>
          {d.deadline && (
            <div style={{ fontSize: 12, color: '#8b949e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> Due {new Date(d.deadline).toLocaleDateString()}
            </div>
          )}
          {d.brief_content && (
            <p style={{ fontSize: 12, color: '#8b949e', marginTop: 8, lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any }}>
              {d.brief_content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ContentTab({ content }: { content: ContentPiece[] }) {
  if (!content.length) return <Empty icon={<CalendarDays size={32} />} label="No content pieces yet" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {content.map(c => (
        <div key={c.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: '#f1f2f9', marginBottom: 4 }}>{c.title}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {badge(c.status)}
              <span style={{ fontSize: 11, color: '#8b949e' }}>{c.platform} · {c.content_type}</span>
            </div>
          </div>
          {c.publish_at && (
            <span style={{ fontSize: 12, color: '#8b949e' }}>
              <CalendarDays size={11} style={{ display: 'inline', marginRight: 4 }} />
              {new Date(c.publish_at).toLocaleDateString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function FilesTab({ files, clientId }: { files: ClientFile[]; clientId: string }) {
  if (!files.length) return <Empty icon={<FileText size={32} />} label="No files uploaded yet" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.map(f => (
        <div key={f.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FileText size={16} color="#6366f1" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: '#f1f2f9', marginBottom: 2 }}>{f.filename}</div>
            <div style={{ fontSize: 12, color: '#8b949e' }}>
              {formatBytes(f.size_bytes)} · {new Date(f.created_at).toLocaleDateString()}
            </div>
          </div>
          <a href={f.public_url} target="_blank" rel="noreferrer"
            style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
            <ExternalLink size={14} /> View
          </a>
        </div>
      ))}
    </div>
  );
}

function CredentialsTab({ accounts, clientId, onUpdate }: {
  accounts: Account[]; clientId: string; onUpdate: (a: Account[]) => void;
}) {
  const [list, setList] = useState<Account[]>(accounts || []);
  const [reveal, setReveal] = useState<Record<number, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ platform: '', username: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const save = async () => {
    if (!form.platform || !form.username) return;
    setSaving(true);
    try {
      const updated = [...list, form];
      await api.patch(`/clients/${clientId}`, { accounts: updated });
      setList(updated);
      onUpdate(updated);
      setForm({ platform: '', username: '', password: '' });
      setAdding(false);
    } finally { setSaving(false); }
  };

  const remove = async (idx: number) => {
    const updated = list.filter((_, i) => i !== idx);
    await api.patch(`/clients/${clientId}`, { accounts: updated });
    setList(updated);
    onUpdate(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={14} color="#f59e0b" />
          <span style={{ fontSize: 12, color: '#f59e0b' }}>Credentials are stored securely and only visible to staff</span>
        </div>
        <button onClick={() => setAdding(!adding)} style={btnPrimary}>
          <Plus size={14} /> Add Account
        </button>
      </div>

      {adding && (
        <div style={{ ...card, marginBottom: 16 }}>
          <h4 style={{ fontSize: 14, color: '#f1f2f9', marginBottom: 12 }}>New Account</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10 }}>
            <input placeholder="Platform (e.g. Instagram)" value={form.platform}
              onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} style={inputSt} />
            <input placeholder="Username / Email" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))} style={inputSt} />
            <input type="password" placeholder="Password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputSt} />
            <button onClick={save} disabled={saving} style={{ ...btnPrimary, padding: '10px 16px' }}>
              {saving ? '...' : <Check size={14} />}
            </button>
          </div>
        </div>
      )}

      {!list.length && !adding && <Empty icon={<KeyRound size={32} />} label="No credentials saved yet" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((a, i) => (
          <div key={i} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <KeyRound size={16} color="#6366f1" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f2f9', marginBottom: 2 }}>{a.platform}</div>
              <div style={{ fontSize: 13, color: '#8b949e', display: 'flex', gap: 12 }}>
                <span>{a.username}</span>
                <span>{reveal[i] ? a.password : '••••••••'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <IconBtn title="Copy username" onClick={() => copyText(a.username, `u${i}`)}>
                {copied === `u${i}` ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
              </IconBtn>
              <IconBtn title="Copy password" onClick={() => copyText(a.password, `p${i}`)}>
                {copied === `p${i}` ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
              </IconBtn>
              <IconBtn title="Toggle reveal" onClick={() => setReveal(r => ({ ...r, [i]: !r[i] }))}>
                {reveal[i] ? <Unlock size={13} /> : <Lock size={13} />}
              </IconBtn>
              <IconBtn title="Remove" onClick={() => remove(i)}>
                <span style={{ fontSize: 13 }}>×</span>
              </IconBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)', color: '#8b949e',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    }}>{children}</button>
  );
}

function Empty({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: '#8b949e' }}>
      <div style={{ marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <p style={{ fontSize: 14 }}>{label}</p>
    </div>
  );
}

// ─── Share Panel ──────────────────────────────────────────────────────────────

function SharePanel({ client, onUpdate }: { client: ClientDetail; onUpdate: (c: Partial<ClientDetail>) => void }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [days, setDays] = useState(30);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const portalUrl = client.share_token ? `${baseUrl}/portal/${client.share_token}` : null;

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/clients/${client.id}/share-token`, {
        expiresInDays: days,
        portalEnabled: true,
      });
      onUpdate({ share_token: data.share_token, portal_enabled: data.portal_enabled, share_token_expires_at: data.share_token_expires_at });
    } finally { setLoading(false); }
  };

  const copyLink = () => {
    if (portalUrl) {
      navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={card}>
      <h3 style={cardTitle}>Client Portal</h3>
      <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 16 }}>
        Share a secure link with your client to view their projects, content, and designs.
      </p>

      {portalUrl ? (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input readOnly value={portalUrl} style={{ ...inputSt, flex: 1, fontSize: 12 }} />
            <button onClick={copyLink} style={{ ...btnPrimary, padding: '10px 16px' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          {client.share_token_expires_at && (
            <p style={{ fontSize: 12, color: '#8b949e' }}>
              Expires: {new Date(client.share_token_expires_at).toLocaleDateString()}
            </p>
          )}
          <button onClick={generate} disabled={loading} style={{ ...btnGhost, marginTop: 10, fontSize: 13 }}>
            <RefreshCw size={12} /> Regenerate link
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#8b949e' }}>Expires in</span>
            <select value={days} onChange={e => setDays(Number(e.target.value))}
              style={{ ...inputSt, width: 120 }}>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={0}>Never</option>
            </select>
          </div>
          <button onClick={generate} disabled={loading} style={btnPrimary}>
            {loading ? 'Generating...' : <><ExternalLink size={14} /> Generate Portal Link</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12, padding: '16px 18px',
};

const cardTitle: React.CSSProperties = {
  fontSize: 14, fontWeight: 600, color: '#f1f2f9', marginBottom: 14,
};

const inputSt: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', color: '#f1f2f9', fontSize: 13, outline: 'none',
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px',
  borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
};

const btnGhost: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
  color: '#8b949e', fontSize: 13, cursor: 'pointer',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [tab, setTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/clients/${id}`);
      setClient(data);
    } catch {
      setError('Failed to load client');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#8b949e' }}>
      Loading client profile...
    </div>
  );

  if (error || !client) return (
    <div style={{ textAlign: 'center', padding: 48, color: '#ef4444' }}>{error || 'Client not found'}</div>
  );

  const tabCounts: Record<TabId, number | null> = {
    overview: null,
    projects: client.projects.length,
    tasks: client.tasks.length,
    designs: client.designs.length,
    content: client.content.length,
    files: client.files.length,
    credentials: client.accounts?.length || 0,
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <button onClick={() => router.push('/dashboard/clients')} style={btnGhost}>
          <ArrowLeft size={14} />
        </button>
        {avatar(client.name, client.avatar_url, 52)}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f2f9', margin: 0 }}>{client.name}</h1>
          {client.company && (
            <p style={{ fontSize: 14, color: '#8b949e', margin: '4px 0 0' }}>
              <Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />{client.company}
            </p>
          )}
        </div>
        <button onClick={() => router.push(`/dashboard/clients?edit=${client.id}`)} style={btnGhost}>
          Edit Client
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Main content */}
        <div>
          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 0,
            overflowX: 'auto',
          }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const count = tabCounts[t.id];
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
                  borderRadius: 0, background: 'transparent', cursor: 'pointer',
                  borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
                  color: active ? '#6366f1' : '#8b949e',
                  fontSize: 13, fontWeight: active ? 600 : 400, border: 'none',
                  borderBottomWidth: 2,
                  borderBottomStyle: 'solid',
                  borderBottomColor: active ? '#6366f1' : 'transparent',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  <Icon size={14} />
                  {t.label}
                  {count !== null && count > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, background: active ? '#6366f1' : 'rgba(255,255,255,0.08)',
                      color: active ? '#fff' : '#8b949e', borderRadius: 10, padding: '1px 6px',
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {tab === 'overview' && <OverviewTab client={client} />}
          {tab === 'projects' && <ProjectsTab projects={client.projects} clientId={client.id} />}
          {tab === 'tasks' && <TasksTab tasks={client.tasks} />}
          {tab === 'designs' && <DesignsTab designs={client.designs} />}
          {tab === 'content' && <ContentTab content={client.content} />}
          {tab === 'files' && <FilesTab files={client.files} clientId={client.id} />}
          {tab === 'credentials' && (
            <CredentialsTab
              accounts={client.accounts || []}
              clientId={client.id}
              onUpdate={accounts => setClient(c => c ? { ...c, accounts } : c)}
            />
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SharePanel
            client={client}
            onUpdate={updates => setClient(c => c ? { ...c, ...updates } : c)}
          />

          {/* Quick stats */}
          <div style={card}>
            <h3 style={cardTitle}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Active Projects', value: client.projects.filter(p => p.status === 'active').length, color: '#22c55e' },
                { label: 'Open Tasks', value: client.tasks.filter(t => t.status !== 'done').length, color: '#f59e0b' },
                { label: 'Pending Designs', value: client.designs.filter(d => ['brief_received','in_design','review'].includes(d.status)).length, color: '#6366f1' },
                { label: 'Drafts', value: client.content.filter(c => c.status === 'draft').length, color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#8b949e' }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
