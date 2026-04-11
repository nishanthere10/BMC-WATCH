"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "qr-reader-container";

  // Cleanup on unmount
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
        { facingMode: "environment" }, // Prioritize back camera
        config,
        (decodedText) => {
          // Success: stop scanner and return result
          stopScanning();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Frequent scan failures (ignore to keep UI clean)
        }
      );
    } catch (err: any) {
      setIsScanning(false);
      const errorMessage = err?.toString() || "Camera access denied or not found.";
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
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-950 border-4 border-slate-200 shadow-xl">
        <div id={scannerRegionId} className="w-full h-full" />
        
        {/* Visual Overlay for Scanner */}
        <AnimatePresence>
          {!isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white p-6 text-center z-10"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 border border-primary/50">
                <Camera className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg">Ready to Scan</h3>
              <p className="text-sm text-slate-300 mt-2">
                Point your camera at the BMC project QR code on the site barricade.
              </p>
              <Button 
                onClick={startScanning}
                className="mt-6 bg-primary hover:bg-primary/90 text-white font-bold px-8"
              >
                Launch Camera
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <motion.div 
              initial={{ top: "10%" }}
              animate={{ top: "85%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatType: "reverse" }}
              className="absolute left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary shadow-[0_0_15px_rgba(59,130,246,1)]"
            />
            <div className="absolute inset-0 border-[40px] border-black/40" />
          </div>
        )}
      </div>

      {/* Controls & Feedback */}
      <div className="flex justify-center gap-3">
        {isScanning && (
          <Button 
            variant="destructive" 
            onClick={stopScanning}
            className="flex items-center gap-2"
          >
            <CameraOff size={18} /> Stop Scanner
          </Button>
        )}
        
        {error && (
          <Button 
            variant="outline" 
            onClick={startScanning}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} /> Retry
          </Button>
        )}
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Camera Error</AlertTitle>
              <AlertDescription className="text-xs">
                {error.includes("NotAllowedError") 
                  ? "Camera permission was denied. Please enable camera access in your browser settings."
                  : "Could not initialize camera. Ensure you are on HTTPS and have a camera connected."}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}