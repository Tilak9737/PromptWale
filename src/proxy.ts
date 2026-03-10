import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Only protect routes inside /admin (except /admin/login)
    if (path.startsWith("/admin") && path !== "/admin/login") {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            const verifiedToken = await verifyAuth(token);
            if (!verifiedToken) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
        } catch (error) {
            console.error("Middleware auth error:", error);
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
