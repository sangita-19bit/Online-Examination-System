"use client";

import { useEffect, useRef } from "react";

/**
 * Modal — accessible confirmation dialog.
 * Props:
 *   isOpen      — boolean
 *   onClose     — function
 *   title       — string
 *   description — string (optional)
 *   confirmLabel — string (default: "Confirm")
 *   cancelLabel  — string (default: "Cancel")
 *   onConfirm    — function
 *   variant      — "default" | "danger"
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
}) {
  const confirmRef = useRef(null);

  // Focus confirm button when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="modal-box">
        <h2
          id="modal-title"
          style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            {description}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
