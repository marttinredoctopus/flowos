'use client';
import { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, Copy, Check, Zap, Target, Lightbulb, MessageSquare, Hash } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const INPUT  = 'w-full px-4 py-3 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500/50';
const BTN    = 'px-6 py-3 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50';
const TONES  = ['Professional', 'Casual', 'Urgent', 'Inspiring', 'Fun', 'Authoritative'];
const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Google Ads', 'YouTube', 'Twitter/X'];

interface CampaignResult {
  strategy:        string;
  ads:             string[];
  hooks:           string[];
  ideas:           string[];
  hashtags:        string[];
  cta_options:     string[];
  target_insights: string;
  meta:            { brand: string; product: string; audience: string };
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button onClick={copy} title="Copy" className="p-1.5 rounded-lg transition hover:bg-white/10 text-slate-400 hover:text-white flex-shrink-0">
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

function ResultCard({ icon: Icon, color, title, items }: { icon: any; color: string; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
          <Icon size={16} style={{ color }} />
        </span>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl group" style={{ background: 'var(--surface)' }}>
            <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: color + '33', color }}>{i + 1}</span>
            <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item}</p>
            <CopyBtn text={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CampaignBuilderPage() {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<CampaignResult | null>(null);
  const [form, setForm]       = useState({
    brand: '', product: '', audience: '',
    tone: 'Professional', platforms: [] as string[], budget: '',
  });

  function togglePlatform(p: string) {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter(x => x !== p)
        : [...f.platforms, p],
    }));
  }

  async function generate() {
    if (!form.brand.trim() || !form.product.trim() || !form.audience.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.post('/ai/campaign', form);
      setResult(data);
      setStep(3);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to generate campaign';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!result) return;
    const text = [
      `🎯 Campaign for ${result.meta.brand}`,
      `\n📌 Strategy:\n${result.strategy}`,
      `\n📣 Ad Copies:\n${result.ads.map((a, i) => `${i+1}. ${a}`).join('\n')}`,
      `\n🪝 Hooks:\n${result.hooks.map((h, i) => `${i+1}. ${h}`).join('\n')}`,
      `\n💡 Content Ideas:\n${result.ideas.map((d, i) => `${i+1}. ${d}`).join('\n')}`,
      `\n#️⃣ Hashtags:\n${result.hashtags.join(' ')}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Campaign copied to clipboard!');
  }

  const steps = [
    { label: 'Brand', icon: '🏷️' },
    { label: 'Details', icon: '🎯' },
    { label: 'Audience', icon: '👥' },
  ];

  if (result && step === 3) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold gradient-text">Campaign Ready 🚀</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Generated for <strong style={{ color: 'var(--text)' }}>{result.meta.brand}</strong> — {result.meta.product}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2.5 text-sm border rounded-xl transition hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <Copy size={14} /> Copy All
            </button>
            <button onClick={() => { setResult(null); setStep(0); setForm({ brand:'', product:'', audience:'', tone:'Professional', platforms:[], budget:'' }); }}
              className={BTN}>
              <span className="flex items-center gap-2"><Sparkles size={14} /> New Campaign</span>
            </button>
          </div>
        </div>

        {/* Strategy Banner */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, rgba(124,111,224,0.12), rgba(74,158,255,0.12))', border: '1px solid rgba(124,111,224,0.2)' }}>
          <div className="flex items-start gap-3">
            <Zap size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--violet)' }} />
            <div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Campaign Strategy</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.strategy}</p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ResultCard icon={MessageSquare} color="var(--blue)"   title="Ad Copies"     items={result.ads} />
          <ResultCard icon={Zap}           color="var(--violet)" title="Scroll Hooks"  items={result.hooks} />
          <ResultCard icon={Lightbulb}     color="var(--amber)"  title="Content Ideas" items={result.ideas} />
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <Hash size={16} style={{ color: 'var(--emerald)' }} />
                </span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Hashtags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer"
                    style={{ background: 'rgba(74,158,255,0.1)', color: 'var(--blue)' }}
                    onClick={() => navigator.clipboard.writeText(tag)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,83,80,0.15)' }}>
                  <Target size={16} style={{ color: 'var(--red)' }} />
                </span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>CTA Options</h3>
              </div>
              <div className="space-y-2">
                {result.cta_options?.map((cta, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'var(--surface)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{cta}</span>
                    <CopyBtn text={cta} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Target Insight */}
        {result.target_insights && (
          <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span>🧠</span>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Audience Insight</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.target_insights}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
          <Sparkles size={24} className="text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold gradient-text mb-2">AI Campaign Builder</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          3 steps to a complete marketing campaign
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                i < step ? 'gradient-bg' : i === step ? 'ring-2 ring-violet-500' : ''
              }`} style={{ background: i < step ? undefined : i === step ? 'var(--card)' : 'var(--surface)' }}>
                {i < step ? '✓' : s.icon}
              </div>
              <span className="text-xs font-medium" style={{ color: i === step ? 'var(--text)' : 'var(--text-dim)' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-16 h-px mx-2 mb-5" style={{ background: i < step ? 'var(--violet)' : 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>What's your brand? 🏷️</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Tell us who you are</p>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-dim)' }}>Brand Name *</label>
              <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="e.g. Nike, Apple, Your Brand..."
                value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} autoFocus />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-dim)' }}>Product / Service *</label>
              <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="e.g. Running shoes, SaaS platform, Coffee shop..."
                value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Campaign Details 🎯</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Set the tone and platforms</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-dim)' }}>Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, tone: t }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${form.tone === t ? 'gradient-bg text-white' : 'hover:bg-white/5'}`}
                    style={{ background: form.tone === t ? undefined : 'var(--surface)', color: form.tone === t ? 'white' : 'var(--text-muted)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-dim)' }}>Platforms (optional)</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${form.platforms.includes(p) ? 'ring-1 ring-violet-500' : 'hover:bg-white/5'}`}
                    style={{ background: form.platforms.includes(p) ? 'rgba(124,111,224,0.15)' : 'var(--surface)', color: form.platforms.includes(p) ? 'var(--violet)' : 'var(--text-muted)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-dim)' }}>Budget (optional)</label>
              <input className={INPUT} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="e.g. $5K/month, $50K total..."
                value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Who's your audience? 👥</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>The more specific, the better results</p>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-dim)' }}>Target Audience *</label>
              <textarea className={INPUT + ' min-h-[120px] resize-none'} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="e.g. Women 25-40 in the US interested in fitness and healthy living, income $60K+..."
                value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} />
            </div>
            {/* Summary */}
            <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>Campaign Summary</p>
              <div className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div><strong style={{ color: 'var(--text)' }}>Brand:</strong> {form.brand}</div>
                <div><strong style={{ color: 'var(--text)' }}>Product:</strong> {form.product}</div>
                <div><strong style={{ color: 'var(--text)' }}>Tone:</strong> {form.tone}</div>
                {form.platforms.length > 0 && <div><strong style={{ color: 'var(--text)' }}>Platforms:</strong> {form.platforms.join(', ')}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm border transition hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < 2 ? (
            <button onClick={() => {
              if (step === 0 && (!form.brand.trim() || !form.product.trim())) { toast.error('Fill in brand and product'); return; }
              setStep(s => s + 1);
            }} className={BTN + ' flex-1 flex items-center justify-center gap-2'}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={generate} disabled={loading || !form.audience.trim()} className={BTN + ' flex-1 flex items-center justify-center gap-2'}>
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Generating...</>
              ) : (
                <><Sparkles size={16} /> Generate Campaign</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
