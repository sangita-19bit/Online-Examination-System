"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { apiFetch, getUsername, isAuthenticated } from "@/lib/api";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = getUsername();
    if (!isAuthenticated() || !user) {
      router.push("/");
      return;
    }

    apiFetch(`/api/results/${user}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, { 
      dateStyle: "medium", 
      timeStyle: "short" 
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
          Examination Results
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center text-slate-400">
            <h2 className="text-xl mb-2 text-white">No attempts found</h2>
            <p>You haven't taken any exams yet. Head to the dashboard to start one!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result) => {
              const passThreshold = 0.5;
              const isPass = result.score / result.totalQuestions >= passThreshold;
              
              return (
                <div key={result.id} className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                  {/* Summary Bar */}
                  <div 
                    onClick={() => toggleExpand(result.id)}
                    className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{result.examTitle}</h3>
                      <p className="text-sm text-slate-400">{formatDate(result.completedAt)}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Score</p>
                        <p className="text-2xl font-mono font-bold text-white">
                          {result.score} <span className="text-lg text-slate-500">/ {result.totalQuestions}</span>
                        </p>
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                        isPass 
                          ? "bg-green-500/10 text-green-400 border-green-500/20" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {isPass ? "Passed" : "Needs Review"}
                      </div>
                      
                      <div className="text-slate-500 px-2 flex justify-center w-8">
                        <svg className={`w-5 h-5 transform transition-transform ${expandedId === result.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Review expanded section */}
                  {expandedId === result.id && (
                    <div className="p-6 border-t border-slate-800 bg-[#0f172a]/50">
                      <h4 className="font-semibold text-blue-400 mb-6 uppercase tracking-wider text-sm">Detailed Review</h4>
                      <div className="space-y-6">
                        {result.details.map((detail, idx) => {
                          const isCorrect = detail.userAnswer === detail.correctAnswer;
                          
                          return (
                            <div key={idx} className="bg-[#020617] p-5 rounded-xl border border-slate-800/50">
                              <p className="text-slate-200 mb-4 pb-3 border-b border-slate-800/50 font-medium">
                                <span className="text-slate-500 mr-2">Q{idx + 1}.</span>
                                {detail.questionText}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                  <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Your Answer</p>
                                  <p className={`font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                    {detail.userAnswer || "Not answered"}
                                  </p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-900/30">
                                  <p className="text-xs text-blue-500/70 mb-1 uppercase font-semibold">Correct Answer</p>
                                  <p className="font-medium text-blue-300">
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
            })}
          </div>
        )}
      </main>
    </div>
  );
}
