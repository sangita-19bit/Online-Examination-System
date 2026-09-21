"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import ErrorAlert from "@/components/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { apiFetch, getUsername, isAuthenticated } from "@/lib/api";

// ── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  const isPass = pct >= 50;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.5rem 1.25rem",
      }}
    >
      <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
        {/* Track */}
        <circle cx="44" cy="44" r={radius} fill="none" stroke="var(--bg-2)" strokeWidth="7" />
        {/* Progress */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={isPass ? "var(--success)" : "var(--error)"}
          strokeWidth="7"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Text */}
        <text
          x="44"
          y="44"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="15"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {pct}%
        </text>
      </svg>
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        {score} / {total}
      </span>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  const [expanded, setExpanded] = useState(false);

  const pct = result.totalQuestions > 0
    ? Math.round((result.score / result.totalQuestions) * 100)
    : 0;
  const isPass = pct >= 50;

  const correct = result.details ? result.details.filter(d => d.userAnswer === d.correctAnswer).length : result.score;
  const incorrect = result.details ? result.details.filter(d => d.userAnswer && d.userAnswer !== d.correctAnswer).length : 0;
  const unanswered = result.details ? result.details.filter(d => !d.userAnswer).length : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Summary row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Score ring */}
        <ScoreRing score={result.score} total={result.totalQuestions} />

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: "10rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.25rem",
            }}
          >
            {result.examTitle}
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            {formatDate(result.completedAt)}
          </p>

          {/* Stats pills */}
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--success)", fontWeight: 500 }}>
              ✓ {correct} correct
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: "0.8125rem", color: "var(--error)", fontWeight: 500 }}>
              ✗ {incorrect} incorrect
            </span>
            {unanswered > 0 && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
                  — {unanswered} skipped
                </span>
              </>
            )}
          </div>
        </div>

        {/* Pass/fail badge + expand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <span className={`badge ${isPass ? "badge-success" : "badge-error"}`}>
            {isPass ? "Passed" : "Needs review"}
          </span>

          {result.details && result.details.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="btn btn-ghost btn-sm"
              aria-expanded={expanded}
              aria-label={expanded ? "Hide detailed review" : "Show detailed review"}
            >
              {expanded ? "Hide" : "Review"}
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Detailed review */}
      {expanded && result.details && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            padding: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            Detailed Review
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {result.details.map((detail, idx) => {
              const isCorrect = detail.userAnswer && detail.userAnswer === detail.correctAnswer;
              const isSkipped = !detail.userAnswer;

              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: "1.125rem 1.25rem",
                    borderLeft: `3px solid ${isSkipped ? "var(--border-strong)" : isCorrect ? "var(--success)" : "var(--error)"}`,
                    borderRadius: "0.5rem",
                  }}
                >
                  {/* Question */}
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                      marginBottom: "0.875rem",
                      lineHeight: 1.55,
                    }}
                  >
                    <span style={{ color: "var(--text-tertiary)", fontWeight: 400, marginRight: "0.375rem" }}>
                      Q{idx + 1}.
                    </span>
                    {detail.questionText}
                  </p>

                  {/* Answer columns */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.625rem",
                    }}
                  >
                    {/* Your answer */}
                    <div
                      style={{
                        padding: "0.625rem 0.875rem",
                        borderRadius: "0.375rem",
                        backgroundColor: isSkipped ? "var(--bg-2)" : isCorrect ? "var(--success-bg)" : "var(--error-bg)",
                        border: `1px solid ${isSkipped ? "var(--border)" : isCorrect ? "var(--success-border)" : "var(--error-border)"}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-tertiary)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Your answer
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: isSkipped ? "var(--text-tertiary)" : isCorrect ? "var(--success)" : "var(--error)",
                          fontStyle: isSkipped ? "italic" : "normal",
                        }}
                      >
                        {detail.userAnswer || "Not answered"}
                      </p>
                    </div>

                    {/* Correct answer */}
                    <div
                      style={{
                        padding: "0.625rem 0.875rem",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--success-bg)",
                        border: "1px solid var(--success-border)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-tertiary)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Correct answer
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--success)",
                        }}
                      >
                        {detail.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = getUsername();
    if (!isAuthenticated() || !user) {
      router.push("/");
      return;
    }

    apiFetch(`/api/results/${user}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch results");
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load results. Please try again.");
        setLoading(false);
      });
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, margin: 0 }}>
            Exam Results
          </h1>
          {!loading && !error && results.length > 0 && (
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              {results.length} attempt{results.length !== 1 ? "s" : ""} on record
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: "1.5rem" }}>
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner label="Loading results…" />}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && (
          <div className="card">
            <EmptyState
              title="No results yet"
              description="You haven't completed any exams yet. Head to the exams page to get started."
              action={
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/dashboard")}
                >
                  Browse exams
                </button>
              }
            />
          </div>
        )}

        {/* Results list */}
        {!loading && !error && results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
