"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/db";
import { Settings as SettingsType } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/mockData";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    }
    loadSettings();
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white mb-4">
              NEXUS CREATIVE
            </h3>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed font-light">
              {settings.site_description}
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <span className="text-xs font-bold tracking-widest text-neutral-400">
              GET IN TOUCH
            </span>
            <a
              href={`mailto:${settings.contact_email}`}
              className="text-lg font-medium text-white hover:text-accent transition-colors duration-300 flex items-center gap-1 group"
            >
              {settings.contact_email}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <div className="flex gap-6 mt-4">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors duration-300"
              >
                INSTAGRAM
              </a>
              <a
                href={settings.behance_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors duration-300"
              >
                BEHANCE
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 font-light">
            © {new Date().getFullYear()} NEXUS. All rights reserved.
          </span>
          <Link
            href="/admin/login"
            className="text-[10px] tracking-wider text-neutral-500 hover:text-neutral-300 font-medium"
          >
            ADMIN CONSOLE
          </Link>
        </div>
      </div>
    </footer>
  );
}
