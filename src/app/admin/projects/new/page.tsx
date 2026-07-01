"use client";

import { useRouter } from "next/navigation";
import { createProject } from "@/lib/db";
import ProjectForm from "@/components/admin/ProjectForm";
import { Project } from "@/lib/types";

export default function AdminNewProjectPage() {
  const router = useRouter();

  const handleCreate = async (formData: Omit<Project, "id" | "created_at" | "updated_at">) => {
    try {
      await createProject(formData);
      router.push("/admin/projects");
    } catch (err) {
      const error = err as Error;
      alert("프로젝트 등록에 실패했습니다: " + error.message);
    }
  };

  return <ProjectForm onSubmit={handleCreate} titleLabel="새 프로젝트 등록" />;
}
