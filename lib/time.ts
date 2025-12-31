export function getTestNow(req: Request): number {
  // Only enable deterministic mode when TEST_MODE=1
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");

    if (header) {
      const ms = Number(header);
      if (!Number.isNaN(ms)) {
        return ms;
      }
    }
  }

  // fallback to real system time
  return Date.now();
}
