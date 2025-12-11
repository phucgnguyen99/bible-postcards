"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bible_postcards";

export default function CreatePage() {
    const [reference, setReference] = useState("");
    const [text, setText] = useState("");

    const [tagsInput, setTagsInput] = useState("");
    const [commentary, setCommentary] = useState("");
    const [personalThoughts, setPersonalThoughts] = useState("");
    const [questions, setQuestions] = useState("");

    const [postcards, setPostcards] = useState(() => {
        if (typeof window === "undefined") return [];
        try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
        } catch (err) {
        console.error("Failed to load postcards", err);
        return [];
        }
    });

    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const [editingId, setEditingId] = useState(null);

  // Save to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(postcards));
    } catch (err) {
      console.error("Failed to save postcards", err);
    }
  }, [postcards]);

  async function handleFetchVerse() {
    if (!reference.trim()) return;

    setIsFetching(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/verses/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch verse");

      setText(data.text || "");
    } catch (err) {
      console.error(err);
      setFetchError(err.message || "Something went wrong");
    } finally {
      setIsFetching(false);
    }
  }

  function handleSave() {
    if (!reference.trim() || !text.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      // update existing
      setPostcards((prev) =>
        prev.map((pc) =>
          pc.id === editingId
            ? {
                ...pc,
                reference,
                text,
                tags,
                commentary,
                personalThoughts,
                questions,
                updatedAt: new Date().toISOString(),
              }
            : pc
        )
      );
    } else {
      // create new
      const newPostcard = {
        id: crypto.randomUUID(),
        reference,
        text,
        tags,
        commentary,
        personalThoughts,
        questions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPostcards((prev) => [newPostcard, ...prev]);
    }

    // clear form
    setReference("");
    setText("");
    setTagsInput("");
    setCommentary("");
    setPersonalThoughts("");
    setQuestions("");
    setEditingId(null);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Create a new postcard ✨</h1>
        <p className="text-xs text-gray-500 mb-6">
          Enter a verse reference, fetch the text, add your reflections, and save it.
        </p>

        {/* Verse + notes form */}
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
                onClick={handleFetchVerse}
                disabled={!reference.trim() || isFetching}
                className="px-3 py-2 text-xs rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isFetching ? "Fetching..." : "Fetch verse"}
              </button>
            </div>
            {fetchError && (
              <p className="text-[11px] text-red-500 mt-1">{fetchError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Verse text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Fetched verse will appear here. You can also edit it."
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
            {editingId ? "Update postcard" : "Save postcard"}
          </button>
        </div>
      </div>
    </main>
  );
}
