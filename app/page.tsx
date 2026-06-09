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
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">
          Precision Fuel & Hydration Training
        </h1>

        <p className="text-sm text-neutral-600 mb-6">
          Enter your name to begin the staff product training.
        </p>

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={startTraining}
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium"
        >
          {loading ? "Starting..." : "Start Training"}
        </button>
      </div>
    </main>
  );
}