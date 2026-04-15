import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null | undefined;

const getPublicEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anonKey };
};

export function getSupabaseClient(): SupabaseClient | null {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const { url, anonKey } = getPublicEnv();
  const isMissingEnv = !url || !anonKey;

  if (isMissingEnv) {
    // Keep builds and server-side module evaluation safe.
    if (typeof window === "undefined") {
      browserClient = null;
      return browserClient;
    }

    throw new Error(
      "Supabase browser client initialization failed: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}

// Backward-compatible alias for existing code.
export function createClient(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase browser client is unavailable on the server/build runtime. Use createServerSupabaseClient() in server code."
    );
  }
  return client;
}
