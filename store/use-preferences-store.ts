import { create } from "zustand";
import { persist } from "zustand/middleware";

// Window frame style types
export type WindowFrame = 'macos' | 'windows' | 'minimal' | 'none';
export type ControlsLayout = 'bottom' | 'left' | 'right';

interface PreferencesState {
  code: string;
  title: string;
  theme: string;
  darkMode: boolean;
  showBackground: boolean;
  language: string;
  autoDetectLanguage: boolean;
  fontSize: number;
  fontStyle: string;
  padding: number;
  showLineNumbers: boolean;
  windowFrame: WindowFrame;
  controlsLayout: ControlsLayout;
  customImage: string | null;
  contentMode: 'code' | 'image';

  // Setters
  setCode: (code: string) => void;
  setTitle: (title: string) => void;
  setTheme: (theme: string) => void;
  toggleDarkMode: () => void;
  toggleBackground: () => void;
  setLanguage: (language: string) => void;
  setAutoDetectLanguage: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setFontStyle: (style: string) => void;
  setPadding: (padding: number) => void;
  toggleLineNumbers: () => void;
  setWindowFrame: (frame: WindowFrame) => void;
  setControlsLayout: (layout: ControlsLayout) => void;
  setCustomImage: (image: string | null) => void;
  setContentMode: (mode: 'code' | 'image') => void;
}

// Create a persistent Zustand store with type safety and update methods
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      code: "",
      title: "Untitled",
      theme: "hyper",
      darkMode: true,
      showBackground: true,
      language: "plaintext",
      autoDetectLanguage: false,
      fontSize: 16,
      fontStyle: "jetBrainsMono",
      padding: 64,
      showLineNumbers: false,
      windowFrame: "macos",
      controlsLayout: "bottom",
      customImage: null,
      contentMode: "code",

      // Setters
      setCode: (code) => set({ code }),
      setTitle: (title) => set({ title }),
      setTheme: (theme) => set({ theme }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleBackground: () =>
        set((state) => ({ showBackground: !state.showBackground })),
      setLanguage: (language) => set({ language }),
      setAutoDetectLanguage: (enabled) => set({ autoDetectLanguage: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
      setFontStyle: (style) => set({ fontStyle: style }),
      setPadding: (padding) => set({ padding }),
      toggleLineNumbers: () =>
        set((state) => ({ showLineNumbers: !state.showLineNumbers })),
      setWindowFrame: (frame) => set({ windowFrame: frame }),
      setControlsLayout: (layout) => set({ controlsLayout: layout }),
      setCustomImage: (image) => set({ customImage: image, contentMode: 'image' }), // Auto-switch to image mode
      setContentMode: (mode) => set({ contentMode: mode }),
    }),
    {
      name: "user-preferences",
      version: 2, // Bump version to trigger migration
      migrate: (persistedState, version) => {
        const state = persistedState as PreferencesState;
        if (version < 2) {
          // Migrate old 'side' or 'bottom' values to 'right'
          const layout = state.controlsLayout as string;
          if (layout === 'side' || layout === 'bottom' || !['left', 'right', 'bottom'].includes(layout)) {
            state.controlsLayout = 'right';
          }
        }
        return state;
      },
      partialize: (state) => ({
        ...state,
        customImage: null, // Do not persist the large image string
      }),
    }
  )
);



