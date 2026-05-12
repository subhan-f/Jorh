import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AiUpgradeCard() {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 p-5">
      <Sparkles className="size-5 text-purple-600" />
      <div>
        <h3 className="font-semibold text-gray-900">Simplify your workflow</h3>
        <p className="mt-1 text-sm text-gray-600">
          Let AI create and manage your links automatically.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-purple-800">
          AI link naming
        </span>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-purple-800">
          Smart suggestions
        </span>
      </div>
      <Button className="mt-auto w-full bg-purple-900 hover:bg-purple-800 text-white">
        Upgrade to AI creation
      </Button>
    </div>
  )
}
