'use client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Globe, ChartBar, Heart, Rocket } from '@phosphor-icons/react';

const PERKS = [
  { icon: Globe, color: '#2563EB', iconBg: 'rgba(37,99,235,0.12)', title: 'Fully Remote', desc: 'Work from anywhere in the world. We care about great work, not office attendance.' },
  { icon: ChartBar, color: '#10b981', iconBg: 'rgba(16,185,129,0.12)', title: 'Equity & Growth', desc: 'Meaningful equity for early team members. Grow with the company you help build.' },
  { icon: Heart, color: '#f43f5e', iconBg: 'rgba(244,63,94,0.12)', title: 'People First', desc: '$1,000/year learning budget, unlimited PTO, health coverage, and home office stipend.' },
  { icon: Rocket, color: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', title: 'Real Impact', desc: "Help 2,400+ agencies worldwide run their businesses better. Your work matters from day one." },
];

const JOBS = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Remote (Global)', type: 'Full-time', color: '#2563EB', desc: "We're looking for an experienced full-stack engineer to help build and scale TasksDone. You'll work across our Next.js frontend and Node.js backend." },
  { title: 'Product Designer (UI/UX)', dept: 'Design', location: 'Remote (Global)', type: 'Full-time', color: '#7C3AED', desc: "Join our design team to craft delightful experiences for agency owners. You'll own entire features from concept to ship." },
  { title: 'Customer Success Manager', dept: 'Customer Success', location: 'Remote (EMEA)', type: 'Full-time', color: '#10b981', desc: 'Onboard and support our growing base of agency customers. You\'ll be the reason they love TasksDone.' },
];

export default function CareersPage() {
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>We&apos;re hiring</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 20, lineHeight: 1.1 }}>
            Build the future of agency work
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            We&apos;re a small, ambitious team building the platform that thousands of agencies rely on every day. Come build with us.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 22px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: perk.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} weight="duotone" color={perk.color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 10 }}>{perk.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{perk.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open roles */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 32, letterSpacing: '-0.02em' }}>Open positions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {JOBS.map((job, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${job.color}35`}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: job.color, background: `${job.color}15`, padding: '3px 10px', borderRadius: 8 }}>{job.dept}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{job.location}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>·</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{job.type}</span>
                  </div>
                </div>
                <a href="/contact" style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${job.color}40`, background: `${job.color}10`, color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
                  Apply →
                </a>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{job.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fallback */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>Don&apos;t see your role?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.65 }}>We&apos;re always looking for exceptional people. Send us your CV and tell us how you&apos;d make TasksDone better.</p>
          <a href="mailto:careers@tasksdone.cloud" style={{ display: 'inline-flex', padding: '13px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
            Send your CV →
          </a>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
