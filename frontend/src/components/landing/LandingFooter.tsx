import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Help Center', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'Status', href: '/status' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export function LandingFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', paddingTop: 64, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 56 }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
              <Logo size={30} showWordmark />
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 200, margin: 0 }}>
              The agency OS that actually ships. Replace 6 tools with one platform.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {['𝕏', 'in', '▶'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-2)', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(37,99,235,0.5)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, marginTop: 0 }}>
                {group}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(link => (
                  <Link key={link.href} href={link.href} style={{
                    fontSize: 14, color: 'var(--text-2)', textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            © {new Date().getFullYear()} TasksDone, Inc. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-3)'}
            >Privacy</Link>
            <Link href="/terms" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-3)'}
            >Terms</Link>
            <Link href="/cookies" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-3)'}
            >Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
