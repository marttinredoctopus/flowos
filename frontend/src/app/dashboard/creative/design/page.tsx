'use client';
import { useState, useEffect, useRef } from 'react';
import { Palette, Layers, BookOpen, Plus, ExternalLink, X, Trash2, Check, ChevronLeft } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { FileUpload } from '@/components/ui/FileUpload';
import Avatar from '@/components/ui/Avatar';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUSES = ['brief_received', 'in_design', 'review', 'client_approval', 'done'];
const STATUS_LABELS: Record<string, string> = {
  brief_received:  'Brief Received',
  in_design:       'In Design',
  review:          'Review',
  client_approval: 'Client Approval',
  done:            'Done',
};
const STATUS_COLORS: Record<string, string> = {
  brief_received:  'var(--text-3)',
  in_design:       'var(--indigo)',
  review:          'var(--amber)',
  client_approval: 'var(--violet)',
  done:            'var(--emerald)',
};

const ASSET_TYPES = ['Logo', 'Banner', 'Social Post', 'Reel Cover', 'Story',
                     'Thumbnail', 'Video', 'Branding', 'Other'];
const ASSET_TYPE_COLORS: Record<string, string> = {
  Logo:          'var(--violet)',
  Banner:        'var(--indigo)',
  'Social Post': 'var(--cyan)',
  'Reel Cover':  'var(--rose)',
  Story:         'var(--amber)',
  Thumbnail:     'var(--emerald)',
  Video:         'var(--rose)',
  Branding:      'var(--violet)',
  Other:         'var(--text-2)',
};

function formatBytes(b: number) {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

// ── BriefCard ─────────────────────────────────────────────────────────────────

function BriefCard({
  brief, onDelete,
}: { brief: any; onDelete: (id: string) => void }) {
  const color     = ASSET_TYPE_COLORS[brief.asset_type] || 'var(--indigo)';
  const isOverdue = brief.deadline && new Date(brief.deadline) < new Date();

  return (
    <div draggable style={{
      background:   'var(--card)',
      border:       '1px solid var(--border)',
      borderLeft:   `3px solid ${color}`,
      borderRadius: 10,
      padding:      '12px 14px',
      cursor:       'grab',
      userSelect:   'none',
      position:     'relative',
    }}>
      {/* Delete btn */}
      <button
        onClick={e => { e.stopPropagation(); if (confirm('Delete brief?')) onDelete(brief.id); }}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', padding: 2, opacity: 0,
          transition: 'opacity 0.15s',
        }}
        className="brief-delete-btn"
      >
        <X size={12} />
      </button>

      {/* Asset type badge */}
      <div style={{ marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px',
          borderRadius: 99, textTransform: 'uppercase',
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color,
          border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        }}>
          {brief.asset_type || 'Other'}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)', lineHeight: 1.4 }}>
        {brief.title}
      </div>

      {/* Project / Client */}
      {(brief.project_name || brief.client_name) && (
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>
          {brief.project_name ? `📁 ${brief.project_name}` : `🏢 ${brief.client_name}`}
        </div>
      )}

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        {brief.deadline ? (
          <span style={{ fontSize: 11, color: isOverdue ? 'var(--rose)' : 'var(--text-3)' }}>
            📅 {new Date(brief.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        ) : <span />}
        {brief.designer_name && (
          <Avatar name={brief.designer_name} size={20} title={brief.designer_name} />
        )}
      </div>
    </div>
  );
}

// ── New Brief Modal ───────────────────────────────────────────────────────────

