"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { fonts, themes } from "@/options";
import { cn } from "@/lib/utils";
import CodeEditor from "@/components/CodeEditor";
import WidthMeasurement from "@/components/WidthMeasurement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Resizable } from "re-resizable";
import ThemeSelect from "@/components/controls/ThemeSelect";
import LanguageSelect from "@/components/controls/LanguageSelect";
import { ResetIcon } from "@radix-ui/react-icons";
import FontSelect from "@/components/controls/FontSelect";
import FontSizeInput from "@/components/controls/FontSizeInput";
import PaddingSlider from "@/components/controls/PaddingSlider";
import BackgroundSwitch from "@/components/controls/BackgroundSwitch";
import DarkModeSwitch from "@/components/controls/DarkModeSwitch";
import ExportOptions from "@/components/controls/ExportOptions";
import LineNumbersSwitch from "@/components/controls/LineNumbersSwitch";
import WindowFrameSelect from "@/components/controls/WindowFrameSelect";
import LayoutToggle from "@/components/controls/LayoutToggle";
import { Keyboard } from "lucide-react";

// Control group wrapper component
function ControlGroup({
  title,
  children,
  vertical = false,
}: {
  title: string;
  children: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
        {title}
      </span>
      <div className={cn("flex gap-4 items-end", vertical && "flex-col items-stretch gap-3")}>
        {children}
      </div>
    </div>
  );
}

// Separator component for horizontal layout
function Separator({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <div className="h-px w-full bg-neutral-700/30 my-1" />
  ) : (
    <div className="w-px h-16 bg-neutral-700/50 mx-2" />
  );
}

import BackgroundEffects from "@/components/BackgroundEffects";

