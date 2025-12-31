"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }

    setUrl(data.url);
  }

  return (
    <main className="app-container">
      <div className="card">
        <h1>Pastebin-Lite</h1>

        <form onSubmit={submit}>
          <label className="label">Paste Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            required
          />

          <br />

          <label className="label">TTL seconds (optional)</label>
          <input
            type="number"
            value={ttl}
            onChange={e => setTtl(e.target.value)}
          />

          <br />

          <label className="label">Max views (optional)</label>
          <input
            type="number"
            value={views}
            onChange={e => setViews(e.target.value)}
          />

          <br />

          <button type="submit" className="primary-btn">
            Create Paste
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {url && (
          <div className="link-box">
            <p>Share Link:</p>
            <a href={url}>{url}</a>

            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
