"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsername, clearAuthCookies } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUsername(getUsername() || "");
  }, []);

  const handleLogout = () => {
    clearAuthCookies();
    router.push("/");
  };

  const navItems = [
    { name: "Exams", path: "/dashboard" },
    { name: "Results", path: "/results" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "3.5rem",
        }}
      >
        {/* Logo + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            {/* Logo mark */}
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
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Blink Exam
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ display: "flex", gap: "0.25rem" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "var(--accent-light)" : "transparent",
                    transition: "color 0.15s, background-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.backgroundColor = "var(--bg-2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side: user + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {username && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3125rem 0.625rem",
                borderRadius: "9999px",
                backgroundColor: "var(--bg-2)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Avatar */}
              <div
                aria-hidden="true"
                style={{
                  width: "1.375rem",
                  height: "1.375rem",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.6875rem", fontWeight: 700 }}>
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  maxWidth: "8rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {username}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            aria-label="Sign out"
          >
            Sign out
          </button>

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-sm md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "0.75rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "var(--accent)" : "var(--text-primary)",
                  backgroundColor: isActive ? "var(--accent-light)" : "transparent",
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
