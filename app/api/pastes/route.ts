import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, ttl_seconds, max_views } = body;

    if (typeof content !== "string" || content.trim() === "") {
      return Response.json({ error: "content is required" }, { status: 400 });
    }

    if (ttl_seconds !== undefined &&
        (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return Response.json({ error: "ttl_seconds must be integer >= 1" }, { status: 400 });
    }

    if (max_views !== undefined &&
        (!Number.isInteger(max_views) || max_views < 1)) {
      return Response.json({ error: "max_views must be integer >= 1" }, { status: 400 });
    }

    const id = nanoid(12);

    const paste = {
      id,
      content,
      created_at: Date.now(),
      ttl_seconds: ttl_seconds ?? null,
      max_views: max_views ?? null,
      views: 0,
    };

    await kv.set(`paste:${id}`, paste);

    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    const url = `${base}/p/${id}`;

    return Response.json({ id, url }, { status: 201 });

  } catch (err) {
    console.error("POST /api/pastes error:", err);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
