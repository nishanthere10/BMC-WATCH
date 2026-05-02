"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoUploadProps {
  onChange: (file: File | null) => void;
  error?: string;
}

export default function PhotoUpload({ onChange, error }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL to prevent memory leaks
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const removePhoto = () => {
    // Revoke blob URL to prevent memory leaks
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="cr-label block mb-2">
        Capture Site Photo
      </label>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          // No capture attribute — allows both camera and gallery on mobile, and file picker on desktop
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 transition-all
                hover:border-[#0055A4] dark:hover:border-[#38BDF8]
                hover:bg-blue-50/50 dark:hover:bg-blue-950/20
                hover:shadow-[4px_4px_0px_0px_rgba(0,85,164,0.1)]
                flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-[#0055A4] dark:group-hover:border-[#38BDF8] group-hover:text-[#0055A4] dark:group-hover:text-[#38BDF8] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                <UploadCloud size={26} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Tap to Take Photo</p>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">Capture the road work site · Max 5MB</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)] bg-slate-100"
            >
              <img
                src={preview}
                alt="Issue preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={removePhoto}
                  className="cr-btn-danger h-8 w-8 p-0 flex items-center justify-center rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center">
                <p className="text-[10px] text-white font-mono font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
                  <ImageIcon size={10} /> Site Photo Captured
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}