/**
 * ErrorAlert — inline error/success message component.
 * Usage: <ErrorAlert message="Something went wrong" />
 */
export default function ErrorAlert({ message, variant = "error" }) {
  if (!message) return null;

  const isError = variant === "error";

  return (
    <div
      role="alert"
      className={`alert ${isError ? "alert-error" : "alert-success"}`}
    >
      {/* Icon */}
      <svg
        aria-hidden="true"
        className="shrink-0 mt-0.5"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {isError ? (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <span>{message}</span>
    </div>
  );
}
