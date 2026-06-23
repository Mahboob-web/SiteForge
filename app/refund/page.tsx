import type { Metadata } from 'next'
import LegalShell from '../_components/LegalShell'

export const metadata: Metadata = {
  title: 'Refund Policy — SiteForge AI',
  description: 'SiteForge AI refund and cancellation policy for website subscription services.',
}

export default function RefundPage() {
  return (
    <LegalShell title="Refund Policy" lastUpdated="23 June 2026">
      <p>
        This Refund Policy applies to the subscription services provided by{' '}
        <span className="ph">[BUSINESS LEGAL NAME]</span> (ABN <span className="ph">[ABN]</span>), trading as
        SiteForge AI. It should be read together with our{' '}
        <a href="/terms">Terms of Service</a>.
      </p>

      <h2>1. Overview</h2>
      <p>Our services are provided on a subscription basis. Because work begins quickly and our plans bundle setup, hosting and ongoing service, the following terms apply to refunds and cancellations. This policy does not limit your rights under the Australian Consumer Law (see section 5).</p>

      <h2>2. Setup fees</h2>
      <p>Setup fees cover the design and build of your website. Once work on your site has commenced, setup fees are <strong>non-refundable</strong>, as the work has been performed.</p>

      <h2>3. Monthly subscription fees</h2>
      <ul>
        <li>Monthly fees are charged in advance for the upcoming service period.</li>
        <li>Fees already paid for the current period are <strong>not pro-rated or refunded</strong> if you cancel partway through a billing cycle.</li>
        <li>After cancellation takes effect, you will not be charged for future periods.</li>
      </ul>

      <h2>4. Cancellation</h2>
      <p>
        To cancel, email <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a> giving at least
        <strong> 30 days&apos; notice</strong>. Your subscription — and your hosted website — will remain active until
        the end of your notice period and any applicable minimum term, after which the site may be taken offline.
      </p>

      <h2>5. Your rights under the Australian Consumer Law</h2>
      <p>
        Our services come with guarantees that cannot be excluded under the <strong>Australian Consumer Law</strong>.
        If there is a <strong>major failure</strong> with our service, you may be entitled to a refund or to cancel,
        and to compensation for reasonably foreseeable loss. For a problem that is not a major failure, we will
        remedy it within a reasonable time; if we do not, you may be entitled to a refund of the difference in value.
        Nothing in this policy excludes these rights.
      </p>

      <h2>6. How to request a refund</h2>
      <p>
        To request a refund or raise a concern, contact us at{' '}
        <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a> with your business name and a description
        of the issue. We aim to respond within 2 business days and will work with you to resolve it fairly.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>We may update this Refund Policy from time to time. The current version will always be available on this page.</p>
    </LegalShell>
  )
}
