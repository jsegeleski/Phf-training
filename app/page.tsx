"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function startTraining() {
    if (!name.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("staff_sessions")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      alert("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("pfh_session_id", data.id);
    window.location.href = "/training";
  }

  return (
  <main className="min-h-screen bg-white text-black flex items-center justify-center px-4">
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black">
        Staff Training
      </p>

      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-black">
        Precision Fuel & Hydration Training
      </h1>

      <p className="mb-6 text-sm leading-6 text-black">
        Enter your name to begin the staff product training.
      </p>

      <input
        className="mb-4 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:outline-none"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={startTraining}
        disabled={loading}
        className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Starting..." : "Start Training"}
      </button>
    </div>
  </main>
);
}