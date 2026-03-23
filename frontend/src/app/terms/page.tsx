'use client';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using TasksDone (the "Service") at tasksdone.cloud, you ("User") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all users, including agency owners, team members, and client portal users. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.'
  },
  {
    title: '2. Description of Service',
    content: 'TasksDone is a cloud-based agency management platform providing tools for task management, project management, client management, time tracking, invoicing, content scheduling, campaign tracking, and AI-powered features. We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.'
  },
  {
    title: '3. Account Registration',
    content: 'You must provide accurate, complete, and current information when registering. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately at security@tasksdone.cloud of any unauthorized use of your account. We reserve the right to refuse registration or cancel accounts at our discretion.'
  },
  {
    title: '4. Acceptable Use',
    content: 'You agree not to: (a) use the Service for any unlawful purpose or in violation of any regulations; (b) transmit spam, malware, or malicious code; (c) attempt to gain unauthorized access to any part of the Service; (d) reverse engineer, decompile, or disassemble any aspect of the Service; (e) use the Service to infringe the intellectual property rights of others; (f) interfere with or disrupt the Service or servers connected to it; (g) impersonate any person or entity. Violation of this section may result in immediate account termination.'
  },
  {
    title: '5. Subscription Plans and Billing',
    content: 'The Service is offered under free and paid subscription plans. Paid subscriptions are billed monthly or annually in advance. All fees are non-refundable except as required by applicable law or as stated in our Refund Policy. Annual plan holders may request a refund within 14 days of initial purchase. We reserve the right to change pricing with 30 days prior notice. Failure to pay fees may result in suspension or termination of your account.'
  },
  {
    title: '6. Free Trial',
    content: 'Paid plans may be offered with a free trial period. No credit card is required to start a trial. At the end of the trial, you must subscribe to a paid plan to continue using paid features. We reserve the right to modify or terminate free trial offers at any time.'
  },
  {
    title: '7. Data Ownership and License',
    content: 'You retain all ownership rights to the content, data, and information you submit, upload, or create within the Service ("User Content"). By using the Service, you grant TasksDone a limited, worldwide, royalty-free license to store, process, and display your User Content solely to provide and improve the Service. We do not claim ownership of your User Content and will never use it for marketing or advertising without your explicit consent.'
  },
  {
    title: '8. Intellectual Property',
    content: 'The Service, including its software, design, logos, trademarks, and content created by TasksDone, is owned by TasksDone, Inc. and protected by intellectual property laws. You may not copy, reproduce, distribute, modify, or create derivative works of any part of the Service without our prior written permission. The TasksDone name and logo are registered trademarks.'
  },
  {
    title: '9. Privacy',
    content: 'Your use of the Service is governed by our Privacy Policy, which is incorporated into these Terms by reference. By agreeing to these Terms, you also agree to our Privacy Policy.'
  },
  {
    title: '10. Third-Party Services',
    content: 'The Service may integrate with or link to third-party services (e.g., Stripe for payments, Google for authentication). Your use of those services is governed by their own terms. We are not responsible for the practices of third-party services.'
  },
  {
    title: '11. Disclaimer of Warranties',
    content: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.'
  },
  {
    title: '12. Limitation of Liability',
    content: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, TASKSDONE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID TO TASKSDONE IN THE 12 MONTHS PRECEDING THE CLAIM.'
  },
  {
    title: '13. Termination',
    content: 'Either party may terminate the agreement at any time. You may cancel your account through Settings → Billing. We may suspend or terminate your access if you violate these Terms, fail to pay fees, or for any other reason with reasonable notice. Upon termination, your access is revoked and your data is scheduled for deletion after 30 days. You may export your data before the 30-day period ends.'
  },
  {
    title: '14. Governing Law',
    content: 'These Terms are governed by the laws of Egypt, without regard to conflict of law principles. Any dispute arising from these Terms shall be resolved in the courts located in Cairo, Egypt, except where prohibited by applicable law.'
  },
  {
    title: '15. Changes to Terms',
    content: 'We may update these Terms from time to time. Material changes will be communicated by email or through the Service at least 30 days before taking effect. Your continued use of the Service after the effective date constitutes acceptance of the updated Terms.'
  },
  {
    title: '16. Contact',
    content: 'For legal inquiries or questions about these Terms, contact us at: legal@tasksdone.cloud or by mail at TasksDone, Inc., Cairo, Egypt.'
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: '#060B18', minHeight: '100vh', color: 'white' }}>
      <LandingNav />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>Legal</div>
          <h1 style={{ fontFamily: 'var(--font-outfit,Outfit)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 12, lineHeight: 1.1 }}>Terms of Service</h1>
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
