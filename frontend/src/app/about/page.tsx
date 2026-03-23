'use client';
import { useRouter } from 'next/navigation';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const VALUES = [
  { icon: '🎯', title: 'Built for agencies', desc: "Every feature is designed around how marketing agencies actually work. Not generic teams — agencies." },
  { icon: '⚡', title: 'Simple over complex', desc: "We obsess over simplicity. If a feature makes things more complicated, we don't ship it." },
  { icon: '💬', title: 'Customer-first', desc: 'Our roadmap is driven by customer feedback. Every feature request gets read by a founder.' },
  { icon: '🔓', title: 'Transparent', desc: "We share our roadmap publicly. We're honest about pricing. No surprises, ever." },
];

const TEAM = [
  { name: 'Karim Hassan', role: 'CEO & Co-founder', color: 'linear-gradient(135deg,#0EA5E9,#2563EB)' },
  { name: 'Sara Nour', role: 'CTO & Co-founder', color: 'linear-gradient(135deg,#7C3AED,#2563EB)' },
  { name: 'Omar Adel', role: 'Head of Product', color: 'linear-gradient(135deg,#f59e0b,#f43f5e)' },
  { name: 'Lina Mostafa', role: 'Head of Customer Success', color: 'linear-gradient(135deg,#10b981,#0EA5E9)' },
];

const STATS = [
  { value: '2,400+', label: 'Agencies worldwide' },
  { value: '40+', label: 'Countries' },
  { value: '98.7%', label: 'Uptime SLA' },
  { value: '< 3min', label: 'Avg. support response' },
];

export default function AboutPage() {
  const router = useRouter();
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Our story</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.1 }}>
            Built by agency people,<br />for agency people
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            We got frustrated with juggling 6 tools to run our agency. So we built one platform that does it all.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 16px' }}>
              <div style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '40px 48px' }}>
          {[
            'TasksDone was born out of frustration. Running a marketing agency means managing clients, campaigns, content, creative work, and billing — all at the same time.',
            'We were using Trello for tasks, Notion for docs, Slack for chat, Harvest for time tracking, Google Sheets for reporting, and email for client updates. It was chaos. Context was constantly lost. Deadlines were missed. Clients were frustrated. We were burning out.',
            'So in 2024, we decided to build the tool we always wished existed — an operating system built specifically for marketing agencies.',
            'Today, TasksDone helps 2,400+ agencies worldwide run smarter, move faster, and grow stronger.',
          ].map((p, i) => (
            <p key={i} style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: i < 3 ? 20 : 0 }}>{p}</p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ textAlign: 'center', padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '40px 48px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Our Mission</div>
          <p style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 22, fontWeight: 700, color: 'white', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
            &ldquo;To give every marketing agency — from 1-person freelancers to 100-person studios — the tools they need to do their best work.&rdquo;
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 36, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em' }}>What we believe</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 10 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>A small team with big ambitions</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>We&apos;re a distributed team passionate about building great software.</p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {TEAM.map(m => (
            <div key={m.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '32px 28px', width: 220, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: m.color, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white' }}>{m.name[0]}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>Join 2,400+ agencies running smarter</h2>
        <button onClick={() => router.push('/register')} style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(37,99,235,0.35)' }}>
          Start for free →
        </button>
      </section>

      <LandingFooter />
    </div>
  );
}
