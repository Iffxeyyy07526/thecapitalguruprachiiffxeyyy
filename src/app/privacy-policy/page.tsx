import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { META_DESC_PRIVACY } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Stock Market App Privacy Policy India",
  description: META_DESC_PRIVACY,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      breadcrumbItems={[{ name: "Privacy Policy", href: "/privacy-policy" }]}
    >
      <section>
        <h2>Data Collected</h2>
        <p>We may collect and process:</p>
        <ul>
          <li>
            <strong>Account:</strong> email address, name, and phone number when you provide them
          </li>
          <li>
            <strong>Payments:</strong> payment status and references via Razorpay; we do not store
            full card or net-banking credentials on our servers
          </li>
          <li>
            <strong>Service use:</strong> subscription status, support messages, and limited
            technical logs needed to run the app
          </li>
        </ul>
      </section>

      <section>
        <h2>How We Use Data</h2>
        <ul>
          <li>Create and secure your account (authentication, password reset)</li>
          <li>Deliver subscriptions, Telegram access, and transactional emails</li>
          <li>Process payments and respond to billing or support requests</li>
          <li>Maintain security, prevent abuse, and improve reliability of the Service</li>
        </ul>
      </section>

      <section>
        <h2>Third Party Services</h2>
        <p>We rely on processors and infrastructure partners, including:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication and application database
          </li>
          <li>
            <strong>Razorpay</strong> — payment processing
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery
          </li>
        </ul>
        <p>
          Their use of data is governed by their respective terms and privacy policies. We share
          only what is needed to provide the Service.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>
          We use HTTPS, access controls, and reputable vendors for auth and payments. No online
          service is perfectly secure; you should use a strong, unique password and protect your
          email inbox.
        </p>
      </section>

      <section>
        <h2>User Rights</h2>
        <p>
          Depending on applicable law, you may request access, correction, or deletion of personal
          data we hold. Contact us at the email below. We may need to verify your identity before
          fulfilling requests.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href="mailto:support@thecapitalguru.net">support@thecapitalguru.net</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
