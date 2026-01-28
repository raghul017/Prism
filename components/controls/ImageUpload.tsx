"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { usePreferencesStore } from "@/store/use-preferences-store";

export default function ImageUpload() {
  const setCustomImage = usePreferencesStore((state) => state.setCustomImage);
  const customImage = usePreferencesStore((state) => state.customImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImage(result);
          toast.success("Image uploaded!");
        }
      };
      reader.readAsDataURL(file);
    },
    [setCustomImage]
  );

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomImage(null);
    usePreferencesStore.setState({ contentMode: "code" });
    toast.success("Switched back to code mode");
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setCustomImage(result);
            toast.success("Image pasted from clipboard!");
          }
        };
        reader.readAsDataURL(file);
      }
    };

    window.addEventListener("paste", handlePaste, true);
    return () => window.removeEventListener("paste", handlePaste, true);
  }, [setCustomImage]);

  return (
    <div className="flex flex-col gap-2">
      <div 
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-700 group relative"
      >
        <div className="p-2 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
          <ImageIcon className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm text-gray-300 truncate block">
            {customImage ? "Change Image" : "Upload Image"}
          </span>
        </div>
        
        {customImage ? (
           <div 
             onClick={handleRemoveImage}
             className="p-1 hover:bg-red-500/20 rounded-md transition-colors group/remove"
             title="Remove image and reset to code"
           >
             <X className="w-4 h-4 text-gray-500 group-hover/remove:text-red-400" />
           </div>
        ) : (
          <Upload className="w-3 h-3 text-gray-500" />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5 mt-1">
        <div className="flex items-center gap-2 w-full">
          <div className="h-px bg-neutral-800 flex-1" />
          <span className="text-[10px] text-neutral-500 font-medium uppercase">or</span>
          <div className="h-px bg-neutral-800 flex-1" />
        </div>
        <span className="text-xs text-neutral-500">
           Paste image <code className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400 text-[10px]">Ctrl+V</code>
        </span>
      </div>
    </div>
  );
}
