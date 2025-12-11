"use client";

import { useState } from "react";

export default function SearchPage() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch() {
    if (!reference.trim()) return;
    setIsFetching(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/verses/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch verse");

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Search Bible verses 🔎</h1>
        <p className="text-xs text-gray-500 mb-6">
          Quickly look up any verse using a Bible API.
        </p>

        <div className="space-y-3 border rounded-lg bg-white p-4 shadow-sm">
          <div>
            <label className="block text-xs font-medium mb-1">
              Verse reference
            </label>
            <div className="flex gap-2">
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder='e.g. "John 3:16"'
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!reference.trim() || isFetching}
                className="px-3 py-2 text-xs rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isFetching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-red-500">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-3 border rounded-lg bg-slate-50 p-3">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-sm">{result.reference}</h2>
                <span className="text-[10px] text-gray-500 uppercase">
                  {result.translation}
                </span>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-wrap">
                {result.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
