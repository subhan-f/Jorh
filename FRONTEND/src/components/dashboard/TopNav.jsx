import { Search, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TopNav({ user }) {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6 py-3">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Upgrade
        </Button>
        <button
          aria-label="Help"
          className="flex size-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <HelpCircle className="size-5" />
        </button>
        <button
          aria-label="AI features"
          className="flex size-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <Sparkles className="size-5" />
        </button>
        <div
          aria-label="User avatar"
          className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white select-none"
        >
          {initials}
        </div>
      </div>
    </header>
  )
}
