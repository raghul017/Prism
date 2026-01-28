import { themes } from "@/options";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { CheckIcon } from "lucide-react";

export default function ThemeSelect() {
  const theme = usePreferencesStore((state) => state.theme);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Theme
      </label>
      <div className="flex flex-wrap gap-2 max-w-[280px]">
        {Object.entries(themes).map(([name, themeData]) => (
          <button
            key={name}
            onClick={() => usePreferencesStore.setState({ theme: name })}
            className={cn(
              "w-8 h-8 rounded-lg transition-all duration-200 relative group",
              themeData.background,
              theme === name
                ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110"
                : "hover:scale-105 hover:ring-1 hover:ring-white/50"
            )}
            title={name.charAt(0).toUpperCase() + name.slice(1)}
          >
            {theme === name && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            )}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap capitalize">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

