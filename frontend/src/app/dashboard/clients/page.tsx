'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const INPUT = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition';
const LABEL = 'block text-xs font-medium text-slate-400 mb-1.5';

type Account = { label: string; username: string; password: string };
type ClientForm = {
  name: string; email: string; company: string; phone: string;
  website: string; brief: string; accounts: Account[];
};

const EMPTY_FORM: ClientForm = { name: '', email: '', company: '', phone: '', website: '', brief: '', accounts: [] };

function AvatarCircle({ name, size = 10 }: { name: string; size?: number }) {
  const colors = ['from-indigo-500 to-violet-500','from-cyan-500 to-blue-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500','from-rose-500 to-pink-500'];
  const idx = (name.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: size * 4, height: size * 4, fontSize: size * 1.5 }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function ClientModal({ client, onClose, onSaved }: { client?: any; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!client;
  const [form, setForm] = useState<ClientForm>(client ? {
    name: client.name || '', email: client.email || '', company: client.company || '',
    phone: client.phone || '', website: client.website || '', brief: client.brief || '',
    accounts: client.accounts || [],
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function addAccount() { setForm(f => ({ ...f, accounts: [...f.accounts, { label: '', username: '', password: '' }] })); }
  function removeAccount(i: number) { setForm(f => ({ ...f, accounts: f.accounts.filter((_, idx) => idx !== i) })); }
  function updateAccount(i: number, field: keyof Account, val: string) {
    setForm(f => ({ ...f, accounts: f.accounts.map((a, idx) => idx === i ? { ...a, [field]: val } : a) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (isEdit) await apiClient.patch(`/clients/${client.id}`, form);
      else await apiClient.post('/clients', form);
      toast.success(isEdit ? 'Client updated' : 'Client added');
      onSaved(); onClose();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-lg">{isEdit ? 'Edit Client' : 'Add Client'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={LABEL}>Name *</label><input className={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Client name" /></div>
            <div><label className={LABEL}>Company</label><input className={INPUT} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Agency Inc." /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={LABEL}>Email</label><input type="email" className={INPUT} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="hello@company.com" /></div>
            <div><label className={LABEL}>Phone</label><input className={INPUT} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" /></div>
          </div>
          <div><label className={LABEL}>Website</label><input className={INPUT} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://company.com" /></div>
          <div>
            <label className={LABEL}>Brief / Notes</label>
            <textarea className={INPUT + ' resize-none'} rows={3} value={form.brief} onChange={e => setForm(f => ({ ...f, brief: e.target.value }))} placeholder="Project brief, preferences, notes about the client..." />
          </div>

          {/* Accounts section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={LABEL + ' mb-0'}>Account Credentials</label>
              <button type="button" onClick={addAccount} className="text-xs text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Account
              </button>
            </div>
            {form.accounts.length === 0 && (
              <p className="text-xs text-slate-600 py-2">No accounts added. Click "Add Account" to store client credentials.</p>
            )}
            <div className="space-y-3">
              {form.accounts.map((acc, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-3 relative">
                  <button type="button" onClick={() => removeAccount(i)} className="absolute top-2.5 right-2.5 text-slate-600 hover:text-red-400 transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    <input className={INPUT + ' text-xs py-2'} placeholder="Label (e.g. Instagram)" value={acc.label} onChange={e => updateAccount(i, 'label', e.target.value)} />
                    <input className={INPUT + ' text-xs py-2'} placeholder="Username / Email" value={acc.username} onChange={e => updateAccount(i, 'username', e.target.value)} />
                    <input type="password" className={INPUT + ' text-xs py-2'} placeholder="Password" value={acc.password} onChange={e => updateAccount(i, 'password', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientCard({ client, onEdit, onDelete }: { client: any; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const accounts: Account[] = client.accounts || [];
  const router = useRouter();

  return (
    <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group cursor-pointer"
      onClick={() => router.push(`/dashboard/clients/${client.id}`)}>
      <div className="flex items-start gap-3 mb-3">
        <AvatarCircle name={client.name} size={11} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{client.name}</h3>
          {client.company && <p className="text-xs text-slate-500 truncate">{client.company}</p>}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {client.email && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {client.phone}
          </div>
        )}
        {client.website && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <a href={client.website} target="_blank" rel="noreferrer" className="truncate hover:text-indigo-400 transition" onClick={e => e.stopPropagation()}>{client.website.replace(/^https?:\/\//, '')}</a>
          </div>
        )}
      </div>

      {client.brief && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 italic">{client.brief}</p>
      )}

      {accounts.length > 0 && (
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 transition border-t border-white/5 pt-3">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {accounts.length} credential{accounts.length !== 1 ? 's' : ''}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}

      {expanded && accounts.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {accounts.map((acc, i) => (
            <div key={i} className="bg-white/3 rounded-lg px-3 py-2 text-xs">
              <span className="text-slate-500 font-medium">{acc.label || 'Account'}: </span>
              <span className="text-slate-300 font-mono">{acc.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => { load(); }, []);

  // Support ?edit=clientId from the profile page
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && clients.length) {
      const c = clients.find(x => x.id === editId);
      if (c) { setEditClient(c); setShowModal(true); }
    }
  }, [searchParams, clients]);
  async function load() {
    try { const r = await apiClient.get('/clients'); setClients(r.data || []); }
    catch { toast.error('Failed to load clients'); } finally { setLoading(false); }
  }
  async function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return;
    try { await apiClient.delete(`/clients/${id}`); setClients(c => c.filter(x => x.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  }

  const filtered = clients.filter(c =>
    !search || [c.name, c.company, c.email].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Clients</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditClient(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Client
        </button>
      </div>

      {/* Search */}
      {clients.length > 0 && (
        <div className="relative mb-6 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition" />
        </div>
      )}

      {(showModal || editClient !== null) && (
        <ClientModal
          client={editClient}
          onClose={() => { setShowModal(false); setEditClient(null); }}
          onSaved={load}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <img src="/icons/3d/clients.svg" alt="" className="w-20 h-20 mx-auto mb-4 opacity-80" />
          <p className="text-slate-400 mb-2 font-medium">{search ? 'No clients found' : 'No clients yet'}</p>
          {!search && <p className="text-slate-600 text-sm mb-6">Add your first client to get started</p>}
          {!search && (
            <button onClick={() => setShowModal(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white text-sm">
              Add First Client
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <ClientCard
              key={c.id}
              client={c}
              onEdit={() => { setEditClient(c); setShowModal(true); }}
              onDelete={() => deleteClient(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
