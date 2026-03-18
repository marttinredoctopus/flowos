'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const TYPES = [
  { id: 'ad_copy',        label: 'Ad Copy',         icon: '📢', desc: 'High-converting ad variations' },
  { id: 'content_ideas',  label: 'Content Ideas',   icon: '💡', desc: '10 creative post ideas' },
  { id: 'caption',        label: 'Captions',        icon: '✍️', desc: 'Engaging social captions' },
  { id: 'hashtags',       label: 'Hashtags',        icon: '#',  desc: '20 targeted hashtags' },
  { id: 'email',          label: 'Email Copy',      icon: '📧', desc: 'Full marketing email' },
  { id: 'blog_outline',   label: 'Blog Outline',    icon: '📝', desc: 'Structured article outline' },
];
const PLATFORMS = ['Instagram','Facebook','TikTok','LinkedIn','Twitter/X','YouTube','Google Ads'];
const TONES     = ['Professional','Friendly','Urgent','Inspirational','Educational','Humorous'];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} title="Copy" style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
      color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 11,
    }}>
      {copied ? <><Check size={11} style={{ color: 'var(--emerald)' }} /> Copied</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}

export default function AIGeneratorPage() {
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [type, setType]         = useState('ad_copy');
  const [form, setForm]         = useState({ brand: '', industry: '', platform: 'Instagram', tone: 'Professional', context: '' });
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<any>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  useEffect(() => {
    apiClient.get('/ai/status').then(r => setAiEnabled(r.data.ai_enabled)).catch(() => setAiEnabled(false));
  }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand.trim()) { toast.error('Enter a brand name'); return; }
    setLoading(true);
    setResult(null);
    try {
      const r = await apiClient.post('/ai/generate', { type, ...form });
      setResult(r.data);
      setExpandedItem(0);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Generation failed');
    } finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'var(--input-bg)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--indigo),var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="white" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>AI Content Generator</h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 46 }}>Generate ad copy, content ideas, captions, hashtags, emails and more</p>
      </div>

      {/* No API key banner */}
      {aiEnabled === false && (
        <div style={{
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 20,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertTriangle size={18} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)', marginBottom: 4 }}>AI not configured</p>
            <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
              Add <code style={{ background: 'var(--card)', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace' }}>ANTHROPIC_API_KEY</code> to your server .env to enable AI features.
              Get a key at <strong>console.anthropic.com</strong>
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Form */}
        <div>
          {/* Type selector */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-3)', marginBottom: 8 }}>What to generate</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TYPES.map(t => (
                <button key={t.id} type="button" onClick={() => setType(t.id)} style={{
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s',
                  background: type === t.id ? 'color-mix(in srgb, var(--indigo) 12%, transparent)' : 'var(--card)',
                  border: `1px solid ${type === t.id ? 'var(--indigo)' : 'var(--border)'}`,
                }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: type === t.id ? 'var(--indigo)' : 'var(--text)' }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={generate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Brand / Company Name *</label>
              <input style={inputStyle} value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Nike, My Agency" required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Industry</label>
              <input style={inputStyle} value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="e.g. Fashion, Real Estate, F&B" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Platform</label>
                <select style={inputStyle} value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Tone</label>
                <select style={inputStyle} value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}>
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Context / Brief (optional)</label>
              <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical', lineHeight: 1.6 }}
                value={form.context} onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
                placeholder="Any specific details, campaign goals, or product features..." />
            </div>
            <button type="submit" disabled={loading || aiEnabled === false} style={{
              padding: '12px', borderRadius: 10, border: 'none',
              background: loading || aiEnabled === false ? 'var(--border)' : 'linear-gradient(135deg,var(--indigo),var(--violet))',
              color: 'white', fontSize: 14, fontWeight: 700,
              cursor: loading || aiEnabled === false ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Generating…</>
              ) : (
                <><Sparkles size={15} /> Generate {TYPES.find(t => t.id === type)?.label}</>
              )}
            </button>
          </form>
        </div>

        {/* Right: Results */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-3)', marginBottom: 8 }}>Results</p>
          {!result && !loading && (
            <div style={{
              height: 300, borderRadius: 12, border: '2px dashed var(--border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, color: 'var(--text-3)',
            }}>
              <Sparkles size={32} />
              <p style={{ fontSize: 13 }}>Your generated content will appear here</p>
            </div>
          )}
          {loading && (
            <div style={{
              height: 300, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI is thinking…</p>
            </div>
          )}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Items list (ad_copy, captions, content_ideas, hashtags) */}
              {result.items && Array.isArray(result.items) && result.items.map((item: any, i: number) => (
                <div key={i} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 10, overflow: 'hidden',
                }}>
                  {typeof item === 'string' ? (
                    <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, flex: 1 }}>{item}</p>
                      <CopyBtn text={item} />
                    </div>
                  ) : (
                    <>
                      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedItem === i ? 'color-mix(in srgb, var(--indigo) 6%, transparent)' : 'transparent' }}
                        onClick={() => setExpandedItem(expandedItem === i ? null : i)}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.headline || `Option ${i + 1}`}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CopyBtn text={[item.headline, item.primary_text, item.cta].filter(Boolean).join('\n')} />
                          {expandedItem === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </div>
                      {expandedItem === i && (
                        <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--border)' }}>
                          {item.primary_text && <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.6 }}>{item.primary_text}</p>}
                          {item.cta && <span style={{ display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 6, background: 'var(--indigo)', color: 'white', fontSize: 11, fontWeight: 600 }}>{item.cta}</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Email result */}
              {result.subject && (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</span>
                    <CopyBtn text={`Subject: ${result.subject}\n\n${result.body}`} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Subject: {result.subject}</p>
                  {result.preview && <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>Preview: {result.preview}</p>}
                  <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result.body}</p>
                </div>
              )}

              {/* Blog outline */}
              {result.title && result.sections && (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blog Outline</span>
                    <CopyBtn text={result.title + '\n\n' + result.sections?.map((s: any) => `## ${s.heading}\n${s.points?.join('\n')}`).join('\n\n')} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{result.title}</p>
                  {result.sections?.map((s: any, i: number) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 4 }}>{s.heading}</p>
                      {s.points?.map((p: string, j: number) => (
                        <p key={j} style={{ fontSize: 11, color: 'var(--text-3)', paddingLeft: 10, lineHeight: 1.7 }}>• {p}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => { setResult(null); }} style={{
                padding: '8px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-2)',
                fontSize: 12, cursor: 'pointer',
              }}>
                Clear & Generate Again
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
