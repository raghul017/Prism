import { cn } from "@/lib/utils";
import flourite from "flourite";
import { codeSnippets, fonts, themes } from "@/options";
import hljs from "highlight.js";
import { useEffect, useState, useMemo } from "react";
import Editor from "react-simple-code-editor";
import { usePreferencesStore, WindowFrame } from "@/store/use-preferences-store";

// Stable default snippet for SSR (first snippet in array)
const defaultSnippet = codeSnippets[0];

// Window frame components for different styles
function MacOSFrame() {
  return (
    <div className="flex gap-1.5">
      <div className="rounded-full h-3 w-3 bg-red-500 transition-transform hover:scale-110 cursor-pointer" />
      <div className="rounded-full h-3 w-3 bg-yellow-500 transition-transform hover:scale-110 cursor-pointer" />
      <div className="rounded-full h-3 w-3 bg-green-500 transition-transform hover:scale-110 cursor-pointer" />
    </div>
  );
}

function WindowsFrame() {
  return (
    <div className="flex gap-1 text-neutral-400">
      <button className="w-6 h-5 flex items-center justify-center hover:bg-neutral-700/50 rounded transition-colors text-xs">
        ─
      </button>
      <button className="w-6 h-5 flex items-center justify-center hover:bg-neutral-700/50 rounded transition-colors text-xs">
        □
      </button>
      <button className="w-6 h-5 flex items-center justify-center hover:bg-red-600/80 rounded transition-colors text-xs">
        ×
      </button>
    </div>
  );
}

function MinimalFrame() {
  return (
    <div className="flex gap-1.5">
      <div className="rounded-full h-2.5 w-2.5 bg-neutral-500 transition-opacity hover:opacity-70" />
    </div>
  );
}

const frameComponents: Record<WindowFrame, React.FC | null> = {
  macos: MacOSFrame,
  windows: WindowsFrame,
  minimal: MinimalFrame,
  none: null,
};

export default function CodeEditor() {
  const store = usePreferencesStore();
  const [mounted, setMounted] = useState(false);

  // Set mounted flag and random snippet on client-side only
  useEffect(() => {
    setMounted(true);
    const currentCode = usePreferencesStore.getState().code;
    if (!currentCode) {
      const randomSnippet =
        codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      usePreferencesStore.setState(randomSnippet);
    }
  }, []);

  // Auto Detect Language
  useEffect(() => {
    if (store.autoDetectLanguage) {
      const { language } = flourite(store.code, { noUnknown: true });
      usePreferencesStore.setState({
        language: language.toLowerCase() || "plaintext",
      });
    }
  }, [store.autoDetectLanguage, store.code]);

  // Use default snippet values during SSR, actual values after mount
  const displayCode = mounted ? store.code : defaultSnippet.code;
  const displayLanguage = mounted ? store.language : defaultSnippet.language;

  // Calculate line numbers
  const lineNumbers = useMemo(() => {
    const lines = displayCode.split("\n");
    return lines.map((_, i) => i + 1);
  }, [displayCode]);

  const FrameComponent = frameComponents[store.windowFrame];
  const showHeader = store.windowFrame !== "none";

  const currentTheme = themes[store.theme as keyof typeof themes];

  return (
    <div
      className={cn(
        "border-2 rounded-xl transition-all duration-300 overflow-hidden",
        store.darkMode
          ? "bg-black/75 border-gray-600/40"
          : "bg-white/75 border-gray-200/20"
      )}
      style={{
        boxShadow: store.showBackground ? `0 0 80px -20px ${currentTheme.glow}` : 'none'
      }}
    >
      {showHeader && (
        <header
          className={cn(
            "flex items-center px-4 py-3",
            store.windowFrame === "windows" ? "justify-end gap-4" : "justify-between"
          )}
        >
          {store.windowFrame !== "windows" && FrameComponent && <FrameComponent />}
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              value={store.title}
              onChange={(e) =>
                usePreferencesStore.setState({ title: e.target.value })
              }
              spellCheck={false}
              onClick={(e) => {
                if (e.target instanceof HTMLInputElement) {
                  e.target.select();
                }
              }}
              className="bg-transparent text-center text-gray-400 text-sm font-medium focus:outline-none transition-colors hover:text-gray-300 max-w-[200px]"
            />
          </div>
          {store.windowFrame === "windows" && <WindowsFrame />}
          {store.windowFrame !== "windows" && <div className="w-12" />}
        </header>
      )}
      <div
        className={cn(
          "px-4 pb-4 flex",
          !showHeader && "pt-4",
          store.darkMode
            ? "brightness-110"
            : "text-gray-800 brightness-50 saturate-200 contrast-200"
        )}
      >
        {store.showLineNumbers && (
          <div
            className="pr-4 text-right select-none border-r border-gray-600/30 mr-4"
            style={{
              fontFamily: fonts[store.fontStyle as keyof typeof fonts].name,
              fontSize: store.fontSize,
              lineHeight: "1.5",
            }}
          >
            {lineNumbers.map((num) => (
              <div key={num} className="text-gray-500/50">
                {num}
              </div>
            ))}
          </div>
        )}
        <div
          className={cn(
            "flex-1 min-w-0 overflow-hidden mb-2 transition-all ease-out duration-300 rounded-xl",
            store.darkMode
              ? "brightness-110"
              : "text-gray-800 brightness-50 saturate-200 contrast-200"
          )}
        >
          <Editor
            value={displayCode}
            onValueChange={(code) => usePreferencesStore.setState({ code })}
            highlight={(code) =>
              hljs.highlight(code, { language: displayLanguage || "plaintext" })
                .value
            }
            style={{
              fontFamily: fonts[store.fontStyle as keyof typeof fonts].name,
              fontSize: store.fontSize,
            }}
            textareaClassName="focus:outline-none"
            onClick={(e) => {
              if (e.target instanceof HTMLTextAreaElement) {
                e.target.select();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}


