"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, setAuthCookies } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthCookies(data.token, data.username);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)",
        padding: "1.5rem",
      }}
    >
      {/* Card */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "24rem",
          padding: "2.5rem 2rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.375rem",
                backgroundColor: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>B</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-primary)" }}>
              Blink Exam
            </span>
          </div>

          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.375rem", color: "var(--text-primary)" }}>
            Sign in to your account
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: "1.25rem" }}>
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div>
              <label htmlFor="login-username" className="label">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                required
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="e.g. student_123"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: "0.25rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: "1rem", height: "1rem", borderWidth: "2px" }} />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent)")}
          >
            Create account
          </Link>
        </p>
      </div>

      {/* Footer tagline */}
      <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
        Blink Exam — Professional MCQ Examination Platform
      </p>
    </div>
  );
}
