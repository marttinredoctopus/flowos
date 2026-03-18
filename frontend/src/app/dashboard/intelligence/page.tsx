'use client';
import { useState } from 'react';
import { TrendingUp, Search, History, Plus, ChevronRight, Zap, Building2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const ANALYSIS_TYPES = ['Social Media Presence','Content Strategy','Ad Strategy','SEO Keywords','Strengths & Weaknesses','SWOT'];

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

  const inputCls = 'w-full px-3 py-2.5 text-sm rounded-lg input-base';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--emerald-2)' }}>
          <TrendingUp size={18} style={{ color: 'var(--emerald)' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Competitor Analysis</h1>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>AI-powered competitive intelligence using Claude</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {([['analyze', 'New Analysis', Search], ['history', 'History', History]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => { setTab(key as any); if (key === 'history') loadHistory(); }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition"
            style={{
              background: tab === key ? 'var(--indigo-2)' : 'transparent',
              color: tab === key ? 'var(--indigo)' : 'var(--text-2)',
            }}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'analyze' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="rounded-xl p-4 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Your Brand / Client Name *</label>
                <input required value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})}
                  className={inputCls} placeholder="e.g. Acme Agency" style={{ color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Industry *</label>
                <input required value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                  className={inputCls} placeholder="e.g. Digital Marketing Agency" style={{ color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Competitors (up to 5)</label>
                <div className="space-y-2">
                  {form.competitors.map((c, i) => (
                    <input key={i} value={c} onChange={e => {
                      const next = [...form.competitors]; next[i] = e.target.value; setForm({...form, competitors: next});
                    }}
                      className={inputCls} placeholder={`Competitor ${i + 1}`} style={{ color: 'var(--text)' }} />
                  ))}
                </div>
                {form.competitors.length < 5 && (
                  <button type="button" onClick={() => setForm({...form, competitors: [...form.competitors, '']})}
                    className="mt-2 text-xs flex items-center gap-1" style={{ color: 'var(--indigo)' }}>
                    <Plus size={11} /> Add competitor
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>What to Analyze</label>
              <div className="flex flex-wrap gap-2">
                {ANALYSIS_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => toggleType(t)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition"
                    style={{
                      background: form.analysisTypes.includes(t) ? 'var(--indigo-2)' : 'var(--surface)',
                      color: form.analysisTypes.includes(t) ? 'var(--indigo)' : 'var(--text-2)',
                      border: `1px solid ${form.analysisTypes.includes(t) ? 'var(--indigo)' : 'var(--border)'}`,
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
                  Analyzing with Claude AI…
                </>
              ) : (
                <><TrendingUp size={14} /> Run Analysis</>
              )}
            </button>
          </form>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Summary */}
                <div className="rounded-xl p-4" style={{ background: 'var(--indigo-2)', border: '1px solid var(--indigo)' }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--indigo)' }}>Executive Summary</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{result.summary}</p>
                </div>

                {/* SWOT */}
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>SWOT Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'strengths',    label: 'Strengths',     bg: 'var(--emerald-2)', color: 'var(--emerald)' },
                      { key: 'weaknesses',   label: 'Weaknesses',    bg: 'var(--rose-2)',    color: 'var(--rose)' },
                      { key: 'opportunities',label: 'Opportunities', bg: 'var(--cyan-2)',    color: 'var(--cyan)' },
                      { key: 'threats',      label: 'Threats',       bg: 'var(--amber-2)',   color: 'var(--amber)' },
                    ].map(({ key, label, bg, color }) => (
                      <div key={key} className="p-3 rounded-lg" style={{ background: bg }}>
                        <p className="text-xs font-semibold mb-1" style={{ color }}>{label}</p>
                        <ul className="text-xs space-y-0.5" style={{ color: 'var(--text-2)' }}>
                          {(result.swot?.[key] || []).map((s: string, i: number) => <li key={i}>• {s}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitors */}
                {result.competitors?.map((comp: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <Building2 size={14} style={{ color: 'var(--text-2)' }} />{comp.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-semibold mb-1" style={{ color: 'var(--emerald)' }}>Strengths</p>
                        {comp.strengths?.map((s: string, j: number) => <p key={j} style={{ color: 'var(--text-2)' }}>• {s}</p>)}
                      </div>
                      <div>
                        <p className="font-semibold mb-1" style={{ color: 'var(--rose)' }}>Weaknesses</p>
                        {comp.weaknesses?.map((s: string, j: number) => <p key={j} style={{ color: 'var(--text-2)' }}>• {s}</p>)}
                      </div>
                    </div>
                    {comp.opportunities_against_them?.length > 0 && (
                      <div className="mt-3 p-2 rounded-lg" style={{ background: 'var(--cyan-2)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--cyan)' }}>Your Opportunities</p>
                        {comp.opportunities_against_them.map((o: string, j: number) => (
                          <p key={j} className="text-xs" style={{ color: 'var(--text-2)' }}>• {o}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((r: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                          <ChevronRight size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--indigo)' }} />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Wins */}
                {result.quick_wins?.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: 'var(--emerald-2)', border: '1px solid var(--emerald)' }}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--emerald)' }}>
                      <Zap size={14} /> Quick Wins
                    </h3>
                    <ul className="space-y-1">
                      {result.quick_wins.map((q: string, i: number) => (
                        <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}>
                          <span style={{ color: 'var(--emerald)' }}>✓</span>{q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full min-h-64 flex items-center justify-center rounded-xl border-2 border-dashed p-8" style={{ borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <TrendingUp size={40} className="mx-auto mb-4" style={{ color: 'var(--text-3)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-2)' }}>Fill in the form and run your analysis to see AI-powered competitive insights here</p>
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
              {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl animate-shimmer" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
              <History size={40} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
              <p style={{ color: 'var(--text-2)' }}>No analyses yet. Run your first one!</p>
              <button onClick={() => setTab('analyze')} className="mt-4 px-4 h-9 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--grad-primary)' }}>
                Start Analysis
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{h.brand_name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
                      {h.industry} · {h.created_by_name} · {new Date(h.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--indigo-2)', color: 'var(--indigo)' }}>
                    {(h.competitors || []).length} competitors
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
