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

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          Chapter {chapter.id} of {chapters.length}
        </p>

        <h1 className="text-2xl font-semibold mb-6">{chapter.title}</h1>

        {lastScore && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            You scored {lastScore}. Please review this chapter and try again.
          </div>
        )}

        <div className="prose prose-sm max-w-none text-neutral-800 whitespace-pre-line">
          {chapter.content}
        </div>

        <button
          onClick={() => (window.location.href = `/quiz/${chapter.id}`)}
          className="mt-8 bg-black text-white rounded-lg px-5 py-2 text-sm font-medium"
        >
          Start Chapter Quiz
        </button>
      </div>
    </main>
  );
}