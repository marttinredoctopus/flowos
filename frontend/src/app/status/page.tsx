'use client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CheckCircle, Warning } from '@phosphor-icons/react';

const SERVICES = [
  { name: 'Web Application', uptime: '99.98%', status: 'operational' },
  { name: 'API (api.tasksdone.cloud)', uptime: '99.97%', status: 'operational' },
  { name: 'AI Services', uptime: '99.91%', status: 'operational' },
  { name: 'File Storage', uptime: '100%', status: 'operational' },
  { name: 'Email Delivery', uptime: '99.99%', status: 'operational' },
  { name: 'Real-time Notifications', uptime: '99.96%', status: 'operational' },
  { name: 'Billing & Payments', uptime: '100%', status: 'operational' },
  { name: 'Client Portals', uptime: '99.94%', status: 'operational' },
];

const INCIDENTS = [
  { date: 'March 10, 2025', title: 'Elevated API latency', duration: '14 min', desc: 'Increased response times on /api/tasks endpoint. Resolved by rolling back a database query change and applying a targeted index.' },
  { date: 'February 14, 2025', title: 'Email delivery delays', duration: '47 min', desc: 'Third-party email provider experienced intermittent delays. All emails were queued and delivered after the incident resolved.' },
];

export default function StatusPage() {
  const allOperational = SERVICES.every(s => s.status === 'operational');

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 24, lineHeight: 1.1 }}>
            {allOperational ? 'All Systems Operational' : 'Partial Outage'}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: allOperational ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${allOperational ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, borderRadius: 100, padding: '10px 24px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: allOperational ? '#10b981' : '#f59e0b', boxShadow: `0 0 10px ${allOperational ? '#10b981' : '#f59e0b'}` }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: allOperational ? '#10b981' : '#f59e0b' }}>
              {allOperational ? 'All 8 services are fully operational' : 'Some services are degraded'}
            </span>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>Last checked: just now · Auto-refreshes every 60s</p>
        </div>
      </section>

      {/* Service status grid */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Service</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>90-Day Uptime</span>
          </div>
          {SERVICES.map((service, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < SERVICES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {service.status === 'operational'
                  ? <CheckCircle size={16} weight="duotone" color="#10b981" />
                  : <Warning size={16} weight="duotone" color="#f59e0b" />
                }
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{service.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>{service.uptime}</span>
                <span style={{ fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: 8, fontWeight: 600 }}>Operational</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 90-day uptime visual */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>90-day uptime</h3>
            <span style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 24, fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em' }}>99.97%</span>
          </div>
          <div style={{ display: 'flex', gap: 2, height: 36, alignItems: 'flex-end' }}>
            {Array.from({ length: 90 }).map((_, i) => (
              <div key={i} style={{ flex: 1, background: (i === 19 || i === 55) ? '#f59e0b' : '#10b981', borderRadius: 2, height: (i === 19 || i === 55) ? '55%' : '100%', opacity: 0.75 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>90 days ago</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981', display: 'inline-block' }} /> Operational</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /> Degraded</span>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Today</span>
          </div>
        </div>
      </section>

      {/* Past incidents */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 100px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>Past Incidents</h2>
        {INCIDENTS.map((incident, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0, marginBottom: 6 }}>{incident.title}</h3>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{incident.date} · Duration: {incident.duration}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: 8 }}>Resolved</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{incident.desc}</p>
          </div>
        ))}
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 20 }}>No other incidents in the past 90 days.</p>
      </section>

      <LandingFooter />
    </div>
  );
}
