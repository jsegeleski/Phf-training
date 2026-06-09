"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/lib/course";
import { supabase } from "@/lib/supabase";

export default function TrainingPage() {
  const [chapterNumber, setChapterNumber] = useState(1);
  const [lastScore, setLastScore] = useState<string | null>(null);

  useEffect(() => {
    const storedScore = localStorage.getItem("pfh_last_score");
    if (storedScore) {
      setLastScore(storedScore);
      localStorage.removeItem("pfh_last_score");
    }

    const sessionId = localStorage.getItem("pfh_session_id");
    if (!sessionId) {
      window.location.href = "/";
      return;
    }

    supabase
      .from("staff_sessions")
      .select("current_chapter")
      .eq("id", sessionId)
      .single()
      .then(({ data }) => {
        if (data?.current_chapter) {
          setChapterNumber(data.current_chapter);
        }
      });
  }, []);

  const chapter = chapters.find((c) => c.id === chapterNumber);
  if (!chapter) return null;

  const percent = Math.round(((chapter.id - 1) / chapters.length) * 100);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-black">
            <span>Chapter {chapter.id} of {chapters.length}</span>
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
            Reading
          </p>

          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-black">
            {chapter.title}
          </h1>

          {lastScore && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-black">
              You scored {lastScore}. Please review this chapter and try again.
            </div>
          )}

          <div className="whitespace-pre-line text-sm leading-7 text-black">
            {chapter.content}
          </div>

          <button
            onClick={() => (window.location.href = `/quiz/${chapter.id}`)}
            className="mt-8 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Start Chapter Quiz
          </button>
        </div>
      </div>
    </main>
  );
}