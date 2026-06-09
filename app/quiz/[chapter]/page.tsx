"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { chapters } from "@/lib/course";
import { supabase } from "@/lib/supabase";

type Chapter = (typeof chapters)[number];

export default function QuizPage() {
  const params = useParams();
  const chapterId = Number(params.chapter);
  const currentChapter = chapters.find((c) => c.id === chapterId);

  if (!currentChapter) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-neutral-600">
            Chapter not found. Chapter ID: {String(params.chapter)}
          </p>
        </div>
      </main>
    );
  }

  return <Quiz currentChapter={currentChapter} />;
}

function Quiz({ currentChapter }: { currentChapter: Chapter }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  async function submitQuiz() {
  const sessionId = localStorage.getItem("pfh_session_id");

  if (!sessionId) {
    window.location.href = "/";
    return;
  }

  if (Object.keys(answers).length < currentChapter.questions.length) {
    alert("Please answer every question before submitting.");
    return;
  }

  let score = 0;

    currentChapter.questions.forEach((q, index) => {
      if (answers[index] === q.answer) score++;
    });

    const total = currentChapter.questions.length;
    const passed = score === total;

    setLoading(true);

    await supabase.from("chapter_attempts").insert({
      session_id: sessionId,
      chapter_number: currentChapter.id,
      score,
      total,
      passed,
    });

    if (!passed) {
      localStorage.setItem("pfh_last_score", `${score}/${total}`);
      window.location.href = "/training";
      return;
    }

    const nextChapter = currentChapter.id + 1;

    if (nextChapter > chapters.length) {
      await supabase
        .from("staff_sessions")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      window.location.href = "/complete";
      return;
    }

    await supabase
      .from("staff_sessions")
      .update({ current_chapter: nextChapter })
      .eq("id", sessionId);

    window.location.href = "/training";
  }

    const percent = Math.round(((currentChapter.id - 1) / chapters.length) * 100);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-black">
            <span>Chapter {currentChapter.id} of {chapters.length}</span>
            <span>{percent}% complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-200">
            <div
              className="h-2 rounded-full bg-black transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black">
            Quiz
          </p>

          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black">
            {currentChapter.title}
          </h1>

          <div className="space-y-6">
            {currentChapter.questions.map((q, index) => (
              <div
                key={index}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <p className="mb-4 text-sm font-semibold leading-6 text-black">
                  {index + 1}. {q.question}
                </p>

                <div className="space-y-3">
                  {q.options.map((option) => {
                    const selected = answers[index] === option;

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={selected}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [index]: option,
                            }))
                          }
                          className="sr-only"
                        />

                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            selected
                              ? "border-white bg-white"
                              : "border-neutral-500 bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-black" />
                          )}
                        </span>

                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={submitQuiz}
            disabled={loading}
            className="mt-8 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </main>
  );
}