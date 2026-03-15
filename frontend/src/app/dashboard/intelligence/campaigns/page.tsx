'use client';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const OBJECTIVES = ['Brand Awareness','Lead Generation','Sales','Engagement','Retention'];
const PLATFORMS = ['Instagram','Facebook','TikTok','Twitter/X','LinkedIn','YouTube','Snapchat','Google Ads'];
const TONES = ['Professional','Fun','Inspiring','Urgent','Educational'];
const BUDGETS = ['Under $1K','$1K-$5K','$5K-$20K','$20K-$50K','$50K+'];
const DURATIONS = ['1 week','2 weeks','1 month','2 months','3 months','6 months'];

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
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Campaign Idea Generator</h1>
        <p className="text-slate-400 text-sm mt-1">Generate 3 complete campaign concepts with Claude AI</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Brand / Client *</label>
              <input required value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})}
                className="w-full px-3 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
                placeholder="Brand name" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Industry</label>
              <input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                className="w-full px-3 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
                placeholder="e.g. Fashion, F&B, Tech" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Objective</label>
              <select value={form.objective} onChange={e => setForm({...form, objective: e.target.value})}
                className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Target Audience</label>
              <textarea rows={2} value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                className="w-full px-3 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 resize-none"
                placeholder="e.g. Women 25-40, fitness enthusiasts in Cairo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Budget</label>
                <select value={form.budgetRange} onChange={e => setForm({...form, budgetRange: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                  {BUDGETS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Duration</label>
                <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                  {DURATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Platforms *</label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" onClick={() => togglePlatform(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${form.platforms.includes(p) ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Tone</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(t => (
                  <button key={t} type="button" onClick={() => setForm({...form, tone: t})}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${form.tone === t ? 'gradient-bg text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating 3 concepts…
                </span>
              ) : '🚀 Generate Campaign Concepts'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          {result?.concepts ? (
            <div className="space-y-3">
              {result.concepts.map((concept: any, i: number) => (
                <div key={i} className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
                  <button onClick={() => setExpandedConcept(expandedConcept === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-blue font-semibold px-2 py-0.5 bg-brand-blue/10 rounded-full">Concept {i + 1}</span>
                        <h3 className="font-semibold text-white text-sm">{concept.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 italic">{concept.tagline}</p>
                    </div>
                    <span className="text-slate-400">{expandedConcept === i ? '▲' : '▼'}</span>
                  </button>
                  {expandedConcept === i && (
                    <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                      <p className="text-slate-300 text-sm">{concept.core_concept}</p>
                      {concept.content_pillars?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Content Pillars</p>
                          <div className="grid grid-cols-2 gap-2">
                            {concept.content_pillars.map((p: any, j: number) => (
                              <div key={j} className="bg-white/5 rounded-xl p-3">
                                <p className="text-white text-xs font-semibold">{p.pillar}</p>
                                <p className="text-slate-400 text-xs mt-1">{p.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {concept.kpis?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">KPIs</p>
                          <div className="flex flex-wrap gap-1.5">
                            {concept.kpis.map((k: string, j: number) => (
                              <span key={j} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">{k}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {concept.budget_allocation && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Budget Allocation</p>
                          <div className="space-y-1">
                            {Object.entries(concept.budget_allocation).map(([cat, pct]: any) => (
                              <div key={cat} className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 w-32 truncate">{cat}</span>
                                <div className="flex-1 bg-white/5 rounded-full h-2">
                                  <div className="gradient-bg h-2 rounded-full" style={{ width: pct }} />
                                </div>
                                <span className="text-xs text-slate-400 w-10 text-right">{pct}</span>
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
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <p className="text-slate-400 text-sm">Fill in the brief on the left and Claude AI will generate 3 complete campaign concepts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
