import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/radar/:path*",
    "/profile/:path*",
    "/team-matcher/:path*",
    "/notice-intelligence/:path*",
    "/auth",
    "/api/:path*",
  ],
};
