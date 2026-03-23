'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function fmtNum(n: any): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function StatusDot({ status }: { status: string }) {
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

export default function PublicReport({ params }: { params: { token: string } }) {
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [needsPass, setNeedsPass] = useState(false);
  const [password, setPassword] = useState('');
  const [passErr, setPassErr]   = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.tasksdone.cloud/api';

  useEffect(() => { loadReport(); }, []);

  async function loadReport(pass?: string) {
    setLoading(true);
    setPassErr('');
    try {
      const url = `${API}/meta-ads/public/${params.token}${pass ? `?password=${encodeURIComponent(pass)}` : ''}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.password_required || json.error === 'Password required') {
        setNeedsPass(true);
        setLoading(false);
        return;
      }
      if (res.status === 401) {
        setPassErr('Incorrect password');
        setLoading(false);
        return;
      }
      if (!json.success) {
        setError(json.error || 'Report not found');
        setLoading(false);
        return;
      }
      setNeedsPass(false);
      setData(json.data);
    } catch {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  }

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(37,99,235,0.3)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading report...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Password gate ──
  if (needsPass) return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: 24 }}>
      <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: 'white', fontSize: 22, marginBottom: 8 }}>Password Protected</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Enter the password to view this report.</p>
        {passErr && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{passErr}</p>}
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && loadReport(password)}
          placeholder="Enter password"
          style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
          autoFocus
        />
        <button
          onClick={() => loadReport(password)}
          style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0ea5e9,#2563eb)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
        >
          View Report →
        </button>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: 'white', fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: 8 }}>Report not found</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>This link may have expired or been deactivated.</p>
      </div>
    </div>
  );

  if (!data) return null;

  // ── Compute summary ──
  const summary = data.campaigns.reduce((acc: any, c: any) => ({
    spend:       acc.spend       + Number(c.spend),
    revenue:     acc.revenue     + Number(c.revenue),
    impressions: acc.impressions + Number(c.impressions),
    clicks:      acc.clicks      + Number(c.clicks),
    conversions: acc.conversions + Number(c.conversions),
  }), { spend: 0, revenue: 0, impressions: 0, clicks: 0, conversions: 0 });
  summary.roas = summary.spend > 0 ? summary.revenue / summary.spend : 0;
  summary.ctr  = summary.impressions > 0 ? summary.clicks / summary.impressions * 100 : 0;
  summary.cpc  = summary.clicks > 0 ? summary.spend / summary.clicks : 0;

  const kpis = [
    { l: 'Total Spend',   v: `$${summary.spend.toFixed(0)}`,        c: '#2563eb' },
    { l: 'Revenue',       v: `$${summary.revenue.toFixed(0)}`,       c: '#10b981' },
    { l: 'ROAS',          v: `${summary.roas.toFixed(2)}x`,          c: '#22c55e' },
    { l: 'Impressions',   v: fmtNum(summary.impressions),            c: '#8b5cf6' },
    { l: 'Clicks',        v: fmtNum(summary.clicks),                 c: '#f59e0b' },
    { l: 'CTR',           v: `${summary.ctr.toFixed(2)}%`,           c: '#0ea5e9' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', color: '#E8EEF8', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#0ea5e9,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✓</div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 16, color: 'white' }}>Tasks<span style={{ color: '#60a5fa' }}>Done</span></span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{data.report.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{data.report.date_range.start} — {data.report.date_range.end}</div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.06)' }}>
          Powered by TasksDone
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '28px 28px', maxWidth: 1100, margin: '0 auto' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {kpis.map(kpi => (
            <div key={kpi.l} style={{ background: `${kpi.c}0f`, border: `1px solid ${kpi.c}22`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: kpi.c, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>{kpi.l}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>{kpi.v}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {data.chart.length > 0 && (
          <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 20px 12px', marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>Daily Spend & ROAS</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data.chart}>
                <defs>
                  <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                  itemStyle={{ color: '#2563eb' }}
                  formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Spend']}
                />
                <Area type="monotone" dataKey="spend" stroke="#2563eb" strokeWidth={2} fill="url(#spGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Campaigns table */}
        <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14, fontWeight: 700, color: 'white' }}>
            Campaigns ({data.campaigns.length})
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Campaign','Status','Spend','Revenue','ROAS','Impressions','Clicks','CTR'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((c: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'white', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                      {c.objective && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.objective}</div>}
                    </td>
                    <td style={{ padding: '11px 14px' }}><StatusDot status={c.status} /></td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: 'white' }}>${Number(c.spend).toFixed(2)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: Number(c.revenue) > 0 ? '#10b981' : 'rgba(255,255,255,0.3)', fontWeight: Number(c.revenue) > 0 ? 700 : 400 }}>${Number(c.revenue).toFixed(2)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: Number(c.roas) >= 2 ? '#10b981' : Number(c.roas) >= 1 ? '#f59e0b' : Number(c.roas) > 0 ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
                      {Number(c.roas) > 0 ? `${Number(c.roas).toFixed(2)}x` : '—'}
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{fmtNum(c.impressions)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{fmtNum(c.clicks)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{Number(c.ctr).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px 0 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            Report generated by{' '}
            <a href="https://tasksdone.cloud" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>TasksDone</a>
            {' '}· Data from Meta Ads API
          </p>
        </div>
      </div>
    </div>
  );
}
