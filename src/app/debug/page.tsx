import Image from "next/image";
import type { Metadata } from "next";
import { BRAND_LOGO_FILES, IMAGES_DIR_FILES } from "@/lib/assets/paths";

export const metadata: Metadata = {
  title: "Asset debug",
  robots: { index: false, follow: false },
};

export default function DebugAssetsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-on-surface">
      <h1 className="font-display text-2xl font-bold text-white">
        Static asset smoke test
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Brand PNGs at <code className="text-primary">/public</code> and hero assets under{" "}
        <code className="text-primary">/public/images</code>.
      </p>

      <section className="mt-10">
        <h2 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
          Brand logos
        </h2>
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_LOGO_FILES.map((name) => (
            <li
              key={name}
              className="rounded-xl border border-white/[0.08] bg-surface-container/40 p-4"
            >
              <div className="relative flex h-32 items-center justify-center bg-black/30">
                <Image
                  src={`/${name}`}
                  alt=""
                  width={320}
                  height={120}
                  className="max-h-28 w-auto max-w-full object-contain"
                />
              </div>
              <p className="mt-3 break-all font-mono text-[11px] text-secondary">
                /{name}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
          /images
        </h2>
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGES_DIR_FILES.map((name) => (
            <li
              key={name}
              className="rounded-xl border border-white/[0.08] bg-surface-container/40 p-4"
            >
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-black/30">
                <Image
                  src={`/images/${name}`}
                  alt=""
                  width={400}
                  height={240}
                  className="max-h-36 w-auto max-w-full object-contain"
                />
              </div>
              <p className="mt-3 break-all font-mono text-[11px] text-secondary">
                /images/{name}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
