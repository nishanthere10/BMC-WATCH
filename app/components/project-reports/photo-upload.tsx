"use client";

import { useState, useRef } from "react";
import { Camera, X, Image as ImageIcon, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const removePhoto = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
        Upload Photo Evidence
      </label>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          capture="environment" // Forces mobile to open camera first
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
              className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-700">Tap to Take Photo</p>
                <p className="text-xs text-slate-400">or select from gallery (Max 5MB)</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-2xl overflow-hidden border shadow-inner bg-slate-100"
            >
              <img
                src={preview}
                alt="Issue preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="rounded-full h-8 w-8 shadow-lg"
                  onClick={removePhoto}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-center">
                <p className="text-[10px] text-white font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
                  <ImageIcon size={10} /> Photo Ready
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