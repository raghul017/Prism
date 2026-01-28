import { usePreferencesStore } from "@/store/use-preferences-store";
import { Switch } from "../ui/switch";

export default function LineNumbersSwitch() {
  const showLineNumbers = usePreferencesStore((state) => state.showLineNumbers);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Line Numbers
      </label>
      <Switch
        checked={showLineNumbers}
        onCheckedChange={() => usePreferencesStore.getState().toggleLineNumbers()}
        className="my-1.5"
      />
    </div>
  );
}
