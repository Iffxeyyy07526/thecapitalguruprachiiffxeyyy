import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { META_DESC_TERMS } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Trading Signals Terms of Service India",
  description: META_DESC_TERMS,
  alternates: { canonical: "/terms-of-service" },
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      breadcrumbItems={[{ name: "Terms of Service", href: "/terms-of-service" }]}
    >
      <section>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using The Capital Guru (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the
          Service&rdquo;) at thecapitalguru.net, you agree to these Terms of Service. If you do not
          agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2>Services Description</h2>
        <p>
          We provide stock market signals and related educational content focused on Indian markets
          (NSE/BSE). Signals are distributed through a private Telegram channel after you subscribe
          and we confirm payment. The Service is informational and educational; it is not
          personalized investment advice.
        </p>
      </section>

      <section>
        <h2>Payment Terms</h2>
        <p>
          Fees are shown at checkout in Indian Rupees (INR), including applicable taxes where
          required. Payments are processed by Razorpay. You authorize us and our payment partner to
          charge the method you provide for the selected plan. Failed or reversed payments may delay
          or revoke access until resolved.
        </p>
      </section>

      <section>
        <h2>Subscription &amp; Access</h2>
        <p>
          Access is tied to your subscription period and successful payment verification. Telegram
          access is personal to you: do not share invites, links, or credentials. We may change plan
          features or pricing with notice where required; existing prepaid periods are generally
          honored for the term you paid for unless otherwise stated.
        </p>
      </section>

      <section>
        <h2>Prohibited Uses</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for unlawful purposes or in violation of exchange or regulatory rules</li>
          <li>Scrape, reverse engineer, or attempt to bypass access controls</li>
          <li>Resell, redistribute, or publicly republish signals or channel content</li>
          <li>Harass staff, members, or third parties in connection with the Service</li>
        </ul>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, The Capital Guru and its operators are not liable
          for any indirect, incidental, special, consequential, or punitive damages, or for loss of
          profits, data, or goodwill, arising from your use of the Service or reliance on any
          content or signals. Our total liability for any claim relating to the Service is limited
          to the amount you paid us in the twelve (12) months before the claim, unless applicable law
          requires otherwise.
        </p>
      </section>

      <section>
        <h2>Governing Law (India)</h2>
        <p>
          These terms are governed by the laws of India. Courts at Mumbai, Maharashtra shall have
          exclusive jurisdiction, subject to any mandatory consumer protections that apply where you
          live.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href="mailto:mahir@thecapitalguru.net">mahir@thecapitalguru.net</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
