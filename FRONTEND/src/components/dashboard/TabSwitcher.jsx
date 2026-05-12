import { useState } from "react"
import { cn } from "@/lib/utils"

const TABS = ["Short link", "QR Code"]

export default function TabSwitcher({ onChange }) {
  const [active, setActive] = useState(TABS[0])

  const select = (tab) => {
    setActive(tab)
    onChange?.(tab)
  }

  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => select(tab)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            active === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
