'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, FolderKanban, Receipt, Palette, TrendingUp, Copy } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function ClientPortalPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId') || '';

  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [clients, setClients]   = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState(clientId);
  const [tab, setTab]           = useState<'overview' | 'designs' | 'invoices'>('overview');
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/clients').then(r => setClients(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClient) { setData(null); setLoading(false); return; }
    setLoading(true);
    apiClient.get(`/client-portal/dashboard?clientId=${selectedClient}`)
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load portal'))
      .finally(() => setLoading(false));
  }, [selectedClient]);

  async function generateLink() {
    if (!selectedClient) return toast.error('Select a client first');
    try {
      const { data: link } = await apiClient.post('/client-portal/generate-link', { clientId: selectedClient });
      navigator.clipboard.writeText(link.url);
      toast.success('Link copied to clipboard!');
    } catch { toast.error('Failed to generate link'); }
  }

  async function approveDesign(assetId: string, approved: boolean, feedback?: string) {
    setApproving(assetId);
    try {
      await apiClient.post(`/client-portal/designs/${assetId}/approve`, { approved, feedback: feedback || undefined });
      toast.success(approved ? '✅ Design approved!' : '↩️ Revision requested');
      // Refresh data
      const r = await apiClient.get(`/client-portal/dashboard?clientId=${selectedClient}`);
      setData(r.data);
    } catch { toast.error('Failed to update'); }
    finally { setApproving(null); }
  }

  const STATUS_COLORS: Record<string, string> = {
    active: 'var(--blue)', completed: 'var(--emerald)', paused: 'var(--yellow)', cancelled: 'var(--red)',
  };
  const INV_COLORS: Record<string, string> = {
    paid: 'var(--emerald)', sent: 'var(--blue)', overdue: 'var(--red)', draft: 'var(--text-dim)',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Client Portal 🌐</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>View your client's projects, designs, and invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 rounded-xl text-sm focus:outline-none appearance-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
            value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
            <option value="">Select client...</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {selectedClient && (
            <button onClick={generateLink} className="flex items-center gap-2 px-4 py-2.5 text-sm border rounded-xl hover:bg-white/5 transition"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <Copy size={14} /> Share Link
            </button>
          )}
        </div>
      </div>

      {!selectedClient ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-5xl mb-3">🌐</div>
          <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>Select a Client</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose a client from the dropdown to view their portal</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--card)' }} />)}
        </div>
      ) : !data ? null : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: '📁', label: 'Active Projects', value: data.stats.activeProjects,   color: 'var(--blue)' },
              { icon: '✅', label: 'Tasks Done',       value: data.stats.completedTasks,   color: 'var(--emerald)' },
              { icon: '🔄', label: 'Pending Tasks',    value: data.stats.pendingTasks,     color: 'var(--yellow)' },
              { icon: '💰', label: 'Total Revenue',    value: `$${Number(data.stats.totalInvoiced || 0).toLocaleString()}`, color: 'var(--violet)' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: 'var(--card)', border: `1px solid ${s.color}22` }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: 'var(--surface)' }}>
            {(['overview', 'designs', 'invoices'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${tab === t ? 'text-white gradient-bg' : 'hover:bg-white/5'}`}
                style={{ color: tab === t ? 'white' : 'var(--text-muted)' }}>
                {t === 'overview' && <span className="flex items-center gap-1.5"><TrendingUp size={13} /> Overview</span>}
                {t === 'designs'  && <span className="flex items-center gap-1.5"><Palette size={13} /> Designs ({data.designs.length})</span>}
                {t === 'invoices' && <span className="flex items-center gap-1.5"><Receipt size={13} /> Invoices ({data.invoices.length})</span>}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Projects */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}><FolderKanban size={15} /> Projects</h3>
                {data.projects.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No projects</p>
                ) : data.projects.map((p: any) => {
                  const done   = parseInt(p.done_count) || 0;
                  const total  = parseInt(p.task_count) || 0;
                  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={p.id} className="p-3 rounded-xl mb-2 last:mb-0" style={{ background: 'var(--surface)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{p.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: (STATUS_COLORS[p.status] || '#7b7fa8') + '22', color: STATUS_COLORS[p.status] || '#7b7fa8' }}>{p.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full gradient-bg" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{done}/{total} tasks done</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Tasks */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>✅ Tasks</h3>
                {data.tasks.slice(0, 8).map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl mb-1.5 last:mb-0" style={{ background: 'var(--surface)' }}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === 'done' ? 'bg-green-400' : t.status === 'in_progress' ? 'bg-blue-400' : 'bg-slate-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: 'var(--text)', textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.6 : 1 }}>{t.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{t.project_name || 'No project'}</p>
                    </div>
                    <span className="text-xs capitalize" style={{ color: 'var(--text-dim)' }}>{t.status?.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Designs */}
          {tab === 'designs' && (
            <div>
              {data.designs.length === 0 ? (
                <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No designs uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.designs.map((asset: any) => (
                    <div key={asset.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      {/* Preview */}
                      <div className="aspect-video relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                        {asset.file_url && (asset.mime_type?.startsWith('image/') || asset.file_url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) ? (
                          <img src={asset.file_url} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">🎨</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-sm truncate mb-0.5" style={{ color: 'var(--text)' }}>{asset.name}</p>
                        <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
                          {asset.brief_title || 'No brief'} · v{asset.version}
                        </p>
                        <div className="flex gap-2">
                          <button disabled={approving === asset.id} onClick={() => approveDesign(asset.id, true)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition hover:opacity-90"
                            style={{ background: 'rgba(76,175,130,0.15)', color: 'var(--emerald)' }}>
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button disabled={approving === asset.id} onClick={() => approveDesign(asset.id, false, 'Revision requested')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition hover:opacity-90"
                            style={{ background: 'rgba(239,83,80,0.12)', color: 'var(--red)' }}>
                            <XCircle size={13} /> Revision
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invoices */}
          {tab === 'invoices' && (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {data.invoices.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-3">🧾</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No invoices yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Invoice', 'Amount', 'Status', 'Due', 'Issued'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((inv: any) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-5 py-3.5 font-mono text-sm" style={{ color: 'var(--text)' }}>{inv.invoice_number}</td>
                        <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--text)' }}>${Number(inv.total_amount || 0).toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs px-2.5 py-1 rounded-full capitalize font-medium"
                            style={{ background: (INV_COLORS[inv.status] || '#7b7fa8') + '22', color: INV_COLORS[inv.status] || '#7b7fa8' }}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                          {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                          {inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
