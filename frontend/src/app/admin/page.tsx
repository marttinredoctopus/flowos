'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';

const PLAN_COLORS: Record<string, string> = {
  starter: '#6e7681', pro: '#4a9eff', enterprise: '#7c6fe0',
};

function StatCard({ label, value, sub, color = '#4a9eff' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 16, padding: 24 }}>
      <div style={{ fontSize: 13, color: '#6e7681', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#6e7681' }}>{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/'); return; }
    if (user && !(user as any).isSuperAdmin) { router.replace('/dashboard'); return; }

    Promise.all([
      apiClient.get('/admin/stats'),
      apiClient.get('/admin/orgs'),
    ]).then(([s, o]) => {
      setStats(s.data);
      setOrgs(o.data || []);
    }).catch(err => {
      setError(err?.response?.data?.error || 'Failed to load admin data');
    }).finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (!isAuthenticated || (user && !(user as any).isSuperAdmin)) return null;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#06080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#8b949e' }}>Loading admin panel...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#06080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#ef5350' }}>{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#06080f', color: '#f0f6fc', padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#7c6fe0,#4a9eff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TasksDone Super Admin
          </div>
          <div style={{ fontSize: 13, color: '#6e7681', marginTop: 2 }}>Platform metrics & organization management</div>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{
          padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', color: '#8b949e', fontSize: 13, cursor: 'pointer',
        }}>
          ← Back to App
        </button>
      </div>

      {/* Stats grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Organizations" value={stats.total_orgs} sub={`+${stats.new_orgs_this_month} this month`} color="#4a9eff" />
          <StatCard label="Total Users" value={stats.total_users} color="#7c6fe0" />
          <StatCard label="Monthly Recurring Revenue" value={`$${stats.mrr?.toLocaleString()}`} sub={`ARR: $${stats.arr?.toLocaleString()}`} color="#4caf82" />
          <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 13, color: '#6e7681', marginBottom: 12 }}>Plan Breakdown</div>
            {Object.entries(stats.plan_breakdown || {}).map(([plan, count]) => (
              <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLAN_COLORS[plan] || '#6e7681' }} />
                  <span style={{ fontSize: 13, color: '#f0f6fc', textTransform: 'capitalize' }}>{plan}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: PLAN_COLORS[plan] || '#6e7681' }}>{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizations table */}
      <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Organizations ({orgs.length})</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Name', 'Plan', 'Billing', 'Users', 'Created'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #21262d' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgs.map(org => (
                <tr key={org.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#f0f6fc' }}>{org.name}</div>
                    <div style={{ fontSize: 11, color: '#6e7681', fontFamily: 'monospace' }}>{org.slug}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                      padding: '2px 8px', borderRadius: 10,
                      background: `${PLAN_COLORS[org.plan] || '#6e7681'}20`,
                      color: PLAN_COLORS[org.plan] || '#6e7681',
                    }}>{org.plan}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b949e', textTransform: 'capitalize' }}>{org.billing_cycle || 'monthly'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#f0f6fc' }}>{org.user_count}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6e7681' }}>{new Date(org.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
              {orgs.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6e7681', fontSize: 14 }}>No organizations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
