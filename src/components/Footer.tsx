import Link from "next/link";
import Logo from "@/components/ui/logo";
import {
  SOCIAL_TELEGRAM_HANDLE,
  SOCIAL_TELEGRAM_URL,
} from "@/lib/social";

const footerLinks = {
  product: [
    { label: "Signals", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Financial Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer id="footer" className="bg-[#080A09] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {/* Brand & Mission */}
          <div className="lg:col-span-1 space-y-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo className="brightness-[1.2]" />
            </Link>
            <p className="text-sm font-medium text-on-surface-muted leading-relaxed max-w-sm">
              The leading trading signal platform for the Indian stock market. High-accuracy research and signals for retail traders.
            </p>
            <div className="pt-4">
              <a
                href={SOCIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-primary shadow-glow-primary animate-pulse" />
                <span>Contact Support</span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.4em] mb-10 font-mono">
              Product
            </h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold text-on-surface-muted hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.4em] mb-10 font-mono">
              Legal
            </h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold text-on-surface-muted hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.4em] mb-10 font-mono">
              Support
            </h4>
            <ul className="space-y-5">
              <li>
                <div className="text-[9px] font-bold text-on-surface-muted/50 uppercase tracking-widest mb-1.5 font-mono">Email Us</div>
                <a
                  href="mailto:mahir@thecapitalguru.net"
                  className="text-xs font-bold text-white hover:text-primary transition-colors"
                >
                  mahir@thecapitalguru.net
                </a>
              </li>
              <li>
                <div className="text-[9px] font-bold text-on-surface-muted/50 uppercase tracking-widest mb-1.5 font-mono">Telegram Help</div>
                <a
                  href={SOCIAL_TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white hover:text-primary transition-colors"
                >
                  {SOCIAL_TELEGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-24 lg:mt-32 pt-10 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <p className="text-[9px] font-bold text-on-surface-muted uppercase tracking-[0.2em] font-mono">
              &copy; 2026 The Capital Guru // Guaranteed Support
            </p>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/[0.05]" />
            <p className="text-[9px] font-bold text-on-surface-muted uppercase tracking-[0.2em] font-mono">
              Premium Stock Market Research
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg">
             <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary animate-pulse" />
             <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-[0.2em] font-mono">System Status: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
