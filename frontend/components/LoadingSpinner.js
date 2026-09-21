/**
 * LoadingSpinner — consistent loading indicator.
 * Usage: <LoadingSpinner size="md" label="Loading exams…" />
 */
export default function LoadingSpinner({ size = "md", label = "Loading…", center = true }) {
  const sizeMap = {
    sm: { spinner: "1rem", border: "2px" },
    md: { spinner: "1.5rem", border: "2px" },
    lg: { spinner: "2.5rem", border: "3px" },
  };
  const { spinner, border } = sizeMap[size] || sizeMap.md;

  const el = (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
    >
      <div
        role="status"
        aria-label={label}
        style={{
          width: spinner,
          height: spinner,
          border: `${border} solid var(--border)`,
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.65s linear infinite",
          flexShrink: 0,
        }}
      />
      {label && (
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</span>
      )}
    </div>
  );

  if (!center) return el;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1rem",
      }}
    >
      {el}
    </div>
  );
}
