"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getUsername, isAuthenticated } from "@/lib/api";

export default function ExamPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // unwrapping the promise in Next 15 App router
  
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ref to hold current state for auto-submit
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

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
        alert("Failed to load exam.");
        router.push("/dashboard");
      });
  }, [id, router]);

  useEffect(() => {
    if (timeLeft === null || isSubmitting) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitting]);

  const handleAutoSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    submitExamLoad(answersRef.current);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    submitExamLoad(answers);
  };

  const submitExamLoad = async (finalAnswers) => {
    const username = getUsername();
    try {
      const response = await apiFetch(`/api/exams/${id}/submit`, {
        method: "POST",
        body: JSON.stringify({ username, answers: finalAnswers }),
      });

      if (response.ok) {
        router.push("/results");
      } else {
        alert("Failed to submit exam.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const setAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  if (!exam || timeLeft === null) {
    return (
      <div className="min-h-screen bg-[#020617] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      {/* Sticky Header with Timer */}
      <div className="sticky top-0 z-50 glass-panel border-b border-slate-800 border-x-0 border-t-0 p-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold font-mono text-white truncate max-w-[50%]">{exam.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">Time Remaining:</span>
            <div className={`px-4 py-2 rounded-lg font-mono font-bold text-lg shadow-inner ${
                timeLeft < 60 ? "bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse" : "bg-slate-800 text-blue-400"
            }`}>
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg disabled:opacity-50 transition-all font-sans"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
        <form onSubmit={handleManualSubmit} className="space-y-10">
          {exam.questions.map((q, index) => (
            <div key={q.id} className="glass-panel p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
              
              <h3 className="text-lg font-medium text-white mb-6 leading-relaxed">
                <span className="text-blue-400 font-bold mr-2">{index + 1}.</span> 
                {q.text}
              </h3>
              
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <label 
                    key={i} 
                    className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all ${
                      answers[q.id] === opt 
                        ? "border-blue-500 bg-blue-500/10" 
                        : "border-slate-800 hover:border-slate-600 hover:bg-slate-800/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`} 
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswer(q.id, opt)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                       answers[q.id] === opt ? "border-blue-500" : "border-slate-500"
                    }`}>
                      {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <span className={answers[q.id] === opt ? "text-white" : "text-slate-300"}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </form>
      </main>
    </div>
  );
}
