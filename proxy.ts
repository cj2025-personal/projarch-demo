import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  flyerEditorLoginPath,
  flyerEditorPath,
  flyerEditorSessionCookieName,
  hasValidFlyerEditorSessionToken,
} from "./app/lib/flyerAuth";

function buildLoginRedirectUrl(request: NextRequest) {
  const loginUrl = new URL(flyerEditorLoginPath, request.url);
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", requestedPath);
  return loginUrl;
}

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(flyerEditorSessionCookieName)?.value;

  if (hasValidFlyerEditorSessionToken(sessionToken)) {
    if (request.nextUrl.pathname === flyerEditorLoginPath) {
      return NextResponse.redirect(new URL(flyerEditorPath, request.url));
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname === flyerEditorLoginPath) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  return NextResponse.redirect(buildLoginRedirectUrl(request));
}

export const config = {
  matcher: ["/flyer/edit/:path*", "/flyer/edit-7b1c4e9d/:path*", "/api/flyers/:slug/versions"],
};
