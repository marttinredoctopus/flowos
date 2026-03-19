import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CheckCircle2 } from 'lucide-react';

const SERVICES = [
  { name: 'Web Application', status: 'operational', uptime: '99.98%' },
  { name: 'API (api.tasksdone.cloud)', status: 'operational', uptime: '99.97%' },
  { name: 'AI Services', status: 'operational', uptime: '99.91%' },
  { name: 'File Storage', status: 'operational', uptime: '100%' },
  { name: 'Email Delivery', status: 'operational', uptime: '99.99%' },
  { name: 'Real-time Notifications', status: 'operational', uptime: '99.96%' },
  { name: 'Billing & Payments', status: 'operational', uptime: '100%' },
];

const INCIDENTS = [
  { date: 'March 10, 2025', title: 'Elevated API latency', status: 'Resolved', duration: '14 minutes', desc: 'Increased response times on /api/tasks endpoint due to a database query optimization that temporarily caused higher load. Resolved by rolling back and applying a targeted index.' },
  { date: 'Feb 14, 2025', title: 'Email delivery delays', status: 'Resolved', duration: '47 minutes', desc: 'Third-party email provider experienced intermittent delays. All emails were queued and delivered successfully after the incident was resolved.' },
];

export default function StatusPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Status</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              All systems operational
            </h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '8px 20px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>All systems are fully operational</span>
            </div>
          </div>

          {/* Service status */}
          <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
            {SERVICES.map((service, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px',
                borderBottom: i < SERVICES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{service.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{service.uptime} uptime</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 10px', borderRadius: 8 }}>
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Uptime graph placeholder */}
          <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>30-day uptime</h3>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>99.97%</span>
            </div>
            <div style={{ display: 'flex', gap: 2, height: 32, alignItems: 'flex-end' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{ flex: 1, background: i === 9 || i === 28 ? '#f59e0b' : '#10b981', borderRadius: 2, height: i === 9 ? '60%' : '100%', opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>30 days ago</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Today</span>
            </div>
          </div>

          {/* Past incidents */}
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>Past Incidents</h2>
          {INCIDENTS.map((incident, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, marginBottom: 4 }}>{incident.title}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{incident.date} · Duration: {incident.duration}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: 8 }}>{incident.status}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{incident.desc}</p>
            </div>
          ))}
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
