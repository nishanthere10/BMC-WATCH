"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Map, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Nearby Works", href: "/nearby", icon: Map },
    { name: "About", href: "#", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <Eye size={20} />
          </div>
          <span>BMC<span className="text-primary">Watch</span></span>
        </Link>

        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}