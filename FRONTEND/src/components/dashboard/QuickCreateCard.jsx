import { useState } from "react"
import { Lock } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createShortLink } from "@/api/dashboard.api.js"

export default function QuickCreateCard() {
  const [url, setUrl] = useState("")
  const [withQr, setWithQr] = useState(false)

  const { mutate, isPending, error, data, reset } = useMutation({
    mutationFn: () => createShortLink(url),
    onSuccess: () => setUrl(""),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url) return
    reset()
    mutate()
  }

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Quick create: Short link
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
          <Lock className="size-3" />
          bit.ly
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Enter a destination URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? "Creating…" : "Create your link"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}
        {data && (
          <p className="text-sm text-green-600">
            Link created:{" "}
            <a
              href={data.result?.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline"
            >
              {data.result?.shortUrl}
            </a>
          </p>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <Checkbox
            id="qr"
            checked={withQr}
            onCheckedChange={(v) => setWithQr(!!v)}
          />
          Also generate a QR code
        </label>

        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          Want a custom short link?{" "}
          <a href="#" className="font-medium underline underline-offset-2">
            Upgrade to a paid plan
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
