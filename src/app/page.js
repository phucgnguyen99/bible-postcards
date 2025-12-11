"use client";

import { useState } from "react";

export default function HomePage() {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [postcards, setPostcards] = useState([]);

  function handleSave() {
    if (!reference.trim() || !text.trim()) return;

    const newPostcard = {
      id: crypto.randomUUID(),
      reference,
      text,
      createdAt: new Date().toISOString(),
    };

    setPostcards((prev) => [newPostcard, ...prev]);

    // clear inputs
    setReference("");
    setText("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">BibleVerse Postcards 📬</h1>
        <p className="text-xs text-gray-500 mb-6">
          Start simple: type a verse reference and its text, then save as a postcard.
        </p>

        {/* Verse form */}
        <div className="space-y-3 border rounded-lg bg-white p-4 shadow-sm">
          <div>
            <label className="block text-xs font-medium mb-1">
              Verse reference
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder='e.g. "John 3:16"'
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Verse text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type the verse text here..."
              className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!reference.trim() || !text.trim()}
            className="px-4 py-2 text-sm rounded bg-black text-white disabled:opacity-50"
          >
            Save postcard
          </button>
        </div>

        {/* Postcards list */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold mb-3">Your postcards</h2>

          {postcards.length === 0 && (
            <p className="text-xs text-gray-500">
              No postcards yet. Add your first one above.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {postcards.map((pc) => (
              <div
                key={pc.id}
                className="rounded-xl border bg-gradient-to-br from-amber-50 via-white to-sky-50 p-3 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">{pc.reference}</h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(pc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">
                  {pc.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
