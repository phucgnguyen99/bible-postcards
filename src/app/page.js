"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "bible_postcards";

export default function HomePage() {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");

  const [tagsInput, setTagsInput] = useState("");
  const [commentary, setCommentary] = useState("");
  const [personalThoughts, setPersonalThoughts] = useState("");
  const [questions, setQuestions] = useState("");

  const [postcards, setPostcards] = useState([]);

  // Load from localStorage on first render
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPostcards(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load postcards from localStorage", err);
    }
  }, []);

  // Save to localStorage whenever postcards change
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(postcards));
    } catch (err) {
      console.error("Failed to save postcards to localStorage", err);
    }
  }, [postcards]);

  function handleSave() {
    if (!reference.trim() || !text.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newPostcard = {
      id: crypto.randomUUID(),
      reference,
      text,
      tags,
      commentary,
      personalThoughts,
      questions,
      createdAt: new Date().toISOString(),
    };

    setPostcards((prev) => [newPostcard, ...prev]);

    // clear inputs
    setReference("");
    setText("");
    setTagsInput("");
    setCommentary("");
    setPersonalThoughts("");
    setQuestions("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">BibleVerse Postcards 📬</h1>
        <p className="text-xs text-gray-500 mb-6">
          Step 2: postcards are now saved in your browser, even after refresh.
        </p>

        {/* Verse + notes form */}
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
              placeholder="Type or paste the verse text here..."
              className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="faith, hope, encouragement"
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Commentary</label>
            <textarea
              value={commentary}
              onChange={(e) => setCommentary(e.target.value)}
              placeholder="What does this verse say? Any observations?"
              className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Personal thoughts
            </label>
            <textarea
              value={personalThoughts}
              onChange={(e) => setPersonalThoughts(e.target.value)}
              placeholder="How does this verse speak to your life today?"
              className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Questions</label>
            <textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="What do you want to study or ask about this verse?"
              className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
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
                className="rounded-2xl border bg-gradient-to-br from-amber-50 via-white to-sky-50 p-3 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">{pc.reference}</h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(pc.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-gray-700 whitespace-pre-wrap mb-2">
                  {pc.text}
                </p>

                {pc.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {pc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-gray-700 border border-gray-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {pc.personalThoughts && (
                  <p className="text-[11px] text-gray-600 italic mb-1">
                    {pc.personalThoughts}
                  </p>
                )}

                {pc.commentary && (
                  <p className="text-[10px] text-gray-500">
                    <span className="font-semibold">Note: </span>
                    {pc.commentary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
