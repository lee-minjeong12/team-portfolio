"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, getCategories, getSettings } from "@/lib/db";
import { Settings } from "@/lib/types";
import { FileText, FolderKanban, Tags, MessageSquare, ArrowRight, Calendar, Mail } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [projectCount, setProjectCount] = useState(0);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, categories, settingsData] = await Promise.all([
          getProjects({ includeUnpublished: true }), // Get all including draft
          getCategories(),
          getSettings(),
        ]);

        setProjectCount(projects.length);
        setActiveProjectCount(projects.filter((p) => p.is_published).length);
        setCategoryCount(categories.length);
        setSettings(settingsData);

        // Load mock inquiries from localStorage
        if (typeof window !== "undefined") {
          const localInq = JSON.parse(localStorage.getItem("nexus_inquiries") || "[]");
          // Sort by latest
          const sortedInq = localInq.sort(
            (a: Inquiry, b: Inquiry) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setInquiries(sortedInq);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleDeleteInquiry = (id: string) => {
    if (confirm("이 문의 내역을 삭제하시겠습니까?")) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      setInquiries(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("nexus_inquiries", JSON.stringify(updated));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-bold tracking-widest text-neutral-400">CALCULATING METRICS...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "전체 프로젝트",
      value: projectCount,
      sub: `공개중: ${activeProjectCount}개 / 비공개: ${projectCount - activeProjectCount}개`,
      icon: <FolderKanban className="h-5 w-5 text-blue-400" />,
      link: "/admin/projects",
    },
    {
      title: "등록된 카테고리",
      value: categoryCount,
      sub: "정렬 순서에 따른 필터 제공",
      icon: <Tags className="h-5 w-5 text-emerald-400" />,
      link: "/admin/categories",
    },
    {
      title: "고객 문의",
      value: inquiries.length,
      sub: "웹 사이트 인콰이어리 폼 수신함",
      icon: <MessageSquare className="h-5 w-5 text-indigo-400" />,
      link: "#inquiries-section",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
            OVERVIEW
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">대시보드</h1>
        </div>
        <div className="text-xs text-neutral-400 font-light bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
          최근 사이트 업데이트: {settings ? new Date(settings.updated_at).toLocaleDateString() : "-"}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-lg hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-neutral-400 font-bold tracking-tight block mb-1">
                  {card.title}
                </span>
                <span className="text-3xl font-black text-white">{card.value}</span>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">{card.icon}</div>
            </div>
            <div className="flex justify-between items-center border-t border-neutral-800/80 pt-4 text-xs">
              <span className="text-neutral-500">{card.sub}</span>
              <Link href={card.link} className="text-accent hover:text-blue-300 font-bold flex items-center gap-0.5">
                바로가기
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Summary Panel */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white tracking-wide border-b border-neutral-800/80 pb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-neutral-400" />
          활성 사이트 메타 정보
        </h2>
        {settings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block mb-1">사이트 타이틀</span>
              <p className="text-neutral-300 font-medium">{settings.site_title}</p>
            </div>
            <div>
              <span className="text-neutral-500 block mb-1">대표 이메일</span>
              <p className="text-neutral-300 font-medium">{settings.contact_email}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-neutral-500 block mb-1">히어로 헤드라인</span>
              <p className="text-neutral-300 font-medium">{settings.hero_title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Inquiries Inbox */}
      <div id="inquiries-section" className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-neutral-400" />
            고객 문의 수신함
          </h2>
          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-900 font-bold px-2 py-0.5 rounded-full">
            Total {inquiries.length}
          </span>
        </div>

        {inquiries.length > 0 ? (
          <div className="divide-y divide-neutral-800">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 hover:bg-neutral-900/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-white">{inq.subject}</span>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-light">
                      <span className="font-bold text-neutral-300">{inq.name}</span>
                      <span>|</span>
                      <a href={`mailto:${inq.email}`} className="hover:text-accent flex items-center gap-0.5">
                        <Mail className="h-3 w-3" />
                        {inq.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inq.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light whitespace-pre-line bg-neutral-950 p-4 border border-neutral-800/80 rounded-lg">
                  {inq.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-neutral-500">
            수신된 고객 문의가 존재하지 않습니다.
          </div>
        )}
      </div>
    </div>
  );
}
