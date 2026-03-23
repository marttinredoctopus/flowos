'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import { LoadingScreen, EmptyState, Modal, FormField, inputStyle } from '@/components/ui/shared';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#22c55e','#06b6d4','#ef4444','#f97316'];

type Form = {
  name: string; email: string; phone: string;
  company: string; website: string; notes: string; color: string;
};

const EMPTY: Form = { name: '', email: '', phone: '', company: '', website: '', notes: '', color: '#6366f1' };

export default function Clients() {
  const [clients, setClients]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);
  const [form, setForm]             = useState<Form>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [search, setSearch]         = useState('');
  const router = useRouter();

  useEffect(() => {
    apiGet('/api/clients').then(data => {
      const c = data?.data?.clients ?? data?.clients ?? data?.data ?? data ?? [];
      setClients(Array.isArray(c) ? c : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditClient(null);
    setForm(EMPTY);
    setShowCreate(true);
  }

  function openEdit(c: any) {
    setEditClient(c);
    setForm({
      name: c.name || '', email: c.email || '', phone: c.phone || '',
      company: c.company || '', website: c.website || '',
      notes: c.notes || c.brief || '', color: c.color || '#6366f1',
    });
    setShowCreate(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error('Client name required');
    setSaving(true);
    try {
      if (editClient) {
        await apiPatch(`/api/clients/${editClient.id}`, form);
        setClients(prev => prev.map(c => c.id === editClient.id ? { ...c, ...form } : c));
        toast.success('Client updated');
      } else {
        const res = await apiPost('/api/clients', form);
        const newClient = res?.data?.client ?? res?.client ?? res?.data ?? res;
        if (newClient?.id) setClients(prev => [newClient, ...prev]);
        toast.success('Client added');
      }
      setShowCreate(false);
    } catch { toast.error('Failed to save client'); }
    finally { setSaving(false); }
  }

  async function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return;
    try {
      await apiDelete(`/api/clients/${id}`);
      setClients(prev => prev.filter(c => c.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const filtered = search
    ? clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : clients;

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Clients</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ ...inputStyle, width: 200, padding: '8px 12px', fontSize: 13 }} />
          <button onClick={openCreate} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            + New Client
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="👥" text={search ? 'No clients match your search' : 'No clients yet. Add your first client!'} action={!search ? 'Add Client' : undefined} onAction={!search ? openCreate : undefined} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map((c: any) => (
            <div key={c.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color || '#6366f1'}20`, border: `2px solid ${c.color || '#6366f1'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: c.color || '#6366f1', flexShrink: 0 }}>
                  {c.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.company || '—'}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={e => { e.stopPropagation(); openEdit(c); }} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 11 }}>✏️</button>
                  <button onClick={e => { e.stopPropagation(); deleteClient(c.id); }} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: 11 }}>🗑️</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                <span>📁 {c.project_count || 0} projects</span>
                <span>✅ {c.task_count || 0} tasks</span>
              </div>

              {c.email && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>✉️ {c.email}</div>}
              {c.phone && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>📞 {c.phone}</div>}
              {c.website && <div style={{ fontSize: 12, color: '#6366f1', marginBottom: 3 }}>🌐 {c.website}</div>}

              <button onClick={() => router.push(`/dashboard/clients/portal?clientId=${c.id}`)} style={{ marginTop: 12, width: '100%', padding: '7px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.color = '#6366f1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                🌐 View Portal
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreate && (
        <Modal title={editClient ? 'Edit Client' : 'New Client'} onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Client Name *">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Red Octopus Agency" style={inputStyle} autoFocus />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Email">
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@email.com" style={inputStyle} />
              </FormField>
              <FormField label="Phone">
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+20 1xx xxx xxxx" style={inputStyle} />
              </FormField>
            </div>
            <FormField label="Company">
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" style={inputStyle} />
            </FormField>
            <FormField label="Website">
              <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" style={inputStyle} />
            </FormField>
            <FormField label="Notes">
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Client notes or brief..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <FormField label="Color">
              <div style={{ display: 'flex', gap: 8 }}>
                {COLORS.map(color => (
                  <div key={color} onClick={() => setForm({ ...form, color })} style={{ width: 28, height: 28, borderRadius: '50%', background: color, cursor: 'pointer', border: form.color === color ? '3px solid white' : '3px solid transparent', boxShadow: form.color === color ? `0 0 0 2px ${color}` : 'none', transition: 'all 0.15s' }} />
                ))}
              </div>
            </FormField>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editClient ? 'Save Changes' : 'Add Client'}
              </button>
              <button onClick={() => setShowCreate(false)} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
