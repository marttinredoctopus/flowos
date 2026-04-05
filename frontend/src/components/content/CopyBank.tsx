'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  MagnifyingGlass, 
  ChatCircleText, 
  Fingerprint, 
  Copy, 
  Check, 
  TrashSimple, 
  Sparkle,
  InstagramLogo,
  TiktokLogo,
  TwitterLogo,
  LinkedinLogo
} from '@phosphor-icons/react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const TONES = ['professional', 'casual', 'humorous', 'aggressive', 'inspirational', 'informative'];
const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'twitter', 'linkedin', 'youtube', 'snapchat'];

const PLATFORM_ICONS: Record<string, any> = {
  instagram: InstagramLogo,
  facebook:  Check, // Placeholder
  tiktok:    TiktokLogo,
  twitter:   TwitterLogo,
  linkedin:  LinkedinLogo,
};

export default function CopyBank() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ 
    caption: '', 
    platform: '', 
    contentType: 'Post', 
    tone: 'professional',
    performanceLabel: 'New'
  });
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [q]);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get('/content-pieces/copy-bank', { params: { q } });
      setItems(res.data);
    } catch {
      toast.error('Failed to load copy bank');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiClient.post('/content-pieces/copy-bank', form);
      setItems([res.data, ...items]);
      setForm({ caption: '', platform: '', contentType: 'Post', tone: 'professional', performanceLabel: 'New' });
      setShowAdd(false);
      toast.success('Added to Copy Bank');
    } catch {
      toast.error('Failed to save copy');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this copy permanently?')) return;
    try {
      await apiClient.delete(`/content-pieces/copy-bank/${id}`);
      setItems(items.filter(i => i.id !== id));
      toast.success('Removed from bank');
    } catch {
      toast.error('Failed to remove');
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredItems = items; // Backend already filters by q

  return (
    <div className="flex flex-col h-full gap-6 lg:flex-row">
      {/* Left Pane: Search & Filter */}
      <div className="lg:w-[320px] shrink-0 space-y-6">
        <div className="bg-[#0d0d14] rounded-2xl border border-white/5 p-5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-900/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-sm font-bold text-white mb-4 tracking-tight flex items-center gap-2">
            <MagnifyingGlass size={16} className="text-primary-400" weight="bold" />
            Search Bank
          </h3>
          <div className="relative">
            <input 
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by keywords..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
               <Fingerprint size={14} weight="bold" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-full p-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-900/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 active:translate-y-0"
        >
          {showAdd ? <X size={20} weight="bold" /> : <Plus size={20} weight="bold" />}
          {showAdd ? 'Cancel' : 'Add New Copy'}
        </button>

        {showAdd && (
          <form onSubmit={handleAdd} className="bg-[#0d0d14] rounded-2xl border border-primary-500/20 p-5 shadow-2xl animate-fade-in space-y-4">
             <textarea 
                required
                rows={5}
                value={form.caption}
                onChange={e => setForm({...form, caption: e.target.value})}
                placeholder="Paste your top-performing caption here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-all font-medium resize-none leading-relaxed"
             />
             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Platform</label>
                 <select 
                    value={form.platform}
                    onChange={e => setForm({...form, platform: e.target.value})}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500/50 appearance-none font-bold"
                 >
                    <option value="">Any</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Tone</label>
                 <select 
                    value={form.tone}
                    onChange={e => setForm({...form, tone: e.target.value})}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500/50 appearance-none font-bold"
                 >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
               </div>
             </div>

             <button 
               type="submit"
               disabled={saving}
               className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
             >
               {saving ? 'Saving...' : 'Add to Bank'}
             </button>
          </form>
        )}

        <div className="p-5 bg-gradient-to-br from-indigo-900/20 to-primary-900/10 rounded-2xl border border-white/1 border-dashed shadow-2xl relative overflow-hidden">
           <Sparkle size={48} weight="fill" className="absolute -right-4 -bottom-4 text-primary-500/10 rotate-12" />
           <p className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em] mb-2">Pro Tip</p>
           <p className="text-xs text-slate-300 leading-relaxed font-medium">Use high-performing copy as templates for future AI generations to maintain your brand's unique voice.</p>
        </div>
      </div>

      {/* Right Pane: Copy Items */}
      <div className="flex-1 space-y-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="h-44 bg-[#0d0d14] border border-white/5 rounded-2xl animate-pulse" />
             ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
               <ChatCircleText size={32} weight="bold" />
             </div>
             <div className="space-y-1">
               <h4 className="text-lg font-bold text-white">Bank is Empty</h4>
               <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">Save your best captions, hooks, and copy here for quick access later.</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-[#0d0d14] border border-white/5 rounded-2xl p-6 shadow-2xl transition-all hover:border-primary-500/20 group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary-400 px-2 py-1 rounded bg-primary-500/10 flex items-center gap-1.5 uppercase tracking-wider">
                         <div className="w-1 h-1 rounded-full bg-primary-500" />
                         {item.tone}
                      </span>
                      {item.platform && (
                        <span className="text-[10px] font-bold text-slate-500 px-2 py-1 rounded bg-white/5 border border-white/5 uppercase flex items-center gap-1.5">
                           {item.platform}
                        </span>
                      )}
                   </div>

                   <button 
                     onClick={() => handleRemove(item.id)}
                     className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                   >
                     <TrashSimple size={14} weight="bold" />
                   </button>
                </div>

                <div className="flex-1 relative z-10">
                  <p className="text-[13px] text-slate-300 font-medium leading-relaxed mb-6 block whitespace-pre-wrap">
                    {item.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full border border-[#0d0d14] bg-primary-600 flex items-center justify-center text-[7px] font-black text-white">{item.created_by_name?.[0] || 'A'}</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.content_type}</span>
                   </div>
                   
                   <button 
                     onClick={() => handleCopy(item.id, item.caption)}
                     className={`
                       flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                       ${copiedId === item.id 
                         ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30' 
                         : 'bg-white/5 text-slate-400 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-900/20'}
                     `}
                   >
                      {copiedId === item.id ? <Check size={12} weight="bold" /> : <Copy size={12} weight="bold" />}
                      {copiedId === item.id ? 'Copied' : 'Copy Text'}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function X({ size, weight, className }: { size: number, weight: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
      <path fill="currentColor" d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}
