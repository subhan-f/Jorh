import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { ApiError } from "@repo/api-client";
import { jorh } from "../lib/api";
import { storeAuth } from "../lib/auth";
import { router } from "../router";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await jorh.auth.login({ email, password });
      const user = res.result;
      storeAuth(user.accessToken, {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
      router.update({ context: { isAuthed: true } });
      await router.invalidate();
      await navigate({ to: "/links" });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">Jorh</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back! Enter your details below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
