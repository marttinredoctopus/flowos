'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import { Buildings, Plus, Trash, ArrowRight, Users, Folder, CheckSquare, GridFour } from '@phosphor-icons/react';
import { LoadingScreen, Modal, FormField, inputStyle } from '@/components/ui/shared';

const COLORS = ['#7030EF','#DB1FFF','#00D4FF','#00E5A0','#FFB547','#FF4D6A','#6366f1','#f59e0b'];

type SpaceForm = { name: string; description: string; color: string; client_id: string };
const EMPTY: SpaceForm = { name: '', description: '', color: '#7030EF', client_id: '' };

export default function SpacesPage() {
  const [spaces, setSpaces]       = useState<any[]>([]);
  const [clients, setClients]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]           = useState<SpaceForm>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      apiGet('/api/spaces').catch(() => null),
      apiGet('/api/clients').catch(() => null),
    ]).then(([s, c]) => {
      setSpaces(s?.spaces ?? []);
      const cl = c?.data?.clients ?? c?.clients ?? c?.data ?? c ?? [];
      setClients(Array.isArray(cl) ? cl : []);
    }).finally(() => setLoading(false));
  }, []);

  async function create() {
    if (!form.name.trim()) return toast.error('Space name required');
    setSaving(true);
    try {
      const res = await apiPost('/api/spaces', form);
      setSpaces(prev => [res.space, ...prev]);
      setShowCreate(false);
      setForm(EMPTY);
      toast.success('Space created');
      router.push(`/dashboard/spaces/${res.space.id}`);
    } catch { toast.error('Failed to create space'); }
    finally { setSaving(false); }
  }

  async function remove(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this space and all its data?')) return;
    try {
      await apiDelete(`/api/spaces/${id}`);
      setSpaces(prev => prev.filter(s => s.id !== id));
      toast.success('Space deleted');
    } catch { toast.error('Failed to delete'); }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(112,48,239,0.35)' }}>
              <GridFour size={20} color="#fff" weight="fill" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Spaces</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 52 }}>
            {spaces.length} space{spaces.length !== 1 ? 's' : ''} — each space is a complete client workspace
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(112,48,239,0.4)' }}>
          <Plus size={16} weight="bold" /> New Space
        </button>
      </div>

      {spaces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg,#7030EF22,#DB1FFF22)', border: '1px solid #7030EF33', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Buildings size={40} color="#7030EF" weight="duotone" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No spaces yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Create your first space to organize a client's entire workflow in one place</p>
          <button onClick={() => setShowCreate(true)} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Create First Space
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {spaces.map((sp: any) => (
            <div key={sp.id}
              onClick={() => router.push(`/dashboard/spaces/${sp.id}`)}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.15)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              {/* Color bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${sp.color || '#7030EF'}, ${sp.color || '#7030EF'}88)` }} />

              <div style={{ padding: '20px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {sp.logo_url ? (
                      <img src={sp.logo_url} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} alt="" />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${sp.color || '#7030EF'}22`, border: `2px solid ${sp.color || '#7030EF'}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: sp.color || '#7030EF' }}>
                        {sp.name[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{sp.name}</div>
                      {sp.client_name && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sp.client_name}</div>}
                    </div>
                  </div>
                  <button onClick={e => remove(sp.id, e)} style={{ padding: '5px 7px', borderRadius: 8, border: '1px solid rgba(255,77,106,0.2)', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                    <Trash size={13} />
                  </button>
                </div>

                {sp.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                    {sp.description}
                  </p>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  {[
                    { Icon: Folder, val: sp.project_count || 0, label: 'projects', color: '#6366f1' },
                    { Icon: CheckSquare, val: sp.task_count || 0, label: 'tasks', color: '#00E5A0' },
                    { Icon: Users, val: sp.member_count || 0, label: 'members', color: '#FFB547' },
                  ].map(({ Icon, val, label, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon size={13} color={color} weight="fill" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{val}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['Projects','Tasks','Assets','Videos'].map(tab => (
                      <span key={tab} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 99, background: `${sp.color || '#7030EF'}15`, color: sp.color || '#7030EF', fontWeight: 600 }}>{tab}</span>
                    ))}
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <Modal title="New Space" onClose={() => { setShowCreate(false); setForm(EMPTY); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Space Name *">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Red Octopus Agency" style={inputStyle} autoFocus />
            </FormField>
            <FormField label="Client (optional)">
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} style={inputStyle}>
                <option value="">No client linked</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this space for?" rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <FormField label="Color">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, color: c })}
                    style={{ width: 30, height: 30, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '3px solid white' : '3px solid transparent', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none', transition: 'all 0.15s' }} />
                ))}
              </div>
            </FormField>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={create} disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#7030EF,#DB1FFF)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Creating...' : 'Create Space'}
              </button>
              <button onClick={() => { setShowCreate(false); setForm(EMPTY); }} style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
