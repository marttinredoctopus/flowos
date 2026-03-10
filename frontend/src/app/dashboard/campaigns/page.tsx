'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const STATUS_C: Record<string,string> = {
  active: 'bg-green-500/20 text-green-400',
  planned: 'bg-yellow-500/20 text-yellow-400',
  draft: 'bg-white/10 text-slate-400',
  completed: 'bg-blue-500/20 text-blue-400',
  paused: 'bg-red-500/20 text-red-400',
};
const PLATFORMS = ['Meta', 'Google', 'TikTok', 'Snapchat', 'Twitter/X', 'LinkedIn', 'YouTube'];
const EMPTY = { name: '', platform: 'Meta', status: 'draft', budget: '', startDate: '', endDate: '' };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/campaigns'); setCampaigns(r.data || []); }
    catch {} finally { setLoading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.platform) return;
    setSaving(true);
    try {
      await apiClient.post('/campaigns', { ...form, budget: form.budget ? parseFloat(form.budget) : undefined });
      setShowModal(false); setForm(EMPTY); load();
    } catch {} finally { setSaving(false); }
  }

  async function remove(id: string) {
    await apiClient.delete(`/campaigns/${id}`);
    setCampaigns(c => c.filter(x => x.id !== id));
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Ad Campaigns</h1>
          <p className="text-slate-400 text-sm mt-1">{campaigns.length} campaigns</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ New Campaign</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">📢</div>
          <p className="text-slate-400 mb-4">No campaigns yet</p>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Create Campaign</button>
        </div>
      ) : (
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-6 px-5 py-3 border-b border-white/5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {['Campaign','Platform','Budget','Impressions','Clicks','Status'].map(h => <div key={h}>{h}</div>)}
          </div>
          {campaigns.map((c, i) => (
            <div key={c.id} className={`grid grid-cols-6 items-center px-5 py-4 hover:bg-white/5 transition group ${i ? 'border-t border-white/5' : ''}`}>
              <p className="text-sm font-medium text-white truncate pr-4">{c.name}</p>
              <p className="text-sm text-slate-400">{c.platform}</p>
              <p className="text-sm text-white font-mono">{c.budget ? `$${Number(c.budget).toLocaleString()}` : '—'}</p>
              <p className="text-sm text-slate-400">{c.impressions ? Number(c.impressions).toLocaleString() : '—'}</p>
              <p className="text-sm text-slate-400">{c.clicks ? Number(c.clicks).toLocaleString() : '—'}</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full w-fit font-medium ${STATUS_C[c.status] || STATUS_C.draft}`}>{c.status}</span>
                <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition text-xs">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">New Campaign</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Campaign name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Budget ($)" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {Object.keys(STATUS_C).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500 mb-1 block">Start</label><input type="date" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">End</label><input type="date" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
