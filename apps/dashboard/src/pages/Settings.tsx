import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Separator } from "@repo/ui/components/separator";
import { useToast } from "@repo/ui/components/toast";
import { ApiError } from "@repo/api-client";
import { jorh } from "../lib/api";
import { getStoredUser, storeAuth, getStoredToken } from "../lib/auth";
import Header from "../components/Header";

export default function Settings() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => jorh.auth.getProfile(),
  });

  const profile = data?.result;

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  // Sync form when profile loads
  React.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    } else {
      // Fall back to localStorage while loading
      const stored = getStoredUser();
      if (stored) {
        setName(stored.name);
        setEmail(stored.email);
      }
    }
  }, [profile]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setSaving(true);

    try {
      const res = await jorh.auth.updateProfile({ name, email });
      const updated = res.result;

      // Update localStorage user record
      const token = getStoredToken();
      if (token) {
        storeAuth(token, {
          name: updated.name,
          email: updated.email,
          role: updated.role,
          avatar: updated.avatar,
        });
      }

      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast("Profile updated successfully.", "success");
    } catch (err) {
      if (err instanceof ApiError) {
        setProfileError(err.message);
      } else {
        setProfileError("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Header title="Settings" />

      {/* Profile section */}
      <Card className="mb-6 max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {profileError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                  {profileError}
                </p>
              )}

              <Button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                size="sm"
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Password section */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Password change
              </p>
              <p className="text-xs text-slate-400">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
