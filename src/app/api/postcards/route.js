// src/app/api/postcards/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const postcards = await prisma.postcard.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(postcards);
}

export async function POST(request) {
  const body = await request.json();

  const reference = (body.reference || "").trim();
  const text = (body.text || "").trim();
  const tags = Array.isArray(body.tags) ? body.tags : [];

  if (!reference || !text) {
    return NextResponse.json(
      { error: "reference and text are required" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.postcard.create({
      data: {
        reference,
        text,
        tags,
        commentary: body.commentary ?? null,
        personalThoughts: body.personalThoughts ?? null,
        questions: body.questions ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Create postcard error:", err);
    return NextResponse.json(
      { error: "Failed to create postcard" },
      { status: 500 }
    );
  }
}
