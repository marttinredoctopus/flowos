'use client';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { MagnifyingGlass, Book, ChatCircle, Envelope, VideoCamera, Users, CreditCard, Brain, Kanban, Buildings, CaretDown } from '@phosphor-icons/react';

const CATEGORIES = [
  { icon: Kanban, color: '#2563EB', iconBg: 'rgba(37,99,235,0.12)', title: 'Getting Started', desc: 'Setup, workspace configuration, and first steps', count: 12 },
  { icon: Users, color: '#7C3AED', iconBg: 'rgba(124,58,237,0.12)', title: 'Team & Clients', desc: 'Inviting members, client portal, and permissions', count: 18 },
  { icon: Kanban, color: '#0EA5E9', iconBg: 'rgba(14,165,233,0.12)', title: 'Tasks & Projects', desc: 'Views, assignments, timelines, and automation', count: 24 },
  { icon: CreditCard, color: '#10b981', iconBg: 'rgba(16,185,129,0.12)', title: 'Billing & Invoices', desc: 'Subscriptions, invoices, and payment setup', count: 15 },
  { icon: Brain, color: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', title: 'AI Features', desc: 'Campaign builder, content AI, and competitor analysis', count: 10 },
  { icon: Buildings, color: '#f43f5e', iconBg: 'rgba(244,63,94,0.12)', title: 'Account & Security', desc: 'Profile settings, 2FA, and data export', count: 9 },
];

const FAQS = [
  { q: 'How do I invite team members?', a: "Go to Settings → Team → Invite Member. Enter their email and select a role (Admin, Team Member, or Viewer). They'll receive an email invitation." },
  { q: 'How do I give clients portal access?', a: "Open a client profile, click \"Portal Access\", and enable it. The client will receive a login link to their private, branded portal." },
  { q: 'How do I create an invoice?', a: 'Go to Finance → Invoices → New Invoice. Select a client, add line items from tracked time or manually, and click Send. Your client receives a PDF via email.' },
  { q: 'Can I import data from Asana or Notion?', a: 'Yes! Go to Settings → Import. We support CSV import from Asana, Trello, Notion, Monday.com, and ClickUp. Our team can also help with the migration.' },
  { q: 'How does the AI work?', a: 'TasksDone AI is powered by leading language models. Use it to generate campaign plans, write proposals, analyze competitors, and get intelligent suggestions across the platform.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Settings → Billing → Cancel Plan. Your account remains active until end of the billing period. Export all your data first — we keep it for 30 days after cancellation.' },
  { q: 'Is my data secure?', a: "Yes. We use AES-256 encryption at rest and in transit. Data is hosted on AWS, backed up hourly, and you can export it anytime from Settings → Export." },
  { q: 'Do you have a mobile app?', a: 'The web app is fully responsive and works great on mobile. Native iOS and Android apps are on the roadmap — vote on them at our public roadmap page.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{q}</span>
        <CaretDown size={16} weight="bold" color="rgba(255,255,255,0.4)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
      </button>
      {open && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, paddingBottom: 18, margin: 0 }}>{a}</p>}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero with search */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #060B18 0%, #0A1628 100%)' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 24, lineHeight: 1.1 }}>
            How can we help?
          </h1>
          <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
            <MagnifyingGlass size={18} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for answers..." style={{ width: '100%', padding: '16px 20px 16px 50px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* Support channels */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            { icon: Book, color: '#2563EB', iconBg: 'rgba(37,99,235,0.12)', title: 'Documentation', desc: 'Full docs and guides', href: '/docs' },
            { icon: ChatCircle, color: '#7C3AED', iconBg: 'rgba(124,58,237,0.12)', title: 'Live Chat', desc: 'Talk to us in-app', href: '#' },
            { icon: Envelope, color: '#10b981', iconBg: 'rgba(16,185,129,0.12)', title: 'Email Support', desc: 'support@tasksdone.cloud', href: 'mailto:support@tasksdone.cloud' },
            { icon: VideoCamera, color: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', title: 'Video Tutorials', desc: 'Watch and learn', href: '#' },
          ].map((channel, i) => {
            const Icon = channel.icon;
            return (
              <a key={i} href={channel.href} style={{ display: 'block', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${channel.color}35`; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: channel.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={22} weight="duotone" color={channel.color} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>{channel.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{channel.desc}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Topic categories */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>Browse by topic</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${cat.color}35`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={22} weight="duotone" color={cat.color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>{cat.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, marginBottom: 12 }}>{cat.desc}</p>
                <span style={{ fontSize: 12, color: cat.color, fontWeight: 600 }}>{cat.count} articles →</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 32, letterSpacing: '-0.02em' }}>Frequently asked questions</h2>
        {FAQS.map(f => <FAQItem key={f.q} {...f} />)}
      </section>

      {/* Contact CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 10 }}>Still need help?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Our support team responds in under 3 minutes during business hours (Mon–Fri, 9am–6pm EET).</p>
          <a href="/contact" style={{ display: 'inline-flex', padding: '13px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
            Contact Support →
          </a>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
