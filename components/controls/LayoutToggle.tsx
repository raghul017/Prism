import { ControlsLayout, usePreferencesStore } from "@/store/use-preferences-store";
import { Button } from "../ui/button";
import { PanelLeft, PanelRight, PanelBottom } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LayoutToggle() {
  const controlsLayout = usePreferencesStore((state) => state.controlsLayout);

  const handleToggle = (layout: ControlsLayout) => {
    usePreferencesStore.getState().setControlsLayout(layout);
  };

  const layouts: { value: ControlsLayout; icon: React.ReactNode; label: string }[] = [
    { value: "left", icon: <PanelLeft className="h-3.5 w-3.5" />, label: "Left" },
    { value: "bottom", icon: <PanelBottom className="h-3.5 w-3.5" />, label: "Bottom" },
    { value: "right", icon: <PanelRight className="h-3.5 w-3.5" />, label: "Right" },
  ];

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Layout
      </label>
      <div className="flex gap-0.5 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/50">
        {layouts.map((layout) => (
          <Button
            key={layout.value}
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 w-7 p-0 rounded-lg transition-all duration-200",
              controlsLayout === layout.value
                ? "bg-neutral-600 text-white shadow-sm"
                : "text-neutral-500 hover:text-white hover:bg-neutral-700/50"
            )}
            onClick={() => handleToggle(layout.value)}
            title={`${layout.label} panel`}
          >
            {layout.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}
