import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { signOut } from "@jorh/firebase/auth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-base font-semibold">{title}</h1>

      <div className="flex items-center gap-2">
        <button className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors">
          <Search className="h-4 w-4" />
        </button>
        <button className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        {user && (
          <button
            onClick={handleSignOut}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            title="Sign out"
          >
            {user.displayName?.[0]?.toUpperCase() ?? "?"}
          </button>
        )}
      </div>
    </header>
  );
}
