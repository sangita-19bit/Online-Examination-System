"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import ErrorAlert from "@/components/ErrorAlert";
import { useRouter } from "next/navigation";
import { apiFetch, isAuthenticated } from "@/lib/api";

// ── Skeleton card ────────────────────────────────────────────────────────────
function ExamCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div className="skeleton" style={{ height: "1.125rem", width: "60%", borderRadius: "0.25rem" }} />
        <div className="skeleton" style={{ height: "1.125rem", width: "4rem", borderRadius: "9999px" }} />
      </div>
      <div className="skeleton" style={{ height: "0.875rem", width: "40%", borderRadius: "0.25rem", marginBottom: "1.5rem" }} />
      <div className="skeleton" style={{ height: "2.25rem", width: "100%", borderRadius: "0.375rem" }} />
    </div>
  );
}

// ── Exam card ────────────────────────────────────────────────────────────────
function ExamCard({ exam, onStart }) {
  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
    >
      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <h3
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {exam.title}
        </h3>
        <span
          className="badge badge-neutral"
          style={{ flexShrink: 0, whiteSpace: "nowrap" }}
        >
          {exam.timeLimitMinutes} min
        </span>
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {exam.category && (
          <span className="badge badge-accent">{exam.category}</span>
        )}
        {exam.questions && (
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {/* Question icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {exam.questions.length} questions
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onStart(exam.id)}
        className="btn btn-primary btn-full"
        style={{ marginTop: "auto" }}
      >
        Start Exam
      </button>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    apiFetch("/api/exams")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load exams");
        return res.json();
      })
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load exams. Please check your connection or try again.");
        setLoading(false);
      });
  }, [router]);

  const startExam = (id) => router.push(`/exam/${id}`);

  const categories = Array.from(new Set(exams.map((e) => e.category).filter(Boolean)));
  const uncategorized = exams.filter((e) => !e.category);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 700, margin: 0 }}>
              Available Exams
            </h1>
            {!loading && !error && (
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                {exams.length} exam{exams.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ marginBottom: "1.5rem" }}>
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading state — skeleton cards */}
        {loading && (
          <div>
            <div className="skeleton" style={{ height: "1rem", width: "8rem", borderRadius: "0.25rem", marginBottom: "1.25rem" }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
                gap: "1rem",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => <ExamCardSkeleton key={n} />)}
            </div>
          </div>
        )}

        {/* Loaded: categorized sections */}
        {!loading && !error && exams.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {categories.map((cat) => (
              <section key={cat}>
                {/* Section header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: 0,
                    }}
                  >
                    {cat}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                      backgroundColor: "var(--bg-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "9999px",
                      padding: "0.125rem 0.5rem",
                      fontWeight: 500,
                    }}
                  >
                    {exams.filter((e) => e.category === cat).length}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {exams
                    .filter((e) => e.category === cat)
                    .map((exam) => (
                      <ExamCard key={exam.id} exam={exam} onStart={startExam} />
                    ))}
                </div>
              </section>
            ))}

            {/* Uncategorized exams */}
            {uncategorized.length > 0 && (
              <section>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {uncategorized.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} onStart={startExam} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && exams.length === 0 && (
          <div className="card">
            <EmptyState
              title="No exams available"
              description="There are no exams available at the moment. Check back later or contact your administrator."
            />
          </div>
        )}
      </main>
    </div>
  );
}
