/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: "/logo-transparent.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logo-horizontal.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logo-horizontal-black.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logo-horizontal-white.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logo-app-icon.png",
        destination: "/logo-mark.jpg",
        permanent: true,
      },
      {
        source: "/logo-watermark.png",
        destination: "/logo-icon.jpg",
        permanent: true,
      },
      {
        source: "/logo-pill.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logo-stacked.png",
        destination: "/logo-icon.jpg",
        permanent: true,
      },
      {
        source: "/logo-mono-black.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logo-mono-white.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-horizontal.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-horizontal-black.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-horizontal-white.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-symbol.png",
        destination: "/logo-icon.jpg",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-favicon.png",
        destination: "/logo-mark.jpg",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-apple-touch.png",
        destination: "/logo-mark.jpg",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-app-icon.png",
        destination: "/logo-mark.jpg",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-watermark.png",
        destination: "/logo-icon.jpg",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-stacked.png",
        destination: "/logo-icon.jpg",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-mono-black.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-mono-white.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/logos/capital-guru-pill.png",
        destination: "/logo-main.png",
        permanent: true,
      },
      {
        source: "/hero.png",
        destination: "/images/capital-guru-hero.png",
        permanent: true,
      },
      {
        source: "/hero-fallback.png",
        destination: "/images/hero-fallback.png",
        permanent: true,
      },
      {
        source: "/hero-fallback.svg",
        destination: "/images/hero-fallback.svg",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thecapitalguru.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
      {
        protocol: "https",
        hostname: "razorpay.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com https://cdn.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://checkout.razorpay.com https://razorpay.com https://*.razorpay.com",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://api.razorpay.com https://checkout.razorpay.com https://lumberjack.razorpay.com https://api.resend.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
