'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const STATUS_C: Record<string,string> = {
  planned: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-red-500/20 text-red-400',
};
const EMPTY = { title: '', description: '', shootType: 'photo', scheduledAt: '', durationHours: '2', location: '' };

export default function ShootsPage() {
  const [shoots, setShoots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/shoots'); setShoots(r.data || []); }
    catch {} finally { setLoading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.scheduledAt) return;
    setSaving(true);
    try {
      await apiClient.post('/shoots', { ...form, durationHours: parseFloat(form.durationHours) });
      setShowModal(false); setForm(EMPTY); load();
    } catch {} finally { setSaving(false); }
  }

  async function remove(id: string) {
    await apiClient.delete(`/shoots/${id}`);
    setShoots(s => s.filter(x => x.id !== id));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Shoot Sessions</h1>
          <p className="text-slate-400 text-sm mt-1">{shoots.length} sessions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ Book Session</button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : shoots.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-slate-400 mb-4">No shoot sessions yet</p>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Book Session</button>
        </div>
      ) : (
        <div className="space-y-4">
          {shoots.map((s) => (
            <div key={s.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">📅 {new Date(s.scheduled_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_C[s.status] || STATUS_C.planned}`}>{s.status}</span>
                  <button onClick={() => remove(s.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition text-xs">✕</button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                {s.location && <span>📍 {s.location}</span>}
                <span>⏱ {s.duration_hours}h</span>
                <span>🎥 {s.shoot_type}</span>
                {s.client_name && <span>👤 {s.client_name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">Book Shoot Session</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Shoot title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.shootType} onChange={e => setForm({...form, shootType: e.target.value})}>
                  <option value="photo">Photography</option>
                  <option value="video">Video</option>
                  <option value="hybrid">Photo + Video</option>
                </select>
                <input type="number" step="0.5" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Duration (hours)" value={form.durationHours} onChange={e => setForm({...form, durationHours: e.target.value})} />
              </div>
              <input required type="datetime-local" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-blue/50" value={form.scheduledAt} onChange={e => setForm({...form, scheduledAt: e.target.value})} />
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              <textarea className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none resize-none" rows={2} placeholder="Notes (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? 'Booking...' : 'Book Session'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
