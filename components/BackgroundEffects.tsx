import { cn } from "@/lib/utils";
import { themes } from "@/options";
import { usePreferencesStore } from "@/store/use-preferences-store";

export default function BackgroundEffects() {
  const theme = usePreferencesStore((state) => state.theme);
  const showBackground = usePreferencesStore((state) => state.showBackground);

  if (!showBackground) return null;

  const currentTheme = themes[theme as keyof typeof themes];
  // Extract a color from the theme or defaults if complex gradient
  // Check if glow color exists in theme options (added in previous step)
  const glowColor = (currentTheme as any).glow || "rgba(100, 100, 100, 0.2)";

  // Parse glow color to get RGB values for the blob gradients
  // Rough fallback for demo if not perfectly parsed
  const primaryColor = glowColor; 

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div 
        className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
        style={{
            backgroundColor: primaryColor,
            opacity: 0.15
        }}
      />
      <div 
        className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
        style={{
            backgroundColor: primaryColor,
            filter: "hue-rotate(60deg) blur(64px)", // Shift hue for variation
            opacity: 0.15
        }}
      />
      <div 
        className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
         style={{
            backgroundColor: primaryColor,
            filter: "hue-rotate(120deg) blur(64px)", // Shift hue for variation
            opacity: 0.15
        }}
      />
      
      {/* Mesh grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>
  );
}
