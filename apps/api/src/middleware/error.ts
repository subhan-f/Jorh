import type { Context } from "hono";

export function errorMiddleware(err: Error, c: Context): Response {
  console.error(`[${c.req.method}] ${c.req.url}`, err.message);

  const status = (err as Error & { status?: number }).status ?? 500;
  return c.json(
    {
      data: null,
      error: { code: "INTERNAL_ERROR", message: err.message ?? "Something went wrong" },
    },
    status as 500 | 400 | 401 | 403 | 404 | 409 | 422
  );
}
