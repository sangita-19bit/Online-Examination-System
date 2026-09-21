/**
 * EmptyState — shown when a list has no items.
 * Usage: <EmptyState title="No exams found" description="Check back later." />
 */
export default function EmptyState({ title, description, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 2rem",
        gap: "0.75rem",
      }}
    >
      {/* Neutral icon */}
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "0.75rem",
          backgroundColor: "var(--bg-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.5rem",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 13h4" />
        </svg>
      </div>
      {title && (
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
          {title}
        </h3>
      )}
      {description && (
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, maxWidth: "24rem" }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "0.5rem" }}>{action}</div>}
    </div>
  );
}
