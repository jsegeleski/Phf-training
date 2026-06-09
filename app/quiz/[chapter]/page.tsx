"use client";

import { useState } from "react";
import { chapters } from "@/lib/course";
import { supabase } from "@/lib/supabase";

export default function QuizPage({
  params,
}: {
  params: { chapter: string };
}) {
  const chapterId = Number(params.chapter);
  const chapter = chapters.find((c) => c.id === chapterId);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  if (!chapter) return null;

  async function submitQuiz() {
    const sessionId = localStorage.getItem("pfh_session_id");

    if (!sessionId) {
      window.location.href = "/";
      return;
    }

    let score = 0;

    chapter.questions.forEach((q, index) => {
      if (answers[index] === q.answer) score++;
    });

    const total = chapter.questions.length;
    const passed = score === total;

    setLoading(true);

    await supabase.from("chapter_attempts").insert({
      session_id: sessionId,
      chapter_number: chapter.id,
      score,
      total,
      passed,
    });

    if (passed) {
      const nextChapter = chapter.id + 1;

      if (nextChapter > chapters.length) {
        await supabase
          .from("staff_sessions")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        window.location.href = "/complete";
      } else {
        await supabase
          .from("staff_sessions")
          .update({ current_chapter: nextChapter })
          .eq("id", sessionId);

        window.location.href = "/training";
      }
    } else {
      localStorage.setItem("pfh_last_score", `${score}/${total}`);
      window.location.href = "/training";
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          Chapter {chapter.id} Quiz
        </p>

        <h1 className="text-2xl font-semibold mb-6">{chapter.title}</h1>

        <div className="space-y-8">
          {chapter.questions.map((q, index) => (
            <div key={index}>
              <p className="text-sm font-medium mb-3">
                {index + 1}. {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className="flex gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [index]: option }))
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submitQuiz}
          disabled={loading}
          className="mt-8 bg-black text-white rounded-lg px-5 py-2 text-sm font-medium"
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </main>
  );
}