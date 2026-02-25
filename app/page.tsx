"use client"

import { ResetIcon } from "@radix-ui/react-icons"
import { Keyboard } from "lucide-react"
import { Resizable } from "re-resizable"
import { useEffect, useRef, useState } from "react"

import CodeEditor from "@/components/CodeEditor"
import BackgroundSwitch from "@/components/controls/BackgroundSwitch"
import DarkModeSwitch from "@/components/controls/DarkModeSwitch"
import ExportOptions from "@/components/controls/ExportOptions"
import FontSelect from "@/components/controls/FontSelect"
import FontSizeInput from "@/components/controls/FontSizeInput"
import ImageUpload from "@/components/controls/ImageUpload"
import LanguageSelect from "@/components/controls/LanguageSelect"
import LayoutToggle from "@/components/controls/LayoutToggle"
import LineNumbersSwitch from "@/components/controls/LineNumbersSwitch"
import PaddingSlider from "@/components/controls/PaddingSlider"
import ThemeSelect from "@/components/controls/ThemeSelect"
import WindowFrameSelect from "@/components/controls/WindowFrameSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import WidthMeasurement from "@/components/WidthMeasurement"
import { cn } from "@/lib/utils"
import { fonts, themes } from "@/options"
import { usePreferencesStore } from "@/store/use-preferences-store"

// Control group wrapper component
function ControlGroup({
  title,
  children,
  vertical = false,
}: {
  title: string
  children: React.ReactNode
  vertical?: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
        {title}
      </span>
      <div
        className={cn(
          "flex items-end gap-4",
          vertical && "flex-col items-stretch gap-3 [&>div]:w-full",
        )}
      >
        {children}
      </div>
    </div>
  )
}

// Separator component for horizontal layout
function Separator({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <div className="my-1 h-px w-full bg-neutral-700/30" />
  ) : (
    <div className="mx-2 h-16 w-px bg-neutral-700/50" />
  )
}

import BackgroundEffects from "@/components/BackgroundEffects"

function App() {
  const [width, setWidth] = useState("auto")
  const [showWidth, setShowWidth] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const theme = usePreferencesStore(state => state.theme)
  const padding = usePreferencesStore(state => state.padding)
  const fontStyle = usePreferencesStore(state => state.fontStyle)
  const showBackground = usePreferencesStore(state => state.showBackground)
  const controlsLayout = usePreferencesStore(state => state.controlsLayout)

  const editorRef = useRef(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.size === 0) return
    const state = Object.fromEntries(queryParams)

    usePreferencesStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    })
  }, [])

  const isSideLayout = controlsLayout === "left" || controlsLayout === "right"
  const isRightLayout = controlsLayout === "right"

  // Controls content - shared between layouts
  const controlsContent = (
    <>
      {/* Content Group */}
      <ControlGroup title="Content" vertical={isSideLayout}>
        <ImageUpload />
      </ControlGroup>

      <Separator vertical={isSideLayout} />

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
          <div className="flex items-center gap-2">
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
  )

  // Figma-like sidebar component with glassmorphism
  const SidePanel = ({ side }: { side: "left" | "right" }) => (
    <aside
      className={cn(
        "h-screen w-80 min-w-80 overflow-y-auto",
        // Glassmorphism effect
        "bg-neutral-900/60 backdrop-blur-3xl backdrop-saturate-150",
        "border-neutral-500/20",
        side === "left" ? "rounded-r-3xl border-r" : "rounded-l-3xl border-l",
        // Shadow and glow
        "shadow-2xl shadow-black/60",
        "ring-1 ring-white/5 ring-inset",
      )}
    >
      {/* Header with subtle gradient */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-b from-neutral-800/80 to-transparent px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20" />
          <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
            Prism
          </h2>
        </div>
      </div>
      {/* Scrollable content */}
      <div className="flex flex-col gap-4 p-4">{controlsContent}</div>
    </aside>
  )

  return (
    <main className="dark flex min-h-screen bg-neutral-950 text-white">
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
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-4 p-4",
          !isSideLayout && "min-h-screen",
        )}
      >
        {/* Editor Area */}
        <div
          className={cn(
            "flex w-full items-center justify-center overflow-auto rounded-2xl border border-neutral-800/50 bg-neutral-900/20 p-4",
            isSideLayout ? "flex-1" : "grow",
          )}
        >
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
                "mb-2 overflow-hidden rounded-xl transition-all duration-300 ease-out",
                showBackground
                  ? themes[theme as keyof typeof themes].background
                  : "ring ring-neutral-900",
              )}
              style={{ padding }}
              ref={editorRef}
            >
              <CodeEditor />
            </div>
            <WidthMeasurement showWidth={showWidth} width={Number(width)} />
            <div
              className={cn(
                "mx-auto -mt-4 w-fit transition-opacity",
                showWidth || width === "auto"
                  ? "invisible hidden opacity-0"
                  : "visible opacity-100",
              )}
            >
              <Button
                size="sm"
                onClick={() => setWidth("auto")}
                variant="ghost"
              >
                <ResetIcon className="mr-2" />
                Reset width
              </Button>
            </div>
          </Resizable>
        </div>

        {/* Bottom Control Panel */}
        {!isSideLayout && (
          <Card className="w-full max-w-5xl rounded-2xl border-neutral-800/50 bg-neutral-900/70 p-5 shadow-2xl backdrop-blur-xl">
            <CardContent className="flex flex-wrap items-start justify-center gap-6 p-0">
              {controlsContent}
            </CardContent>
          </Card>
        )}

        {/* Keyboard Shortcuts Panel */}
        {showShortcuts && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 w-fit rounded-xl border-neutral-700/50 bg-neutral-900/90 p-4 shadow-xl backdrop-blur-xl duration-200">
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="mb-3 font-semibold text-neutral-300">
                Keyboard Shortcuts
              </div>
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
  )
}

export default App
