// src/app/api/verses/fetch/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { reference } = body || {};

  if (!reference || typeof reference !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid verse reference" },
      { status: 400 }
    );
  }

  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=web`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch verse from Bible API" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const mergedText =
      Array.isArray(data.verses)
        ? data.verses.map((v) => v.text).join(" ").trim()
        : "";

    return NextResponse.json({
      reference: data.reference || reference,
      text: mergedText || "No verse text found.",
      translation: (data.translation_id || "web").toUpperCase(),
    });
  } catch (err) {
    console.error("Bible API error:", err);
    return NextResponse.json(
      { error: "Unexpected error talking to Bible API" },
      { status: 500 }
    );
  }
}
