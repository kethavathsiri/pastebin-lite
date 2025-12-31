import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // check persistence layer
    await kv.ping?.();

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    return Response.json({ ok: false }, { status: 500 });
  }
}
