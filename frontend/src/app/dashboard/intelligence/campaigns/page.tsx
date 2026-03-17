'use client';
import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Rocket } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const OBJECTIVES = ['Brand Awareness','Lead Generation','Sales','Engagement','Retention'];
const PLATFORMS = ['Instagram','Facebook','TikTok','Twitter/X','LinkedIn','YouTube','Snapchat','Google Ads'];
const TONES = ['Professional','Fun','Inspiring','Urgent','Educational'];
const BUDGETS = ['Under $1K','$1K-$5K','$5K-$20K','$20K-$50K','$50K+'];
const DURATIONS = ['1 week','2 weeks','1 month','2 months','3 months','6 months'];

const selectCls = 'w-full px-3 py-2.5 text-sm rounded-lg input-base appearance-none';
const inputCls  = 'w-full px-3 py-2.5 text-sm rounded-lg input-base';

export default function CampaignGeneratorPage() {
  const [form, setForm] = useState({
    brandName: '', industry: '', objective: 'Brand Awareness', targetAudience: '',
    budgetRange: '$1K-$5K', duration: '1 month', platforms: [] as string[], tone: 'Professional',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [expandedConcept, setExpandedConcept] = useState<number | null>(0);

  function togglePlatform(p: string) {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p],
    }));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.platforms.length) { toast.error('Select at least one platform'); return; }
    setLoading(true);
    try {
      const r = await apiClient.post('/intelligence/campaign-concepts', form);
      setResult(r.data);
      setExpandedConcept(0);
      toast.success('3 campaign concepts generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Generation failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--amber-2)' }}>
          <Sparkles size={18} style={{ color: 'var(--amber)' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Campaign Idea Generator</h1>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>Generate 3 complete campaign concepts with Claude AI</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="rounded-xl p-4 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Brand / Client *</label>
                <input required value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})}
                  className={inputCls} placeholder="Brand name" style={{ color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Industry</label>
                <input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                  className={inputCls} placeholder="e.g. Fashion, F&B, Tech" style={{ color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Objective</label>
                <select value={form.objective} onChange={e => setForm({...form, objective: e.target.value})}
                  className={selectCls} style={{ color: 'var(--text)', background: 'var(--input-bg)' }}>
                  {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Target Audience</label>
                <textarea rows={2} value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                  className={`${inputCls} resize-none`} placeholder="e.g. Women 25-40, fitness enthusiasts" style={{ color: 'var(--text)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Budget</label>
                  <select value={form.budgetRange} onChange={e => setForm({...form, budgetRange: e.target.value})}
                    className={selectCls} style={{ color: 'var(--text)', background: 'var(--input-bg)' }}>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Duration</label>
                  <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                    className={selectCls} style={{ color: 'var(--text)', background: 'var(--input-bg)' }}>
                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Platforms *</label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" onClick={() => togglePlatform(p)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition"
                    style={{
                      background: form.platforms.includes(p) ? 'var(--cyan-2)' : 'var(--surface)',
                      color: form.platforms.includes(p) ? 'var(--cyan)' : 'var(--text-2)',
                      border: `1px solid ${form.platforms.includes(p) ? 'var(--cyan)' : 'var(--border)'}`,
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Tone</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(t => (
                  <button key={t} type="button" onClick={() => setForm({...form, tone: t})}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition"
                    style={{
                      background: form.tone === t ? 'var(--grad-primary)' : 'var(--surface)',
                      color: form.tone === t ? '#fff' : 'var(--text-2)',
                      border: `1px solid ${form.tone === t ? 'transparent' : 'var(--border)'}`,
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-10 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--grad-primary)' }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating 3 concepts…
                </>
              ) : (
                <><Rocket size={14} /> Generate Campaign Concepts</>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          {result?.concepts ? (
            <div className="space-y-3">
              {result.concepts.map((concept: any, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <button onClick={() => setExpandedConcept(expandedConcept === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--indigo-2)', color: 'var(--indigo)' }}>
                          Concept {i + 1}
                        </span>
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{concept.name}</h3>
                      </div>
                      <p className="text-xs italic" style={{ color: 'var(--text-2)' }}>{concept.tagline}</p>
                    </div>
                    {expandedConcept === i
                      ? <ChevronUp size={16} style={{ color: 'var(--text-3)' }} />
                      : <ChevronDown size={16} style={{ color: 'var(--text-3)' }} />}
                  </button>

                  {expandedConcept === i && (
                    <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                      <p className="text-sm pt-4" style={{ color: 'var(--text-2)' }}>{concept.core_concept}</p>

                      {concept.content_pillars?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-3)' }}>Content Pillars</p>
                          <div className="grid grid-cols-2 gap-2">
                            {concept.content_pillars.map((p: any, j: number) => (
                              <div key={j} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{p.pillar}</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-2)' }}>{p.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {concept.kpis?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-3)' }}>KPIs</p>
                          <div className="flex flex-wrap gap-1.5">
                            {concept.kpis.map((k: string, j: number) => (
                              <span key={j} className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: 'var(--emerald-2)', color: 'var(--emerald)' }}>{k}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {concept.budget_allocation && (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-3)' }}>Budget Allocation</p>
                          <div className="space-y-2">
                            {Object.entries(concept.budget_allocation).map(([cat, pct]: any) => (
                              <div key={cat} className="flex items-center gap-2">
                                <span className="text-xs w-32 truncate" style={{ color: 'var(--text-2)' }}>{cat}</span>
                                <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--border)' }}>
                                  <div className="h-1.5 rounded-full" style={{ width: pct, background: 'var(--grad-primary)' }} />
                                </div>
                                <span className="text-xs w-10 text-right" style={{ color: 'var(--text-2)' }}>{pct}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-64 flex items-center justify-center rounded-xl border-2 border-dashed p-8" style={{ borderColor: 'var(--border)' }}>
              <div className="text-center">
                <Sparkles size={40} className="mx-auto mb-4" style={{ color: 'var(--text-3)' }} />
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>Fill in the brief and Claude AI will generate 3 complete campaign concepts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
