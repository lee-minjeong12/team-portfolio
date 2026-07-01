"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminAuthenticated } from "@/lib/auth";
import { Settings } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in to show Admin shortcut on next tick to avoid cascading render warnings
    const timer = setTimeout(() => {
      setIsAdmin(isAdminAuthenticated());
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const navItems = [
    { name: "WORKS", href: "/works" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  // If we are inside the admin panel, we don't show the main visitor header
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-foreground transition-colors duration-300 group-hover:text-accent">
            NEXUS
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
        </Link>

        <nav className="flex items-center gap-8 sm:gap-12">
          <ul className="flex items-center gap-6 sm:gap-8 text-sm font-bold tracking-widest">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-2 text-xs transition-colors duration-300 hover:text-foreground ${
                      isActive ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {isAdmin ? (
            <Link
              href="/admin/projects"
              className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-background transition-transform duration-300 hover:scale-105"
            >
              <Settings className="h-3 w-3" />
              ADMIN
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="text-[10px] font-bold tracking-wider text-muted hover:text-foreground"
            >
              LOGIN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
