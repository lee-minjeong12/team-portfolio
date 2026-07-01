"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects, getCategories } from "@/lib/db";
import { Project } from "@/lib/types";
import PortfolioCard from "@/components/PortfolioCard";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to format YouTube Embed URLs
  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    
    // Convert watch?v=ID to embed/ID
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  useEffect(() => {
    async function loadProjectDetails() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const currentProject = await getProjectBySlug(slug);
        if (!currentProject) {
          setProject(null);
          setIsLoading(false);
          return;
        }
        setProject(currentProject);

        // Load Category Name
        const categories = await getCategories();
        const cat = categories.find((c) => c.id === currentProject.category_id);
        if (cat) {
          setCategoryName(cat.name);
        }

        // Load Related Projects (same category, excluding current)
        const allProjects = await getProjects({ includeUnpublished: false });
        const related = allProjects
          .filter((p) => p.category_id === currentProject.category_id && p.id !== currentProject.id)
          .slice(0, 3);
        setRelatedProjects(related);
      } catch (err) {
        console.error("Failed to load project detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjectDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-bold tracking-widest text-muted">LOADING PROJECT...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center space-y-6">
        <h2 className="text-2xl font-black tracking-tight">프로젝트를 찾을 수 없습니다</h2>
        <p className="text-sm text-muted max-w-sm">삭제되었거나 비공개 상태인 프로젝트입니다.</p>
        <Link
          href="/works"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold tracking-widest text-background"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          BACK TO WORKS
        </Link>
      </div>
    );
  }

  const embedVideoUrl = getEmbedVideoUrl(project.video_url);

  return (
    <div className="w-full min-h-screen">
      {/* 1. Large Cover Banner */}
      <section className="relative w-full aspect-[21/9] min-h-[300px] bg-neutral-900 overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-75"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600">
            No Cover Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-12">
          <div className="max-w-7xl mx-auto w-full space-y-2">
            <Link
              href="/works"
              className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-300 hover:text-white uppercase transition-colors mb-4"
            >
              <ArrowLeft className="h-3 w-3" />
              BACK TO ARCHIVE
            </Link>
            <span className="inline-block text-[10px] font-bold tracking-widest text-accent uppercase">
              {categoryName || "PROJECT"}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Project Metadata & Overview */}
      <section className="max-w-7xl mx-auto px-6 py-16 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          {/* Metadata Sidebar (Grid columns: 4) */}
          <div className="lg:col-span-4 space-y-8 border-l border-border pl-6 lg:order-2">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-muted uppercase block mb-2">
                CLIENT
              </span>
              <p className="text-base font-bold text-foreground">{project.client_name}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-muted uppercase block mb-2">
                YEAR
              </span>
              <p className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-400" />
                {project.year}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-muted uppercase block mb-2">
                ROLE & SCOPE
              </span>
              <p className="text-base font-bold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-neutral-400" />
                {project.role || "디자인 & 제작"}
              </p>
            </div>
          </div>

          {/* Project Details Description (Grid columns: 8) */}
          <div className="lg:col-span-8 space-y-8 lg:order-1">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                PROJECT OVERVIEW
              </span>
              <h2 className="text-2xl font-bold tracking-tight">프로젝트 소개</h2>
            </div>
            <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Embedded Video Section (If exists) */}
      {embedVideoUrl && (
        <section className="w-full bg-neutral-950 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="space-y-2 mb-8 text-center">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                VIDEO IN ACTION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">프로젝트 필름</h3>
            </div>
            <div className="relative w-full aspect-video bg-neutral-900 shadow-2xl">
              <iframe
                src={embedVideoUrl}
                title={`${project.title} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Media Gallery Showcase */}
      {project.media_urls && project.media_urls.length > 0 && (
        <section className="w-full border-t border-border py-24 bg-card-bg">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="space-y-3 mb-12">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                PROJECT MEDIA
              </span>
              <h2 className="text-2xl font-bold tracking-tight">미디어 갤러리</h2>
            </div>
            <div className="flex flex-col gap-8 sm:gap-12">
              {project.media_urls.map((url, index) => (
                <div key={index} className="w-full bg-background border border-border overflow-hidden">
                  <img
                    src={url}
                    alt={`${project.title} gallery ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Related Projects Slider/Footer */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-border py-24 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                EXPLORE MORE
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">관련 프로젝트</h2>
            </div>
            <Link
              href="/works"
              className="group inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-foreground hover:text-accent transition-colors"
            >
              ALL WORKS
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProjects.map((proj) => (
              <PortfolioCard key={proj.id} project={proj} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
