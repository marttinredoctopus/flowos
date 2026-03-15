'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const STATUS_C: Record<string,string> = {
  active: 'bg-green-500/20 text-green-400',
  planned: 'bg-yellow-500/20 text-yellow-400',
  draft: 'bg-white/10 text-slate-400',
  completed: 'bg-blue-500/20 text-blue-400',
  paused: 'bg-red-500/20 text-red-400',
};
const PLATFORMS = ['Meta', 'Google', 'TikTok', 'Snapchat', 'Twitter/X', 'LinkedIn', 'YouTube'];
const EMPTY = { name: '', platform: 'Meta', status: 'draft', budget: '', startDate: '', endDate: '' };

export default function CampaignsPage() {
  const [tab, setTab] = useState<'campaigns' | 'accounts' | 'competitor'>('campaigns');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  // AI Insights
  const [insightsModal, setInsightsModal] = useState<any | null>(null);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Ad accounts
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [accountForm, setAccountForm] = useState({ platform: 'Meta', accountId: '', accessToken: '' });
  const [savingAccount, setSavingAccount] = useState(false);

  // Competitor analysis
  const [compForm, setCompForm] = useState({ industry: '', competitors: '', platform: 'Meta' });
  const [compResult, setCompResult] = useState('');
  const [loadingComp, setLoadingComp] = useState(false);

  useEffect(() => { load(); loadAdAccounts(); }, []);

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
    setInsightsModal(c);
    setInsights('');
    setLoadingInsights(true);
    try {
      const r = await apiClient.post(`/ai/campaign-insights/${c.id}`);
      setInsights(r.data.insights);
    } catch {
      setInsights('فشل في تحليل الحملة. تأكد من إضافة GEMINI_API_KEY.');
    } finally { setLoadingInsights(false); }
  }

  async function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    setSavingAccount(true);
    try {
      await apiClient.post('/ai/ad-accounts', accountForm);
      toast.success('Ad account connected!');
      setAccountForm({ platform: 'Meta', accountId: '', accessToken: '' });
      loadAdAccounts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save account');
    } finally { setSavingAccount(false); }
  }

  async function analyzeCompetitors(e: React.FormEvent) {
    e.preventDefault();
    if (!compForm.industry || !compForm.competitors) return;
    setLoadingComp(true);
    setCompResult('');
    try {
      const r = await apiClient.post('/ai/competitor-analysis', {
        industry: compForm.industry,
        competitors: compForm.competitors.split(',').map(s => s.trim()).filter(Boolean),
        platform: compForm.platform,
      });
      setCompResult(r.data.analysis);
    } catch {
      setCompResult('فشل في التحليل. تأكد من إضافة GEMINI_API_KEY.');
    } finally { setLoadingComp(false); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Ad Campaigns</h1>
          <p className="text-slate-400 text-sm mt-1">{campaigns.length} campaigns</p>
        </div>
        {tab === 'campaigns' && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ New Campaign</button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6 w-fit">
        {[['campaigns','Campaigns'],['accounts','Ad Accounts'],['competitor','Competitor Analysis']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as any)} className={`px-4 py-2 rounded-lg text-sm transition ${tab === key ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      {/* Campaigns tab */}
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
                  <button onClick={() => openInsights(c)} className="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition" title="AI Insights">✨ Insights</button>
                  <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Ad Accounts tab */}
      {tab === 'accounts' && (
        <div className="space-y-6">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Connect Ad Account</h3>
            <form onSubmit={saveAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={accountForm.platform} onChange={e => setAccountForm({...accountForm, platform: e.target.value})}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
                <input required className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Account ID / Customer ID" value={accountForm.accountId} onChange={e => setAccountForm({...accountForm, accountId: e.target.value})} />
                <input className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Access Token (optional)" type="password" value={accountForm.accessToken} onChange={e => setAccountForm({...accountForm, accessToken: e.target.value})} />
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
            <p className="text-xs text-blue-400 leading-relaxed">💡 <strong>Note:</strong> Store your Meta Ad Account ID, Google Customer ID, or TikTok Advertiser ID here. Full API integration with live data sync requires setting up OAuth in your ad platform's developer portal.</p>
          </div>
        </div>
      )}

      {/* Competitor Analysis tab */}
      {tab === 'competitor' && (
        <div className="space-y-6">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Competitor Analysis</h3>
            <p className="text-sm text-slate-400 mb-5">Powered by Gemini AI — analyze your competitors and find opportunities</p>
            <form onSubmit={analyzeCompetitors} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Your industry / niche (e.g. Fashion, SaaS, F&B)" value={compForm.industry} onChange={e => setCompForm({...compForm, industry: e.target.value})} />
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Competitors (comma-separated, e.g. Nike, Adidas, Puma)" value={compForm.competitors} onChange={e => setCompForm({...compForm, competitors: e.target.value})} />
              <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={compForm.platform} onChange={e => setCompForm({...compForm, platform: e.target.value})}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <button type="submit" disabled={loadingComp} className="w-full py-3 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{loadingComp ? 'Analyzing with Gemini AI...' : '✨ Analyze Competitors'}</button>
            </form>
          </div>

          {compResult && (
            <div className="bg-[#0f1117] border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-purple-400 text-lg">✨</span>
                <h3 className="font-semibold text-white">Gemini AI Analysis</h3>
              </div>
              <div className="text-sm text-slate-300 leading-loose whitespace-pre-wrap" dir="auto">{compResult}</div>
            </div>
          )}
        </div>
      )}

      {/* Create campaign modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">New Campaign</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Campaign name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
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

      {/* AI Insights modal */}
      {insightsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-white">✨ AI Campaign Insights</h2>
                <p className="text-slate-400 text-sm">{insightsModal.name} · {insightsModal.platform}</p>
              </div>
              <button onClick={() => setInsightsModal(null)} className="text-slate-500 hover:text-white transition text-xl">✕</button>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Budget', value: insightsModal.budget ? `$${Number(insightsModal.budget).toLocaleString()}` : '—' },
                { label: 'Impressions', value: insightsModal.impressions ? Number(insightsModal.impressions).toLocaleString() : '0' },
                { label: 'Clicks', value: insightsModal.clicks ? Number(insightsModal.clicks).toLocaleString() : '0' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {loadingInsights ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-3xl mb-3 animate-pulse">✨</div>
                  <p className="text-slate-400 text-sm">Gemini AI is analyzing your campaign...</p>
                </div>
              </div>
            ) : (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-loose whitespace-pre-wrap" dir="auto">{insights}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
