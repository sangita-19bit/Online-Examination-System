"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getUsername, isAuthenticated } from "@/lib/api";
import Modal from "@/components/Modal";
import ErrorAlert from "@/components/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";

// ── Timer display ────────────────────────────────────────────────────────────
function Timer({ seconds }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  const isWarning = seconds < 60;

  return (
    <div
      role="timer"
      aria-label={`Time remaining: ${m} minutes ${s} seconds`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.3125rem 0.75rem",
        borderRadius: "0.375rem",
        border: "1px solid",
        borderColor: isWarning ? "var(--error-border)" : "var(--border)",
        backgroundColor: isWarning ? "var(--error-bg)" : "var(--bg-2)",
        fontVariantNumeric: "tabular-nums",
        fontWeight: 600,
        fontSize: "0.9375rem",
        color: isWarning ? "var(--error)" : "var(--text-primary)",
        transition: "all 0.3s",
      }}
    >
      {/* Clock icon */}
      <svg
        aria-hidden="true"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="timer">{m}:{s}</span>
    </div>
  );
}

// ── Question palette button ───────────────────────────────────────────────────
function PaletteButton({ number, isAnswered, isCurrent, onClick }) {
  const classes = [
    "q-btn",
    isAnswered ? "answered" : "",
    isCurrent ? "current" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      aria-label={`Question ${number}${isAnswered ? ", answered" : ", not answered"}${isCurrent ? ", current" : ""}`}
      aria-current={isCurrent ? "true" : undefined}
    >
      {number}
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ExamPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Ref to hold current answers for auto-submit (avoids stale closure)
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ── Load exam ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    apiFetch(`/api/exams/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Exam not found");
        return res.json();
      })
      .then((data) => {
        setExam(data);
        setTimeLeft(data.timeLimitMinutes * 60);
      })
      .catch((err) => {
        console.error(err);
        router.push("/dashboard");
      });
  }, [id, router]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === null || isSubmitting) return;

    if (timeLeft <= 0) {
      doSubmit(answersRef.current);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitting]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Submit logic ───────────────────────────────────────────────────────────
  const doSubmit = useCallback(
    async (finalAnswers) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setSubmitError("");
      setShowConfirmModal(false);

      const username = getUsername();
      try {
        const response = await apiFetch(`/api/exams/${id}/submit`, {
          method: "POST",
          body: JSON.stringify({ username, answers: finalAnswers }),
        });

        if (response.ok) {
          router.push("/results");
        } else {
          setSubmitError("Submission failed. Please try again.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error(err);
        setSubmitError("Network error. Please check your connection and try again.");
        setIsSubmitting(false);
      }
    },
    [id, router, isSubmitting]
  );

  const handleSubmitRequest = () => {
    if (isSubmitting) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    doSubmit(answers);
  };

  // ── Answer selection ───────────────────────────────────────────────────────
  const setAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = (index) => setCurrentIndex(index);
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (!exam) return;
    setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1));
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!exam || timeLeft === null) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size="lg" label="Loading exam…" />
      </div>
    );
  }

  const questions = exam.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Exam title */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <div
              style={{
                width: "1.875rem",
                height: "1.875rem",
                borderRadius: "0.375rem",
                backgroundColor: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 700 }}>B</span>
            </div>
            <h1
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                margin: 0,
              }}
            >
              {exam.title}
            </h1>
          </div>

          {/* Timer + Submit */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <Timer seconds={timeLeft} />
            <button
              onClick={handleSubmitRequest}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: "0.9rem", height: "0.9rem", borderWidth: "2px" }} />
                  Submitting…
                </>
              ) : (
                "Submit exam"
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Submit error ──────────────────────────────────────────────────────── */}
      {submitError && (
        <div style={{ maxWidth: "72rem", margin: "1rem auto", padding: "0 1.5rem" }}>
          <ErrorAlert message={submitError} />
        </div>
      )}

      {/* ── Main layout: sidebar + question ──────────────────────────────────── */}
      <div
        className="exam-layout"
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "1.5rem",
          display: "grid",
          gridTemplateColumns: "13rem 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* ── Question palette sidebar ────────────────────────────────────────── */}
        <aside
          className="card exam-palette"
          style={{
            padding: "1.25rem",
            position: "sticky",
            top: "5rem",
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
            Questions
          </p>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "0.1875rem", backgroundColor: "var(--accent)" }} />
              Answered
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "0.1875rem", backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
              Not answered
            </div>
          </div>

          {/* Grid of question buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.375rem",
            }}
          >
            {questions.map((q, i) => (
              <PaletteButton
                key={q.id}
                number={i + 1}
                isAnswered={Boolean(answers[q.id])}
                isCurrent={i === currentIndex}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {/* Progress summary */}
          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              fontSize: "0.8125rem",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>Answered</span>
              <span style={{ fontWeight: 600, color: "var(--success)" }}>{answeredCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Remaining</span>
              <span style={{ fontWeight: 600, color: unansweredCount > 0 ? "var(--text-primary)" : "var(--success)" }}>
                {unansweredCount}
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                marginTop: "0.875rem",
                height: "0.25rem",
                borderRadius: "9999px",
                backgroundColor: "var(--bg-2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "9999px",
                  backgroundColor: "var(--accent)",
                  width: `${(answeredCount / totalQuestions) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </aside>

        {/* ── Question area ───────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Question card */}
          <div
            className="card"
            style={{ padding: "2rem" }}
            key={currentQuestion.id} // re-mounts on question change for a11y
          >
            {/* Question number header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Question {currentIndex + 1}{" "}
                <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>of {totalQuestions}</span>
              </span>
              {answers[currentQuestion.id] && (
                <span className="badge badge-success">Answered</span>
              )}
            </div>

            {/* Question text */}
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--text-primary)",
                lineHeight: 1.65,
                marginBottom: "1.75rem",
                fontWeight: 500,
              }}
            >
              {currentQuestion.text}
            </p>

            {/* Options */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
                Choose an answer for question {currentIndex + 1}
              </legend>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === opt;
                  const optionLabel = String.fromCharCode(65 + i); // A, B, C, D

                  return (
                    <label
                      key={i}
                      className={`option-label${isSelected ? " selected" : ""}`}
                      htmlFor={`q${currentQuestion.id}-opt${i}`}
                    >
                      {/* Option letter */}
                      <span
                        style={{
                          width: "1.75rem",
                          height: "1.75rem",
                          borderRadius: "0.375rem",
                          backgroundColor: isSelected ? "var(--accent)" : "var(--bg-2)",
                          color: isSelected ? "#fff" : "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          flexShrink: 0,
                          transition: "background-color 0.15s, color 0.15s",
                        }}
                      >
                        {optionLabel}
                      </span>

                      <input
                        type="radio"
                        id={`q${currentQuestion.id}-opt${i}`}
                        name={`question-${currentQuestion.id}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => setAnswer(currentQuestion.id, opt)}
                        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                      />

                      <span style={{ flex: 1 }}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Navigation controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="btn btn-secondary"
            >
              ← Previous
            </button>

            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {currentIndex + 1} / {totalQuestions}
            </span>

            {isLast ? (
              <button
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Submit exam
              </button>
            ) : (
              <button onClick={goNext} className="btn btn-secondary">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Responsive: mobile palette strip (hidden above md) ──────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .exam-grid { grid-template-columns: 1fr !important; }
          .exam-sidebar { position: static !important; }
        }
      `}</style>

      {/* ── Submit confirmation modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit exam?"
        description={
          unansweredCount > 0
            ? `You have ${unansweredCount} unanswered question${unansweredCount !== 1 ? "s" : ""}. Are you sure you want to submit?`
            : `You have answered all ${totalQuestions} questions. Are you sure you want to submit?`
        }
        confirmLabel="Yes, submit"
        cancelLabel="Continue reviewing"
        variant={unansweredCount > 0 ? "danger" : "default"}
      />
    </div>
  );
}
