import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center px-4">
      <p className="text-7xl font-extrabold text-indigo-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/links">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
