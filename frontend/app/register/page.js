"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, setAuthCookies } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthCookies(data.token, data.username);
        router.push("/dashboard");
      } else {
        setError(data.message || "Registration failed. Please try again.");
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
            Create your account
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
            Get started with Blink Exam today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: "1.25rem" }}>
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {/* Full Name (optional) */}
            <div>
              <label htmlFor="reg-fullname" className="label">
                Full name{" "}
                <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="reg-fullname"
                type="text"
                autoComplete="name"
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="John Doe"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="reg-username" className="label">
                Username <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <input
                id="reg-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="e.g. student_123"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label">
                Password <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <input
                id="reg-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Min. 4 characters"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="label">
                Confirm password <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input${passwordMismatch ? " input-error" : ""}`}
                placeholder="Re-enter your password"
                aria-describedby={passwordMismatch ? "password-mismatch" : undefined}
              />
              {passwordMismatch && (
                <p
                  id="password-mismatch"
                  role="alert"
                  style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "var(--error)" }}
                >
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password || passwordMismatch}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: "0.25rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: "1rem", height: "1rem", borderWidth: "2px" }} />
                  Creating account…
                </>
              ) : (
                "Create account"
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
          Already have an account?{" "}
          <Link
            href="/"
            style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent)")}
          >
            Sign in
          </Link>
        </p>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
        Blink Exam — Professional MCQ Examination Platform
      </p>
    </div>
  );
}
