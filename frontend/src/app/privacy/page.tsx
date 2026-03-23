'use client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const SECTIONS = [
  {
    title: '1. Introduction',
    content: 'TasksDone, Inc. ("TasksDone", "we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at tasksdone.cloud and related services (collectively, the "Service"). By using the Service, you agree to this policy.'
  },
  {
    title: '2. Information We Collect',
    content: 'We collect information you provide directly: name, email address, agency/company name, billing details, and any content you create within the platform (tasks, projects, files, messages). We also collect usage data automatically: features used, pages visited, session duration, device type, IP address, and browser type. We use cookies and similar tracking technologies as described in our Cookie Policy.'
  },
  {
    title: '3. How We Use Your Information',
    content: 'We use your information to: (a) provide, operate, and maintain the Service; (b) process transactions and send billing-related communications; (c) send product updates, security alerts, and support messages; (d) improve the platform based on usage patterns; (e) personalize your experience; (f) comply with legal obligations. We never sell your personal data to third parties.'
  },
  {
    title: '4. Data Storage and Security',
    content: 'All data is stored on Amazon Web Services (AWS) infrastructure in encrypted form using AES-256 encryption at rest and TLS 1.3 in transit. We are working toward SOC 2 Type II certification. Data is automatically backed up every hour. Backups are retained for 30 days. Our security practices include regular penetration testing, vulnerability scanning, and access controls based on the principle of least privilege.'
  },
  {
    title: '5. Data Sharing and Disclosure',
    content: 'We share your data only with: (a) Service providers necessary to operate the platform (AWS for infrastructure, Stripe for payments, Resend for transactional email) — all bound by data processing agreements; (b) Law enforcement or regulatory authorities when required by law; (c) Successors in the event of a merger, acquisition, or asset sale, with prior notice to you. We do not sell, rent, or trade your personal information.'
  },
  {
    title: '6. Your Rights Under GDPR',
    content: 'If you are in the European Economic Area (EEA), you have the right to: access your personal data; correct inaccurate data; request erasure ("right to be forgotten"); restrict or object to processing; data portability; and withdraw consent at any time. To exercise these rights, email privacy@tasksdone.cloud. We will respond within 30 days. You also have the right to lodge a complaint with your local data protection authority.'
  },
  {
    title: '7. Your Rights Under CCPA',
    content: 'If you are a California resident, you have the right to: know what personal information is collected; know if it is sold or disclosed; opt out of the sale of personal information (we do not sell personal information); request deletion; and not be discriminated against for exercising these rights. To submit a request, email privacy@tasksdone.cloud with "CCPA Request" in the subject line.'
  },
  {
    title: '8. Data Retention',
    content: 'We retain your personal data for as long as your account is active or as needed to provide the Service. If you cancel, your data is retained for 30 days to allow export, then permanently deleted. Certain data may be retained longer to comply with legal obligations, resolve disputes, or enforce our agreements.'
  },
  {
    title: '9. International Transfers',
    content: 'Your data may be processed outside your country of residence, including in the United States and EU. We rely on Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection for data transferred from the EEA to other countries.'
  },
  {
    title: '10. Children\'s Privacy',
    content: 'The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have inadvertently collected such information, we will take steps to delete it promptly.'
  },
  {
    title: '11. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of material changes by email or by prominently posting a notice on our website at least 30 days before the change takes effect. Your continued use of the Service after the effective date constitutes acceptance of the updated policy.'
  },
  {
    title: '12. Contact Us',
    content: 'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, contact our Data Protection Officer at: privacy@tasksdone.cloud or by mail at: TasksDone, Inc., Cairo, Egypt.'
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Legal</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 12, lineHeight: 1.1 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Last updated: March 23, 2026 · Effective: March 23, 2026</p>
        </div>

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
