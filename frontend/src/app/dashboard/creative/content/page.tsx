'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const PLATFORMS = ['instagram','facebook','tiktok','twitter','linkedin','youtube','snapchat'];
const PLATFORM_ICONS: Record<string,string> = {
  instagram: '📸', facebook: '🔵', tiktok: '🎵', twitter: '🐦',
  linkedin: '💼', youtube: '▶️', snapchat: '👻',
};
const PLATFORM_COLORS: Record<string,string> = {
  instagram: 'bg-pink-500/20 text-pink-400', facebook: 'bg-blue-500/20 text-blue-400',
  tiktok: 'bg-cyan-500/20 text-cyan-400', twitter: 'bg-sky-500/20 text-sky-400',
  linkedin: 'bg-blue-600/20 text-blue-300', youtube: 'bg-red-500/20 text-red-400',
  snapchat: 'bg-yellow-500/20 text-yellow-400',
};
const STATUSES = ['draft','writing','design','review','approved','scheduled','published'];
const STATUS_COLORS: Record<string,string> = {
  draft: 'bg-slate-500/20 text-slate-400', writing: 'bg-blue-500/20 text-blue-400',
  design: 'bg-purple-500/20 text-purple-400', review: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400', scheduled: 'bg-cyan-500/20 text-cyan-400',
  published: 'bg-emerald-500/20 text-emerald-400',
};
const CONTENT_TYPES = ['Post','Reel','Story','Carousel','Video','Blog','Thread'];

