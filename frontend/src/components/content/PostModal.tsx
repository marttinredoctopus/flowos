'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import apiClient from '@/lib/apiClient';
import { 
  X, 
  Checks, 
  CalendarDots, 
  Globe, 
  Tag, 
  ChatCircleText,
  Rocket,
  Image,
  VideoCamera,
  Users
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { value: 'facebook',  label: 'Facebook',  color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'tiktok',    label: 'TikTok',    color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
  { value: 'twitter',   label: 'Twitter/X', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { value: 'linkedin',  label: 'LinkedIn',  color: 'bg-blue-600/10 text-blue-500 border-blue-600/20' },
  { value: 'youtube',   label: 'YouTube',   color: 'bg-red-500/10 text-red-400 border-red-500/20' },
];

const CONTENT_TYPES = ['post', 'story', 'reel', 'video', 'thread'];
const STATUSES = ['draft', 'writing', 'review', 'approved', 'scheduled', 'published'];

export default function PostModal({ post, onClose, onSaved }: { post?: any, onClose: () => void, onSaved: () => void }) {
  const isEdit = !!post;
  const [form, setForm] = useState({
    title: post?.title || '',
    caption: post?.caption || '',
    platform: post?.platform || 'instagram',
    content_type: post?.content_type || 'post',
    status: post?.status || 'draft',
    publish_at: post?.publish_at ? format(new Date(post.publish_at), "yyyy-MM-dd'T'HH:mm") : '',
    notes: post?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await apiClient.patch(`/content-pieces/${post.id}`, form);
        toast.success('Piece updated');
      } else {
        await apiClient.post('/content-pieces', form);
        toast.success('Piece created');
      }
      onSaved();
      onClose();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0d0d14] border border-white/5 w-full max-w-2xl rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white/1 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center text-primary-400 border border-primary-500/20">
              <Rocket size={20} weight="fill" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{isEdit ? 'Edit Piece' : 'Create New Piece'}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Content Stream</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-white/5">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Piece Title</label>
              <input 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. Ramadan Special Reel"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 transition-all font-semibold"
              />
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Publish To</label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm({...form, platform: p.value})}
                    className={`
                      px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
                      ${form.platform === p.value 
                        ? p.color 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Content Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Format</label>
                <select 
                  value={form.content_type}
                  onChange={e => setForm({...form, content_type: e.target.value})}
                  className="w-full bg-[#11111a] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 appearance-none font-bold shadow-inner"
                >
                  {CONTENT_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Pipeline State</label>
                <select 
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full bg-[#11111a] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 appearance-none font-bold shadow-inner"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Schedule At</label>
              <div className="relative group">
                <input 
                  type="datetime-local"
                  value={form.publish_at}
                  onChange={e => setForm({...form, publish_at: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all font-semibold [color-scheme:dark]"
                />
                <CalendarDots size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-primary-500 transition-colors" weight="bold" />
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Caption / Script</label>
              <textarea 
                value={form.caption}
                onChange={e => setForm({...form, caption: e.target.value})}
                rows={6}
                placeholder="Write your creative copy here..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 transition-all font-semibold resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
             <button 
               type="button" 
               onClick={onClose}
               className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-black uppercase tracking-wider border border-white/10 transition-all"
             >
               Discard
             </button>
             <button 
               type="submit"
               disabled={saving}
               className="flex-[2] py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-900/40 transition-all disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
             >
               {saving ? 'Processing...' : (
                 <>
                   <Checks size={18} weight="bold" />
                   {isEdit ? 'Sync Changes' : 'Launch Piece'}
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
