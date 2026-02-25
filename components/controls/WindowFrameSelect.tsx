import { usePreferencesStore, WindowFrame } from "@/store/use-preferences-store"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const frameOptions: {
  value: WindowFrame
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: "macos",
    label: "macOS",
    icon: (
      <div className="flex gap-1">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
      </div>
    ),
  },
  {
    value: "windows",
    label: "Windows",
    icon: (
      <div className="flex gap-1 text-[10px]">
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-neutral-700">
          ─
        </span>
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-neutral-700">
          □
        </span>
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-red-600">
          ×
        </span>
      </div>
    ),
  },
  {
    value: "minimal",
    label: "Minimal",
    icon: <div className="h-2.5 w-2.5 rounded-full bg-neutral-500" />,
  },
  {
    value: "none",
    label: "None",
    icon: <div className="h-0.5 w-4 rounded bg-neutral-600" />,
  },
]

export default function WindowFrameSelect() {
  const windowFrame = usePreferencesStore(state => state.windowFrame)

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-neutral-400">
        Window Style
      </label>
      <Select
        value={windowFrame}
        onValueChange={(value: WindowFrame) =>
          usePreferencesStore.getState().setWindowFrame(value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Style" />
        </SelectTrigger>
        <SelectContent className="dark">
          {frameOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