function App() {
  const [width, setWidth] = useState("auto");
  const [showWidth, setShowWidth] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const theme = usePreferencesStore((state) => state.theme);
  const padding = usePreferencesStore((state) => state.padding);
  const fontStyle = usePreferencesStore((state) => state.fontStyle);
  const showBackground = usePreferencesStore((state) => state.showBackground);
  const controlsLayout = usePreferencesStore((state) => state.controlsLayout);

  const editorRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size === 0) return;
    const state = Object.fromEntries(queryParams);

    usePreferencesStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    });
  }, []);

  const isSideLayout = controlsLayout === "left" || controlsLayout === "right";
  const isRightLayout = controlsLayout === "right";

  // Controls content - shared between layouts
  const controlsContent = (
    <>
      {/* Style Group */}
      <ControlGroup title="Style" vertical={isSideLayout}>
        <ThemeSelect />
      </ControlGroup>

      <Separator vertical={isSideLayout} />

      {/* Font Group */}
      <ControlGroup title="Font" vertical={isSideLayout}>
        <FontSelect />
        <FontSizeInput />
      </ControlGroup>

      <Separator vertical={isSideLayout} />

      {/* Code Group */}
      <ControlGroup title="Code" vertical={isSideLayout}>
        <LanguageSelect />
        <LineNumbersSwitch />
      </ControlGroup>

      <Separator vertical={isSideLayout} />

      {/* Canvas Group */}
      <ControlGroup title="Canvas" vertical={isSideLayout}>
        <WindowFrameSelect />
        <PaddingSlider />
      </ControlGroup>

      <Separator vertical={isSideLayout} />

      {/* Toggles Group */}
      <ControlGroup title="Display" vertical={isSideLayout}>
        <BackgroundSwitch />
        <DarkModeSwitch />
      </ControlGroup>

      <Separator vertical={isSideLayout} />

      {/* Layout & Export Group */}
      <ControlGroup title="Options" vertical={isSideLayout}>
        <LayoutToggle />
        <div className="flex flex-col gap-2">
          <label className="block text-xs font-medium text-neutral-400">
            Actions
          </label>
          <div className="flex gap-2 items-center">
            <ExportOptions
              targetRef={
                editorRef as unknown as React.RefObject<HTMLDivElement>
              }
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={() => setShowShortcuts(!showShortcuts)}
              title="Keyboard Shortcuts"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ControlGroup>
    </>
  );

  // Figma-like sidebar component with glassmorphism
  const SidePanel = ({ side }: { side: "left" | "right" }) => (
    <aside
      className={cn(
        "w-72 min-w-72 h-screen overflow-y-auto",
        // Glassmorphism effect
        "bg-neutral-900/60 backdrop-blur-3xl backdrop-saturate-150",
        "border-neutral-500/20",
        side === "left" ? "border-r rounded-r-3xl" : "border-l rounded-l-3xl",
        // Shadow and glow
        "shadow-2xl shadow-black/60",
        "ring-1 ring-white/5 ring-inset"
      )}
    >
      {/* Header with subtle gradient */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b border-white/10 bg-gradient-to-b from-neutral-800/80 to-transparent backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20" />
          <h2 className="text-sm font-semibold text-neutral-100 tracking-wide">Prism</h2>
        </div>
      </div>
      {/* Scrollable content */}
      <div className="p-4 flex flex-col gap-4">
        {controlsContent}
      </div>
    </aside>
  );

  return (
    <main className="dark min-h-screen flex bg-neutral-950 text-white">
      <link
        rel="stylesheet"
        href={themes[theme as keyof typeof themes].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle as keyof typeof fonts].src}
        crossOrigin="anonymous"
      />

      <BackgroundEffects />

      {/* Left Side Panel */}
      {controlsLayout === "left" && <SidePanel side="left" />}

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col gap-4 justify-center items-center p-4 flex-1",
        !isSideLayout && "min-h-screen"
      )}>
        {/* Editor Area */}
        <div className={cn(
          "w-full overflow-auto flex items-center justify-center p-4 border rounded-2xl border-neutral-800/50 bg-neutral-900/20",
          isSideLayout ? "flex-1" : "grow"
        )}>
          <Resizable
            enable={{ left: true, right: true }}
            minWidth={padding * 2 + 300}
            maxWidth="100%"
            size={{ width }}
            onResize={(e, dir, ref) => setWidth(ref.offsetWidth.toString())}
            onResizeStart={() => setShowWidth(true)}
            onResizeStop={() => setShowWidth(false)}
          >
            <div
              className={cn(
                "overflow-hidden mb-2 transition-all ease-out duration-300 rounded-xl",
                showBackground
                  ? themes[theme as keyof typeof themes].background
                  : "ring ring-neutral-900"
              )}
              style={{ padding }}
              ref={editorRef}
            >
              <CodeEditor />
            </div>
            <WidthMeasurement showWidth={showWidth} width={Number(width)} />
            <div
              className={cn(
                "transition-opacity w-fit mx-auto -mt-4",
                showWidth || width === "auto"
                  ? "invisible opacity-0 hidden"
                  : "visible opacity-100"
              )}
            >
              <Button size="sm" onClick={() => setWidth("auto")} variant="ghost">
                <ResetIcon className="mr-2" />
                Reset width
              </Button>
            </div>
          </Resizable>
        </div>

        {/* Bottom Control Panel */}
        {!isSideLayout && (
          <Card className="p-5 w-full max-w-5xl bg-neutral-900/70 backdrop-blur-xl border-neutral-800/50 shadow-2xl rounded-2xl">
            <CardContent className="flex flex-wrap gap-6 p-0 items-start justify-center">
              {controlsContent}
            </CardContent>
          </Card>
        )}

        {/* Keyboard Shortcuts Panel */}
        {showShortcuts && (
          <Card className="p-4 w-fit bg-neutral-900/90 backdrop-blur-xl border-neutral-700/50 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-xl">
            <div className="text-xs text-neutral-400 space-y-2">
              <div className="font-semibold text-neutral-300 mb-3">Keyboard Shortcuts</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <span>Copy Image</span>
                <span className="text-neutral-500">⌘ C</span>
                <span>Copy Link</span>
                <span className="text-neutral-500">⇧ ⌘ C</span>
                <span>Save as PNG</span>
                <span className="text-neutral-500">⌘ S</span>
                <span>Save as SVG</span>
                <span className="text-neutral-500">⇧ ⌘ S</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Right Side Panel */}
      {controlsLayout === "right" && <SidePanel side="right" />}
    </main>
  );
}

export default App;
