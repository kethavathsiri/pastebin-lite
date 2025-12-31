import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export default async function PastePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const paste: any = await kv.get(`paste:${id}`);

  if (!paste) {
    return (
      <main className="p-6">
        <h1>Paste not found</h1>
      </main>
    );
  }

  const now = Date.now();

  // TTL expiry check
  if (paste.ttl_seconds && paste.created_at) {
    const expiresAt = paste.created_at + paste.ttl_seconds * 1000;

    if (now >= expiresAt) {
      await kv.del(`paste:${id}`);
      return (
        <main className="p-6">
          <h1>Paste expired</h1>
        </main>
      );
    }
  }

  // View-limit check
  if (typeof paste.max_views === "number") {
    const nextViews = (paste.views ?? 0) + 1;

    if (nextViews > paste.max_views) {
      await kv.del(`paste:${id}`);
      return (
        <main className="p-6">
          <h1>Paste no longer available</h1>
        </main>
      );
    }

    await kv.set(`paste:${id}`, {
      ...paste,
      views: nextViews,
    });
  }

  return (
    <main className="p-6">
      <h1>Paste</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{paste.content}</pre>
    </main>
  );
}
