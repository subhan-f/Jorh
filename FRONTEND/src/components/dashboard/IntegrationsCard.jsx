import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const integrations = [
  {
    emoji: "⚡",
    bg: "bg-orange-100",
    name: "Zapier",
    description: "Automate link creation across thousands of apps.",
  },
  {
    emoji: "🔗",
    bg: "bg-purple-100",
    name: "Make",
    description: "Build powerful automation workflows visually.",
  },
]

export default function IntegrationsCard() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Connect your account
        </CardTitle>
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          Explore integrations
          <ExternalLink className="size-3" />
        </a>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Recommended for you
        </p>
        {integrations.map(({ emoji, bg, name, description }) => (
          <div key={name} className="flex items-start gap-3">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-lg ${bg}`}
            >
              {emoji}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
