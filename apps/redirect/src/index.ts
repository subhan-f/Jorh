import type { Env, StoredLink } from "./types.js";
import { recordClick } from "./analytics.js";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const code = url.pathname.slice(1);

    if (!code || code === "favicon.ico" || code === "robots.txt") {
      return new Response("Jorh Redirect Engine", { status: 200 });
    }

    const link = await env.LINKS_KV.get<StoredLink>(code, "json");

    if (!link) {
      return errorPage(404, "Link not found", "This link doesn't exist or has been removed.");
    }

    if (!link.isActive) {
      return errorPage(410, "Link inactive", "This link is currently inactive.");
    }

    if (link.expiresAt && Date.now() > link.expiresAt) {
      return errorPage(410, "Link expired", "This link has expired.");
    }

    if (link.clickLimit && link.clickCount >= link.clickLimit) {
      return errorPage(410, "Limit reached", "This link has reached its maximum click count.");
    }

    if (link.password) {
      const cookieName = `jorh_pw_${code}`;
      const cookie = request.headers.get("Cookie") ?? "";
      const isUnlocked = cookie.includes(`${cookieName}=1`);

      if (!isUnlocked) {
        if (request.method === "POST") {
          const form = await request.formData();
          const submitted = form.get("password");
          if (submitted === link.password) {
            const headers = new Headers();
            headers.set("Location", url.href);
            headers.set("Set-Cookie", `${cookieName}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`);
            ctx.waitUntil(recordClick(request, link.id, env));
            return new Response(null, { status: 302, headers });
          }
          return passwordPage(code, "Incorrect password. Try again.");
        }
        return passwordPage(code);
      }
    }

    ctx.waitUntil(recordClick(request, link.id, env));

    return Response.redirect(link.originalUrl, 302);
  },
};

function passwordPage(code: string, error?: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Protected Link — Jorh</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; min-height: 100dvh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #f1f5f9; padding: 1rem; }
    .card { background: #1e293b; padding: 2rem; border-radius: 1rem; width: 100%; max-width: 380px; border: 1px solid #334155; }
    .lock { font-size: 2rem; text-align: center; margin-bottom: 1rem; }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.375rem; text-align: center; }
    p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; text-align: center; }
    .error { color: #f87171; font-size: 0.8125rem; margin-bottom: 0.75rem; text-align: center; }
    input { display: block; width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #334155; border-radius: 0.5rem; background: #0f172a; color: #f1f5f9; font-size: 1rem; margin-bottom: 1rem; outline: none; }
    input:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }
    button { display: block; width: 100%; padding: 0.625rem; background: #6366f1; border: none; border-radius: 0.5rem; color: white; font-size: 0.9375rem; font-weight: 500; cursor: pointer; transition: background 0.15s; }
    button:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="lock">🔐</div>
    <h1>Protected Link</h1>
    <p>This link requires a password to access.</p>
    ${error ? `<p class="error">${error}</p>` : ""}
    <form method="POST">
      <input type="password" name="password" placeholder="Enter password" autofocus required autocomplete="current-password" />
      <button type="submit">Access Link</button>
    </form>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function errorPage(status: number, title: string, message: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Jorh</title>
  <style>
    body { font-family: system-ui, sans-serif; min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; color: #f1f5f9; text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
    p { color: #94a3b8; margin-bottom: 1.5rem; }
    a { color: #6366f1; text-decoration: none; font-size: 0.875rem; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>${message}</p>
  <a href="https://jorh.net">← Go to Jorh</a>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
