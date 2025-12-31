import { kv } from "@vercel/kv";
import { getTestNow } from "./time";

export async function loadPasteOr404(id: string, req: Request, countView: boolean) {
  const paste = await kv.get<any>(`paste:${id}`);
  if (!paste) return null;

 const now = getTestNow(req);


  const expiresAt = paste.ttl_seconds
    ? paste.created_at + paste.ttl_seconds * 1000
    : null;

  const expired = expiresAt && now >= expiresAt;
  const viewExceeded =
    paste.max_views && paste.views >= paste.max_views;

  if (expired || viewExceeded) {
    await kv.del(`paste:${id}`);
    return null;
  }

  if (countView) {
    paste.views += 1;
    await kv.set(`paste:${id}`, paste);
  }

  return {
    paste,
    expiresAt,
    remainingViews: paste.max_views
      ? Math.max(paste.max_views - paste.views, 0)
      : null,
  };
}
