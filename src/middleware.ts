import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(request: NextRequest) {
    // Only protect routes inside /admin
    const path = request.nextUrl.pathname;

    if (path.startsWith("/admin") && path !== "/admin/login") {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            // Edge-compatible verification using jose
            const verifiedToken = await verifyAuth(token);

            if (!verifiedToken) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
        } catch (error) {
            console.error("Middleware auth catch:", error);
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", path);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
