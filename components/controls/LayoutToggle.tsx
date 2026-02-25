import { PanelBottom, PanelLeft, PanelRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ControlsLayout,
  usePreferencesStore,
} from "@/store/use-preferences-store"

import { Button } from "../ui/button"

export default function LayoutToggle() {
  const controlsLayout = usePreferencesStore(state => state.controlsLayout)

  const handleToggle = (layout: ControlsLayout) => {
    usePreferencesStore.getState().setControlsLayout(layout)
  }

  const layouts: {
    value: ControlsLayout
    icon: React.ReactNode
    label: string
  }[] = [
    {
      value: "left",
      icon: <PanelLeft className="h-3.5 w-3.5" />,
      label: "Left",
    },
    {
      value: "bottom",
      icon: <PanelBottom className="h-3.5 w-3.5" />,
      label: "Bottom",
    },
    {
      value: "right",
      icon: <PanelRight className="h-3.5 w-3.5" />,
      label: "Right",
    },
  ]

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-neutral-400">
        Layout
      </label>
      <div className="flex gap-1 rounded-xl border border-neutral-700/50 bg-neutral-800/80 p-1">
        {layouts.map(layout => (
          <Button
            key={layout.value}
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-lg p-0 transition-all duration-200",
              controlsLayout === layout.value
                ? "bg-neutral-600 text-white shadow-md ring-1 ring-white/10"
                : "text-neutral-500 hover:bg-neutral-700/50 hover:text-white",
            )}
            onClick={() => handleToggle(layout.value)}
            title={`${layout.label} panel`}
          >
            {layout.icon}
          </Button>
        ))}
      </div>
    </div>
  )
}
