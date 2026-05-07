import { Link2 } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary flex size-7 items-center justify-center rounded-md">
            <Link2 className="text-primary-foreground size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Jorh</span>
        </Link>
        <span className="text-muted-foreground text-sm hidden sm:block">
          جوڑ — Every link, beautifully managed.
        </span>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </nav>
      </div>
      <Separator />
    </header>
  )
}
