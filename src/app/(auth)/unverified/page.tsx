import { AuthLayout } from "@/components/auth/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function UnverifiedPage() {
  return (
    <AuthLayout>
      <Card className="p-10 lg:p-12 bg-white/[0.02] border-white/[0.08] backdrop-blur-3xl shadow-2xl animate-fade-in relative z-10 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-primary shadow-glow-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
            Verify Your Inbox
          </h1>
          <p className="text-xs font-bold text-on-surface-muted uppercase tracking-[0.2em]">
            Operational Security Requirement
          </p>
        </div>

        <p className="text-sm text-on-surface-muted leading-relaxed font-medium mb-10">
          We&apos;ve sent a secure verification protocol link to your email address. 
          Please confirm your identity to activate terminal access.
        </p>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button variant="primary" fullWidth size="lg" className="font-bold">
              Return to Login
            </Button>
          </Link>
          <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-widest pt-4">
            Didn&apos;t receive the protocol? <br />
            <span className="text-primary cursor-pointer hover:underline mt-2 inline-block">Request Resend</span>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
}