function NewBriefModal({ onClose, onCreated }: { onClose: () => void; onCreated: (b: any) => void }) {
  const [form, setForm] = useState({
    title: '', asset_type: 'Social Post', projectId: '',
    clientId: '', deadline: '', briefContent: '', assignedDesigner: '',
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients]   = useState<any[]>([]);
  const [team, setTeam]         = useState<any[]>([]);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get('/projects'),
      apiClient.get('/clients'),
      apiClient.get('/org/team'),
    ]).then(([p, c, t]) => {
      setProjects(Array.isArray(p.data) ? p.data : (p.data?.projects || []));
      setClients(Array.isArray(c.data) ? c.data : (c.data?.clients || []));
      setTeam(Array.isArray(t.data) ? t.data : []);
    }).catch(() => {});
  }, []);

  async function submit() {
    if (!form.title.trim()) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      const r = await apiClient.post('/design/briefs', {
        title:            form.title,
        assetType:        form.asset_type,
        projectId:        form.projectId || null,
        clientId:         form.clientId || null,
        deadline:         form.deadline || null,
        briefContent:     form.briefContent || null,
        assignedDesigner: form.assignedDesigner || null,
      });
      onCreated(r.data);
      toast.success('Brief created!');
      onClose();
    } catch { toast.error('Failed to create brief'); } finally { setSaving(false); }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 24, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>New Design Brief</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Brief Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Ramadan Campaign Banner"
              style={inputStyle} />
          </div>

          {/* Asset type picker */}
          <div>
            <label style={labelStyle}>Asset Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ASSET_TYPES.map(t => {
                const col = ASSET_TYPE_COLORS[t] || 'var(--text-2)';
                const sel = form.asset_type === t;
                return (
                  <button key={t} type="button" onClick={() => setForm({ ...form, asset_type: t })}
                    style={{
                      padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                      background: sel ? `color-mix(in srgb, ${col} 15%, transparent)` : 'var(--card)',
                      color: sel ? col : 'var(--text-2)',
                      outline: sel ? `1px solid color-mix(in srgb, ${col} 40%, transparent)` : '1px solid var(--border)',
                    }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project + Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Project</label>
              <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} style={selectStyle}>
                <option value="">No project</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Client</label>
              <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} style={selectStyle}>
                <option value="">No client</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
              style={inputStyle} />
          </div>

          {/* Assign designer */}
          <div>
            <label style={labelStyle}>Assign Designer</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <div onClick={() => setForm({ ...form, assignedDesigner: '' })}
                style={{
                  padding: '4px 10px', borderRadius: 99, cursor: 'pointer', fontSize: 12,
                  border: `1px solid ${!form.assignedDesigner ? 'var(--indigo)' : 'var(--border)'}`,
                  background: !form.assignedDesigner ? 'var(--indigo-2)' : 'transparent',
                  color: !form.assignedDesigner ? 'var(--indigo)' : 'var(--text-2)',
                  transition: 'all 0.15s',
                }}>Unassigned</div>
              {team.map((m: any) => (
                <div key={m.id} onClick={() => setForm({ ...form, assignedDesigner: m.id })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 99, cursor: 'pointer', fontSize: 12,
                    border: `1px solid ${form.assignedDesigner === m.id ? 'var(--indigo)' : 'var(--border)'}`,
                    background: form.assignedDesigner === m.id ? 'var(--indigo-2)' : 'transparent',
                    color: form.assignedDesigner === m.id ? 'var(--indigo)' : 'var(--text-2)',
                    transition: 'all 0.15s',
                  }}>
                  <Avatar name={m.name} size={18} />
                  {m.name.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.briefContent} onChange={e => setForm({ ...form, briefContent: e.target.value })}
              placeholder="Describe what needs to be designed..." rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button type="button" onClick={onClose}
            style={{
              flex: 1, padding: '9px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}>Cancel</button>
          <button type="button" onClick={submit} disabled={saving}
            style={{
              flex: 1, padding: '9px', borderRadius: 10, border: 'none',
              background: 'var(--grad-primary)', color: 'white',
              cursor: saving ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}>
            {saving ? 'Creating…' : 'Create Brief'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Asset Library Tab ─────────────────────────────────────────────────────────

function AssetLibraryTab() {
  const [assets, setAssets]       = useState<any[]>([]);
  const [clients, setClients]     = useState<any[]>([]);
  const [tasks, setTasks]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [selected, setSelected]   = useState<any>(null);
  const [feedback, setFeedback]   = useState<any[]>([]);
  const [pinComment, setPinComment] = useState('');
  const [pendingPin, setPendingPin] = useState<{x: number; y: number} | null>(null);
  const [uploadTaskId, setUploadTaskId] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get('/design/assets'),
      apiClient.get('/clients'),
      apiClient.get('/tasks'),
    ]).then(([a, c, t]) => {
      setAssets(Array.isArray(a.data) ? a.data : []);
      setClients(Array.isArray(c.data) ? c.data : (c.data?.clients || []));
      const taskList = Array.isArray(t.data) ? t.data : (t.data?.tasks || []);
      setTasks(taskList);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function loadFeedback(assetId: string) {
    try {
      const r = await apiClient.get(`/design/assets/${assetId}/feedback`);
      setFeedback(Array.isArray(r.data) ? r.data : []);
    } catch { setFeedback([]); }
  }

  async function addPin(x: number, y: number) {
    if (!pinComment.trim() || !selected) return;
    try {
      const r = await apiClient.post(`/design/assets/${selected.id}/feedback`, {
        xPercent: x, yPercent: y, comment: pinComment,
      });
      setFeedback(prev => [...prev, r.data]);
      setPinComment('');
      setPendingPin(null);
      toast.success('Pin added');
    } catch { toast.error('Failed to add pin'); }
  }

  async function resolvePin(pinId: string, resolved: boolean) {
    try {
      await apiClient.patch(`/design/feedback/${pinId}/resolve`, { resolved });
      setFeedback(prev => prev.map(p => p.id === pinId ? { ...p, resolved } : p));
    } catch {}
  }

  function handleImgClick(e: React.MouseEvent<HTMLImageElement>) {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPin({ x, y });
    setPinComment('');
  }

  const filtered = filter === 'all' ? assets : assets.filter((a: any) => a.client_id === filter);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12, paddingTop: 20 }}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ height: 160, borderRadius: 12, background: 'var(--card)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );

  return (
    <div style={{ paddingTop: 20 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ ...selectStyle, minWidth: 140 }}>
          <option value="all">All clients</option>
          {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <select value={uploadTaskId} onChange={e => setUploadTaskId(e.target.value)}
          style={{ ...selectStyle, minWidth: 180, fontSize: 12 }}>
          <option value="">Link to task (optional)</option>
          {tasks.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <FileUpload
          folder="designs"
          entityType="design_asset"
          accept="image/*,.pdf,.ai,.psd,.svg,.fig,.sketch"
          compact
          label="Upload Asset"
          onUpload={async (uploaded) => {
            try {
              const r = await apiClient.post('/design/assets', {
                name:      uploaded.filename,
                fileUrl:   uploaded.url,
                fileType:  uploaded.mimeType?.startsWith('image/') ? 'image' : 'file',
                r2Key:     uploaded.key,
                mimeType:  uploaded.mimeType,
                sizeBytes: uploaded.size,
                taskId:    uploadTaskId || null,
              });
              setAssets(prev => [r.data, ...prev]);
              toast.success('Asset uploaded!');
            } catch { toast.error('Failed to save asset'); }
          }}
          onError={err => toast.error(err)}
        />
      </div>

      {filtered.length === 0 ? (
        <FileUpload
          folder="designs"
          entityType="design_asset"
          accept="image/*,.pdf,.ai,.psd,.svg,.fig,.sketch"
          maxFiles={20}
          label="Upload design files"
          onUpload={async (uploaded) => {
            try {
              const r = await apiClient.post('/design/assets', {
                name:      uploaded.filename,
                fileUrl:   uploaded.url,
                fileType:  uploaded.mimeType?.startsWith('image/') ? 'image' : 'file',
                r2Key:     uploaded.key,
                mimeType:  uploaded.mimeType,
                sizeBytes: uploaded.size,
              });
              setAssets(prev => [r.data, ...prev]);
              toast.success('Asset uploaded!');
            } catch { toast.error('Failed to save asset'); }
          }}
          onError={err => toast.error(err)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12 }}>
          {filtered.map((asset: any) => {
            const isImg = asset.mime_type?.startsWith('image/') || asset.file_type === 'image'
              || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(asset.file_url || '');
            return (
              <div key={asset.id}
                onClick={() => { setSelected(asset); loadFeedback(asset.id); }}
                style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--indigo)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}>
                {/* Thumbnail */}
                <div style={{ height: 120, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {isImg ? (
                    <img src={asset.file_url} alt={asset.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: 36 }}>
                      {asset.mime_type?.includes('pdf') ? '📄'
                       : asset.name?.endsWith('.svg') ? '🎨'
                       : asset.name?.endsWith('.fig') ? '🎯'
                       : asset.name?.endsWith('.psd') ? '🖼️'
                       : '📁'}
                    </div>
                  )}
                  {asset.version > 1 && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      background: 'var(--indigo)', color: 'white',
                      fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
                    }}>v{asset.version}</div>
                  )}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)', marginBottom: 2 }}>
                    {asset.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{formatBytes(asset.size_bytes)}</span>
                    {asset.uploaded_by_name && (
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{asset.uploaded_by_name.split(' ')[0]}</span>
                    )}
                  </div>
                  {asset.task_id && (
                    <div style={{ marginTop: 4, fontSize: 10, color: 'var(--indigo)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span>🔗</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tasks.find((t: any) => t.id === asset.task_id)?.title || 'Task'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Asset Detail Panel */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
        }} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{
            marginLeft: 'auto', width: '100%', maxWidth: 900,
            background: 'var(--surface)', display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                <ChevronLeft size={18} />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatBytes(selected.size_bytes)}</div>
              </div>
              <a href={selected.file_url} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--indigo)', textDecoration: 'none' }}>
                <ExternalLink size={13} /> Open
              </a>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Image preview */}
              <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--bg)' }}>
                {(selected.mime_type?.startsWith('image/') || selected.file_type === 'image') ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img ref={imgRef} src={selected.file_url} alt={selected.name}
                      onClick={handleImgClick}
                      style={{ maxWidth: '100%', borderRadius: 8, cursor: 'crosshair', display: 'block' }} />
                    {/* Existing pins */}
                    {feedback.map((pin: any) => (
                      <div key={pin.id} style={{
                        position: 'absolute',
                        left: `${pin.x_percent}%`, top: `${pin.y_percent}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 20, height: 20, borderRadius: '50%',
                        background: pin.resolved ? 'var(--emerald)' : 'var(--rose)',
                        border: '2px solid white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: 'white',
                        cursor: 'pointer', zIndex: 2,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                      }} title={pin.comment}>
                        {pin.pin_number}
                      </div>
                    ))}
                    {/* Pending pin */}
                    {pendingPin && (
                      <div style={{
                        position: 'absolute',
                        left: `${pendingPin.x}%`, top: `${pendingPin.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--indigo)', border: '2px solid white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)', zIndex: 3,
                      }} />
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
                    <a href={selected.file_url} target="_blank" rel="noreferrer"
                      style={{ color: 'var(--indigo)', fontSize: 14 }}>
                      Download / Open file
                    </a>
                  </div>
                )}
              </div>

              {/* Feedback panel */}
              <div style={{ width: 280, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    Feedback Pins
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    Click on image to add a pin
                  </div>
                </div>

                {/* Add pin form */}
                {pendingPin && (
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--indigo-2)' }}>
                    <textarea value={pinComment} onChange={e => setPinComment(e.target.value)}
                      placeholder="Write feedback..." rows={2}
                      style={{ ...inputStyle, resize: 'none', fontSize: 12, marginBottom: 8 }}
                      autoFocus />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setPendingPin(null)}
                        style={{ flex: 1, padding: '5px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 11 }}>
                        Cancel
                      </button>
                      <button onClick={() => addPin(pendingPin.x, pendingPin.y)}
                        style={{ flex: 1, padding: '5px', borderRadius: 6, border: 'none', background: 'var(--indigo)', color: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                        Add Pin
                      </button>
                    </div>
                  </div>
                )}

                {/* Pin list */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
                  {feedback.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-3)', fontSize: 12 }}>
                      No feedback yet
                    </div>
                  ) : feedback.map((pin: any) => (
                    <div key={pin.id} style={{
                      padding: '8px 10px', borderRadius: 8, marginBottom: 6,
                      background: 'var(--card)', border: '1px solid var(--border)',
                      opacity: pin.resolved ? 0.6 : 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          background: pin.resolved ? 'var(--emerald)' : 'var(--rose)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: 'white',
                        }}>{pin.pin_number}</div>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', flex: 1 }}>{pin.user_name || 'You'}</span>
                        <button onClick={() => resolvePin(pin.id, !pin.resolved)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: pin.resolved ? 'var(--emerald)' : 'var(--text-3)', padding: 0 }}>
                          <Check size={12} />
                        </button>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.4 }}>{pin.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Brand Guidelines Tab ──────────────────────────────────────────────────────

function BrandGuidelinesTab() {
  const [clients, setClients]     = useState<any[]>([]);
  const [selected, setSelected]   = useState<any>(null);
  const [guide, setGuide]         = useState<any>(null);
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    apiClient.get('/clients').then(r => {
      const c = Array.isArray(r.data) ? r.data : (r.data?.clients || []);
      setClients(c);
      if (c.length > 0) loadGuide(c[0]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function loadGuide(client: any) {
    setSelected(client);
    setEditing(false);
    try {
      const r = await apiClient.get(`/design/brand/${client.id}`);
      setGuide(r.data || null);
    } catch {
      setGuide(null);
    }
  }

  function emptyGuide(clientId: string) {
    return { client_id: clientId, primary_color: '', secondary_color: '', accent_color: '', extra_colors: [], primary_font: '', secondary_font: '', tone_of_voice: '', brand_values: '' };
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    try {
      await apiClient.put(`/design/brand/${selected.id}`, {
        primaryColor:   guide?.primary_color || '',
        secondaryColor: guide?.secondary_color || '',
        accentColor:    guide?.accent_color || '',
        extraColors:    guide?.extra_colors || [],
        primaryFont:    guide?.primary_font || '',
        secondaryFont:  guide?.secondary_font || '',
        toneOfVoice:    guide?.tone_of_voice || '',
        brandValues:    guide?.brand_values || '',
      });
      toast.success('Brand guidelines saved!');
      setEditing(false);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  }

  function addExtraColor() {
    const color = prompt('Enter hex color (e.g. #FF5733)');
    if (!color) return;
    setGuide((g: any) => ({ ...g, extra_colors: [...(g?.extra_colors || []), color] }));
  }

  function removeExtraColor(i: number) {
    setGuide((g: any) => ({ ...g, extra_colors: g.extra_colors.filter((_: any, idx: number) => idx !== i) }));
  }

  const allColors = guide ? [
    guide.primary_color   && { hex: guide.primary_color,   label: 'Primary' },
    guide.secondary_color && { hex: guide.secondary_color, label: 'Secondary' },
    guide.accent_color    && { hex: guide.accent_color,    label: 'Accent' },
    ...(guide.extra_colors || []).map((c: string, i: number) => ({ hex: c, label: `Extra ${i + 1}` })),
  ].filter(Boolean) : [];

  if (loading) return (
    <div style={{ paddingTop: 20 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 40, borderRadius: 8, background: 'var(--card)', marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 0, paddingTop: 20, minHeight: 400 }}>
      {/* Client sidebar */}
      <div style={{ width: 200, paddingRight: 16, borderRight: '1px solid var(--border)', marginRight: 24, flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>Clients</div>
        {clients.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>No clients yet</p>
        ) : clients.map((c: any) => (
          <button key={c.id} onClick={() => loadGuide(c)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: selected?.id === c.id ? 'var(--indigo-2)' : 'transparent',
              color: selected?.id === c.id ? 'var(--indigo)' : 'var(--text-2)',
              fontSize: 13, textAlign: 'left', fontWeight: selected?.id === c.id ? 600 : 400,
              transition: 'all 0.15s', marginBottom: 2,
            }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, background: 'var(--indigo-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'var(--indigo)', flexShrink: 0,
            }}>{c.name[0].toUpperCase()}</div>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Guidelines content */}
      {selected ? (
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              {selected.name} — Brand Kit
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {editing && (
                <button onClick={() => { setEditing(false); loadGuide(selected); }}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 12 }}>
                  Cancel
                </button>
              )}
              <button onClick={() => editing ? save() : setEditing(true)}
                disabled={saving}
                style={{
                  padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                  background: editing ? 'var(--grad-primary)' : 'var(--card)',
                  color: editing ? 'white' : 'var(--text-2)',
                  border: editing ? 'none' : '1px solid var(--border)',
                  fontSize: 12, fontWeight: 600, opacity: saving ? 0.7 : 1,
                } as React.CSSProperties}>
                {saving ? 'Saving…' : editing ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>
          </div>

          {/* Colors */}
          <section style={{ marginBottom: 28 }}>
            <SectionTitle>Brand Colors</SectionTitle>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { field: 'primary_color', label: 'Primary Color' },
                  { field: 'secondary_color', label: 'Secondary Color' },
                  { field: 'accent_color', label: 'Accent Color' },
                ].map(({ field, label }) => (
                  <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={(guide as any)?.[field] || '#6366f1'}
                      onChange={e => setGuide((g: any) => ({ ...(g || emptyGuide(selected.id)), [field]: e.target.value }))}
                      style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2, background: 'none' }} />
                    <input value={(guide as any)?.[field] || ''}
                      onChange={e => setGuide((g: any) => ({ ...(g || emptyGuide(selected.id)), [field]: e.target.value }))}
                      placeholder={label}
                      style={{ ...inputStyle, maxWidth: 140, fontFamily: 'monospace' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{label}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {(guide?.extra_colors || []).map((c: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: c, border: '1px solid var(--border)' }} />
                      <button onClick={() => removeExtraColor(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2 }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button onClick={addExtraColor}
                    style={{ width: 32, height: 32, borderRadius: 6, border: '2px dashed var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {allColors.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No colors defined yet. Click Edit to add.</p>
                ) : allColors.map((item: any, i: number) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div onClick={() => { navigator.clipboard.writeText(item.hex); toast.success(`Copied ${item.hex}`); }}
                      style={{ width: 52, height: 52, borderRadius: 10, background: item.hex, border: '1px solid var(--border)', marginBottom: 4, cursor: 'pointer' }} />
                    <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>{item.hex}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Fonts */}
          <section style={{ marginBottom: 28 }}>
            <SectionTitle>Typography</SectionTitle>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { field: 'primary_font', label: 'Primary Font' },
                  { field: 'secondary_font', label: 'Secondary Font' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label style={labelStyle}>{label}</label>
                    <input value={(guide as any)?.[field] || ''}
                      onChange={e => setGuide((g: any) => ({ ...(g || emptyGuide(selected.id)), [field]: e.target.value }))}
                      placeholder="e.g. Inter, Poppins..."
                      style={inputStyle} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(!guide?.primary_font && !guide?.secondary_font) ? (
                  <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No fonts defined yet. Click Edit to add.</p>
                ) : [
                  { name: guide?.primary_font, label: 'Primary' },
                  { name: guide?.secondary_font, label: 'Secondary' },
                ].filter(f => f.name).map((f, i) => (
                  <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 20, fontFamily: f.name, flex: 1, color: 'var(--text)' }}>Aa — {f.name}</div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{f.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Tone of voice */}
          <section style={{ marginBottom: 28 }}>
            <SectionTitle>Tone of Voice</SectionTitle>
            {editing ? (
              <textarea value={guide?.tone_of_voice || ''}
                onChange={e => setGuide((g: any) => ({ ...(g || emptyGuide(selected.id)), tone_of_voice: e.target.value }))}
                placeholder="Describe the brand voice and tone..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            ) : (
              <p style={{ fontSize: 13, color: guide?.tone_of_voice ? 'var(--text-2)' : 'var(--text-3)', lineHeight: 1.6, background: 'var(--card)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8 }}>
                {guide?.tone_of_voice || 'No tone of voice defined yet.'}
              </p>
            )}
          </section>

          {/* Brand values */}
          <section>
            <SectionTitle>Brand Values</SectionTitle>
            {editing ? (
              <textarea value={guide?.brand_values || ''}
                onChange={e => setGuide((g: any) => ({ ...(g || emptyGuide(selected.id)), brand_values: e.target.value }))}
                placeholder="Core values, mission, what the brand stands for..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            ) : (
              <p style={{ fontSize: 13, color: guide?.brand_values ? 'var(--text-2)' : 'var(--text-3)', lineHeight: 1.6, background: 'var(--card)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8 }}>
                {guide?.brand_values || 'No brand values defined yet.'}
              </p>
            )}
          </section>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 14 }}>
          {clients.length === 0 ? 'Add clients first to manage brand guidelines' : 'Select a client to view brand guidelines'}
        </div>
      )}
    </div>
  );
}

// ── Shared style helpers ──────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
  textTransform: 'uppercase', letterSpacing: '0.6px',
  display: 'block', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--input-bg)',
  border: '1px solid var(--border-hover)', color: 'var(--text)',
  padding: '8px 10px', borderRadius: 'var(--radius)',
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--border-hover)',
  color: 'var(--text)', padding: '7px 10px', borderRadius: 'var(--radius)',
  fontSize: 12, fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DesignHubPage() {
  const [tab, setTab]         = useState<'briefs' | 'assets' | 'brand'>('briefs');
  const [briefs, setBriefs]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => { loadBriefs(); }, []);

  async function loadBriefs() {
    try {
      const r = await apiClient.get('/design/briefs');
      setBriefs(Array.isArray(r.data) ? r.data : []);
    } catch {} finally { setLoading(false); }
  }

  async function moveBrief(id: string, newStatus: string) {
    const prev = briefs.find(b => b.id === id);
    if (!prev || prev.status === newStatus) return;
    setBriefs(bs => bs.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try {
      await apiClient.patch(`/design/briefs/${id}`, { status: newStatus });
    } catch {
      setBriefs(bs => bs.map(b => b.id === id ? { ...b, status: prev.status } : b));
    }
  }

  async function deleteBrief(id: string) {
    setBriefs(bs => bs.filter(b => b.id !== id));
    try { await apiClient.delete(`/design/briefs/${id}`); }
    catch { loadBriefs(); toast.error('Delete failed'); }
  }

  const TABS = [
    { key: 'briefs', label: 'Briefs',          icon: <Layers size={14} /> },
    { key: 'assets', label: 'Asset Library',   icon: <Palette size={14} /> },
    { key: 'brand',  label: 'Brand Guidelines',icon: <BookOpen size={14} /> },
  ] as const;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--violet-2)' }}>
            <Palette size={18} style={{ color: 'var(--violet)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Design Hub</h1>
            <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Briefs · Assets · Brand Kits</p>
          </div>
        </div>
        {tab === 'briefs' && (
          <button onClick={() => setShowNew(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--grad-primary)', color: 'white',
              padding: '8px 16px', borderRadius: 10,
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
            <Plus size={14} /> New Brief
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none',
              background: tab === t.key ? 'var(--card)' : 'transparent',
              color: tab === t.key ? 'var(--text)' : 'var(--text-3)',
              fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
              borderBottom: tab === t.key ? '2px solid var(--indigo)' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Briefs Kanban */}
      {tab === 'briefs' && (
        loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {[1,2,3,4,5].map(i => <div key={i} style={{ height: 200, borderRadius: 12, background: 'var(--card)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(180px, 1fr))', gap: 12, overflowX: 'auto' }}>
            {STATUSES.map(status => {
              const col = STATUS_COLORS[status];
              const cards = briefs.filter(b => b.status === status);
              return (
                <div key={status}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => { if (draggingId) { moveBrief(draggingId, status); setDraggingId(null); } }}>
                  {/* Column header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '0 2px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.5px', flex: 1 }}>
                      {STATUS_LABELS[status]}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--card)', padding: '1px 6px', borderRadius: 99, border: '1px solid var(--border)' }}>
                      {cards.length}
                    </span>
                  </div>

                  {/* Drop zone */}
                  <div style={{
                    minHeight: 80, borderRadius: 10, padding: 4,
                    border: '1px dashed var(--border)', background: 'var(--surface)',
                    display: 'flex', flexDirection: 'column', gap: 6,
                  }}>
                    {cards.map(brief => (
                      <div key={brief.id}
                        draggable
                        onDragStart={() => setDraggingId(brief.id)}
                        onDragEnd={() => setDraggingId(null)}
                        style={{ position: 'relative' }}
                        className="brief-card-wrap">
                        <BriefCard brief={brief} onDelete={deleteBrief} />
                      </div>
                    ))}
                    {cards.length === 0 && (
                      <div style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-3)', fontSize: 11 }}>
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Asset Library */}
      {tab === 'assets' && <AssetLibraryTab />}

      {/* Brand Guidelines */}
      {tab === 'brand' && <BrandGuidelinesTab />}

      {/* New Brief Modal */}
      {showNew && (
        <NewBriefModal
          onClose={() => setShowNew(false)}
          onCreated={brief => setBriefs(prev => [brief, ...prev])}
        />
      )}

      <style>{`
        .brief-card-wrap:hover .brief-delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
