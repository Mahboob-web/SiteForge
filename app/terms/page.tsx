import type { Metadata } from 'next'
import LegalShell from '../_components/LegalShell'

export const metadata: Metadata = {
  title: 'Terms of Service — SiteForge AI',
  description: 'The terms governing SiteForge AI website subscription services.',
}

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      lastUpdated="23 June 2026"
      intro={
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the website services provided by{' '}
          <span className="ph">[BUSINESS LEGAL NAME]</span> (ABN <span className="ph">[ABN]</span>), trading as
          SiteForge AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By subscribing to or using our services, you agree to these Terms.
        </p>
      }
      sections={[
        {
          id: 'services',
          heading: 'Our services',
          body: <p>SiteForge AI provides a Website-as-a-Service offering: we design, build, host and maintain a website for your business, provided on a subscription basis. The specific inclusions depend on the plan you select.</p>,
        },
        {
          id: 'fees',
          heading: 'Subscription and fees',
          body: (
            <ul>
              <li>Our services are billed as a recurring <strong>monthly subscription</strong>, plus any one-off setup fee applicable to your chosen plan.</li>
              <li>Fees are stated in Australian dollars (AUD) and, where applicable, are inclusive or exclusive of GST as indicated at the time of sign-up.</li>
              <li>Payment is processed via our third-party payment provider. You authorise us to charge your nominated payment method on a recurring basis until cancelled.</li>
              <li>If a payment fails, we may suspend your website until the amount owing is paid.</li>
            </ul>
          ),
        },
        {
          id: 'term',
          heading: 'Minimum term and cancellation',
          body: (
            <ul>
              <li>Subscriptions run for an initial minimum term of <span className="ph">[e.g. 6 months]</span>, after which they continue on a month-to-month basis.</li>
              <li>You may cancel by giving at least <strong>30 days&apos; notice</strong> in writing to <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a>.</li>
              <li>Setup fees are non-refundable once work has commenced. Monthly fees already paid are not pro-rated or refunded on cancellation, except where required by the Australian Consumer Law.</li>
            </ul>
          ),
        },
        {
          id: 'included',
          heading: 'What\u2019s included',
          body: <p>While your subscription is active, we provide hosting, SSL, security, and the ongoing updates described in your plan (such as content tweaks and additional pages). Major redesigns or work outside your plan may be quoted separately.</p>,
        },
        {
          id: 'responsibilities',
          heading: 'Your responsibilities',
          body: (
            <ul>
              <li>You agree to provide accurate, complete and lawful information and content for your website.</li>
              <li>You are responsible for ensuring any materials you supply (text, images, logos, reviews) do not infringe third-party rights and are not misleading or unlawful.</li>
              <li>You must not use our services for any unlawful, harmful, or deceptive purpose.</li>
            </ul>
          ),
        },
        {
          id: 'ownership',
          heading: 'Website ownership and hosting',
          body: (
            <p>
              Because this is a managed subscription service, your website is hosted and maintained within our
              infrastructure while your subscription is active. The content you supply remains yours. On cancellation,
              the hosted website may be taken offline. Any arrangement to transfer or export the site is at our
              discretion and may be subject to a separate fee, as agreed in writing.
            </p>
          ),
        },
        {
          id: 'domains',
          heading: 'Domains',
          body: <p>We can help you register or connect a domain name. Where you own a domain, you remain responsible for its registration and renewal. Domain registration fees are separate from your subscription.</p>,
        },
        {
          id: 'disclaimers',
          heading: 'Disclaimers',
          body: <p>We provide our services with reasonable care and skill. However, we do not guarantee specific search rankings, traffic, leads, or business outcomes, as these depend on factors outside our control.</p>,
        },
        {
          id: 'acl',
          heading: 'Australian Consumer Law',
          body: (
            <p>
              Nothing in these Terms excludes, restricts or modifies any consumer guarantee, right or remedy that you
              have under the <strong>Australian Consumer Law</strong> and that cannot lawfully be excluded. Where our
              liability cannot be excluded, it is limited (to the extent permitted) to re-supplying the services or
              paying the cost of having the services re-supplied.
            </p>
          ),
        },
        {
          id: 'liability',
          heading: 'Limitation of liability',
          body: <p>To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential loss arising from your use of our services. Our total liability to you is limited to the amount you have paid us in the 12 months preceding the relevant claim.</p>,
        },
        {
          id: 'termination',
          heading: 'Termination by us',
          body: <p>We may suspend or terminate your service if you breach these Terms, fail to pay, or use the service unlawfully. We will give reasonable notice where practicable.</p>,
        },
        {
          id: 'law',
          heading: 'Governing law',
          body: <p>These Terms are governed by the laws of <span className="ph">[STATE/TERRITORY]</span>, Australia, and you submit to the non-exclusive jurisdiction of its courts.</p>,
        },
        {
          id: 'changes',
          heading: 'Changes to these Terms',
          body: <p>We may update these Terms from time to time. The current version will always be available on this page. Continued use of our services after changes constitutes acceptance.</p>,
        },
        {
          id: 'contact',
          heading: 'Contact',
          body: <p>Questions about these Terms? Email <a href="mailto:hello@siteforge.com.au">hello@siteforge.com.au</a>.</p>,
        },
      ]}
    />
  )
}
