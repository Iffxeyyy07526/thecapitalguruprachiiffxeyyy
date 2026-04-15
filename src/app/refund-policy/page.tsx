import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { META_DESC_REFUND } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Trading Subscription Refund Policy India",
  description: META_DESC_REFUND,
  alternates: { canonical: "/refund-policy" },
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      title="Refund Policy"
      breadcrumbItems={[{ name: "Refund Policy", href: "/refund-policy" }]}
    >
      <section>
        <h2>General Policy</h2>
        <p>
          <strong>All purchases are final and non-refundable</strong> except as stated below. The
          Service delivers digital access; once access is provided, fees are earned.
        </p>
      </section>

      <section>
        <h2>Exception: Telegram Access</h2>
        <p>
          If your <strong>Telegram invite link was not delivered within 24 hours</strong> of
          confirmed payment, you may be eligible for a refund review. &ldquo;Confirmed payment&rdquo;
          means we have recorded a successful charge for your plan.
        </p>
      </section>

      <section>
        <h2>How to Claim</h2>
        <p>
          Email{" "}
          <a href="mailto:support@thecapitalguru.net">support@thecapitalguru.net</a> within{" "}
          <strong>48 hours</strong> of payment with your <strong>payment ID</strong> (Razorpay order
          or payment reference) and the email used on your account. Late requests may be declined.
        </p>
      </section>

      <section>
        <h2>Payment Processor</h2>
        <p>
          <strong>Razorpay</strong> is our payment processor. We do not store your full card or
          banking details. Refunds, when approved, are initiated according to Razorpay and your
          bank or card issuer timelines.
        </p>
      </section>

      <section>
        <h2>Refund Timeline</h2>
        <p>
          If a refund is approved, it is typically completed within <strong>5–7 business days</strong>
          . Timing can vary by bank or payment method. We will confirm by email when a refund is
          initiated where practicable.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          <a href="mailto:support@thecapitalguru.net">support@thecapitalguru.net</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
