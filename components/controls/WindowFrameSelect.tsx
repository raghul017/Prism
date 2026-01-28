import { WindowFrame, usePreferencesStore } from "@/store/use-preferences-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const frameOptions: { value: WindowFrame; label: string; icon: React.ReactNode }[] = [
  {
    value: "macos",
    label: "macOS",
    icon: (
      <div className="flex gap-1">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
    ),
  },
  {
    value: "windows",
    label: "Windows",
    icon: (
      <div className="flex gap-1 text-[10px]">
        <span className="w-4 h-4 flex items-center justify-center bg-neutral-700 rounded-sm">─</span>
        <span className="w-4 h-4 flex items-center justify-center bg-neutral-700 rounded-sm">□</span>
        <span className="w-4 h-4 flex items-center justify-center bg-red-600 rounded-sm">×</span>
      </div>
    ),
  },
  {
    value: "minimal",
    label: "Minimal",
    icon: <div className="w-2.5 h-2.5 rounded-full bg-neutral-500" />,
  },
  {
    value: "none",
    label: "None",
    icon: <div className="w-4 h-0.5 bg-neutral-600 rounded" />,
  },
];

export default function WindowFrameSelect() {
  const windowFrame = usePreferencesStore((state) => state.windowFrame);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Window Style
      </label>
      <Select
        value={windowFrame}
        onValueChange={(value: WindowFrame) =>
          usePreferencesStore.getState().setWindowFrame(value)
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select Style" />
        </SelectTrigger>
        <SelectContent className="dark">
          {frameOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex gap-2 items-center">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
