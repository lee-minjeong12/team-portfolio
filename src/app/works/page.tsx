"use client";

import { useEffect, useState } from "react";
import { getCategories, getProjects } from "@/lib/db";
import { Category, Project } from "@/lib/types";
import PortfolioCard from "@/components/PortfolioCard";

export default function WorksPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [categoriesData, projectsData] = await Promise.all([
          getCategories(),
          getProjects({ includeUnpublished: false }), // only active projects
        ]);
        setCategories(categoriesData);
        setProjects(projectsData);
      } catch (err) {
        console.error("Failed to load works data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter projects by selected category locally for fast response
  const filteredProjects = selectedCategorySlug === "all"
    ? projects
    : projects.filter((project) => {
        const category = categories.find((c) => c.slug === selectedCategorySlug);
        return project.category_id === category?.id;
      });

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      {/* Page Header */}
      <div className="space-y-4 mb-16 max-w-2xl">
        <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
          OUR ARCHIVE
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          생각을 시각화한 프로젝트 목록
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 font-light leading-relaxed">
          브랜딩부터 영상 편집, 디지털 콘텐츠 디자인까지 넥서스가 수행한 다양한 필드의 작업물들을 탐색할 수 있습니다.
        </p>
      </div>

      {/* Category Navigation - Scrollable on Mobile */}
      <div className="border-b border-border mb-12 overflow-x-auto scrollbar-none">
        <div className="flex gap-8 pb-3 min-w-max">
          <button
            onClick={() => setSelectedCategorySlug("all")}
            className={`relative pb-3 text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
              selectedCategorySlug === "all" ? "text-foreground font-black" : "text-muted hover:text-foreground"
            }`}
          >
            ALL
            {selectedCategorySlug === "all" && (
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-foreground" />
            )}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`relative pb-3 text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                selectedCategorySlug === cat.slug ? "text-foreground font-black" : "text-muted hover:text-foreground"
              }`}
            >
              {cat.name}
              {selectedCategorySlug === cat.slug && (
                <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-[4/3] w-full animate-pulse bg-neutral-200" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center text-sm text-neutral-400 border border-dashed border-border bg-card-bg">
          이 카테고리에 등록된 활성 프로젝트가 없습니다.
        </div>
      )}
    </div>
  );
}
