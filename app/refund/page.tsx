import type { Metadata } from 'next'
import LegalShell from '../_components/LegalShell'

export const metadata: Metadata = {
  title: 'Refund Policy — SiteForge AI',
  description: 'SiteForge AI refund and cancellation policy for website subscription services.',
}

export default function RefundPage() {
  return (
    <LegalShell
      title="Refund Policy"
      lastUpdated="23 June 2026"
      intro={
        <p>
          This Refund Policy applies to the subscription services provided by{' '}
          <span className="ph">[BUSINESS LEGAL NAME]</span> (ABN <span className="ph">[ABN]</span>), trading as
          SiteForge AI. It should be read together with our <a href="/terms">Terms of Service</a>.
        </p>
      }
      sections={[
        {
          id: 'overview',
          heading: 'Overview',
          body: <p>Our services are provided on a subscription basis. Because work begins quickly and our plans bundle setup, hosting and ongoing service, the following terms apply to refunds and cancellations. This policy does not limit your rights under the Australian Consumer Law.</p>,
        },
        {
          id: 'setup',
          heading: 'Setup fees',
          body: <p>Setup fees cover the design and build of your website. Once work on your site has commenced, setup fees are <strong>non-refundable</strong>, as the work has been performed.</p>,
        },
        {
          id: 'monthly',
          heading: 'Monthly subscription fees',
          body: (
            <ul>
              <li>Monthly fees are charged in advance for the upcoming service period.</li>
              <li>Fees already paid for the current period are <strong>not pro-rated or refunded</strong> if you cancel partway through a billing cycle.</li>
              <li>After cancellation takes effect, you will not be charged for future periods.</li>
            </ul>
          ),
        },
        {
          id: 'cancellation',
          heading: 'Cancellation',
          body: (
            <p>
              To cancel, email <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a> giving at least{' '}
              <strong>30 days&apos; notice</strong>. Your subscription — and your hosted website — will remain active until
              the end of your notice period and any applicable minimum term, after which the site may be taken offline.
            </p>
          ),
        },
        {
          id: 'acl',
          heading: 'Your rights under the Australian Consumer Law',
          body: (
            <p>
              Our services come with guarantees that cannot be excluded under the <strong>Australian Consumer Law</strong>.
              If there is a <strong>major failure</strong> with our service, you may be entitled to a refund or to cancel,
              and to compensation for reasonably foreseeable loss. For a problem that is not a major failure, we will
              remedy it within a reasonable time; if we do not, you may be entitled to a refund of the difference in value.
              Nothing in this policy excludes these rights.
            </p>
          ),
        },
        {
          id: 'request',
          heading: 'How to request a refund',
          body: (
            <p>
              To request a refund or raise a concern, contact us at{' '}
              <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a> with your business name and a description
              of the issue. We aim to respond within 2 business days and will work with you to resolve it fairly.
            </p>
          ),
        },
        {
          id: 'changes',
          heading: 'Changes to this policy',
          body: <p>We may update this Refund Policy from time to time. The current version will always be available on this page.</p>,
        },
      ]}
    />
  )
}
