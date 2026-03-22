'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Mail, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

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
    background: 'var(--card)', border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              We'd love to hear from you
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-2)' }}>Our team typically responds within 3 minutes during business hours.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' }} className="contact-grid">
            {/* Left */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 24, letterSpacing: '-0.02em' }}>Get in touch</h2>
              {[
                { icon: <Mail size={18} color="#6366f1" />, title: 'Email us', value: 'hello@tasksdone.cloud', sub: 'For general inquiries' },
                { icon: <MessageSquare size={18} color="#8b5cf6" />, title: 'Sales', value: 'sales@tasksdone.cloud', sub: 'Custom plans & enterprise' },
                { icon: <Clock size={18} color="#10b981" />, title: 'Support hours', value: 'Mon – Fri, 9am – 6pm EET', sub: 'Response within 3 minutes' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{item.value}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Form */}
            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '36px' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Message sent!</h3>
                  <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.65 }}>Thanks for reaching out. We'll get back to you within a few hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>Send us a message</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle}
                        onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = '#6366f1'}
                        onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@company.com" style={inputStyle}
                        onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = '#6366f1'}
                        onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select a topic</option>
                      <option>Sales inquiry</option>
                      <option>Technical support</option>
                      <option>Feature request</option>
                      <option>Partnership</option>
                      <option>Press inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Message *</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help..." rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#6366f1'}
                      onBlur={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <button type="submit" disabled={sending} style={{
                    width: '100%', padding: '13px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer',
                    opacity: sending ? 0.7 : 1, transition: 'opacity 0.2s',
                    boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                  }}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
      <LandingFooter />
      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
