"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, getCategories, updateProject, deleteProject, hardDeleteProject } from "@/lib/db";
import { Project, Category } from "@/lib/types";
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Search, Filter } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  async function loadProjects() {
    try {
      const [projectsData, categoriesData] = await Promise.all([
        getProjects({ includeUnpublished: true }), // Include draft
        getCategories(),
      ]);
      setProjects(projectsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load admin projects list:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTogglePublished = async (id: string, currentVal: boolean) => {
    try {
      await updateProject(id, { is_published: !currentVal });
      // Update state locally
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: !currentVal } : p))
      );
    } catch (err) {
      console.error(err);
      alert("공개 상태 변경에 실패했습니다.");
    }
  };

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    try {
      await updateProject(id, { is_featured: !currentVal });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: !currentVal } : p))
      );
    } catch (err) {
      console.error(err);
      alert("대표 프로젝트 설정 변경에 실패했습니다.");
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (confirm("이 프로젝트를 비공개(Soft Delete) 처리하시겠습니까?\n방문자 화면에서 즉시 사라집니다.")) {
      try {
        await deleteProject(id);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_published: false } : p))
        );
      } catch (err) {
        console.error(err);
        alert("처리에 실패했습니다.");
      }
    }
  };

  const handleHardDelete = async (id: string) => {
    if (confirm("이 프로젝트를 영구적으로 완전 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      try {
        await hardDeleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  // Filter projects by Search and Category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategoryFilter === "all" || project.category_id === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-bold tracking-widest text-neutral-400">LOADING PORTFOLIOS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
            CMS PORTFOLIO
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">프로젝트 관리</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-accent hover:bg-blue-700 text-white font-bold text-xs tracking-widest px-4.5 py-3 rounded-lg flex items-center gap-1 transition-colors uppercase cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          신규 등록
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="제목 또는 클라이언트 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-500 hidden sm:block" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="all">모든 카테고리</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        {filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  <th className="p-4 pl-6 w-24">대표 썸네일</th>
                  <th className="p-4">프로젝트 정보</th>
                  <th className="p-4">카테고리</th>
                  <th className="p-4 text-center">공개 설정</th>
                  <th className="p-4 text-center">대표 지정</th>
                  <th className="p-4 text-right pr-6 w-40">관리 작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-xs">
                {filteredProjects.map((proj) => {
                  const cat = categories.find((c) => c.id === proj.category_id);
                  return (
                    <tr key={proj.id} className="hover:bg-neutral-950/40 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="p-4 pl-6">
                        <div className="h-12 w-16 bg-neutral-800 rounded border border-neutral-700/80 overflow-hidden relative">
                          {proj.thumbnail_url ? (
                            <img
                              src={proj.thumbnail_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[8px] text-neutral-500 flex items-center justify-center h-full">No image</span>
                          )}
                        </div>
                      </td>

                      {/* Info */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-extrabold text-neutral-200 text-sm leading-tight">
                            {proj.title}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-light">
                            <span className="font-bold text-neutral-300">{proj.client_name}</span>
                            <span>|</span>
                            <span>{proj.year}년</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-300">
                          {cat?.name || "기타"}
                        </span>
                      </td>

                      {/* Published Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePublished(proj.id, proj.is_published)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide border cursor-pointer transition-all ${
                            proj.is_published
                              ? "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                              : "bg-neutral-950 border-neutral-800 text-neutral-500"
                          }`}
                        >
                          {proj.is_published ? (
                            <>
                              <Eye className="h-3 w-3" />
                              공개중
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              비공개
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(proj.id, proj.is_featured)}
                          className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                            proj.is_featured
                              ? "bg-amber-950/20 border-amber-800 text-amber-400"
                              : "bg-neutral-950 border-neutral-800 text-neutral-600 hover:text-neutral-400"
                          }`}
                          title="대표프로젝트 여부"
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6 space-x-1.5">
                        <Link
                          href={`/admin/projects/${proj.id}`}
                          className="inline-flex p-2 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-850 transition-colors"
                          title="수정하기"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleSoftDelete(proj.id)}
                          className="p-2 bg-neutral-850 hover:bg-amber-950/30 text-neutral-400 hover:text-amber-300 rounded border border-neutral-850 hover:border-amber-900 transition-colors cursor-pointer"
                          title="임시 비공개 (Soft Delete)"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleHardDelete(proj.id)}
                          className="p-2 bg-neutral-850 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 rounded border border-neutral-850 hover:border-red-900 transition-colors cursor-pointer"
                          title="영구 삭제"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-neutral-500">
            필터 조건에 부합하는 등록된 프로젝트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
