'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const STATUSES = ['brief_received','in_design','review','client_approval','done'];
const STATUS_LABELS: Record<string,string> = {
  brief_received: 'Brief Received', in_design: 'In Design', review: 'Review',
  client_approval: 'Client Approval', done: 'Done',
};
const ASSET_TYPES = ['Logo','Banner','Social Post','Video Thumbnail','Brochure','Business Card','Illustration','Other'];

export default function DesignHubPage() {
  const [tab, setTab] = useState<'briefs' | 'assets' | 'brand'>('briefs');
  const [briefs, setBriefs] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', assetType: 'Other', deadline: '', briefContent: '', clientId: '' });
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState<{id: string; status: string} | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [b, a, c] = await Promise.all([
        apiClient.get('/design/briefs'),
        apiClient.get('/design/assets'),
        apiClient.get('/clients'),
      ]);
      setBriefs(b.data);
      setAssets(a.data);
      setClients(c.data);
    } catch {} finally { setLoading(false); }
  }

  async function createBrief(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const r = await apiClient.post('/design/briefs', form);
      setBriefs(prev => [r.data, ...prev]);
      setForm({ title: '', assetType: 'Other', deadline: '', briefContent: '', clientId: '' });
      setShowCreate(false);
      toast.success('Brief created!');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function updateBriefStatus(id: string, status: string) {
    try {
      const r = await apiClient.patch(`/design/briefs/${id}`, { status });
      setBriefs(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {}
  }

  async function deleteBrief(id: string) {
    if (!confirm('Delete brief?')) return;
    try {
      await apiClient.delete(`/design/briefs/${id}`);
      setBriefs(prev => prev.filter(b => b.id !== id));
      toast.success('Deleted');
    } catch {}
  }

  function getBriefsByStatus(status: string) {
    return briefs.filter(b => b.status === status);
  }

  const ASSET_TYPE_COLORS: Record<string,string> = {
    Logo: 'text-yellow-400 bg-yellow-500/10', Banner: 'text-blue-400 bg-blue-500/10',
    'Social Post': 'text-pink-400 bg-pink-500/10', 'Video Thumbnail': 'text-red-400 bg-red-500/10',
    Other: 'text-slate-400 bg-slate-500/10',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Design Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Manage design briefs, assets, and brand guidelines</p>
        </div>
        {tab === 'briefs' && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90">
            + New Brief
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['briefs', 'assets', 'brand'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${tab === t ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'text-slate-400 hover:text-white border border-white/5'}`}>
            {t === 'briefs' ? '📋 Briefs' : t === 'assets' ? '🗂️ Asset Library' : '🎨 Brand Guidelines'}
          </button>
        ))}
      </div>

      {/* BRIEFS KANBAN */}
      {tab === 'briefs' && (
        loading ? (
          <div className="grid grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
            {STATUSES.map(status => (
              <div key={status} className="min-w-44"
                onDragOver={e => e.preventDefault()}
                onDrop={() => {
                  if (dragging && dragging.status !== status) { updateBriefStatus(dragging.id, status); setDragging(null); }
                }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 px-1">
                  {STATUS_LABELS[status]} <span className="text-slate-600">({getBriefsByStatus(status).length})</span>
                </p>
                <div className="space-y-2">
                  {getBriefsByStatus(status).map(brief => (
                    <div key={brief.id} draggable
                      onDragStart={() => setDragging({ id: brief.id, status: brief.status })}
                      className="bg-[#0f1117] border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing group hover:border-white/10 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${ASSET_TYPE_COLORS[brief.asset_type] || ASSET_TYPE_COLORS.Other}`}>
                          {brief.asset_type}
                        </span>
                        <button onClick={() => deleteBrief(brief.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 text-xs transition">✕</button>
                      </div>
                      <p className="text-white text-xs font-medium leading-tight mb-1">{brief.title}</p>
                      {brief.client_name && <p className="text-slate-500 text-[10px]">{brief.client_name}</p>}
                      {brief.designer_name && <p className="text-slate-500 text-[10px]">👤 {brief.designer_name}</p>}
                      {brief.deadline && <p className="text-slate-500 text-[10px] mt-1">📅 {new Date(brief.deadline).toLocaleDateString()}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ASSET LIBRARY */}
      {tab === 'assets' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="text-5xl mb-4">🗂️</div>
              <p className="text-white font-semibold mb-2">Asset Library is empty</p>
              <p className="text-slate-400 text-sm">Upload design files through design briefs</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {assets.map(asset => (
                <div key={asset.id} className="group bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition">
                  <div className="aspect-square bg-white/5 relative">
                    {asset.file_url && (asset.file_type === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(asset.file_url)) ? (
                      <img src={asset.file_url} alt={asset.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🗂️</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <a href={asset.file_url} download target="_blank" rel="noreferrer"
                        className="px-2 py-1 gradient-bg rounded-lg text-xs text-white font-semibold">⬇ Download</a>
                    </div>
                    {asset.version > 1 && (
                      <span className="absolute top-1 right-1 text-[10px] bg-brand-blue text-white px-1.5 py-0.5 rounded-full">v{asset.version}</span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                    <p className="text-slate-500 text-[10px]">{asset.uploaded_by_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BRAND GUIDELINES */}
      {tab === 'brand' && (
        <div className="max-w-2xl">
          {clients.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="text-5xl mb-4">🎨</div>
              <p className="text-slate-400">Add clients first to manage their brand guidelines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map(client => (
                <div key={client.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{client.name}</p>
                    <p className="text-slate-500 text-xs">{client.company || client.email}</p>
                  </div>
                  <a href={`/dashboard/creative/design/brand/${client.id}`}
                    className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white hover:border-brand-blue/50 transition">
                    View / Edit →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Brief Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-white">New Design Brief</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={createBrief} className="space-y-4">
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none"
                placeholder="Brief title *" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Asset Type</label>
                  <select value={form.assetType} onChange={e => setForm({...form, assetType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Client</label>
                  <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    <option value="">No client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
              </div>
              <textarea rows={3} value={form.briefContent} onChange={e => setForm({...form, briefContent: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none resize-none"
                placeholder="Brief description / requirements" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create Brief'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
