import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { META_DESC_DISCLAIMER } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "SEBI Disclaimer & Indian Trading Signals Legal Notice",
  description: META_DESC_DISCLAIMER,
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      breadcrumbItems={[{ name: "Disclaimer", href: "/disclaimer" }]}
    >
      <div className="legal-callout -mt-2 mb-2 rounded-xl border border-primary/25 bg-primary/5 px-5 py-5 sm:px-6">
        <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Important
        </p>
        <p className="mt-2 text-[15px] leading-[1.8] text-secondary">
          <strong>The Capital Guru is NOT a SEBI-registered investment advisor.</strong> We do not
          provide personalized investment advice or portfolio management regulated by SEBI.
        </p>
      </div>

      <section>
        <h2>Educational &amp; Informational Purpose</h2>
        <p>
          <strong>All signals are purely for educational and informational purposes.</strong> They
          are not a recommendation, solicitation, or offer to buy or sell any security. Nothing on
          this site or in our channels is tailored to your financial situation or objectives.
        </p>
      </section>

      <section>
        <h2>No Guarantee of Results</h2>
        <p>
          <strong>Past performance does not guarantee future results.</strong> Markets involve
          substantial risk. Any statistics or examples we share are illustrative and not a promise of
          future outcomes.
        </p>
      </section>

      <section>
        <h2>Risk &amp; Responsibility</h2>
        <p>
          <strong>Users trade at their own risk.</strong>{" "}
          <strong>We are not responsible for any financial losses</strong> arising from use of our
          signals, content, or platform, including delays, errors, or omissions.
        </p>
      </section>

      <section>
        <h2>Professional Advice</h2>
        <p>
          <strong>Consult a SEBI-registered advisor before investing</strong> if you need advice
          suited to your goals, risk tolerance, and applicable regulations.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this disclaimer:{" "}
          <a href="mailto:support@thecapitalguru.net">support@thecapitalguru.net</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
