import { loadPasteOr404 } from "@/lib/paste";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await loadPasteOr404(id, req, true);

  if (!result) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { paste, expiresAt, remainingViews } = result;

  return Response.json(
    {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: expiresAt,
    },
    { status: 200 }
  );
}
