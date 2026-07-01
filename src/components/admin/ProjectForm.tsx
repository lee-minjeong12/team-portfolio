"use client";

import { useEffect, useState } from "react";
import { getCategories, uploadMedia } from "@/lib/db";
import { Category, Project } from "@/lib/types";
import { ArrowLeft, Save, X, Upload, Link2 } from "lucide-react";
import Link from "next/link";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: Omit<Project, "id" | "created_at" | "updated_at">) => Promise<void>;
  titleLabel: string;
}

export default function ProjectForm({ initialData, onSubmit, titleLabel }: ProjectFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // Form Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [clientName, setClientName] = useState(initialData?.client_name || "");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [role, setRole] = useState(initialData?.role || "");
  const [description, setDescription] = useState(initialData?.description || "");
  
  // Media states
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialData?.media_urls || []);
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || "");

  // Flags
  const [isPublished, setIsPublished] = useState(initialData ? initialData.is_published : true);
  const [isFeatured, setIsFeatured] = useState(initialData ? initialData.is_featured : false);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 0);

  // UI Helpers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  
  // Custom URL inputs
  const [customThumbUrl, setCustomThumbUrl] = useState("");
  const [customMediaUrl, setCustomMediaUrl] = useState("");

  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories for form:", err);
      } finally {
        setIsLoadingCats(false);
      }
    }
    loadCats();
  }, [categoryId]);

  // Auto-generate slug from title (Korean / English compatibility)
  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "") // Keep alphanumeric, Korean, and spaces
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Collapse consecutive hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      setSlug(generateSlug(val));
    }
  };

  // Upload Thumbnail File Handler
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress("썸네일 업로드 중...");
    try {
      const url = await uploadMedia(file);
      setThumbnailUrl(url);
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      alert("업로드에 실패했습니다. (로컬 스토리지의 5MB 용량 초과일 수 있습니다. 직접 URL 입력을 활용해주세요.)");
    } finally {
      setUploadProgress(null);
    }
  };

  // Upload Gallery Image Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress("갤러리 이미지 업로드 중...");
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadMedia(files[i]);
        urls.push(url);
      }
      setMediaUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      console.error("Gallery upload failed:", err);
      alert("업로드에 실패했습니다. 직접 URL 입력을 병행해 주십시오.");
    } finally {
      setUploadProgress(null);
    }
  };

  const addCustomThumbUrl = () => {
    if (customThumbUrl.trim()) {
      setThumbnailUrl(customThumbUrl.trim());
      setCustomThumbUrl("");
    }
  };

  const addCustomMediaUrl = () => {
    if (customMediaUrl.trim()) {
      setMediaUrls((prev) => [...prev, customMediaUrl.trim()]);
      setCustomMediaUrl("");
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !categoryId || !clientName) {
      alert("필수 항목(*)을 기입해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        category_id: categoryId,
        client_name: clientName,
        year: Number(year),
        role,
        description,
        thumbnail_url: thumbnailUrl,
        media_urls: mediaUrls,
        video_url: videoUrl,
        is_published: isPublished,
        is_featured: isFeatured,
        sort_order: Number(sortOrder),
      };
      await onSubmit(payload);
    } catch (err) {
      const error = err as Error;
      alert(error.message || "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-10">
      {/* Form Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              CMS EDITOR
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">{titleLabel}</h1>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-blue-700 text-white font-bold text-xs tracking-widest px-6 py-3 rounded-lg flex items-center gap-1.5 transition-colors uppercase disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "SAVING..." : "저장하기"}
        </button>
      </div>

      {uploadProgress && (
        <div className="p-4 bg-accent/15 border border-accent/40 rounded-xl text-xs text-accent font-bold animate-pulse">
          {uploadProgress}
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (Input Fields) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              프로젝트 제목 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="예: 현대 모빌리티 브랜드 리브랜딩"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              웹 주소 슬러그 (Slug) *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="hyundai-mobility-rebranding"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
            <p className="text-[9px] text-neutral-500">도메인 뒤에 붙는 고유 키값입니다. 공백은 하이픈(-)으로 대체됩니다.</p>
          </div>

          {/* Client & Category & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                클라이언트사 명 *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Hyundai"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                카테고리 선택 *
              </label>
              {isLoadingCats ? (
                <div className="h-11 w-full bg-neutral-900 border border-neutral-800 rounded-lg animate-pulse" />
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                작업 연도 *
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                placeholder="2026"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Role / Scope */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              담당 역할 / 작업 범위
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="예: Brand Identity Design & Art Direction"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              상세 프로젝트 설명
            </label>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트의 배경, 과제, 적용 전술 및 성과를 한 줄 띄워 자세히 적어주세요."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Columns (Media & Switches) */}
        <div className="space-y-8">
          {/* Status Switches */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wide border-b border-neutral-800 pb-3">노출 옵션 설정</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-bold">공개 여부</span>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-accent bg-neutral-900 border-neutral-800 rounded focus:ring-accent"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-bold">대표프로젝트 여부</span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-accent bg-neutral-900 border-neutral-800 rounded focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                노출 정렬 순서
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-accent"
              />
              <p className="text-[8px] text-neutral-500">숫자가 낮을수록(예: 0, 1) 첫 페이지에 먼저 정렬됩니다.</p>
            </div>
          </div>

          {/* Thumbnail Image Picker */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wide border-b border-neutral-800 pb-3">대표 썸네일 *</h3>
            
            {thumbnailUrl && (
              <div className="relative aspect-[4/3] bg-neutral-950 border border-neutral-800 rounded overflow-hidden">
                <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="space-y-3">
              {/* Option A: File Upload */}
              <div className="relative border border-dashed border-neutral-800 rounded-lg p-4 text-center hover:bg-neutral-950/20 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-5 w-5 mx-auto text-neutral-500 mb-1.5" />
                <span className="text-[10px] text-neutral-400 font-bold block">이미지 파일 드래그 / 클릭</span>
              </div>

              {/* Option B: Direct URL Input */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-neutral-500 uppercase block">또는 외부 이미지 URL 입력</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={customThumbUrl}
                    onChange={(e) => setCustomThumbUrl(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-[10px] text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomThumbUrl}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[9px] px-2.5 rounded transition-colors"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video URL */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wide border-b border-neutral-800 pb-3 flex items-center gap-1.5">
              <Link2 className="h-4 w-4 text-neutral-400" />
              영상 재생 주소 (Video URL)
            </h3>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="예: https://www.youtube.com/watch?v=..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors"
            />
            <p className="text-[8px] text-neutral-500 leading-normal">유튜브 혹은 비메오 URL을 등록하시면 상세 페이지에 플레이어가 추가됩니다.</p>
          </div>

          {/* Additional Media Gallery */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wide border-b border-neutral-800 pb-3">미디어 갤러리 추가</h3>

            {/* List current gallery images */}
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {mediaUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square bg-neutral-950 border border-neutral-800 rounded overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(i)}
                      className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-600 rounded-full text-white transition-colors"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add inputs */}
            <div className="space-y-3 pt-2">
              <div className="relative border border-dashed border-neutral-800 rounded-lg p-3 text-center hover:bg-neutral-950/20 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-4 w-4 mx-auto text-neutral-500 mb-1" />
                <span className="text-[9px] text-neutral-400 font-bold block">멀티 파일 업로드</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-neutral-500 uppercase block">또는 외부 이미지 URL 리스트 추가</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={customMediaUrl}
                    onChange={(e) => setCustomMediaUrl(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-[10px] text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomMediaUrl}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[9px] px-2.5 rounded transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
