"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById, updateProject } from "@/lib/db";
import { Project } from "@/lib/types";
import ProjectForm from "@/components/admin/ProjectForm";

export default function AdminEditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        const data = await getProjectById(id);
        if (data) {
          setProject(data);
        } else {
          alert("존재하지 않는 프로젝트입니다.");
          router.push("/admin/projects");
        }
      } catch (err) {
        console.error("Failed to load project for edit:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id, router]);

  const handleUpdate = async (formData: Omit<Project, "id" | "created_at" | "updated_at">) => {
    if (!id) return;
    try {
      await updateProject(id, formData);
      router.push("/admin/projects");
    } catch (err) {
      const error = err as Error;
      alert("프로젝트 업데이트에 실패했습니다: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-bold tracking-widest text-neutral-400">RETRIEVING RECORD...</span>
      </div>
    );
  }

  if (!project) return null;

  return (
    <ProjectForm
      initialData={project}
      onSubmit={handleUpdate}
      titleLabel={`프로젝트 수정: ${project.title}`}
    />
  );
}
