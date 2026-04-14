"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "qr-reader-container";

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch((err) => console.error("Stop failed", err));
      }
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(scannerRegionId);
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      setIsScanning(true);

      await scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          stopScanning();
          onScanSuccess(decodedText);
        },
        () => {
          // Frequent scan failures — ignored for clean UX
        }
      );
    } catch (err: unknown) {
      setIsScanning(false);
      const errorMessage = err instanceof Error ? err.message : String(err) || "Camera access denied or not found.";
      setError(errorMessage);
      if (onScanError) onScanError(errorMessage);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">

      {/* Scanner Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-700 dark:border-slate-700">
        <div id={scannerRegionId} className="w-full h-full" />

        {/* Idle Overlay */}
        <AnimatePresence>
          {!isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#070D1A]/90 text-white p-6 text-center z-10"
            >
              <div className="w-16 h-16 rounded-2xl border-2 border-[#0055A4]/60 bg-[#0055A4]/15 flex items-center justify-center mb-4">
                <Camera className="text-[#38BDF8]" size={30} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2" style={{ letterSpacing: "-0.02em" }}>
                Ready to Scan
              </h3>
              <p className="text-sm text-slate-400 font-medium mb-6 max-w-[200px] leading-relaxed">
                Point your camera at the BMC project QR code on the site board.
              </p>
              <button
                onClick={startScanning}
                className="cr-btn-primary px-8 py-3 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <Camera size={16} />
                Launch Camera
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active scanning indicator */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <motion.div
              initial={{ top: "10%" }}
              animate={{ top: "85%" }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatType: "reverse" }}
              className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent"
              style={{ boxShadow: "0 0 12px 2px rgba(56,189,248,0.7)" }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {isScanning && (
          <button
            onClick={stopScanning}
            className="cr-btn-danger flex items-center gap-2"
          >
            <CameraOff size={16} /> Stop Scanner
          </button>
        )}

        {error && (
          <button
            onClick={startScanning}
            className="cr-btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} /> Retry
          </button>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="cr-error-box flex items-start gap-3 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">Camera Error</p>
                <p className="text-xs font-medium opacity-80">
                  {error.includes("NotAllowedError")
                    ? "Camera permission denied. Enable camera access in your browser settings."
                    : "Could not initialize camera. Ensure you are on HTTPS and have a camera connected."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}