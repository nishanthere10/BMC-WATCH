"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { QrCode, ScanLine, Loader2 } from "lucide-react";

interface ProjectQRProps {
  projectId: string;
}

export default function ProjectQR({ projectId }: ProjectQRProps) {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  useEffect(() => {
    // Generate the full production URL to this specific project mapping the existing scanner paradigm
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const fullUrl = `${baseUrl}/projects/${projectId}`;

    QRCode.toDataURL(fullUrl, {
      width: 250,
      margin: 1,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF00", // Transparent background
      },
    })
      .then((url: string) => {
        setQrSrc(url);
      })
      .catch((err: unknown) => {
        console.error("QR Generation failed", err);
      });
  }, [projectId]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-3xl shadow-xl w-full">
      <div className="flex items-center gap-2 mb-4 text-[#0F172A] dark:text-white font-heading font-bold text-lg">
        <QrCode size={20} className="text-[#2563EB]" /> Fast Access QR Code
      </div>
      
      <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200">
        {qrSrc ? (
          <Image src={qrSrc} alt={`QR Code for Project ${projectId}`} width={160} height={160} className="object-contain rounded-xl" />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-slate-50 rounded-xl">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Share this Project Location</p>
        <p className="text-xs text-slate-500 max-w-[200px] flex items-center gap-1 justify-center">
          <ScanLine size={12} /> Scan via BMC Watch scanner
        </p>
      </div>
    </div>
  );
}
