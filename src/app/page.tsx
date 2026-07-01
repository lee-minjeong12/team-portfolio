"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, getSettings } from "@/lib/db";
import { Project, Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/mockData";
import PortfolioCard from "@/components/PortfolioCard";
import { ArrowRight, MoveRight } from "lucide-react";

export default function Home() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [settingsData, projectsData] = await Promise.all([
          getSettings(),
          getProjects({ featuredOnly: true }),
        ]);
        setSettings(settingsData);
        setFeaturedProjects(projectsData);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[70vh] flex-col justify-center px-6 sm:px-8 py-20 bg-background max-w-7xl mx-auto w-full">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card-bg px-3 py-1 text-[10px] font-bold tracking-wider text-muted uppercase">
            Creative Studio
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
            {settings.hero_title}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl font-light leading-relaxed">
            {settings.hero_subtitle}
          </p>
          <div className="pt-4 flex gap-4">
            <Link
              href="/works"
              className="group flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-xs font-bold tracking-widest text-background transition-transform duration-300 hover:scale-105"
            >
              VIEW WORKS
              <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-xs font-bold tracking-widest text-foreground hover:bg-card-bg transition-colors duration-300"
            >
              TALK WITH US
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Works (univ.me inspired) */}
      <section className="w-full bg-card-bg border-y border-border py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                Featured Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                우리의 생각을 증명하는 대표 프로젝트
              </h2>
            </div>
            <Link
              href="/works"
              className="group inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-foreground hover:text-accent transition-colors duration-300"
            >
              ALL PROJECTS
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-[4/3] w-full animate-pulse bg-neutral-200" />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProjects.map((project) => (
                <PortfolioCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-sm text-neutral-400 border border-dashed border-border bg-background">
              등록된 대표 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 3. Brief Studio Intro */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto w-full px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              ABOUT NEXUS
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              We make it visual, <br className="hidden lg:block" />
              We make it real.
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
            <p>
              넥서스는 기획자, 디자이너, 에디터가 한 팀으로 모여 가장 현대적이고 트렌디한 시각 언어로 메시지를 시각화하는 크리에이티브 그룹입니다.
              단순히 아름다운 결과물에 그치지 않고, 클라이언트가 달성하고자 하는 비즈니스 골과 브랜드 본질을 깊이 관조하여 매력적인 시각 경험으로 풀어냅니다.
            </p>
            <p className="text-sm text-neutral-500">
              우리는 브랜딩, 디자인 가이드, 소셜 채널 비주얼 어셋, 고화질 숏폼 및 브랜드 필름까지 브랜드와 소비자가 맞닿는 모든 시각적 터치포인트를 설계합니다.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-foreground border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors duration-300"
              >
                LEARN MORE ABOUT US
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact CTA */}
      <section className="bg-foreground text-background border-t border-border py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-6 sm:space-y-8">
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            WORK WITH US
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            새로운 비주얼 스토리를 <br />함께 시작할 준비가 되셨나요?
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-light leading-relaxed">
            협업 문의부터 브랜드 분석 제안까지 언제든 열려있습니다. 넥서스와 함께 브랜드 가치를 극대화해보세요.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold tracking-widest text-black transition-transform duration-300 hover:scale-105"
            >
              START A PROJECT
              <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
