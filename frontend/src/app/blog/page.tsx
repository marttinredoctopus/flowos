'use client';
import { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ArrowRight } from '@phosphor-icons/react';

const POSTS = [
  { category: 'Agency Tips', title: 'The Ultimate Agency Tool Stack in 2025 (And Why We Replaced It All)', excerpt: "We analyzed 200 agency tech stacks. Here's what most successful agencies are using — and why many are consolidating to a single platform.", author: 'Karim Hassan', date: 'Mar 12, 2025', readTime: '8 min', color: '#2563EB', featured: true },
  { category: 'Product', title: 'Build a Client Onboarding System That Runs on Autopilot', excerpt: 'A step-by-step guide to building an onboarding process that impresses clients and saves your team 3+ hours per new account.', author: 'Lina Mostafa', date: 'Mar 5, 2025', readTime: '6 min', color: '#10b981' },
  { category: 'Marketing', title: '5 Agency Pricing Strategies That Increased Revenue by 40%', excerpt: 'Stop billing hourly. These pricing models help agencies earn more, work less, and build predictable revenue.', author: 'Sara Nour', date: 'Feb 26, 2025', readTime: '7 min', color: '#7C3AED' },
  { category: 'Marketing', title: "How to Use AI to Triple Your Agency's Output Without Hiring", excerpt: 'Practical AI workflows for campaign ideation, content creation, competitive research, and client reporting.', author: 'Omar Adel', date: 'Feb 18, 2025', readTime: '10 min', color: '#f59e0b' },
  { category: 'Agency Tips', title: "Why Asana and Trello Don't Work for Agencies (And What Does)", excerpt: 'Generic project management tools miss the unique needs of agency work. Here\'s what to look for instead.', author: 'Karim Hassan', date: 'Feb 10, 2025', readTime: '5 min', color: '#0EA5E9' },
  { category: 'Product', title: 'Client Portal Best Practices: What Top Agencies Do Differently', excerpt: '8 features your client portal needs to reduce support requests and increase client satisfaction scores.', author: 'Lina Mostafa', date: 'Feb 3, 2025', readTime: '6 min', color: '#f43f5e' },
  { category: 'Updates', title: 'Introducing TasksDone 2.0: Everything That\'s New', excerpt: 'Completely redesigned UI, new AI features, a revamped client portal, and more. Here\'s everything that shipped in our biggest release ever.', author: 'Karim Hassan', date: 'Jan 27, 2025', readTime: '4 min', color: '#2563EB' },
];

const CATEGORIES = ['All', 'Product', 'Agency Tips', 'Marketing', 'Updates'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filtered = activeCategory === 'All' ? POSTS : POSTS.filter(p => p.category === activeCategory);
  const featured = POSTS.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured || activeCategory !== 'All');

  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      {/* Hero */}
      <section style={{ padding: '120px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 400, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Blog</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            TasksDone Blog
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Agency tips, product updates, and marketing insights.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', borderColor: activeCategory === cat ? '#2563EB' : 'rgba(255,255,255,0.1)', background: activeCategory === cat ? 'rgba(37,99,235,0.15)' : 'transparent', color: activeCategory === cat ? '#60a5fa' : 'rgba(255,255,255,0.5)' }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured post */}
      {activeCategory === 'All' && featured && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
          <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '48px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#0EA5E9,#2563EB)' }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', fontSize: 11, color: '#60a5fa', fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Featured</div>
            <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.25, maxWidth: 700 }}>{featured.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24, maxWidth: 640 }}>{featured.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{featured.author}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>·</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{featured.date}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>·</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{featured.readTime} read</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}>
                Read article <ArrowRight size={14} weight="bold" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {rest.map((post, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${post.color}35`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'inline-flex', marginBottom: 16, padding: '4px 10px', borderRadius: 8, background: `${post.color}15`, fontSize: 11, fontWeight: 700, color: post.color, textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'flex-start' }}>{post.category}</div>
              <h3 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 17, fontWeight: 700, color: 'white', lineHeight: 1.4, marginBottom: 12, flex: 1 }}>{post.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 20 }}>{post.excerpt}</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime} read</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '48px 40px' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>Get agency insights weekly</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>Join 3,000+ agency owners. No spam, ever. Unsubscribe anytime.</p>
          {subscribed ? (
            <div style={{ padding: '16px 24px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 600, fontSize: 14 }}>You&apos;re subscribed! Check your inbox.</div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@agency.com" style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
              <button onClick={() => email && setSubscribed(true)} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
            </div>
          )}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
