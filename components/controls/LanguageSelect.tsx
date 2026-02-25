import { MagicWandIcon } from "@radix-ui/react-icons"

import { languages } from "@/options"
import { usePreferencesStore } from "@/store/use-preferences-store"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export default function LanguageSelect() {
  const language = usePreferencesStore(state => state.language)
  const autoDetectLanguage = usePreferencesStore(
    state => state.autoDetectLanguage,
  )

  const handleChange = (language: string) => {
    if (language === "auto-detect") {
      usePreferencesStore.setState({
        autoDetectLanguage: true,
        language: "plaintext",
      })
    } else {
      usePreferencesStore.setState({ autoDetectLanguage: false, language })
    }
  }
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-neutral-400">
        Language
      </label>
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          {autoDetectLanguage && <MagicWandIcon className="mr-2" />}
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="dark max-h-[500px]">
          <SelectItem value="auto-detect">Auto Detect</SelectItem>
          {Object.entries(languages).map(([lang, name]) => (
            <SelectItem key={lang} value={lang}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
