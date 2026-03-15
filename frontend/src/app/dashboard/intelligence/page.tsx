'use client';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const ANALYSIS_TYPES = ['Social Media Presence','Content Strategy','Ad Strategy','SEO Keywords','Strengths & Weaknesses','SWOT'];
const PLATFORMS = ['Instagram','Facebook','TikTok','Twitter/X','LinkedIn','YouTube','Snapchat'];

export default function IntelligencePage() {
  const [tab, setTab] = useState<'analyze' | 'history'>('analyze');
  const [form, setForm] = useState({ brandName: '', industry: '', competitors: ['', '', ''], analysisTypes: ANALYSIS_TYPES });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  async function loadHistory() {
    setHistLoading(true);
    try {
      const r = await apiClient.get('/intelligence/competitor-analyses');
      setHistory(r.data);
    } catch {} finally { setHistLoading(false); }
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const competitors = form.competitors.filter(c => c.trim());
    if (!competitors.length) { toast.error('Add at least one competitor'); return; }
    setLoading(true);
    try {
      const r = await apiClient.post('/intelligence/competitor-analysis', {
        brandName: form.brandName,
        industry: form.industry,
        competitors,
        analysisTypes: form.analysisTypes,
      });
      setResult(r.data);
      toast.success('Analysis complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally { setLoading(false); }
  }

  function toggleType(t: string) {
    setForm(f => ({
      ...f,
      analysisTypes: f.analysisTypes.includes(t) ? f.analysisTypes.filter(x => x !== t) : [...f.analysisTypes, t],
    }));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Competitor Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered competitive intelligence using Claude</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['analyze', 'history'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'history') loadHistory(); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${tab === t ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'text-slate-400 hover:text-white border border-white/5'}`}>
            {t === 'analyze' ? '🔍 New Analysis' : '📋 History'}
          </button>
        ))}
      </div>

      {tab === 'analyze' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Your Brand / Client Name *</label>
                <input required value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
                  placeholder="e.g. Acme Agency" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Industry *</label>
                <input required value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
                  placeholder="e.g. Digital Marketing Agency" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Competitors (up to 5)</label>
                {form.competitors.map((c, i) => (
                  <input key={i} value={c} onChange={e => {
                    const next = [...form.competitors]; next[i] = e.target.value; setForm({...form, competitors: next});
                  }}
                    className="w-full px-4 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 mb-2"
                    placeholder={`Competitor ${i + 1}`} />
                ))}
                {form.competitors.length < 5 && (
                  <button type="button" onClick={() => setForm({...form, competitors: [...form.competitors, '']})}
                    className="text-sm text-brand-blue hover:underline">+ Add competitor</button>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">What to Analyze</label>
                <div className="flex flex-wrap gap-2">
                  {ANALYSIS_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => toggleType(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${form.analysisTypes.includes(t) ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'}`}>
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
                    Analyzing with Claude AI…
                  </span>
                ) : '🔍 Run Analysis'}
              </button>
            </form>
          </div>

          <div>
            {result ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-brand-blue/10 to-purple-500/10 border border-brand-blue/20 rounded-2xl p-4">
                  <h3 className="font-semibold text-white mb-2">Executive Summary</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
                </div>

                {/* SWOT */}
                <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
                  <h3 className="font-semibold text-white mb-3">SWOT Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'strengths', label: 'Strengths', color: 'text-green-400 border-green-500/20 bg-green-500/5' },
                      { key: 'weaknesses', label: 'Weaknesses', color: 'text-red-400 border-red-500/20 bg-red-500/5' },
                      { key: 'opportunities', label: 'Opportunities', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
                      { key: 'threats', label: 'Threats', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
                    ].map(({ key, label, color }) => (
                      <div key={key} className={`p-3 rounded-xl border ${color}`}>
                        <p className="text-xs font-semibold mb-1">{label}</p>
                        <ul className="text-xs text-slate-400 space-y-0.5">
                          {(result.swot?.[key] || []).map((s: string, i: number) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitors */}
                {result.competitors?.map((comp: any, i: number) => (
                  <div key={i} className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
                    <h3 className="font-semibold text-white mb-3">🏢 {comp.name}</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-green-400 font-semibold mb-1">Strengths</p>
                        {comp.strengths?.map((s: string, j: number) => <p key={j} className="text-slate-400">• {s}</p>)}
                      </div>
                      <div>
                        <p className="text-red-400 font-semibold mb-1">Weaknesses</p>
                        {comp.weaknesses?.map((s: string, j: number) => <p key={j} className="text-slate-400">• {s}</p>)}
                      </div>
                    </div>
                    {comp.opportunities_against_them?.length > 0 && (
                      <div className="mt-3 p-2 bg-brand-blue/5 rounded-lg">
                        <p className="text-brand-blue text-xs font-semibold mb-1">Your Opportunities</p>
                        {comp.opportunities_against_them.map((o: string, j: number) => (
                          <p key={j} className="text-slate-400 text-xs">• {o}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
                    <h3 className="font-semibold text-white mb-3">💡 Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((r: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-300">
                          <span className="text-brand-blue mt-0.5">→</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Wins */}
                {result.quick_wins?.length > 0 && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4">
                    <h3 className="font-semibold text-green-400 mb-3">⚡ Quick Wins</h3>
                    <ul className="space-y-1">
                      {result.quick_wins.map((q: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2"><span>✓</span>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-slate-400 text-sm">Fill in the form and run your analysis to see AI-powered competitive insights here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {histLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-slate-400">No analyses yet. Run your first one!</p>
              <button onClick={() => setTab('analyze')} className="mt-4 px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white">Start Analysis</button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{h.brand_name}</p>
                    <p className="text-slate-500 text-xs">{h.industry} · {h.created_by_name} · {new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs text-slate-500">{(h.competitors || []).length} competitors</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
