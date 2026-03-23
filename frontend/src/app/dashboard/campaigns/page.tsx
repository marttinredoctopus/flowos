'use client';
import { useEffect, useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Existing campaign types ──────────────────────────────────────────────────
const STATUS_C: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  planned: 'bg-yellow-500/20 text-yellow-400',
  draft: 'bg-white/10 text-slate-400',
  completed: 'bg-blue-500/20 text-blue-400',
  paused: 'bg-red-500/20 text-red-400',
};
const PLATFORMS = ['Meta', 'Google', 'TikTok', 'Snapchat', 'Twitter/X', 'LinkedIn', 'YouTube'];
const EMPTY = { name: '', platform: 'Meta', status: 'draft', budget: '', startDate: '', endDate: '' };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtNum(n: any): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function getDateRange(range: string): { start: string; end: string } {
  const end   = new Date();
  const start = new Date();
  if      (range === 'last_7_days')  start.setDate(end.getDate() - 7);
  else if (range === 'last_30_days') start.setDate(end.getDate() - 30);
  else if (range === 'last_90_days') start.setDate(end.getDate() - 90);
  else if (range === 'this_month')   start.setDate(1);
  else if (range === 'last_month')   { start.setMonth(start.getMonth() - 1); start.setDate(1); end.setDate(0); }
  return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
}

const DATE_RANGES = [
  { id: 'last_7_days',  label: '7d'  },
  { id: 'last_30_days', label: '30d' },
  { id: 'last_90_days', label: '90d' },
  { id: 'this_month',   label: 'This month' },
  { id: 'last_month',   label: 'Last month' },
];

const METRIC_COLORS: Record<string, string> = {
  spend: '#2563eb', roas: '#10b981', clicks: '#8b5cf6', impressions: '#f59e0b',
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    ACTIVE:   ['#10b981', 'Active'],
    PAUSED:   ['#f59e0b', 'Paused'],
    DELETED:  ['#ef4444', 'Deleted'],
    ARCHIVED: ['#6b7280', 'Archived'],
  };
  const [color, label] = map[status] || ['#6b7280', status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: status === 'ACTIVE' ? `0 0 6px ${color}` : 'none' }} />
      {label}
    </span>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = 28, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 72, height: 72 }}>
      <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontSize: 18, fontWeight: 800, color }}>{score}</span>
      </div>
    </div>
  );
}

