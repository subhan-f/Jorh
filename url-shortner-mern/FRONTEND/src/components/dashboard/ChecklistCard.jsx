import { Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const items = [
  { label: "Create your first short link", done: true,  action: null },
  { label: "Set up your custom domain",    done: false, action: "Set up" },
  { label: "Share your first link",        done: false, action: "Share" },
]

function ProgressRing({ value, total }) {
  const percent = Math.round((value / total) * 100)
  const r = 16
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div className="relative size-10 shrink-0">
      <svg className="-rotate-90 size-10" viewBox="0 0 40 40">
        <circle
          cx="20" cy="20" r={r}
          fill="none" stroke="#e5e7eb" strokeWidth="3"
        />
        <circle
          cx="20" cy="20" r={r}
          fill="none" stroke="#2563eb" strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700">
        {percent}%
      </span>
    </div>
  )
}

export default function ChecklistCard({ userName = "there" }) {
  const done = items.filter((i) => i.done).length

  return (
    <Card className="w-72 shrink-0">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Get started, {userName}!
        </CardTitle>
        <ProgressRing value={done} total={items.length} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.map(({ label, done, action }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
              )}
            >
              {done && <Check className="size-3 text-white" strokeWidth={3} />}
            </div>
            <span
              className={cn(
                "flex-1 text-sm",
                done ? "text-gray-400 line-through" : "text-gray-700"
              )}
            >
              {label}
            </span>
            {action && !done && (
              <Button size="sm" variant="outline" className="h-7 shrink-0 text-xs">
                {action}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
