// src/app/api/postcards/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = params;
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
    const updated = await prisma.postcard.update({
      where: { id },
      data: {
        reference,
        text,
        tags,
        commentary: body.commentary ?? null,
        personalThoughts: body.personalThoughts ?? null,
        questions: body.questions ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update postcard error:", err);
    return NextResponse.json(
      { error: "Failed to update postcard" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    await prisma.postcard.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete postcard error:", err);
    return NextResponse.json(
      { error: "Failed to delete postcard" },
      { status: 500 }
    );
  }
}

