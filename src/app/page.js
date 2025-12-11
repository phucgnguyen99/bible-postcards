"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 py-8 border rounded-2xl bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">
          BibleVerse Postcards 📬
        </h1>
        <p className="text-xs text-gray-500 mb-6 text-center">
          Choose what you want to do today.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/create"
            className="w-full px-4 py-2 text-sm rounded-lg bg-black text-white text-center hover:bg-gray-900"
          >
            ✨ Create a new postcard
          </Link>

          <Link
            href="/postcards"
            className="w-full px-4 py-2 text-sm rounded-lg border text-center bg-slate-50 hover:bg-slate-100"
          >
            📂 View / edit saved postcards
          </Link>

          <Link
            href="/search"
            className="w-full px-4 py-2 text-sm rounded-lg border text-center bg-slate-50 hover:bg-slate-100"
          >
            🔎 Search Bible verses
          </Link>
        </div>
      </div>
    </main>
  );
}
