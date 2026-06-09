export default function CompletePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-black">
            <span>Training complete</span>
            <span>100% complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-200">
            <div className="h-2 rounded-full bg-black" style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-black">
            Training Complete
          </h1>

          <p className="text-sm leading-6 text-black">
            You have completed the Precision Fuel & Hydration staff training.
          </p>
        </div>
      </div>
    </main>
  );
}