"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { flyerEditorPath } from "../lib/flyerAuth";

function resolveNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return flyerEditorPath;
  }

  return value;
}

export function FlyerEditorLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveNextPath(searchParams.get("next"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/flyer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let message = "Invalid username or password.";

        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) {
            message = payload.error;
          }
        } catch {
          // Keep the generic error message.
        }

        throw new Error(message);
      }

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in to the flyer editor.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flyer-login-shell">
      <div className="flyer-login-card">
        <p className="flyer-editor-kicker">Private Access</p>
        <h1>Flyer editor sign in</h1>
        <p>Use the editor credentials to open the private publishing workspace.</p>

        {errorMessage ? <p className="flyer-editor-error">{errorMessage}</p> : null}

        <form className="flyer-login-form" onSubmit={handleSubmit}>
          <label className="flyer-editor-field">
            <span>Username</span>
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="flyer-editor-field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Open Editor"}
          </button>
        </form>
      </div>
    </section>
  );
}
