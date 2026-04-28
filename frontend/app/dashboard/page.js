"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { apiFetch, isAuthenticated } from "@/lib/api";

export default function DashboardPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth via cookie
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    apiFetch("/api/exams")
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const startExam = (id) => {
    router.push(`/exam/${id}`);
  };

  const categories = Array.from(new Set(exams.map((e) => e.category)));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-8">Available Examinations</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => (
              <section key={cat} className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <div className="w-2 h-6 bg-blue-500 rounded-full" />
                  {cat}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams
                    .filter((e) => e.category === cat)
                    .map((exam) => (
                      <div 
                        key={exam.id} 
                        className="glass-panel p-6 rounded-2xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group overflow-hidden relative"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {exam.title}
                              </h3>
                              <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 whitespace-nowrap">
                                {exam.timeLimitMinutes} Mins
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                              Test your knowledge in {exam.title} with this interactive {exam.category.toLowerCase()}.
                            </p>
                          </div>
                          
                          <button
                            onClick={() => startExam(exam.id)}
                            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 shadow-sm transition-all"
                          >
                            Start Exam
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
            
            {exams.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <p>No exams available at the moment. Is the backend running?</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
