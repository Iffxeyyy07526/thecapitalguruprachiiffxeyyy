import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const res = NextResponse.next();
  const redirectWithCookies = (target: string) => {
    const redirect = NextResponse.redirect(new URL(target, request.url));
    for (const cookie of res.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/payment");
  const isAuthOnlyRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // If env is missing in this runtime, fail safely as unauthenticated.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedRoute && pathname !== "/login") {
      return redirectWithCookies("/login");
    }
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      // Critical: write to both request and response so refreshed auth cookies persist.
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        const removeOptions: CookieOptions = { ...options, maxAge: 0 };
        request.cookies.set({ name, value: "", ...removeOptions });
        res.cookies.set({ name, value: "", ...removeOptions });
      },
    },
  });

  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    user = error ? null : data.user;
  } catch {
    user = null;
  }

  if (isProtectedRoute && !user && pathname !== "/login") {
    const nextPath = `${pathname}${request.nextUrl.search}`;
    const loginTarget = `/login?next=${encodeURIComponent(nextPath)}`;
    return redirectWithCookies(loginTarget);
  }

  if (isAuthOnlyRoute && user && pathname !== "/dashboard") {
    return redirectWithCookies("/dashboard");
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment",
    "/payment/:path*",
    "/login",
    "/register",
  ],
};
