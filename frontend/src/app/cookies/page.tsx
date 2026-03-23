'use client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const COOKIE_TYPES = [
  { name: 'Essential Cookies', required: true, color: '#10b981', examples: ['Session token', 'Authentication state', 'CSRF protection', 'User preferences'], desc: 'These cookies are necessary for the Service to function. They enable core features like logging in, remembering your session, and keeping you secure. The Service cannot function properly without them.' },
  { name: 'Preference Cookies', required: false, color: '#2563EB', examples: ['Theme (light/dark)', 'Sidebar state', 'Language preference', 'Dashboard layout'], desc: 'These cookies remember your settings and preferences to personalize your experience. They are not essential but improve usability significantly.' },
  { name: 'Analytics Cookies', required: false, color: '#7C3AED', examples: ['Page views', 'Feature usage', 'Session duration', 'Navigation paths'], desc: 'We use analytics cookies to understand how users interact with TasksDone. This helps us improve the platform. These cookies are anonymous and cannot be used to identify you personally. You can opt out at any time.' },
  { name: 'Third-Party Cookies', required: false, color: '#f59e0b', examples: ['Stripe (payments)', 'Vercel (performance)'], desc: 'Some third-party services we rely on set their own cookies. Stripe sets cookies to manage payment sessions. Vercel sets performance cookies. We do not allow advertising cookies from any third-party network.' },
];

const SECTIONS = [
  {
    title: 'What Are Cookies?',
    content: 'Cookies are small text files placed on your device (computer, tablet, or phone) when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to website owners about how their site is used.'
  },
  {
    title: 'How We Use Cookies',
    content: 'TasksDone uses cookies to: keep you logged in across sessions; remember your preferences and settings; protect your account with CSRF tokens; understand how features are used to improve the platform; ensure payments are processed securely via Stripe.'
  },
  {
    title: 'Managing Your Cookie Preferences',
    content: 'You can control and delete cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when cookies are set. Note that disabling essential cookies will prevent you from logging in and using the Service. Analytics and preference cookies can be disabled without affecting core functionality. You can also contact us at privacy@tasksdone.cloud to opt out of analytics cookies.'
  },
  {
    title: 'Cookie Retention',
    content: 'Session cookies are deleted when you close your browser. Persistent cookies remain on your device until they expire or are deleted. Authentication cookies expire after 30 days of inactivity. Analytics cookies expire after 12 months.'
  },
  {
    title: 'Updates to This Policy',
    content: 'We may update this Cookie Policy from time to time. Changes will be reflected with an updated "Last updated" date at the top of this page. We recommend reviewing this page periodically.'
  },
  {
    title: 'Contact',
    content: 'Questions about our cookie practices? Email us at privacy@tasksdone.cloud.'
  },
];

export default function CookiesPage() {
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Legal</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 12, lineHeight: 1.1 }}>Cookie Policy</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Last updated: March 23, 2026 · Effective: March 23, 2026</p>
        </div>

        {/* Cookie type cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {COOKIE_TYPES.map((type, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${type.color}25`, borderRadius: 14, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>{type.name}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: type.required ? '#10b981' : type.color, background: type.required ? 'rgba(16,185,129,0.1)' : `${type.color}15`, padding: '3px 10px', borderRadius: 8, letterSpacing: '0.04em' }}>{type.required ? 'REQUIRED' : 'OPTIONAL'}</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 14 }}>{type.desc}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {type.examples.map((ex, j) => (
                  <span key={j} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 8 }}>{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Policy sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {SECTIONS.map((section, i) => (
            <div key={i} style={{ paddingBottom: 36, borderBottom: i < SECTIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 14, letterSpacing: '-0.01em' }}>{section.title}</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
      </article>

      <LandingFooter />
    </div>
  );
}
