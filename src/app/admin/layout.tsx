"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated, logout } from "@/lib/auth";
import { LayoutDashboard, FolderKanban, Tags, Settings, LogOut, ArrowLeft, Home } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = isAdminAuthenticated();
    const timer = setTimeout(() => {
      setIsAuthenticated(authStatus);
      // If not authenticated and trying to access admin pages (except login), redirect to login
      if (!authStatus && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  // Prevent flash of content during checking session
  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white space-y-4 flex-col">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <span className="text-[10px] font-bold tracking-widest uppercase">Verifying Admin Session...</span>
      </div>
    );
  }

  // If on login page, render without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center">{children}</div>;
  }

  // If unauthorized and loading redirect, show nothing
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  const menuItems = [
    { name: "대시보드", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "프로젝트 관리", href: "/admin/projects", icon: <FolderKanban className="h-4 w-4" /> },
    { name: "카테고리 관리", href: "/admin/categories", icon: <Tags className="h-4 w-4" /> },
    { name: "전역 사이트 설정", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo & Main Site shortcut */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
            <div>
              <span className="text-xs font-bold text-neutral-500 tracking-wider">CMS SYSTEM</span>
              <h2 className="text-lg font-black tracking-tighter text-white">NEXUS ADMIN</h2>
            </div>
            <Link
              href="/"
              title="Go to Live Site"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-accent transition-colors"
            >
              <Home className="h-4 w-4 text-white" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-neutral-800 pt-5 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            사용자 페이지로
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 sm:p-12 bg-neutral-950">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
