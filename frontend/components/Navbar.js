"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsername, clearAuthCookies } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(getUsername() || "");
  }, []);

  const handleLogout = () => {
    clearAuthCookies();
    router.push("/");
  };

  const navItems = [
    { name: "Examinations", path: "/dashboard" },
    { name: "Results", path: "/results" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800 border-x-0 border-t-0 bg-[#0f172a]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Blink EXAM</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.path
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {username && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 max-w-[180px]">
                <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-200 font-medium truncate">{username}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="shrink-0 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white border border-slate-700/50 rounded-lg hover:bg-slate-800/60 transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
