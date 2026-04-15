import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <Image
        src="/logo-icon.png"
        alt="The Capital Guru"
        width={1024}
        height={1024}
        className="mb-6 h-10 w-10 opacity-90"
      />
      <p
        className="font-display text-[120px] font-bold leading-none tracking-tight text-primary"
        aria-hidden
      >
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-white">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-secondary">
        Looks like you&apos;ve wandered into uncharted territory, trader.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/">
          <Button variant="primary" size="lg">
            Go to Homepage
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="lg" className="border border-primary/30">
            Go to Dashboard
          </Button>
        </Link>
      </div>
      <p className="mt-12 text-xs text-outline-variant">
        The floating Telegram button can connect you with support.
      </p>
    </main>
  );
}
