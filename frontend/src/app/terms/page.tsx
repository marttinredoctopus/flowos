'use client';
export const dynamic = 'force-dynamic';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <LandingNav />
      <div style={{ paddingTop: 100 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 40 }}>Last updated: March 14, 2025</p>
          {[
            { title: '1. Acceptance of Terms', content: 'By using TasksDone, you agree to these Terms of Service. If you do not agree, do not use the service. These terms apply to all users, including agency owners, team members, and client users.' },
            { title: '2. Use of the Service', content: 'You may use TasksDone for lawful business purposes only. You may not use the service to violate any laws, infringe intellectual property, or send spam. We reserve the right to suspend accounts violating these terms.' },
            { title: '3. Subscription & Payment', content: 'Paid plans are billed monthly or annually. Prices may change with 30 days notice. Refunds are provided for annual plans within 14 days of purchase. No refunds for monthly plans.' },
            { title: '4. Data Ownership', content: 'You own your data. We do not claim ownership of any content you create or upload. You may export your data at any time. Upon account deletion, data is permanently removed within 30 days.' },
            { title: '5. Intellectual Property', content: 'TasksDone and its logos, design, and software are owned by TasksDone, Inc. You may not copy, reproduce, or distribute any part of the service without written permission.' },
            { title: '6. Limitation of Liability', content: 'TasksDone is provided "as is". We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid in the 12 months preceding the claim.' },
            { title: '7. Termination', content: 'Either party may terminate the service agreement at any time. Upon termination, your access is revoked and data is scheduled for deletion after 30 days.' },
            { title: '8. Contact', content: 'For legal inquiries, contact legal@tasksdone.cloud.' },
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
