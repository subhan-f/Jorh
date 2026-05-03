import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth.store";
import { signOut } from "@jorh/firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Badge } from "@jorh/ui";

export default function SettingsPage() {
  const { user, firebaseUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Profile */}
          <section className="border-border bg-card rounded-xl border p-6">
            <h2 className="mb-4 text-sm font-semibold">Profile</h2>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold">
                {user?.displayName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="font-medium">
                  {user?.displayName ?? firebaseUser?.displayName ?? "—"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {user?.email ?? firebaseUser?.email ?? "—"}
                </p>
              </div>
              <Badge className="ml-auto capitalize" variant="secondary">
                {user?.plan ?? "free"}
              </Badge>
            </div>
          </section>

          {/* Plan */}
          <section className="border-border bg-card rounded-xl border p-6">
            <h2 className="mb-1 text-sm font-semibold">Plan &amp; Billing</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              You are on the <span className="font-medium capitalize">{user?.plan ?? "free"}</span>{" "}
              plan.
            </p>
            {(user?.plan === "free" || !user?.plan) && (
              <a
                href="https://jorh.net/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Upgrade to Pro
              </a>
            )}
          </section>

          {/* Danger zone */}
          <section className="border-destructive/30 bg-card rounded-xl border p-6">
            <h2 className="text-destructive mb-1 text-sm font-semibold">Danger zone</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Sign out of your account on this device.
            </p>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
