import { NextResponse } from "next/server";
import {
  createFlyerEditorSessionToken,
  flyerEditorSessionCookieName,
  isFlyerEditorCredentialsValid,
} from "../../../../lib/flyerAuth";

export const runtime = "nodejs";

type LoginRequestBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let payload: LoginRequestBody;

  try {
    payload = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: "A valid JSON body is required.",
      },
      { status: 400 },
    );
  }

  const username = payload.username?.trim() || "";
  const password = payload.password || "";

  if (!isFlyerEditorCredentialsValid(username, password)) {
    return NextResponse.json(
      {
        error: "Invalid username or password.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
  });

  response.cookies.set({
    name: flyerEditorSessionCookieName,
    value: createFlyerEditorSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
