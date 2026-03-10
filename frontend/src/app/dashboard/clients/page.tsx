'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/clients'); setClients(r.data || []); }
    catch {} finally { setLoading(false); }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await apiClient.post('/clients', form); setForm({ name: '', email: '', company: '', phone: '' }); setShowForm(false); load(); }
    catch {} finally { setSaving(false); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-2xl font-bold text-white">Clients</h1><p className="text-slate-400 text-sm mt-1">{clients.length} clients</p></div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ Add Client</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display text-lg font-bold mb-4">Add Client</h2>
            <form onSubmit={create} className="space-y-4">
              {[['name','Name *','text'],['email','Email','email'],['company','Company','text'],['phone','Phone','tel']].map(([key, ph, type]) => (
                <input key={key} type={type} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder={ph} value={(form as any)[key]} onChange={e => setForm({...form, [key]: e.target.value})} required={key === 'name'} />
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Add Client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-24"><div className="text-5xl mb-4">👥</div><p className="text-slate-400 mb-6">No clients yet</p><button onClick={() => setShowForm(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Add First Client</button></div>
      ) : (
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
          {clients.map((c: any, i) => (
            <div key={c.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition cursor-pointer ${i !== 0 ? 'border-t border-white/5' : ''}`}>
              <div className="w-10 h-10 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">{c.name?.[0]?.toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{c.name}</p>
                <p className="text-xs text-slate-500">{c.company || c.email || '—'}</p>
              </div>
              {c.email && <p className="text-sm text-slate-400 hidden md:block">{c.email}</p>}
              {c.phone && <p className="text-sm text-slate-400 hidden lg:block">{c.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
