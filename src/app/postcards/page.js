"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bible_postcards";

export default function PostcardsPage() {
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

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [reference, setReference] = useState("");
    const [text, setText] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [commentary, setCommentary] = useState("");
    const [personalThoughts, setPersonalThoughts] = useState("");
    const [questions, setQuestions] = useState("");

  // save
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(postcards));
    } catch (err) {
      console.error("Failed to save postcards", err);
    }
  }, [postcards]);

  const allTags = Array.from(
    new Set(postcards.flatMap((pc) => pc.tags || []))
  ).sort();

  const filteredPostcards = postcards.filter((pc) => {
    if (selectedTag && !(pc.tags || []).includes(selectedTag)) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const combined = [
      pc.reference,
      pc.text,
      pc.commentary,
      pc.personalThoughts,
      pc.questions,
      (pc.tags || []).join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return combined.includes(q);
  });

  function handleEdit(postcard) {
    setEditingId(postcard.id);
    setReference(postcard.reference);
    setText(postcard.text);
    setTagsInput((postcard.tags || []).join(", "));
    setCommentary(postcard.commentary || "");
    setPersonalThoughts(postcard.personalThoughts || "");
    setQuestions(postcard.questions || "");
  }

  function handleUpdate() {
    if (!editingId) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

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

    setEditingId(null);
    setReference("");
    setText("");
    setTagsInput("");
    setCommentary("");
    setPersonalThoughts("");
    setQuestions("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setReference("");
    setText("");
    setTagsInput("");
    setCommentary("");
    setPersonalThoughts("");
    setQuestions("");
  }

  function handleDelete(id) {
    if (!confirm("Delete this postcard?")) return;
    setPostcards((prev) => prev.filter((pc) => pc.id !== id));
    if (editingId === id) handleCancelEdit();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Your postcards 📂</h1>
        <p className="text-xs text-gray-500 mb-6">
          Search, filter, edit or delete your saved verse postcards.
        </p>

        {/* Search + tag filters */}
        {postcards.length > 0 ? (
          <div className="mb-6 space-y-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by reference, text, or notes..."
              className="w-full max-w-md border rounded px-3 py-1.5 text-xs"
            />

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[11px] text-gray-500 mr-1">
                  Filter by tag:
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    selectedTag === null
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTag((prev) => (prev === tag ? null : tag))
                    }
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      selectedTag === tag
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 mb-4">
            No postcards yet. Go to the Create page to add some.
          </p>
        )}

        {/* Edit panel (inline) */}
        {editingId && (
          <div className="mb-6 border rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Edit postcard</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Verse reference
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
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
                  className="w-full border rounded px-3 py-2 text-sm min-h-[70px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Commentary
                </label>
                <textarea
                  value={commentary}
                  onChange={(e) => setCommentary(e.target.value)}
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
                  className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Questions
                </label>
                <textarea
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs rounded border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-1 text-xs rounded bg-black text-white"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid of postcards */}
        {postcards.length > 0 && filteredPostcards.length === 0 && (
          <p className="text-xs text-gray-500 mb-3">
            No postcards match your search or tag filter.
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredPostcards.map((pc) => (
            <div
              key={pc.id}
              className="rounded-2xl border bg-gradient-to-br from-amber-50 via-white to-sky-50 p-3 shadow-sm flex flex-col justify-between"
            >
              <div>
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

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(pc)}
                  className="text-[11px] px-2 py-1 border rounded bg-white hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pc.id)}
                  className="text-[11px] px-2 py-1 border rounded bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
