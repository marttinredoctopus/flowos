import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 40 }}>Last updated: March 14, 2025</p>
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly (name, email, agency details), usage data (features used, session duration), and technical data (IP address, browser type) to provide and improve the service.' },
            { title: '2. How We Use Your Information', content: 'We use your data to provide TasksDone services, send you product updates and security alerts, improve the platform, and personalize your experience. We never sell your data to third parties.' },
            { title: '3. Data Storage & Security', content: 'All data is stored on AWS servers with AES-256 encryption at rest and in transit. We are SOC 2 Type II compliant. Data is backed up every hour and retained for 30 days.' },
            { title: '4. Data Sharing', content: 'We only share your data with trusted service providers necessary to operate the service (AWS for hosting, Stripe for payments, Resend for email). All providers are bound by data processing agreements.' },
            { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your data at any time. You can export all your data from Settings → Export. To request deletion, email privacy@tasksdone.cloud.' },
            { title: '6. Cookies', content: 'We use essential cookies for authentication and preference storage, and analytics cookies (opt-out available) to understand how users interact with the platform.' },
            { title: '7. Contact', content: 'Questions about this policy? Email us at privacy@tasksdone.cloud.' },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{section.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </article>
      </div>
      <LandingFooter />
    </div>
  );
}
