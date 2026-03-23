'use client';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Envelope, ChatCircle, Users, CheckCircle } from '@phosphor-icons/react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
    color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const CONTACT_METHODS = [
    { icon: Envelope, color: '#2563EB', iconBg: 'rgba(37,99,235,0.12)', title: 'General Inquiries', email: 'hello@tasksdone.cloud', desc: 'Questions, partnerships, and feedback' },
    { icon: ChatCircle, color: '#7C3AED', iconBg: 'rgba(124,58,237,0.12)', title: 'Support', email: 'support@tasksdone.cloud', desc: 'Technical help — we respond in < 3 min' },
    { icon: Users, color: '#10b981', iconBg: 'rgba(16,185,129,0.12)', title: 'Sales', email: 'sales@tasksdone.cloud', desc: 'Custom plans, demos, and enterprise' },
  ];

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Contact us</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            Get in touch
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
            We typically respond within a few hours. For urgent support, reach out via live chat in-app.
          </p>
        </div>
      </section>

      {/* Contact method cards */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {CONTACT_METHODS.map((method, i) => {
            const Icon = method.icon;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: method.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} weight="duotone" color={method.color} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{method.title}</h3>
                <a href={`mailto:${method.email}`} style={{ fontSize: 14, color: method.color, textDecoration: 'none', fontWeight: 600, display: 'block', marginBottom: 8 }}>{method.email}</a>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{method.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Form section */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '40px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={52} weight="duotone" color="#10b981" style={{ margin: '0 auto 20px', display: 'block' }} />
              <h3 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 12 }}>Message sent!</h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Thanks for reaching out. We&apos;ll get back to you within a few hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Send us a message</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8, fontWeight: 500 }}>Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(37,99,235,0.5)'}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.09)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8, fontWeight: 500 }}>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@agency.com" style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(37,99,235,0.5)'}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.09)'}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8, fontWeight: 500 }}>Subject</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option value="">Select a topic</option>
                  <option>Sales inquiry</option>
                  <option>Technical support</option>
                  <option>Feature request</option>
                  <option>Partnership</option>
                  <option>Press inquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8, fontWeight: 500 }}>Message *</label>
                <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help..." rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'rgba(37,99,235,0.5)'}
                  onBlur={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.09)'}
                />
              </div>
              <button type="submit" disabled={sending} style={{ padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 15, fontWeight: 700, border: 'none', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, boxShadow: '0 4px 20px rgba(37,99,235,0.3)', transition: 'opacity 0.2s' }}>
                {sending ? 'Sending...' : 'Send Message →'}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: 0 }}>We typically respond within 3 hours during business hours (Mon–Fri, 9am–6pm EET).</p>
            </form>
          )}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
