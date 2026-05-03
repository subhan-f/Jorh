import type { Context } from "hono";

export function errorMiddleware(err: Error, c: Context): Response {
  const status = (err as Error & { status?: number }).status ?? 500;

  // Always log server-side with full detail
  console.error(`[${c.req.method}] ${c.req.path} ${status}`, err.message);

  // Only expose the message to clients for expected (non-500) errors
  const clientMessage =
    status < 500
      ? (err.message ?? "Request failed")
      : "An unexpected error occurred";

  return c.json(
    {
      data: null,
      error: { code: "INTERNAL_ERROR", message: clientMessage },
    },
    status as 500 | 400 | 401 | 403 | 404 | 409 | 422
  );
}
