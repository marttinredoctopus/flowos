import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const TEAM = [
  { name: 'Karim Hassan', role: 'CEO & Co-Founder', bio: 'Former agency owner who ran a 20-person digital marketing firm for 8 years. Built TasksDone to solve his own problems.', initials: 'KH', color: '#6366f1' },
  { name: 'Sara Nour', role: 'CTO & Co-Founder', bio: 'Full-stack engineer with 10+ years experience building SaaS products at scale. Previously at a Fortune 500 tech company.', initials: 'SN', color: '#8b5cf6' },
  { name: 'Omar Adel', role: 'Head of Product', bio: 'Product designer and strategist. Former UX lead at a leading agency management platform.', initials: 'OA', color: '#06b6d4' },
  { name: 'Lina Mostafa', role: 'Head of Customer Success', bio: 'Obsessed with making customers win. Has personally onboarded 500+ agency teams.', initials: 'LM', color: '#10b981' },
];

const VALUES = [
  { title: 'Agency-first', desc: 'Every feature we build starts with a real agency problem. We don\'t build for enterprise software — we build for your Monday morning.' },
  { title: 'Radical simplicity', desc: 'The best tools feel obvious. We remove complexity ruthlessly so your team can focus on work, not the tool.' },
  { title: 'Speed over perfection', desc: 'We ship fast, listen to feedback, and iterate. You\'ll see new features every week — not every year.' },
  { title: 'Customer obsession', desc: 'Every support ticket, every feature request, every frustration matters to us. We read every message.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>

        {/* Hero */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Story</span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 20, lineHeight: 1.15 }}>
            Built by agency people,<br />for agency people.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.75 }}>
            TasksDone was born out of frustration. In 2022, our founder was running a 20-person digital agency and paying for 7 different tools — none of which talked to each other. Client data was scattered. Invoices lived in spreadsheets. The team never knew what was the priority. Sound familiar?
          </p>
        </section>

        {/* Mission */}
        <section style={{ background: 'rgba(99,102,241,0.04)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
            {[
              { label: 'Mission', icon: '🎯', text: 'Give every agency in the world the operating system they need to grow — without the enterprise complexity or the enterprise price.' },
              { label: 'Vision', icon: '🔭', text: 'A world where running an agency is as simple as running a great product. Where tools help you scale, not slow you down.' },
              { label: 'Promise', icon: '🤝', text: 'We\'ll always put your success first. If TasksDone doesn\'t help your agency grow, we haven\'t done our job.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.02em' }}>{item.label}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The story */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 24 }}>How it started</h2>
          <div style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 20 }}>In early 2022, Karim was running a 20-person digital agency. Good clients, great team — but operations were a disaster. Asana for tasks, Notion for docs, Google Sheets for invoices, Loomly for content, HubSpot for clients, Slack for communication. Nothing talked to each other. Clients asked for updates, and he'd spend 30 minutes pulling data from 4 different places.</p>
            <p style={{ marginBottom: 20 }}>He tried every tool on the market. None of them were built for agencies. They were either too simple (missing finance, client portals, campaign tracking) or too complex (enterprise software that took months to implement).</p>
            <p style={{ marginBottom: 20 }}>So in Q3 2022, he teamed up with Sara (his longtime developer friend) to build what didn't exist: a single platform that handled everything an agency needs, designed specifically for how agencies actually work.</p>
            <p>TasksDone launched publicly in early 2023. Within 6 months, 500 agencies had signed up. Today, we serve over 2,400 agencies across 40+ countries — and we're just getting started.</p>
          </div>
        </section>

        {/* Values */}
        <section style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 40, textAlign: 'center' }}>What we stand for</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {VALUES.map((v, i) => (
                <div key={i} style={{ padding: '24px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 40, textAlign: 'center' }}>Meet the team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {TEAM.map((member, i) => (
              <div key={i} style={{ padding: '28px 24px', background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                  background: `${member.color}20`, border: `2px solid ${member.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 800, color: member.color,
                }}>
                  {member.initials}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{member.name}</h3>
                <p style={{ fontSize: 12, color: member.color, fontWeight: 600, marginBottom: 12 }}>{member.role}</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: 'rgba(99,102,241,0.05)', borderTop: '1px solid rgba(99,102,241,0.1)', padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {[
              { value: '2,400+', label: 'Agencies worldwide' },
              { value: '40+', label: 'Countries' },
              { value: '98.7%', label: 'Uptime SLA' },
              { value: '< 3min', label: 'Avg. support response' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
