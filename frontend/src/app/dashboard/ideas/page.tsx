'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const CATEGORIES = ['general','Reel','Post','Story','Carousel','YouTube','TikTok','Blog'];
const CAT_C: Record<string,string> = {
  general: 'bg-white/10 text-slate-400',
  Reel: 'bg-purple-500/20 text-purple-400',
  Post: 'bg-blue-500/20 text-blue-400',
  Story: 'bg-pink-500/20 text-pink-400',
  Carousel: 'bg-yellow-500/20 text-yellow-400',
  YouTube: 'bg-red-500/20 text-red-400',
  TikTok: 'bg-cyan-500/20 text-cyan-400',
  Blog: 'bg-green-500/20 text-green-400',
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('general');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/ideas'); setIdeas(r.data || []); }
    catch {} finally { setLoading(false); }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSaving(true);
    try {
      await apiClient.post('/ideas', { title: input.trim(), category });
      setInput('');
      await load();
    } catch {} finally { setSaving(false); }
  }

  async function remove(id: string) {
    await apiClient.delete(`/ideas/${id}`);
    setIdeas(i => i.filter(x => x.id !== id));
  }

  async function vote(id: string) {
    const r = await apiClient.post(`/ideas/${id}/vote`);
    setIdeas(i => i.map(x => x.id === id ? { ...x, votes: r.data.votes } : x));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Idea Bank</h1>
        <p className="text-slate-400 text-sm mt-1">Capture content ideas before they disappear</p>
      </div>

      <form onSubmit={add} className="flex gap-3 mb-8">
        <input
          className="flex-1 px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
          placeholder="Write your idea..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <select className="px-3 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button type="submit" disabled={saving} className="px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
          {saving ? '...' : 'Add'}
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">💡</div>
          <p className="text-slate-400">No ideas yet. Add your first one above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${CAT_C[idea.category] || CAT_C.general}`}>{idea.category}</span>
                <button onClick={() => remove(idea.id)} className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs">✕</button>
              </div>
              <p className="text-sm text-white leading-relaxed mb-3">💡 {idea.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{idea.created_by_name || 'You'}</span>
                <button onClick={() => vote(idea.id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-blue transition">
                  <span>▲</span> <span>{idea.votes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