export default function ContentTeamPage() {
  const [tab, setTab] = useState<'calendar' | 'pipeline' | 'copybank'>('calendar');
  const [pieces, setPieces] = useState<any[]>([]);
  const [copyBank, setCopyBank] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', platform: 'instagram', contentType: 'Post', status: 'draft', publishAt: '', caption: '' });
  const [saving, setSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [copyForm, setCopyForm] = useState({ caption: '', platform: '', contentType: '', tone: 'professional' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        apiClient.get('/content-pieces'),
        apiClient.get('/content-pieces/copy-bank'),
      ]);
      setPieces(p.data);
      setCopyBank(c.data);
    } catch {} finally { setLoading(false); }
  }

  async function createPiece(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const r = await apiClient.post('/content-pieces', form);
      setPieces(prev => [...prev, r.data]);
      setForm({ title: '', platform: 'instagram', contentType: 'Post', status: 'draft', publishAt: '', caption: '' });
      setShowCreate(false);
      toast.success('Content piece created!');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const r = await apiClient.patch(`/content-pieces/${id}`, { status });
      setPieces(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch {}
  }

  async function addToCopyBank(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await apiClient.post('/content-pieces/copy-bank', copyForm);
      setCopyBank(prev => [r.data, ...prev]);
      setCopyForm({ caption: '', platform: '', contentType: '', tone: 'professional' });
      toast.success('Added to copy bank!');
    } catch {}
  }

  // Calendar helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  function getPiecesForDay(day: number) {
    return pieces.filter(p => {
      if (!p.publish_at) return false;
      const d = new Date(p.publish_at);
      return d.getFullYear() === currentMonth.getFullYear() && d.getMonth() === currentMonth.getMonth() && d.getDate() === day;
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Content Team</h1>
          <p className="text-slate-400 text-sm mt-1">Plan, create, and publish content</p>
        </div>
        {tab !== 'copybank' && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90">
            + New Content
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['calendar', 'pipeline', 'copybank'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${tab === t ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'text-slate-400 hover:text-white border border-white/5'}`}>
            {t === 'calendar' ? '📅 Calendar' : t === 'pipeline' ? '📋 Pipeline' : '✍️ Copy Bank'}
          </button>
        ))}
      </div>

      {/* CALENDAR */}
      {tab === 'calendar' && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))}
              className="px-3 py-1.5 border border-white/10 rounded-lg text-slate-400 hover:text-white text-sm transition">←</button>
            <h2 className="text-white font-semibold">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))}
              className="px-3 py-1.5 border border-white/10 rounded-lg text-slate-400 hover:text-white text-sm transition">→</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center text-xs text-slate-500 font-semibold py-2">{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayPieces = getPiecesForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();
              return (
                <div key={day} onClick={() => { setForm(f => ({...f, publishAt: `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`})); setShowCreate(true); }}
                  className={`min-h-20 p-1.5 rounded-xl border cursor-pointer transition ${isToday ? 'border-brand-blue/50 bg-brand-blue/5' : 'border-white/5 bg-[#0f1117] hover:border-white/10'}`}>
                  <p className={`text-xs font-semibold mb-1 ${isToday ? 'text-brand-blue' : 'text-slate-400'}`}>{day}</p>
                  <div className="space-y-0.5">
                    {dayPieces.slice(0, 3).map(p => (
                      <div key={p.id} className={`text-[9px] px-1 py-0.5 rounded truncate ${PLATFORM_COLORS[p.platform] || 'bg-white/10 text-white'}`}>
                        {PLATFORM_ICONS[p.platform]} {p.title}
                      </div>
                    ))}
                    {dayPieces.length > 3 && <p className="text-[9px] text-slate-500">+{dayPieces.length - 3} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PIPELINE */}
      {tab === 'pipeline' && (
        loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUSES.map(status => (
              <div key={status} className="min-w-52 flex-shrink-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  {status} ({pieces.filter(p => p.status === status).length})
                </p>
                <div className="space-y-2">
                  {pieces.filter(p => p.status === status).map(piece => (
                    <div key={piece.id} className="bg-[#0f1117] border border-white/5 rounded-xl p-3 hover:border-white/10 transition">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span>{PLATFORM_ICONS[piece.platform]}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${PLATFORM_COLORS[piece.platform]}`}>{piece.platform}</span>
                        <span className="text-[10px] text-slate-600">{piece.content_type}</span>
                      </div>
                      <p className="text-white text-xs font-medium mb-2">{piece.title}</p>
                      {piece.publish_at && <p className="text-slate-500 text-[10px]">📅 {new Date(piece.publish_at).toLocaleDateString()}</p>}
                      <select value={piece.status} onChange={e => updateStatus(piece.id, e.target.value)}
                        className="mt-2 w-full px-2 py-1 bg-[#0c0d11] border border-white/10 rounded-lg text-white text-[10px] focus:outline-none">
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* COPY BANK */}
      {tab === 'copybank' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Add to Copy Bank</h3>
            <form onSubmit={addToCopyBank} className="space-y-3 bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <textarea required rows={4} value={copyForm.caption} onChange={e => setCopyForm({...copyForm, caption: e.target.value})}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none resize-none"
                placeholder="Caption / copy…" />
              <div className="grid grid-cols-2 gap-2">
                <select value={copyForm.platform} onChange={e => setCopyForm({...copyForm, platform: e.target.value})}
                  className="px-3 py-2 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-xs focus:outline-none">
                  <option value="">Any platform</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={copyForm.contentType} onChange={e => setCopyForm({...copyForm, contentType: e.target.value})}
                  className="px-3 py-2 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-xs focus:outline-none">
                  <option value="">Any type</option>
                  {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-2 gradient-bg rounded-xl text-xs font-semibold text-white hover:opacity-90">
                + Add to Bank
              </button>
            </form>
          </div>
          <div className="lg:col-span-2">
            {copyBank.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <div className="text-4xl mb-3">✍️</div>
                <p className="text-slate-400 text-sm">Your copy bank is empty. Add reusable captions and copy.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {copyBank.map(item => (
                  <div key={item.id} className="bg-[#0f1117] border border-white/5 rounded-xl p-4 group">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-slate-300 text-sm leading-relaxed">{item.caption}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.platform && <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${PLATFORM_COLORS[item.platform] || 'bg-white/10 text-white'}`}>{item.platform}</span>}
                          {item.content_type && <span className="text-[10px] text-slate-500">{item.content_type}</span>}
                          {item.performance_label && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${item.performance_label === 'High Performing' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                              {item.performance_label}
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText(item.caption); toast.success('Copied!'); }}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-brand-blue/20 text-brand-blue rounded-lg text-xs font-semibold transition">
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-white">New Content Piece</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={createPiece} className="space-y-4">
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none"
                placeholder="Title *" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Platform</label>
                  <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Type</label>
                  <select value={form.contentType} onChange={e => setForm({...form, contentType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Publish Date</label>
                <input type="datetime-local" value={form.publishAt} onChange={e => setForm({...form, publishAt: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
              </div>
              <textarea rows={2} value={form.caption} onChange={e => setForm({...form, caption: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none resize-none"
                placeholder="Caption preview…" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