// ─── AI Report Modal ──────────────────────────────────────────────────────────
function AIReportModal({ campaign, report, onClose }: { campaign: any; report: any; onClose: () => void }) {
  const STATUS_COLOR: Record<string, string> = { good: '#10b981', warning: '#f59e0b', poor: '#ef4444', critical: '#ef4444' };
  const IMPACT_BG: Record<string, string>   = { high: 'rgba(16,185,129,0.12)', medium: 'rgba(245,158,11,0.12)', low: 'rgba(107,114,128,0.12)' };
  const IMPACT_C: Record<string, string>    = { high: '#10b981', medium: '#f59e0b', low: '#6b7280' };
  const PRIORITY_C: Record<string, string>  = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };

  const gradeColor = report.overall_score >= 80 ? '#10b981' : report.overall_score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }}>
      <div style={{ background: '#0d0e14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, width: '100%', maxWidth: 780, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ScoreRing score={report.overall_score} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>AI Campaign Analysis</h2>
                <span style={{ fontSize: 22, fontWeight: 900, color: gradeColor }}>{report.overall_grade}</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{campaign.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {/* Summary */}
        <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{report.summary}</p>
        </div>

        {/* Performance Breakdown */}
        <h3 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Performance Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 10, marginBottom: 20 }}>
          {report.performance_breakdown && Object.entries(report.performance_breakdown).map(([key, val]: [string, any]) => (
            <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{key}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[val.status] || '#6b7280', background: `${STATUS_COLOR[val.status] || '#6b7280'}18`, padding: '2px 8px', borderRadius: 20 }}>{val.status}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: STATUS_COLOR[val.status] || '#fff', marginBottom: 4 }}>{val.score}</div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>{val.insight}</p>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: '14px 16px' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Strengths</h4>
            {(report.strengths || []).map((s: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                <span style={{ color: '#10b981', fontSize: 12, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '14px 16px' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Weaknesses</h4>
            {(report.weaknesses || []).map((w: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                <span style={{ color: '#ef4444', fontSize: 12, flexShrink: 0 }}>✗</span>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>{w}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Wins */}
        {report.quick_wins?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Quick Wins</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.quick_wins.map((w: any, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: IMPACT_C[w.impact] || '#6b7280', background: IMPACT_BG[w.impact] || 'transparent', padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase' }}>{w.impact} impact</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{w.effort}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{w.action}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{w.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.recommendations.map((r: any, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_C[r.priority] || '#6b7280', flexShrink: 0, marginTop: 6 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 3px 0' }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predicted Improvement */}
        {report.predicted_improvement && (
          <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'ROAS Increase',       value: report.predicted_improvement.roas_increase },
              { label: 'Cost Reduction',       value: report.predicted_improvement.cost_reduction },
              { label: 'Conversion Increase',  value: report.predicted_improvement.conversion_increase },
            ].map(item => item.value ? (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#a78bfa', margin: '0 0 4px 0' }}>{item.value}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{item.label}</p>
              </div>
            ) : null)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ accounts, onClose, onCreated }: { accounts: any[]; onClose: () => void; onCreated: (s: any) => void }) {
  const [title, setTitle]       = useState('Campaign Report');
  const [dateRange, setRange]   = useState('last_30_days');
  const [password, setPassword] = useState('');
  const [days, setDays]         = useState('');
  const [saving, setSaving]     = useState(false);
  const [result, setResult]     = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await apiClient.post('/meta-ads/share', {
        title, date_range: dateRange,
        password: password || undefined,
        expires_days: days ? Number(days) : undefined,
      });
      setResult(r.data.data.url);
      onCreated(r.data.data);
    } catch {
      toast.error('Failed to create share link');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">Share Report with Client</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>
        {result ? (
          <div>
            <p className="text-sm text-slate-400 mb-3">Share this link with your client:</p>
            <div className="flex gap-2">
              <input readOnly value={result} className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none" />
              <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }} className="px-4 py-2.5 bg-blue-600 rounded-xl text-white text-sm font-semibold hover:bg-blue-700 transition">Copy</button>
            </div>
            <button onClick={onClose} className="w-full mt-4 py-2.5 border border-white/10 rounded-xl text-slate-400 hover:text-white text-sm transition">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Report title" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50" />
            <select value={dateRange} onChange={e => setRange(e.target.value)} className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
              {DATE_RANGES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password protect (optional)" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" />
            <input value={days} onChange={e => setDays(e.target.value)} type="number" placeholder="Expires in N days (optional)" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" />
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-slate-400 text-sm hover:text-white transition">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">{saving ? 'Creating...' : 'Create Link'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function CampaignsPage() {
  const [tab, setTab] = useState<'campaigns' | 'accounts' | 'competitor' | 'meta'>('campaigns');

  // ── Existing campaign state ──
  const [campaigns, setCampaigns]   = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [insightsModal, setInsightsModal] = useState<any | null>(null);
  const [insights, setInsights]     = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [accountForm, setAccountForm] = useState({ platform: 'Meta', accountId: '', accessToken: '' });
  const [savingAccount, setSavingAccount] = useState(false);
  const [compForm, setCompForm]     = useState({ industry: '', competitors: '', platform: 'Meta' });
  const [compResult, setCompResult] = useState('');
  const [loadingComp, setLoadingComp] = useState(false);

  // ── Meta Ads AI state ──
  const [analyzing, setAnalyzing]         = useState<string | null>(null);
  const [aiReport, setAiReport]           = useState<any | null>(null);
  const [aiCampaign, setAiCampaign]       = useState<any | null>(null);

  // ── Meta Ads state ──
  const [metaAccounts, setMetaAccounts]   = useState<any[]>([]);
  const [metaCampaigns, setMetaCampaigns] = useState<any[]>([]);
  const [chartData, setChartData]         = useState<any[]>([]);
  const [summary, setSummary]             = useState<any>(null);
  const [metaLoading, setMetaLoading]     = useState(true);
  const [connecting, setConnecting]       = useState(false);
  const [dateRange, setDateRange]         = useState('last_30_days');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [activeMetric, setActiveMetric]   = useState<'spend' | 'roas' | 'clicks' | 'impressions'>('spend');
  const [sortBy, setSortBy]               = useState('spend');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shares, setShares]               = useState<any[]>([]);

  // ── Load existing campaigns on mount ──
  useEffect(() => {
    load();
    loadAdAccounts();
    loadMetaAccounts();

    const params = new URLSearchParams(window.location.search);
    if (params.get('meta_connected') === 'true') {
      window.history.replaceState({}, '', '/dashboard/campaigns');
      toast.success('Meta Ads connected! Syncing data...');
      setTab('meta');
      setTimeout(() => loadMetaAll(), 3000);
    } else if (params.get('meta_error')) {
      window.history.replaceState({}, '', '/dashboard/campaigns');
      toast.error('Meta connection failed. Please try again.');
    }
  }, []);

  useEffect(() => {
    if (tab === 'meta' && metaAccounts.length > 0) loadMetaAll();
  }, [dateRange, selectedAccount, tab]);

  // ── Existing functions ──
  async function load() {
    try { const r = await apiClient.get('/campaigns'); setCampaigns(r.data || []); }
    catch {} finally { setLoading(false); }
  }
  async function loadAdAccounts() {
    try { const r = await apiClient.get('/ai/ad-accounts'); setAdAccounts(r.data || []); }
    catch {}
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.platform) return;
    setSaving(true);
    try {
      await apiClient.post('/campaigns', { ...form, budget: form.budget ? parseFloat(form.budget) : undefined });
      setShowModal(false); setForm(EMPTY); load();
    } catch {} finally { setSaving(false); }
  }
  async function remove(id: string) {
    await apiClient.delete(`/campaigns/${id}`);
    setCampaigns(c => c.filter(x => x.id !== id));
  }
  async function openInsights(c: any) {
    setInsightsModal(c); setInsights(''); setLoadingInsights(true);
    try {
      const r = await apiClient.post(`/ai/campaign-insights/${c.id}`);
      setInsights(r.data.insights);
    } catch { setInsights('Failed to analyze. Check GEMINI_API_KEY.'); }
    finally { setLoadingInsights(false); }
  }
  async function saveAccount(e: React.FormEvent) {
    e.preventDefault(); setSavingAccount(true);
    try {
      await apiClient.post('/ai/ad-accounts', accountForm);
      toast.success('Ad account connected!');
      setAccountForm({ platform: 'Meta', accountId: '', accessToken: '' });
      loadAdAccounts();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSavingAccount(false); }
  }
  async function analyzeCompetitors(e: React.FormEvent) {
    e.preventDefault();
    if (!compForm.industry || !compForm.competitors) return;
    setLoadingComp(true); setCompResult('');
    try {
      const r = await apiClient.post('/ai/competitor-analysis', {
        industry: compForm.industry,
        competitors: compForm.competitors.split(',').map(s => s.trim()).filter(Boolean),
        platform: compForm.platform,
      });
      setCompResult(r.data.analysis);
    } catch { setCompResult('Analysis failed. Check GEMINI_API_KEY.'); }
    finally { setLoadingComp(false); }
  }

  // ── Meta Ads functions ──
  async function loadMetaAccounts() {
    try {
      const r = await apiClient.get('/meta-ads/accounts');
      setMetaAccounts(r.data?.data?.accounts || []);
      const s = await apiClient.get('/meta-ads/shares');
      setShares(s.data?.data?.shares || []);
    } catch {}
    finally { setMetaLoading(false); }
  }

  const loadMetaAll = useCallback(async () => {
    const dates = getDateRange(dateRange);
    const acctQ = selectedAccount !== 'all' ? `&account_id=${selectedAccount}` : '';
    try {
      const [campR, chartR] = await Promise.all([
        apiClient.get(`/meta-ads/campaigns?date_start=${dates.start}&date_end=${dates.end}${acctQ}`),
        apiClient.get(`/meta-ads/chart?date_start=${dates.start}&date_end=${dates.end}${acctQ}`),
      ]);
      setMetaCampaigns(campR.data?.data?.campaigns || []);
      setSummary(campR.data?.data?.summary || null);
      setChartData(chartR.data?.data?.chart || []);
    } catch {}
  }, [dateRange, selectedAccount]);

  async function connectMeta() {
    setConnecting(true);
    try {
      const r = await apiClient.get('/meta-ads/connect');
      window.location.href = r.data.data.url;
    } catch { setConnecting(false); toast.error('Failed to start Meta connection'); }
  }

  async function manualSync() {
    await apiClient.post('/meta-ads/sync', {});
    toast.success('Sync started — data will update in a moment');
    setTimeout(loadMetaAll, 4000);
  }

  async function analyzeCampaign(c: any) {
    setAnalyzing(c.id);
    try {
      const dates = getDateRange(dateRange);
      const r = await apiClient.post(`/meta-ads/campaigns/${c.id}/analyze`, {
        date_start: dates.start,
        date_end:   dates.end,
      });
      setAiCampaign(c);
      setAiReport(r.data.data.report);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setAnalyzing(null);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  const TABS = [
    ['campaigns',  'Campaigns'],
    ['accounts',   'Ad Accounts'],
    ['competitor', 'Competitor AI'],
    ['meta',       '📊 Meta Ads Live'],
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Ad Campaigns</h1>
          <p className="text-slate-400 text-sm mt-1">
            {tab === 'meta' ? `${metaAccounts.length} Meta account${metaAccounts.length !== 1 ? 's' : ''} connected` : `${campaigns.length} campaigns`}
          </p>
        </div>
        {tab === 'campaigns' && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ New Campaign</button>
        )}
        {tab === 'meta' && metaAccounts.length > 0 && (
          <div className="flex gap-2">
            <button onClick={manualSync} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">🔄 Sync</button>
            <button onClick={() => setShowShareModal(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90">🔗 Share Report</button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6 w-fit gap-0.5">
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as any)} className={`px-4 py-2 rounded-lg text-sm transition ${tab === key ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      {/* ── Existing: Campaigns ── */}
      {tab === 'campaigns' && (
        loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
            <div className="text-5xl mb-4">📢</div>
            <p className="text-slate-400 mb-4">No campaigns yet</p>
            <button onClick={() => setShowModal(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Create Campaign</button>
          </div>
        ) : (
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 px-5 py-3 border-b border-white/5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {['Campaign','Platform','Budget','Impressions','Clicks','Status','AI'].map(h => <div key={h}>{h}</div>)}
            </div>
            {campaigns.map((c, i) => (
              <div key={c.id} className={`grid grid-cols-7 items-center px-5 py-4 hover:bg-white/5 transition group ${i ? 'border-t border-white/5' : ''}`}>
                <p className="text-sm font-medium text-white truncate pr-4">{c.name}</p>
                <p className="text-sm text-slate-400">{c.platform}</p>
                <p className="text-sm text-white font-mono">{c.budget ? `$${Number(c.budget).toLocaleString()}` : '—'}</p>
                <p className="text-sm text-slate-400">{c.impressions ? Number(c.impressions).toLocaleString() : '—'}</p>
                <p className="text-sm text-slate-400">{c.clicks ? Number(c.clicks).toLocaleString() : '—'}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full w-fit font-medium ${STATUS_C[c.status] || STATUS_C.draft}`}>{c.status}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => openInsights(c)} className="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition">✨ Insights</button>
                  <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Existing: Ad Accounts ── */}
      {tab === 'accounts' && (
        <div className="space-y-6">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Connect Ad Account</h3>
            <form onSubmit={saveAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={accountForm.platform} onChange={e => setAccountForm({...accountForm, platform: e.target.value})}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
                <input required className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Account ID / Customer ID" value={accountForm.accountId} onChange={e => setAccountForm({...accountForm, accountId: e.target.value})} />
                <input className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Access Token (optional)" type="password" value={accountForm.accessToken} onChange={e => setAccountForm({...accountForm, accessToken: e.target.value})} />
              </div>
              <button type="submit" disabled={savingAccount} className="px-6 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{savingAccount ? 'Connecting...' : 'Connect Account'}</button>
            </form>
          </div>
          {adAccounts.length > 0 && (
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 text-xs text-slate-500 font-semibold uppercase tracking-wider">Connected Accounts</div>
              {adAccounts.map((a, i) => (
                <div key={a.id} className={`flex items-center justify-between px-5 py-4 ${i ? 'border-t border-white/5' : ''}`}>
                  <div>
                    <p className="text-sm font-semibold text-white">{a.platform}</p>
                    <p className="text-xs text-slate-500 font-mono">{a.account_id}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full">Connected</span>
                </div>
              ))}
            </div>
          )}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
            <p className="text-xs text-blue-400 leading-relaxed">💡 For <strong>live Meta Ads data</strong> with real ROAS, clicks, and spend — use the <strong>Meta Ads Live</strong> tab to connect via OAuth.</p>
          </div>
        </div>
      )}

      {/* ── Existing: Competitor Analysis ── */}
      {tab === 'competitor' && (
        <div className="space-y-6">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Competitor Analysis</h3>
            <p className="text-sm text-slate-400 mb-5">Powered by Gemini AI</p>
            <form onSubmit={analyzeCompetitors} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Your industry (e.g. Fashion, SaaS)" value={compForm.industry} onChange={e => setCompForm({...compForm, industry: e.target.value})} />
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Competitors (comma-separated)" value={compForm.competitors} onChange={e => setCompForm({...compForm, competitors: e.target.value})} />
              <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={compForm.platform} onChange={e => setCompForm({...compForm, platform: e.target.value})}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <button type="submit" disabled={loadingComp} className="w-full py-3 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{loadingComp ? 'Analyzing...' : '✨ Analyze Competitors'}</button>
            </form>
          </div>
          {compResult && (
            <div className="bg-[#0f1117] border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4"><span className="text-purple-400 text-lg">✨</span><h3 className="font-semibold text-white">Gemini AI Analysis</h3></div>
              <div className="text-sm text-slate-300 leading-loose whitespace-pre-wrap" dir="auto">{compResult}</div>
            </div>
          )}
        </div>
      )}

      {/* ══ META ADS LIVE TAB ═══════════════════════════════════════════════════ */}
      {tab === 'meta' && (
        metaLoading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : metaAccounts.length === 0 ? (
          /* Connect screen */
          <div className="max-w-xl mx-auto text-center py-12">
            <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg,#1877F2,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32, boxShadow: '0 8px 32px rgba(24,119,242,0.3)' }}>📊</div>
            <h2 className="font-display text-2xl font-black text-white mb-3">Connect Meta Ads</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Connect your Meta Ads account to see live ROAS, spend, CTR and share beautiful reports with clients.</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: '📈', t: 'Live Performance', d: 'Real-time ROAS, CTR, CPC' },
                { icon: '🔄', t: 'Auto Sync',        d: 'Updates every 6 hours'    },
                { icon: '🔗', t: 'Client Reports',   d: 'Share with one link'      },
              ].map(f => (
                <div key={f.t} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-xs font-bold text-white mb-1">{f.t}</div>
                  <div className="text-xs text-slate-500">{f.d}</div>
                </div>
              ))}
            </div>
            <button onClick={connectMeta} disabled={connecting} style={{ padding: '13px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#1877F2,#0ea5e9)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(24,119,242,0.35)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {connecting ? 'Redirecting to Facebook...' : 'Connect Meta Ads Account'}
            </button>
            <p className="text-xs text-slate-600 mt-3">You'll be redirected to Facebook to authorize read access</p>
          </div>
        ) : (
          /* Main Meta Ads Dashboard */
          <div>
            {/* Filters row */}
            <div className="flex flex-wrap gap-3 mb-5">
              <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                <option value="all">All accounts</option>
                {metaAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.account_name}</option>)}
              </select>
              <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {DATE_RANGES.map(r => (
                  <button key={r.id} onClick={() => setDateRange(r.id)} className={`px-3 py-2 text-xs transition border-0 ${dateRange === r.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>{r.label}</button>
                ))}
              </div>
              <button onClick={connectMeta} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white transition">+ Add account</button>
            </div>

            {/* KPI cards */}
            {summary && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                {[
                  { l: 'Spend',       v: `$${Number(summary.total_spend).toFixed(0)}`,        c: '#2563eb' },
                  { l: 'Revenue',     v: `$${Number(summary.total_revenue).toFixed(0)}`,      c: '#10b981' },
                  { l: 'ROAS',        v: `${Number(summary.avg_roas).toFixed(2)}x`,           c: '#22c55e' },
                  { l: 'Impressions', v: fmtNum(summary.total_impressions),                   c: '#8b5cf6' },
                  { l: 'Clicks',      v: fmtNum(summary.total_clicks),                        c: '#f59e0b' },
                  { l: 'CTR',         v: `${Number(summary.avg_ctr).toFixed(2)}%`,            c: '#0ea5e9' },
                ].map(card => (
                  <div key={card.l} style={{ background: `${card.c}10`, border: `1px solid ${card.c}22`, borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: card.c, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>{card.l}</div>
                    <div className="font-display text-2xl font-black text-white">{card.v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm">Performance Over Time</h3>
                  <div className="flex gap-1">
                    {(['spend','roas','clicks','impressions'] as const).map(m => (
                      <button key={m} onClick={() => setActiveMetric(m)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: activeMetric === m ? `${METRIC_COLORS[m]}22` : 'transparent', color: activeMetric === m ? METRIC_COLORS[m] : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: activeMetric === m ? 700 : 400, cursor: 'pointer', textTransform: 'capitalize' }}>{m}</button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="mgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={METRIC_COLORS[activeMetric]} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={METRIC_COLORS[activeMetric]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={v => activeMetric === 'spend' ? `$${v}` : activeMetric === 'roas' ? `${v}x` : fmtNum(v)} />
                    <Tooltip contentStyle={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.4)' }} itemStyle={{ color: METRIC_COLORS[activeMetric] }} formatter={(val: any) => [activeMetric === 'spend' ? `$${Number(val).toFixed(2)}` : activeMetric === 'roas' ? `${Number(val).toFixed(2)}x` : fmtNum(val), activeMetric.toUpperCase()]} />
                    <Area type="monotone" dataKey={activeMetric} stroke={METRIC_COLORS[activeMetric]} strokeWidth={2.5} fill="url(#mgGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Campaigns table */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden mb-6">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">Campaigns ({metaCampaigns.length})</h3>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs focus:outline-none">
                  <option value="spend">Sort: Spend</option>
                  <option value="roas">Sort: ROAS</option>
                  <option value="clicks">Sort: Clicks</option>
                  <option value="impressions">Sort: Impressions</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Campaign','Status','Spend','Revenue','ROAS','Impr.','Clicks','CTR','CPC','AI'].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...metaCampaigns].sort((a, b) => Number(b[sortBy]) - Number(a[sortBy])).map(c => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'white', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                          {c.objective && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.objective}</div>}
                        </td>
                        <td style={{ padding: '11px 14px' }}><StatusBadge status={c.status} /></td>
                        <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: 'white' }}>${Number(c.spend).toFixed(2)}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: Number(c.revenue) > 0 ? '#10b981' : 'rgba(255,255,255,0.3)', fontWeight: Number(c.revenue) > 0 ? 700 : 400 }}>${Number(c.revenue).toFixed(2)}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: Number(c.roas) >= 2 ? '#10b981' : Number(c.roas) >= 1 ? '#f59e0b' : Number(c.roas) > 0 ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>{Number(c.roas) > 0 ? `${Number(c.roas).toFixed(2)}x` : '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{fmtNum(c.impressions)}</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{fmtNum(c.clicks)}</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{Number(c.ctr).toFixed(2)}%</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>${Number(c.cpc).toFixed(2)}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <button
                            onClick={() => analyzeCampaign(c)}
                            disabled={analyzing === c.id}
                            style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: analyzing === c.id ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: 11, fontWeight: 700, cursor: analyzing === c.id ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                          >
                            {analyzing === c.id ? '...' : '✨ Analyze'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {metaCampaigns.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No campaign data yet — sync may be in progress</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Share links list */}
            {shares.length > 0 && (
              <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 text-xs text-slate-500 font-bold uppercase tracking-wider">Active Report Links</div>
                {shares.filter(s => s.is_active).map((s, i) => (
                  <div key={s.id} className={`flex items-center justify-between px-5 py-3 ${i ? 'border-t border-white/5' : ''}`}>
                    <div>
                      <p className="text-sm font-semibold text-white">{s.title}</p>
                      <p className="text-xs text-slate-500">{s.client_name ? `Client: ${s.client_name} · ` : ''}{s.views} views · {s.date_range}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/reports/${s.token}`); toast.success('Copied!'); }} className="text-xs px-2.5 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">Copy link</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {/* ── Existing modals ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">New Campaign</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Campaign name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Budget ($)" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {Object.keys(STATUS_C).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500 mb-1 block">Start</label><input type="date" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">End</label><input type="date" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {insightsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-white">✨ AI Campaign Insights</h2>
                <p className="text-slate-400 text-sm">{insightsModal.name} · {insightsModal.platform}</p>
              </div>
              <button onClick={() => setInsightsModal(null)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Budget',      value: insightsModal.budget ? `$${Number(insightsModal.budget).toLocaleString()}` : '—' },
                { label: 'Impressions', value: insightsModal.impressions ? Number(insightsModal.impressions).toLocaleString() : '0' },
                { label: 'Clicks',      value: insightsModal.clicks ? Number(insightsModal.clicks).toLocaleString() : '0' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {loadingInsights ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center"><div className="text-3xl mb-3 animate-pulse">✨</div><p className="text-slate-400 text-sm">Analyzing...</p></div>
              </div>
            ) : (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-loose whitespace-pre-wrap" dir="auto">{insights}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
          accounts={metaAccounts}
          onClose={() => setShowShareModal(false)}
          onCreated={s => setShares(prev => [s, ...prev])}
        />
      )}

      {aiReport && aiCampaign && (
        <AIReportModal
          campaign={aiCampaign}
          report={aiReport}
          onClose={() => { setAiReport(null); setAiCampaign(null); }}
        />
      )}
    </div>
  );
}
