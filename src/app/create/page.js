"use client";

import { useEffect, useState } from "react";

export default function CreatePage() {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");

  const [tagsInput, setTagsInput] = useState("");
  const [commentary, setCommentary] = useState("");
  const [personalThoughts, setPersonalThoughts] = useState("");
  const [questions, setQuestions] = useState("");

  const [postcards, setPostcards] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [editingId, setEditingId] = useState(null);

  /* ---------------- Load postcards from DB ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/postcards");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load postcards");
        setPostcards(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  /* ---------------- Fetch verse text ---------------- */
  async function handleFetchVerse() {
    if (!reference.trim()) return;

    setIsFetching(true);
    setFetchError(null);

    try {
      console.log("FETCH VERSE clicked. reference =", reference);

      const res = await fetch("/api/verses/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      console.log("Fetch verse response url =", res.url, "status =", res.status);

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

  /* ---------------- Save / Update postcard ---------------- */
  async function handleSave() {
    if (!reference.trim() || !text.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      reference,
      text,
      tags,
      commentary,
      personalThoughts,
      questions,
    };

    const url = editingId ? `/api/postcards/${editingId}` : "/api/postcards";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save");
      return;
    }

    // reload list
    const refreshed = await fetch("/api/postcards");
    setPostcards(await refreshed.json());

    handleCancelEdit();
  }

  /* ---------------- Edit / Delete helpers ---------------- */
  function handleEdit(pc) {
    setEditingId(pc.id);
    setReference(pc.reference || "");
    setText(pc.text || "");
    setTagsInput((pc.tags || []).join(", "));
    setCommentary(pc.commentary || "");
    setPersonalThoughts(pc.personalThoughts || "");
    setQuestions(pc.questions || "");
  }

  async function handleDelete(id) {
    if (!confirm("Delete this postcard?")) return;

    const res = await fetch(`/api/postcards/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to delete");
      return;
    }

    setPostcards((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) handleCancelEdit();
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

  /* ---------------- UI ---------------- */
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Create a new postcard ✨</h1>
        <p className="text-xs text-gray-500 mb-6">
          Enter a verse reference, fetch the text, add your reflections, and save it.
        </p>

        {/* -------- Form -------- */}
        <div className="space-y-3 border rounded-lg bg-white p-4 shadow-sm">
          <div>
            <label className="block text-xs font-medium mb-1">Verse reference</label>
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

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Verse text"
            className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
          />

          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <textarea
            value={commentary}
            onChange={(e) => setCommentary(e.target.value)}
            placeholder="Commentary"
            className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
          />

          <textarea
            value={personalThoughts}
            onChange={(e) => setPersonalThoughts(e.target.value)}
            placeholder="Personal thoughts"
            className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
          />

          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Questions"
            className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!reference.trim() || !text.trim()}
              className="px-4 py-2 text-sm rounded bg-black text-white disabled:opacity-50"
            >
              {editingId ? "Update postcard" : "Save postcard"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm rounded border bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* -------- Saved postcards -------- */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Saved postcards</h2>

          <div className="space-y-3">
            {postcards.map((pc) => (
              <div key={pc.id} className="border rounded-lg bg-white p-4 shadow-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{pc.reference}</div>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                      {pc.text}
                    </p>

                    {pc.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {pc.tags.map((t) => (
                          <span
                            key={`${pc.id}-${t}`}
                            className="text-[11px] px-2 py-1 rounded bg-gray-100 border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                      onClick={() => handleEdit(pc)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs px-3 py-1 rounded border text-red-600 hover:bg-gray-50"
                      onClick={() => handleDelete(pc.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 mt-3">
                  Updated: {new Date(pc.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}

            {postcards.length === 0 && (
              <p className="text-sm text-gray-500">No postcards yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
