"use client";

import Link from "next/link";
import { MoveRight, Star, Heart, Zap, Sparkles } from "lucide-react";

export default function AboutPage() {
  const strengths = [
    {
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      title: "통합적 크리에이티브 시너지",
      description: "기획자와 브랜드 디자이너, 영상 모션 에디터가 긴밀히 협력하여 디자인과 미디어가 분리되지 않는 일관된 브랜드 경험을 도출합니다.",
    },
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      title: "트렌디한 비주얼 센스",
      description: "매일 변화하는 디지털 비주얼 트렌드를 정교하게 분석하고, 타겟의 감각을 직관적으로 저격할 수 있는 모던한 룩앤필을 구현합니다.",
    },
    {
      icon: <Star className="h-6 w-6 text-accent" />,
      title: "철저한 비즈니스 지향성",
      description: "단순한 시각적 장식을 배제하고, 클라이언트사의 마케팅 목표와 신규 유입 전환율을 실질적으로 자극하는 솔루션을 제시합니다.",
    },
  ];

  const processes = [
    {
      step: "01",
      title: "Briefing & Analysis",
      description: "대면 또는 비대면 브리핑을 통해 브랜드의 핵심 고민, 예산, 목표 타겟, 벤치마킹 스타일을 입체적으로 추출합니다.",
    },
    {
      step: "02",
      title: "Visual Concepting",
      description: "정의된 무드보드와 컬러 팔레트, 영상 시놉시스를 기획하여 크리에이티브 방향성을 일차적으로 합의합니다.",
    },
    {
      step: "03",
      title: "Production & Craft",
      description: "전문 디자이너와 영상 에디터가 본 제작에 착수하며, 최첨단 툴과 정교한 기법으로 디테일을 완성해갑니다.",
    },
    {
      step: "04",
      title: "Refinement & Delivery",
      description: "클라이언트 피드백을 신속하게 통합 수정한 후, 웹 배포 혹은 고화질 미디어 원본 파일 포맷으로 정밀 인도합니다.",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* 1. Header Banner */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
        <div className="max-w-3xl space-y-6">
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
            WHO WE ARE
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
            우리는 브랜드의 감각을 깨우는 크리에이터 팀입니다.
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-light leading-relaxed">
            넥서스는 차가운 텍스트 속 브랜드 가치를 가장 뜨겁고 트렌디한 시각 언어로 통역합니다.
            기획에서 제작, 숏폼 모션 그래픽, SNS 브랜딩 가이드라인까지 올인원 디자인 제작 시스템을 제공합니다.
          </p>
        </div>
      </section>

      {/* 2. Core Strengths */}
      <section className="bg-card-bg border-y border-border py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl space-y-3 mb-16">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              OUR STRENGTHS
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">넥서스가 일하는 방식과 경쟁력</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strengths.map((item, index) => (
              <div
                key={index}
                className="bg-background border border-border p-8 rounded-lg space-y-6 hover:shadow-xl hover:border-neutral-300 transition-all duration-300"
              >
                <div className="p-3 bg-card-bg inline-block rounded-lg">
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold tracking-tight">{item.title}</h3>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Workflow Process */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-2xl space-y-3 mb-16">
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
            WORK PROCESS
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">협업 프로세스</h2>
          <p className="text-sm text-neutral-400 font-light">넥서스는 투명하고 효율적인 4단계 시스템을 준수합니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processes.map((item, index) => (
            <div key={index} className="space-y-4 border-t border-border pt-6 relative">
              <span className="text-4xl font-black text-accent/20 font-mono tracking-tight block">
                {item.step}
              </span>
              <h3 className="text-base font-extrabold tracking-tight text-foreground">{item.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Action CTA */}
      <section className="bg-foreground text-background py-24 sm:py-32 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            당신의 프로젝트에 크리에이티브 시너지를 이식하세요.
          </h2>
          <div className="pt-2">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold tracking-widest text-black transition-transform duration-300 hover:scale-105"
            >
              INQUIRE NOW
              <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
