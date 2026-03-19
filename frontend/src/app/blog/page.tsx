import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const POSTS = [
  { slug: 'agency-tool-stack-2024', category: 'Agency Ops', title: 'The Ultimate Agency Tool Stack in 2024 (And Why We Replaced It All)', excerpt: 'We analyzed 200 agency tech stacks. Here\'s what most successful agencies are using — and why many are consolidating to a single platform.', author: 'Karim Hassan', date: 'March 12, 2025', readTime: '8 min read', featured: true, color: '#6366f1' },
  { slug: 'client-onboarding-system', category: 'Client Management', title: 'Build a Client Onboarding System That Runs on Autopilot', excerpt: 'A step-by-step guide to building an onboarding process that impresses clients and saves your team 3+ hours per new account.', author: 'Lina Mostafa', date: 'March 5, 2025', readTime: '6 min read', color: '#10b981' },
  { slug: 'agency-pricing-strategies', category: 'Business', title: '5 Agency Pricing Strategies That Increased Revenue by 40%', excerpt: 'Stop billing hourly. These pricing models help agencies earn more, work less, and build predictable revenue.', author: 'Sara Nour', date: 'Feb 26, 2025', readTime: '7 min read', color: '#8b5cf6' },
  { slug: 'ai-for-agencies', category: 'AI & Automation', title: 'How to Use AI to Triple Your Agency\'s Output Without Hiring', excerpt: 'Practical AI workflows for campaign ideation, content creation, competitive research, and client reporting.', author: 'Omar Adel', date: 'Feb 18, 2025', readTime: '10 min read', color: '#f59e0b' },
  { slug: 'project-management-for-agencies', category: 'Project Management', title: 'Why Asana and Trello Don\'t Work for Agencies (And What Does)', excerpt: 'Generic project management tools miss the unique needs of agency work. Here\'s what to look for instead.', author: 'Karim Hassan', date: 'Feb 10, 2025', readTime: '5 min read', color: '#06b6d4' },
  { slug: 'client-portal-best-practices', category: 'Client Management', title: 'Client Portal Best Practices: What Top Agencies Do Differently', excerpt: '8 features your client portal needs to reduce support requests and increase client satisfaction scores.', author: 'Lina Mostafa', date: 'Feb 3, 2025', readTime: '6 min read', color: '#f43f5e' },
  { slug: 'invoice-faster-get-paid-faster', category: 'Finance', title: 'Invoice Faster, Get Paid Faster: A Complete Guide', excerpt: 'The invoicing mistakes costing agencies thousands per year — and the simple system to fix them.', author: 'Sara Nour', date: 'Jan 27, 2025', readTime: '7 min read', color: '#10b981' },
  { slug: 'building-remote-agency-team', category: 'Team Management', title: 'Building a High-Performance Remote Agency Team in 2025', excerpt: 'The frameworks, tools, and rituals that successful remote agencies use to stay aligned and deliver results.', author: 'Omar Adel', date: 'Jan 20, 2025', readTime: '9 min read', color: '#6366f1' },
];

const CATEGORIES = ['All', 'Agency Ops', 'Client Management', 'Business', 'AI & Automation', 'Project Management', 'Finance', 'Team Management'];

export default function BlogPage() {
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Blog</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text)', marginTop: 12, marginBottom: 16 }}>
              Agency growth, simplified
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-2)' }}>Practical insights for agency owners and teams.</p>
          </div>

          {/* Featured */}
          <div style={{
            background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
            padding: '40px', marginBottom: 48, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(99,102,241,0.1)', padding: '3px 10px', borderRadius: 8 }}>Featured</span>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginTop: 16, marginBottom: 12, lineHeight: 1.25 }}>
              {featured.title}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20, maxWidth: 700 }}>{featured.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>By <strong style={{ color: 'var(--text)' }}>{featured.author}</strong></span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{featured.date}</span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{featured.readTime}</span>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {rest.map((post, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
                padding: '24px', display: 'flex', flexDirection: 'column', gap: 12,
                transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${post.color}30`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: post.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{post.category}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, margin: 0 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, margin: 0, flex: 1 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{post.author}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
