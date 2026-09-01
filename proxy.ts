import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  flyerEditorLoginPath,
  flyerEditorPath,
  flyerEditorSessionCookieName,
  hasValidFlyerEditorSessionToken,
  scholarDataEditorLoginPath,
  scholarDataEditorPath,
} from "./app/lib/flyerAuth";

function resolveEditorArea(pathname: string) {
  if (pathname.startsWith(scholarDataEditorPath)) {
    return { editorPath: scholarDataEditorPath, loginPath: scholarDataEditorLoginPath };
  }

  return { editorPath: flyerEditorPath, loginPath: flyerEditorLoginPath };
}

function buildLoginRedirectUrl(request: NextRequest, loginPath: string) {
  const loginUrl = new URL(loginPath, request.url);
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", requestedPath);
  return loginUrl;
}

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(flyerEditorSessionCookieName)?.value;
  const { editorPath, loginPath } = resolveEditorArea(request.nextUrl.pathname);
  const isLoginPath = request.nextUrl.pathname === loginPath;

  if (hasValidFlyerEditorSessionToken(sessionToken)) {
    if (isLoginPath) {
      return NextResponse.redirect(new URL(editorPath, request.url));
    }

    return NextResponse.next();
  }

  if (isLoginPath) {
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

  return NextResponse.redirect(buildLoginRedirectUrl(request, loginPath));
}

export const config = {
  matcher: [
    "/flyer/edit/:path*",
    "/flyer/edit-7b1c4e9d/:path*",
    "/scholar-data/edit/:path*",
    "/api/flyers/:slug/versions",
  ],
};
