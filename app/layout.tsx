import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, DM_Sans, Merriweather, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Navbar from "@/app/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BMC Civic Watch | Transparency Portal",
  description: "Government accountability platform tracking Brihanmumbai Municipal Corporation projects.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BMC Watch",
  },
};

export const viewport: Viewport = {
  themeColor: "#00287a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlex.variable} ${dmSans.variable} ${merriweather.variable} ${jetbrainsMono.variable} ${syne.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="/css/ux4g.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-[#0A0F1E] text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
