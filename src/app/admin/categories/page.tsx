"use client";

import { useEffect, useState } from "react";
import { getCategories, saveCategory, deleteCategory } from "@/lib/db";
import { Category } from "@/lib/types";
import { Plus, Trash2, Edit2, Check, X, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Category Form State
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(1);

  // Edit Category Inline State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(1);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewName(val);
    setNewSlug(generateSlug(val));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSlug) return;

    try {
      await saveCategory({
        name: newName,
        slug: newSlug,
        sort_order: Number(newSortOrder),
      });
      // Reset form
      setNewName("");
      setNewSlug("");
      setNewSortOrder(categories.length + 2);
      // Reload
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("카테고리 생성에 실패했습니다.");
    }
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditSortOrder(cat.sort_order);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName || !editSlug) return;
    try {
      await saveCategory({
        id,
        name: editName,
        slug: editSlug,
        sort_order: Number(editSortOrder),
      });
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("업데이트에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("이 카테고리를 정말 삭제하시겠습니까?\n해당 카테고리로 지정된 기존 포트폴리오의 연결 상태가 해제될 수 있습니다.")) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error(err);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-bold tracking-widest text-neutral-400">INDEXING TAXONOMIES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-6">
        <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
          CMS TAXONOMY
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">카테고리 관리</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Category List (Columns: 7) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 bg-neutral-950 border-b border-neutral-800">
            <h2 className="text-xs font-bold text-white tracking-wide uppercase">카테고리 아카이브</h2>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const isEditing = editingId === cat.id;
                return (
                  <div key={cat.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-950/20 transition-colors">
                    {isEditing ? (
                      /* Inline Editor Form */
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                          placeholder="카테고리명"
                        />
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                          placeholder="슬러그"
                        />
                        <input
                          type="number"
                          value={editSortOrder}
                          onChange={(e) => setEditSortOrder(Number(e.target.value))}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                          placeholder="순서"
                        />
                      </div>
                    ) : (
                      /* Normal Info Block */
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-neutral-950 border border-neutral-800 flex items-center justify-center rounded text-xs font-bold font-mono text-accent">
                          {cat.sort_order}
                        </div>
                        <div>
                          <p className="font-extrabold text-neutral-200 text-sm leading-tight">
                            {cat.name}
                          </p>
                          <span className="text-[10px] text-neutral-500 font-mono tracking-wider">
                            slug: {cat.slug}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdateCategory(cat.id)}
                            className="p-1.5 bg-emerald-950/20 border border-emerald-900 text-emerald-400 hover:bg-emerald-900 hover:text-white rounded transition-colors cursor-pointer"
                            title="저장"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-400 rounded border border-neutral-850 transition-colors cursor-pointer"
                            title="취소"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(cat)}
                            className="p-1.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded border border-neutral-850 transition-colors cursor-pointer"
                            title="인라인 수정"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1.5 bg-neutral-850 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 rounded border border-neutral-850 hover:border-red-900 transition-colors cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-xs text-neutral-500">
                등록된 카테고리가 없습니다. 오른편 폼에서 추가해 주세요.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Add Category Form (Columns: 5) */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl h-fit space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">신규 카테고리 등록</h2>
            <p className="text-[10px] text-neutral-400 font-light mt-1">포트폴리오 필터 탭에 즉시 연동됩니다.</p>
          </div>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                카테고리명 *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={handleNameChange}
                placeholder="예: 영상 편집"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                영어 주소 슬러그 (Slug) *
              </label>
              <input
                type="text"
                required
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="editing"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                노출 정렬 순서
              </label>
              <input
                type="number"
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
              <p className="text-[8px] text-neutral-500">필터 바에서 왼쪽에서 오른쪽으로 정렬될 순서입니다. (1, 2, 3..)</p>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-blue-700 text-white font-bold text-xs tracking-widest py-3 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              카테고리 추가
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
