import type { Metadata } from 'next'
import LegalShell from '../_components/LegalShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — SiteForge AI',
  description: 'How SiteForge AI collects, uses, stores and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      lastUpdated="23 June 2026"
      intro={
        <>
          <p>
            This Privacy Policy explains how <span className="ph">[BUSINESS LEGAL NAME]</span> (ABN{' '}
            <span className="ph">[ABN]</span>), trading as SiteForge AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), collects, uses,
            stores and discloses your personal information. We are committed to protecting your privacy in
            accordance with the <strong>Privacy Act 1988 (Cth)</strong> and the <strong>Australian Privacy
            Principles (APPs)</strong>.
          </p>
          <p>By using our website or submitting an enquiry, you consent to the practices described in this policy.</p>
        </>
      }
      sections={[
        {
          id: 'collect',
          heading: 'Information we collect',
          body: (
            <>
              <p>We collect personal information that you provide to us directly, including when you complete our quote or intake forms. This may include:</p>
              <ul>
                <li>Your name and the name of your business</li>
                <li>Contact details — phone number and email address</li>
                <li>Business details — your trade/niche, service area or suburbs, ABN, and address</li>
                <li>Any information you include in messages or enquiries to us</li>
              </ul>
              <p>We may also automatically collect technical information when you visit our website, such as your IP address, browser type, device information, and pages visited, through cookies and analytics tools.</p>
            </>
          ),
        },
        {
          id: 'how',
          heading: 'How we collect it',
          body: <p>We collect personal information directly from you when you submit a form, email us, or otherwise communicate with us. We collect technical information automatically through your use of our website.</p>,
        },
        {
          id: 'use',
          heading: 'Why we collect and how we use it',
          body: (
            <>
              <p>We use your personal information to:</p>
              <ul>
                <li>Respond to your enquiry and provide you with a quote</li>
                <li>Build, deliver, host and maintain your website and related services</li>
                <li>Communicate with you about your account, project and subscription</li>
                <li>Send you service-related emails (such as confirmations and updates)</li>
                <li>Improve our website and services</li>
                <li>Comply with our legal obligations</li>
              </ul>
            </>
          ),
        },
        {
          id: 'disclosure',
          heading: 'Disclosure to third parties',
          body: (
            <>
              <p>We do not sell your personal information. We share it only with trusted service providers who help us operate our business, including:</p>
              <ul>
                <li><strong>Supabase</strong> — secure database hosting for your enquiry and project data</li>
                <li><strong>Vercel</strong> — website and application hosting</li>
                <li><strong>Resend</strong> — transactional email delivery</li>
                <li><strong>Google Analytics</strong> — website usage analytics</li>
              </ul>
              <p>We may also disclose your information where required or authorised by law.</p>
            </>
          ),
        },
        {
          id: 'overseas',
          heading: 'Overseas storage and disclosure',
          body: (
            <p>
              Some of our service providers store or process data outside Australia. In particular, our database
              may be hosted in <strong>Japan</strong>, and hosting, email and analytics providers may store data in
              the <strong>United States</strong> and other countries. By providing your information, you acknowledge
              that it may be stored or processed overseas. We take reasonable steps to ensure these providers handle
              your information consistently with the Australian Privacy Principles.
            </p>
          ),
        },
        {
          id: 'cookies',
          heading: 'Cookies and analytics',
          body: <p>Our website uses cookies and similar technologies to make the site work and to understand how visitors use it. You can disable cookies in your browser settings, though some features may not function as intended. We may use Google Analytics, which collects anonymised usage data subject to Google&apos;s own privacy policy.</p>,
        },
        {
          id: 'security',
          heading: 'Data security',
          body: <p>We take reasonable steps to protect your personal information from misuse, loss, and unauthorised access, including using reputable providers, encrypted connections (SSL/TLS), and restricted access controls. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>,
        },
        {
          id: 'access',
          heading: 'Access and correction',
          body: <p>You may request access to the personal information we hold about you, or ask us to correct it if it is inaccurate, out of date or incomplete. To make a request, contact us using the details below. We will respond within a reasonable time.</p>,
        },
        {
          id: 'retention',
          heading: 'Data retention',
          body: <p>We retain your personal information only for as long as necessary to provide our services, comply with our legal obligations, resolve disputes, and enforce our agreements. When it is no longer needed, we take reasonable steps to delete or de-identify it.</p>,
        },
        {
          id: 'complaints',
          heading: 'Complaints',
          body: (
            <p>
              If you believe we have breached the Australian Privacy Principles or mishandled your information,
              please contact us first so we can address your concern. If you are not satisfied with our response,
              you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at{' '}
              <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>.
            </p>
          ),
        },
        {
          id: 'changes',
          heading: 'Changes to this policy',
          body: <p>We may update this Privacy Policy from time to time. The current version will always be available on this page, with the &ldquo;last updated&rdquo; date shown above.</p>,
        },
        {
          id: 'contact',
          heading: 'Contact us',
          body: <p>For any privacy questions, requests or complaints, contact us at <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a>.</p>,
        },
      ]}
    />
  )
}
