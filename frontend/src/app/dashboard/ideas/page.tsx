'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const CATEGORIES = ['General','Reel','Post','Story','Carousel','YouTube','TikTok','Blog','Email','Podcast','Ad'];

const CAT_STYLE: Record<string, string> = {
  General:  'bg-slate-500/15 text-slate-400 border-slate-500/20',
  Reel:     'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Post:     'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Story:    'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Carousel: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  YouTube:  'bg-red-500/15 text-red-400 border-red-500/20',
  TikTok:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Blog:     'bg-green-500/15 text-green-400 border-green-500/20',
  Email:    'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  Podcast:  'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Ad:       'bg-violet-500/15 text-violet-400 border-violet-500/20',
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/ideas'); setIdeas(r.data || []); }
    catch { toast.error('Failed to load ideas'); } finally { setLoading(false); }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSaving(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      await apiClient.post('/ideas', { title: input.trim(), description: description.trim() || undefined, category, tags: tagList });
      setInput(''); setDescription(''); setTags(''); setExpanded(false);
      toast.success('Idea saved!');
      await load();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  }

  async function remove(id: string) {
    try {
      await apiClient.delete(`/ideas/${id}`);
      setIdeas(i => i.filter(x => x.id !== id));
    } catch { toast.error('Failed'); }
  }

  async function vote(id: string) {
    try {
      const r = await apiClient.post(`/ideas/${id}/vote`);
      setIdeas(i => i.map(x => x.id === id ? { ...x, votes: r.data.votes } : x));
    } catch {}
  }

  const categories = ['All', ...Array.from(new Set(ideas.map(i => i.category || 'General')))];
  const filtered = filterCat === 'All' ? ideas : ideas.filter(i => (i.category || 'General') === filterCat);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Idea Bank</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Capture content ideas before they disappear</p>
      </div>

      {/* Add idea form */}
      <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5 mb-6">
        <form onSubmit={add}>
          <div className="flex gap-3 mb-3">
            <input
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition"
              placeholder="Write your idea..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setExpanded(true)}
            />
            <select
              className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
              value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(t => <option key={t}>{t}</option>)}
            </select>
            <button type="submit" disabled={saving || !input.trim()}
              className="px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40">
              {saving ? '...' : 'Save'}
            </button>
          </div>
          {expanded && (
            <div className="space-y-3 mt-3 pt-3 border-t border-white/5">
              <textarea
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition resize-none"
                placeholder="Add more details, context, or inspiration... (optional)"
                rows={2} value={description} onChange={e => setDescription(e.target.value)}
              />
              <input
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition"
                placeholder="Tags: ramadan, summer, product-launch (comma-separated)"
                value={tags} onChange={e => setTags(e.target.value)}
              />
            </div>
          )}
        </form>
      </div>

      {/* Category filter tabs */}
      {ideas.length > 0 && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${filterCat === c ? 'gradient-bg text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}>
              {c} {c === 'All' ? `(${ideas.length})` : ''}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
          <img src="/icons/3d/ai.svg" alt="" className="w-16 h-16 mx-auto mb-3 opacity-80" />
          <p className="text-white font-medium mb-1">{filterCat === 'All' ? 'No ideas yet' : `No ${filterCat} ideas`}</p>
          <p className="text-slate-500 text-sm">Type an idea above and hit Save</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(idea => {
            const cat = idea.category || 'General';
            const catStyle = CAT_STYLE[cat] || CAT_STYLE.General;
            const ideaTags: string[] = idea.tags || [];
            return (
              <div key={idea.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition group flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${catStyle}`}>{cat}</span>
                  <button onClick={() => remove(idea.id)}
                    className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <p className="text-sm text-white leading-relaxed font-medium">{idea.title}</p>
                {idea.description && <p className="text-xs text-slate-500 leading-relaxed">{idea.description}</p>}

                {ideaTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ideaTags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-medium border border-indigo-500/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-600">{idea.created_by_name || 'You'} · {new Date(idea.created_at).toLocaleDateString()}</span>
                  <button onClick={() => vote(idea.id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                    <span>{idea.votes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
